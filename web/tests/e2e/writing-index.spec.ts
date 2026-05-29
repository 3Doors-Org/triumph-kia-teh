import { expect, test } from "@playwright/test";

test.describe("/writing index", () => {
  test("renders index and honest empty state when no posts are published", async ({ page }) => {
    await page.goto("/writing");
    await expect(page.getByRole("heading", { name: "Writing" })).toBeVisible();
    await expect(page.getByText("No published essays match your filters yet.")).toBeVisible();
  });

  test("door filter URL shows empty state when no posts match", async ({ page }) => {
    await page.goto("/writing?door=ACCESS");
    await expect(page.getByRole("heading", { name: "Writing" })).toBeVisible();
    await expect(page.getByText("No published essays match your filters yet.")).toBeVisible();
  });
});
