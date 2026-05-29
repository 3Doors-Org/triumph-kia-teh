import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isKnownOrganizationSlug, isOrganizationSlug, organizationPublicProfilePath } from "@/lib/organizations/slugs";

describe("organization slug guard", () => {
  it("accepts known slugs", () => {
    assert.equal(isKnownOrganizationSlug("3doors"), true);
    assert.equal(isKnownOrganizationSlug("palaverinstitute"), true);
    assert.equal(isKnownOrganizationSlug("dewisefoundation"), true);
  });

  it("validates slug format for routing", () => {
    assert.equal(isOrganizationSlug("3doors"), true);
    assert.equal(isOrganizationSlug("new-partner"), true);
    assert.equal(isOrganizationSlug("unknown"), true);
    assert.equal(isOrganizationSlug(""), false);
    assert.equal(isOrganizationSlug("Bad_Slug"), false);
  });

  it("builds organization profile paths", () => {
    assert.equal(organizationPublicProfilePath("3doors"), "/organizations/3doors");
  });
});
