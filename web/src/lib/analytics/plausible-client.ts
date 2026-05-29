export const PLAUSIBLE_PERIODS = [
  "day",
  "7d",
  "30d",
  "month",
  "6mo",
  "12mo",
] as const;

export type PlausiblePeriod = (typeof PLAUSIBLE_PERIODS)[number];

export type AnalyticsSummary = {
  period: PlausiblePeriod;
  generatedAt: string;
  summary: {
    visitors: number;
    pageviews: number;
    bounceRate: number;
    visitDurationSeconds: number;
    events: number;
  };
  topPages: Array<{ page: string; visitors: number; pageviews: number; bounceRate: number }>;
  topSources: Array<{ source: string; visitors: number; bounceRate: number }>;
  goals: Array<{ goal: string; visitors: number; conversionRate: number; events: number }>;
};

const DEFAULT_PLAUSIBLE_HOST = "https://analytics.triumphkiateh.com";
const DEFAULT_PLAUSIBLE_DOMAIN = "triumphkiateh.com";

function baseConfig() {
  return {
    host:
      process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST ??
      process.env.PLAUSIBLE_API_HOST ??
      DEFAULT_PLAUSIBLE_HOST,
    domain:
      process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ??
      process.env.PLAUSIBLE_DOMAIN ??
      DEFAULT_PLAUSIBLE_DOMAIN,
    apiKey: process.env.PLAUSIBLE_API_KEY ?? "",
  };
}

async function plausibleFetch<T>(
  endpoint: "aggregate" | "breakdown",
  params: Record<string, string>,
): Promise<T> {
  const cfg = baseConfig();
  if (!cfg.apiKey) {
    throw new Error("Plausible API key missing");
  }
  const url = new URL(`/api/v1/stats/${endpoint}`, cfg.host);
  url.searchParams.set("site_id", cfg.domain);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Plausible error ${response.status}`);
  }
  return response.json() as Promise<T>;
}

type AggregateResponse = {
  results: {
    visitors: { value: number };
    pageviews: { value: number };
    bounce_rate: { value: number };
    visit_duration: { value: number };
    events: { value: number };
  };
};

type BreakdownItem = {
  page?: string;
  source?: string;
  goal?: string;
  visitors: number;
  pageviews?: number;
  bounce_rate?: number;
  conversion_rate?: number;
  events?: number;
};

type BreakdownResponse = { results: BreakdownItem[] };

export async function getPlausibleSummary(period: PlausiblePeriod): Promise<AnalyticsSummary> {
  const [aggregate, topPages, topSources, goals] = await Promise.all([
    plausibleFetch<AggregateResponse>("aggregate", {
      period,
      metrics: "visitors,pageviews,bounce_rate,visit_duration,events",
    }),
    plausibleFetch<BreakdownResponse>("breakdown", {
      period,
      property: "event:page",
      metrics: "visitors,pageviews,bounce_rate",
      limit: "10",
    }),
    plausibleFetch<BreakdownResponse>("breakdown", {
      period,
      property: "visit:source",
      metrics: "visitors,bounce_rate",
      limit: "10",
    }),
    plausibleFetch<BreakdownResponse>("breakdown", {
      period,
      property: "event:goal",
      metrics: "visitors,conversion_rate,events",
      limit: "20",
    }),
  ]);

  return {
    period,
    generatedAt: new Date().toISOString(),
    summary: {
      visitors: aggregate.results.visitors.value,
      pageviews: aggregate.results.pageviews.value,
      bounceRate: aggregate.results.bounce_rate.value,
      visitDurationSeconds: aggregate.results.visit_duration.value,
      events: aggregate.results.events.value,
    },
    topPages: topPages.results.map((row) => ({
      page: row.page ?? "/",
      visitors: row.visitors,
      pageviews: row.pageviews ?? 0,
      bounceRate: row.bounce_rate ?? 0,
    })),
    topSources: topSources.results.map((row) => ({
      source: row.source ?? "Direct / None",
      visitors: row.visitors,
      bounceRate: row.bounce_rate ?? 0,
    })),
    goals: goals.results.map((row) => ({
      goal: row.goal ?? "unknown",
      visitors: row.visitors,
      conversionRate: row.conversion_rate ?? 0,
      events: row.events ?? 0,
    })),
  };
}
