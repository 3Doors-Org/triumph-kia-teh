import type { MetadataRoute } from "next";

import { getSiteBaseUrl, isNonProductionIndexingBlocked } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const blocked = isNonProductionIndexingBlocked();
  return {
    rules: blocked
      ? [{ userAgent: "*", disallow: "/" }]
      : [{ userAgent: "*", allow: "/" }],
    sitemap: `${getSiteBaseUrl()}/sitemap.xml`,
  };
}
