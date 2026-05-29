import { and, count, desc, eq, lt, or } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { CONTENT_TAGS } from "@/lib/cache/revalidate-content";
import { db } from "@/lib/db";
import { researchItems } from "@/lib/db/schema";

import type { ResearchStatus } from "./filters";
import { RESEARCH_PUBLIC_PAGE_SIZE } from "./filters";
import { decodeResearchCursor, encodeResearchCursor } from "./pagination";

export type ResearchListItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  authors: string[];
  venue: string | null;
  status: string;
  externalUrl: string | null;
  publishedAt: Date | null;
  createdAt: Date;
};

export type ResearchDetail = ResearchListItem & {
  abstract: string;
  updatedAt: Date;
};

function publicResearchWhere(status?: ResearchStatus) {
  return and(eq(researchItems.isPublished, true), status ? eq(researchItems.status, status) : undefined);
}

export async function getResearchPage(options?: {
  status?: ResearchStatus;
  cursor?: string;
  limit?: number;
}): Promise<{ rows: ResearchListItem[]; nextCursor: string | null; total: number }> {
  const limit = Math.min(Math.max(options?.limit ?? RESEARCH_PUBLIC_PAGE_SIZE, 1), 100);
  const decodedCursor = options?.cursor ? decodeResearchCursor(options.cursor) : null;

  const where = and(
    publicResearchWhere(options?.status),
    decodedCursor
      ? or(
          lt(researchItems.createdAt, new Date(decodedCursor.createdAt)),
          and(eq(researchItems.createdAt, new Date(decodedCursor.createdAt)), lt(researchItems.id, decodedCursor.id)),
        )
      : undefined,
  );

  let countRow: Array<{ value: number | bigint }> = [];
  let rows: Array<Omit<ResearchListItem, "authors"> & { authors: string[] | null }> = [];
  try {
    [countRow, rows] = await Promise.all([
      db.select({ value: count() }).from(researchItems).where(publicResearchWhere(options?.status)),
      db
        .select({
          id: researchItems.id,
          slug: researchItems.slug,
          title: researchItems.title,
          summary: researchItems.summary,
          authors: researchItems.authors,
          venue: researchItems.venue,
          status: researchItems.status,
          externalUrl: researchItems.externalUrl,
          publishedAt: researchItems.publishedAt,
          createdAt: researchItems.createdAt,
        })
        .from(researchItems)
        .where(where)
        .orderBy(desc(researchItems.createdAt), desc(researchItems.id))
        .limit(limit + 1),
    ]);
  } catch {
    return { rows: [], nextCursor: null, total: 0 };
  }

  const hasMore = rows.length > limit;
  const sliced = hasMore ? rows.slice(0, limit) : rows;
  const tail = sliced.at(-1);

  const nextCursor =
    hasMore && tail
      ? encodeResearchCursor({ createdAt: tail.createdAt.toISOString(), id: tail.id })
      : null;

  return {
    rows: sliced.map((row) => ({ ...row, authors: row.authors ?? [] })),
    nextCursor,
    total: Number(countRow?.[0]?.value ?? 0),
  };
}

export async function getResearchBySlug(slug: string): Promise<ResearchDetail | null> {
  let row:
    | {
        id: string;
        slug: string;
        title: string;
        summary: string;
        abstract: string;
        authors: string[] | null;
        venue: string | null;
        status: string;
        externalUrl: string | null;
        publishedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
      }
    | undefined;
  try {
    [row] = await db
      .select({
        id: researchItems.id,
        slug: researchItems.slug,
        title: researchItems.title,
        summary: researchItems.summary,
        abstract: researchItems.abstract,
        authors: researchItems.authors,
        venue: researchItems.venue,
        status: researchItems.status,
        externalUrl: researchItems.externalUrl,
        publishedAt: researchItems.publishedAt,
        createdAt: researchItems.createdAt,
        updatedAt: researchItems.updatedAt,
      })
      .from(researchItems)
      .where(and(eq(researchItems.isPublished, true), eq(researchItems.slug, slug)))
      .limit(1);
  } catch {
    row = undefined;
  }

  if (!row) {
    return null;
  }

  return { ...row, authors: row.authors ?? [] };
}

export async function getPublishedResearchSlugs(): Promise<string[]> {
  let rows: Array<{ slug: string }> = [];
  try {
    rows = await db
      .select({ slug: researchItems.slug })
      .from(researchItems)
      .where(eq(researchItems.isPublished, true))
      .orderBy(desc(researchItems.createdAt), desc(researchItems.id));
  } catch {
    rows = [];
  }

  return rows.map((row) => row.slug);
}

export const getCachedResearchPage = unstable_cache(
  async (options?: { status?: ResearchStatus; cursor?: string; limit?: number }) =>
    getResearchPage(options),
  ["research-page"],
  { tags: [CONTENT_TAGS.research], revalidate: 300 },
);

export const getCachedResearchBySlug = unstable_cache(
  async (slug: string) => getResearchBySlug(slug),
  ["research-by-slug"],
  { tags: [CONTENT_TAGS.research], revalidate: 300 },
);

export const getCachedPublishedResearchSlugs = unstable_cache(
  async () => getPublishedResearchSlugs(),
  ["research-slugs"],
  { tags: [CONTENT_TAGS.research], revalidate: 300 },
);
