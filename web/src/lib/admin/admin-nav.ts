import { routes } from "@/lib/routes";

export type AdminRole = "owner" | "editor";

export type AdminNavItem = {
  label: string;
  href: string;
  ownerOnly?: boolean;
};

export const adminSiteContentNavItems: ReadonlyArray<AdminNavItem> = [
  { label: "Site content", href: routes.admin.siteContent },
];

export const adminNavItems: ReadonlyArray<AdminNavItem> = [
  { label: "Dashboard", href: routes.admin.dashboard },
  { label: "Profile portrait", href: routes.admin.profilePortrait },
  { label: "Writing", href: routes.admin.writing },
  { label: "Research", href: routes.admin.research },
  { label: "Impact", href: routes.admin.impact },
  { label: "Achievements", href: routes.admin.achievements },
  { label: "Media", href: routes.admin.mediaAppearances },
  { label: "Metrics", href: routes.admin.metrics },
  { label: "Testimonials", href: routes.admin.testimonials },
  { label: "Leads", href: routes.admin.leads, ownerOnly: true },
  { label: "Assets", href: routes.admin.assets },
  { label: "Exit Intent", href: routes.admin.exitIntent, ownerOnly: true },
  { label: "Navigation", href: routes.admin.navigation, ownerOnly: true },
  { label: "Analytics", href: routes.admin.analytics, ownerOnly: true },
] as const;

export function getVisibleAdminNavItems(role: AdminRole): Array<AdminNavItem> {
  const core = role === "owner" ? [...adminNavItems] : adminNavItems.filter((item) => !item.ownerOnly);
  return [...core, ...adminSiteContentNavItems];
}

export function getAdminPageLabel(pathname: string, role: AdminRole): string {
  if (pathname.startsWith(routes.admin.siteContent)) {
    if (pathname.includes("/about")) return "About page";
    if (pathname.includes("/organizations")) return "Organizations";
    return "Site content";
  }
  const visibleItems = getVisibleAdminNavItems(role);
  const matched =
    visibleItems.find((item) => pathname === item.href) ??
    visibleItems.find((item) => pathname.startsWith(`${item.href}/`));
  return matched?.label ?? "Admin";
}
