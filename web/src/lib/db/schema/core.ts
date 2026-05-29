import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import type { AboutPageContent } from "@/lib/about/about-page-types";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: varchar("role", { length: 20 }).notNull().default("editor"),
    name: varchar("name", { length: 100 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    emailUnique: uniqueIndex("users_email_unique").on(table.email),
  }),
);

export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 64 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    door: varchar("door", { length: 20 }).notNull(),
    mission: text("mission").notNull(),
    externalUrl: text("external_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    slugUnique: uniqueIndex("organizations_slug_unique").on(table.slug),
  }),
);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull(),
    summary: varchar("summary", { length: 500 }),
    tags: text("tags")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    bodyJson: jsonb("body_json").$type<Record<string, unknown>>().notNull(),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    door: varchar("door", { length: 20 }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    slugUnique: uniqueIndex("posts_slug_unique").on(table.slug),
    publishedDoorIdx: index("posts_published_door_idx").on(table.status, table.door),
    tagsGinIdx: index("posts_tags_gin_idx").using("gin", table.tags),
  }),
);

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  inquiryType: varchar("inquiry_type", { length: 50 }).notNull(),
  message: text("message").notNull(),
  sourcePage: varchar("source_page", { length: 120 }).notNull().default("/contact"),
  ipHash: varchar("ip_hash", { length: 128 }),
  userAgentHash: varchar("user_agent_hash", { length: 128 }),
  status: varchar("status", { length: 20 }).notNull().default("new"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const orgMetrics = pgTable(
  "org_metrics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orgId: uuid("org_id").references(() => organizations.id, {
      onDelete: "set null",
    }),
    label: varchar("label", { length: 120 }).notNull(),
    value: integer("value").notNull(),
    suffix: varchar("suffix", { length: 30 }).notNull().default("+"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orgIdIdx: index("org_metrics_org_id_idx").on(table.orgId),
  }),
);

export const communityImpactEntries = pgTable(
  "community_impact_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 180 }).notNull(),
    summary: text("summary").notNull(),
    door: varchar("door", { length: 20 }).notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    orgSlug: varchar("org_slug", { length: 64 }),
    metricLabel: varchar("metric_label", { length: 100 }).notNull(),
    metricValue: integer("metric_value").notNull(),
    startDate: timestamp("start_date", { withTimezone: true }),
    isPublished: boolean("is_published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    doorIdx: index("community_impact_door_idx").on(table.door),
    typeIdx: index("community_impact_type_idx").on(table.type),
  }),
);

export const researchItems = pgTable(
  "research_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 200 }).notNull(),
    title: varchar("title", { length: 220 }).notNull(),
    summary: text("summary").notNull(),
    abstract: text("abstract").notNull(),
    authors: text("authors")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    venue: varchar("venue", { length: 220 }),
    status: varchar("status", { length: 32 }).notNull().default("published"),
    externalUrl: text("external_url"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    isPublished: boolean("is_published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    slugUnique: uniqueIndex("research_items_slug_unique").on(table.slug),
    publishedStatusIdx: index("research_items_published_status_idx").on(table.isPublished, table.status),
    publishedAtIdx: index("research_items_published_at_idx").on(table.publishedAt),
  }),
);

export const achievements = pgTable(
  "achievements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 220 }).notNull(),
    summary: text("summary").notNull(),
    category: varchar("category", { length: 80 }).notNull(),
    venue: varchar("venue", { length: 200 }),
    achievedAt: timestamp("achieved_at", { withTimezone: true }),
    externalUrl: text("external_url"),
    isPublished: boolean("is_published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    publishedAchievedAtIdx: index("achievements_published_achieved_at_idx").on(
      table.isPublished,
      table.achievedAt,
    ),
    categoryIdx: index("achievements_category_idx").on(table.category),
  }),
);

export const mediaAppearances = pgTable(
  "media_appearances",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 220 }).notNull(),
    outlet: varchar("outlet", { length: 220 }).notNull(),
    format: varchar("format", { length: 32 }).notNull(),
    summary: text("summary").notNull(),
    externalUrl: text("external_url").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    isPublished: boolean("is_published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    publishedAtIdx: index("media_appearances_published_at_idx").on(table.isPublished, table.publishedAt),
    formatIdx: index("media_appearances_format_idx").on(table.format),
  }),
);

export const testimonials = pgTable(
  "testimonials",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    authorName: varchar("author_name", { length: 150 }).notNull(),
    authorTitle: varchar("author_title", { length: 200 }),
    authorOrganization: varchar("author_organization", { length: 200 }),
    quote: text("quote").notNull(),
    status: varchar("status", { length: 20 }).notNull().default("published"),
    avatarUrl: text("avatar_url"),
    sortOrder: integer("sort_order").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    publishedSortIdx: index("testimonials_published_sort_idx").on(table.isPublished, table.sortOrder, table.id),
    statusIdx: index("testimonials_status_idx").on(table.status),
  }),
);

export const assets = pgTable(
  "assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    filename: varchar("filename", { length: 255 }).notNull(),
    storageKey: text("storage_key").notNull(),
    publicUrl: text("public_url").notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    fileSizeBytes: integer("file_size_bytes").notNull(),
    width: integer("width"),
    height: integer("height"),
    altText: text("alt_text"),
    contentId: uuid("content_id"),
    contentType: varchar("content_type", { length: 100 }),
    uploadStatus: varchar("upload_status", { length: 20 }).notNull().default("pending"),
    uploadedByUserId: uuid("uploaded_by_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    storageKeyUnique: uniqueIndex("assets_storage_key_unique").on(table.storageKey),
    uploadedByIdx: index("assets_uploaded_by_idx").on(table.uploadedByUserId),
    mimeTypeIdx: index("assets_mime_type_idx").on(table.mimeType),
    createdAtIdx: index("assets_created_at_idx").on(table.createdAt),
    contentRefIdx: index("assets_content_ref_idx").on(table.contentId, table.contentType),
    statusIdx: index("assets_upload_status_idx").on(table.uploadStatus),
  }),
);

export const siteProfile = pgTable("site_profile", {
  id: integer("id").primaryKey().default(1),
  portraitPublicUrl: text("portrait_public_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const aboutPageConfig = pgTable("about_page_config", {
  id: integer("id").primaryKey().default(1),
  content: jsonb("content").$type<AboutPageContent>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const navigationConfig = pgTable("navigation_config", {
  id: integer("id").primaryKey().default(1),
  navItems: jsonb("nav_items")
    .$type<Array<{ label: string; href: string; enabled?: boolean }>>()
    .notNull(),
  footerLinks: jsonb("footer_links")
    .$type<Array<{ label: string; href: string; enabled?: boolean }>>()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const exitIntentConfig = pgTable("exit_intent_config", {
  id: integer("id").primaryKey().default(1),
  isActive: boolean("is_active").notNull().default(true),
  triggerDelayMs: integer("trigger_delay_ms").notNull().default(3000),
  contexts: jsonb("contexts")
    .$type<
      Record<
        string,
        {
          headline: string;
          supportingLine?: string;
          ctaLabel: string;
          ctaUrl: string;
          dismissText?: string;
          triggerDelayMs?: number;
        }
      >
    >()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
