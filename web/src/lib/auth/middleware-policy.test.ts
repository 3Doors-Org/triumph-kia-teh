import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { evaluateAdminMiddlewarePolicy } from "@/lib/auth/middleware-policy";

describe("admin middleware policy", () => {
  it("allows public non-admin routes", () => {
    const decision = evaluateAdminMiddlewarePolicy({
      pathname: "/writing",
      isAuthenticated: false,
    });
    assert.equal(decision.type, "next");
  });

  it("redirects unauthenticated admin access to login with callback", () => {
    const decision = evaluateAdminMiddlewarePolicy({
      pathname: "/admin/research",
      isAuthenticated: false,
    });
    assert.equal(decision.type, "redirect");
    if (decision.type === "redirect") {
      assert.equal(decision.location, "/admin/login?callbackUrl=%2Fadmin%2Fresearch");
    }
  });

  it("allows unauthenticated users on /admin/login", () => {
    const decision = evaluateAdminMiddlewarePolicy({
      pathname: "/admin/login",
      isAuthenticated: false,
    });
    assert.equal(decision.type, "next");
  });

  it("redirects authenticated users away from /admin/login", () => {
    const decision = evaluateAdminMiddlewarePolicy({
      pathname: "/admin/login",
      isAuthenticated: true,
    });
    assert.equal(decision.type, "redirect");
    if (decision.type === "redirect") {
      assert.equal(decision.location, "/admin");
    }
  });
});
