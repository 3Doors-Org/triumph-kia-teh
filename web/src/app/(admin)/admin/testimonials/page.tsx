import Link from "next/link";

import { Card } from "@/components/ui";
import { getAdminTestimonialsPage, parseAdminTestimonialsFilters } from "@/lib/admin/testimonials-list";
import { requireRole } from "@/lib/auth/require-role";
import { routes } from "@/lib/routes";

export default async function TestimonialsAdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole(["owner", "editor"]);
  const params = await searchParams;
  const filters = parseAdminTestimonialsFilters(new URLSearchParams(flatten(params)));
  const page = await getAdminTestimonialsPage(filters);

  const prevHref = page.pagination.hasPreviousPage
    ? toTestimonialsHref({ ...filters, page: filters.page - 1 })
    : null;
  const nextHref = page.pagination.hasNextPage
    ? toTestimonialsHref({ ...filters, page: filters.page + 1 })
    : null;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Testimonials</h1>
        <p className="text-sm text-(--color-muted-fg)">Manage quote moderation, author metadata, and publish controls.</p>
        <Link
          href={`${routes.admin.testimonials}/new`}
          className="inline-flex rounded-md border border-(--color-muted) px-3 py-1 text-sm hover:bg-(--color-muted)"
        >
          New testimonial
        </Link>
      </header>

      <Card>
        <form className="grid gap-3 md:grid-cols-[1fr_170px_170px_auto]">
          <input
            name="q"
            defaultValue={filters.q ?? ""}
            placeholder="Search author, organization, quote"
            className="rounded-md border border-(--color-muted) px-3 py-2 text-sm"
          />
          <select
            name="status"
            defaultValue={filters.status ?? ""}
            className="rounded-md border border-(--color-muted) px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
          <select
            name="visibility"
            defaultValue={filters.visibility ?? ""}
            className="rounded-md border border-(--color-muted) px-3 py-2 text-sm"
          >
            <option value="">All visibility</option>
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
          <h2 className="text-lg font-semibold">Testimonials</h2>
          <p className="text-sm text-(--color-muted-fg)">{page.pagination.totalRows} total</p>
        </div>
        {page.rows.length === 0 ? (
          <p className="text-sm text-(--color-muted-fg)">No testimonials match this filter.</p>
        ) : (
          <ul className="space-y-2">
            {page.rows.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 rounded-md border border-(--color-muted) p-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{row.authorName}</p>
                  <p className="text-xs text-(--color-muted-fg)">{row.authorOrganization ?? "No organization"}</p>
                  <Link
                    href={`${routes.admin.testimonials}/${encodeURIComponent(row.id)}/edit`}
                    className="text-xs text-(--color-accent) hover:underline"
                  >
                    Edit
                  </Link>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs uppercase tracking-wide text-(--color-muted-fg)">{row.status}</p>
                  <p className="mt-1 text-xs text-(--color-muted-fg)">{row.isPublished ? "published" : "hidden"}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="flex items-center justify-between text-sm">
        <Link
          href={prevHref ?? routes.admin.testimonials}
          aria-disabled={!prevHref}
          className={`rounded-md border border-(--color-muted) px-3 py-1 ${prevHref ? "hover:bg-(--color-muted)" : "pointer-events-none opacity-50"}`}
        >
          Previous
        </Link>
        <p>
          Page {page.pagination.page} of {page.pagination.totalPages}
        </p>
        <Link
          href={nextHref ?? routes.admin.testimonials}
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
    if (typeof value === "string") output[key] = value;
    else if (Array.isArray(value) && value.length > 0) output[key] = value[0] ?? "";
  }
  return output;
}

function toTestimonialsHref(filters: {
  q?: string;
  status?: "draft" | "published";
  visibility?: "published" | "hidden";
  page: number;
  limit: number;
}) {
  const search = new URLSearchParams();
  if (filters.q) search.set("q", filters.q);
  if (filters.status) search.set("status", filters.status);
  if (filters.visibility) search.set("visibility", filters.visibility);
  search.set("page", String(filters.page));
  search.set("limit", String(filters.limit));
  return `${routes.admin.testimonials}?${search.toString()}`;
}
