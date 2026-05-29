import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import type { TestimonialsListQuery } from "./filters";
import { TESTIMONIAL_PUBLIC_PAGE_SIZE } from "./filters";

export async function getPublicTestimonials(
  filters: TestimonialsListQuery = {},
): Promise<{ rows: Array<{ id: string; authorName: string; authorTitle: string | null; authorOrganization: string | null; quote: string; avatarUrl: string | null; createdAt: Date }>; nextCursor: null }> {
  const take = Math.min(Math.max(filters.limit ?? TESTIMONIAL_PUBLIC_PAGE_SIZE, 1), 50);

  try {
    const rows = await db
      .select({
        id: testimonials.id,
        authorName: testimonials.authorName,
        authorTitle: testimonials.authorTitle,
        authorOrganization: testimonials.authorOrganization,
        quote: testimonials.quote,
        avatarUrl: testimonials.avatarUrl,
        createdAt: testimonials.createdAt,
      })
      .from(testimonials)
      .where(and(eq(testimonials.isPublished, true), eq(testimonials.status, "published")))
      .orderBy(asc(testimonials.sortOrder), desc(testimonials.createdAt))
      .limit(take);
    return { rows, nextCursor: null };
  } catch {
    return { rows: [], nextCursor: null };
  }
}
