import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { assertEditorialText, lintEditorialText } from "@/lib/editorial/lint";

describe("editorial lint", () => {
  it("flags em dash and emoji", () => {
    const issues = lintEditorialText("title", "A platform — for everyone 🚀");
    assert.equal(issues.length, 2);
  });

  it("throws on prohibited constructs", () => {
    assert.throws(() => assertEditorialText("summary", "Clean sentence — still invalid."));
  });

  it("passes compliant copy", () => {
    assert.doesNotThrow(() => assertEditorialText("summary", "Clean institutional summary."));
  });
});
