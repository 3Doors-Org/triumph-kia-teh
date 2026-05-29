import { expect, type Page } from "@playwright/test";

export async function waitForContactForm(page: Page) {
  await page.getByRole("button", { name: "Send message" }).waitFor({ state: "visible" });
  await expect(page.getByLabel("Loading contact form")).toHaveCount(0);
}

export async function waitForAdminLoginForm(page: Page) {
  await page.getByRole("button", { name: "Sign in" }).waitFor({ state: "visible" });
  await expect(page.getByLabel("Loading sign-in form")).toHaveCount(0);
}
