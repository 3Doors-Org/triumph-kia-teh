import { revalidatePath, revalidateTag } from "next/cache";

import { logContentRevalidation } from "@/lib/observability/logger";

export const CONTENT_TAGS = {
  writing: "content:writing",
  research: "content:research",
  communityImpact: "content:community-impact",
  achievements: "content:achievements",
  mediaAppearances: "content:media-appearances",
  aboutPage: "content:about-page",
  testimonials: "content:testimonials",
  organizations: "content:organizations",
} as const;

const CONTENT_PATHS = {
  writing: ["/", "/writing"] as const,
  research: ["/research"] as const,
  communityImpact: ["/community-impact"] as const,
  achievements: ["/achievements"] as const,
  mediaAppearances: ["/media"] as const,
  aboutPage: ["/about"] as const,
  testimonials: ["/testimonials"] as const,
  organizations: ["/organizations"] as const,
} as const;

const REVALIDATE_COALESCE_WINDOW_MS = 1200;
const recentRevalidations = new Map<string, number>();

export type RevalidateContentTarget = keyof typeof CONTENT_TAGS;

export function revalidateContent(target: RevalidateContentTarget, options?: { slug?: string }): {
  executed: boolean;
  reason: "ok" | "coalesced";
} {
  const now = Date.now();
  const scopeKey = `${target}:${options?.slug ?? ""}`;
  const previousAt = recentRevalidations.get(scopeKey);
  if (previousAt && now - previousAt < REVALIDATE_COALESCE_WINDOW_MS) {
    logContentRevalidation({
      event: "revalidate_coalesced",
      target,
      slug: options?.slug,
      coalescedWindowMs: REVALIDATE_COALESCE_WINDOW_MS,
    });
    return { executed: false, reason: "coalesced" };
  }

  recentRevalidations.set(scopeKey, now);

  revalidateTag(CONTENT_TAGS[target], "max");
  for (const path of CONTENT_PATHS[target]) {
    revalidatePath(path);
  }

  if (target === "writing" && options?.slug) {
    revalidatePath(`/writing/${options.slug}`);
  }
  if (target === "research" && options?.slug) {
    revalidatePath(`/research/${options.slug}`);
  }
  if (target === "organizations" && options?.slug) {
    revalidatePath(`/organizations/${options.slug}`);
  }

  logContentRevalidation({
    event: "revalidate_executed",
    target,
    slug: options?.slug,
    coalescedWindowMs: REVALIDATE_COALESCE_WINDOW_MS,
  });
  return { executed: true, reason: "ok" };
}
