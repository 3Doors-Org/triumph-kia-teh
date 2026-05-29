import type { NextResponse } from "next/server";

export const AUTH_SESSION_COOKIE_CANDIDATES = [
  "__Secure-authjs.session-token",
  "authjs.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
] as const;

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
