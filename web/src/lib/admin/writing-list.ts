import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";

const adminWritingFiltersSchema = z.object({
  q: z.string().trim().max(120).optional(),
  status: z.enum(["draft", "published"]).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export type AdminWritingFilters = z.infer<typeof adminWritingFiltersSchema>;

export function parseAdminWritingFilters(searchParams: URLSearchParams): AdminWritingFilters {
  return adminWritingFiltersSchema.parse({
    q: emptyToUndefined(searchParams.get("q")),
    status: emptyToUndefined(searchParams.get("status")),
    page: emptyToUndefined(searchParams.get("page")) ?? "1",
    limit: emptyToUndefined(searchParams.get("limit")) ?? "20",
  });
}

export async function getAdminWritingPage(filters: AdminWritingFilters) {
  const where = and(
    filters.status ? eq(posts.status, filters.status) : undefined,
    filters.q
      ? or(
          ilike(posts.title, `%${escapeIlikeFragment(filters.q)}%`),
          ilike(posts.slug, `%${escapeIlikeFragment(filters.q)}%`),
        )
      : undefined,
  );

  const offset = (filters.page - 1) * filters.limit;

  const [rows, totalRowsResult] = await Promise.all([
    db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        status: posts.status,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .where(where)
      .orderBy(desc(posts.updatedAt))
      .limit(filters.limit)
      .offset(offset),
    db.select({ value: count() }).from(posts).where(where),
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
