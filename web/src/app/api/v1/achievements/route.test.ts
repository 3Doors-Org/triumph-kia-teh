import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GET } from "./route";

describe("GET /api/v1/achievements", () => {
  it("returns 200 with data envelope", async () => {
    const request = new Request("http://localhost:3000/api/v1/achievements");
    const response = await GET(request);
    assert.equal(response.status, 200);
    const body = (await response.json()) as { data?: unknown[] };
    assert.ok(Array.isArray(body.data));
  });

  it("returns 400 for invalid cursor token", async () => {
    const request = new Request("http://localhost:3000/api/v1/achievements?cursor=%%%");
    const response = await GET(request);
    assert.equal(response.status, 400);
  });
});
