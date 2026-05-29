import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/about",
  "/organizations",
  "/community-impact",
  "/achievements",
  "/media",
  "/writing",
  "/research",
  "/contact",
];

test.describe("public motion accessibility smoke", () => {
  for (const path of publicRoutes) {
    test(`reduced-motion route remains accessible: ${path}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);

      const results = await new AxeBuilder({ page })
        .disableRules(["color-contrast"]) // Keep smoke test stable across CI rendering variance.
        .analyze();

      const blockingViolations = results.violations.filter((violation) =>
        violation.impact ? ["critical", "serious"].includes(violation.impact) : false,
      );

      expect(blockingViolations).toEqual([]);
    });
  }
});
