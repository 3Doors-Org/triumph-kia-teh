import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";

const TESTIMONIAL_STATUS_VALUES = ["draft", "published"] as const;
export type TestimonialStatus = (typeof TESTIMONIAL_STATUS_VALUES)[number];

const adminTestimonialsFiltersSchema = z.object({
  q: z.string().trim().max(180).optional(),
  status: z.enum(TESTIMONIAL_STATUS_VALUES).optional(),
  visibility: z.enum(["published", "hidden"]).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export type AdminTestimonialsFilters = z.infer<typeof adminTestimonialsFiltersSchema>;

export function parseAdminTestimonialsFilters(searchParams: URLSearchParams): AdminTestimonialsFilters {
  return adminTestimonialsFiltersSchema.parse({
    q: emptyToUndefined(searchParams.get("q")),
    status: emptyToUndefined(searchParams.get("status")),
    visibility: emptyToUndefined(searchParams.get("visibility")),
    page: emptyToUndefined(searchParams.get("page")) ?? "1",
    limit: emptyToUndefined(searchParams.get("limit")) ?? "20",
  });
}

export async function getAdminTestimonialsPage(filters: AdminTestimonialsFilters) {
  const where = and(
    filters.status ? eq(testimonials.status, filters.status) : undefined,
    filters.visibility === "published"
      ? eq(testimonials.isPublished, true)
      : filters.visibility === "hidden"
        ? eq(testimonials.isPublished, false)
        : undefined,
    filters.q
      ? or(
          ilike(testimonials.authorName, `%${escapeIlikeFragment(filters.q)}%`),
          ilike(testimonials.authorOrganization, `%${escapeIlikeFragment(filters.q)}%`),
          ilike(testimonials.quote, `%${escapeIlikeFragment(filters.q)}%`),
        )
      : undefined,
  );

  const offset = (filters.page - 1) * filters.limit;
  const [rows, totalRowsResult] = await Promise.all([
    db
      .select({
        id: testimonials.id,
        authorName: testimonials.authorName,
        authorOrganization: testimonials.authorOrganization,
        status: testimonials.status,
        isPublished: testimonials.isPublished,
        sortOrder: testimonials.sortOrder,
        updatedAt: testimonials.updatedAt,
      })
      .from(testimonials)
      .where(where)
      .orderBy(asc(testimonials.sortOrder), desc(testimonials.updatedAt))
      .limit(filters.limit)
      .offset(offset),
    db.select({ value: count() }).from(testimonials).where(where),
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

export async function getAdminTestimonialById(id: string) {
  const [row] = await db
    .select({
      id: testimonials.id,
      authorName: testimonials.authorName,
      authorTitle: testimonials.authorTitle,
      authorOrganization: testimonials.authorOrganization,
      quote: testimonials.quote,
      status: testimonials.status,
      avatarUrl: testimonials.avatarUrl,
      sortOrder: testimonials.sortOrder,
      isPublished: testimonials.isPublished,
    })
    .from(testimonials)
    .where(eq(testimonials.id, id))
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
