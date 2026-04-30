import Link from "next/link";

import { routes } from "@/lib/routes";

const publicNav = [
  { label: "Organizations", href: routes.public.organizations },
  { label: "Community Impact", href: routes.public.communityImpact },
  { label: "Achievements", href: routes.public.achievements },
  { label: "Media", href: routes.public.media },
  { label: "Writing", href: routes.public.writing },
  { label: "Research", href: routes.public.research },
  { label: "Contact", href: routes.public.contact },
];

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <header className="border-b border-[var(--color-muted)] bg-[var(--color-primary)] text-[var(--color-primary-fg)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href={routes.public.home} className="text-lg font-semibold">
            Triumph Kia Teh
          </Link>
          <nav className="hidden gap-5 text-sm md:flex">
            {publicNav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-[var(--color-accent)]">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-10">{children}</main>
      <footer className="border-t border-[var(--color-muted)] bg-[var(--color-primary)] py-8 text-[var(--color-primary-fg)]">
        <div className="mx-auto flex max-w-6xl justify-between px-4 text-sm">
          <span>© {new Date().getFullYear()} Triumph Kia Teh</span>
          <div className="flex gap-4">
            <Link href={routes.public.about}>About</Link>
            <Link href={routes.public.contact}>Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
