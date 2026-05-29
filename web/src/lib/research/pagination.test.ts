import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { decodeResearchCursor, encodeResearchCursor } from "@/lib/research/pagination";

describe("research pagination", () => {
  it("round-trips cursor payload", () => {
    const payload = {
      createdAt: "2026-05-07T10:00:00.000Z",
      id: "2e03ca14-fb6d-4f14-a1eb-f06066c4c6a1",
    };
    const token = encodeResearchCursor(payload);
    assert.deepEqual(decodeResearchCursor(token), payload);
  });

  it("returns null for invalid cursor", () => {
    assert.equal(decodeResearchCursor("invalid%%%"), null);
  });
});
