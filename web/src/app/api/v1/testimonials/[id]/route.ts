import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/lib/api/error-response";
import { revalidateContent } from "@/lib/cache/revalidate-content";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { assertEditorialText } from "@/lib/editorial/lint";
import { logTestimonialAudit } from "@/lib/observability/logger";
import { normalizePublicHttpUrl } from "@/lib/security/url";

const routeParamsSchema = z.object({
  id: z.string().uuid(),
});

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

function zodErrorToFields(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : "payload";
    if (!(key in fields)) fields[key] = issue.message;
  }
  return fields;
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = routeParamsSchema.parse(await context.params);
    const session = await requireRole(["owner", "editor"]);
    const payload = testimonialMutationSchema.parse(await request.json());

    assertEditorialText("testimonials.authorName", payload.authorName);
    assertEditorialText("testimonials.quote", payload.quote);

    const avatarUrl = payload.avatarUrl ? normalizePublicHttpUrl(payload.avatarUrl) : null;
    if (payload.avatarUrl && !avatarUrl) {
      return apiError({ error: "Validation failed", fields: { avatarUrl: "Invalid URL" } }, 400);
    }

    const [existing] = await db
      .select({ id: testimonials.id })
      .from(testimonials)
      .where(eq(testimonials.id, params.id))
      .limit(1);
    if (!existing) return NextResponse.json({ error: "Not Found" }, { status: 404 });

    const [updated] = await db
      .update(testimonials)
      .set({
        authorName: payload.authorName,
        authorTitle: payload.authorTitle || null,
        authorOrganization: payload.authorOrganization || null,
        quote: payload.quote,
        status: payload.status,
        avatarUrl,
        sortOrder: payload.sortOrder,
        isPublished: payload.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(testimonials.id, params.id))
      .returning({ id: testimonials.id });

    if (updated) {
      logTestimonialAudit({
        event: "testimonial_updated",
        testimonialId: updated.id,
        actorUserId: session.user.id,
      });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
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
    return apiError({ error: "Failed to update testimonial" }, 500);
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = routeParamsSchema.parse(await context.params);
    const session = await requireRole(["owner"]);
    const [deleted] = await db
      .delete(testimonials)
      .where(eq(testimonials.id, params.id))
      .returning({ id: testimonials.id });
    if (!deleted) return NextResponse.json({ error: "Not Found" }, { status: 404 });

    logTestimonialAudit({
      event: "testimonial_deleted",
      testimonialId: deleted.id,
      actorUserId: session.user.id,
    });
    revalidateContent("testimonials");
    return NextResponse.json({ ok: true, deletedId: deleted.id }, { status: 200 });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return apiError({ error: "Validation failed", fields: zodErrorToFields(error) }, 400);
    }
    return apiError({ error: "Failed to delete testimonial" }, 500);
  }
}
