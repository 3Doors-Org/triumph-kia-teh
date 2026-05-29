import Link from "next/link";

import { Card } from "@/components/ui";
import { requireRole } from "@/lib/auth/require-role";
import { parseAdminWritingFilters, getAdminWritingPage } from "@/lib/admin/writing-list";
import { routes } from "@/lib/routes";

export default async function WritingAdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole(["owner", "editor"]);
  const params = await searchParams;
  const filters = parseAdminWritingFilters(new URLSearchParams(flatten(params)));
  const page = await getAdminWritingPage(filters);

  const prevHref = page.pagination.hasPreviousPage
    ? toAdminWritingHref({ ...filters, page: filters.page - 1 })
    : null;
  const nextHref = page.pagination.hasNextPage
    ? toAdminWritingHref({ ...filters, page: filters.page + 1 })
    : null;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Writing</h1>
        <p className="text-sm text-[var(--color-muted-fg)]">
          Manage draft and published writing with secure server-side filtering and pagination.
        </p>
        <Link
          href={`${routes.admin.writing}/new`}
          className="inline-flex rounded-md border border-[var(--color-muted)] px-3 py-1 text-sm hover:bg-[var(--color-muted)]"
        >
          New post
        </Link>
      </header>

      <Card>
        <form className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
          <input
            name="q"
            defaultValue={filters.q ?? ""}
            placeholder="Search by title or slug"
            className="rounded-md border border-[var(--color-muted)] px-3 py-2 text-sm"
          />
          <select
            name="status"
            defaultValue={filters.status ?? ""}
            className="rounded-md border border-[var(--color-muted)] px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            type="submit"
            className="rounded-md border border-[var(--color-muted)] px-4 py-2 text-sm hover:bg-[var(--color-muted)]"
          >
            Apply
          </button>
        </form>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Posts</h2>
          <p className="text-sm text-[var(--color-muted-fg)]">{page.pagination.totalRows} total</p>
        </div>
        {page.rows.length === 0 ? (
          <p className="text-sm text-[var(--color-muted-fg)]">No posts match this filter.</p>
        ) : (
          <ul className="space-y-2">
            {page.rows.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 rounded-md border border-[var(--color-muted)] p-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{row.title}</p>
                  <p className="text-xs text-[var(--color-muted-fg)]">/{row.slug}</p>
                  <Link
                    href={`${routes.admin.writing}/${encodeURIComponent(row.slug)}/edit`}
                    className="text-xs text-[var(--color-accent)] hover:underline"
                  >
                    Edit
                  </Link>
                </div>
                <div className="shrink-0 text-right">
                  <span className="rounded-full border border-[var(--color-muted)] px-2 py-0.5 text-xs uppercase tracking-wide">
                    {row.status}
                  </span>
                  <p className="mt-1 text-xs text-[var(--color-muted-fg)]">
                    {toDate(row.updatedAt)?.toLocaleDateString() ?? "Unknown"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="flex items-center justify-between text-sm">
        <Link
          href={prevHref ?? routes.admin.writing}
          aria-disabled={!prevHref}
          className={`rounded-md border border-[var(--color-muted)] px-3 py-1 ${prevHref ? "hover:bg-[var(--color-muted)]" : "pointer-events-none opacity-50"}`}
        >
          Previous
        </Link>
        <p>
          Page {page.pagination.page} of {page.pagination.totalPages}
        </p>
        <Link
          href={nextHref ?? routes.admin.writing}
          aria-disabled={!nextHref}
          className={`rounded-md border border-[var(--color-muted)] px-3 py-1 ${nextHref ? "hover:bg-[var(--color-muted)]" : "pointer-events-none opacity-50"}`}
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

function toAdminWritingHref(filters: {
  q?: string;
  status?: "draft" | "published";
  page: number;
  limit: number;
}) {
  const search = new URLSearchParams();
  if (filters.q) {
    search.set("q", filters.q);
  }
  if (filters.status) {
    search.set("status", filters.status);
  }
  search.set("page", String(filters.page));
  search.set("limit", String(filters.limit));
  return `${routes.admin.writing}?${search.toString()}`;
}

function toDate(value: Date | string | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
