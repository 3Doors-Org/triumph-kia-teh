import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/lib/api/error-response";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { revalidateContent } from "@/lib/cache/revalidate-content";
import { db } from "@/lib/db";
import { achievements } from "@/lib/db/schema";
import { assertEditorialText } from "@/lib/editorial/lint";
import { logAchievementAudit } from "@/lib/observability/logger";

const routeParamsSchema = z.object({
  id: z.string().uuid(),
});

const achievementsMutationSchema = z.object({
  title: z.string().trim().min(3).max(220),
  summary: z.string().trim().min(3).max(2000),
  category: z.string().trim().min(2).max(80),
  venue: z.string().trim().max(200).optional().default(""),
  achievedAt: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  externalUrl: z.string().trim().url().optional().or(z.literal("")).default(""),
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
    const payload = achievementsMutationSchema.parse(await request.json());

    assertEditorialText("achievements.title", payload.title);
    assertEditorialText("achievements.summary", payload.summary);

    const [existing] = await db
      .select({ id: achievements.id })
      .from(achievements)
      .where(eq(achievements.id, params.id))
      .limit(1);
    if (!existing) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const [updated] = await db
      .update(achievements)
      .set({
        title: payload.title,
        summary: payload.summary,
        category: payload.category,
        venue: payload.venue || null,
        achievedAt: payload.achievedAt ? new Date(`${payload.achievedAt}T00:00:00.000Z`) : null,
        externalUrl: payload.externalUrl || null,
        isPublished: payload.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(achievements.id, params.id))
      .returning({ id: achievements.id });

    if (updated) {
      logAchievementAudit({
        event: "achievement_updated",
        achievementId: updated.id,
        actorUserId: session.user.id,
      });
      revalidateContent("achievements");
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
    return apiError({ error: "Failed to update achievement" }, 500);
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = routeParamsSchema.parse(await context.params);
    const session = await requireRole(["owner"]);
    const [deleted] = await db
      .delete(achievements)
      .where(eq(achievements.id, params.id))
      .returning({ id: achievements.id });

    if (!deleted) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    logAchievementAudit({
      event: "achievement_deleted",
      achievementId: deleted.id,
      actorUserId: session.user.id,
    });
    revalidateContent("achievements");
    return NextResponse.json({ ok: true, deletedId: deleted.id }, { status: 200 });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return apiError({ error: "Validation failed", fields: zodErrorToFields(error) }, 400);
    }
    return apiError({ error: "Failed to delete achievement" }, 500);
  }
}
