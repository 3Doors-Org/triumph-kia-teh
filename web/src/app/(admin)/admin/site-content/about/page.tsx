import { AboutPageEditorForm } from "@/components/admin/about-page-editor-form";
import { requireRole } from "@/lib/auth/require-role";
import { getAboutPageContent } from "@/lib/about/queries";

export default async function SiteContentAboutPage() {
  await requireRole(["owner", "editor"]);
  const content = await getAboutPageContent();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-(--color-muted-fg)">Site content</p>
        <h1 className="text-3xl font-semibold">About page</h1>
        <p className="max-w-2xl text-sm text-(--color-muted-fg)">
          Changes publish to the public About page. The explore section at the bottom stays in code.
        </p>
      </header>
      <AboutPageEditorForm initialContent={content} />
    </section>
  );
}
