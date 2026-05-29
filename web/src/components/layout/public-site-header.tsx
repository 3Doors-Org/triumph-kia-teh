"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

import { useMotionContext } from "@/components/motion/motion-provider";
import { routes } from "@/lib/routes";

export function PublicSiteHeader({
  navItems,
}: {
  navItems: Array<{ label: string; href: string }>;
}) {
  const { reducedMotion } = useMotionContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const headerEase = reducedMotion ? { duration: 0 } : { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as const };

  return (
    <>
      <motion.header
        initial={reducedMotion ? false : { y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={headerEase}
        className={`sticky top-0 z-50 border-b border-[var(--color-muted)] transition-shadow duration-300 ${
          isScrolled
            ? "bg-[color-mix(in_srgb,var(--color-primary)_96%,transparent)] shadow-md backdrop-blur-md"
            : "bg-[var(--color-primary)]"
        } text-[var(--color-primary-fg)]`}
      >
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <motion.span
              whileHover={reducedMotion ? undefined : { scale: 1.03 }}
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              className="inline-flex"
            >
              <Link href={routes.public.home} className="text-lg font-semibold">
                Triumph Kia Teh
              </Link>
            </motion.span>

            <nav className="hidden gap-5 text-sm md:flex" aria-label="Primary navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative rounded-md px-2 py-1 text-[var(--color-primary-fg)]/90 transition-colors duration-300 hover:bg-[var(--color-primary-fg)]/10 hover:text-[var(--color-accent)]"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-2 h-0.5 w-0 bg-[var(--color-accent)] transition-all duration-300 group-hover:w-[calc(100%-1rem)]" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center justify-end md:min-w-0">
              <button
                type="button"
                className="inline-flex rounded-md p-2 text-[var(--color-accent)] md:hidden"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-drawer"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                onClick={() => setIsMobileMenuOpen((open) => !open)}
              >
                {isMobileMenuOpen ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            key="mobile-drawer-shell"
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.22 }}
          >
            <motion.div
              id="mobile-nav-drawer-backdrop"
              className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-primary)_94%,transparent)] backdrop-blur-md"
              aria-hidden
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              id="mobile-nav-drawer"
              initial={{ opacity: 0.98, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: reducedMotion ? 0 : 0.25 }}
              className="pointer-events-none absolute inset-x-4 top-[5.75rem]"
            >
              <div className="pointer-events-auto rounded-xl border border-[var(--color-primary-fg)]/15 bg-[var(--color-primary)] p-4 shadow-xl">
              <nav className="flex flex-col gap-1" aria-label="Primary navigation mobile drawer">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.3,
                      delay: reducedMotion ? 0 : index * 0.07,
                    }}
                  >
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3 py-3 text-lg font-semibold text-[var(--color-primary-fg)] hover:bg-[var(--color-primary-fg)]/10 hover:text-[var(--color-accent)]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
