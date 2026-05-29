import { Award, ExternalLink } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import { ACHIEVEMENT_CATEGORY_LABELS, type AchievementCategory } from "@/lib/achievements/portfolio-achievements-content";

export type AchievementCardItem = {
  id: string;
  title: string;
  summary: string;
  category: string;
  venue: string | null;
  achievedAt: Date | string | null;
  externalUrl: string | null;
};

export function AchievementCard({ item }: { item: AchievementCardItem }) {
  const categoryKey = item.category as AchievementCategory;
  const categoryLabel = ACHIEVEMENT_CATEGORY_LABELS[categoryKey] ?? item.category;

  return (
    <Card className="flex h-full flex-col p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-(--color-accent)">
          <Award size={24} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <Badge variant="outline" className="mb-2 text-xs">
            {categoryLabel}
          </Badge>
          <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg font-semibold leading-snug">
            {item.title}
          </h3>
          {item.venue ? <p className="mt-1 text-sm font-medium text-(--color-accent)">{item.venue}</p> : null}
          {formatIssued(item.achievedAt) ? (
            <p className="mt-0.5 text-sm text-(--color-muted-fg)">Issued {formatIssued(item.achievedAt)}</p>
          ) : null}
        </div>
      </div>

      <p className="flex-1 text-sm leading-relaxed text-(--color-muted-fg)">{item.summary}</p>

      {item.externalUrl ? (
        <a
          href={item.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--color-accent)" }}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
        >
          View credential <ExternalLink size={14} aria-hidden />
        </a>
      ) : null}
    </Card>
  );
}

function formatIssued(value: Date | string | null): string | null {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(parsed);
}
