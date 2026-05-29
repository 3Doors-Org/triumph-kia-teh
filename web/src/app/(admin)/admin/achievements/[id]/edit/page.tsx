import { notFound } from "next/navigation";

import { AchievementEditorForm } from "@/components/admin/achievement-editor-form";
import { getAdminAchievementById } from "@/lib/admin/achievements-list";
import { requireRole } from "@/lib/auth/require-role";

export default async function EditAchievementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["owner", "editor"]);
  const { id } = await params;
  const item = await getAdminAchievementById(id);
  if (!item) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold">Edit Achievement</h1>
        <p className="text-sm text-[var(--color-muted-fg)]">
          Update achievement details while preserving editorial and publication controls.
        </p>
      </header>
      <AchievementEditorForm
        mode="edit"
        canDelete={session.user.role === "owner"}
        initialValues={{
          id: item.id,
          title: item.title,
          summary: item.summary,
          category: item.category,
          venue: item.venue ?? "",
          achievedAt: item.achievedAt ? item.achievedAt.toISOString().slice(0, 10) : "",
          externalUrl: item.externalUrl ?? "",
          isPublished: item.isPublished,
        }}
      />
    </section>
  );
}
