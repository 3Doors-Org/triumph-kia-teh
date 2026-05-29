import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { sanitizeHtml } from "@/lib/security/sanitize-html";

describe("sanitizeHtml", () => {
  it("removes script and keeps allowed tags", () => {
    const html = `<p>Hello</p><script>alert(1)</script>`;
    const sanitized = sanitizeHtml(html, "rich-content");
    assert.match(sanitized, /<p>Hello<\/p>/);
    assert.doesNotMatch(sanitized, /<script/i);
  });

  it("blocks svg and mathml bypass vectors", () => {
    const html = `<svg><a xlink:href="javascript:alert(1)">x</a></svg><math><mi>x</mi></math><p>safe</p>`;
    const sanitized = sanitizeHtml(html, "rich-content");
    assert.doesNotMatch(sanitized, /<svg|<math|javascript:/i);
    assert.match(sanitized, /<p>safe<\/p>/);
  });
});
