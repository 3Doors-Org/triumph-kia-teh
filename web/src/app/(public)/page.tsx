import type { Metadata } from "next";

import { HomePageSections } from "@/components/home/home-page-sections";
import { getHomeData } from "@/lib/data/public-content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Triumph Kia Teh | Practitioner, scholar, and institution builder",
  description:
    "Institutional platform for writing, community impact, and organization-led systems across access, excellence, and opportunity.",
  canonicalPath: "/",
});

export default async function HomePage() {
  const { metrics, featuredOrganizations, featuredWriting, portraitPublicUrl } = await getHomeData();

  return (
    <HomePageSections
      metrics={metrics}
      organizations={featuredOrganizations}
      writing={featuredWriting}
      portraitPublicUrl={portraitPublicUrl}
    />
  );
}
