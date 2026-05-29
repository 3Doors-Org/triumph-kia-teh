import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { POST } from "./route";

describe("POST /api/v1/auth/logout", () => {
  it("rejects missing origin/referer", async () => {
    const request = new Request("http://localhost:3000/api/v1/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await POST(request);
    assert.equal(response.status, 403);
  });

  it("clears auth cookies for valid same-origin request", async () => {
    const request = new Request("http://localhost:3000/api/v1/auth/logout", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
        referer: "http://localhost:3000/admin",
        cookie: "authjs.session-token=example-token",
      },
    });
    const response = await POST(request);
    assert.equal(response.status, 200);
    const setCookie = response.headers.get("set-cookie") ?? "";
    assert.match(setCookie, /authjs\.session-token/i);
  });
});
