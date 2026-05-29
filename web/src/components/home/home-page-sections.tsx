import Link from "next/link";

import { HomeHeroContent } from "@/components/home/home-hero-content";
import { PublicPortraitCard } from "@/components/home/public-portrait-card";
import { HomeMetricsGrid } from "@/components/home/home-metrics-grid";
import { RevealSection } from "@/components/motion/reveal-section";
import { Button, Card } from "@/components/ui";
import { isRevealEnabled } from "@/lib/motion/manifest";
import { organizationPublicProfilePath } from "@/lib/organizations/slugs";
import { routes } from "@/lib/routes";

type Metric = { id: string; label: string; value: number; suffix: string };
type Org = { slug: string; name: string; mission: string; externalUrl: string | null };
type Writing = { title: string; slug: string; summary: string | null; door: string | null };

export function HomePageSections({
  metrics,
  organizations,
  writing,
  portraitPublicUrl,
}: {
  metrics: Metric[];
  organizations: Org[];
  writing: Writing[];
  portraitPublicUrl: string | null;
}) {
  const portraitAlt = "Triumph Kia Teh";

  return (
    <div className="space-y-16">
      <section
        aria-label="Welcome"
        className="rounded-2xl bg-[var(--color-primary)] px-6 py-14 text-[var(--color-primary-fg)]"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row md:items-center md:justify-between md:gap-12">
          <PublicPortraitCard
            portraitUrl={portraitPublicUrl}
            initials="TK"
            imageAlt={portraitAlt}
            className="md:shrink-0"
          />
          <div className="min-w-0 flex-1 text-center md:text-left">
            <HomeHeroContent />
          </div>
        </div>
      </section>

      {metrics.length > 0 ? (
        <RevealSection as="section" enabled={isRevealEnabled("home", "metrics")}>
          <h2 className="text-3xl font-semibold">Verified Impact Metrics</h2>
          <HomeMetricsGrid metrics={metrics} />
        </RevealSection>
      ) : null}

      <RevealSection as="section" enabled={isRevealEnabled("home", "organizations")}>
        <h2 className="text-3xl font-semibold">Organizations</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {organizations.map((org) => (
            <Card key={org.slug} className="space-y-3">
              <h3 className="text-xl font-semibold">{org.name}</h3>
              <p className="text-sm text-[var(--color-muted-fg)]">{org.mission}</p>
              <Link
                className="text-sm text-[var(--color-primary)] underline-offset-2 hover:underline"
                href={organizationPublicProfilePath(org.slug)}
              >
                View profile
              </Link>
            </Card>
          ))}
        </div>
      </RevealSection>

      {writing.length > 0 ? (
        <RevealSection as="section" enabled={isRevealEnabled("home", "writing")}>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-3xl font-semibold">Recent Writing</h2>
            <Link className="text-sm text-[var(--color-primary)] hover:underline" href={routes.public.writing}>
              View all writing
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {writing.map((item) => (
              <Card key={item.slug} className="space-y-3">
                <p className="text-xs text-[var(--color-muted-fg)]">{item.door ?? "Framework"}</p>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-[var(--color-muted-fg)]">{item.summary ?? "Read the full piece."}</p>
                <Link
                  href={routes.public.writingBySlug(item.slug)}
                  className="text-sm text-[var(--color-primary)] hover:underline"
                >
                  Read article
                </Link>
              </Card>
            ))}
          </div>
        </RevealSection>
      ) : null}

      <RevealSection
        as="section"
        enabled={isRevealEnabled("home", "cta")}
        className="rounded-2xl bg-[var(--color-primary)] px-6 py-10 text-[var(--color-primary-fg)]"
      >
        <h2 className="text-3xl font-semibold">Ready to collaborate?</h2>
        <p className="mt-3 max-w-2xl text-[var(--color-primary-fg)]/90">
          Reach out for partnerships, speaking invitations, research collaborations, or media.
        </p>
        <div className="mt-6">
          <Link href={routes.public.contact}>
            <Button>Get in Touch</Button>
          </Link>
        </div>
      </RevealSection>
    </div>
  );
}
