import { eq } from "drizzle-orm";

import { ExitIntentEditorForm } from "@/components/admin/exit-intent-editor-form";
import type { ExitIntentDraftBlock } from "@/components/admin/exit-intent-editor-form";
import { requireRole } from "@/lib/auth/require-role";
import { db } from "@/lib/db";
import { exitIntentConfig } from "@/lib/db/schema";
import { EXIT_INTENT_CONTEXT_KEYS, type ExitIntentContextKey } from "@/lib/exit-intent/contexts";

export default async function ExitIntentAdminPage() {
  await requireRole(["owner"]);
  const [row] = await db
    .select({
      isActive: exitIntentConfig.isActive,
      triggerDelayMs: exitIntentConfig.triggerDelayMs,
      contexts: exitIntentConfig.contexts,
    })
    .from(exitIntentConfig)
    .where(eq(exitIntentConfig.id, 1))
    .limit(1);

  const contexts: Partial<Record<ExitIntentContextKey, Partial<ExitIntentDraftBlock>>> = {};

  if (row) {
    for (const key of EXIT_INTENT_CONTEXT_KEYS) {
      const raw = row.contexts[key];
      if (!raw) continue;
      contexts[key] = {
        headline: raw.headline,
        supportingLine: raw.supportingLine ?? "",
        ctaLabel: raw.ctaLabel,
        ctaUrl: raw.ctaUrl,
        dismissText: raw.dismissText ?? "",
        ...(raw.triggerDelayMs !== undefined ? { contextDelayMs: raw.triggerDelayMs.toString() } : {}),
      };
    }
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Exit intent</h1>
        <p className="text-sm text-(--color-muted-fg)">
          Context-specific copy and CTA destinations must use allowlisted relative paths or https links. The
          `/contact` conversion path is never eligible for exit intent.
        </p>
      </header>
      <ExitIntentEditorForm
        isActive={row?.isActive ?? false}
        triggerDelayMs={row?.triggerDelayMs ?? 5000}
        contexts={contexts}
      />
    </section>
  );
}
