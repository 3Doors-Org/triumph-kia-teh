import { expect, test } from "@playwright/test";

test.describe("/research pages", () => {
  test("research index renders and shows list or empty state", async ({ page }) => {
    await page.goto("/research");
    await expect(page.getByRole("heading", { name: "Research" })).toBeVisible();

    const emptyState = page.getByText("No research items match the selected filter.");
    const seededTitle = page.getByRole("link", {
      name: "Computational Modeling of Social Influence in Investment Decision-Making: Market Sentiment vs. Learning Effects in Human Stock Choice Task",
    });
    await expect(emptyState.or(seededTitle)).toBeVisible();
  });

  test("research detail for known seeded slug renders or 404 fallback", async ({ page }) => {
    const response = await page.goto(
      "/research/computational-modeling-social-influence-investment-decision-making",
    );
    const status = response?.status();

    if (status === 404) {
      await expect(page.getByRole("heading", { name: "Research item not found" })).toBeVisible();
      return;
    }

    await expect(
      page.getByRole("heading", {
        name: "Computational Modeling of Social Influence in Investment Decision-Making: Market Sentiment vs. Learning Effects in Human Stock Choice Task",
      }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Abstract" })).toBeVisible();
  });
});
