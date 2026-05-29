import Link from "next/link";

import { Card } from "@/components/ui";
import { getAdminCommunityImpactPage, parseAdminCommunityImpactFilters } from "@/lib/admin/community-impact-list";
import { requireRole } from "@/lib/auth/require-role";
import { COMMUNITY_IMPACT_DOOR_VALUES } from "@/lib/community-impact/filters";
import { routes } from "@/lib/routes";

export default async function CommunityImpactAdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole(["owner", "editor"]);
  const params = await searchParams;
  const filters = parseAdminCommunityImpactFilters(new URLSearchParams(flatten(params)));
  const page = await getAdminCommunityImpactPage(filters);

  const prevHref = page.pagination.hasPreviousPage
    ? toCommunityImpactHref({ ...filters, page: filters.page - 1 })
    : null;
  const nextHref = page.pagination.hasNextPage
    ? toCommunityImpactHref({ ...filters, page: filters.page + 1 })
    : null;
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Community Impact</h1>
        <p className="text-sm text-(--color-muted-fg)">Manage measurable impact entries and publication state.</p>
        <Link
          href={`${routes.admin.impact}/new`}
          className="inline-flex rounded-md border border-(--color-muted) px-3 py-1 text-sm hover:bg-(--color-muted)"
        >
          New impact entry
        </Link>
      </header>

      <Card>
        <form className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
          <input
            name="q"
            defaultValue={filters.q ?? ""}
            placeholder="Search title, summary, or type"
            className="rounded-md border border-(--color-muted) px-3 py-2 text-sm"
          />
          <select
            name="door"
            defaultValue={filters.door ?? ""}
            className="rounded-md border border-(--color-muted) px-3 py-2 text-sm"
          >
            <option value="">All doors</option>
            {COMMUNITY_IMPACT_DOOR_VALUES.map((door) => (
              <option key={door} value={door}>
                {door}
              </option>
            ))}
          </select>
          <select
            name="status"
            defaultValue={filters.status ?? ""}
            className="rounded-md border border-(--color-muted) px-3 py-2 text-sm"
          >
            <option value="">All states</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
          </select>
          <button
            type="submit"
            className="rounded-md border border-(--color-muted) px-4 py-2 text-sm hover:bg-(--color-muted)"
          >
            Apply
          </button>
        </form>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Impact entries</h2>
          <p className="text-sm text-(--color-muted-fg)">{page.pagination.totalRows} total</p>
        </div>
        {page.rows.length === 0 ? (
          <p className="text-sm text-(--color-muted-fg)">No impact entries match this filter.</p>
        ) : (
          <ul className="space-y-2">
            {page.rows.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 rounded-md border border-(--color-muted) p-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{row.title}</p>
                  <p className="text-xs text-(--color-muted-fg)">
                    {row.metricLabel}: {row.metricValue}
                  </p>
                  <Link
                    href={`${routes.admin.impact}/${encodeURIComponent(row.id)}/edit`}
                    className="text-xs text-(--color-accent) hover:underline"
                  >
                    Edit
                  </Link>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs uppercase tracking-wide text-(--color-muted-fg)">{row.door}</p>
                  <p className="mt-1 text-xs text-(--color-muted-fg)">{row.isPublished ? "published" : "hidden"}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="flex items-center justify-between text-sm">
        <Link
          href={prevHref ?? routes.admin.impact}
          aria-disabled={!prevHref}
          className={`rounded-md border border-(--color-muted) px-3 py-1 ${prevHref ? "hover:bg-(--color-muted)" : "pointer-events-none opacity-50"}`}
        >
          Previous
        </Link>
        <p>
          Page {page.pagination.page} of {page.pagination.totalPages}
        </p>
        <Link
          href={nextHref ?? routes.admin.impact}
          aria-disabled={!nextHref}
          className={`rounded-md border border-(--color-muted) px-3 py-1 ${nextHref ? "hover:bg-(--color-muted)" : "pointer-events-none opacity-50"}`}
        >
          Next
        </Link>
      </div>
    </section>
  );
}

function flatten(params: Record<string, string | string[] | undefined>): Record<string, string> {
  const output: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      output[key] = value;
    } else if (Array.isArray(value) && value.length > 0) {
      output[key] = value[0] ?? "";
    }
  }
  return output;
}

function toCommunityImpactHref(filters: {
  q?: string;
  door?: "ACCESS" | "EXCELLENCE" | "OPPORTUNITY";
  status?: "published" | "hidden";
  page: number;
  limit: number;
}) {
  const search = new URLSearchParams();
  if (filters.q) search.set("q", filters.q);
  if (filters.door) search.set("door", filters.door);
  if (filters.status) search.set("status", filters.status);
  search.set("page", String(filters.page));
  search.set("limit", String(filters.limit));
  return `${routes.admin.impact}?${search.toString()}`;
}
