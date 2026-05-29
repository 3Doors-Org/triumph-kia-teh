import { z } from "zod";

import {
  EXIT_INTENT_CONTEXT_KEYS,
  type ExitIntentContextKey,
} from "@/lib/exit-intent/contexts";
import { normalizeExitIntentCtaUrl } from "@/lib/exit-intent/cta-url";

export const contextBlockSchema = z
  .object({
    headline: z.string().trim().min(1).max(200),
    supportingLine: z.string().trim().max(500).optional().default(""),
    ctaLabel: z.string().trim().min(1).max(120),
    ctaUrl: z.string().trim().min(1).max(2000),
    dismissText: z.string().trim().max(80).optional().default(""),
    triggerDelayMs: z.coerce.number().int().min(0).max(600_000).optional(),
  })
  .strict();

export const exitIntentContextsSchema = z
  .record(z.enum(EXIT_INTENT_CONTEXT_KEYS), contextBlockSchema)
  .superRefine((record, ctx) => {
    for (const [_key, block] of Object.entries(record)) {
      const normalized = normalizeExitIntentCtaUrl(block.ctaUrl);
      if (!normalized) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid CTA URL",
          path: [_key, "ctaUrl"],
        });
      }
    }
  });

export type ExitIntentContextBlock = z.infer<typeof contextBlockSchema>;

export const exitIntentPatchSchema = z
  .object({
    isActive: z.boolean().optional(),
    triggerDelayMs: z.coerce.number().int().min(0).max(600_000).optional(),
    contexts: z
      .partialRecord(z.enum(EXIT_INTENT_CONTEXT_KEYS), contextBlockSchema)
      .optional(),
  })
  .strict()
  .refine((body) => body.isActive !== undefined || body.triggerDelayMs !== undefined || body.contexts, {
    message: "No updates provided",
  });

export type ExitIntentPublicContext = ExitIntentContextBlock & { ctaUrl: string };

export function stripContextsForPublic(
  contexts: Partial<Record<ExitIntentContextKey, ExitIntentContextBlock>>,
): Partial<Record<ExitIntentContextKey, ExitIntentPublicContext>> {
  const out: Partial<Record<ExitIntentContextKey, ExitIntentPublicContext>> = {};
  for (const key of EXIT_INTENT_CONTEXT_KEYS) {
    const block = contexts[key];
    if (!block) continue;
    const url = normalizeExitIntentCtaUrl(block.ctaUrl);
    if (!url) continue;
    out[key] = {
      ...block,
      ctaUrl: url,
      supportingLine: block.supportingLine ?? "",
      dismissText: block.dismissText ?? "Not now",
    };
  }
  return out;
}
