import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { PATCH } from "./route";

describe("PATCH /api/v1/research/by-id/[id]", () => {
  it("returns 400 for malformed id params", async () => {
    const request = new Request("http://localhost:3000/api/v1/research/by-id/not-a-uuid", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: "Valid title",
        slug: "valid-title",
        summary: "Valid summary",
        abstract: "Valid abstract",
        status: "published",
        isPublished: true,
      }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: "not-a-uuid" }) });
    assert.equal(response.status, 400);
  });
});
