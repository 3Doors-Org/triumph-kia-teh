import { asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { organizations } from "@/lib/db/schema";

export async function listOrganizationsForAdmin() {
  return db
    .select({
      id: organizations.id,
      slug: organizations.slug,
      name: organizations.name,
      door: organizations.door,
      mission: organizations.mission,
      externalUrl: organizations.externalUrl,
      updatedAt: organizations.updatedAt,
    })
    .from(organizations)
    .orderBy(asc(organizations.name));
}

export async function getAdminOrganizationById(id: string) {
  const [row] = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
  return row ?? null;
}
