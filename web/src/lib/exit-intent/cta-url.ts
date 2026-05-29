import { isSafeRelativeNavHref } from "@/lib/navigation/allowlist";
import { normalizePublicHttpUrl } from "@/lib/security/url";

export function normalizeExitIntentCtaUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/")) {
    return isSafeRelativeNavHref(trimmed) ? trimmed : null;
  }
  return normalizePublicHttpUrl(trimmed);
}
