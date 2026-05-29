import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Session } from "next-auth";

import { requireRoleFromSession, RoleAccessError } from "@/lib/auth/require-role";

function makeSession(role: "owner" | "editor"): Session {
  return {
    expires: "2099-01-01T00:00:00.000Z",
    user: {
      id: "user-1",
      name: "Test User",
      email: "test@example.com",
      role,
    },
  };
}

describe("requireRoleFromSession", () => {
  it("throws 401 when session is missing", () => {
    assert.throws(() => requireRoleFromSession(null, ["owner"]), (error: unknown) => {
      return error instanceof RoleAccessError && error.status === 401;
    });
  });

  it("throws 403 when role is not permitted", () => {
    assert.throws(
      () => requireRoleFromSession(makeSession("editor"), ["owner"]),
      (error: unknown) => {
        return error instanceof RoleAccessError && error.status === 403;
      },
    );
  });

  it("returns session when role is allowed", () => {
    const session = requireRoleFromSession(makeSession("owner"), ["owner"]);
    assert.equal(session.user.role, "owner");
  });
});
