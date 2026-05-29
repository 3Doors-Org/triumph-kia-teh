import { and, count, desc, eq, ilike, lt, or } from "drizzle-orm";
import { z } from "zod";

import { LEAD_STATUS_VALUES, leadInquiryTypeSchema, leadStatusSchema } from "@/lib/leads/status";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";

type LeadsCursorPayload = { createdAt: string; id: string };

function encodeLeadsCursor(payload: LeadsCursorPayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeLeadsCursor(cursor: string): LeadsCursorPayload | null {
  try {
    const raw = Buffer.from(cursor, "base64url").toString("utf8");
    const parsed = JSON.parse(raw) as Partial<LeadsCursorPayload>;
    if (!parsed.createdAt || !parsed.id) return null;
    return { createdAt: parsed.createdAt, id: parsed.id };
  } catch {
    return null;
  }
}

const adminLeadsQuerySchema = z.object({
  cursor: z.string().trim().max(512).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  status: leadStatusSchema.optional(),
  inquiryType: leadInquiryTypeSchema.optional(),
  search: z.string().trim().max(200).optional(),
});

export type AdminLeadsQuery = z.infer<typeof adminLeadsQuerySchema>;

export function parseAdminLeadsQuery(searchParams: URLSearchParams): AdminLeadsQuery {
  return adminLeadsQuerySchema.parse({
    cursor: emptyToUndefined(searchParams.get("cursor")),
    limit: emptyToUndefined(searchParams.get("limit")) ?? "20",
    status: emptyToUndefined(searchParams.get("status")),
    inquiryType: emptyToUndefined(searchParams.get("inquiryType")),
    search: emptyToUndefined(searchParams.get("search")),
  });
}

function buildFilterWhere(query: AdminLeadsQuery) {
  return and(
    query.status ? eq(leads.status, query.status) : undefined,
    query.inquiryType ? eq(leads.inquiryType, query.inquiryType) : undefined,
    query.search
      ? or(
          ilike(leads.name, `%${escapeIlikeFragment(query.search)}%`),
          ilike(leads.email, `%${escapeIlikeFragment(query.search)}%`),
          ilike(leads.message, `%${escapeIlikeFragment(query.search)}%`),
        )
      : undefined,
  );
}

function buildCursorWhere(cursorPayload: LeadsCursorPayload) {
  const cursorDate = new Date(cursorPayload.createdAt);
  return or(lt(leads.createdAt, cursorDate), and(eq(leads.createdAt, cursorDate), lt(leads.id, cursorPayload.id)));
}

export async function getLeadsPage(query: AdminLeadsQuery) {
  const filterWhere = buildFilterWhere(query);
  const decoded = query.cursor ? decodeLeadsCursor(query.cursor) : null;
  const cursorWhere = decoded ? buildCursorWhere(decoded) : undefined;
  const where = and(filterWhere, cursorWhere);

  const [rows, totalRow] = await Promise.all([
    db
      .select({
        id: leads.id,
        name: leads.name,
        email: leads.email,
        inquiryType: leads.inquiryType,
        message: leads.message,
        sourcePage: leads.sourcePage,
        status: leads.status,
        adminNotes: leads.adminNotes,
        createdAt: leads.createdAt,
      })
      .from(leads)
      .where(where)
      .orderBy(desc(leads.createdAt), desc(leads.id))
      .limit(query.limit + 1),
    db.select({ value: count() }).from(leads).where(filterWhere),
  ]);

  const total = Number(totalRow[0]?.value ?? 0);
  const hasMore = rows.length > query.limit;
  const data = hasMore ? rows.slice(0, query.limit) : rows;
  const tail = data.at(-1);
  const nextCursor =
    hasMore && tail
      ? encodeLeadsCursor({ createdAt: tail.createdAt.toISOString(), id: tail.id })
      : null;

  return { data, nextCursor, total };
}

export async function getLeadById(id: string) {
  const [row] = await db
    .select({
      id: leads.id,
      name: leads.name,
      email: leads.email,
      inquiryType: leads.inquiryType,
      message: leads.message,
      sourcePage: leads.sourcePage,
      status: leads.status,
      adminNotes: leads.adminNotes,
      createdAt: leads.createdAt,
    })
    .from(leads)
    .where(eq(leads.id, id))
    .limit(1);
  return row ?? null;
}

const ALL_STATUSES = new Set<string>(LEAD_STATUS_VALUES);

export function isLeadStatus(value: string): value is (typeof LEAD_STATUS_VALUES)[number] {
  return ALL_STATUSES.has(value);
}

function emptyToUndefined(value: string | null): string | undefined {
  if (!value) return undefined;
  const t = value.trim();
  return t.length > 0 ? t : undefined;
}

function escapeIlikeFragment(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}
