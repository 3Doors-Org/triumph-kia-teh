import type { Metadata } from "next";
import Link from "next/link";

import { CommunityImpactEntryCard } from "@/components/community-impact/community-impact-entry-card";
import { RevealSection } from "@/components/motion/reveal-section";
import { Card } from "@/components/ui";
import {
  buildCommunityImpactQuery,
  parseCommunityImpactCursor,
  parseCommunityImpactFilters,
} from "@/lib/community-impact/filters";
import {
  getCachedCommunityImpactFilterOptions,
  getCachedCommunityImpactPage,
  getOrganizationNamesBySlugs,
} from "@/lib/data/public-content";
import { isRevealEnabled } from "@/lib/motion/manifest";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Community Impact | Triumph Kia Teh",
  description:
    "Browse documented community impact initiatives across access, excellence, and opportunity.",
  canonicalPath: "/community-impact",
});

export default async function CommunityImpactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseCommunityImpactFilters(params);
  const cursor = parseCommunityImpactCursor(
    typeof params.cursor === "string" ? params.cursor : undefined,
  );

  const [{ entries, nextCursor }, options] = await Promise.all([
    getCachedCommunityImpactPage(filters, cursor),
    getCachedCommunityImpactFilterOptions(),
  ]);

  const orgSlugsForLabels = new Set<string>(options.orgs);
  for (const entry of entries) {
    if (entry.orgSlug) {
      orgSlugsForLabels.add(entry.orgSlug);
    }
  }
  const orgNameMap = await getOrganizationNamesBySlugs(Array.from(orgSlugsForLabels));

  return (
    <section className="space-y-10">
      <RevealSection
        as="header"
        enabled={isRevealEnabled("community-impact", "header")}
        className="space-y-8"
      >
        <h1 className="text-4xl font-semibold">Community Impact</h1>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            PROJECTS
          </p>
          <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--color-foreground)] md:text-3xl">
            Impact-Driven Initiatives
          </h2>
          <p className="mt-4 text-base text-[var(--color-muted-fg)]">
            Building solutions that create lasting change across communities and systems.
          </p>
        </div>
      </RevealSection>

      <RevealSection
        as="nav"
        enabled={false}
        aria-label="Filter community impact records"
        className="flex flex-wrap gap-2 text-sm"
      >
        <Link
          href={routes.public.communityImpact}
          className="rounded-full border px-3 py-1 hover:bg-[var(--color-muted)]"
        >
          All
        </Link>
        {options.doors.map((door) => (
          <Link
            key={door}
            href={`/community-impact${buildCommunityImpactQuery({ ...filters, door })}`}
            className="rounded-full border px-3 py-1 hover:bg-[var(--color-muted)]"
          >
            Door: {door}
          </Link>
        ))}
        {options.types.map((type) => (
          <Link
            key={type}
            href={`/community-impact${buildCommunityImpactQuery({ ...filters, type })}`}
            className="rounded-full border px-3 py-1 hover:bg-[var(--color-muted)]"
          >
            Type: {type}
          </Link>
        ))}
        {options.orgs.map((orgSlug) => (
          <Link
            key={orgSlug}
            href={`/community-impact${buildCommunityImpactQuery({ ...filters, org: orgSlug })}`}
            className="rounded-full border px-3 py-1 hover:bg-[var(--color-muted)]"
          >
            Org: {orgNameMap.get(orgSlug) ?? orgSlug}
          </Link>
        ))}
        {options.since.map((since) => (
          <Link
            key={since}
            href={`/community-impact${buildCommunityImpactQuery({ ...filters, since })}`}
            className="rounded-full border px-3 py-1 hover:bg-[var(--color-muted)]"
          >
            Since {since.slice(0, 4)}
          </Link>
        ))}
      </RevealSection>

      <div className="-mx-4 rounded-2xl bg-[var(--color-muted)]/30 px-4 py-12 md:py-16 lg:px-8">
        <RevealSection
          as="ul"
          enabled={isRevealEnabled("community-impact", "results")}
          className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2"
          aria-label="Community impact results"
        >
          {entries.length === 0 ? (
            <li className="md:col-span-2">
              <Card>
                <p className="text-sm text-[var(--color-muted-fg)]">
                  No entries match your current filters. Adjust filter values to widen results.
                </p>
              </Card>
            </li>
          ) : (
            entries.map((entry) => (
              <li key={entry.id} className="min-h-0">
                <CommunityImpactEntryCard
                  entry={entry}
                  orgDisplayName={
                    entry.orgSlug ? (orgNameMap.get(entry.orgSlug) ?? null) : null
                  }
                />
              </li>
            ))
          )}
        </RevealSection>
      </div>
      {nextCursor ? (
        <div>
          <Link
            href={`/community-impact${buildCommunityImpactQuery(filters, { cursor: nextCursor })}`}
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-[var(--color-muted)]"
          >
            Load more
          </Link>
        </div>
      ) : null}
    </section>
  );
}
