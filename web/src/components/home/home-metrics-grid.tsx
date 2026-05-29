"use client";

import { motion } from "framer-motion";

import { CountUpSpan } from "@/components/motion/count-up";
import { useMotionContext } from "@/components/motion/motion-provider";
import { Card } from "@/components/ui";
import { MOTION_TOKENS } from "@/lib/motion/tokens";

type Metric = { id: string; label: string; value: number; suffix: string };

export function HomeMetricsGrid({ metrics }: { metrics: Metric[] }) {
  const { reducedMotion } = useMotionContext();

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.id}
          initial={reducedMotion ? false : { opacity: 0, y: MOTION_TOKENS.reveal.yOffsetPx }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px", amount: 0.25 }}
          transition={{
            duration: MOTION_TOKENS.duration.sectionRevealMs / 1000,
            delay: reducedMotion ? 0 : index * 0.08,
          }}
        >
          <Card className="space-y-1">
            <p className="text-3xl font-semibold text-[var(--color-primary)]">
              <CountUpSpan end={metric.value} durationSec={1.85} />
              {metric.suffix}
            </p>
            <p className="text-sm text-[var(--color-muted-fg)]">{metric.label}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
