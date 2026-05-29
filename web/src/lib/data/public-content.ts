import { and, asc, desc, eq, gte, inArray, lt, or } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import {
  COMMUNITY_IMPACT_DOOR_VALUES,
  COMMUNITY_IMPACT_PUBLIC_PAGE_SIZE,
  type CommunityImpactFilters,
} from "@/lib/community-impact/filters";
import { parseCommunityImpactMetrics } from "@/lib/community-impact/metrics";
import { postsPublishedWhere } from "@/lib/writing/published";
import {
  decodeCommunityImpactCursor,
  encodeCommunityImpactCursor,
} from "@/lib/community-impact/pagination";
import { CONTENT_TAGS } from "@/lib/cache/revalidate-content";
import { db } from "@/lib/db";
import { communityImpactEntries, orgMetrics, organizations, posts, siteProfile } from "@/lib/db/schema";

export async function getHomeData() {
  try {
    const [metrics, featuredOrganizations, featuredWriting] = await Promise.all([
      db.select().from(orgMetrics).orderBy(asc(orgMetrics.sortOrder)).limit(4),
      db.select().from(organizations).orderBy(asc(organizations.name)).limit(3),
      db
        .select({
          title: posts.title,
          slug: posts.slug,
          summary: posts.summary,
          door: posts.door,
        })
        .from(posts)
        .where(postsPublishedWhere())
        .orderBy(desc(posts.publishedAt))
        .limit(3),
    ]);

    let portraitPublicUrl: string | null = null;
    try {
      const [row] = await db
        .select({ portraitPublicUrl: siteProfile.portraitPublicUrl })
        .from(siteProfile)
        .where(eq(siteProfile.id, 1))
        .limit(1);
      portraitPublicUrl = row?.portraitPublicUrl ?? null;
    } catch {
      portraitPublicUrl = null;
    }

    return { metrics, featuredOrganizations, featuredWriting, portraitPublicUrl };
  } catch {
    return {
      metrics: [],
      featuredOrganizations: [],
      featuredWriting: [],
      portraitPublicUrl: null as string | null,
    };
  }
}

export async function getOrganizationsOverview() {
  try {
    return await db.select().from(organizations).orderBy(asc(organizations.name));
  } catch {
    return [];
  }
}

export async function getOrganizationBySlug(slug: string) {
  let organization;
  try {
    [organization] = await db.select().from(organizations).where(eq(organizations.slug, slug)).limit(1);
  } catch {
    return null;
  }

  if (!organization) {
    return null;
  }

  try {
    const [metrics, relatedWriting] = await Promise.all([
      db.select().from(orgMetrics).where(eq(orgMetrics.orgId, organization.id)).orderBy(asc(orgMetrics.sortOrder)),
      db
        .select({
          title: posts.title,
          slug: posts.slug,
          summary: posts.summary,
          door: posts.door,
        })
        .from(posts)
        .where(postsPublishedWhere())
        .orderBy(desc(posts.publishedAt))
        .limit(3),
    ]);

    return { organization, metrics, relatedWriting };
  } catch {
    return { organization, metrics: [], relatedWriting: [] };
  }
}

export async function getCommunityImpactPage(filters: CommunityImpactFilters, cursor?: string) {
  const predicates = [eq(communityImpactEntries.isPublished, true)];

  if (filters.door) {
    predicates.push(eq(communityImpactEntries.door, filters.door));
  }
  if (filters.type) {
    predicates.push(eq(communityImpactEntries.type, filters.type));
  }
  if (filters.org) {
    predicates.push(eq(communityImpactEntries.orgSlug, filters.org));
  }
  if (filters.since) {
    const sinceDate = new Date(filters.since);
    if (!Number.isNaN(sinceDate.getTime())) {
      predicates.push(gte(communityImpactEntries.startDate, sinceDate));
    }
  }
  if (cursor) {
    const decoded = decodeCommunityImpactCursor(cursor);
    if (decoded) {
      predicates.push(
        or(
          lt(communityImpactEntries.createdAt, new Date(decoded.createdAt)),
          and(
            eq(communityImpactEntries.createdAt, new Date(decoded.createdAt)),
            lt(communityImpactEntries.id, decoded.id),
          ),
        )!,
      );
    }
  }

  try {
    const rows = await db
      .select()
      .from(communityImpactEntries)
      .where(and(...predicates))
      .orderBy(desc(communityImpactEntries.createdAt), desc(communityImpactEntries.id))
      .limit(COMMUNITY_IMPACT_PUBLIC_PAGE_SIZE + 1);

    const hasMore = rows.length > COMMUNITY_IMPACT_PUBLIC_PAGE_SIZE;
    const entries = (hasMore ? rows.slice(0, COMMUNITY_IMPACT_PUBLIC_PAGE_SIZE) : rows).map((row) => ({
      ...row,
      metrics: parseCommunityImpactMetrics({
        label: row.metricLabel,
        value: row.metricValue,
        suffix: "+",
      }),
    }));
    const tail = entries.at(-1);

    return {
      entries,
      nextCursor: hasMore && tail
        ? encodeCommunityImpactCursor({
            createdAt: tail.createdAt.toISOString(),
            id: tail.id,
          })
        : null,
    };
  } catch {
    return { entries: [], nextCursor: null };
  }
}

export async function getCommunityImpact(filters: CommunityImpactFilters) {
  const { entries } = await getCommunityImpactPage(filters);
  return entries;
}

export async function getCommunityImpactFilterOptions() {
  let entries: Array<{ door: string; type: string; org: string | null; startDate: Date | null }> = [];
  try {
    entries = await db
      .select({
        door: communityImpactEntries.door,
        type: communityImpactEntries.type,
        org: communityImpactEntries.orgSlug,
        startDate: communityImpactEntries.startDate,
      })
      .from(communityImpactEntries)
      .where(eq(communityImpactEntries.isPublished, true));
  } catch {
    entries = [];
  }

  return {
    doors: COMMUNITY_IMPACT_DOOR_VALUES.filter((door) => entries.some((entry) => entry.door === door)),
    types: Array.from(new Set(entries.map((entry) => entry.type))).sort(),
    orgs: Array.from(new Set(entries.map((entry) => entry.org).filter(Boolean) as string[])).sort(),
    since: Array.from(
      new Set(
        entries
          .map((entry) =>
            entry.startDate ? `${entry.startDate.getUTCFullYear()}-01-01` : null,
          )
          .filter(Boolean) as string[],
      ),
    ).sort().reverse(),
  };
}

export const getCachedCommunityImpactPage = unstable_cache(
  async (filters: CommunityImpactFilters, cursor?: string) => getCommunityImpactPage(filters, cursor),
  ["community-impact-page"],
  { tags: [CONTENT_TAGS.communityImpact], revalidate: 300 },
);

export const getCachedCommunityImpactFilterOptions = unstable_cache(
  async () => getCommunityImpactFilterOptions(),
  ["community-impact-filter-options"],
  { tags: [CONTENT_TAGS.communityImpact], revalidate: 300 },
);

export async function getOrganizationNamesBySlugs(slugs: string[]) {
  if (slugs.length === 0) {
    return new Map<string, string>();
  }

  let rows: Array<{ slug: string; name: string }> = [];
  try {
    rows = await db
      .select({ slug: organizations.slug, name: organizations.name })
      .from(organizations)
      .where(inArray(organizations.slug, slugs));
  } catch {
    rows = [];
  }

  return new Map(rows.map((row) => [row.slug, row.name]));
}
