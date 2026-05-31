import { Auth, createActionURL, raw, skipCSRFCheck } from "@auth/core";
import type { AuthConfig } from "@auth/core";
import { AuthError, CredentialsSignin } from "@auth/core/errors";

import { authConfig } from "@/lib/auth/auth";
import { AUTH_SESSION_COOKIE_CANDIDATES } from "@/lib/auth/cookies";

type AuthSessionCookie = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

export type CredentialsLoginResult =
  | { ok: true; cookies: AuthSessionCookie[] }
  | { ok: false; reason: "invalid_credentials" };

const authRuntimeConfig = authConfig as AuthConfig;

function hasSessionCookie(cookies: AuthSessionCookie[]): boolean {
  return cookies.some((cookie) =>
    (AUTH_SESSION_COOKIE_CANDIDATES as readonly string[]).includes(cookie.name),
  );
}

export async function authenticateCredentials(input: {
  email: string;
  password: string;
  callbackUrl?: string;
  requestHeaders: Headers;
}): Promise<CredentialsLoginResult> {
  const headers = new Headers(input.requestHeaders);
  headers.set("Content-Type", "application/x-www-form-urlencoded");

  const signInURL = createActionURL(
    "signin",
    // Auth.js expects the proxy proto header; Next.js sets it in production.
    headers.get("x-forwarded-proto") ?? "https",
    headers,
    process.env,
    authRuntimeConfig,
  );

  const url = `${signInURL}/credentials`.replace("signin", "callback");
  const body = new URLSearchParams({
    email: input.email,
    password: input.password,
    callbackUrl: input.callbackUrl ?? "/admin",
  });
  const req = new Request(url, { method: "POST", headers, body });

  try {
    const res = await Auth(req, { ...authRuntimeConfig, raw, skipCSRFCheck });
    const location = res instanceof Response ? res.headers.get("Location") : res.redirect;
    const cookies = (res?.cookies ?? []) as AuthSessionCookie[];
    if (location?.includes("error=") || !hasSessionCookie(cookies)) {
      return { ok: false, reason: "invalid_credentials" };
    }

    return { ok: true, cookies };
  } catch (error) {
    if (error instanceof CredentialsSignin || error instanceof AuthError) {
      return { ok: false, reason: "invalid_credentials" };
    }
    throw error;
  }
}
