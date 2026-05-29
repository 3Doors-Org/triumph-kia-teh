import { expect, test } from "@playwright/test";

test("contact form shows validation summary and recovers", async ({ page }) => {
  await page.goto("/contact?e2eBypass=1");

  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Please review these fields before sending your message:")).toBeVisible();

  await page.getByLabel(/Full name/i).fill("E2E Negative");
  await page.getByLabel(/Email address/i).fill("invalid-email");
  await page.getByLabel(/Subject/i).selectOption("general");
  await page.getByLabel(/Message/i).fill("Too short");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("listitem").filter({ hasText: "Enter a valid email address" })).toBeVisible();
});
