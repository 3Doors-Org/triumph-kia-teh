"use client";

import {
  BookOpen,
  Building,
  GraduationCap,
  Globe,
  Rocket,
  Sparkles,
} from "lucide-react";

import { RevealSection } from "@/components/motion/reveal-section";
import type { AboutPageContent, PathOfPurposeIcon } from "@/lib/about/about-page-types";
import { isRevealEnabled } from "@/lib/motion/manifest";

const ICONS: Record<PathOfPurposeIcon, typeof GraduationCap> = {
  "graduation-cap": GraduationCap,
  rocket: Rocket,
  building: Building,
  "book-open": BookOpen,
  globe: Globe,
  sparkles: Sparkles,
};

export function PathOfPurposeJourney({ journey }: { journey: AboutPageContent["journey"] }) {
  return (
    <section
      id="story"
      className="-mx-4 scroll-mt-24 rounded-2xl bg-[var(--color-muted)]/30 px-4 py-12 md:py-16 lg:px-8"
      aria-labelledby="path-of-purpose-heading"
    >
      <RevealSection as="div" enabled={isRevealEnabled("about", "story")} className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">{journey.eyebrow}</p>
        <h2
          id="path-of-purpose-heading"
          className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--color-foreground)] md:text-4xl"
        >
          {journey.title}
        </h2>
        <p className="mt-4 text-base text-[var(--color-muted-fg)]">{journey.subtitle}</p>
      </RevealSection>

      <div className="relative mx-auto max-w-5xl">
        <div
          className="absolute bottom-0 left-8 top-0 w-0.5 bg-[var(--color-accent)]/30 md:left-1/2 md:-translate-x-1/2"
          aria-hidden
        />

        <div className="space-y-12">
          {journey.milestones.map((milestone, index) => {
            const Icon = ICONS[milestone.icon];
            const isEven = index % 2 === 0;
            const direction = isEven ? "left" : "right";

            return (
              <RevealSection
                key={`${milestone.year}-${milestone.title}`}
                as="div"
                enabled={isRevealEnabled("about", "story")}
                direction={direction}
                delay={index * 0.1}
                className="relative"
              >
                <div className={`flex items-center gap-6 md:gap-8 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="relative z-10 flex w-16 shrink-0 items-center justify-center md:w-24">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)] shadow-lg md:h-20 md:w-20">
                      <Icon className="text-[var(--color-accent-fg)]" size={24} aria-hidden />
                    </div>
                  </div>

                  <div className={`min-w-0 flex-1 ${isEven ? "md:text-left" : "md:text-right"}`}>
                    <div
                      className={`rounded-2xl border border-[var(--color-muted)] bg-[var(--color-card)] p-6 shadow-md md:inline-block md:max-w-lg ${isEven ? "md:mr-auto" : "md:ml-auto"}`}
                    >
                      <span className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-accent)]">
                        {milestone.year}
                      </span>
                      <h3 className="mb-3 mt-2 font-[var(--font-display)] text-xl font-semibold text-[var(--color-foreground)]">
                        {milestone.title}
                      </h3>
                      <p className="text-base leading-relaxed text-[var(--color-muted-fg)]">{milestone.description}</p>
                    </div>
                  </div>

                  <div className="hidden flex-1 md:block" aria-hidden />
                </div>
              </RevealSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
