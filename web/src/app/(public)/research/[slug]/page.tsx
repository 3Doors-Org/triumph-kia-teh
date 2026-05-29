import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ScrollDepthTracker } from "@/components/analytics/scroll-depth-tracker";
import { RevealSection } from "@/components/motion/reveal-section";
import { Card } from "@/components/ui";
import { isRevealEnabled } from "@/lib/motion/manifest";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";
import { getCachedPublishedResearchSlugs, getCachedResearchBySlug } from "@/lib/research/queries";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getCachedPublishedResearchSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCachedResearchBySlug(slug.trim().toLowerCase());
  if (!item) {
    return buildPageMetadata({
      title: "Research | Triumph Kia Teh",
      description: "Research outputs, working papers, and policy-oriented analysis.",
      canonicalPath: routes.public.research,
    });
  }

  return buildPageMetadata({
    title: `${item.title} | Triumph Kia Teh`,
    description: item.summary,
    canonicalPath: routes.public.researchBySlug(item.slug),
  });
}

export default async function ResearchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getCachedResearchBySlug(slug.trim().toLowerCase());
  if (!item) {
    notFound();
  }

  return (
    <section className="space-y-8">
      <ScrollDepthTracker contentId={`research:${item.slug}`} eventProps={{ content_type: "research_detail" }} />
      <RevealSection
        as="header"
        enabled={isRevealEnabled("research-detail", "header")}
        className="space-y-3 border-b border-[var(--color-muted)]/40 pb-6"
      >
        <p className="text-xs uppercase tracking-wide text-[var(--color-muted-fg)]">{item.status.replaceAll("_", " ")}</p>
        <h1 className="text-4xl font-semibold">{item.title}</h1>
        <p className="max-w-3xl text-[var(--color-muted-fg)]">{item.summary}</p>
        <p className="text-sm text-[var(--color-muted-fg)]">Authors: {item.authors.join(", ")}</p>
        {item.venue ? <p className="text-sm text-[var(--color-muted-fg)]">Venue: {item.venue}</p> : null}
      </RevealSection>

      <RevealSection
        as="article"
        enabled={isRevealEnabled("research-detail", "abstract")}
        className="max-w-3xl space-y-4"
      >
        <h2 className="text-2xl font-semibold">Abstract</h2>
        <p className="leading-8 text-[var(--color-foreground)]">{item.abstract}</p>
      </RevealSection>

      {item.externalUrl ? (
        <RevealSection as="section" enabled={isRevealEnabled("research-detail", "external")}>
          <Card>
            <a
              href={item.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              View external research link
            </a>
          </Card>
        </RevealSection>
      ) : null}

      <Link href={routes.public.research} className="inline-flex text-sm underline hover:no-underline">
        Back to research index
      </Link>
    </section>
  );
}
