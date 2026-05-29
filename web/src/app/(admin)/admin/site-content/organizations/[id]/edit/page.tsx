import { notFound } from "next/navigation";

import { OrganizationEditorForm } from "@/components/admin/organization-editor-form";
import { getAdminOrganizationById } from "@/lib/admin/organizations-list";
import { requireRole } from "@/lib/auth/require-role";

export default async function EditOrganizationPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["owner", "editor"]);
  const { id } = await params;
  const organization = await getAdminOrganizationById(id);

  if (!organization) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-(--color-muted-fg)">Site content</p>
        <h1 className="text-3xl font-semibold">Edit {organization.name}</h1>
      </header>
      <OrganizationEditorForm
        mode="edit"
        initialValues={{
          id: organization.id,
          slug: organization.slug,
          name: organization.name,
          door: organization.door,
          mission: organization.mission,
          externalUrl: organization.externalUrl ?? "",
        }}
      />
    </section>
  );
}
