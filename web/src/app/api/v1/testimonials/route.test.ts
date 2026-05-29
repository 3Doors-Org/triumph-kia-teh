import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GET } from "./route";

describe("GET /api/v1/testimonials", () => {
  it("returns 400 for invalid status filter", async () => {
    const response = await GET(new Request("http://localhost:3000/api/v1/testimonials?status=draft"));
    assert.equal(response.status, 400);
  });
});
