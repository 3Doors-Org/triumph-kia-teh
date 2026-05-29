import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { siteProfile } from "@/lib/db/schema";

export type SiteProfileRow = {
  id: number;
  portraitPublicUrl: string | null;
  updatedAt: Date;
};

export async function getSiteProfile(): Promise<SiteProfileRow | null> {
  try {
    const [row] = await db.select().from(siteProfile).where(eq(siteProfile.id, 1)).limit(1);
    return row ?? null;
  } catch {
    return null;
  }
}

export async function upsertSiteProfilePortrait(portraitPublicUrl: string | null): Promise<void> {
  await db
    .insert(siteProfile)
    .values({
      id: 1,
      portraitPublicUrl,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: siteProfile.id,
      set: {
        portraitPublicUrl,
        updatedAt: new Date(),
      },
    });
}
