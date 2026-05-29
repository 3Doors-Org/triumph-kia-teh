import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { z } from "zod";

import { apiError } from "@/lib/api/error-response";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { revalidateContent } from "@/lib/cache/revalidate-content";
import {
  COMMUNITY_IMPACT_DOOR_VALUES,
  parseCommunityImpactCursor,
  parseCommunityImpactCursorFromSearchParams,
  parseCommunityImpactFiltersForApi,
  parseCommunityImpactFiltersFromSearchParams,
} from "@/lib/community-impact/filters";
import { decodeCommunityImpactCursor } from "@/lib/community-impact/pagination";
import { getCommunityImpactPage } from "@/lib/data/public-content";
import { db } from "@/lib/db";
import { communityImpactEntries } from "@/lib/db/schema";
import { assertEditorialText } from "@/lib/editorial/lint";
import { logCommunityImpactAudit } from "@/lib/observability/logger";
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

const communityImpactMutationSchema = z.object({
  title: z.string().trim().min(3).max(180),
  summary: z.string().trim().min(3).max(2000),
  door: z.enum(COMMUNITY_IMPACT_DOOR_VALUES),
  type: z.string().trim().min(2).max(50),
  metric: z.object({
    label: z.string().trim().min(2).max(100),
    value: z.coerce.number().int().min(0).max(10_000_000),
  }),
  orgSlug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(64)
    .optional()
    .or(z.literal("")),
  startDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  isPublished: z.boolean().default(true),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = parseCommunityImpactFiltersForApi({
    door: url.searchParams.get("door") ?? undefined,
    type: url.searchParams.get("type") ?? undefined,
    org: url.searchParams.get("org") ?? undefined,
    since: url.searchParams.get("since") ?? undefined,
  });
  if (!parsed.ok) {
    return apiError({ error: "Validation failed", fields: zodErrorToFields(parsed.error) }, 400);
  }

  const cursorForValidation = parseCommunityImpactCursor(url.searchParams.get("cursor"));
  if (url.searchParams.has("cursor") && (!cursorForValidation || !decodeCommunityImpactCursor(cursorForValidation))) {
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

  const filters = parseCommunityImpactFiltersFromSearchParams(url.searchParams);
  const cursor = parseCommunityImpactCursorFromSearchParams(url.searchParams);
  const { entries, nextCursor } = await getCommunityImpactPage(filters, cursor);
  return NextResponse.json(
    {
      data: entries.map((entry) => ({
        ...entry,
        startDate: entry.startDate?.toISOString() ?? null,
        createdAt: entry.createdAt.toISOString(),
      })),
      nextCursor,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    },
  );
}

export async function POST(request: Request) {
  try {
    const session = await requireRole(["owner", "editor"]);
    const payload = communityImpactMutationSchema.parse(await request.json());

    assertEditorialText("communityImpact.title", payload.title);
    assertEditorialText("communityImpact.summary", payload.summary);
    assertEditorialText("communityImpact.metric.label", payload.metric.label);

    const [created] = await db
      .insert(communityImpactEntries)
      .values({
        title: payload.title,
        summary: payload.summary,
        door: payload.door,
        type: payload.type,
        metricLabel: payload.metric.label,
        metricValue: payload.metric.value,
        orgSlug: payload.orgSlug || null,
        startDate: payload.startDate ? new Date(`${payload.startDate}T00:00:00.000Z`) : null,
        isPublished: payload.isPublished,
      })
      .returning({ id: communityImpactEntries.id });

    if (created) {
      logCommunityImpactAudit({
        event: "impact_created",
        impactId: created.id,
        actorUserId: session.user.id,
      });
      revalidateContent("communityImpact");
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
    return apiError({ error: "Failed to create community impact entry" }, 500);
  }
}
