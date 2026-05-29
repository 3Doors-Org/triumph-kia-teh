import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import type { AboutPageContent } from "@/lib/about/about-page-types";
import { DEFAULT_ABOUT_PAGE_CONTENT } from "@/lib/about/default-about-content";
import { parseAboutContentFromDb } from "@/lib/about/normalize-about-content";
import { CONTENT_TAGS } from "@/lib/cache/revalidate-content";
import { db } from "@/lib/db";
import { aboutPageConfig } from "@/lib/db/schema";

export async function getAboutPageContent(): Promise<AboutPageContent> {
  try {
    const [row] = await db
      .select({ content: aboutPageConfig.content })
      .from(aboutPageConfig)
      .where(eq(aboutPageConfig.id, 1))
      .limit(1);

    if (!row?.content) {
      return DEFAULT_ABOUT_PAGE_CONTENT;
    }

    return parseAboutContentFromDb(row.content);
  } catch {
    return DEFAULT_ABOUT_PAGE_CONTENT;
  }
}

export const getCachedAboutPageContent = unstable_cache(
  async () => getAboutPageContent(),
  ["about-page-content"],
  { tags: [CONTENT_TAGS.aboutPage], revalidate: 300 },
);
