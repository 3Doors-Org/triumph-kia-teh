import type { MetadataRoute } from "next";

import {
  buildSitemapEntries,
  getDynamicSitemapItems,
  getStaticSitemapPaths,
} from "@/lib/seo/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [staticPaths, dynamicItems] = await Promise.all([
    Promise.resolve(getStaticSitemapPaths()),
    getDynamicSitemapItems(),
  ]);

  return buildSitemapEntries(staticPaths, dynamicItems);
}
