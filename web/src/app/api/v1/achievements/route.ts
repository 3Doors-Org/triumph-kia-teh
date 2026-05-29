import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { z } from "zod";

import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { revalidateContent } from "@/lib/cache/revalidate-content";
import { db } from "@/lib/db";
import { achievements } from "@/lib/db/schema";
import { assertEditorialText } from "@/lib/editorial/lint";
import { logAchievementAudit } from "@/lib/observability/logger";
import { parseAchievementsListQueryFromSearchParams } from "@/lib/achievements/filters";
import { decodeAchievementsCursor } from "@/lib/achievements/pagination";
import { getPublicAchievements } from "@/lib/achievements/queries";
import { getClientIp } from "@/lib/security/privacy";
import { enforcePublicReadRateLimit } from "@/lib/security/rate-limit";
import { apiError } from "@/lib/api/error-response";

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

const achievementsMutationSchema = z.object({
  title: z.string().trim().min(3).max(220),
  summary: z.string().trim().min(3).max(2000),
  category: z.string().trim().min(2).max(80),
  venue: z.string().trim().max(200).optional().default(""),
  achievedAt: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  externalUrl: z.string().trim().url().optional().or(z.literal("")).default(""),
  isPublished: z.boolean().default(true),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = parseAchievementsListQueryFromSearchParams(url.searchParams);
  if (!parsed.success) {
    return apiError({ error: "Validation failed", fields: zodErrorToFields(parsed.error) }, 400);
  }
  if (parsed.data.cursor && !decodeAchievementsCursor(parsed.data.cursor)) {
    return apiError({ error: "Validation failed", fields: { cursor: "Invalid pagination cursor" } }, 400);
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

  const { rows, nextCursor } = await getPublicAchievements(parsed.data);
  return NextResponse.json(
    {
      data: rows.map((item) => ({
        ...item,
        achievedAt: item.achievedAt?.toISOString() ?? null,
        createdAt: item.createdAt.toISOString(),
      })),
      nextCursor,
    },
    { status: 200 },
  );
}

export async function POST(request: Request) {
  try {
    const session = await requireRole(["owner", "editor"]);
    const payload = achievementsMutationSchema.parse(await request.json());

    assertEditorialText("achievements.title", payload.title);
    assertEditorialText("achievements.summary", payload.summary);

    const [created] = await db
      .insert(achievements)
      .values({
        title: payload.title,
        summary: payload.summary,
        category: payload.category,
        venue: payload.venue || null,
        achievedAt: payload.achievedAt ? new Date(`${payload.achievedAt}T00:00:00.000Z`) : null,
        externalUrl: payload.externalUrl || null,
        isPublished: payload.isPublished,
      })
      .returning({ id: achievements.id });

    if (created) {
      logAchievementAudit({
        event: "achievement_created",
        achievementId: created.id,
        actorUserId: session.user.id,
      });
      revalidateContent("achievements");
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return apiError({ error: "Validation failed", fields: zodErrorToFields(error) }, 400);
    }
    if (error instanceof Error && error.message.startsWith("Editorial lint failed:")) {
      return apiError({ error: error.message }, 400);
    }
    return apiError({ error: "Failed to create achievement" }, 500);
  }
}
