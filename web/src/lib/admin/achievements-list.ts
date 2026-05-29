import { and, count, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { achievements } from "@/lib/db/schema";

const adminAchievementsFiltersSchema = z.object({
  q: z.string().trim().max(180).optional(),
  category: z.string().trim().max(80).optional(),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  status: z.enum(["published", "hidden"]).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export type AdminAchievementsFilters = z.infer<typeof adminAchievementsFiltersSchema>;

export function parseAdminAchievementsFilters(searchParams: URLSearchParams): AdminAchievementsFilters {
  return adminAchievementsFiltersSchema.parse({
    q: emptyToUndefined(searchParams.get("q")),
    category: emptyToUndefined(searchParams.get("category")),
    year: emptyToUndefined(searchParams.get("year")),
    status: emptyToUndefined(searchParams.get("status")),
    page: emptyToUndefined(searchParams.get("page")) ?? "1",
    limit: emptyToUndefined(searchParams.get("limit")) ?? "20",
  });
}

export async function getAdminAchievementsPage(filters: AdminAchievementsFilters) {
  const where = and(
    filters.category ? eq(achievements.category, filters.category) : undefined,
    filters.status === "published"
      ? eq(achievements.isPublished, true)
      : filters.status === "hidden"
        ? eq(achievements.isPublished, false)
        : undefined,
    filters.year
      ? and(
          gte(
            achievements.achievedAt,
            new Date(Date.UTC(filters.year, 0, 1, 0, 0, 0)),
          ),
          lte(
            achievements.achievedAt,
            new Date(Date.UTC(filters.year, 11, 31, 23, 59, 59)),
          ),
        )
      : undefined,
    filters.q
      ? or(
          ilike(achievements.title, `%${escapeIlikeFragment(filters.q)}%`),
          ilike(achievements.summary, `%${escapeIlikeFragment(filters.q)}%`),
          ilike(achievements.category, `%${escapeIlikeFragment(filters.q)}%`),
        )
      : undefined,
  );

  const offset = (filters.page - 1) * filters.limit;
  const [rows, totalRowsResult] = await Promise.all([
    db
      .select({
        id: achievements.id,
        title: achievements.title,
        category: achievements.category,
        venue: achievements.venue,
        achievedAt: achievements.achievedAt,
        isPublished: achievements.isPublished,
        createdAt: achievements.createdAt,
      })
      .from(achievements)
      .where(where)
      .orderBy(desc(achievements.achievedAt), desc(achievements.id))
      .limit(filters.limit)
      .offset(offset),
    db.select({ value: count() }).from(achievements).where(where),
  ]);

  const totalRows = Number(totalRowsResult[0]?.value ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalRows / filters.limit));
  const categoriesResult = await db
    .select({ value: achievements.category })
    .from(achievements)
    .groupBy(achievements.category)
    .orderBy(sql`lower(${achievements.category}) asc`);

  return {
    rows,
    categories: categoriesResult.map((item) => item.value),
    pagination: {
      page: filters.page,
      limit: filters.limit,
      totalRows,
      totalPages,
      hasNextPage: filters.page < totalPages,
      hasPreviousPage: filters.page > 1,
    },
  };
}

export async function getAdminAchievementById(id: string) {
  const [row] = await db
    .select({
      id: achievements.id,
      title: achievements.title,
      summary: achievements.summary,
      category: achievements.category,
      venue: achievements.venue,
      achievedAt: achievements.achievedAt,
      externalUrl: achievements.externalUrl,
      isPublished: achievements.isPublished,
    })
    .from(achievements)
    .where(eq(achievements.id, id))
    .limit(1);
  return row ?? null;
}

function emptyToUndefined(value: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function escapeIlikeFragment(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}
