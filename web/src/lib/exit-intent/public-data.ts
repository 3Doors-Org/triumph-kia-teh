import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { SITE_CONFIG_TAGS } from "@/lib/cache/site-config";
import { db } from "@/lib/db";
import { exitIntentConfig } from "@/lib/db/schema";
import { EXIT_INTENT_CONTEXT_KEYS, type ExitIntentContextKey } from "@/lib/exit-intent/contexts";
import { stripContextsForPublic } from "@/lib/exit-intent/schema";
import type { ExitIntentContextBlock } from "@/lib/exit-intent/schema";

export const EXIT_INTENT_SCHEMA_VERSION = 1;

export type PublicExitIntentPayload = {
  schemaVersion: number;
  isActive: boolean;
  triggerDelayMs: number;
  contexts: Partial<Record<ExitIntentContextKey, ExitIntentContextBlock & { ctaUrl: string }>>;
  updatedAt: string;
};

async function loadExitIntentFromDb(): Promise<PublicExitIntentPayload> {
  const [row] = await db
    .select({
      isActive: exitIntentConfig.isActive,
      triggerDelayMs: exitIntentConfig.triggerDelayMs,
      contexts: exitIntentConfig.contexts,
      updatedAt: exitIntentConfig.updatedAt,
    })
    .from(exitIntentConfig)
    .where(eq(exitIntentConfig.id, 1))
    .limit(1);

  if (!row) {
    return {
      schemaVersion: EXIT_INTENT_SCHEMA_VERSION,
      isActive: false,
      triggerDelayMs: 3000,
      contexts: {},
      updatedAt: new Date(0).toISOString(),
    };
  }

  const normalizedContexts: Partial<Record<ExitIntentContextKey, ExitIntentContextBlock>> = {};
  for (const key of EXIT_INTENT_CONTEXT_KEYS) {
    const block = row.contexts[key];
    if (block) {
      normalizedContexts[key] = {
        headline: block.headline,
        supportingLine: block.supportingLine ?? "",
        ctaLabel: block.ctaLabel,
        ctaUrl: block.ctaUrl,
        dismissText: block.dismissText ?? "",
        ...(block.triggerDelayMs !== undefined ? { triggerDelayMs: block.triggerDelayMs } : {}),
      };
    }
  }

  return {
    schemaVersion: EXIT_INTENT_SCHEMA_VERSION,
    isActive: row.isActive,
    triggerDelayMs: row.triggerDelayMs,
    contexts: stripContextsForPublic(normalizedContexts),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export const getCachedExitIntentPublic = unstable_cache(
  async () => loadExitIntentFromDb(),
  ["public-exit-intent-v1"],
  { tags: [SITE_CONFIG_TAGS.exitIntent], revalidate: 300 },
);
