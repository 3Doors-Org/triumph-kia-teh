import { z } from "zod";

export const ACHIEVEMENTS_PUBLIC_PAGE_SIZE = 12;

const achievementsCursorSchema = z.string().trim().min(1).max(500).optional();
const achievementsLimitSchema = z.coerce.number().int().min(1).max(50).optional();

export const achievementsListQuerySchema = z.object({
  cursor: achievementsCursorSchema,
  limit: achievementsLimitSchema,
});

export type AchievementsListQuery = z.infer<typeof achievementsListQuerySchema>;

function emptyToUndefined(value: string | null): string | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

export function parseAchievementsListQueryFromSearchParams(searchParams: URLSearchParams) {
  return achievementsListQuerySchema.safeParse({
    cursor: emptyToUndefined(searchParams.get("cursor")),
    limit: emptyToUndefined(searchParams.get("limit")),
  });
}

export function buildAchievementsListQuery(options?: { cursor?: string; limit?: number }): string {
  const params = new URLSearchParams();
  if (options?.cursor) {
    params.set("cursor", options.cursor);
  }
  if (typeof options?.limit === "number" && options.limit !== ACHIEVEMENTS_PUBLIC_PAGE_SIZE) {
    params.set("limit", String(options.limit));
  }
  const query = params.toString();
  return query.length > 0 ? `?${query}` : "";
}
