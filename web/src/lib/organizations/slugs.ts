export const ORGANIZATION_SLUGS = [
  "3doors",
  "palaverinstitute",
  "dewisefoundation",
] as const;

export type OrganizationSlug = (typeof ORGANIZATION_SLUGS)[number];

const organizationSlugSet = new Set<string>(ORGANIZATION_SLUGS);

export function isKnownOrganizationSlug(slug: string): slug is OrganizationSlug {
  return organizationSlugSet.has(slug);
}

export function isOrganizationSlug(slug: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/.test(slug);
}

export function organizationPublicProfilePath(slug: string): string {
  return `/organizations/${slug}`;
}
