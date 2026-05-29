import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildBlogPostingJsonLd,
  buildOrganizationJsonLd,
  toJsonLdScriptContent,
} from "@/lib/seo/jsonld";

describe("jsonld builders", () => {
  it("builds parseable blog posting schema with required fields", () => {
    const payload = buildBlogPostingJsonLd({
      title: "Test title",
      slug: "test-title",
      description: "Test description",
      datePublished: "2026-01-01T00:00:00.000Z",
      dateModified: "2026-01-02T00:00:00.000Z",
    });

    const parsed = JSON.parse(toJsonLdScriptContent(payload)) as Record<string, unknown>;
    assert.equal(parsed["@type"], "BlogPosting");
    assert.equal(parsed.headline, "Test title");
    assert.equal(parsed.description, "Test description");
    assert.ok(typeof parsed.url === "string");
  });

  it("builds parseable organization schema with required fields", () => {
    const payload = buildOrganizationJsonLd({
      name: "Palaver Institute",
      slug: "palaverinstitute",
      description: "Mission text",
      externalUrl: "https://palaverinstitute.org",
    });

    const parsed = JSON.parse(toJsonLdScriptContent(payload)) as Record<string, unknown>;
    assert.equal(parsed["@type"], "Organization");
    assert.equal(parsed.name, "Palaver Institute");
    assert.equal(parsed.description, "Mission text");
    assert.ok(typeof parsed.url === "string");
  });
});
