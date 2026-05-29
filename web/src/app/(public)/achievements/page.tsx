import type { Metadata } from "next";
import Link from "next/link";

import { AchievementsPortfolio } from "@/components/achievements/achievements-portfolio";
import { RevealSection } from "@/components/motion/reveal-section";
import { Card } from "@/components/ui";
import { getCachedAllPublicAchievements } from "@/lib/achievements/queries";
import { isRevealEnabled } from "@/lib/motion/manifest";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Achievements | Triumph Kia Teh",
  description: "Honors, awards, certifications, and recognition across academic and institutional work.",
  canonicalPath: "/achievements",
});

export default async function AchievementsPage() {
  const items = await getCachedAllPublicAchievements();

  return (
    <section className="space-y-10">
      <RevealSection as="header" enabled={isRevealEnabled("achievements", "header")} className="space-y-3">
        <h1 className="text-4xl font-semibold">Achievements</h1>
        <p className="max-w-3xl text-(--color-muted-fg)">
          Honors, grants, scholarships, and credentials that reflect sustained impact in education, innovation, and
          leadership.
        </p>
      </RevealSection>

      {items.length === 0 ? (
        <Card>
          <p className="text-sm text-(--color-muted-fg)">No achievements are published yet.</p>
        </Card>
      ) : (
        <RevealSection as="div" enabled={isRevealEnabled("achievements", "results")}>
          <AchievementsPortfolio items={items} />
        </RevealSection>
      )}

      <p className="text-sm text-(--color-muted-fg)">
        Looking for interviews and broadcast features? Visit{" "}
        <Link href={routes.public.media} className="underline hover:no-underline">
          Media appearances
        </Link>
        .
      </p>
    </section>
  );
}
