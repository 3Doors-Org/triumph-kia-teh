import { and, desc, eq, gte, lt, or } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { CONTENT_TAGS } from "@/lib/cache/revalidate-content";
import { db } from "@/lib/db";
import { mediaAppearances } from "@/lib/db/schema";
import { normalizePublicHttpUrl } from "@/lib/security/url";

import type { MediaListQuery } from "./filters";
import { MEDIA_PUBLIC_PAGE_SIZE } from "./filters";
import { decodeMediaCursor, encodeMediaCursor } from "./pagination";

export type MediaAppearanceListItem = {
  id: string;
  title: string;
  outlet: string;
  format: string;
  summary: string;
  externalUrl: string | null;
  publishedAt: Date | null;
  createdAt: Date;
};

function buildMediaWhere(filters: MediaListQuery, cursor: string | undefined) {
  const conditions = [eq(mediaAppearances.isPublished, true)];
  if (filters.format) {
    conditions.push(eq(mediaAppearances.format, filters.format));
  }
  if (filters.year) {
    const from = new Date(Date.UTC(filters.year, 0, 1));
    const to = new Date(Date.UTC(filters.year + 1, 0, 1));
    conditions.push(gte(mediaAppearances.publishedAt, from));
    conditions.push(lt(mediaAppearances.publishedAt, to));
  }
  const cursorPayload = cursor ? decodeMediaCursor(cursor) : null;
  if (cursorPayload) {
    const cursorDate = new Date(cursorPayload.publishedAt);
    conditions.push(
      or(
        lt(mediaAppearances.publishedAt, cursorDate),
        and(eq(mediaAppearances.publishedAt, cursorDate), lt(mediaAppearances.id, cursorPayload.id)),
      )!,
    );
  }
  return and(...conditions);
}

export async function getPublicMediaAppearances(
  filters: MediaListQuery = {},
): Promise<{ rows: MediaAppearanceListItem[]; nextCursor: string | null }> {
  const take = Math.min(Math.max(filters.limit ?? MEDIA_PUBLIC_PAGE_SIZE, 1), 50);
  try {
    const rows = await db
      .select({
        id: mediaAppearances.id,
        title: mediaAppearances.title,
        outlet: mediaAppearances.outlet,
        format: mediaAppearances.format,
        summary: mediaAppearances.summary,
        externalUrl: mediaAppearances.externalUrl,
        publishedAt: mediaAppearances.publishedAt,
        createdAt: mediaAppearances.createdAt,
      })
      .from(mediaAppearances)
      .where(buildMediaWhere(filters, filters.cursor))
      .orderBy(desc(mediaAppearances.publishedAt), desc(mediaAppearances.id))
      .limit(take + 1);

    const hasMore = rows.length > take;
    const slice = hasMore ? rows.slice(0, take) : rows;
    const tail = slice.at(-1);
    const nextCursor =
      hasMore && tail?.publishedAt
        ? encodeMediaCursor({
            publishedAt: tail.publishedAt.toISOString(),
            id: tail.id,
          })
        : null;

    return {
      rows: slice.map((row) => ({
        ...row,
        externalUrl: normalizePublicHttpUrl(row.externalUrl),
      })),
      nextCursor,
    };
  } catch {
    return { rows: [], nextCursor: null };
  }
}

export const getCachedPublicMediaAppearances = unstable_cache(
  async (filters: MediaListQuery = {}) => getPublicMediaAppearances(filters),
  ["media-appearances-public-list"],
  { tags: [CONTENT_TAGS.mediaAppearances], revalidate: 300 },
);
