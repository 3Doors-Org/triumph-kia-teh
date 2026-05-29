import { CommunityImpactEditorForm } from "@/components/admin/community-impact-editor-form";
import { requireRole } from "@/lib/auth/require-role";

export default async function NewCommunityImpactPage() {
  await requireRole(["owner", "editor"]);

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold">New Community Impact Entry</h1>
        <p className="text-sm text-[var(--color-muted-fg)]">
          Create a new impact entry with structured metric fields and publication controls.
        </p>
      </header>
      <CommunityImpactEditorForm
        mode="create"
        canDelete={false}
        initialValues={{
          title: "",
          summary: "",
          door: "ACCESS",
          type: "",
          metricLabel: "",
          metricValue: 0,
          orgSlug: "",
          startDate: "",
          isPublished: true,
        }}
      />
    </section>
  );
}
