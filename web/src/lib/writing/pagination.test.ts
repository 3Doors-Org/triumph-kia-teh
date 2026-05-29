import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { decodeWritingCursor, encodeWritingCursor } from "@/lib/writing/pagination";

describe("writing pagination cursor", () => {
  it("round-trips publishedAt and id", () => {
    const payload = { publishedAt: "2025-01-17T00:00:00.000Z", id: "67bf6d6e-74cf-49ca-ae7f-9c63784d7e4c" };
    const token = encodeWritingCursor(payload);
    assert.deepEqual(decodeWritingCursor(token), payload);
  });

  it("returns null for tampered cursor", () => {
    assert.equal(decodeWritingCursor("not-valid-base64!!!"), null);
  });

  it("returns null when publishedAt is not a date", () => {
    const bad = Buffer.from(JSON.stringify({ publishedAt: "nope", id: "x" }), "utf8").toString("base64url");
    assert.equal(decodeWritingCursor(bad), null);
  });
});
