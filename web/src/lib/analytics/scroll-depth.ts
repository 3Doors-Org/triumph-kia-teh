import { ANALYTICS_EVENTS, SCROLL_DEPTH_THRESHOLDS, type ScrollDepthThreshold } from "@/lib/analytics/events";

export function isScrollDepthThreshold(value: number): value is ScrollDepthThreshold {
  return SCROLL_DEPTH_THRESHOLDS.includes(value as ScrollDepthThreshold);
}

export function toScrollDepthEventName(threshold: ScrollDepthThreshold) {
  switch (threshold) {
    case 25:
      return ANALYTICS_EVENTS.scrollDepth25;
    case 50:
      return ANALYTICS_EVENTS.scrollDepth50;
    case 75:
      return ANALYTICS_EVENTS.scrollDepth75;
    case 100:
      return ANALYTICS_EVENTS.scrollDepth100;
  }
}

export function scrollDepthDedupeKey(contentId: string, threshold: ScrollDepthThreshold): string {
  return `${contentId}:${threshold}`;
}
