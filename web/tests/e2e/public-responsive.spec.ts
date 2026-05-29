import { expect, test } from "@playwright/test";

const viewports = [
  { name: "mobile", size: { width: 390, height: 844 } },
  { name: "tablet", size: { width: 768, height: 1024 } },
  { name: "desktop", size: { width: 1280, height: 800 } },
];

for (const viewport of viewports) {
  test(`phase1 pages render at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport.size);

    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    if (viewport.name === "desktop") {
      await expect(
        page
          .getByRole("navigation", { name: "Primary navigation" })
          .getByRole("link", { name: "Community-Impact" }),
      ).toBeVisible();
    }

    await page.goto("/organizations");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Organizations");

    await page.goto("/community-impact");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Community Impact");

    await page.goto("/contact");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Contact");
  });
}
