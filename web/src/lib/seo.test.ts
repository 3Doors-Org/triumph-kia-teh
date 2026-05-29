import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildPageMetadata, isNonProductionIndexingBlocked } from "@/lib/seo";

describe("seo metadata builder", () => {
  const env = process.env as Record<string, string | undefined>;
  it("builds canonical and social metadata", () => {
    const metadata = buildPageMetadata({
      title: "Test Page",
      description: "Test description",
      canonicalPath: "/test",
    });

    assert.equal(metadata.title, "Test Page");
    assert.equal(metadata.description, "Test description");
    assert.equal(metadata.alternates?.canonical, "/test");
    assert.equal(metadata.openGraph?.url, "/test");
  });

  it("blocks indexing outside production", () => {
    const originalNodeEnv = env.NODE_ENV;
    env.NODE_ENV = "development";
    assert.equal(isNonProductionIndexingBlocked(), true);
    env.NODE_ENV = originalNodeEnv;
  });
});
