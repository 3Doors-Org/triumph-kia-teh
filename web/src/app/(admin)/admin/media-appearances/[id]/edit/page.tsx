import { notFound } from "next/navigation";

import { MediaEditorForm } from "@/components/admin/media-editor-form";
import { getAdminMediaById } from "@/lib/admin/media-list";
import { requireRole } from "@/lib/auth/require-role";
import { MEDIA_FORMAT_VALUES } from "@/lib/media/filters";

export default async function EditMediaAppearancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["owner", "editor"]);
  const { id } = await params;
  const item = await getAdminMediaById(id);
  if (!item) notFound();

  const safeFormat = MEDIA_FORMAT_VALUES.includes(item.format as (typeof MEDIA_FORMAT_VALUES)[number])
    ? (item.format as (typeof MEDIA_FORMAT_VALUES)[number])
    : "article";

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold">Edit Media Appearance</h1>
        <p className="text-sm text-(--color-muted-fg)">Update appearance metadata and publication state.</p>
      </header>
      <MediaEditorForm
        mode="edit"
        canDelete={session.user.role === "owner"}
        initialValues={{
          id: item.id,
          title: item.title,
          outlet: item.outlet,
          format: safeFormat,
          summary: item.summary,
          externalUrl: item.externalUrl,
          publishedAt: item.publishedAt ? item.publishedAt.toISOString().slice(0, 10) : "",
          isPublished: item.isPublished,
        }}
      />
    </section>
  );
}
