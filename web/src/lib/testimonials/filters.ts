import { z } from "zod";

export const TESTIMONIAL_PUBLIC_PAGE_SIZE = 10;

export const testimonialsListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).optional(),
  status: z.enum(["published"]).optional(),
});

export type TestimonialsListQuery = z.infer<typeof testimonialsListQuerySchema>;

function emptyToUndefined(value: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function parseTestimonialsListQueryFromSearchParams(searchParams: URLSearchParams) {
  return testimonialsListQuerySchema.safeParse({
    limit: emptyToUndefined(searchParams.get("limit")),
    status: emptyToUndefined(searchParams.get("status")),
  });
}
