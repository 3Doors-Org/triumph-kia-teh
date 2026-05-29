import { notFound } from "next/navigation";

import { WritingEditorForm } from "@/components/admin/writing-editor-form";
import { requireRole } from "@/lib/auth/require-role";
import { bodyJsonToPlainText, getAdminWritingPostBySlug } from "@/lib/admin/writing-editor";

export default async function EditWritingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireRole(["owner", "editor"]);
  const { slug } = await params;
  const cleanSlug = slug.trim().toLowerCase();
  const post = await getAdminWritingPostBySlug(cleanSlug);
  if (!post) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold">Edit Writing Post</h1>
        <p className="text-sm text-[var(--color-muted-fg)]">Update metadata, body content, and publication status.</p>
      </header>
      <WritingEditorForm
        mode="edit"
        initialValues={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          summary: post.summary ?? "",
          door: post.door ?? "",
          tags: post.tags.join(","),
          bodyText: bodyJsonToPlainText(post.bodyJson),
          status: post.status === "published" ? "published" : "draft",
        }}
      />
    </section>
  );
}
