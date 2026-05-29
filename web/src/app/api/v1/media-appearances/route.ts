import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { z } from "zod";

import { apiError } from "@/lib/api/error-response";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { revalidateContent } from "@/lib/cache/revalidate-content";
import { db } from "@/lib/db";
import { mediaAppearances } from "@/lib/db/schema";
import { assertEditorialText } from "@/lib/editorial/lint";
import { parseMediaListQueryFromSearchParams } from "@/lib/media/filters";
import { decodeMediaCursor } from "@/lib/media/pagination";
import { getPublicMediaAppearances } from "@/lib/media/queries";
import { logMediaAudit } from "@/lib/observability/logger";
import { getClientIp } from "@/lib/security/privacy";
import { enforcePublicReadRateLimit } from "@/lib/security/rate-limit";
import { normalizePublicHttpUrl } from "@/lib/security/url";

function zodErrorToFields(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : "query";
    if (!(key in fields)) {
      fields[key] = issue.message;
    }
  }
  return fields;
}

const mediaMutationSchema = z.object({
  title: z.string().trim().min(3).max(220),
  outlet: z.string().trim().min(2).max(220),
  format: z.enum(["interview", "podcast", "article", "panel", "video"]),
  summary: z.string().trim().min(3).max(2000),
  externalUrl: z.string().trim().url(),
  publishedAt: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  isPublished: z.boolean().default(true),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = parseMediaListQueryFromSearchParams(url.searchParams);
  if (!parsed.success) {
    return apiError({ error: "Validation failed", fields: zodErrorToFields(parsed.error) }, 400);
  }
  if (parsed.data.cursor && !decodeMediaCursor(parsed.data.cursor)) {
    return apiError({ error: "Validation failed", fields: { cursor: "Invalid pagination cursor" } }, 400);
  }

  const identifier = getClientIp(request.headers) ?? "unknown";
  const rate = await enforcePublicReadRateLimit(identifier);
  if (rate && !rate.success) {
    const retryAfter = Math.max(1, Math.ceil((rate.reset - Date.now()) / 1000));
    return apiError(
      { error: "Too Many Requests", retryAfter },
      429,
      { "Retry-After": String(retryAfter) },
    );
  }

  const { rows, nextCursor } = await getPublicMediaAppearances(parsed.data);
  return NextResponse.json(
    {
      data: rows.map((item) => ({
        ...item,
        publishedAt: item.publishedAt?.toISOString() ?? null,
        createdAt: item.createdAt.toISOString(),
      })),
      nextCursor,
    },
    { status: 200 },
  );
}

export async function POST(request: Request) {
  try {
    const session = await requireRole(["owner", "editor"]);
    const payload = mediaMutationSchema.parse(await request.json());

    assertEditorialText("media.title", payload.title);
    assertEditorialText("media.summary", payload.summary);

    const externalUrl = normalizePublicHttpUrl(payload.externalUrl);
    if (!externalUrl) {
      return apiError({ error: "Validation failed", fields: { externalUrl: "Invalid URL" } }, 400);
    }

    const [created] = await db
      .insert(mediaAppearances)
      .values({
        title: payload.title,
        outlet: payload.outlet,
        format: payload.format,
        summary: payload.summary,
        externalUrl,
        publishedAt: payload.publishedAt ? new Date(`${payload.publishedAt}T00:00:00.000Z`) : null,
        isPublished: payload.isPublished,
      })
      .returning({ id: mediaAppearances.id });

    if (created) {
      logMediaAudit({ event: "media_created", mediaId: created.id, actorUserId: session.user.id });
      revalidateContent("mediaAppearances");
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
    return apiError({ error: "Failed to create media appearance" }, 500);
  }
}
