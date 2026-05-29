export const EXIT_INTENT_CONTEXT_KEYS = [
  "home",
  "organizations",
  "community-impact",
  "achievements",
  "media",
  "writing",
  "research",
] as const;

export type ExitIntentContextKey = (typeof EXIT_INTENT_CONTEXT_KEYS)[number];

const CONTEXT_KEY_SET = new Set<string>(EXIT_INTENT_CONTEXT_KEYS);

export function isExitIntentContextKey(value: string): value is ExitIntentContextKey {
  return CONTEXT_KEY_SET.has(value);
}

export function resolveExitIntentContextKey(pathname: string): ExitIntentContextKey | null {
  if (pathname === "/" || pathname.startsWith("/?")) {
    return "home";
  }
  if (pathname.startsWith("/contact")) {
    return null;
  }
  if (pathname.startsWith("/organizations")) {
    return "organizations";
  }
  if (pathname.startsWith("/community-impact")) {
    return "community-impact";
  }
  if (pathname.startsWith("/achievements")) {
    return "achievements";
  }
  if (pathname.startsWith("/media")) {
    return "media";
  }
  if (pathname.startsWith("/writing")) {
    return "writing";
  }
  if (pathname.startsWith("/research")) {
    return "research";
  }
  return null;
}
