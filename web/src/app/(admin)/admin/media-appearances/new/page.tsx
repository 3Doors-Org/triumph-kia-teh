import { MediaEditorForm } from "@/components/admin/media-editor-form";
import { requireRole } from "@/lib/auth/require-role";

export default async function NewMediaAppearancePage() {
  await requireRole(["owner", "editor"]);
  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold">New Media Appearance</h1>
        <p className="text-sm text-(--color-muted-fg)">Create a new media entry with validated links and publication controls.</p>
      </header>
      <MediaEditorForm
        mode="create"
        canDelete={false}
        initialValues={{
          title: "",
          outlet: "",
          format: "article",
          summary: "",
          externalUrl: "",
          publishedAt: "",
          isPublished: true,
        }}
      />
    </section>
  );
}
