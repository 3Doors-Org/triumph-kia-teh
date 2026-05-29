import { expect, test } from "@playwright/test";

test.describe("public achievements and media pages", () => {
  test("achievements page renders heading and either cards or empty state", async ({ page }) => {
    await page.goto("/achievements");
    await expect(page.getByRole("heading", { name: "Achievements" })).toBeVisible();

    const emptyState = page.getByText("No achievements are published yet.");
    const detailsHeading = page.getByRole("heading", { level: 2 }).first();
    await expect(emptyState.or(detailsHeading)).toBeVisible();
  });

  test("media page renders heading and either cards or empty state", async ({ page }) => {
    await page.goto("/media");
    await expect(page.getByRole("heading", { name: "Media" })).toBeVisible();

    const emptyState = page.getByText("No media appearances match the selected filters.");
    const listHeading = page.getByRole("heading", { level: 2 }).first();
    await expect(emptyState.or(listHeading)).toBeVisible();
  });

  test("media filter edge query renders safely", async ({ page }) => {
    await page.goto("/media?format=podcast&year=2025");
    await expect(page.getByRole("heading", { name: "Media" })).toBeVisible();
    await expect(page.getByText("No media appearances match the selected filters.").or(page.getByRole("heading", { level: 2 }).first())).toBeVisible();
  });
});
