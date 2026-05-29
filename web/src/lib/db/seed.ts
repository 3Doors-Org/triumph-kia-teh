import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { DEFAULT_ABOUT_PAGE_CONTENT } from "@/lib/about/default-about-content";
import { withExplicitEducationLocation } from "@/lib/about/normalize-about-content";
import { PORTFOLIO_ACHIEVEMENTS } from "@/lib/achievements/portfolio-achievements-content";
import { COMMUNITY_IMPACT_PORTFOLIO_PROJECTS } from "@/lib/community-impact/portfolio-projects-content";
import { assertEditorialText } from "@/lib/editorial/lint";
import { loadWorkspaceEnvFiles } from "@/lib/env/workspace-env";
import { PORTFOLIO_MEDIA_APPEARANCES } from "@/lib/media/portfolio-media-content";
import { PORTFOLIO_ORG_METRICS } from "@/lib/organizations/portfolio-org-metrics-content";
import { RESEARCH_OUTPUTS } from "@/lib/research/research-content";
import { PORTFOLIO_TESTIMONIALS } from "@/lib/testimonials/portfolio-testimonials-content";
import { PORTFOLIO_WRITING_POSTS } from "@/lib/writing/portfolio-writing-content";
import { normalizePublicHttpUrl } from "@/lib/security/url";

import {
  aboutPageConfig,
  achievements,
  communityImpactEntries,
  exitIntentConfig,
  mediaAppearances,
  navigationConfig,
  orgMetrics,
  siteProfile,
  organizations,
  posts,
  researchItems,
  testimonials,
  users,
} from "./schema";

loadWorkspaceEnvFiles();

const IDS = {
  organization: {
    doors3: "4b1773dd-6f01-4de2-a838-e22d29e9a6e2",
    palaver: "81403be0-116a-4df8-bde2-0b14089bf332",
    dewise: "ef566f26-03c5-42cf-87f4-81fb3ed8f831",
  },
} as const;

function assertSeedConfiguration() {
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

  return { url, seedAdminEmail, seedAdminName, seedAdminPassword };
}

async function main() {
  const { url, seedAdminEmail, seedAdminName, seedAdminPassword } =
    assertSeedConfiguration();
  const pool = new Pool({ connectionString: url });
  const db = drizzle(pool);

  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, seedAdminEmail))
      .limit(1);

    const ownerId = existingUser?.id ?? crypto.randomUUID();

    const passwordHash = await bcrypt.hash(seedAdminPassword, 12);
    if (!existingUser) {
      await db.insert(users).values({
        id: ownerId,
        email: seedAdminEmail,
        name: seedAdminName,
        passwordHash,
        role: "owner",
      });
    } else {
      await db
        .update(users)
        .set({
          name: seedAdminName,
          passwordHash,
          role: "owner",
        })
        .where(eq(users.id, existingUser.id));
    }

    await db
      .insert(organizations)
      .values([
        {
          id: IDS.organization.doors3,
          slug: "3doors",
          name: "3Doors",
          door: "INSTITUTION",
          mission:
            "An independent organization building access, excellence, and opportunity pathways through youth leadership and capability programmes.",
          externalUrl: "https://3doors.org",
        },
        {
          id: IDS.organization.palaver,
          slug: "palaverinstitute",
          name: "Palaver Institute",
          door: "INSTITUTION",
          mission:
            "An independent organization advancing institutional quality through rigorous practice, governance design, and applied research.",
          externalUrl: "https://palaverinstitute.org",
        },
        {
          id: IDS.organization.dewise,
          slug: "dewisefoundation",
          name: "DeWise Foundation",
          door: "INSTITUTION",
          mission:
            "An independent organization building opportunity infrastructure for long-term social mobility and inclusive development.",
          externalUrl: "https://dewisefoundation.org",
        },
      ])
      .onConflictDoUpdate({
        target: organizations.slug,
        set: {
          name: organizations.name,
          door: organizations.door,
          mission: organizations.mission,
          externalUrl: organizations.externalUrl,
        },
      });

    await db.delete(orgMetrics);
    if (PORTFOLIO_ORG_METRICS.length > 0) {
      await db.insert(orgMetrics).values(PORTFOLIO_ORG_METRICS);
    }

    const communityImpactRows = COMMUNITY_IMPACT_PORTFOLIO_PROJECTS.map((p) => ({
      id: p.id,
      title: p.title,
      summary: p.description,
      door: p.door,
      type: p.type,
      orgSlug: p.orgSlug,
      metricLabel: p.metricLabel,
      metricValue: p.metricValue,
      startDate: new Date(p.startDateIso),
      isPublished: true,
      createdAt: new Date(p.createdAtIso),
    }));

    for (const row of communityImpactRows) {
      assertEditorialText("community_impact_entries.title", row.title);
      assertEditorialText("community_impact_entries.summary", row.summary);
    }

    await db.delete(communityImpactEntries);

    await db
      .insert(communityImpactEntries)
      .values(communityImpactRows)
      .onConflictDoUpdate({
        target: communityImpactEntries.id,
        set: {
          title: communityImpactEntries.title,
          summary: communityImpactEntries.summary,
          door: communityImpactEntries.door,
          type: communityImpactEntries.type,
          orgSlug: communityImpactEntries.orgSlug,
          metricLabel: communityImpactEntries.metricLabel,
          metricValue: communityImpactEntries.metricValue,
          startDate: communityImpactEntries.startDate,
          isPublished: communityImpactEntries.isPublished,
          createdAt: communityImpactEntries.createdAt,
        },
      });

    const writingPostRows = PORTFOLIO_WRITING_POSTS.map((row) => ({
      ...row,
      authorId: ownerId,
    }));

    for (const row of writingPostRows) {
      assertEditorialText("posts.title", row.title);
      assertEditorialText("posts.summary", row.summary);
    }

    await db.delete(posts);
    if (writingPostRows.length > 0) {
      await db.insert(posts).values(writingPostRows);
    }

    const researchItemRows = RESEARCH_OUTPUTS;

    for (const row of researchItemRows) {
      assertEditorialText("research_items.title", row.title);
      assertEditorialText("research_items.summary", row.summary);
      assertEditorialText("research_items.abstract", row.abstract);
    }

    await db.delete(researchItems);
    await db.insert(researchItems).values(researchItemRows);

    const achievementRows = PORTFOLIO_ACHIEVEMENTS;

    for (const row of achievementRows) {
      assertEditorialText("achievements.title", row.title);
      assertEditorialText("achievements.summary", row.summary);
    }

    await db.delete(achievements);
    await db.insert(achievements).values(achievementRows);

    const mediaRows = PORTFOLIO_MEDIA_APPEARANCES;

    for (const row of mediaRows) {
      assertEditorialText("media_appearances.title", row.title);
      assertEditorialText("media_appearances.summary", row.summary);
      if (!normalizePublicHttpUrl(row.externalUrl)) {
        throw new Error(`Invalid media external URL for seed row: ${row.id}`);
      }
    }

    await db.delete(mediaAppearances);
    if (mediaRows.length > 0) {
      await db.insert(mediaAppearances).values(mediaRows);
    }

    const testimonialRows = PORTFOLIO_TESTIMONIALS;

    for (const row of testimonialRows) {
      assertEditorialText("testimonials.author_name", row.authorName);
      assertEditorialText("testimonials.quote", row.quote);
    }

    await db.delete(testimonials);
    if (testimonialRows.length > 0) {
      await db.insert(testimonials).values(testimonialRows);
    }

    await db
      .insert(navigationConfig)
      .values({
        id: 1,
        navItems: [
          { label: "About", href: "/about" },
          { label: "Organizations", href: "/organizations" },
          { label: "Community-Impact", href: "/community-impact" },
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
      .onConflictDoUpdate({
        target: navigationConfig.id,
        set: {
          navItems: navigationConfig.navItems,
          footerLinks: navigationConfig.footerLinks,
        },
      });

    await db.insert(siteProfile).values({ id: 1, portraitPublicUrl: null }).onConflictDoNothing();

    const aboutContent = withExplicitEducationLocation(DEFAULT_ABOUT_PAGE_CONTENT);

    await db
      .insert(aboutPageConfig)
      .values({ id: 1, content: aboutContent, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: aboutPageConfig.id,
        set: { content: aboutContent, updatedAt: new Date() },
      });

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
      .onConflictDoUpdate({
        target: exitIntentConfig.id,
        set: {
          contexts: exitIntentConfig.contexts,
          isActive: exitIntentConfig.isActive,
        },
      });
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
