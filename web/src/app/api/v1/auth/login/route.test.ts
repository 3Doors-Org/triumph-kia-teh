import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { POST } from "./route";

describe("POST /api/v1/auth/login", () => {
  it("returns 403 when origin or referer headers are missing", async () => {
    const request = new Request("http://localhost:3000/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "nobody@example.com", password: "notarealpassword" }),
    });
    const response = await POST(request);
    assert.equal(response.status, 403);
  });

  it("returns 400 for malformed body", async () => {
    const request = new Request("http://localhost:3000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "http://localhost:3000",
        referer: "http://localhost:3000/admin/login",
      },
      body: JSON.stringify({ email: "bad", password: "x" }),
    });
    const response = await POST(request);
    assert.equal(response.status, 400);
  });

  it("returns 401 for invalid credentials", async () => {
    const request = new Request("http://localhost:3000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "http://localhost:3000",
        referer: "http://localhost:3000/admin/login",
      },
      body: JSON.stringify({ email: "nobody@example.com", password: "notarealpassword" }),
    });
    const response = await POST(request);
    assert.equal(response.status, 401);
  });
});
