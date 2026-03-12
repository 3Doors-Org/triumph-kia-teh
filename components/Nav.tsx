"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { basePath } from "@/lib/paths";
import type { NavGroup, NavItem } from "@/lib/siteData";
import { site } from "@/lib/siteData";

export function Nav({ items, brand }: { items: NavItem[]; brand: string }) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("about");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const sectionIds = useMemo(
    () => items.map((i) => i.id).filter((id) => id !== "contact-form"),
    [items]
  );

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY + 140;
      let lastPassed = sectionIds[0] ?? "about";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) lastPassed = id;
      }
      setActiveId(lastPassed);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionIds]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function clearCloseTimer() {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function openMenu(label: string) {
    clearCloseTimer();
    setOpenDropdown(label);
  }

  function scheduleClose(label: string) {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setOpenDropdown((cur) => (cur === label ? null : cur));
    }, 250);
  }

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-50 border-b border-[color:var(--color-border)] bg-[rgba(13,13,13,0.85)] backdrop-blur"
      aria-label="Primary"
    >
      <div className="container-max flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
          {brand}
        </Link>

        <button
          type="button"
          className="md:hidden rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          Menu
        </button>

        <div className="hidden md:flex items-center gap-8">
          {(site.navRoutes as NavGroup[]).map((entry) => {
            if (entry.kind === "link") {
              return (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className="text-sm text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]"
                >
                  {entry.label}
                </Link>
              );
            }

            return (
              <div
                key={entry.label}
                className="relative"
                onMouseEnter={() => openMenu(entry.label)}
                onMouseLeave={() => scheduleClose(entry.label)}
              >
                <button
                  type="button"
                  className="text-sm text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]"
                  aria-expanded={openDropdown === entry.label}
                >
                  {entry.label}
                </button>
                {openDropdown === entry.label ? (
                  <div
                    className="absolute left-0 top-[calc(100%+0.25rem)] w-56 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-2 shadow-lg"
                    onMouseEnter={() => openMenu(entry.label)}
                    onMouseLeave={() => scheduleClose(entry.label)}
                  >
                    {entry.items.map((it) => (
                      <Link
                        key={it.href}
                        href={it.href}
                        className="block rounded-md px-3 py-2 text-sm text-[color:var(--color-text-muted)] hover:bg-[rgba(232,168,56,0.08)] hover:text-[color:var(--color-text)]"
                      >
                        {it.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {open ? (
        <div className="md:hidden border-t border-[color:var(--color-border)]">
          <div className="container-max py-4 flex flex-col gap-3">
            {(site.navRoutes as NavGroup[]).map((entry) => {
              if (entry.kind === "link") {
                return (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    onClick={() => setOpen(false)}
                    className="text-base text-[color:var(--color-text)]"
                  >
                    {entry.label}
                  </Link>
                );
              }
              return (
                <div key={entry.label} className="pt-2">
                  <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                    {entry.label}
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    {entry.items.map((it) => (
                      <Link
                        key={it.href}
                        href={it.href}
                        onClick={() => setOpen(false)}
                        className="text-base text-[color:var(--color-text)]"
                      >
                        {it.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </nav>
  );
}

