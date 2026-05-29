import Link from "next/link";

import { AssetsUploadPanel } from "@/components/admin/assets-upload-panel";
import { Card } from "@/components/ui";
import { getAdminAssetsPage, parseAdminAssetsFilters } from "@/lib/admin/assets-list";
import { requireRole } from "@/lib/auth/require-role";
import { routes } from "@/lib/routes";

export default async function AssetsAdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole(["owner", "editor"]);
  const params = await searchParams;
  const filters = parseAdminAssetsFilters(new URLSearchParams(flatten(params)));
  const page = await getAdminAssetsPage(filters);

  const prevHref = page.pagination.hasPreviousPage
    ? toAssetsHref({ ...filters, page: filters.page - 1 })
    : null;
  const nextHref = page.pagination.hasNextPage
    ? toAssetsHref({ ...filters, page: filters.page + 1 })
    : null;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Assets</h1>
        <p className="text-sm text-[var(--color-muted-fg)]">
          Manage uploaded media, use filters, and copy URLs for editor integration.
        </p>
      </header>

      <AssetsUploadPanel />

      <Card>
        <form className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
          <input
            name="q"
            defaultValue={filters.q ?? ""}
            placeholder="Search filename"
            className="rounded-md border border-[var(--color-muted)] px-3 py-2 text-sm"
          />
          <input
            name="mimeType"
            defaultValue={filters.mimeType ?? ""}
            placeholder="MIME prefix (e.g. image/)"
            className="rounded-md border border-[var(--color-muted)] px-3 py-2 text-sm"
          />
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
          <h2 className="text-lg font-semibold">Library</h2>
          <p className="text-sm text-[var(--color-muted-fg)]">{page.pagination.totalRows} total</p>
        </div>
        {page.rows.length === 0 ? (
          <p className="text-sm text-[var(--color-muted-fg)]">No assets found.</p>
        ) : (
          <ul className="space-y-2">
            {page.rows.map((row) => (
              <li key={row.id} className="flex items-start justify-between gap-3 rounded-md border border-[var(--color-muted)] p-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{row.filename}</p>
                  <p className="text-xs text-[var(--color-muted-fg)]">
                    {row.mimeType} · {(row.fileSizeBytes / 1024).toFixed(1)} KB · by {row.uploadedByName}
                  </p>
                  <p className="mt-1 break-all text-xs text-[var(--color-muted-fg)]">{row.publicUrl}</p>
                </div>
                <div className="shrink-0 space-y-2">
                  <Link
                    href={row.publicUrl}
                    target="_blank"
                    className="block rounded-md border border-[var(--color-muted)] px-2 py-1 text-xs hover:bg-[var(--color-muted)]"
                  >
                    Open
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="flex items-center justify-between text-sm">
        <Link
          href={prevHref ?? routes.admin.assets}
          aria-disabled={!prevHref}
          className={`rounded-md border border-[var(--color-muted)] px-3 py-1 ${prevHref ? "hover:bg-[var(--color-muted)]" : "pointer-events-none opacity-50"}`}
        >
          Previous
        </Link>
        <p>
          Page {page.pagination.page} of {page.pagination.totalPages}
        </p>
        <Link
          href={nextHref ?? routes.admin.assets}
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
    if (typeof value === "string") output[key] = value;
    else if (Array.isArray(value) && value.length > 0) output[key] = value[0] ?? "";
  }
  return output;
}

function toAssetsHref(filters: { q?: string; mimeType?: string; page: number; limit: number }) {
  const search = new URLSearchParams();
  if (filters.q) search.set("q", filters.q);
  if (filters.mimeType) search.set("mimeType", filters.mimeType);
  search.set("page", String(filters.page));
  search.set("limit", String(filters.limit));
  return `${routes.admin.assets}?${search.toString()}`;
}
