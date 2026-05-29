import { expect, test } from "@playwright/test";

test.describe("/writing/[slug]", () => {
  test("unknown slug is not publicly accessible", async ({ page }) => {
    await page.goto("/writing/draft-placeholder-not-public");
    await expect(page.getByRole("heading", { name: "Writing post not found" })).toBeVisible();
    await expect(
      page.getByText(/unpublished, still a draft, or the URL may be incorrect/i),
    ).toBeVisible();
  });
});
