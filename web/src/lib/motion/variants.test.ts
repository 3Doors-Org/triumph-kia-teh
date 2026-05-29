import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { fadeInUpVariants, routeFadeVariants, staggerChildrenVariants } from "@/lib/motion";

describe("motion variants", () => {
  it("returns no translate when reduced motion is true", () => {
    const variants = fadeInUpVariants(true);
    assert.deepEqual(variants.hidden, { opacity: 0 });
    assert.deepEqual(variants.visible, { opacity: 1 });
  });

  it("returns animated route fade when reduced motion is false", () => {
    const variants = routeFadeVariants(false);
    assert.equal(typeof variants.initial, "object");
    assert.equal(typeof variants.animate, "object");
    assert.equal(typeof variants.exit, "object");
  });

  it("returns zero-duration stagger transitions in reduced motion", () => {
    const variants = staggerChildrenVariants(true);
    const visible = variants.visible as { transition?: { duration?: number } };
    assert.equal(visible.transition?.duration, 0);
  });
});
