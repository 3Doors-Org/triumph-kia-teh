"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { trackPlausible } from "@/lib/analytics/plausible-events";
import { resolveExitIntentContextKey } from "@/lib/exit-intent/contexts";
import { useReducedMotionPreference } from "@/lib/motion";
import type { PublicExitIntentPayload } from "@/lib/exit-intent/public-data";
import { useExitIntent } from "@/hooks/use-exit-intent";

import { ExitIntentModal } from "./exit-intent-modal";

export function ExitIntentRoot() {
  const pathname = usePathname() ?? "/";
  const contextKey = useMemo(() => resolveExitIntentContextKey(pathname), [pathname]);
  const reducedMotion = useReducedMotionPreference();

  const [payload, setPayload] = useState<PublicExitIntentPayload | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!contextKey) {
      return;
    }

    const controller = new AbortController();
    void fetch("/api/v1/exit-intent", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: PublicExitIntentPayload | null) => {
        if (!controller.signal.aborted && data) {
          setPayload(data);
        }
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [contextKey]);

  const block = contextKey && payload?.contexts ? payload.contexts[contextKey] : undefined;

  const activationDelayMs = useMemo(() => {
    const globalDelay = payload?.triggerDelayMs ?? 5000;
    const perContext = block?.triggerDelayMs;
    return Math.max(0, perContext ?? globalDelay);
  }, [block?.triggerDelayMs, payload?.triggerDelayMs]);

  const intentEnabled = Boolean(
    contextKey && payload?.isActive && block?.headline && block?.ctaLabel && block?.ctaUrl,
  );

  useExitIntent({
    enabled: intentEnabled && !open,
    activationDelayMs,
    onTriggered: () => {
      setOpen(true);
      if (contextKey && block?.ctaLabel) {
        trackPlausible("exit_intent_shown", {
          page_context: contextKey,
          cta_label: block.ctaLabel,
        });
      }
    },
  });

  if (!contextKey || !block || !payload?.isActive) {
    return null;
  }

  return (
    <ExitIntentModal
      contextKey={contextKey}
      isOpen={open}
      headline={block.headline}
      supportingLine={block.supportingLine ?? ""}
      ctaLabel={block.ctaLabel}
      ctaUrl={block.ctaUrl}
      dismissText={block.dismissText?.trim() ? block.dismissText : "Not now"}
      reducedMotion={reducedMotion}
      onDismiss={() => setOpen(false)}
    />
  );
}
