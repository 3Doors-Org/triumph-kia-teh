import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

import { apiError } from "@/lib/api/error-response";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { db } from "@/lib/db";
import { orgMetrics, organizations } from "@/lib/db/schema";
import { assertEditorialText } from "@/lib/editorial/lint";
import { logOrgMetricAudit } from "@/lib/observability/logger";

const routeParamsSchema = z.object({
  id: z.string().uuid(),
});

const orgMetricPatchSchema = z
  .object({
    label: z.string().trim().min(2).max(120),
    value: z.coerce.number().int().min(0).max(2_147_483_647),
    suffix: z.string().trim().max(30),
    sortOrder: z.coerce.number().int().min(0).max(10_000),
  })
  .strict()
  .partial()
  .refine((patch) => Object.keys(patch).length > 0, {
    message: "At least one field is required",
  });

async function resolveOrgSlug(orgId: string | null): Promise<string | null> {
  if (!orgId) return null;
  const [org] = await db
    .select({ slug: organizations.slug })
    .from(organizations)
    .where(eq(organizations.id, orgId))
    .limit(1);
  return org?.slug ?? null;
}

function revalidateOrgMetricPaths(orgSlug: string | null): void {
  const targets = new Set(["/", "/organizations"]);
  if (orgSlug) {
    targets.add(`/organizations/${orgSlug}`);
  }
  for (const path of targets) {
    revalidatePath(path);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole(["owner", "editor"]);
    const params = routeParamsSchema.parse(await context.params);
    const body = orgMetricPatchSchema.parse(await request.json());

    const [existing] = await db
      .select({
        id: orgMetrics.id,
        orgId: orgMetrics.orgId,
      })
      .from(orgMetrics)
      .where(eq(orgMetrics.id, params.id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    if (body.label) {
      assertEditorialText("org_metric.label", body.label);
    }

    const [updated] = await db
      .update(orgMetrics)
      .set({
        ...(body.label !== undefined ? { label: body.label } : {}),
        ...(body.value !== undefined ? { value: body.value } : {}),
        ...(body.suffix !== undefined ? { suffix: body.suffix } : {}),
        ...(body.sortOrder !== undefined ? { sortOrder: body.sortOrder } : {}),
        updatedAt: new Date(),
      })
      .where(eq(orgMetrics.id, params.id))
      .returning({
        id: orgMetrics.id,
        orgId: orgMetrics.orgId,
        label: orgMetrics.label,
        value: orgMetrics.value,
        suffix: orgMetrics.suffix,
        sortOrder: orgMetrics.sortOrder,
        updatedAt: orgMetrics.updatedAt,
      });

    let orgSlug: string | null = null;
    if (updated) {
      logOrgMetricAudit({ event: "org_metric_updated", metricId: updated.id, actorUserId: session.user.id });
      orgSlug = await resolveOrgSlug(updated.orgId ?? null);
      revalidateOrgMetricPaths(orgSlug);
    }

    return NextResponse.json({
      id: updated!.id,
      orgSlug,
      label: updated!.label,
      value: updated!.value,
      suffix: updated!.suffix,
      sortOrder: updated!.sortOrder,
      updatedAt: updated!.updatedAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof ZodError) {
      const fields: Record<string, string> = {};
      for (const issue of error.issues) {
        const key = issue.path.length > 0 ? String(issue.path[0]) : "payload";
        if (!(key in fields)) fields[key] = issue.message;
      }
      return apiError({ error: "Validation failed", fields }, 400);
    }
    throw error;
  }
}
