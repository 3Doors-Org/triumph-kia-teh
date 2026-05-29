import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { apiError } from "@/lib/api/error-response";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { revalidateSiteConfig, SITE_CONFIG_TAGS } from "@/lib/cache/site-config";
import { db } from "@/lib/db";
import { exitIntentConfig } from "@/lib/db/schema";
import { EXIT_INTENT_CONTEXT_KEYS } from "@/lib/exit-intent/contexts";
import { normalizeExitIntentCtaUrl } from "@/lib/exit-intent/cta-url";
import {
  EXIT_INTENT_SCHEMA_VERSION,
  getCachedExitIntentPublic,
} from "@/lib/exit-intent/public-data";
import { contextBlockSchema, exitIntentPatchSchema } from "@/lib/exit-intent/schema";
import { logExitIntentAudit } from "@/lib/observability/logger";
import { getClientIp } from "@/lib/security/privacy";
import { enforcePublicReadRateLimit } from "@/lib/security/rate-limit";

export async function GET(request: Request) {
  const ip = getClientIp(request.headers) ?? "unknown";
  const rate = await enforcePublicReadRateLimit(ip);
  if (rate && !rate.success) {
    const retryAfter = Math.max(1, Math.ceil((rate.reset - Date.now()) / 1000));
    return apiError({ error: "Too Many Requests", retryAfter }, 429, {
      "Retry-After": String(retryAfter),
    });
  }

  const payload = await getCachedExitIntentPublic();
  return NextResponse.json(payload);
}

function zodErrorToFields(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "payload";
    if (!(key in fields)) fields[key] = issue.message;
  }
  return fields;
}

export async function PATCH(request: Request) {
  try {
    const session = await requireRole(["owner"]);
    const body = exitIntentPatchSchema.parse(await request.json());

    const [existing] = await db
      .select({
        isActive: exitIntentConfig.isActive,
        triggerDelayMs: exitIntentConfig.triggerDelayMs,
        contexts: exitIntentConfig.contexts,
      })
      .from(exitIntentConfig)
      .where(eq(exitIntentConfig.id, 1))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    let nextIsActive = existing.isActive;
    if (body.isActive !== undefined) {
      nextIsActive = body.isActive;
    }

    let nextDelay = existing.triggerDelayMs;
    if (body.triggerDelayMs !== undefined) {
      nextDelay = body.triggerDelayMs;
    }

    const mergedContexts = { ...existing.contexts };
    if (body.contexts) {
      for (const key of EXIT_INTENT_CONTEXT_KEYS) {
        const incoming = body.contexts[key];
        if (!incoming) {
          continue;
        }
        const parsed = contextBlockSchema.parse(incoming);
        const url = normalizeExitIntentCtaUrl(parsed.ctaUrl);
        if (!url) {
          return apiError(
            { error: "Validation failed", fields: { [`contexts.${key}.ctaUrl`]: "Invalid CTA URL" } },
            400,
          );
        }
        mergedContexts[key] = { ...parsed, ctaUrl: url };
      }
    }

    await db
      .update(exitIntentConfig)
      .set({
        isActive: nextIsActive,
        triggerDelayMs: nextDelay,
        contexts: mergedContexts,
        updatedAt: new Date(),
      })
      .where(eq(exitIntentConfig.id, 1));

    revalidateSiteConfig(SITE_CONFIG_TAGS.exitIntent);
    logExitIntentAudit({ event: "exit_intent_updated", actorUserId: session.user.id });

    const nextPayload = await getCachedExitIntentPublic();
    return NextResponse.json({
      ok: true,
      schemaVersion: EXIT_INTENT_SCHEMA_VERSION,
      config: nextPayload,
    });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof ZodError) {
      return apiError({ error: "Validation failed", fields: zodErrorToFields(error) }, 400);
    }
    throw error;
  }
}
