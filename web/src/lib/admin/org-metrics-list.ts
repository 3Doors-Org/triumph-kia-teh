import { asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { orgMetrics, organizations } from "@/lib/db/schema";

export async function listOrgMetricsForAdmin() {
  const rows = await db
    .select({
      id: orgMetrics.id,
      orgId: orgMetrics.orgId,
      orgSlug: organizations.slug,
      orgName: organizations.name,
      label: orgMetrics.label,
      value: orgMetrics.value,
      suffix: orgMetrics.suffix,
      sortOrder: orgMetrics.sortOrder,
      updatedAt: orgMetrics.updatedAt,
    })
    .from(orgMetrics)
    .leftJoin(organizations, eq(orgMetrics.orgId, organizations.id))
    .orderBy(asc(orgMetrics.sortOrder));

  return rows;
}
