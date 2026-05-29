import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { PATCH } from "./route";

describe("PATCH /api/v1/community-impact/[id]", () => {
  it("returns 400 for malformed id params", async () => {
    const request = new Request("http://localhost:3000/api/v1/community-impact/not-a-uuid", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: "Impact title",
        summary: "Impact summary",
        door: "ACCESS",
        type: "education",
        metric: { label: "People reached", value: 10 },
        isPublished: true,
      }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: "not-a-uuid" }) });
    assert.equal(response.status, 400);
  });
});
