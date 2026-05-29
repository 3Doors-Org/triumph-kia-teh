import { ResearchEditorForm } from "@/components/admin/research-editor-form";
import { requireRole } from "@/lib/auth/require-role";

export default async function NewResearchPage() {
  await requireRole(["owner", "editor"]);

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold">New Research Item</h1>
        <p className="text-sm text-[var(--color-muted-fg)]">Create a new research record and control publication state.</p>
      </header>
      <ResearchEditorForm
        mode="create"
        initialValues={{
          title: "",
          slug: "",
          summary: "",
          abstract: "",
          authors: "",
          venue: "",
          status: "published",
          externalUrl: "",
          isPublished: true,
        }}
      />
    </section>
  );
}
