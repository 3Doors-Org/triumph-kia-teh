import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DELETE } from "./route";

describe("DELETE /api/v1/assets/[id]", () => {
  it("returns 400 for malformed id params", async () => {
    const response = await DELETE(new Request("http://localhost:3000/api/v1/assets/not-a-uuid"), {
      params: Promise.resolve({ id: "not-a-uuid" }),
    });
    assert.equal(response.status, 400);
  });
});
