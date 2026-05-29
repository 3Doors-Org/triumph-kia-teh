import { NextResponse } from "next/server";

import { blocklistSessionToken } from "@/lib/auth/blocklist";
import { clearAuthCookies, AUTH_SESSION_COOKIE_CANDIDATES } from "@/lib/auth/cookies";
import { isValidSameOriginRequest } from "@/lib/auth/same-origin";
import { apiError } from "@/lib/api/error-response";

function readSessionTokenFromCookieHeader(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  for (const cookieName of AUTH_SESSION_COOKIE_CANDIDATES) {
    const match = cookieHeader.match(new RegExp(`${cookieName}=([^;]+)`));
    if (match?.[1]) {
      return decodeURIComponent(match[1]);
    }
  }
  return null;
}

export async function POST(request: Request) {
  if (!isValidSameOriginRequest(request)) {
    return apiError({ error: "Forbidden" }, 403);
  }

  const token = readSessionTokenFromCookieHeader(request);
  if (token) {
    await blocklistSessionToken(token, 60 * 60 * 8);
  }

  const response = NextResponse.json({ ok: true }, { status: 200 });
  clearAuthCookies(response);
  return response;
}
