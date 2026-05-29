import { OrgMetricCreateForm } from "@/components/admin/org-metric-create-form";
import { listOrganizationsForAdmin } from "@/lib/admin/organizations-list";
import { requireRole } from "@/lib/auth/require-role";

export default async function NewMetricPage() {
  await requireRole(["owner", "editor"]);
  const organizations = await listOrganizationsForAdmin();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">New metric</h1>
        <p className="text-sm text-(--color-muted-fg)">
          Site-wide metrics appear on the home page. Organization metrics appear on that organization&apos;s profile.
        </p>
      </header>
      <OrgMetricCreateForm
        organizations={organizations.map((org) => ({ id: org.id, name: org.name, slug: org.slug }))}
      />
    </section>
  );
}
