import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { communityImpactEntries } from "@/lib/db/schema";
import { COMMUNITY_IMPACT_DOOR_VALUES } from "@/lib/community-impact/filters";

const adminCommunityImpactFiltersSchema = z.object({
  q: z.string().trim().max(180).optional(),
  door: z.enum(COMMUNITY_IMPACT_DOOR_VALUES).optional(),
  status: z.enum(["published", "hidden"]).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export type AdminCommunityImpactFilters = z.infer<typeof adminCommunityImpactFiltersSchema>;

export function parseAdminCommunityImpactFilters(searchParams: URLSearchParams): AdminCommunityImpactFilters {
  return adminCommunityImpactFiltersSchema.parse({
    q: emptyToUndefined(searchParams.get("q")),
    door: emptyToUndefined(searchParams.get("door")),
    status: emptyToUndefined(searchParams.get("status")),
    page: emptyToUndefined(searchParams.get("page")) ?? "1",
    limit: emptyToUndefined(searchParams.get("limit")) ?? "20",
  });
}

export async function getAdminCommunityImpactPage(filters: AdminCommunityImpactFilters) {
  const where = and(
    filters.door ? eq(communityImpactEntries.door, filters.door) : undefined,
    filters.status === "published"
      ? eq(communityImpactEntries.isPublished, true)
      : filters.status === "hidden"
        ? eq(communityImpactEntries.isPublished, false)
        : undefined,
    filters.q
      ? or(
          ilike(communityImpactEntries.title, `%${escapeIlikeFragment(filters.q)}%`),
          ilike(communityImpactEntries.summary, `%${escapeIlikeFragment(filters.q)}%`),
          ilike(communityImpactEntries.type, `%${escapeIlikeFragment(filters.q)}%`),
        )
      : undefined,
  );

  const offset = (filters.page - 1) * filters.limit;
  const [rows, totalRowsResult] = await Promise.all([
    db
      .select({
        id: communityImpactEntries.id,
        title: communityImpactEntries.title,
        door: communityImpactEntries.door,
        type: communityImpactEntries.type,
        metricLabel: communityImpactEntries.metricLabel,
        metricValue: communityImpactEntries.metricValue,
        orgSlug: communityImpactEntries.orgSlug,
        isPublished: communityImpactEntries.isPublished,
        createdAt: communityImpactEntries.createdAt,
      })
      .from(communityImpactEntries)
      .where(where)
      .orderBy(desc(communityImpactEntries.createdAt))
      .limit(filters.limit)
      .offset(offset),
    db.select({ value: count() }).from(communityImpactEntries).where(where),
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

export async function getAdminCommunityImpactById(id: string) {
  const [row] = await db
    .select({
      id: communityImpactEntries.id,
      title: communityImpactEntries.title,
      summary: communityImpactEntries.summary,
      door: communityImpactEntries.door,
      type: communityImpactEntries.type,
      metricLabel: communityImpactEntries.metricLabel,
      metricValue: communityImpactEntries.metricValue,
      orgSlug: communityImpactEntries.orgSlug,
      startDate: communityImpactEntries.startDate,
      isPublished: communityImpactEntries.isPublished,
    })
    .from(communityImpactEntries)
    .where(eq(communityImpactEntries.id, id))
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
