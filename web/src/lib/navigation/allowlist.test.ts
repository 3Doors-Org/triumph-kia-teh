import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isSafeRelativeNavHref } from "@/lib/navigation/allowlist";

describe("navigation href allowlist", () => {
  it("accepts known safe public routes", () => {
    assert.equal(isSafeRelativeNavHref("/about"), true);
    assert.equal(isSafeRelativeNavHref("/research"), true);
  });

  it("rejects dangerous and non-allowlisted values", () => {
    assert.equal(isSafeRelativeNavHref("javascript:alert(1)"), false);
    assert.equal(isSafeRelativeNavHref("https://evil.example"), false);
    assert.equal(isSafeRelativeNavHref("/admin"), false);
    assert.equal(isSafeRelativeNavHref("/totally-unknown"), false);
  });
});
