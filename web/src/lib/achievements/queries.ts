import { and, desc, eq, lt, or } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { db } from "@/lib/db";
import { achievements } from "@/lib/db/schema";
import { CONTENT_TAGS } from "@/lib/cache/revalidate-content";
import { normalizePublicHttpUrl } from "@/lib/security/url";
import { ACHIEVEMENTS_PUBLIC_PAGE_SIZE, type AchievementsListQuery } from "./filters";
import { decodeAchievementsCursor, encodeAchievementsCursor } from "./pagination";

export type AchievementListItem = {
  id: string;
  title: string;
  summary: string;
  category: string;
  venue: string | null;
  achievedAt: Date | null;
  externalUrl: string | null;
  createdAt: Date;
};

export async function getPublicAchievements(
  options: AchievementsListQuery = {},
): Promise<{ rows: AchievementListItem[]; nextCursor: string | null }> {
  const take = Math.min(Math.max(options.limit ?? ACHIEVEMENTS_PUBLIC_PAGE_SIZE, 1), 50);
  const cursorPayload = options.cursor ? decodeAchievementsCursor(options.cursor) : null;
  const whereClause = and(
    eq(achievements.isPublished, true),
    cursorPayload
      ? or(
          lt(achievements.achievedAt, new Date(cursorPayload.achievedAt)),
          and(
            eq(achievements.achievedAt, new Date(cursorPayload.achievedAt)),
            lt(achievements.id, cursorPayload.id),
          ),
        )
      : undefined,
  );
  try {
    const rows = await db
      .select({
        id: achievements.id,
        title: achievements.title,
        summary: achievements.summary,
        category: achievements.category,
        venue: achievements.venue,
        achievedAt: achievements.achievedAt,
        externalUrl: achievements.externalUrl,
        createdAt: achievements.createdAt,
      })
      .from(achievements)
      .where(whereClause)
      .orderBy(desc(achievements.achievedAt), desc(achievements.id))
      .limit(take + 1);

    const hasMore = rows.length > take;
    const slice = hasMore ? rows.slice(0, take) : rows;
    const tail = slice.at(-1);
    const nextCursor =
      hasMore && tail?.achievedAt
        ? encodeAchievementsCursor({
            achievedAt: tail.achievedAt.toISOString(),
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

export const getCachedPublicAchievements = unstable_cache(
  async (options: AchievementsListQuery = {}) => getPublicAchievements(options),
  ["achievements-public-list"],
  { tags: [CONTENT_TAGS.achievements], revalidate: 300 },
);

export async function getAllPublicAchievements(): Promise<AchievementListItem[]> {
  try {
    const rows = await db
      .select({
        id: achievements.id,
        title: achievements.title,
        summary: achievements.summary,
        category: achievements.category,
        venue: achievements.venue,
        achievedAt: achievements.achievedAt,
        externalUrl: achievements.externalUrl,
        createdAt: achievements.createdAt,
      })
      .from(achievements)
      .where(eq(achievements.isPublished, true))
      .orderBy(desc(achievements.achievedAt), desc(achievements.id));

    return rows.map((row) => ({
      ...row,
      externalUrl: normalizePublicHttpUrl(row.externalUrl),
    }));
  } catch {
    return [];
  }
}

export const getCachedAllPublicAchievements = unstable_cache(
  async () => getAllPublicAchievements(),
  ["achievements-public-all"],
  { tags: [CONTENT_TAGS.achievements], revalidate: 300 },
);
