import { getSiteBaseUrl } from "@/lib/seo";

function collectAllowedOrigins(request: Request): Set<string> {
  const origins = new Set<string>();

  const addOrigin = (value: string | undefined) => {
    if (!value) {
      return;
    }
    try {
      origins.add(new URL(value).origin);
    } catch {
      /* ignore malformed URL */
    }
  };

  addOrigin(getSiteBaseUrl());
  addOrigin(process.env.NEXTAUTH_URL);
  addOrigin(process.env.NEXT_PUBLIC_APP_URL);
  addOrigin(process.env.NEXT_PUBLIC_SITE_URL);

  try {
    origins.add(new URL(request.url).origin);
  } catch {
    /* ignore */
  }

  if (process.env.NODE_ENV !== "production" || process.env.CI === "true") {
    origins.add("http://127.0.0.1:3000");
    origins.add("http://localhost:3000");
  }

  return origins;
}

export function isValidSameOriginRequest(request: Request): boolean {
  const allowedOrigins = collectAllowedOrigins(request);
  const origin = request.headers.get("origin");
  if (!origin || !allowedOrigins.has(origin)) {
    return false;
  }

  const referer = request.headers.get("referer");
  if (!referer) {
    return false;
  }

  try {
    return allowedOrigins.has(new URL(referer).origin);
  } catch {
    return false;
  }
}
