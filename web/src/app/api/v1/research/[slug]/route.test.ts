import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GET } from "./route";

describe("GET /api/v1/research/[slug]", () => {
  it("returns 400 for malformed slug", async () => {
    const request = new Request("http://localhost:3000/api/v1/research/..%2Fetc%2Fpasswd");
    const response = await GET(request, { params: Promise.resolve({ slug: "../etc/passwd" }) });
    assert.equal(response.status, 400);
  });
});
