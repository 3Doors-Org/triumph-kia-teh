import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parseAdminWritingFilters } from "@/lib/admin/writing-list";

describe("parseAdminWritingFilters", () => {
  it("parses valid query values", () => {
    const params = new URLSearchParams("q=opportunity&status=published&page=2&limit=10");
    const parsed = parseAdminWritingFilters(params);
    assert.equal(parsed.q, "opportunity");
    assert.equal(parsed.status, "published");
    assert.equal(parsed.page, 2);
    assert.equal(parsed.limit, 10);
  });

  it("uses defaults when page/limit are missing", () => {
    const params = new URLSearchParams("q=test");
    const parsed = parseAdminWritingFilters(params);
    assert.equal(parsed.page, 1);
    assert.equal(parsed.limit, 20);
  });

  it("rejects unsupported status", () => {
    const params = new URLSearchParams("status=archived");
    assert.throws(() => parseAdminWritingFilters(params));
  });
});
