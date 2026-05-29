import Link from "next/link";

import { Card } from "@/components/ui";
import { getAdminAchievementsPage, parseAdminAchievementsFilters } from "@/lib/admin/achievements-list";
import { requireRole } from "@/lib/auth/require-role";
import { routes } from "@/lib/routes";

export default async function AchievementsAdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole(["owner", "editor"]);
  const params = await searchParams;
  const filters = parseAdminAchievementsFilters(new URLSearchParams(flatten(params)));
  const page = await getAdminAchievementsPage(filters);

  const prevHref = page.pagination.hasPreviousPage
    ? toAchievementsHref({ ...filters, page: filters.page - 1 })
    : null;
  const nextHref = page.pagination.hasNextPage
    ? toAchievementsHref({ ...filters, page: filters.page + 1 })
    : null;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Achievements</h1>
        <p className="text-sm text-(--color-muted-fg)">Manage verified achievements with year/category controls.</p>
        <Link
          href={`${routes.admin.achievements}/new`}
          className="inline-flex rounded-md border border-(--color-muted) px-3 py-1 text-sm hover:bg-(--color-muted)"
        >
          New achievement
        </Link>
      </header>

      <Card>
        <form className="grid gap-3 md:grid-cols-[1fr_220px_140px_180px_auto]">
          <input
            name="q"
            defaultValue={filters.q ?? ""}
            placeholder="Search title, summary, category"
            className="rounded-md border border-(--color-muted) px-3 py-2 text-sm"
          />
          <select
            name="category"
            defaultValue={filters.category ?? ""}
            className="rounded-md border border-(--color-muted) px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            {page.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            name="year"
            defaultValue={filters.year ? String(filters.year) : ""}
            placeholder="Year"
            inputMode="numeric"
            pattern="[0-9]{4}"
            className="rounded-md border border-(--color-muted) px-3 py-2 text-sm"
          />
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
          <h2 className="text-lg font-semibold">Achievements</h2>
          <p className="text-sm text-(--color-muted-fg)">{page.pagination.totalRows} total</p>
        </div>
        {page.rows.length === 0 ? (
          <p className="text-sm text-(--color-muted-fg)">No achievements match this filter.</p>
        ) : (
          <ul className="space-y-2">
            {page.rows.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 rounded-md border border-(--color-muted) p-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{row.title}</p>
                  <p className="text-xs text-(--color-muted-fg)">{row.category}</p>
                  <Link
                    href={`${routes.admin.achievements}/${encodeURIComponent(row.id)}/edit`}
                    className="text-xs text-(--color-accent) hover:underline"
                  >
                    Edit
                  </Link>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-(--color-muted-fg)">
                    {row.achievedAt ? row.achievedAt.toLocaleDateString() : "No date"}
                  </p>
                  <p className="mt-1 text-xs text-(--color-muted-fg)">{row.isPublished ? "published" : "hidden"}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="flex items-center justify-between text-sm">
        <Link
          href={prevHref ?? routes.admin.achievements}
          aria-disabled={!prevHref}
          className={`rounded-md border border-(--color-muted) px-3 py-1 ${prevHref ? "hover:bg-(--color-muted)" : "pointer-events-none opacity-50"}`}
        >
          Previous
        </Link>
        <p>
          Page {page.pagination.page} of {page.pagination.totalPages}
        </p>
        <Link
          href={nextHref ?? routes.admin.achievements}
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

function toAchievementsHref(filters: {
  q?: string;
  category?: string;
  year?: number;
  status?: "published" | "hidden";
  page: number;
  limit: number;
}) {
  const search = new URLSearchParams();
  if (filters.q) search.set("q", filters.q);
  if (filters.category) search.set("category", filters.category);
  if (filters.year) search.set("year", String(filters.year));
  if (filters.status) search.set("status", filters.status);
  search.set("page", String(filters.page));
  search.set("limit", String(filters.limit));
  return `${routes.admin.achievements}?${search.toString()}`;
}
