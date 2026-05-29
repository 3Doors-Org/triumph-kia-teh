import type { AnalyticsEventName, AnalyticsProps, AnalyticsPropValue } from "@/lib/analytics/events";

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, AnalyticsPropValue> },
    ) => void;
  }
}

export function trackPlausible(event: string, props?: AnalyticsProps) {
  if (typeof window === "undefined") {
    return;
  }
  const payload = props;
  window.plausible?.(event, payload ? { props: payload } : undefined);
}

export function trackAnalyticsEvent(event: AnalyticsEventName, props?: AnalyticsProps) {
  trackPlausible(event, props);
}
