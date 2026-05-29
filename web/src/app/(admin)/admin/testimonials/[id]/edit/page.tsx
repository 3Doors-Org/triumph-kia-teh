import { notFound } from "next/navigation";

import { TestimonialEditorForm } from "@/components/admin/testimonial-editor-form";
import { getAdminTestimonialById } from "@/lib/admin/testimonials-list";
import { requireRole } from "@/lib/auth/require-role";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["owner", "editor"]);
  const { id } = await params;
  const item = await getAdminTestimonialById(id);
  if (!item) notFound();

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold">Edit Testimonial</h1>
        <p className="text-sm text-(--color-muted-fg)">Update testimonial content and publication controls.</p>
      </header>
      <TestimonialEditorForm
        mode="edit"
        canDelete={session.user.role === "owner"}
        initialValues={{
          id: item.id,
          authorName: item.authorName,
          authorTitle: item.authorTitle ?? "",
          authorOrganization: item.authorOrganization ?? "",
          quote: item.quote,
          status: item.status as "draft" | "published",
          avatarUrl: item.avatarUrl ?? "",
          sortOrder: item.sortOrder,
          isPublished: item.isPublished,
        }}
      />
    </section>
  );
}
