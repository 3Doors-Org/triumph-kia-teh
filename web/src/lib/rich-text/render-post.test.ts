import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { renderPostBody, sanitizeRichTextHtml } from "@/lib/rich-text/render-post";
import listAndCodeFixture from "@/lib/rich-text/__fixtures__/list-and-code.json";
import maliciousLinkFixture from "@/lib/rich-text/__fixtures__/malicious-link.json";
import safeRichFixture from "@/lib/rich-text/__fixtures__/safe-rich.json";

describe("renderPostBody", () => {
  it("renders and sanitizes expected tags", () => {
    const body = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Heading" }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Safe " },
            {
              type: "text",
              text: "link",
              marks: [{ type: "link", attrs: { href: "https://example.com", target: "_blank" } }],
            },
          ],
        },
      ],
    };

    const rendered = renderPostBody(body);
    assert.match(rendered.html, /<h2>Heading<\/h2>/);
    assert.match(rendered.html, /rel="noopener noreferrer nofollow"/);
    assert.ok(rendered.readingTimeMinutes >= 1);
  });

  it("blocks javascript links", () => {
    const body = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "bad",
              marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }],
            },
          ],
        },
      ],
    };

    const rendered = renderPostBody(body);
    assert.match(rendered.html, /href="#"/);
    assert.doesNotMatch(rendered.html, /javascript:/i);
  });

  it("removes scripts during sanitization", () => {
    const dirty = `<p>Hello</p><script>alert(1)</script>`;
    const clean = sanitizeRichTextHtml(dirty);
    assert.equal(clean.includes("<script"), false);
    assert.match(clean, /<p>Hello<\/p>/);
  });

  it("renders fixture suite safely", () => {
    const fixtures = [
      { name: "safe-rich", input: safeRichFixture },
      { name: "malicious-link", input: maliciousLinkFixture },
      { name: "list-and-code", input: listAndCodeFixture },
    ];

    for (const fixture of fixtures) {
      const rendered = renderPostBody(fixture.input);
      assert.ok(rendered.html.length > 0, `${fixture.name} should produce html`);
      assert.doesNotMatch(rendered.html, /<script|javascript:/i, `${fixture.name} should be sanitized`);
      assert.ok(rendered.readingTimeMinutes >= 1, `${fixture.name} should compute reading time`);
    }
  });
});
