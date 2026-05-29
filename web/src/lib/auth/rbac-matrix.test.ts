import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { canRolePerform, type RbacCapability } from "@/lib/auth/rbac-matrix";

const UPDATE_CAPABILITIES: ReadonlyArray<RbacCapability> = [
  "writing.update",
  "research.update",
  "communityImpact.update",
  "achievements.update",
  "media.update",
  "testimonials.update",
  "assets.upload",
  "assets.confirm",
  "assets.list",
];

const DELETE_CAPABILITIES: ReadonlyArray<RbacCapability> = [
  "writing.delete",
  "research.delete",
  "communityImpact.delete",
  "achievements.delete",
  "media.delete",
  "testimonials.delete",
  "assets.delete",
];

describe("RBAC capability matrix", () => {
  it("allows editors to run update and asset workflow capabilities", () => {
    for (const capability of UPDATE_CAPABILITIES) {
      assert.equal(canRolePerform("editor", capability), true, `editor should be allowed: ${capability}`);
    }
  });

  it("blocks editors from destructive delete capabilities", () => {
    for (const capability of DELETE_CAPABILITIES) {
      assert.equal(canRolePerform("editor", capability), false, `editor should be denied: ${capability}`);
    }
  });

  it("allows owners to run both update and delete capabilities", () => {
    for (const capability of [...UPDATE_CAPABILITIES, ...DELETE_CAPABILITIES]) {
      assert.equal(canRolePerform("owner", capability), true, `owner should be allowed: ${capability}`);
    }
  });
});
