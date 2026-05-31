import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const AUTH_SESSION_COOKIE_CANDIDATES = [
  "__Secure-authjs.session-token",
  "authjs.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
] as const;

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function isSessionCookieName(name: string): name is (typeof AUTH_SESSION_COOKIE_CANDIDATES)[number] {
  return (AUTH_SESSION_COOKIE_CANDIDATES as readonly string[]).includes(name);
}

/** Attach session cookies returned by Auth.js onto an API response. */
export function applyAuthResponseCookies(
  response: NextResponse,
  authCookies: Array<{ name: string; value: string; options?: Record<string, unknown> }>,
) {
  for (const cookie of authCookies) {
    if (!isSessionCookieName(cookie.name)) {
      continue;
    }

    response.cookies.set({
      name: cookie.name,
      value: cookie.value,
      ...(cookie.options as Omit<ResponseCookie, "name" | "value">),
    });
  }
}

/** Copy Auth.js session cookies from the request store onto an API response. */
export async function forwardAuthSessionCookies(response: NextResponse) {
  const cookieStore = await cookies();

  for (const cookieName of AUTH_SESSION_COOKIE_CANDIDATES) {
    const cookie = cookieStore.get(cookieName);
    if (!cookie) {
      continue;
    }

    response.cookies.set({
      name: cookie.name,
      value: cookie.value,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
  }
}

export function clearAuthCookies(response: NextResponse) {
  for (const cookieName of AUTH_SESSION_COOKIE_CANDIDATES) {
    response.cookies.set({
      name: cookieName,
      value: "",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      expires: new Date(0),
    });
  }
}
