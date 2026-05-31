import { expect, test } from "@playwright/test";

async function signInAsSeedOwner(page: import("@playwright/test").Page) {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  test.skip(!email || !password, "Seed admin credentials are required for admin shell smoke tests.");

  await page.goto("/admin/login");
  if (page.url().includes("/admin") && !page.url().includes("/admin/login")) {
    return;
  }

  await page.getByLabel("Email").fill(email ?? "");
  await page.getByLabel("Password").fill(password ?? "");
  await page.getByRole("button", { name: "Sign in" }).click();
}

test.describe("admin shell", () => {
  test("shows role-aware nav and supports module navigation", async ({ page }) => {
    await signInAsSeedOwner(page);
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole("navigation", { name: "Admin navigation" })).toBeVisible();

    const roleBadge = page.getByText(/owner|editor/i).first();
    await expect(roleBadge).toBeVisible();
    const roleText = ((await roleBadge.textContent()) ?? "").trim().toLowerCase();

    if (roleText === "owner") {
      await expect(page.getByRole("link", { name: "Navigation" })).toBeVisible();
    } else {
      await expect(page.getByRole("link", { name: "Navigation" })).toHaveCount(0);
    }

    await page.getByRole("navigation", { name: "Admin navigation" }).getByRole("link", { name: "Writing", exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/writing$/);
    await expect(page.locator("main").getByRole("heading", { name: "Writing", exact: true })).toBeVisible();

    await page.getByRole("navigation", { name: "Admin navigation" }).getByRole("link", { name: "Research", exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/research$/);
    await expect(page.locator("main").getByRole("heading", { name: "Research", exact: true })).toBeVisible();
  });

  test("logs out and returns to the login page", async ({ page }) => {
    await signInAsSeedOwner(page);
    await expect(page).toHaveURL(/\/admin$/);

    await page.getByRole("button", { name: "Log out" }).first().click();
    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(page.getByRole("heading", { name: "Admin Login" })).toBeVisible();

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
