import { isServerTurnstileVerificationBypassed } from "@/lib/contact/turnstile-bypass";
import { logContactAudit, logServerError } from "@/lib/observability/logger";
import { captureServerException } from "@/lib/observability/sentry";
import { contactSchema, type ContactInput } from "@/lib/schemas/contact";
import { hashForPrivacy } from "@/lib/security/privacy";

type RateLimitResult =
  | { success: true; reset: number }
  | { success: false; reset: number };

type SubmitDependencies = {
  enforceRateLimit: (identifier: string) => Promise<RateLimitResult | null>;
  verifyTurnstile: (
    token: string,
    ip: string | null,
  ) => Promise<{ success: boolean; reason: string | null }>;
  insertLead: (input: {
    name: string;
    email: string;
    inquiryType: string;
    message: string;
    sourcePage: string;
    ipHash: string | null;
    userAgentHash: string | null;
    status: string;
  }) => Promise<{ id: string }>;
  notifyLead: (lead: { id: string } & ContactInput) => Promise<void>;
};

export type SubmitContactResult =
  | { status: 200; body: { success: true } }
  | { status: 201; body: { message: string; leadId: string } }
  | { status: 400; body: { error: string; fields?: Record<string, string> } }
  | { status: 429; body: { error: string; retryAfter: number }; retryAfter: number }
  | { status: 500 | 503; body: { error: string } };

export async function submitContact(
  rawBody: unknown,
  context: { ip: string | null; userAgent: string | null },
  deps: SubmitDependencies,
): Promise<SubmitContactResult> {
  const parsed = contactSchema.safeParse(rawBody);
  if (!parsed.success) {
    logContactAudit({ event: "validation_failed", reason: "schema_validation_failed" });
    return {
      status: 400,
      body: {
        error: "Validation failed",
        fields: Object.fromEntries(
          Object.entries(parsed.error.flatten().fieldErrors)
            .map(([key, value]) => [key, value?.[0]])
            .filter((entry): entry is [string, string] => Boolean(entry[1])),
        ),
      },
    };
  }

  if (parsed.data.website.length > 0) {
    logContactAudit({
      event: "lead_rejected_honeypot",
      sourcePage: parsed.data.sourcePage,
      inquiryType: parsed.data.inquiryType,
    });
    return { status: 200, body: { success: true } };
  }

  const identifier = context.ip ?? "unknown";
  const limit = await deps.enforceRateLimit(identifier);
  if (limit && !limit.success) {
    const retryAfter = Math.max(1, Math.ceil((limit.reset - Date.now()) / 1000));
    logContactAudit({
      event: "lead_rate_limited",
      sourcePage: parsed.data.sourcePage,
      inquiryType: parsed.data.inquiryType,
      retryAfter,
    });
    return {
      status: 429,
      body: { error: "Too Many Requests", retryAfter },
      retryAfter,
    };
  }

  const isNonProdTokenBypass =
    process.env.NODE_ENV !== "production" && parsed.data.turnstileToken === "e2e-test-token";

  if (!isServerTurnstileVerificationBypassed() && !isNonProdTokenBypass) {
    const captcha = await deps.verifyTurnstile(parsed.data.turnstileToken, context.ip);
    if (!captcha.success) {
      logContactAudit({
        event: "turnstile_failed",
        sourcePage: parsed.data.sourcePage,
        inquiryType: parsed.data.inquiryType,
        reason: captcha.reason ?? "unknown",
      });
      return {
        status: captcha.reason === "missing_secret" ? 503 : 400,
        body: { error: "CAPTCHA verification failed" },
      };
    }
  }

  try {
    const lead = await deps.insertLead({
      name: parsed.data.name,
      email: parsed.data.email,
      inquiryType: parsed.data.inquiryType,
      message: parsed.data.message,
      sourcePage: parsed.data.sourcePage,
      ipHash: hashForPrivacy(context.ip),
      userAgentHash: hashForPrivacy(context.userAgent),
      status: "new",
    });

    void deps.notifyLead({ ...parsed.data, id: lead.id });
    logContactAudit({
      event: "lead_created",
      sourcePage: parsed.data.sourcePage,
      inquiryType: parsed.data.inquiryType,
      leadId: lead.id,
    });

    return {
      status: 201,
      body: {
        message: "Your message has been received. We will respond within 3 business days.",
        leadId: lead.id,
      },
    };
  } catch (error) {
    captureServerException(error, { domain: "contact", operation: "submit_contact" });
    logServerError("contact_submit_failed", { domain: "contact" });
    return { status: 500, body: { error: "Internal Server Error" } };
  }
}
