import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { revalidateContent } from "@/lib/cache/revalidate-content";
import { db } from "@/lib/db";
import { researchItems } from "@/lib/db/schema";
import { assertEditorialText } from "@/lib/editorial/lint";
import { RESEARCH_STATUS_VALUES } from "@/lib/research/filters";
import { logResearchAudit } from "@/lib/observability/logger";

const routeParamsSchema = z.object({
  id: z.string().uuid(),
});

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
    const payload = researchMutationSchema.parse(await request.json());

    assertEditorialText("research.title", payload.title);
    assertEditorialText("research.summary", payload.summary);
    assertEditorialText("research.abstract", payload.abstract);

    const now = new Date();
    const [existing] = await db
      .select({
        id: researchItems.id,
        slug: researchItems.slug,
        isPublished: researchItems.isPublished,
      })
      .from(researchItems)
      .where(eq(researchItems.id, params.id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const [updated] = await db
      .update(researchItems)
      .set({
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
      .where(and(eq(researchItems.id, params.id)))
      .returning({
        id: researchItems.id,
        slug: researchItems.slug,
        isPublished: researchItems.isPublished,
      });

    if (updated) {
      const event =
        !existing.isPublished && updated.isPublished
          ? "research_published"
          : existing.isPublished && !updated.isPublished
            ? "research_unpublished"
            : "research_updated";
      logResearchAudit({
        event,
        researchId: updated.id,
        slug: updated.slug,
        actorUserId: session.user.id,
      });
      revalidateContent("research", { slug: updated.slug });
      if (existing.slug !== updated.slug) {
        revalidateContent("research", { slug: existing.slug });
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
    return NextResponse.json({ error: "Failed to update research item" }, { status: 500 });
  }
}
