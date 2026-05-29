import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/lib/api/error-response";
import { getPlausibleSummary, PLAUSIBLE_PERIODS, type PlausiblePeriod } from "@/lib/analytics/plausible-client";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";

const querySchema = z.object({
  period: z.enum(PLAUSIBLE_PERIODS).optional().default("30d"),
  refresh: z
    .string()
    .optional()
    .transform((value) => value === "1"),
  format: z.enum(["json", "csv"]).optional().default("json"),
});

function analyticsRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return null;
  }
  return new Redis({ url, token });
}

function cacheKey(period: PlausiblePeriod) {
  return `analytics:summary:${period}`;
}

function cacheTtlSeconds() {
  return Number(process.env.ANALYTICS_CACHE_TTL_SECONDS ?? "900");
}

function asCsv(summary: Awaited<ReturnType<typeof getPlausibleSummary>>) {
  const rows = [
    ["metric", "value"],
    ["period", summary.period],
    ["visitors", String(summary.summary.visitors)],
    ["pageviews", String(summary.summary.pageviews)],
    ["bounce_rate", String(summary.summary.bounceRate)],
    ["visit_duration_seconds", String(summary.summary.visitDurationSeconds)],
    ["events", String(summary.summary.events)],
  ];
  return rows.map((row) => row.join(",")).join("\n");
}

export async function GET(request: Request) {
  try {
    await requireRole(["owner"]);
    const url = new URL(request.url);
    const query = querySchema.parse({
      period: url.searchParams.get("period") ?? undefined,
      refresh: url.searchParams.get("refresh") ?? undefined,
      format: url.searchParams.get("format") ?? undefined,
    });

    const redis = analyticsRedis();
    const key = cacheKey(query.period);
    if (!query.refresh && redis) {
      const cached = await redis.get<string>(key);
      if (cached) {
        if (query.format === "csv") {
          return new NextResponse(asCsv(JSON.parse(cached)), {
            headers: { "content-type": "text/csv; charset=utf-8", "x-analytics-cache": "HIT" },
          });
        }
        return new NextResponse(cached, {
          headers: { "content-type": "application/json", "x-analytics-cache": "HIT" },
        });
      }
    }

    const summary = await getPlausibleSummary(query.period);
    if (redis) {
      await redis.set(key, JSON.stringify(summary), { ex: cacheTtlSeconds() });
    }

    if (query.format === "csv") {
      return new NextResponse(asCsv(summary), {
        headers: { "content-type": "text/csv; charset=utf-8", "x-analytics-cache": "MISS" },
      });
    }

    return NextResponse.json(summary, {
      headers: { "x-analytics-cache": "MISS" },
    });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      const field = error.issues[0];
      return apiError(
        {
          error: "Validation failed",
          fields: {
            [field?.path.join(".") || "query"]: field?.message ?? "Invalid query",
          },
        },
        400,
      );
    }
    return apiError({ error: "Analytics service unavailable" }, 503);
  }
}
