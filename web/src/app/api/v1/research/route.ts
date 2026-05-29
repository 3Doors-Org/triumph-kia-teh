import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { z } from "zod";

import { apiError } from "@/lib/api/error-response";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { revalidateContent } from "@/lib/cache/revalidate-content";
import { db } from "@/lib/db";
import { researchItems } from "@/lib/db/schema";
import { assertEditorialText } from "@/lib/editorial/lint";
import { logResearchAudit } from "@/lib/observability/logger";
import { getClientIp } from "@/lib/security/privacy";
import { enforcePublicReadRateLimit } from "@/lib/security/rate-limit";
import {
  parseResearchListQueryFromSearchParams,
  RESEARCH_PUBLIC_PAGE_SIZE,
  RESEARCH_STATUS_VALUES,
} from "@/lib/research/filters";
import { decodeResearchCursor } from "@/lib/research/pagination";
import { getResearchPage } from "@/lib/research/queries";

function zodErrorToFields(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : "query";
    if (!(key in fields)) {
      fields[key] = issue.message;
    }
  }
  return fields;
}

const researchMutationSchema = z.object({
  title: z.string().trim().min(3).max(220),
  slug: z.string().trim().min(3).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().trim().min(3).max(2000),
  abstract: z.string().trim().min(3).max(10000),
  authors: z.string().trim().max(1200).optional().default(""),
  venue: z.string().trim().max(220).optional().default(""),
  status: z.enum(RESEARCH_STATUS_VALUES),
  externalUrl: z.string().trim().url().optional().or(z.literal("")).default(""),
  isPublished: z.boolean().default(true),
});

function parseAuthors(raw: string): Array<string> {
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 12);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = parseResearchListQueryFromSearchParams(url.searchParams);
  if (!parsed.ok) {
    return apiError({ error: "Validation failed", fields: zodErrorToFields(parsed.error) }, 400);
  }

  if (parsed.data.cursor && !decodeResearchCursor(parsed.data.cursor)) {
    return apiError({ error: "Validation failed", fields: { cursor: "Invalid pagination cursor" } }, 400);
  }

  const identifier = getClientIp(request.headers) ?? "unknown";
  const rate = await enforcePublicReadRateLimit(identifier);
  if (rate && !rate.success) {
    const retryAfter = Math.max(1, Math.ceil((rate.reset - Date.now()) / 1000));
    return apiError({ error: "Too Many Requests", retryAfter }, 429, {
      "Retry-After": String(retryAfter),
    });
  }

  const page = await getResearchPage({
    status: parsed.data.status,
    cursor: parsed.data.cursor,
    limit: parsed.data.limit ?? RESEARCH_PUBLIC_PAGE_SIZE,
  });

  return NextResponse.json(
    {
      data: page.rows.map((row) => ({
        ...row,
        publishedAt: row.publishedAt?.toISOString() ?? null,
        createdAt: row.createdAt.toISOString(),
      })),
      nextCursor: page.nextCursor,
      total: page.total,
    },
    { status: 200 },
  );
}

export async function POST(request: Request) {
  try {
    const session = await requireRole(["owner", "editor"]);
    const payload = researchMutationSchema.parse(await request.json());

    assertEditorialText("research.title", payload.title);
    assertEditorialText("research.summary", payload.summary);
    assertEditorialText("research.abstract", payload.abstract);

    const now = new Date();
    const [created] = await db
      .insert(researchItems)
      .values({
        title: payload.title,
        slug: payload.slug,
        summary: payload.summary,
        abstract: payload.abstract,
        authors: parseAuthors(payload.authors),
        venue: payload.venue || null,
        status: payload.status,
        externalUrl: payload.externalUrl || null,
        isPublished: payload.isPublished,
        publishedAt: payload.isPublished ? now : null,
        updatedAt: now,
      })
      .returning({
        id: researchItems.id,
        slug: researchItems.slug,
      });

    if (created) {
      logResearchAudit({
        event: payload.isPublished ? "research_published" : "research_created",
        researchId: created.id,
        slug: created.slug,
        actorUserId: session.user.id,
      });
      revalidateContent("research", { slug: created.slug });
    }

    return NextResponse.json({ ok: true, id: created?.id ?? null }, { status: 201 });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return apiError({ error: "Validation failed", fields: zodErrorToFields(error) }, 400);
    }
    return apiError({ error: "Failed to create research item" }, 500);
  }
}
