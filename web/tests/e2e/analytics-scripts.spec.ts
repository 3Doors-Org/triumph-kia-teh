import { expect, test } from "@playwright/test";

test.describe("public analytics scripts", () => {
  test("loads plausible script on public routes", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("script#plausible-analytics")).toHaveCount(1, { timeout: 15_000 });

    await page.goto("/contact");
    await expect(page.locator("script#plausible-analytics")).toHaveCount(1, { timeout: 15_000 });
  });

  test("does not load public analytics scripts on admin login", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator("script#plausible-analytics")).toHaveCount(0);
    await expect(page.locator("script#microsoft-clarity")).toHaveCount(0);
  });
});
