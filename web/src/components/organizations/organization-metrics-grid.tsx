"use client";

import { CountUpSpan } from "@/components/motion/count-up";
import { Card } from "@/components/ui";

type Metric = { id: string; label: string; value: number; suffix: string };

export function OrganizationMetricsGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.id}>
          <p className="text-2xl font-semibold text-[var(--color-primary)]">
            <CountUpSpan end={metric.value} durationSec={1.6} />
            {metric.suffix}
          </p>
          <p className="text-sm text-[var(--color-muted-fg)]">{metric.label}</p>
        </Card>
      ))}
    </div>
  );
}
