import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/lib/api/error-response";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { revalidateContent } from "@/lib/cache/revalidate-content";
import { db } from "@/lib/db";
import { mediaAppearances } from "@/lib/db/schema";
import { assertEditorialText } from "@/lib/editorial/lint";
import { logMediaAudit } from "@/lib/observability/logger";
import { normalizePublicHttpUrl } from "@/lib/security/url";

const routeParamsSchema = z.object({
  id: z.string().uuid(),
});

const mediaMutationSchema = z.object({
  title: z.string().trim().min(3).max(220),
  outlet: z.string().trim().min(2).max(220),
  format: z.enum(["interview", "podcast", "article", "panel", "video"]),
  summary: z.string().trim().min(3).max(2000),
  externalUrl: z.string().trim().url(),
  publishedAt: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
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
    const payload = mediaMutationSchema.parse(await request.json());

    assertEditorialText("media.title", payload.title);
    assertEditorialText("media.summary", payload.summary);

    const externalUrl = normalizePublicHttpUrl(payload.externalUrl);
    if (!externalUrl) {
      return apiError({ error: "Validation failed", fields: { externalUrl: "Invalid URL" } }, 400);
    }

    const [existing] = await db
      .select({ id: mediaAppearances.id })
      .from(mediaAppearances)
      .where(eq(mediaAppearances.id, params.id))
      .limit(1);
    if (!existing) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const [updated] = await db
      .update(mediaAppearances)
      .set({
        title: payload.title,
        outlet: payload.outlet,
        format: payload.format,
        summary: payload.summary,
        externalUrl,
        publishedAt: payload.publishedAt ? new Date(`${payload.publishedAt}T00:00:00.000Z`) : null,
        isPublished: payload.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(mediaAppearances.id, params.id))
      .returning({ id: mediaAppearances.id });

    if (updated) {
      logMediaAudit({ event: "media_updated", mediaId: updated.id, actorUserId: session.user.id });
      revalidateContent("mediaAppearances");
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
    return apiError({ error: "Failed to update media appearance" }, 500);
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = routeParamsSchema.parse(await context.params);
    const session = await requireRole(["owner"]);
    const [deleted] = await db
      .delete(mediaAppearances)
      .where(eq(mediaAppearances.id, params.id))
      .returning({ id: mediaAppearances.id });
    if (!deleted) return NextResponse.json({ error: "Not Found" }, { status: 404 });

    logMediaAudit({ event: "media_deleted", mediaId: deleted.id, actorUserId: session.user.id });
    revalidateContent("mediaAppearances");
    return NextResponse.json({ ok: true, deletedId: deleted.id }, { status: 200 });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return apiError({ error: "Validation failed", fields: zodErrorToFields(error) }, 400);
    }
    return apiError({ error: "Failed to delete media appearance" }, 500);
  }
}
