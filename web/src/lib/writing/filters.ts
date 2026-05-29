import { z } from "zod";

import { routes } from "@/lib/routes";

export const WRITING_PUBLIC_PAGE_SIZE = 20;

export const WRITING_DOOR_VALUES = ["ACCESS", "EXCELLENCE", "OPPORTUNITY"] as const;
export type WritingDoor = (typeof WRITING_DOOR_VALUES)[number];

const writingDoorSchema = z.enum(WRITING_DOOR_VALUES);

const writingTagSchema = z
  .string()
  .trim()
  .min(1)
  .max(50)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/i, "Tag must be alphanumeric segments separated by hyphens");

const writingSearchSchema = z.string().trim().min(1).max(200);

const writingCursorSchema = z.string().trim().min(1).max(2048);

const writingLimitSchema = z.coerce.number().int().min(1).max(100);

export const writingListQuerySchema = z.object({
  cursor: writingCursorSchema.optional(),
  limit: writingLimitSchema.optional(),
  door: writingDoorSchema.optional(),
  tag: writingTagSchema.optional(),
  search: writingSearchSchema.optional(),
});

export type WritingListQuery = z.infer<typeof writingListQuerySchema>;

export type WritingListFilters = Pick<WritingListQuery, "door" | "tag" | "search">;

function emptyToUndefined(value: string | null): string | undefined {
  if (value == null) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function parseWritingListQueryFromSearchParams(searchParams: URLSearchParams) {
  const raw = {
    cursor: emptyToUndefined(searchParams.get("cursor")),
    limit: emptyToUndefined(searchParams.get("limit")),
    door: emptyToUndefined(searchParams.get("door")),
    tag: emptyToUndefined(searchParams.get("tag")),
    search: emptyToUndefined(searchParams.get("search")),
  };

  const parsed = writingListQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error };
  }
  return { ok: true as const, data: parsed.data };
}

export function parseWritingListFiltersForPage(searchParams: URLSearchParams): WritingListFilters {
  const door = searchParams.get("door") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  const parsedDoor = door ? writingDoorSchema.safeParse(door) : { success: true as const, data: undefined };
  const parsedTag = tag ? writingTagSchema.safeParse(tag) : { success: true as const, data: undefined };
  const parsedSearch = search
    ? writingSearchSchema.safeParse(search)
    : { success: true as const, data: undefined };

  const filters: WritingListFilters = {};
  if (parsedDoor.success && parsedDoor.data) {
    filters.door = parsedDoor.data;
  }
  if (parsedTag.success && parsedTag.data) {
    filters.tag = parsedTag.data;
  }
  if (parsedSearch.success && parsedSearch.data) {
    filters.search = parsedSearch.data;
  }
  return filters;
}

export function parseWritingCursorFromSearchParams(searchParams: URLSearchParams): string | undefined {
  const raw = searchParams.get("cursor") ?? undefined;
  if (!raw) {
    return undefined;
  }
  const parsed = writingCursorSchema.safeParse(raw);
  return parsed.success ? parsed.data : undefined;
}

export function buildWritingListQuery(
  filters: WritingListFilters,
  options?: { cursor?: string; limit?: number },
): string {
  const params = new URLSearchParams();

  if (filters.door) {
    params.set("door", filters.door);
  }
  if (filters.tag) {
    params.set("tag", filters.tag);
  }
  if (filters.search) {
    params.set("search", filters.search);
  }
  if (options?.cursor) {
    params.set("cursor", options.cursor);
  }
  if (options?.limit != null && options.limit !== WRITING_PUBLIC_PAGE_SIZE) {
    params.set("limit", String(options.limit));
  }

  const query = params.toString();
  return query.length > 0 ? `${routes.public.writing}?${query}` : routes.public.writing;
}
