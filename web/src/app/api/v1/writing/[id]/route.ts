import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { revalidateContent } from "@/lib/cache/revalidate-content";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { assertEditorialText } from "@/lib/editorial/lint";
import { logWritingAudit } from "@/lib/observability/logger";

const routeParamsSchema = z.object({
  id: z.string().uuid(),
});

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

function zodErrorToFields(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : "payload";
    if (!(key in fields)) {
      fields[key] = issue.message;
    }
  }
  return fields;
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = routeParamsSchema.parse(await context.params);
    const session = await requireRole(["owner", "editor"]);
    const payload = writingMutationSchema.parse(await request.json());

    assertEditorialText("posts.title", payload.title);
    if (payload.summary) {
      assertEditorialText("posts.summary", payload.summary);
    }
    assertEditorialText("posts.body", payload.bodyText);

    const now = new Date();
    const [existing] = await db
      .select({
        id: posts.id,
        slug: posts.slug,
        status: posts.status,
      })
      .from(posts)
      .where(eq(posts.id, params.id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const [updated] = await db
      .update(posts)
      .set({
        title: payload.title,
        slug: payload.slug,
        summary: payload.summary || null,
        tags: parseTags(payload.tags),
        bodyJson: toBodyJson(payload.bodyText),
        status: payload.publish ? "published" : "draft",
        door: payload.door ?? null,
        publishedAt: payload.publish ? (existing.status === "published" ? undefined : now) : null,
        updatedAt: now,
      })
      .where(and(eq(posts.id, params.id)))
      .returning({
        id: posts.id,
        slug: posts.slug,
        status: posts.status,
      });

    if (updated) {
      const event =
        existing.status !== "published" && updated.status === "published"
          ? "writing_published"
          : existing.status === "published" && updated.status !== "published"
            ? "writing_unpublished"
            : "writing_updated";
      logWritingAudit({
        event,
        postId: updated.id,
        slug: updated.slug,
        actorUserId: session.user.id,
      });
      revalidateContent("writing", { slug: updated.slug });
      if (existing.slug !== updated.slug) {
        revalidateContent("writing", { slug: existing.slug });
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", fields: zodErrorToFields(error) }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update writing post" }, { status: 500 });
  }
}
