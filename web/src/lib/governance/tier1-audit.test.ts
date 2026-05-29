import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getDoorTaxonomyViolations,
  getTier1RequiredRoutes,
  getTier1RouteCoverage,
} from "@/lib/governance/tier1-audit";

describe("tier 1 governance audit", () => {
  it("includes required tier 1 routes", () => {
    const routes = getTier1RequiredRoutes();
    assert.ok(routes.includes("/about"));
    assert.ok(routes.includes("/organizations"));
  });

  it("reports no missing tier 1 routes in route registry", () => {
    const coverage = getTier1RouteCoverage();
    assert.equal(coverage.every((item) => item.exists), true);
  });

  it("keeps taxonomy labels aligned to ACCESS/EXCELLENCE/OPPORTUNITY", () => {
    const violations = getDoorTaxonomyViolations();
    assert.equal(violations.length, 0);
  });
});
