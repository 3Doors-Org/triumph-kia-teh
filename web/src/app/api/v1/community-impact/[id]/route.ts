import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/lib/api/error-response";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { revalidateContent } from "@/lib/cache/revalidate-content";
import { COMMUNITY_IMPACT_DOOR_VALUES } from "@/lib/community-impact/filters";
import { db } from "@/lib/db";
import { communityImpactEntries } from "@/lib/db/schema";
import { assertEditorialText } from "@/lib/editorial/lint";
import { logCommunityImpactAudit } from "@/lib/observability/logger";

const routeParamsSchema = z.object({
  id: z.string().uuid(),
});

const communityImpactMutationSchema = z.object({
  title: z.string().trim().min(3).max(180),
  summary: z.string().trim().min(3).max(2000),
  door: z.enum(COMMUNITY_IMPACT_DOOR_VALUES),
  type: z.string().trim().min(2).max(50),
  metric: z.object({
    label: z.string().trim().min(2).max(100),
    value: z.coerce.number().int().min(0).max(10_000_000),
  }),
  orgSlug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(64)
    .optional()
    .or(z.literal("")),
  startDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
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
    const payload = communityImpactMutationSchema.parse(await request.json());

    assertEditorialText("communityImpact.title", payload.title);
    assertEditorialText("communityImpact.summary", payload.summary);
    assertEditorialText("communityImpact.metric.label", payload.metric.label);

    const [existing] = await db
      .select({ id: communityImpactEntries.id })
      .from(communityImpactEntries)
      .where(eq(communityImpactEntries.id, params.id))
      .limit(1);
    if (!existing) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const [updated] = await db
      .update(communityImpactEntries)
      .set({
        title: payload.title,
        summary: payload.summary,
        door: payload.door,
        type: payload.type,
        metricLabel: payload.metric.label,
        metricValue: payload.metric.value,
        orgSlug: payload.orgSlug || null,
        startDate: payload.startDate ? new Date(`${payload.startDate}T00:00:00.000Z`) : null,
        isPublished: payload.isPublished,
      })
      .where(eq(communityImpactEntries.id, params.id))
      .returning({ id: communityImpactEntries.id });

    if (updated) {
      logCommunityImpactAudit({
        event: "impact_updated",
        impactId: updated.id,
        actorUserId: session.user.id,
      });
      revalidateContent("communityImpact");
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
    return apiError({ error: "Failed to update community impact entry" }, 500);
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = routeParamsSchema.parse(await context.params);
    const session = await requireRole(["owner"]);
    const [deleted] = await db
      .delete(communityImpactEntries)
      .where(eq(communityImpactEntries.id, params.id))
      .returning({ id: communityImpactEntries.id });

    if (!deleted) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    logCommunityImpactAudit({
      event: "impact_deleted",
      impactId: deleted.id,
      actorUserId: session.user.id,
    });
    revalidateContent("communityImpact");
    return NextResponse.json({ ok: true, deletedId: deleted.id }, { status: 200 });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return apiError({ error: "Validation failed", fields: zodErrorToFields(error) }, 400);
    }
    return apiError({ error: "Failed to delete community impact entry" }, 500);
  }
}
