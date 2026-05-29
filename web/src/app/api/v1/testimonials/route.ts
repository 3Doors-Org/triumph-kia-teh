import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { z } from "zod";

import { apiError } from "@/lib/api/error-response";
import { revalidateContent } from "@/lib/cache/revalidate-content";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { assertEditorialText } from "@/lib/editorial/lint";
import { logTestimonialAudit } from "@/lib/observability/logger";
import { getClientIp } from "@/lib/security/privacy";
import { enforcePublicReadRateLimit } from "@/lib/security/rate-limit";
import { normalizePublicHttpUrl } from "@/lib/security/url";
import { parseTestimonialsListQueryFromSearchParams } from "@/lib/testimonials/filters";
import { getPublicTestimonials } from "@/lib/testimonials/queries";

function zodErrorToFields(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : "query";
    if (!(key in fields)) fields[key] = issue.message;
  }
  return fields;
}

const testimonialMutationSchema = z.object({
  authorName: z.string().trim().min(2).max(150),
  authorTitle: z.string().trim().max(200).optional().default(""),
  authorOrganization: z.string().trim().max(200).optional().default(""),
  quote: z.string().trim().min(20).max(2000),
  status: z.enum(["draft", "published"]).default("published"),
  avatarUrl: z.string().trim().url().optional().or(z.literal("")).default(""),
  sortOrder: z.coerce.number().int().min(0).max(10_000).default(0),
  isPublished: z.boolean().default(true),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = parseTestimonialsListQueryFromSearchParams(url.searchParams);
  if (!parsed.success) {
    return apiError({ error: "Validation failed", fields: zodErrorToFields(parsed.error) }, 400);
  }

  const identifier = getClientIp(request.headers) ?? "unknown";
  const rate = await enforcePublicReadRateLimit(identifier);
  if (rate && !rate.success) {
    const retryAfter = Math.max(1, Math.ceil((rate.reset - Date.now()) / 1000));
    return apiError({ error: "Too Many Requests", retryAfter }, 429, { "Retry-After": String(retryAfter) });
  }

  const { rows, nextCursor } = await getPublicTestimonials(parsed.data);
  return NextResponse.json(
    {
      data: rows.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() })),
      nextCursor,
    },
    { status: 200 },
  );
}

export async function POST(request: Request) {
  try {
    const session = await requireRole(["owner", "editor"]);
    const payload = testimonialMutationSchema.parse(await request.json());

    assertEditorialText("testimonials.authorName", payload.authorName);
    assertEditorialText("testimonials.quote", payload.quote);

    const avatarUrl = payload.avatarUrl ? normalizePublicHttpUrl(payload.avatarUrl) : null;
    if (payload.avatarUrl && !avatarUrl) {
      return apiError({ error: "Validation failed", fields: { avatarUrl: "Invalid URL" } }, 400);
    }

    const [created] = await db
      .insert(testimonials)
      .values({
        authorName: payload.authorName,
        authorTitle: payload.authorTitle || null,
        authorOrganization: payload.authorOrganization || null,
        quote: payload.quote,
        status: payload.status,
        avatarUrl,
        sortOrder: payload.sortOrder,
        isPublished: payload.isPublished,
      })
      .returning({ id: testimonials.id });

    if (created) {
      logTestimonialAudit({
        event: "testimonial_created",
        testimonialId: created.id,
        actorUserId: session.user.id,
      });
      revalidateContent("testimonials");
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return apiError({ error: "Validation failed", fields: zodErrorToFields(error) }, 400);
    }
    if (error instanceof Error && error.message.startsWith("Editorial lint failed:")) {
      return apiError({ error: error.message }, 400);
    }
    return apiError({ error: "Failed to create testimonial" }, 500);
  }
}
