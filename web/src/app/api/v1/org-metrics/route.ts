import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/lib/api/error-response";
import { listOrgMetricsForAdmin } from "@/lib/admin/org-metrics-list";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { db } from "@/lib/db";
import { orgMetrics, organizations } from "@/lib/db/schema";
import { assertEditorialText } from "@/lib/editorial/lint";
import { logOrgMetricAudit } from "@/lib/observability/logger";

const orgMetricCreateSchema = z.object({
  orgId: z.string().uuid().optional().nullable(),
  label: z.string().trim().min(2).max(120),
  value: z.coerce.number().int().min(0).max(2_147_483_647),
  suffix: z.string().trim().max(30).default("+"),
  sortOrder: z.coerce.number().int().min(0).max(10_000).default(0),
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
  if (orgSlug) targets.add(`/organizations/${orgSlug}`);
  for (const path of targets) revalidatePath(path);
}

export async function GET() {
  try {
    await requireRole(["owner", "editor"]);
    const rows = await listOrgMetricsForAdmin();

    return NextResponse.json({
      data: rows.map((row) => ({
        id: row.id,
        organization: row.orgName
          ? { id: row.orgId, slug: row.orgSlug, name: row.orgName }
          : null,
        label: row.label,
        value: row.value,
        suffix: row.suffix,
        sortOrder: row.sortOrder,
        updatedAt: row.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireRole(["owner", "editor"]);
    const payload = orgMetricCreateSchema.parse(await request.json());

    assertEditorialText("org_metric.label", payload.label);

    const orgId = payload.orgId ?? null;
    if (orgId) {
      const [org] = await db.select({ id: organizations.id }).from(organizations).where(eq(organizations.id, orgId)).limit(1);
      if (!org) {
        return apiError({ error: "Validation failed", fields: { orgId: "Organization not found" } }, 400);
      }
    }

    const [created] = await db
      .insert(orgMetrics)
      .values({
        orgId,
        label: payload.label,
        value: payload.value,
        suffix: payload.suffix,
        sortOrder: payload.sortOrder,
      })
      .returning({ id: orgMetrics.id, orgId: orgMetrics.orgId });

    if (created) {
      logOrgMetricAudit({ event: "org_metric_created", metricId: created.id, actorUserId: session.user.id });
      const orgSlug = await resolveOrgSlug(created.orgId ?? null);
      revalidateOrgMetricPaths(orgSlug);
    }

    return NextResponse.json({ ok: true, id: created?.id ?? null }, { status: 201 });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      const fields: Record<string, string> = {};
      for (const issue of error.issues) {
        const key = issue.path.length > 0 ? String(issue.path[0]) : "payload";
        if (!(key in fields)) fields[key] = issue.message;
      }
      return apiError({ error: "Validation failed", fields }, 400);
    }
    return apiError({ error: "Failed to create metric" }, 500);
  }
}
