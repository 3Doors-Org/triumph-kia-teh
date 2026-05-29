import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildWritingListQuery,
  parseWritingListFiltersForPage,
  parseWritingListQueryFromSearchParams,
} from "@/lib/writing/filters";

describe("writing list filters", () => {
  it("parses valid query params for API validation", () => {
    const params = new URLSearchParams("door=ACCESS&tag=systems&search=access&limit=10");
    const parsed = parseWritingListQueryFromSearchParams(params);
    assert.equal(parsed.ok, true);
    if (parsed.ok) {
      assert.equal(parsed.data.door, "ACCESS");
      assert.equal(parsed.data.tag, "systems");
      assert.equal(parsed.data.search, "access");
      assert.equal(parsed.data.limit, 10);
    }
  });

  it("rejects invalid door for strict API parse", () => {
    const params = new URLSearchParams("door=INVALID");
    const parsed = parseWritingListQueryFromSearchParams(params);
    assert.equal(parsed.ok, false);
  });

  it("rejects limit out of range", () => {
    const params = new URLSearchParams("limit=500");
    const parsed = parseWritingListQueryFromSearchParams(params);
    assert.equal(parsed.ok, false);
  });

  it("parses lenient page filters ignoring invalid door", () => {
    const params = new URLSearchParams("door=INVALID&tag=equity");
    const filters = parseWritingListFiltersForPage(params);
    assert.equal(filters.door, undefined);
    assert.equal(filters.tag, "equity");
  });

  it("builds shareable URLs with stable ordering", () => {
    const href = buildWritingListQuery({ door: "ACCESS", tag: "policy" }, { cursor: "abc" });
    assert.ok(href.startsWith("/writing?"));
    assert.ok(href.includes("door=ACCESS"));
    assert.ok(href.includes("tag=policy"));
    assert.ok(href.includes("cursor=abc"));
  });

  it("treats empty query values as absent", () => {
    const params = new URLSearchParams("door=&tag=systems");
    const parsed = parseWritingListQueryFromSearchParams(params);
    assert.equal(parsed.ok, true);
    if (parsed.ok) {
      assert.equal(parsed.data.door, undefined);
      assert.equal(parsed.data.tag, "systems");
    }
  });
});
