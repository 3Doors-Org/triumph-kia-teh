import Link from "next/link";

import { Card } from "@/components/ui";
import { requireRole } from "@/lib/auth/require-role";
import { routes } from "@/lib/routes";

const siteContentLinks = [
  {
    title: "About page",
    description: "Hero, path of purpose timeline, education, and institutional focus sections.",
    href: routes.admin.siteContentAbout,
  },
  {
    title: "Organizations",
    description: "Institutional profiles shown on /organizations and linked across the site.",
    href: routes.admin.siteContentOrganizations,
  },
  {
    title: "Testimonials",
    description: "Quotes and endorsements. Published items appear on the public testimonials page.",
    href: routes.admin.testimonials,
  },
  {
    title: "Impact metrics",
    description: "Homepage and organization metric cards. Create and edit values here.",
    href: routes.admin.metrics,
  },
] as const;

export default async function SiteContentAdminPage() {
  await requireRole(["owner", "editor"]);

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-(--color-accent)">Phase 2</p>
        <h1 className="text-3xl font-semibold">Site content</h1>
        <p className="max-w-2xl text-sm text-(--color-muted-fg)">
          Editorial surfaces for the About page, organizations, testimonials, and homepage metrics. Writing,
          research, achievements, and community impact remain in their dedicated admin sections.
        </p>
      </header>

      <ul className="grid gap-4 md:grid-cols-2">
        {siteContentLinks.map((item) => (
          <li key={item.href}>
            <Card className="h-full space-y-3 p-6">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-sm text-(--color-muted-fg)">{item.description}</p>
              <Link href={item.href} className="text-sm font-medium text-(--color-accent) hover:underline">
                Open editor
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
