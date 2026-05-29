import Link from "next/link";

import type { OrgMetricRow } from "@/components/admin/org-metrics-table";
import { OrgMetricsTable } from "@/components/admin/org-metrics-table";
import { listOrgMetricsForAdmin } from "@/lib/admin/org-metrics-list";
import { requireRole } from "@/lib/auth/require-role";
import { routes } from "@/lib/routes";

export default async function MetricsAdminPage() {
  await requireRole(["owner", "editor"]);
  const rows = await listOrgMetricsForAdmin();
  const serialized: OrgMetricRow[] = rows.map((row) => ({
    id: row.id,
    organization: row.orgName,
    label: row.label,
    value: row.value,
    suffix: row.suffix,
    sortOrder: row.sortOrder,
    updatedAt: row.updatedAt.toISOString(),
  }));

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Metrics</h1>
          <p className="text-sm text-(--color-muted-fg)">
            Home and organization profile cards read from these records. Values must stay within safe integer
            bounds; last editor wins on concurrent saves.
          </p>
        </div>
        <Link
          href={routes.admin.metricsNew}
          className="rounded-md border border-(--color-muted) px-4 py-2 text-sm hover:bg-(--color-muted)"
        >
          New metric
        </Link>
      </header>
      <OrgMetricsTable rows={serialized} />
    </section>
  );
}
