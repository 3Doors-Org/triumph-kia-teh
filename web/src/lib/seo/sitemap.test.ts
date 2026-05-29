import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildSitemapEntries, getStaticSitemapPaths } from "@/lib/seo/sitemap";

describe("sitemap helpers", () => {
  it("contains required static public routes and excludes admin paths", () => {
    const paths = getStaticSitemapPaths();
    assert.ok(paths.includes("/about"));
    assert.ok(paths.includes("/writing"));
    assert.ok(paths.includes("/research"));
    assert.equal(paths.some((path) => path.startsWith("/admin")), false);
  });

  it("orders dynamic entries by last modified and emits valid dates", () => {
    const entries = buildSitemapEntries(
      ["/"],
      [
        { path: "/writing/older", updatedAt: new Date("2026-01-01T00:00:00Z") },
        { path: "/writing/newer", updatedAt: new Date("2026-02-01T00:00:00Z") },
      ],
    );

    const dynamic = entries.filter((entry) => entry.url.includes("/writing/"));
    assert.equal(dynamic.length, 2);
    assert.match(dynamic[0].url, /\/writing\/newer$/);
    assert.ok(dynamic[0].lastModified instanceof Date);
    assert.match((dynamic[0].lastModified as Date).toISOString(), /^\d{4}-\d{2}-\d{2}T/);
  });
});
