import { desc, eq } from "drizzle-orm";
import type { MetadataRoute } from "next";

import { routes } from "@/lib/routes";
import { db } from "@/lib/db";
import { posts, researchItems } from "@/lib/db/schema";
import { getSiteBaseUrl } from "@/lib/seo";

type DynamicSitemapItem = {
  path: string;
  updatedAt?: Date | null;
};

export function getStaticSitemapPaths(): string[] {
  return [
    routes.public.home,
    routes.public.about,
    routes.public.organizations,
    routes.public.org3doors,
    routes.public.orgPalaverInstitute,
    routes.public.orgDewiseFoundation,
    routes.public.communityImpact,
    routes.public.achievements,
    routes.public.media,
    routes.public.writing,
    routes.public.research,
    routes.public.contact,
  ];
}

function absoluteUrl(path: string): string {
  const base = getSiteBaseUrl().replace(/\/+$/, "");
  return `${base}${path}`;
}

export function buildSitemapEntries(
  staticPaths: string[],
  dynamicItems: DynamicSitemapItem[],
): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: absoluteUrl(path),
  }));

  const dynamicEntries: MetadataRoute.Sitemap = dynamicItems
    .slice()
    .sort((a, b) => {
      const aTime = a.updatedAt?.getTime() ?? 0;
      const bTime = b.updatedAt?.getTime() ?? 0;
      return bTime - aTime;
    })
    .map((item) => ({
      url: absoluteUrl(item.path),
      lastModified: item.updatedAt ?? undefined,
    }));

  return [...staticEntries, ...dynamicEntries];
}

export async function getDynamicSitemapItems(): Promise<DynamicSitemapItem[]> {
  try {
    const [writingRows, researchRows] = await Promise.all([
      db
        .select({
          slug: posts.slug,
          updatedAt: posts.updatedAt,
        })
        .from(posts)
        .where(eq(posts.status, "published"))
        .orderBy(desc(posts.updatedAt)),
      db
        .select({
          slug: researchItems.slug,
          updatedAt: researchItems.updatedAt,
        })
        .from(researchItems)
        .where(eq(researchItems.isPublished, true))
        .orderBy(desc(researchItems.updatedAt)),
    ]);

    return [
      ...writingRows.map((row) => ({
        path: routes.public.writingBySlug(row.slug),
        updatedAt: row.updatedAt,
      })),
      ...researchRows.map((row) => ({
        path: routes.public.researchBySlug(row.slug),
        updatedAt: row.updatedAt,
      })),
    ];
  } catch {
    return [];
  }
}
