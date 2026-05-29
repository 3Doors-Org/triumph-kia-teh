import { expect, test } from "@playwright/test";

import { waitForAdminLoginForm } from "./helpers/forms";

test.describe("/admin/login", () => {
  test("renders standalone login page with fields", async ({ page }) => {
    await page.goto("/admin/login");
    await waitForAdminLoginForm(page);
    await expect(page.getByRole("heading", { name: "Admin Login" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Show secret text" })).toBeVisible();
  });

  test("shows generic invalid-credentials message", async ({ page }) => {
    await page.goto("/admin/login");
    await waitForAdminLoginForm(page);
    await page.getByLabel("Email").fill("nobody@example.com");
    await page.getByLabel("Password").fill("notarealpassword");
    await expect(page.getByLabel("Email")).toHaveValue("nobody@example.com");
    await expect(page.getByLabel("Password")).toHaveValue("notarealpassword");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.locator("form [role='alert']")).toHaveText("Invalid email or password.", {
      timeout: 15_000,
    });
  });
});
