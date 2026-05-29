import { sql, count, eq, desc } from "drizzle-orm";
import { Redis } from "@upstash/redis";

import { db } from "@/lib/db";
import { leads, posts, researchItems } from "@/lib/db/schema";
import { routes } from "@/lib/routes";

import type { AdminRole } from "./admin-nav";

type HealthStatus = "ok" | "error" | "unavailable";

export type DashboardMetric = {
  label: string;
  value: number;
  ownerOnly?: boolean;
};

export type DashboardHealth = {
  database: HealthStatus;
  redis: HealthStatus;
};

export type DashboardQuickAction = {
  label: string;
  href: string;
  description: string;
};

export type DashboardSnapshot = {
  metrics: Array<DashboardMetric>;
  health: DashboardHealth;
  quickActions: Array<DashboardQuickAction>;
};

export async function getDashboardSnapshot(role: AdminRole): Promise<DashboardSnapshot> {
  const [metrics, health] = await Promise.all([getDashboardMetrics(), getDashboardHealth()]);
  return {
    metrics: filterMetricsForRole(metrics, role),
    health,
    quickActions: getQuickActionsForRole(role),
  };
}

async function getDashboardMetrics(): Promise<Array<DashboardMetric>> {
  const [
    totalPostsRow,
    publishedPostsRow,
    researchPublishedRow,
    unreadLeadsRow,
    totalLeadsRow,
    recentPostsRow,
    recentResearchRow,
  ] = await Promise.all([
    db.select({ value: count() }).from(posts),
    db.select({ value: count() }).from(posts).where(eq(posts.status, "published")),
    db.select({ value: count() }).from(researchItems).where(eq(researchItems.isPublished, true)),
    db.select({ value: count() }).from(leads).where(eq(leads.status, "new")),
    db.select({ value: count() }).from(leads),
    db.select({ value: count() }).from(posts).where(sql`${posts.updatedAt} >= now() - interval '7 days'`),
    db
      .select({ value: count() })
      .from(researchItems)
      .where(sql`${researchItems.updatedAt} >= now() - interval '7 days'`),
  ]);

  const totalPosts = Number(totalPostsRow[0]?.value ?? 0);
  const publishedPosts = Number(publishedPostsRow[0]?.value ?? 0);
  const researchPublished = Number(researchPublishedRow[0]?.value ?? 0);
  const unreadLeads = Number(unreadLeadsRow[0]?.value ?? 0);
  const totalLeads = Number(totalLeadsRow[0]?.value ?? 0);
  const recentPosts = Number(recentPostsRow[0]?.value ?? 0);
  const recentResearch = Number(recentResearchRow[0]?.value ?? 0);

  return [
    { label: "Posts (total)", value: totalPosts },
    { label: "Posts (published)", value: publishedPosts },
    { label: "Research (published)", value: researchPublished },
    { label: "Updates (last 7 days)", value: recentPosts + recentResearch },
    { label: "Leads (unread)", value: unreadLeads, ownerOnly: true },
    { label: "Leads (total)", value: totalLeads, ownerOnly: true },
  ];
}

async function getDashboardHealth(): Promise<DashboardHealth> {
  const [database, redis] = await Promise.all([getDatabaseHealth(), getRedisHealth()]);
  return { database, redis };
}

async function getDatabaseHealth(): Promise<HealthStatus> {
  try {
    await db.execute(sql`select 1`);
    return "ok";
  } catch {
    return "error";
  }
}

async function getRedisHealth(): Promise<HealthStatus> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return "unavailable";
  }

  try {
    const redis = new Redis({ url, token });
    await redis.ping();
    return "ok";
  } catch {
    return "error";
  }
}

export function filterMetricsForRole(metrics: Array<DashboardMetric>, role: AdminRole): Array<DashboardMetric> {
  if (role === "owner") {
    return metrics;
  }
  return metrics.filter((metric) => !metric.ownerOnly);
}

function getQuickActionsForRole(role: AdminRole): Array<DashboardQuickAction> {
  const actions: Array<DashboardQuickAction> = [
    {
      label: "Update home portrait",
      href: routes.admin.profilePortrait,
      description: "Upload the portrait shown on the public home hero.",
    },
    {
      label: "Review writing queue",
      href: "/admin/writing",
      description: "Open draft and published writing posts.",
    },
    {
      label: "Review research updates",
      href: "/admin/research",
      description: "Review research entries and publication state.",
    },
  ];

  if (role === "owner") {
    actions.push({
      label: "Triage new leads",
      href: "/admin/leads",
      description: "Check unread leads and assign follow-up.",
    });
  }

  return actions;
}

export async function getRecentAdminActivity(limit: number = 5) {
  const safeLimit = Math.max(1, Math.min(limit, 20));
  const postActivity = await db
    .select({
      id: posts.id,
      title: posts.title,
      status: posts.status,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .orderBy(desc(posts.updatedAt))
    .limit(safeLimit);

  return postActivity;
}
