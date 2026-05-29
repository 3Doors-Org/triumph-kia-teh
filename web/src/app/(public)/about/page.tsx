import type { Metadata } from "next";
import Link from "next/link";

import { EducationSection } from "@/components/about/education-section";
import { PathOfPurposeJourney } from "@/components/about/path-of-purpose-journey";
import { RevealSection } from "@/components/motion/reveal-section";
import { Card } from "@/components/ui";
import { getCachedAboutPageContent } from "@/lib/about/queries";
import { isRevealEnabled } from "@/lib/motion/manifest";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About | Triumph Kia Teh",
  description: "Background, path of purpose, institutional focus, and organizations.",
  canonicalPath: "/about",
});

export default async function AboutPage() {
  const content = await getCachedAboutPageContent();

  return (
    <article className="space-y-10">
      <RevealSection
        as="header"
        enabled={isRevealEnabled("about", "header")}
        className="space-y-4 border-b border-[var(--color-muted)]/40 pb-8"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">{content.hero.eyebrow}</p>
        <h1 className="text-2xl font-semibold leading-snug text-[var(--color-foreground)] md:text-3xl">{content.hero.name}</h1>
        <p className="max-w-3xl text-lg leading-relaxed text-[var(--color-muted-fg)] md:text-xl">{content.hero.intro}</p>
      </RevealSection>

      <PathOfPurposeJourney journey={content.journey} />

      <EducationSection education={content.education} />

      <RevealSection
        as="section"
        enabled={isRevealEnabled("about", "body")}
        aria-labelledby="institutional-focus-heading"
        className="-mx-4 lg:mx-0"
      >
        <div className="overflow-hidden rounded-2xl border border-[var(--color-muted)] bg-[var(--color-card)] shadow-md ring-1 ring-[var(--color-muted)]/60">
          <div className="border-b border-[var(--color-muted)]/80 bg-[color-mix(in_srgb,var(--color-muted)_45%,var(--color-card))] px-6 py-5 md:px-10 md:py-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
              {content.institutional.practiceLabel}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-muted-fg)] md:text-base">
              {content.institutional.practiceIntro}
            </p>
          </div>

          <div className="border-l-[3px] border-l-[var(--color-accent)] px-6 py-8 md:px-10 md:py-10">
            <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-[var(--color-muted-fg)] prose-headings:text-[var(--color-foreground)] first:prose-h2:mt-0 prose-h2:mt-12 prose-h2:mb-4 prose-h2:font-[var(--font-display)] prose-h2:text-2xl prose-h2:font-semibold md:prose-h2:text-3xl">
              {content.institutional.sections.map((section) => (
                <section key={section.heading}>
                  <h2 id={slugifyHeading(section.heading)}>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection
        as="section"
        enabled={isRevealEnabled("about", "explore")}
        className="space-y-4 border-t border-[var(--color-muted)]/40 pt-8"
      >
        <h2 className="text-2xl font-semibold">Continue exploring</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="text-lg font-medium">
              <Link className="hover:underline" href={routes.public.organizations}>
                Organizations
              </Link>
            </h3>
            <p className="text-sm text-[var(--color-muted-fg)]">
              Institutional profiles and mandates across the platform ecosystem.
            </p>
          </Card>
          <Card>
            <h3 className="text-lg font-medium">
              <Link className="hover:underline" href={routes.public.writing}>
                Writing
              </Link>
            </h3>
            <p className="text-sm text-[var(--color-muted-fg)]">
              Long-form essays on implementation, systems, and leadership.
            </p>
          </Card>
          <Card>
            <h3 className="text-lg font-medium">
              <Link className="hover:underline" href={routes.public.contact}>
                Contact
              </Link>
            </h3>
            <p className="text-sm text-[var(--color-muted-fg)]">
              Start a speaking, research, or partnership conversation.
            </p>
          </Card>
        </div>
      </RevealSection>
    </article>
  );
}

function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
