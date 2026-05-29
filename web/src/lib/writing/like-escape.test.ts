import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { escapeIlikeFragment } from "@/lib/writing/like-escape";

describe("escapeIlikeFragment", () => {
  it("escapes wildcard characters", () => {
    assert.equal(escapeIlikeFragment("100%_match"), "100\\%\\_match");
  });

  it("escapes backslashes", () => {
    assert.equal(escapeIlikeFragment("a\\b"), "a\\\\b");
  });
});
