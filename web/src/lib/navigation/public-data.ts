import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { SITE_CONFIG_TAGS } from "@/lib/cache/site-config";
import { db } from "@/lib/db";
import { navigationConfig } from "@/lib/db/schema";

export type PublicNavItem = { label: string; href: string; enabled: boolean };

const DEFAULT_PUBLIC_NAVIGATION: {
  navItems: PublicNavItem[];
  footerLinks: PublicNavItem[];
} = {
  navItems: [
    { label: "About", href: "/about", enabled: true },
    { label: "Organizations", href: "/organizations", enabled: true },
    { label: "Community-Impact", href: "/community-impact", enabled: true },
    { label: "Achievements", href: "/achievements", enabled: true },
    { label: "Media", href: "/media", enabled: true },
    { label: "Writing", href: "/writing", enabled: true },
    { label: "Research", href: "/research", enabled: true },
    { label: "Contact", href: "/contact", enabled: true },
  ],
  footerLinks: [
    { label: "Home", href: "/", enabled: true },
    { label: "About", href: "/about", enabled: true },
  ],
};

function normalizeDisplayLabel(label: string, href: string): string {
  if (href === "/community-impact") return "Community-Impact";
  return label;
}

export function normalizeNavigationItems(
  raw: Array<{ label: string; href: string; enabled?: boolean }>,
): PublicNavItem[] {
  return raw.map((item) => ({
    label: normalizeDisplayLabel(item.label, item.href),
    href: item.href,
    enabled: item.enabled !== false,
  }));
}

async function loadNavigationFromDb(): Promise<{
  navItems: PublicNavItem[];
  footerLinks: PublicNavItem[];
  updatedAt: string;
}> {
  try {
    const [row] = await db
      .select({
        navItems: navigationConfig.navItems,
        footerLinks: navigationConfig.footerLinks,
        updatedAt: navigationConfig.updatedAt,
      })
      .from(navigationConfig)
      .where(eq(navigationConfig.id, 1))
      .limit(1);

    if (!row) {
      return {
        ...DEFAULT_PUBLIC_NAVIGATION,
        updatedAt: new Date(0).toISOString(),
      };
    }

    return {
      navItems: normalizeNavigationItems(row.navItems),
      footerLinks: normalizeNavigationItems(row.footerLinks),
      updatedAt: row.updatedAt.toISOString(),
    };
  } catch {
    return {
      ...DEFAULT_PUBLIC_NAVIGATION,
      updatedAt: new Date(0).toISOString(),
    };
  }
}

export const getCachedPublicNavigation = unstable_cache(
  async () => loadNavigationFromDb(),
  ["public-navigation-v1"],
  { tags: [SITE_CONFIG_TAGS.navigation], revalidate: 300 },
);

export function visibleNavItems(items: PublicNavItem[]): Array<{ label: string; href: string }> {
  return items
    .filter((i) => i.enabled)
    .map(({ label, href }) => ({ label: normalizeDisplayLabel(label, href), href }));
}
