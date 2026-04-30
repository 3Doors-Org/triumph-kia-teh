import bcrypt from "bcryptjs";
import { config as loadEnv } from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import {
  exitIntentConfig,
  navigationConfig,
  organizations,
  users,
} from "./schema";

loadEnv({ path: "../.env" });
loadEnv();

async function main() {
  if (process.env.ALLOW_SEED !== "true") {
    throw new Error("Refusing to run seed without ALLOW_SEED=true");
  }

  if (process.env.NODE_ENV === "production" && process.env.ALLOW_PROD_SEED !== "true") {
    throw new Error("Refusing to run seed in production without ALLOW_PROD_SEED=true");
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required for seeding");
  }

  const seedAdminEmail = process.env.SEED_ADMIN_EMAIL;
  const seedAdminName = process.env.SEED_ADMIN_NAME;
  const seedAdminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!seedAdminEmail || !seedAdminName || !seedAdminPassword) {
    throw new Error(
      "SEED_ADMIN_EMAIL, SEED_ADMIN_NAME, and SEED_ADMIN_PASSWORD are required for seeding",
    );
  }

  const pool = new Pool({ connectionString: url });
  const db = drizzle(pool);

  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, seedAdminEmail))
      .limit(1);

    if (!existingUser) {
      const passwordHash = await bcrypt.hash(seedAdminPassword, 12);
      await db.insert(users).values({
        email: seedAdminEmail,
        name: seedAdminName,
        passwordHash,
        role: "owner",
      });
    }

    await db
      .insert(organizations)
      .values([
        {
          slug: "3doors",
          name: "3Doors",
          door: "ACCESS",
          mission: "Opening access pathways for young people across communities.",
          externalUrl: "https://3doors.org",
        },
        {
          slug: "palaverinstitute",
          name: "Palaver Institute",
          door: "EXCELLENCE",
          mission: "Advancing institutional quality through rigorous practice and research.",
          externalUrl: "https://palaverinstitute.org",
        },
        {
          slug: "dewisefoundation",
          name: "DeWise Foundation",
          door: "OPPORTUNITY",
          mission: "Building opportunity infrastructure for long-term social mobility.",
          externalUrl: "https://dewisefoundation.org",
        },
      ])
      .onConflictDoNothing();

    await db
      .insert(navigationConfig)
      .values({
        id: 1,
        navItems: [
          { label: "Organizations", href: "/organizations" },
          { label: "Community Impact", href: "/community-impact" },
          { label: "Achievements", href: "/achievements" },
          { label: "Media", href: "/media" },
          { label: "Writing", href: "/writing" },
          { label: "Research", href: "/research" },
          { label: "Contact", href: "/contact" },
        ],
        footerLinks: [
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
        ],
      })
      .onConflictDoNothing();

    await db
      .insert(exitIntentConfig)
      .values({
        id: 1,
        isActive: true,
        contexts: {
          home: {
            headline: "Stay connected with Triumph's weekly frameworks.",
            ctaLabel: "Follow on LinkedIn",
            ctaUrl: "https://linkedin.com/in/triumphkiateh",
          },
        },
      })
      .onConflictDoNothing();
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
