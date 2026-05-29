import { OrganizationEditorForm } from "@/components/admin/organization-editor-form";
import { requireRole } from "@/lib/auth/require-role";

export default async function NewOrganizationPage() {
  await requireRole(["owner", "editor"]);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-(--color-muted-fg)">Site content</p>
        <h1 className="text-3xl font-semibold">New organization</h1>
      </header>
      <OrganizationEditorForm
        mode="create"
        initialValues={{ slug: "", name: "", door: "INSTITUTION", mission: "", externalUrl: "" }}
      />
    </section>
  );
}
