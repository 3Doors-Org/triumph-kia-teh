import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildCommunityImpactQuery,
  parseCommunityImpactCursor,
  parseCommunityImpactFilters,
  parseCommunityImpactFiltersForApi,
  parseCommunityImpactFiltersFromSearchParams,
} from "@/lib/community-impact/filters";

describe("community impact filters", () => {
  it("parses valid filters", () => {
    const filters = parseCommunityImpactFilters({
      door: "ACCESS",
      type: "education",
      org: "3doors",
      since: "2025-01-01",
    });

    assert.deepEqual(filters, {
      door: "ACCESS",
      type: "education",
      org: "3doors",
      since: "2025-01-01",
    });
  });

  it("returns empty object for invalid shape", () => {
    const filters = parseCommunityImpactFilters({ door: 4 });
    assert.deepEqual(filters, {});
  });

  it("rejects invalid api filters", () => {
    const parsed = parseCommunityImpactFiltersForApi({ door: "INVALID", since: "2024/01/01" });
    assert.equal(parsed.ok, false);
  });

  it("builds query from filter object", () => {
    const query = buildCommunityImpactQuery({
      door: "ACCESS",
      type: "education",
      since: "2025-01-01",
    });

    assert.equal(query, "?door=ACCESS&type=education&since=2025-01-01");
  });

  it("builds query including cursor", () => {
    const query = buildCommunityImpactQuery({ door: "ACCESS" }, { cursor: "abc123" });
    assert.equal(query, "?door=ACCESS&cursor=abc123");
  });

  it("parses filters from URLSearchParams", () => {
    const params = new URLSearchParams("door=ACCESS&org=3doors&since=2024-01-01");
    const filters = parseCommunityImpactFiltersFromSearchParams(params);
    assert.equal(filters.door, "ACCESS");
    assert.equal(filters.org, "3doors");
    assert.equal(filters.since, "2024-01-01");
  });

  it("parses cursor safely", () => {
    assert.equal(parseCommunityImpactCursor("cursor-token"), "cursor-token");
    assert.equal(parseCommunityImpactCursor(42), undefined);
  });
});
