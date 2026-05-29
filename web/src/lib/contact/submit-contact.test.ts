import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { submitContact } from "@/lib/contact/submit-contact";

const basePayload = {
  name: "Test User",
  email: "test@example.com",
  inquiryType: "general",
  message: "This is a sufficiently long message for validation.",
  website: "",
  turnstileToken: "token",
  sourcePage: "/contact",
};

describe("submitContact", () => {
  const env = process.env as Record<string, string | undefined>;
  it("returns validation failed for invalid payload", async () => {
    const result = await submitContact(
      { name: "" },
      { ip: "1.1.1.1", userAgent: "ua" },
      {
        enforceRateLimit: async () => null,
        verifyTurnstile: async () => ({ success: true, reason: null }),
        insertLead: async () => ({ id: "lead-1" }),
        notifyLead: async () => {},
      },
    );

    assert.equal(result.status, 400);
  });

  it("returns silent success for honeypot submissions", async () => {
    const result = await submitContact(
      { ...basePayload, website: "bot-fill" },
      { ip: "1.1.1.1", userAgent: "ua" },
      {
        enforceRateLimit: async () => null,
        verifyTurnstile: async () => ({ success: true, reason: null }),
        insertLead: async () => ({ id: "lead-1" }),
        notifyLead: async () => {},
      },
    );

    assert.deepEqual(result, { status: 200, body: { success: true } });
  });

  it("returns 429 when rate limit rejects", async () => {
    const result = await submitContact(
      basePayload,
      { ip: "1.1.1.1", userAgent: "ua" },
      {
        enforceRateLimit: async () => ({ success: false, reset: Date.now() + 10_000 }),
        verifyTurnstile: async () => ({ success: true, reason: null }),
        insertLead: async () => ({ id: "lead-1" }),
        notifyLead: async () => {},
      },
    );

    assert.equal(result.status, 429);
  });

  it("returns 400 when turnstile verification fails", async () => {
    const previousNodeEnv = env.NODE_ENV;
    env.NODE_ENV = "development";
    try {
      const result = await submitContact(
        basePayload,
        { ip: "1.1.1.1", userAgent: "ua" },
        {
          enforceRateLimit: async () => ({ success: true, reset: Date.now() + 60_000 }),
          verifyTurnstile: async () => ({ success: false, reason: "invalid_token" }),
          insertLead: async () => ({ id: "lead-1" }),
          notifyLead: async () => {},
        },
      );

      assert.equal(result.status, 400);
    } finally {
      env.NODE_ENV = previousNodeEnv;
    }
  });

  it("returns 503 when turnstile secret is missing", async () => {
    const previousNodeEnv = env.NODE_ENV;
    env.NODE_ENV = "development";
    try {
      const result = await submitContact(
        basePayload,
        { ip: "1.1.1.1", userAgent: "ua" },
        {
          enforceRateLimit: async () => ({ success: true, reset: Date.now() + 60_000 }),
          verifyTurnstile: async () => ({ success: false, reason: "missing_secret" }),
          insertLead: async () => ({ id: "lead-1" }),
          notifyLead: async () => {},
        },
      );

      assert.equal(result.status, 503);
    } finally {
      env.NODE_ENV = previousNodeEnv;
    }
  });

  it("returns 201 on valid submission", async () => {
    let notificationCalls = 0;
    const result = await submitContact(
      basePayload,
      { ip: "1.1.1.1", userAgent: "ua" },
      {
        enforceRateLimit: async () => ({ success: true, reset: Date.now() + 60_000 }),
        verifyTurnstile: async () => ({ success: true, reason: null }),
        insertLead: async () => ({ id: "lead-123" }),
        notifyLead: async () => {
          notificationCalls += 1;
        },
      },
    );

    assert.equal(result.status, 201);
    if (result.status === 201) {
      assert.equal(result.body.leadId, "lead-123");
    }
    assert.equal(notificationCalls, 1);
  });

  it("allows e2e token bypass in non-production", async () => {
    const env = process.env as Record<string, string | undefined>;
    const previousNodeEnv = env.NODE_ENV;
    env.NODE_ENV = "development";
    try {
      const result = await submitContact(
        { ...basePayload, turnstileToken: "e2e-test-token" },
        { ip: "1.1.1.1", userAgent: "ua" },
        {
          enforceRateLimit: async () => ({ success: true, reset: Date.now() + 60_000 }),
          verifyTurnstile: async () => ({ success: false, reason: "invalid_token" }),
          insertLead: async () => ({ id: "lead-e2e" }),
          notifyLead: async () => {},
        },
      );
      assert.equal(result.status, 201);
    } finally {
      env.NODE_ENV = previousNodeEnv;
    }
  });
});
