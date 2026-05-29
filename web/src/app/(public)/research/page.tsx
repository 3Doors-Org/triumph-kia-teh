import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ExternalLink } from "lucide-react";

import { RevealSection } from "@/components/motion/reveal-section";
import { Card } from "@/components/ui";
import { isRevealEnabled } from "@/lib/motion/manifest";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";
import { getCachedResearchPage } from "@/lib/research/queries";

export const metadata: Metadata = buildPageMetadata({
  title: "Research | Triumph Kia Teh",
  description: "Research outputs, working papers, and policy-oriented analysis.",
  canonicalPath: "/research",
});

export default async function ResearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;
  const { rows } = await getCachedResearchPage();

  return (
    <section className="-mx-4 bg-muted/30 px-4 py-10 md:rounded-2xl md:px-6 md:py-12">
      <RevealSection as="header" enabled={isRevealEnabled("research", "header")} className="mb-8 space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-accent)">Research</p>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-(--color-muted-fg)">
          Rigorous studies and analytical models focused on decision systems, institutional behavior, and social
          outcomes.
        </p>
      </RevealSection>

      <RevealSection
        as="ul"
        enabled={isRevealEnabled("research", "results")}
        className="mx-auto grid w-full max-w-5xl gap-6 pb-8 md:grid-cols-2 md:gap-8 md:pb-12"
        aria-label="Research results"
      >
        {rows.length === 0 ? (
          <li className="md:col-span-2">
            <Card>
              <p className="text-sm text-(--color-muted-fg)">No research items available yet.</p>
            </Card>
          </li>
        ) : (
          rows.map((row) => (
            <li key={row.id} className="h-full">
              <Card className="flex h-full flex-col rounded-2xl border-(--color-muted) p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-(--color-accent)">
                    <BookOpen size={24} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-(--color-accent)">{row.venue ?? "Research"}</p>
                    <p className="text-sm text-(--color-muted-fg)">{formatDate(row.publishedAt ?? row.createdAt)}</p>
                  </div>
                </div>

                <h2
                  style={{ fontFamily: "var(--font-display)" }}
                  className="mt-4 text-[1.5rem] font-semibold leading-[1.4] text-(--color-foreground)"
                >
                  <Link href={routes.public.researchBySlug(row.slug)} className="hover:underline">
                    {row.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 text-base leading-relaxed text-(--color-muted-fg)">{row.summary}</p>

                {row.externalUrl ? (
                  <a
                    href={row.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--color-accent)" }}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                  >
                    View external research <ExternalLink size={14} />
                  </a>
                ) : (
                  <Link
                    href={routes.public.researchBySlug(row.slug)}
                    style={{ color: "var(--color-accent)" }}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                  >
                    Read more
                  </Link>
                )}
              </Card>
            </li>
          ))
        )}
      </RevealSection>
    </section>
  );
}

function formatDate(value: Date | string): string {
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(parsed);
}
