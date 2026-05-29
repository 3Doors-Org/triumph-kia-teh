import { expect, test } from "@playwright/test";

async function signInAsSeedOwner(page: import("@playwright/test").Page) {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  test.skip(!email || !password, "Seed admin credentials are required for admin regression tests.");

  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(email ?? "");
  await page.getByLabel("Password").fill(password ?? "");
  await page.getByRole("button", { name: "Sign in" }).click();

  if (page.url().includes("/admin/login")) {
    const loginError = page.locator("form [role='alert']");
    if (await loginError.isVisible().catch(() => false)) {
      test.skip(true, "Seed admin credentials are not valid for this environment.");
    }
  }
}

test.describe("admin route regression", () => {
  test("owner can access core admin modules", async ({ page }) => {
    await signInAsSeedOwner(page);
    await expect(page).toHaveURL(/\/admin$/);

    const checks = [
      { href: "/admin", heading: "Dashboard" },
      { href: "/admin/writing", heading: "Writing" },
      { href: "/admin/research", heading: "Research" },
      { href: "/admin/community-impact", heading: "Community Impact" },
      { href: "/admin/achievements", heading: "Achievements" },
      { href: "/admin/media-appearances", heading: "Media Appearances" },
      { href: "/admin/testimonials", heading: "Testimonials" },
      { href: "/admin/assets", heading: "Assets" },
      { href: "/admin/leads", heading: "Leads" },
      { href: "/admin/navigation", heading: "Navigation" },
      { href: "/admin/exit-intent", heading: "Exit intent" },
      { href: "/admin/analytics", heading: "Analytics" },
    ] as const;

    for (const check of checks) {
      await page.goto(check.href);
      await expect(page.locator("main").getByRole("heading", { name: check.heading })).toBeVisible();
    }
  });
});
