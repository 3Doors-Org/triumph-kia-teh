import { eq } from "drizzle-orm";

import { NavigationEditorForm } from "@/components/admin/navigation-editor-form";
import { requireRole } from "@/lib/auth/require-role";
import { db } from "@/lib/db";
import { navigationConfig } from "@/lib/db/schema";
import { listAllPublicNavAllowlistHrefs } from "@/lib/navigation/allowlist";
import { normalizeNavigationItems, type PublicNavItem } from "@/lib/navigation/public-data";

export default async function NavigationAdminPage() {
  await requireRole(["owner"]);
  const [row] = await db
    .select({
      navItems: navigationConfig.navItems,
      footerLinks: navigationConfig.footerLinks,
    })
    .from(navigationConfig)
    .where(eq(navigationConfig.id, 1))
    .limit(1);

  const navItems: PublicNavItem[] =
    row?.navItems && row.navItems.length > 0 ? normalizeNavigationItems(row.navItems) : [];
  const footerLinks: PublicNavItem[] =
    row?.footerLinks && row.footerLinks.length > 0 ? normalizeNavigationItems(row.footerLinks) : [];

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Navigation</h1>
        <p className="text-sm text-(--color-muted-fg)">
          Labels, ordering, visibility, and hrefs are constrained to audited public routes to prevent open
          redirects.
        </p>
      </header>
      <NavigationEditorForm
        initialNavItems={navItems}
        initialFooterLinks={footerLinks}
        allowedHrefPrefixes={listAllPublicNavAllowlistHrefs()}
      />
    </section>
  );
}
