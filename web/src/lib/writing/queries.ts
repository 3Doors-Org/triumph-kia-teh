import { and, arrayContains, count, desc, eq, ilike, lt, or } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { CONTENT_TAGS } from "@/lib/cache/revalidate-content";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";

import type { WritingDoor, WritingListFilters } from "./filters";
import { WRITING_PUBLIC_PAGE_SIZE } from "./filters";
import { escapeIlikeFragment } from "./like-escape";
import { decodeWritingCursor, encodeWritingCursor } from "./pagination";
import { postsPublishedWhere } from "./published";

export type WritingListRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  door: string | null;
  tags: string[];
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type WritingPostDetail = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  door: string | null;
  tags: string[];
  bodyJson: Record<string, unknown>;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function buildWritingListConditions(
  filters: WritingListFilters,
  cursorPayload: ReturnType<typeof decodeWritingCursor>,
) {
  const conditions = [postsPublishedWhere()];

  if (filters.door) {
    conditions.push(eq(posts.door, filters.door));
  }

  if (filters.tag) {
    conditions.push(arrayContains(posts.tags, [filters.tag]));
  }

  if (filters.search) {
    const pattern = `%${escapeIlikeFragment(filters.search)}%`;
    conditions.push(or(ilike(posts.title, pattern), ilike(posts.summary, pattern))!);
  }

  if (cursorPayload) {
    const cursorDate = new Date(cursorPayload.publishedAt);
    conditions.push(
      or(
        lt(posts.publishedAt, cursorDate),
        and(eq(posts.publishedAt, cursorDate), lt(posts.id, cursorPayload.id)),
      )!,
    );
  }

  return and(...conditions);
}

export async function countPublishedWritingPosts(filters: WritingListFilters): Promise<number> {
  const whereClause = buildWritingListConditions(filters, null);
  const [row] = await db.select({ value: count() }).from(posts).where(whereClause);
  return Number(row?.value ?? 0);
}

export async function getWritingPostsPage(
  filters: WritingListFilters,
  cursor: string | undefined,
  limit: number = WRITING_PUBLIC_PAGE_SIZE,
): Promise<{ rows: WritingListRow[]; nextCursor: string | null }> {
  const cursorPayload = cursor ? decodeWritingCursor(cursor) : null;
  const whereClause = buildWritingListConditions(filters, cursorPayload);

  const take = Math.min(Math.max(limit, 1), 100);
  const dbRows = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.summary,
      door: posts.door,
      tags: posts.tags,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .where(whereClause)
    .orderBy(desc(posts.publishedAt), desc(posts.id))
    .limit(take + 1);

  const hasMore = dbRows.length > take;
  const slice = hasMore ? dbRows.slice(0, take) : dbRows;
  const tail = slice.at(-1);

  const nextCursor =
    hasMore && tail?.publishedAt
      ? encodeWritingCursor({
          publishedAt: tail.publishedAt.toISOString(),
          id: tail.id,
        })
      : null;

  return {
    rows: slice.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      door: row.door,
      tags: row.tags ?? [],
      publishedAt: row.publishedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })),
    nextCursor,
  };
}

export async function getWritingFilterOptions(): Promise<{
  doors: WritingDoor[];
  tags: string[];
}> {
  const rows = await db
    .select({ door: posts.door, tags: posts.tags })
    .from(posts)
    .where(postsPublishedWhere());

  const doorSet = new Set<string>();
  const tagSet = new Set<string>();

  for (const row of rows) {
    if (row.door) {
      doorSet.add(row.door);
    }
    for (const tag of row.tags ?? []) {
      if (tag.trim().length > 0) {
        tagSet.add(tag);
      }
    }
  }

  const doors = (["ACCESS", "EXCELLENCE", "OPPORTUNITY"] as const).filter((d) => doorSet.has(d));
  const tags = Array.from(tagSet).sort((a, b) => a.localeCompare(b));

  return { doors, tags };
}

export async function getPublishedWritingSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: posts.slug })
    .from(posts)
    .where(postsPublishedWhere())
    .orderBy(desc(posts.publishedAt), desc(posts.id));

  return rows.map((row) => row.slug);
}

export async function getPublishedWritingPostBySlug(slug: string): Promise<WritingPostDetail | null> {
  const [row] = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.summary,
      door: posts.door,
      tags: posts.tags,
      bodyJson: posts.bodyJson,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .where(and(postsPublishedWhere(), eq(posts.slug, slug)))
    .limit(1);

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    door: row.door,
    tags: row.tags ?? [],
    bodyJson: row.bodyJson,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getRelatedPublishedWritingPosts(
  post: Pick<WritingPostDetail, "id" | "door" | "tags">,
  limit: number = 3,
): Promise<WritingListRow[]> {
  const relatedWhere = post.door ? and(postsPublishedWhere(), eq(posts.door, post.door)) : postsPublishedWhere();

  const candidateRows = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.summary,
      door: posts.door,
      tags: posts.tags,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .where(relatedWhere)
    .orderBy(desc(posts.publishedAt), desc(posts.id))
    .limit(30);

  const filteredCandidates = candidateRows.filter((row) => row.id !== post.id);
  const postTagSet = new Set(post.tags.map((tag) => tag.toLowerCase()));

  const scored = filteredCandidates.map((row) => {
    const overlap = (row.tags ?? []).filter((tag) => postTagSet.has(tag.toLowerCase())).length;
    return {
      row,
      overlap,
      sameDoor: row.door != null && row.door === post.door ? 1 : 0,
      publishedAtMs: row.publishedAt?.getTime() ?? 0,
    };
  });

  scored.sort((a, b) => {
    if (b.overlap !== a.overlap) {
      return b.overlap - a.overlap;
    }
    if (b.sameDoor !== a.sameDoor) {
      return b.sameDoor - a.sameDoor;
    }
    return b.publishedAtMs - a.publishedAtMs;
  });

  const primary = scored.slice(0, limit).map((entry) => entry.row);
  if (primary.length >= limit) {
    return primary.map((row) => ({
      ...row,
      tags: row.tags ?? [],
    }));
  }

  const fallbackRows = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.summary,
      door: posts.door,
      tags: posts.tags,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .where(postsPublishedWhere())
    .orderBy(desc(posts.publishedAt), desc(posts.id))
    .limit(limit + 5);

  const seenIds = new Set(primary.map((row) => row.id).concat(post.id));
  for (const row of fallbackRows) {
    if (seenIds.has(row.id)) {
      continue;
    }
    primary.push(row);
    seenIds.add(row.id);
    if (primary.length >= limit) {
      break;
    }
  }

  return primary.map((row) => ({
    ...row,
    tags: row.tags ?? [],
  }));
}

export const getCachedWritingPostsPage = unstable_cache(
  async (filters: WritingListFilters, cursor: string | undefined, limit: number = WRITING_PUBLIC_PAGE_SIZE) =>
    getWritingPostsPage(filters, cursor, limit),
  ["writing-posts-page"],
  { tags: [CONTENT_TAGS.writing], revalidate: 300 },
);

export const getCachedWritingFilterOptions = unstable_cache(
  async () => getWritingFilterOptions(),
  ["writing-filter-options"],
  { tags: [CONTENT_TAGS.writing], revalidate: 300 },
);

export const getCachedPublishedWritingSlugs = unstable_cache(
  async () => getPublishedWritingSlugs(),
  ["writing-slugs"],
  { tags: [CONTENT_TAGS.writing], revalidate: 300 },
);

export const getCachedPublishedWritingPostBySlug = unstable_cache(
  async (slug: string) => getPublishedWritingPostBySlug(slug),
  ["writing-slug-detail"],
  { tags: [CONTENT_TAGS.writing], revalidate: 300 },
);

export const getCachedRelatedPublishedWritingPosts = unstable_cache(
  async (post: Pick<WritingPostDetail, "id" | "door" | "tags">, limit: number = 3) =>
    getRelatedPublishedWritingPosts(post, limit),
  ["writing-related-posts"],
  { tags: [CONTENT_TAGS.writing], revalidate: 300 },
);
