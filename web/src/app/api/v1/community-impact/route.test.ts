import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GET } from "./route";

describe("GET /api/v1/community-impact", () => {
  it("returns 400 for invalid door", async () => {
    const request = new Request("http://localhost:3000/api/v1/community-impact?door=BAD");
    const response = await GET(request);
    assert.equal(response.status, 400);
  });

  it("returns 400 for malformed since filter", async () => {
    const request = new Request("http://localhost:3000/api/v1/community-impact?since=2024/01/01");
    const response = await GET(request);
    assert.equal(response.status, 400);
  });

  it("returns 400 for invalid cursor", async () => {
    const request = new Request("http://localhost:3000/api/v1/community-impact?cursor=%%%");
    const response = await GET(request);
    assert.equal(response.status, 400);
  });

  it("supports combined valid filters", async () => {
    const request = new Request(
      "http://localhost:3000/api/v1/community-impact?door=ACCESS&type=education&org=3doors&since=2024-01-01",
    );
    const response = await GET(request);
    assert.equal(response.status, 200);
    const body = (await response.json()) as { data?: unknown[]; nextCursor?: string | null };
    assert.ok(Array.isArray(body.data));
    assert.ok("nextCursor" in body);
  });
});
