"use client";

import { useEffect, useRef } from "react";

import {
  SCROLL_DEPTH_THRESHOLDS,
  type AnalyticsProps,
  type ScrollDepthThreshold,
} from "@/lib/analytics/events";
import {
  isScrollDepthThreshold,
  scrollDepthDedupeKey,
  toScrollDepthEventName,
} from "@/lib/analytics/scroll-depth";
import { trackAnalyticsEvent } from "@/lib/analytics/plausible-events";

type UseScrollDepthOptions = {
  contentId: string;
  eventProps?: AnalyticsProps;
  enabled?: boolean;
};

const firedThresholds = new Set<string>();

export function useScrollDepth({
  contentId,
  eventProps = {},
  enabled = true,
}: UseScrollDepthOptions): void {
  const sentinelsRef = useRef<HTMLDivElement[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!enabled || typeof document === "undefined") {
      return;
    }

    const container = document.body;
    const originalPosition = container.style.position;
    if (globalThis.getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }

    const sentinels = SCROLL_DEPTH_THRESHOLDS.map((threshold) => {
      const node = document.createElement("div");
      node.dataset.scrollThreshold = String(threshold);
      node.setAttribute("aria-hidden", "true");
      node.style.position = "absolute";
      node.style.left = "0";
      node.style.top = `${threshold}%`;
      node.style.width = "1px";
      node.style.height = "1px";
      node.style.pointerEvents = "none";
      node.style.opacity = "0";
      container.appendChild(node);
      return node;
    });
    sentinelsRef.current = sentinels;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          const threshold = Number(
            (entry.target as HTMLDivElement).dataset.scrollThreshold,
          ) as ScrollDepthThreshold;
          if (!isScrollDepthThreshold(threshold)) {
            continue;
          }
          const dedupeKey = scrollDepthDedupeKey(contentId, threshold);
          if (firedThresholds.has(dedupeKey)) {
            continue;
          }
          firedThresholds.add(dedupeKey);
          trackAnalyticsEvent(toScrollDepthEventName(threshold), {
            content_id: contentId,
            threshold,
            ...eventProps,
          });
          observerRef.current?.unobserve(entry.target);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );

    for (const sentinel of sentinels) {
      observerRef.current.observe(sentinel);
    }

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      for (const sentinel of sentinelsRef.current) {
        sentinel.remove();
      }
      sentinelsRef.current = [];
      container.style.position = originalPosition;
    };
  }, [contentId, enabled, eventProps]);
}
