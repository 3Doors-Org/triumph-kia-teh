import { WritingEditorForm } from "@/components/admin/writing-editor-form";
import { requireRole } from "@/lib/auth/require-role";

export default async function NewWritingPage() {
  await requireRole(["owner", "editor"]);

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold">New Writing Post</h1>
        <p className="text-sm text-[var(--color-muted-fg)]">Create a draft or publish immediately.</p>
      </header>
      <WritingEditorForm
        mode="create"
        initialValues={{
          title: "",
          slug: "",
          summary: "",
          door: "",
          tags: "",
          bodyText: "",
          status: "draft",
        }}
      />
    </section>
  );
}
