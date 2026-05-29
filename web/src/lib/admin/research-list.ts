import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { researchItems } from "@/lib/db/schema";
import { RESEARCH_STATUS_VALUES } from "@/lib/research/filters";

const adminResearchFiltersSchema = z.object({
  q: z.string().trim().max(180).optional(),
  status: z.enum(RESEARCH_STATUS_VALUES).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export type AdminResearchFilters = z.infer<typeof adminResearchFiltersSchema>;

export function parseAdminResearchFilters(searchParams: URLSearchParams): AdminResearchFilters {
  return adminResearchFiltersSchema.parse({
    q: emptyToUndefined(searchParams.get("q")),
    status: emptyToUndefined(searchParams.get("status")),
    page: emptyToUndefined(searchParams.get("page")) ?? "1",
    limit: emptyToUndefined(searchParams.get("limit")) ?? "20",
  });
}

export async function getAdminResearchPage(filters: AdminResearchFilters) {
  const where = and(
    filters.status ? eq(researchItems.status, filters.status) : undefined,
    filters.q
      ? or(
          ilike(researchItems.title, `%${escapeIlikeFragment(filters.q)}%`),
          ilike(researchItems.slug, `%${escapeIlikeFragment(filters.q)}%`),
        )
      : undefined,
  );

  const offset = (filters.page - 1) * filters.limit;

  const [rows, totalRowsResult] = await Promise.all([
    db
      .select({
        id: researchItems.id,
        slug: researchItems.slug,
        title: researchItems.title,
        status: researchItems.status,
        isPublished: researchItems.isPublished,
        updatedAt: researchItems.updatedAt,
      })
      .from(researchItems)
      .where(where)
      .orderBy(desc(researchItems.updatedAt))
      .limit(filters.limit)
      .offset(offset),
    db.select({ value: count() }).from(researchItems).where(where),
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

export async function getAdminResearchBySlug(slug: string) {
  const [row] = await db
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
      isPublished: researchItems.isPublished,
    })
    .from(researchItems)
    .where(eq(researchItems.slug, slug))
    .limit(1);

  return row ?? null;
}

function emptyToUndefined(value: string | null): string | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function escapeIlikeFragment(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}
