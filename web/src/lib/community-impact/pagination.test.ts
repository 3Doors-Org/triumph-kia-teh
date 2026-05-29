import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  decodeCommunityImpactCursor,
  encodeCommunityImpactCursor,
} from "@/lib/community-impact/pagination";

describe("community impact pagination cursor", () => {
  it("encodes and decodes cursor payload", () => {
    const payload = { createdAt: "2026-05-04T09:00:00.000Z", id: "test-id" };
    const cursor = encodeCommunityImpactCursor(payload);
    assert.deepEqual(decodeCommunityImpactCursor(cursor), payload);
  });

  it("returns null for invalid cursor", () => {
    assert.equal(decodeCommunityImpactCursor("not-a-valid-cursor"), null);
  });
});
