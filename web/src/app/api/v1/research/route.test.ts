import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GET } from "./route";

describe("GET /api/v1/research", () => {
  it("returns 400 for invalid status filter", async () => {
    const request = new Request("http://localhost:3000/api/v1/research?status=bad_status");
    const response = await GET(request);
    assert.equal(response.status, 400);
  });

  it("returns 400 for invalid cursor token", async () => {
    const request = new Request("http://localhost:3000/api/v1/research?cursor=%%%invalid");
    const response = await GET(request);
    assert.equal(response.status, 400);
  });
});
