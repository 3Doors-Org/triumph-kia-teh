import { TestimonialEditorForm } from "@/components/admin/testimonial-editor-form";
import { requireRole } from "@/lib/auth/require-role";

export default async function NewTestimonialPage() {
  await requireRole(["owner", "editor"]);
  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold">New Testimonial</h1>
        <p className="text-sm text-(--color-muted-fg)">
          Create a new testimonial entry with moderation-ready status and visibility controls.
        </p>
      </header>
      <TestimonialEditorForm
        mode="create"
        canDelete={false}
        initialValues={{
          authorName: "",
          authorTitle: "",
          authorOrganization: "",
          quote: "",
          status: "published",
          avatarUrl: "",
          sortOrder: 0,
          isPublished: true,
        }}
      />
    </section>
  );
}
