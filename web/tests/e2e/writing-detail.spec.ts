import { expect, test } from "@playwright/test";

test.describe("/writing/[slug]", () => {
  test("unknown slug is not publicly accessible", async ({ page }) => {
    const response = await page.goto("/writing/draft-placeholder-not-public");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Writing post not found" })).toBeVisible();
  });
});
