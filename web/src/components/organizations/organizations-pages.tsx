import Link from "next/link";

import { OrganizationMetricsGrid } from "@/components/organizations/organization-metrics-grid";
import { RevealSection } from "@/components/motion/reveal-section";
import { Card } from "@/components/ui";
import { isRevealEnabled } from "@/lib/motion/manifest";
import { organizationPublicProfilePath } from "@/lib/organizations/slugs";
import { routes } from "@/lib/routes";

type Organization = {
  slug: string;
  name: string;
  mission: string;
  externalUrl: string | null;
};

type Metric = { id: string; label: string; value: number; suffix: string };
type RelatedWriting = { title: string; slug: string; summary: string | null };

export function OrganizationsOverview({ organizations }: { organizations: Organization[] }) {
  return (
    <section className="space-y-6">
      <RevealSection as="header" enabled={isRevealEnabled("organizations", "header")} className="space-y-3">
        <p className="text-sm text-[var(--color-muted-fg)]">Home / Organizations</p>
        <h1 className="text-4xl font-semibold">Organizations</h1>
        <p className="max-w-3xl text-[var(--color-muted-fg)]">
          Explore the three organizations in Triumph Kia Teh&apos;s institutional portfolio.
        </p>
      </RevealSection>
      <RevealSection as="div" enabled={isRevealEnabled("organizations", "grid")} className="grid gap-4 md:grid-cols-3">
        {organizations.map((org) => (
          <Card key={org.slug} className="space-y-3">
            <h2 className="text-xl font-semibold">{org.name}</h2>
            <p className="text-sm text-[var(--color-muted-fg)]">{org.mission}</p>
            <Link
              href={organizationPublicProfilePath(org.slug)}
              className="text-sm text-[var(--color-primary)] hover:underline"
            >
              Full profile
            </Link>
          </Card>
        ))}
      </RevealSection>
    </section>
  );
}

export function OrganizationDetail({
  organization,
  metrics,
  relatedWriting,
}: {
  organization: Organization;
  metrics: Metric[];
  relatedWriting: RelatedWriting[];
}) {
  return (
    <div className="space-y-10">
      <RevealSection
        as="section"
        enabled={isRevealEnabled("organization-detail", "hero")}
        className="rounded-2xl bg-[var(--color-primary)] px-6 py-12 text-[var(--color-primary-fg)]"
      >
        <p className="text-sm text-[var(--color-primary-fg)]/70">Home / Organizations / {organization.name}</p>
        <h1 className="mt-3 text-4xl font-semibold">{organization.name}</h1>
        <p className="mt-4 max-w-3xl text-[var(--color-primary-fg)]/90">{organization.mission}</p>
        {organization.externalUrl ? (
          <a
            href={organization.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-sm text-[var(--color-accent)] hover:underline"
          >
            Visit official site
          </a>
        ) : null}
      </RevealSection>

      <RevealSection as="section" enabled={isRevealEnabled("organization-detail", "metrics")}>
        <OrganizationMetricsGrid metrics={metrics} />
      </RevealSection>

      <RevealSection
        as="section"
        enabled={isRevealEnabled("organization-detail", "writing")}
        className="space-y-4"
      >
        <h2 className="text-2xl font-semibold">Writing Related to {organization.name}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {relatedWriting.map((post) => (
            <Card key={post.slug} className="space-y-2">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-sm text-[var(--color-muted-fg)]">{post.summary ?? "Read the full article."}</p>
              <Link className="text-sm text-[var(--color-primary)] hover:underline" href={`/writing/${post.slug}`}>
                Read article
              </Link>
            </Card>
          ))}
        </div>
      </RevealSection>

      <RevealSection
        as="section"
        enabled={isRevealEnabled("organization-detail", "cta")}
        className="rounded-xl bg-[var(--color-primary)] px-6 py-8 text-[var(--color-primary-fg)]"
      >
        <h2 className="text-2xl font-semibold">Partner with {organization.name}</h2>
        <p className="mt-2 text-[var(--color-primary-fg)]/90">
          Reach out for structured collaboration and implementation pathways.
        </p>
        <Link
          className="mt-5 inline-block text-[var(--color-accent)] hover:underline"
          href={`${routes.public.contact}?type=partnership`}
        >
          Get in touch
        </Link>
      </RevealSection>
    </div>
  );
}
