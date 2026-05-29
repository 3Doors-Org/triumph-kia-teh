import Link from "next/link";

import { ExitIntentRoot } from "@/components/exit-intent/exit-intent-root";
import { PublicSiteHeader } from "@/components/layout/public-site-header";
import { routes } from "@/lib/routes";

const FALLBACK_NAV: Array<{ label: string; href: string }> = [
  { label: "About", href: routes.public.about },
  { label: "Organizations", href: routes.public.organizations },
  { label: "Community-Impact", href: routes.public.communityImpact },
  { label: "Achievements", href: routes.public.achievements },
  { label: "Media", href: routes.public.media },
  { label: "Writing", href: routes.public.writing },
  { label: "Research", href: routes.public.research },
  { label: "Contact", href: routes.public.contact },
];

export function PublicShell({
  children,
  navItems,
  footerLinks,
}: {
  children: React.ReactNode;
  navItems?: Array<{ label: string; href: string }>;
  footerLinks?: Array<{ label: string; href: string }>;
}) {
  const headerNav = navItems && navItems.length > 0 ? navItems : FALLBACK_NAV;
  const footerPrimary = footerLinks && footerLinks.length > 0 ? footerLinks : FALLBACK_NAV;
  const discoverLinks = FALLBACK_NAV;
  const quickLinks =
    footerPrimary.length > 0
      ? footerPrimary
      : [
          { label: "Home", href: routes.public.home },
          { label: "About", href: routes.public.about },
          { label: "Contact", href: routes.public.contact },
        ];

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-foreground)]">
      <ExitIntentRoot />
      <PublicSiteHeader navItems={headerNav} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">{children}</main>
      <footer className="border-t border-[var(--color-muted)] bg-[var(--color-primary)] py-10 text-[var(--color-primary-fg)] sm:py-12">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:gap-8 md:grid-cols-4">
          <section className="space-y-4 md:col-span-2">
            <p className="text-xl font-semibold leading-tight">Triumph Kia Teh</p>
            <p className="max-w-md text-sm leading-relaxed text-[var(--color-primary-fg)]/80 sm:text-base">
              Platform for a practitioner and scholar: institutional leadership, research, writing, and
              community impact.
            </p>
            <Link
              href={routes.public.contact}
              className="inline-flex min-h-11 items-center rounded-md border border-[var(--color-primary-fg)]/30 px-4 py-2 text-sm font-medium hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Start a conversation
            </Link>
          </section>

          <nav className="space-y-3" aria-label="Footer quick links">
            <p className="text-xs uppercase tracking-wider text-[var(--color-primary-fg)]/70">
              Quick Links
            </p>
            <ul className="grid gap-y-2 text-sm sm:gap-y-2.5">
              {quickLinks.slice(0, 6).map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-9 items-center rounded-md px-2 py-0.5 transition-colors hover:bg-[var(--color-primary-fg)]/15 hover:text-[var(--color-accent)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="space-y-3" aria-label="Footer explore links">
            <p className="text-xs uppercase tracking-wider text-[var(--color-primary-fg)]/70">
              Explore
            </p>
            <ul className="grid gap-y-2 text-sm sm:gap-y-2.5">
              {discoverLinks.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-9 items-center rounded-md px-2 py-0.5 transition-colors hover:bg-[var(--color-primary-fg)]/15 hover:text-[var(--color-accent)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mx-auto mt-8 flex max-w-6xl flex-col items-start justify-between gap-2 border-t border-[var(--color-primary-fg)]/15 px-4 pt-5 text-xs text-[var(--color-primary-fg)]/75 sm:flex-row sm:items-center sm:gap-3">
          <span>© {new Date().getFullYear()} Triumph Kia Teh. All rights reserved.</span>
          <span>Built for long horizon institutional work.</span>
        </div>
      </footer>
    </div>
  );
}
