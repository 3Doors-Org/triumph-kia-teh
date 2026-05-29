import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GET } from "./route";

describe("GET /api/v1/writing", () => {
  it("returns 400 for invalid door", async () => {
    const request = new Request("http://localhost:3000/api/v1/writing?door=NOT_A_DOOR");
    const response = await GET(request);
    assert.equal(response.status, 400);
    const body = (await response.json()) as { error?: string; fields?: Record<string, string> };
    assert.equal(body.error, "Validation failed");
    assert.ok(body.fields?.door);
  });

  it("returns 400 for invalid cursor token", async () => {
    const request = new Request("http://localhost:3000/api/v1/writing?cursor=%%%");
    const response = await GET(request);
    assert.equal(response.status, 400);
    const body = (await response.json()) as { fields?: Record<string, string> };
    assert.ok(body.fields?.cursor);
  });

  it("returns 400 for limit above maximum", async () => {
    const request = new Request("http://localhost:3000/api/v1/writing?limit=999");
    const response = await GET(request);
    assert.equal(response.status, 400);
  });
});
