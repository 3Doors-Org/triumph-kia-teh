type PublicAnalyticsConfig = {
  plausible: { scriptSrc: string; domain: string } | null;
  clarityProjectId: string | null;
};

function normalizeHost(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function shouldLoadAnalytics(): boolean {
  const disabled = (process.env.NEXT_PUBLIC_DISABLE_ANALYTICS ?? "").toLowerCase();
  if (disabled === "true" || disabled === "1") {
    return false;
  }
  const allowInDev = (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_DEV ?? "").toLowerCase();
  if (process.env.NODE_ENV !== "production" && allowInDev !== "true" && allowInDev !== "1") {
    return false;
  }
  return true;
}

export function getPublicAnalyticsConfig(): PublicAnalyticsConfig {
  if (!shouldLoadAnalytics()) {
    return { plausible: null, clarityProjectId: null };
  }

  const plausibleDomain =
    process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? process.env.PLAUSIBLE_DOMAIN ?? null;
  const plausibleHost =
    process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST ?? process.env.PLAUSIBLE_API_HOST ?? null;

  const plausible =
    plausibleDomain && plausibleHost
      ? {
          scriptSrc: `${normalizeHost(plausibleHost)}/js/script.tagged-events.js`,
          domain: plausibleDomain,
        }
      : null;

  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim() || null;

  return { plausible, clarityProjectId };
}
