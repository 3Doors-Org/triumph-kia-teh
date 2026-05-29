import { z } from "zod";

export const COMMUNITY_IMPACT_PUBLIC_PAGE_SIZE = 50;
export const COMMUNITY_IMPACT_DOOR_VALUES = ["ACCESS", "EXCELLENCE", "OPPORTUNITY"] as const;

export const communityImpactFilterSchema = z.object({
  door: z.enum(COMMUNITY_IMPACT_DOOR_VALUES).optional(),
  type: z.string().trim().min(1).optional(),
  org: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i, "Invalid organization filter")
    .optional(),
  since: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid since date; expected YYYY-MM-DD")
    .optional(),
});

export type CommunityImpactFilters = z.infer<typeof communityImpactFilterSchema>;
const communityImpactCursorSchema = z
  .string()
  .trim()
  .min(1)
  .max(500)
  .optional();

export function parseCommunityImpactFilters(input: unknown): CommunityImpactFilters {
  const parsed = communityImpactFilterSchema.safeParse(input);
  if (!parsed.success) {
    return {};
  }
  return parsed.data;
}

export function parseCommunityImpactFiltersForApi(input: unknown) {
  const parsed = communityImpactFilterSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error };
  }
  return { ok: true as const, data: parsed.data };
}

export function parseCommunityImpactFiltersFromSearchParams(searchParams: URLSearchParams) {
  return parseCommunityImpactFilters({
    door: searchParams.get("door") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    org: searchParams.get("org") ?? undefined,
    since: searchParams.get("since") ?? undefined,
  });
}

export function parseCommunityImpactCursor(input: unknown): string | undefined {
  const parsed = communityImpactCursorSchema.safeParse(input);
  if (!parsed.success) {
    return undefined;
  }
  return parsed.data;
}

export function parseCommunityImpactCursorFromSearchParams(searchParams: URLSearchParams) {
  return parseCommunityImpactCursor(searchParams.get("cursor"));
}

export function buildCommunityImpactQuery(
  filters: CommunityImpactFilters,
  options?: { cursor?: string },
) {
  const searchParams = new URLSearchParams();

  if (filters.door) {
    searchParams.set("door", filters.door);
  }
  if (filters.type) {
    searchParams.set("type", filters.type);
  }
  if (filters.org) {
    searchParams.set("org", filters.org);
  }
  if (filters.since) {
    searchParams.set("since", filters.since);
  }
  if (options?.cursor) {
    searchParams.set("cursor", options.cursor);
  }

  const query = searchParams.toString();
  return query.length > 0 ? `?${query}` : "";
}
