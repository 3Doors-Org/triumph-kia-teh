import type { Metadata } from "next";

import { OrganizationsOverview } from "@/components/organizations/organizations-pages";
import { getOrganizationsOverview } from "@/lib/data/public-content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Organizations | Triumph Kia Teh",
  description:
    "Explore 3Doors, Palaver Institute, and DeWise Foundation in Triumph Kia Teh's institutional portfolio.",
  canonicalPath: "/organizations",
});

export default async function OrganizationsPage() {
  const organizations = await getOrganizationsOverview();

  return <OrganizationsOverview organizations={organizations} />;
}
