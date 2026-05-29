"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import {
  getAdminPageLabel,
  getVisibleAdminNavItems,
  type AdminRole,
} from "@/lib/admin/admin-nav";

function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShellClient({
  role,
  children,
}: {
  role: AdminRole;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navItems = useMemo(() => getVisibleAdminNavItems(role), [role]);
  const pageLabel = getAdminPageLabel(pathname, role);

  return (
    <div className="min-h-screen bg-[var(--color-background)] md:grid md:grid-cols-[260px_1fr]">
      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-[var(--color-muted)] bg-[var(--color-card)] p-4 transition-transform md:static md:w-auto md:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-[var(--color-muted-fg)]">Admin</p>
        <p className="mb-4 text-xs uppercase tracking-wide text-[var(--color-muted-fg)]">{role}</p>
        <nav className="grid gap-2 text-sm" aria-label="Admin navigation">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`rounded-md px-2 py-1 transition-colors ${active ? "bg-[var(--color-primary)]/15 font-semibold text-[var(--color-fg)]" : "hover:bg-[var(--color-muted)]"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-col md:ml-0">
        <header className="sticky top-0 z-30 border-b border-[var(--color-muted)] bg-[var(--color-background)]/95 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-[var(--color-muted-fg)]">Admin / {pageLabel}</p>
              <h1 className="truncate text-lg font-semibold">{pageLabel}</h1>
            </div>
            <button
              type="button"
              className="rounded-md border border-[var(--color-muted)] px-3 py-1 text-sm md:hidden"
              aria-expanded={mobileNavOpen}
              aria-controls="admin-sidebar"
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              Menu
            </button>
          </div>
        </header>
        {mobileNavOpen ? (
          <button
            type="button"
            aria-label="Close admin navigation overlay"
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
        ) : null}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
