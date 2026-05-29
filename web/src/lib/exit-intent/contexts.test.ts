import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resolveExitIntentContextKey } from "@/lib/exit-intent/contexts";
import { normalizeExitIntentCtaUrl } from "@/lib/exit-intent/cta-url";
import { isDesktopExitIntentSignal } from "@/lib/exit-intent/detection";

describe("exit intent context resolution", () => {
  it("maps route prefixes to expected context keys", () => {
    assert.equal(resolveExitIntentContextKey("/"), "home");
    assert.equal(resolveExitIntentContextKey("/writing/sample"), "writing");
    assert.equal(resolveExitIntentContextKey("/research/sample"), "research");
    assert.equal(resolveExitIntentContextKey("/contact"), null);
  });

  it("normalizes and validates CTA URLs", () => {
    assert.equal(normalizeExitIntentCtaUrl("/contact"), "/contact");
    assert.equal(normalizeExitIntentCtaUrl("https://example.com/path"), "https://example.com/path");
    assert.equal(normalizeExitIntentCtaUrl("javascript:alert(1)"), null);
  });

  it("uses top-edge desktop threshold detection", () => {
    assert.equal(isDesktopExitIntentSignal({ clientY: 10 } as MouseEvent), true);
    assert.equal(isDesktopExitIntentSignal({ clientY: 30 } as MouseEvent), false);
  });
});
