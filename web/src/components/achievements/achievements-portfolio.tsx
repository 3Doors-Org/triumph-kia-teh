"use client";

import { useMemo, useState } from "react";

import { AchievementCard, type AchievementCardItem } from "@/components/achievements/achievement-card";
import {
  ACHIEVEMENT_CATEGORY_LABELS,
  type AchievementCategory,
} from "@/lib/achievements/portfolio-achievements-content";
import { cn } from "@/lib/utils";

const HONOR_FILTER_CATEGORIES = ["all", "academic", "scholarship", "grant", "leadership", "innovation"] as const;
type HonorFilterCategory = (typeof HONOR_FILTER_CATEGORIES)[number];

export function AchievementsPortfolio({ items }: { items: AchievementCardItem[] }) {
  const [selected, setSelected] = useState<HonorFilterCategory>("all");

  const honors = useMemo(() => items.filter((item) => item.category !== "certification"), [items]);
  const certifications = useMemo(() => items.filter((item) => item.category === "certification"), [items]);

  const filteredHonors = useMemo(() => {
    if (selected === "all") return honors;
    return honors.filter((item) => item.category === selected);
  }, [honors, selected]);

  return (
    <div className="space-y-14">
      <section aria-labelledby="honors-heading" className="space-y-8">
        <header className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-accent)">
            Honors & awards
          </p>
          <h2 id="honors-heading" style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-semibold">
            Recognition & excellence
          </h2>
          <p className="mx-auto max-w-2xl text-base text-(--color-muted-fg)">
            Awards and honors recognizing impact, innovation, and academic excellence.
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-2">
          {HONOR_FILTER_CATEGORIES.map((category) => {
            const label =
              category === "all" ? "All" : ACHIEVEMENT_CATEGORY_LABELS[category as AchievementCategory];
            const isActive = selected === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelected(category)}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-(--color-accent) text-(--color-accent-fg)"
                    : "bg-(--color-muted) text-(--color-muted-fg) hover:bg-(--color-muted)/80",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {filteredHonors.length === 0 ? (
          <p className="text-center text-sm text-(--color-muted-fg)">No honors match this filter.</p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredHonors.map((item) => (
              <li key={item.id} className="h-full">
                <AchievementCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {certifications.length > 0 ? (
        <section
          aria-labelledby="certifications-heading"
          className="space-y-8 border-t border-(--color-muted)/60 pt-12"
        >
          <header className="space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-accent)">
              Licenses & certifications
            </p>
            <h2
              id="certifications-heading"
              style={{ fontFamily: "var(--font-display)" }}
              className="text-3xl font-semibold"
            >
              Continuous learning & recognition
            </h2>
            <p className="mx-auto max-w-2xl text-base text-(--color-muted-fg)">
              Credentials that validate expertise and commitment to excellence.
            </p>
          </header>

          <ul className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certifications.map((item) => (
              <li key={item.id} className="h-full">
                <AchievementCard item={item} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
