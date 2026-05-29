import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { z } from "zod";

import { apiError } from "@/lib/api/error-response";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { assertEditorialText } from "@/lib/editorial/lint";
import { revalidateContent } from "@/lib/cache/revalidate-content";
import { logWritingAudit } from "@/lib/observability/logger";
import { parseWritingListQueryFromSearchParams, WRITING_PUBLIC_PAGE_SIZE } from "@/lib/writing/filters";
import { decodeWritingCursor } from "@/lib/writing/pagination";
import { countPublishedWritingPosts, getWritingPostsPage, type WritingListRow } from "@/lib/writing/queries";
import { getClientIp } from "@/lib/security/privacy";
import { enforcePublicReadRateLimit } from "@/lib/security/rate-limit";

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

function serializeWritingListItem(row: WritingListRow) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    coverImage: null,
    door: row.door,
    tags: row.tags,
    readingTimeMinutes: null,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const writingMutationSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(3).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().trim().max(500).optional().default(""),
  door: z.enum(["ACCESS", "EXCELLENCE", "OPPORTUNITY"]).optional(),
  tags: z.string().trim().max(400).optional().default(""),
  bodyText: z.string().trim().min(1).max(50000),
  publish: z.boolean().default(false),
});

function toBodyJson(bodyText: string): Record<string, unknown> {
  return {
    type: "doc",
    content: bodyText.split(/\n{2,}/g).map((paragraph) => ({
      type: "paragraph",
      content: [{ type: "text", text: paragraph.trim() }],
    })),
  };
}

function parseTags(rawTags: string): Array<string> {
  return rawTags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .slice(0, 8);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = parseWritingListQueryFromSearchParams(url.searchParams);
  if (!parsed.ok) {
    return apiError({ error: "Validation failed", fields: zodErrorToFields(parsed.error) }, 400);
  }

  const { cursor, limit, door, tag, search } = parsed.data;
  if (cursor && !decodeWritingCursor(cursor)) {
    return apiError(
      { error: "Validation failed", fields: { cursor: "Invalid pagination cursor" } },
      400,
    );
  }

  const identifier = getClientIp(request.headers) ?? "unknown";
  const rate = await enforcePublicReadRateLimit(identifier);
  if (rate && !rate.success) {
    const retryAfter = Math.max(1, Math.ceil((rate.reset - Date.now()) / 1000));
    return apiError(
      { error: "Too Many Requests", retryAfter },
      429,
      { "Retry-After": String(retryAfter) },
    );
  }

  const filters = { door, tag, search };
  const pageLimit = limit ?? WRITING_PUBLIC_PAGE_SIZE;

  const [total, page] = await Promise.all([
    countPublishedWritingPosts(filters),
    getWritingPostsPage(filters, cursor, pageLimit),
  ]);

  return NextResponse.json(
    {
      data: page.rows.map(serializeWritingListItem),
      nextCursor: page.nextCursor,
      total,
    },
    { status: 200 },
  );
}

export async function POST(request: Request) {
  try {
    const session = await requireRole(["owner", "editor"]);
    const payload = writingMutationSchema.parse(await request.json());

    assertEditorialText("posts.title", payload.title);
    if (payload.summary) {
      assertEditorialText("posts.summary", payload.summary);
    }
    assertEditorialText("posts.body", payload.bodyText);

    const now = new Date();
    const [created] = await db
      .insert(posts)
      .values({
        title: payload.title,
        slug: payload.slug,
        summary: payload.summary || null,
        tags: parseTags(payload.tags),
        bodyJson: toBodyJson(payload.bodyText),
        status: payload.publish ? "published" : "draft",
        door: payload.door ?? null,
        authorId: session.user.id,
        publishedAt: payload.publish ? now : null,
      })
      .returning({
        id: posts.id,
        slug: posts.slug,
      });

    if (created) {
      logWritingAudit({
        event: payload.publish ? "writing_published" : "writing_created",
        postId: created.id,
        slug: created.slug,
        actorUserId: session.user.id,
      });
      revalidateContent("writing", { slug: created.slug });
    }

    return NextResponse.json({ ok: true, id: created?.id ?? null }, { status: 201 });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return apiError({ error: "Validation failed", fields: zodErrorToFields(error) }, 400);
    }
    return apiError({ error: "Failed to create writing post" }, 500);
  }
}
