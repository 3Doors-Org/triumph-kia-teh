import { NextResponse } from "next/server";
import { z } from "zod";

import { signIn } from "@/lib/auth/auth";
import { isValidSameOriginRequest } from "@/lib/auth/same-origin";
import { AUTH_ERRORS } from "@/lib/auth/errors";
import { apiError } from "@/lib/api/error-response";
import { logAuthAudit } from "@/lib/observability/logger";
import { getClientIp } from "@/lib/security/privacy";
import { enforceAuthLoginRateLimit } from "@/lib/security/rate-limit";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(256),
});

function zodErrorToFields(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : "body";
    if (!(key in fields)) {
      fields[key] = issue.message;
    }
  }
  return fields;
}

export async function POST(request: Request) {
  if (!isValidSameOriginRequest(request)) {
    logAuthAudit({ event: "auth_login_validation_failed", reason: "invalid_same_origin" });
    return apiError({ error: "Forbidden" }, 403);
  }

  const identifier = getClientIp(request.headers) ?? "unknown";
  let emailForRateLimit = "unknown";

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    logAuthAudit({ event: "auth_login_validation_failed", reason: "invalid_json" });
    return apiError({ error: AUTH_ERRORS.validationFailed, fields: { body: "Invalid JSON body" } }, 400);
  }

  const parsed = loginSchema.safeParse(payload);
  if (!parsed.success) {
    logAuthAudit({ event: "auth_login_validation_failed", reason: "invalid_schema" });
    return apiError({ error: AUTH_ERRORS.validationFailed, fields: zodErrorToFields(parsed.error) }, 400);
  }

  emailForRateLimit = parsed.data.email.toLowerCase();
  const authRate = await enforceAuthLoginRateLimit(`${identifier}:${emailForRateLimit}`);
  if (authRate && !authRate.success) {
    const retryAfter = Math.max(1, Math.ceil((authRate.reset - Date.now()) / 1000));
    logAuthAudit({
      event: "auth_login_rate_limited",
      email: emailForRateLimit,
      retryAfter,
    });
    return apiError(
      { error: AUTH_ERRORS.tooManyAttempts, retryAfter },
      429,
      { "Retry-After": String(retryAfter) },
    );
  }

  try {
    await signIn("credentials", {
      email: emailForRateLimit,
      password: parsed.data.password,
      redirect: false,
    });
  } catch {
    logAuthAudit({ event: "auth_login_failed", email: emailForRateLimit, reason: "invalid_credentials" });
    return NextResponse.json({ error: AUTH_ERRORS.invalidCredentials }, { status: 401 });
  }

  logAuthAudit({ event: "auth_login_succeeded", email: emailForRateLimit });
  return NextResponse.json({ ok: true }, { status: 200 });
}
