export const ANALYTICS_EVENTS = {
  contactFormSubmitted: "contact_form_submitted",
  scrollDepth25: "scroll_depth_25",
  scrollDepth50: "scroll_depth_50",
  scrollDepth75: "scroll_depth_75",
  scrollDepth100: "scroll_depth_100",
  exitIntentShown: "exit_intent_shown",
  exitIntentCtaClick: "exit_intent_cta_click",
  exitIntentDismissed: "exit_intent_dismissed",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type AnalyticsPropValue = string | number | boolean;
export type AnalyticsProps = Record<string, AnalyticsPropValue>;

export const SCROLL_DEPTH_THRESHOLDS = [25, 50, 75, 100] as const;
export type ScrollDepthThreshold = (typeof SCROLL_DEPTH_THRESHOLDS)[number];

export function scrollDepthEventName(threshold: ScrollDepthThreshold): AnalyticsEventName {
  return `scroll_depth_${threshold}`;
}
