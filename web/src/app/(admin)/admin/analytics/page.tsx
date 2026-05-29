import Link from "next/link";

import { Card } from "@/components/ui";
import { getPlausibleSummary, PLAUSIBLE_PERIODS, type PlausiblePeriod } from "@/lib/analytics/plausible-client";
import { requireRole } from "@/lib/auth/require-role";

const PERIOD_OPTIONS: Array<{ value: PlausiblePeriod; label: string }> = [
  { value: "day", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "month", label: "This month" },
  { value: "6mo", label: "Last 6 months" },
  { value: "12mo", label: "Last 12 months" },
];

export default async function AnalyticsAdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole(["owner"]);
  const params = await searchParams;
  const periodParam = typeof params.period === "string" ? params.period : "30d";
  const period: PlausiblePeriod = PLAUSIBLE_PERIODS.includes(periodParam as PlausiblePeriod)
    ? (periodParam as PlausiblePeriod)
    : "30d";
  const summary = await getPlausibleSummary(period).catch(() => null);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Analytics</h1>
        <p className="text-sm text-[var(--color-muted-fg)]">
          Owner-only analytics summary from Plausible with privacy-first event taxonomy.
        </p>
      </header>

      <div className="flex items-center gap-3">
        <form action="/admin/analytics" method="get">
          <label className="sr-only" htmlFor="period">
            Period
          </label>
          <select
            id="period"
            name="period"
            defaultValue={period}
            className="rounded-md border border-[var(--color-muted)] bg-white px-3 py-2 text-sm"
          >
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="ml-2 rounded-md border border-[var(--color-muted)] px-3 py-2 text-sm hover:bg-[var(--color-muted)]"
          >
            Apply
          </button>
        </form>
        <Link
          href={`/api/v1/metrics?period=${period}&format=csv`}
          className="rounded-md border border-[var(--color-muted)] px-3 py-2 text-sm hover:bg-[var(--color-muted)]"
        >
          Export CSV
        </Link>
      </div>

      {!summary ? (
        <Card>
          <p className="text-sm text-[var(--color-destructive)]">
            Analytics service currently unavailable. Verify Plausible host and API key configuration.
          </p>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Visitors" value={summary.summary.visitors.toLocaleString()} />
            <MetricCard label="Pageviews" value={summary.summary.pageviews.toLocaleString()} />
            <MetricCard label="Bounce rate" value={`${summary.summary.bounceRate.toFixed(1)}%`} />
            <MetricCard
              label="Visit duration"
              value={`${Math.round(summary.summary.visitDurationSeconds)}s`}
            />
            <MetricCard label="Events" value={summary.summary.events.toLocaleString()} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="space-y-3">
              <h2 className="text-lg font-semibold">Top pages</h2>
              <ul className="space-y-2 text-sm">
                {summary.topPages.map((row) => (
                  <li key={row.page} className="flex items-center justify-between gap-4">
                    <span className="truncate">{row.page}</span>
                    <span className="font-medium">{row.visitors.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="space-y-3">
              <h2 className="text-lg font-semibold">Goal events</h2>
              <ul className="space-y-2 text-sm">
                {summary.goals.map((row) => (
                  <li key={row.goal} className="flex items-center justify-between gap-4">
                    <span className="truncate">{row.goal}</span>
                    <span className="font-medium">{row.events.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </>
      )}
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="space-y-1">
      <p className="text-sm text-[var(--color-muted-fg)]">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </Card>
  );
}
