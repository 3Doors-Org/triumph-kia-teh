import Link from "next/link";
import { Card } from "@/components/ui";
import { requireRole } from "@/lib/auth/require-role";
import { getDashboardSnapshot, getRecentAdminActivity } from "@/lib/admin/dashboard-metrics";

export default async function AdminDashboardPage() {
  const session = await requireRole(["owner", "editor"]);
  const role = session.user.role === "owner" ? "owner" : "editor";
  const [snapshot, recentActivity] = await Promise.all([
    getDashboardSnapshot(role),
    getRecentAdminActivity(5),
  ]);

  const healthTone: Record<"ok" | "error" | "unavailable", string> = {
    ok: "text-green-600",
    error: "text-red-600",
    unavailable: "text-[var(--color-muted-fg)]",
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-sm text-[var(--color-muted-fg)]">
          Operational overview for publishing, content health, and moderation readiness.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {snapshot.metrics.map((metric) => (
          <Card key={metric.label} className="space-y-2">
            <p className="text-sm text-[var(--color-muted-fg)]">{metric.label}</p>
            <p className="text-3xl font-semibold">{metric.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">System health</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span>Database connectivity</span>
              <span className={healthTone[snapshot.health.database]}>
                {snapshot.health.database.toUpperCase()}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Redis connectivity</span>
              <span className={healthTone[snapshot.health.redis]}>{snapshot.health.redis.toUpperCase()}</span>
            </li>
          </ul>
        </Card>

        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">Quick actions</h2>
          <ul className="space-y-2 text-sm">
            {snapshot.quickActions.map((action) => (
              <li key={action.label}>
                <Link className="font-medium text-[var(--color-accent)] hover:underline" href={action.href}>
                  {action.label}
                </Link>
                <p className="text-[var(--color-muted-fg)]">{action.description}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold">Recent writing activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-[var(--color-muted-fg)]">No writing activity yet. Start by creating a post.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {recentActivity.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-4 border-b border-[var(--color-muted)] pb-2">
                <div className="min-w-0">
                  <p className="truncate font-medium">{entry.title}</p>
                  <p className="text-[var(--color-muted-fg)]">{entry.status}</p>
                </div>
                <time className="shrink-0 text-[var(--color-muted-fg)]">
                  {toDate(entry.updatedAt)?.toLocaleDateString() ?? "Unknown"}
                </time>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}

function toDate(value: Date | string | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
