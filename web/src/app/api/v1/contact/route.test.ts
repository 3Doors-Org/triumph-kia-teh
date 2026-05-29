import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { POST } from "./route";

describe("POST /api/v1/contact route", () => {
  it("returns safe validation error for non-JSON body", async () => {
    const request = new Request("http://localhost:3000/api/v1/contact", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "plain-text",
    });

    const response = await POST(request);
    assert.equal(response.status, 400);
    const body = (await response.json()) as { error?: string };
    assert.equal(body.error, "Validation failed");
  });
});
