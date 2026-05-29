import { notFound } from "next/navigation";

import { ResearchEditorForm } from "@/components/admin/research-editor-form";
import { requireRole } from "@/lib/auth/require-role";
import { getAdminResearchBySlug } from "@/lib/admin/research-list";

export default async function EditResearchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireRole(["owner", "editor"]);
  const { slug } = await params;
  const cleanSlug = slug.trim().toLowerCase();
  const item = await getAdminResearchBySlug(cleanSlug);
  if (!item) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold">Edit Research Item</h1>
        <p className="text-sm text-[var(--color-muted-fg)]">Update research metadata and publication controls.</p>
      </header>
      <ResearchEditorForm
        mode="edit"
        initialValues={{
          id: item.id,
          title: item.title,
          slug: item.slug,
          summary: item.summary,
          abstract: item.abstract,
          authors: item.authors.join(", "),
          venue: item.venue ?? "",
          status: item.status as "published" | "in_progress" | "working_paper",
          externalUrl: item.externalUrl ?? "",
          isPublished: item.isPublished,
        }}
      />
    </section>
  );
}
