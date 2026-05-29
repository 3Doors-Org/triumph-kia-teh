import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parseAdminResearchFilters } from "@/lib/admin/research-list";

describe("parseAdminResearchFilters", () => {
  it("parses valid query values", () => {
    const params = new URLSearchParams("q=infrastructure&status=published&page=2&limit=10");
    const parsed = parseAdminResearchFilters(params);
    assert.equal(parsed.q, "infrastructure");
    assert.equal(parsed.status, "published");
    assert.equal(parsed.page, 2);
    assert.equal(parsed.limit, 10);
  });

  it("uses defaults when page/limit are absent", () => {
    const parsed = parseAdminResearchFilters(new URLSearchParams());
    assert.equal(parsed.page, 1);
    assert.equal(parsed.limit, 20);
  });

  it("rejects unsupported status", () => {
    assert.throws(() => parseAdminResearchFilters(new URLSearchParams("status=archived")));
  });
});
