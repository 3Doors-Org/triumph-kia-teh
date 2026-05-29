import { getSiteBaseUrl } from "@/lib/seo";

export function isValidSameOriginRequest(request: Request): boolean {
  const siteOrigin = new URL(getSiteBaseUrl()).origin;
  const origin = request.headers.get("origin");
  if (!origin || origin !== siteOrigin) {
    return false;
  }

  const referer = request.headers.get("referer");
  if (!referer) {
    return false;
  }

  try {
    return new URL(referer).origin === siteOrigin;
  } catch {
    return false;
  }
}
