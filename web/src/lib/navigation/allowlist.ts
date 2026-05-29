import {
  ORGANIZATION_SLUGS,
  organizationPublicProfilePath,
} from "@/lib/organizations/slugs";
import { routes } from "@/lib/routes";

const STATIC_ALLOWLIST = new Set<string>([
  routes.public.home,
  routes.public.about,
  routes.public.organizations,
  routes.public.communityImpact,
  routes.public.achievements,
  routes.public.media,
  routes.public.writing,
  routes.public.research,
  routes.public.contact,
  routes.public.testimonials,
]);

for (const slug of ORGANIZATION_SLUGS) {
  STATIC_ALLOWLIST.add(organizationPublicProfilePath(slug));
}

const RESERVED_PREFIXES = ["/api", "/admin", "/_next", "/dev"];

export function isSafeRelativeNavHref(href: string): boolean {
  const trimmed = href.trim();
  if (trimmed.length === 0 || trimmed.length > 200) return false;
  if (!trimmed.startsWith("/")) return false;
  if (trimmed.startsWith("//") || trimmed.includes("\\")) return false;
  if (trimmed.includes("://")) return false;
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("vbscript:")) return false;
  if (RESERVED_PREFIXES.some((p) => trimmed === p || trimmed.startsWith(`${p}/`))) {
    return false;
  }
  if (trimmed.startsWith("/organizations/")) {
    const slug = trimmed.slice("/organizations/".length).split("/")[0] ?? "";
    return slug.length > 0 && /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/.test(slug);
  }
  return STATIC_ALLOWLIST.has(trimmed);
}

export function listAllPublicNavAllowlistHrefs(): string[] {
  return [...STATIC_ALLOWLIST].sort();
}
