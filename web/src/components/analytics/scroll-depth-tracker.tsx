"use client";

import { useScrollDepth } from "@/hooks/use-scroll-depth";
import type { AnalyticsProps } from "@/lib/analytics/events";

export function ScrollDepthTracker({
  contentId,
  eventProps,
}: {
  contentId: string;
  eventProps?: AnalyticsProps;
}) {
  useScrollDepth({ contentId, eventProps });
  return null;
}
