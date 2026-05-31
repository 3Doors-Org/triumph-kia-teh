import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { evaluateAdminMiddlewarePolicy } from "@/lib/auth/middleware-policy";

function shouldUseSecureSessionCookies(request: NextRequest): boolean {
  if (process.env.NODE_ENV === "production") {
    return true;
  }

  return (
    request.nextUrl.protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https"
  );
}

export async function proxy(request: NextRequest) {
  if (
    process.env.NODE_ENV === "production" &&
    request.nextUrl.pathname.startsWith("/dev")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
      secureCookie: shouldUseSecureSessionCookies(request),
    });
    const decision = evaluateAdminMiddlewarePolicy({
      pathname: request.nextUrl.pathname,
      isAuthenticated: Boolean(token),
    });

    if (decision.type === "redirect") {
      return NextResponse.redirect(new URL(decision.location, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dev/:path*", "/admin/:path*"],
};
