"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef } from "react";

import { trackPlausible } from "@/lib/analytics/plausible-events";
import type { ExitIntentContextKey } from "@/lib/exit-intent/contexts";

type ExitIntentModalProps = {
  contextKey: ExitIntentContextKey;
  isOpen: boolean;
  headline: string;
  supportingLine: string;
  ctaLabel: string;
  ctaUrl: string;
  dismissText: string;
  reducedMotion: boolean;
  suppressAnalytics?: boolean;
  onDismiss: () => void;
};

export function ExitIntentModal({
  contextKey,
  isOpen,
  headline,
  supportingLine,
  ctaLabel,
  ctaUrl,
  dismissText,
  reducedMotion,
  suppressAnalytics = false,
  onDismiss,
}: ExitIntentModalProps) {
  const titleId = useId();
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const dismissRef = useRef<HTMLButtonElement | null>(null);

  const handleDismiss = useCallback(() => {
    if (!suppressAnalytics) {
      trackPlausible("exit_intent_dismissed", { page_context: contextKey });
    }
    onDismiss();
  }, [contextKey, onDismiss, suppressAnalytics]);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const focusTimer = globalThis.setTimeout(() => {
      ctaRef.current?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleDismiss();
        return;
      }

      if (event.key !== "Tab") return;

      const focusables = [ctaRef.current, dismissRef.current].filter(Boolean) as HTMLElement[];
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !focusables.includes(active as HTMLElement)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      globalThis.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      const target = previouslyFocused.current;
      globalThis.setTimeout(() => target?.focus?.(), reducedMotion ? 0 : 220);
    };
  }, [handleDismiss, isOpen, reducedMotion]);

  const overlayVariants = reducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      };

  const modalVariants = reducedMotion
    ? { hidden: { opacity: 1, scale: 1 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 1, scale: 1 } }
    : {
        hidden: { opacity: 0, scale: 0.96 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { type: "spring" as const, stiffness: 300, damping: 30 },
        },
        exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2, ease: "easeOut" as const } },
      };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center px-6"
          style={{ background: "rgba(14, 47, 44, 0.85)" }}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleDismiss}
          role="presentation"
        >
          <motion.div
            className="w-full max-w-[480px] rounded-2xl bg-[var(--color-card)] p-10 shadow-[0_24px_64px_rgba(0,0,0,0.18)]"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id={titleId} className="text-2xl font-semibold text-[var(--color-foreground)]">
              {headline}
            </h2>
            {supportingLine ? (
              <p className="mt-3 text-base text-[var(--color-muted-fg)]">{supportingLine}</p>
            ) : null}
            <div className="mt-6">
              {ctaUrl.startsWith("/") ? (
                <Link
                  ref={ctaRef}
                  href={ctaUrl}
                  className="block w-full rounded-md bg-[var(--color-accent)] px-4 py-3 text-center text-sm font-semibold text-[var(--color-accent-fg)]"
                  onClick={() => {
                    if (!suppressAnalytics) {
                      trackPlausible("exit_intent_cta_click", {
                        page_context: contextKey,
                        cta_label: ctaLabel,
                        cta_url: ctaUrl,
                      });
                    }
                  }}
                >
                  {ctaLabel}
                </Link>
              ) : (
                <a
                  ref={ctaRef}
                  href={ctaUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="block w-full rounded-md bg-[var(--color-accent)] px-4 py-3 text-center text-sm font-semibold text-[var(--color-accent-fg)]"
                  onClick={() => {
                    if (!suppressAnalytics) {
                      trackPlausible("exit_intent_cta_click", {
                        page_context: contextKey,
                        cta_label: ctaLabel,
                        cta_url: ctaUrl,
                      });
                    }
                  }}
                >
                  {ctaLabel}
                </a>
              )}
            </div>
            <div className="mt-3 text-center">
              <button
                ref={dismissRef}
                type="button"
                className="text-sm text-[var(--color-muted-fg)] hover:underline"
                onClick={handleDismiss}
              >
                {dismissText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
