export type AdminMiddlewareDecision =
  | { type: "next" }
  | { type: "redirect"; location: string };

export function evaluateAdminMiddlewarePolicy(input: {
  pathname: string;
  isAuthenticated: boolean;
}): AdminMiddlewareDecision {
  const { pathname, isAuthenticated } = input;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  if (!isAdminRoute) {
    return { type: "next" };
  }

  if (isLoginRoute && isAuthenticated) {
    return { type: "redirect", location: "/admin" };
  }

  if (!isLoginRoute && !isAuthenticated) {
    const callback = encodeURIComponent(pathname);
    return { type: "redirect", location: `/admin/login?callbackUrl=${callback}` };
  }

  return { type: "next" };
}
