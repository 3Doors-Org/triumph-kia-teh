import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { filterMetricsForRole } from "@/lib/admin/dashboard-metrics";

describe("filterMetricsForRole", () => {
  const metrics = [
    { label: "Posts", value: 10 },
    { label: "Leads", value: 3, ownerOnly: true },
  ];

  it("keeps owner-only metrics for owners", () => {
    const result = filterMetricsForRole(metrics, "owner");
    assert.equal(result.length, 2);
  });

  it("removes owner-only metrics for editors", () => {
    const result = filterMetricsForRole(metrics, "editor");
    assert.equal(result.length, 1);
    assert.equal(result[0]?.label, "Posts");
  });
});
