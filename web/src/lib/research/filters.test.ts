import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  parseResearchListQueryFromSearchParams,
  parseResearchStatusForPage,
} from "@/lib/research/filters";

describe("research filters", () => {
  it("parses valid query", () => {
    const params = new URLSearchParams("status=published&limit=10");
    const parsed = parseResearchListQueryFromSearchParams(params);
    assert.equal(parsed.ok, true);
    if (parsed.ok) {
      assert.equal(parsed.data.status, "published");
      assert.equal(parsed.data.limit, 10);
    }
  });

  it("rejects invalid status", () => {
    const params = new URLSearchParams("status=invalid");
    const parsed = parseResearchListQueryFromSearchParams(params);
    assert.equal(parsed.ok, false);
  });

  it("parses page status leniently", () => {
    const params = new URLSearchParams("status=in_progress");
    assert.equal(parseResearchStatusForPage(params), "in_progress");
  });

  it("returns undefined for invalid page status", () => {
    const params = new URLSearchParams("status=nope");
    assert.equal(parseResearchStatusForPage(params), undefined);
  });
});
