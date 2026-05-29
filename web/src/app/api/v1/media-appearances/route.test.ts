import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GET } from "./route";

describe("GET /api/v1/media-appearances", () => {
  it("returns 400 for invalid format", async () => {
    const request = new Request("http://localhost:3000/api/v1/media-appearances?format=not-real");
    const response = await GET(request);
    assert.equal(response.status, 400);
  });

  it("returns 400 for invalid year", async () => {
    const request = new Request("http://localhost:3000/api/v1/media-appearances?year=199");
    const response = await GET(request);
    assert.equal(response.status, 400);
  });

  it("supports valid combined filters", async () => {
    const request = new Request(
      "http://localhost:3000/api/v1/media-appearances?format=podcast&year=2025",
    );
    const response = await GET(request);
    assert.equal(response.status, 200);
  });
});
