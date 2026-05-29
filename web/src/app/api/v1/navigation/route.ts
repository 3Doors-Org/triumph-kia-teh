import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/lib/api/error-response";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { revalidateSiteConfig, SITE_CONFIG_TAGS } from "@/lib/cache/site-config";
import { db } from "@/lib/db";
import { navigationConfig } from "@/lib/db/schema";
import { isSafeRelativeNavHref } from "@/lib/navigation/allowlist";
import { getCachedPublicNavigation, visibleNavItems } from "@/lib/navigation/public-data";
import { getClientIp } from "@/lib/security/privacy";
import { enforcePublicReadRateLimit } from "@/lib/security/rate-limit";
import { logNavigationAudit } from "@/lib/observability/logger";

const navItemSchema = z
  .object({
    label: z.string().trim().min(1).max(100),
    href: z.string().trim().min(1).max(200),
    enabled: z.boolean().optional(),
  })
  .strict();

const navigationPatchSchema = z
  .object({
    navItems: z.array(navItemSchema).min(1).max(30),
    footerLinks: z.array(navItemSchema).min(1).max(30),
  })
  .strict();

function validateNavHrefFields(
  items: z.infer<typeof navItemSchema>[],
  ctx: z.RefinementCtx,
  pathPrefix: "navItems" | "footerLinks",
) {
  items.forEach((item, index) => {
    if (!isSafeRelativeNavHref(item.href)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "URL is not on the allowlist or uses an unsafe path",
        path: [pathPrefix, index, "href"],
      });
    }
  });
}

export async function GET(request: Request) {
  const ip = getClientIp(request.headers) ?? "unknown";
  const rate = await enforcePublicReadRateLimit(ip);
  if (rate && !rate.success) {
    const retryAfter = Math.max(1, Math.ceil((rate.reset - Date.now()) / 1000));
    return apiError({ error: "Too Many Requests", retryAfter }, 429, {
      "Retry-After": String(retryAfter),
    });
  }

  const { navItems, footerLinks, updatedAt } = await getCachedPublicNavigation();
  return NextResponse.json({
    navItems: visibleNavItems(navItems),
    footerLinks: visibleNavItems(footerLinks),
    updatedAt,
  });
}

export async function PATCH(request: Request) {
  try {
    const session = await requireRole(["owner"]);
    const raw = await request.json();
    const parsed = navigationPatchSchema
      .superRefine((body, ctx) => {
        validateNavHrefFields(body.navItems, ctx, "navItems");
        validateNavHrefFields(body.footerLinks, ctx, "footerLinks");
      })
      .parse(raw);

    const normalizedNav = parsed.navItems.map((item) => ({
      label: item.label,
      href: item.href.trim(),
      enabled: item.enabled !== false,
    }));
    const normalizedFooter = parsed.footerLinks.map((item) => ({
      label: item.label,
      href: item.href.trim(),
      enabled: item.enabled !== false,
    }));

    await db
      .update(navigationConfig)
      .set({
        navItems: normalizedNav,
        footerLinks: normalizedFooter,
        updatedAt: new Date(),
      })
      .where(eq(navigationConfig.id, 1));

    revalidateSiteConfig(SITE_CONFIG_TAGS.navigation);
    logNavigationAudit({ event: "navigation_updated", actorUserId: session.user.id });

    return NextResponse.json({
      ok: true,
      navItems: normalizedNav,
      footerLinks: normalizedFooter,
    });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      const fields: Record<string, string> = {};
      for (const issue of error.issues) {
        const key = issue.path.length > 0 ? issue.path.join(".") : "payload";
        if (!(key in fields)) fields[key] = issue.message;
      }
      return apiError({ error: "Validation failed", fields }, 400);
    }
    throw error;
  }
}
