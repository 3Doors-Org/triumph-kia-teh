import Link from "next/link";

import { routes } from "@/lib/routes";

const adminLinks = [
  { label: "Dashboard", href: routes.admin.dashboard },
  { label: "Writing", href: routes.admin.writing },
  { label: "Research", href: routes.admin.research },
  { label: "Impact", href: routes.admin.impact },
  { label: "Achievements", href: routes.admin.achievements },
  { label: "Media", href: routes.admin.mediaAppearances },
  { label: "Metrics", href: routes.admin.metrics },
  { label: "Testimonials", href: routes.admin.testimonials },
  { label: "Leads", href: routes.admin.leads },
  { label: "Assets", href: routes.admin.assets },
  { label: "Exit Intent", href: routes.admin.exitIntent },
  { label: "Navigation", href: routes.admin.navigation },
  { label: "Analytics", href: routes.admin.analytics },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="border-r border-[var(--color-muted)] bg-[var(--color-card)] p-4">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-muted-fg)]">
          Admin
        </p>
        <nav className="grid gap-2 text-sm">
          {adminLinks.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-2 py-1 hover:bg-[var(--color-muted)]">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="bg-[var(--color-background)] p-6">{children}</main>
    </div>
  );
}
