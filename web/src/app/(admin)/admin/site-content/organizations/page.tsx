import Link from "next/link";

import { listOrganizationsForAdmin } from "@/lib/admin/organizations-list";
import { requireRole } from "@/lib/auth/require-role";
import { routes } from "@/lib/routes";
import { organizationPublicProfilePath } from "@/lib/organizations/slugs";

export default async function SiteContentOrganizationsPage() {
  await requireRole(["owner", "editor"]);
  const rows = await listOrganizationsForAdmin();

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-(--color-muted-fg)">Site content</p>
          <h1 className="text-3xl font-semibold">Organizations</h1>
          <p className="text-sm text-(--color-muted-fg)">Profiles power /organizations and organization cards on the home page.</p>
        </div>
        <Link
          href={routes.admin.siteContentOrganizationNew}
          className="rounded-md border border-(--color-muted) px-4 py-2 text-sm hover:bg-(--color-muted)"
        >
          New organization
        </Link>
      </header>

      {rows.length === 0 ? (
        <p className="text-sm text-(--color-muted-fg)">No organizations yet.</p>
      ) : (
        <ul className="divide-y rounded-lg border border-(--color-muted)">
          {rows.map((row) => (
            <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-(--color-muted-fg)">
                  {row.door} ·{" "}
                  <Link href={organizationPublicProfilePath(row.slug)} className="underline" target="_blank" rel="noreferrer">
                    /organizations/{row.slug}
                  </Link>
                </p>
              </div>
              <Link
                href={routes.admin.siteContentOrganizationEdit(row.id)}
                className="text-(--color-accent) hover:underline"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
