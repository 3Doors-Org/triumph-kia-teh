import { Heart, LayoutGrid, Lightbulb, Users, Zap } from "lucide-react";

import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { CommunityImpactIconKey } from "@/lib/community-impact/entry-presentation";
import { getCommunityImpactEntryPresentation } from "@/lib/community-impact/entry-presentation";
import type { CommunityImpactMetrics } from "@/lib/community-impact/metrics";

const ICONS: Record<CommunityImpactIconKey, typeof Zap> = {
  zap: Zap,
  lightbulb: Lightbulb,
  users: Users,
  heart: Heart,
};

function toValidDate(value: Date | string | null | undefined): Date | null {
  if (value == null || value === "") {
    return null;
  }
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatStartPeriod(startDate: Date | string | null | undefined): string | null {
  const d = toValidDate(startDate);
  if (!d) {
    return null;
  }
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export function CommunityImpactEntryCard({
  entry,
  orgDisplayName,
}: {
  entry: {
    id: string;
    title: string;
    summary: string;
    door: string;
    type: string;
    orgSlug: string | null;
    startDate: Date | string | null;
    metrics: CommunityImpactMetrics | null;
  };
  orgDisplayName: string | null;
}) {
  const presentation = getCommunityImpactEntryPresentation(entry.id);
  const Icon = presentation ? ICONS[presentation.icon] : LayoutGrid;
  const period =
    (presentation?.periodLabel?.trim() || null) ??
    formatStartPeriod(entry.startDate);
  const orgLine = presentation
    ? presentation.organizationLine
    : entry.orgSlug
      ? (orgDisplayName ?? entry.orgSlug)
      : null;
  const tags = presentation?.tags ?? [];
  const metricLine =
    !presentation && entry.metrics
      ? `${entry.metrics.label}: ${entry.metrics.value}${entry.metrics.suffix ?? ""}`
      : null;

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border border-transparent bg-[var(--color-card)] p-6 shadow-sm transition-all duration-300 md:p-10",
        "hover:-translate-y-2 hover:border-[var(--color-accent)]/20 hover:shadow-xl",
      )}
    >
      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/10">
          <Icon className="h-6 w-6 text-[var(--color-accent)]" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          {presentation ? null : (
            <p className="mb-1 text-xs text-[var(--color-muted-fg)]">
              {entry.door}
              <span aria-hidden="true"> · </span>
              {entry.type}
            </p>
          )}
          <h3 className="font-[var(--font-display)] text-xl font-semibold text-[var(--color-foreground)] md:text-2xl">
            {entry.title}
          </h3>
          {orgLine ? (
            <p className="mt-1 text-sm font-medium text-[var(--color-accent)]">{orgLine}</p>
          ) : null}
          {period ? (
            <p className="mt-1 text-sm text-[var(--color-muted-fg)]">{period}</p>
          ) : null}
        </div>
      </div>

      <p className="mb-4 flex-1 text-base leading-relaxed text-[var(--color-foreground)]/80">
        {entry.summary}
      </p>

      {metricLine ? (
        <p className="mb-4 text-sm font-medium text-[var(--color-primary)]">{metricLine}</p>
      ) : null}

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}
    </article>
  );
}
