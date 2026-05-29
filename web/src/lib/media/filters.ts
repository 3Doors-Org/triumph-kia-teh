import { z } from "zod";

export const MEDIA_FORMAT_VALUES = ["interview", "podcast", "article", "panel", "video"] as const;
export type MediaFormat = (typeof MEDIA_FORMAT_VALUES)[number];
export const MEDIA_PUBLIC_PAGE_SIZE = 12;

const mediaYearSchema = z
  .string()
  .regex(/^\d{4}$/)
  .transform((value) => Number(value))
  .refine((value) => value >= 2000 && value <= 2100, "year must be a realistic 4-digit year");

export const mediaListQuerySchema = z.object({
  format: z.enum(MEDIA_FORMAT_VALUES).optional(),
  year: mediaYearSchema.optional(),
  cursor: z.string().trim().min(1).max(500).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export type MediaListQuery = z.infer<typeof mediaListQuerySchema>;

function emptyToUndefined(value: string | null): string | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

export function parseMediaListQueryFromSearchParams(searchParams: URLSearchParams) {
  return mediaListQuerySchema.safeParse({
    format: emptyToUndefined(searchParams.get("format")),
    year: emptyToUndefined(searchParams.get("year")),
    cursor: emptyToUndefined(searchParams.get("cursor")),
    limit: emptyToUndefined(searchParams.get("limit")),
  });
}

export function buildMediaListQuery(
  filters: Pick<MediaListQuery, "format" | "year">,
  options?: { cursor?: string; limit?: number },
): string {
  const params = new URLSearchParams();
  if (filters.format) {
    params.set("format", filters.format);
  }
  if (typeof filters.year === "number") {
    params.set("year", String(filters.year));
  }
  if (options?.cursor) {
    params.set("cursor", options.cursor);
  }
  if (typeof options?.limit === "number" && options.limit !== MEDIA_PUBLIC_PAGE_SIZE) {
    params.set("limit", String(options.limit));
  }
  const query = params.toString();
  return query.length > 0 ? `?${query}` : "";
}
