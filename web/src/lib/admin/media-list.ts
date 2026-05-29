import { and, count, desc, eq, gte, ilike, lt, or } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { mediaAppearances } from "@/lib/db/schema";
import { MEDIA_FORMAT_VALUES } from "@/lib/media/filters";

const adminMediaFiltersSchema = z.object({
  q: z.string().trim().max(180).optional(),
  format: z.enum(MEDIA_FORMAT_VALUES).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  status: z.enum(["published", "hidden"]).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export type AdminMediaFilters = z.infer<typeof adminMediaFiltersSchema>;

export function parseAdminMediaFilters(searchParams: URLSearchParams): AdminMediaFilters {
  return adminMediaFiltersSchema.parse({
    q: emptyToUndefined(searchParams.get("q")),
    format: emptyToUndefined(searchParams.get("format")),
    year: emptyToUndefined(searchParams.get("year")),
    status: emptyToUndefined(searchParams.get("status")),
    page: emptyToUndefined(searchParams.get("page")) ?? "1",
    limit: emptyToUndefined(searchParams.get("limit")) ?? "20",
  });
}

export async function getAdminMediaPage(filters: AdminMediaFilters) {
  const where = and(
    filters.format ? eq(mediaAppearances.format, filters.format) : undefined,
    filters.status === "published"
      ? eq(mediaAppearances.isPublished, true)
      : filters.status === "hidden"
        ? eq(mediaAppearances.isPublished, false)
        : undefined,
    filters.year
      ? and(
          gte(mediaAppearances.publishedAt, new Date(Date.UTC(filters.year, 0, 1))),
          lt(mediaAppearances.publishedAt, new Date(Date.UTC(filters.year + 1, 0, 1))),
        )
      : undefined,
    filters.q
      ? or(
          ilike(mediaAppearances.title, `%${escapeIlikeFragment(filters.q)}%`),
          ilike(mediaAppearances.outlet, `%${escapeIlikeFragment(filters.q)}%`),
          ilike(mediaAppearances.summary, `%${escapeIlikeFragment(filters.q)}%`),
        )
      : undefined,
  );

  const offset = (filters.page - 1) * filters.limit;
  const [rows, totalRowsResult] = await Promise.all([
    db
      .select({
        id: mediaAppearances.id,
        title: mediaAppearances.title,
        outlet: mediaAppearances.outlet,
        format: mediaAppearances.format,
        publishedAt: mediaAppearances.publishedAt,
        isPublished: mediaAppearances.isPublished,
        updatedAt: mediaAppearances.updatedAt,
      })
      .from(mediaAppearances)
      .where(where)
      .orderBy(desc(mediaAppearances.updatedAt))
      .limit(filters.limit)
      .offset(offset),
    db.select({ value: count() }).from(mediaAppearances).where(where),
  ]);

  const totalRows = Number(totalRowsResult[0]?.value ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalRows / filters.limit));
  return {
    rows,
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

export async function getAdminMediaById(id: string) {
  const [row] = await db
    .select({
      id: mediaAppearances.id,
      title: mediaAppearances.title,
      outlet: mediaAppearances.outlet,
      format: mediaAppearances.format,
      summary: mediaAppearances.summary,
      externalUrl: mediaAppearances.externalUrl,
      publishedAt: mediaAppearances.publishedAt,
      isPublished: mediaAppearances.isPublished,
    })
    .from(mediaAppearances)
    .where(eq(mediaAppearances.id, id))
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
