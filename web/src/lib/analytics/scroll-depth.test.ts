import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isScrollDepthThreshold, scrollDepthDedupeKey, toScrollDepthEventName } from "./scroll-depth";

describe("scroll depth analytics helpers", () => {
  it("accepts only supported thresholds", () => {
    assert.equal(isScrollDepthThreshold(25), true);
    assert.equal(isScrollDepthThreshold(50), true);
    assert.equal(isScrollDepthThreshold(75), true);
    assert.equal(isScrollDepthThreshold(100), true);
    assert.equal(isScrollDepthThreshold(20), false);
    assert.equal(isScrollDepthThreshold(110), false);
  });

  it("builds stable event names and dedupe keys", () => {
    assert.equal(toScrollDepthEventName(25), "scroll_depth_25");
    assert.equal(toScrollDepthEventName(100), "scroll_depth_100");
    assert.equal(scrollDepthDedupeKey("writing:slug-1", 50), "writing:slug-1:50");
  });
});
