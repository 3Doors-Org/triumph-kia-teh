import { z } from "zod";

export const RESEARCH_PUBLIC_PAGE_SIZE = 20;

export const RESEARCH_STATUS_VALUES = ["published", "in_progress", "working_paper"] as const;
export type ResearchStatus = (typeof RESEARCH_STATUS_VALUES)[number];

const statusSchema = z.enum(RESEARCH_STATUS_VALUES);
const limitSchema = z.coerce.number().int().min(1).max(100).optional();
const cursorSchema = z.string().trim().min(1).max(2048).optional();

export const researchListQuerySchema = z.object({
  status: statusSchema.optional(),
  limit: limitSchema,
  cursor: cursorSchema,
});

export type ResearchListQuery = z.infer<typeof researchListQuerySchema>;

export function parseResearchListQueryFromSearchParams(searchParams: URLSearchParams) {
  const raw = {
    status: emptyToUndefined(searchParams.get("status")),
    limit: emptyToUndefined(searchParams.get("limit")),
    cursor: emptyToUndefined(searchParams.get("cursor")),
  };
  const parsed = researchListQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error };
  }
  return { ok: true as const, data: parsed.data };
}

export function parseResearchStatusForPage(searchParams: URLSearchParams): ResearchStatus | undefined {
  const value = emptyToUndefined(searchParams.get("status"));
  if (!value) {
    return undefined;
  }
  const parsed = statusSchema.safeParse(value);
  return parsed.success ? parsed.data : undefined;
}

function emptyToUndefined(value: string | null): string | undefined {
  if (value == null) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
