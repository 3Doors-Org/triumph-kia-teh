import type { Metadata } from "next";

import { RevealSection } from "@/components/motion/reveal-section";
import { Card } from "@/components/ui";
import { isRevealEnabled } from "@/lib/motion/manifest";
import { buildPageMetadata } from "@/lib/seo";
import { getCachedPublicTestimonials } from "@/lib/testimonials/public-queries";

export const metadata: Metadata = buildPageMetadata({
  title: "Testimonials | Triumph Kia Teh",
  description: "Endorsements and reflections from partners, collaborators, and institutions.",
  canonicalPath: "/testimonials",
});

export default async function TestimonialsPage() {
  const { rows } = await getCachedPublicTestimonials();

  return (
    <section className="space-y-10">
      <RevealSection as="header" enabled={isRevealEnabled("testimonials", "header")} className="space-y-3">
        <h1 className="text-4xl font-semibold">Testimonials</h1>
        <p className="max-w-3xl text-(--color-muted-fg)">
          Voices from partners and collaborators on institutional work, leadership, and impact.
        </p>
      </RevealSection>

      <RevealSection as="ul" enabled={isRevealEnabled("testimonials", "results")} className="grid gap-6 md:grid-cols-2">
        {rows.length === 0 ? (
          <li className="md:col-span-2">
            <Card>
              <p className="text-sm text-(--color-muted-fg)">No testimonials are published yet.</p>
            </Card>
          </li>
        ) : (
          rows.map((item) => (
            <li key={item.id}>
              <Card className="flex h-full flex-col gap-4 p-6">
                <blockquote className="flex-1 text-base leading-relaxed text-(--color-foreground)">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <footer className="border-t border-(--color-muted)/60 pt-4 text-sm">
                  <p className="font-semibold">{item.authorName}</p>
                  {item.authorTitle || item.authorOrganization ? (
                    <p className="text-(--color-muted-fg)">
                      {[item.authorTitle, item.authorOrganization].filter(Boolean).join(" · ")}
                    </p>
                  ) : null}
                </footer>
              </Card>
            </li>
          ))
        )}
      </RevealSection>
    </section>
  );
}
