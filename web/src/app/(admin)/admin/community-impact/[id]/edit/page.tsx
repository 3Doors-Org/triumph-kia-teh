import { notFound } from "next/navigation";

import { CommunityImpactEditorForm } from "@/components/admin/community-impact-editor-form";
import { getAdminCommunityImpactById } from "@/lib/admin/community-impact-list";
import { requireRole } from "@/lib/auth/require-role";

export default async function EditCommunityImpactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["owner", "editor"]);
  const { id } = await params;
  const item = await getAdminCommunityImpactById(id);
  if (!item) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold">Edit Community Impact Entry</h1>
        <p className="text-sm text-[var(--color-muted-fg)]">
          Update impact narrative, metric values, and publication state.
        </p>
      </header>
      <CommunityImpactEditorForm
        mode="edit"
        canDelete={session.user.role === "owner"}
        initialValues={{
          id: item.id,
          title: item.title,
          summary: item.summary,
          door: item.door as "ACCESS" | "EXCELLENCE" | "OPPORTUNITY",
          type: item.type,
          metricLabel: item.metricLabel,
          metricValue: item.metricValue,
          orgSlug: item.orgSlug ?? "",
          startDate: item.startDate ? item.startDate.toISOString().slice(0, 10) : "",
          isPublished: item.isPublished,
        }}
      />
    </section>
  );
}
