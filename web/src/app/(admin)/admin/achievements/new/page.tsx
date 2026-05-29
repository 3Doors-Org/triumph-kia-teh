import { AchievementEditorForm } from "@/components/admin/achievement-editor-form";
import { requireRole } from "@/lib/auth/require-role";

export default async function NewAchievementPage() {
  await requireRole(["owner", "editor"]);

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold">New Achievement</h1>
        <p className="text-sm text-[var(--color-muted-fg)]">
          Create a new achievement with category and year constraints.
        </p>
      </header>
      <AchievementEditorForm
        mode="create"
        canDelete={false}
        initialValues={{
          title: "",
          summary: "",
          category: "",
          venue: "",
          achievedAt: "",
          externalUrl: "",
          isPublished: true,
        }}
      />
    </section>
  );
}
