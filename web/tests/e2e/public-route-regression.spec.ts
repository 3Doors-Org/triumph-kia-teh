import { expect, test } from "@playwright/test";

const MAX_ROUTE_LOAD_MS = Number(process.env.E2E_MAX_ROUTE_LOAD_MS ?? "4000");

const routeAssertions: Array<{ path: string; heading: string; allowNotFound?: boolean }> = [
  {
    path: "/",
    heading:
      "Practitioner and scholar. Cofounder of 3Doors, Palaver Institute, and DeWise Foundation.",
  },
  { path: "/about", heading: "Triumph Kia Teh" },
  { path: "/organizations", heading: "Organizations" },
  { path: "/organizations/3doors", heading: "3Doors", allowNotFound: true },
  { path: "/organizations/palaverinstitute", heading: "Palaver Institute", allowNotFound: true },
  { path: "/organizations/dewisefoundation", heading: "DeWise Foundation", allowNotFound: true },
  { path: "/community-impact", heading: "Community Impact" },
  { path: "/achievements", heading: "Achievements" },
  { path: "/media", heading: "Media" },
  { path: "/writing", heading: "Writing" },
  { path: "/research", heading: "Research" },
  { path: "/contact", heading: "Contact" },
];

test.describe("public route regression", () => {
  for (const route of routeAssertions) {
    test(`renders ${route.path}`, async ({ page }) => {
      const startedAt = Date.now();
      const response = await page.goto(route.path);
      const elapsedMs = Date.now() - startedAt;

      if (route.allowNotFound && response?.status() === 404) {
        expect(response?.status()).toBe(404);
        return;
      }

      expect(response?.ok()).toBeTruthy();
      expect(elapsedMs).toBeLessThan(MAX_ROUTE_LOAD_MS);
      await expect(page.getByRole("heading", { name: route.heading, exact: true })).toBeVisible();
    });
  }

  test("research malformed slug path is not public", async ({ page }) => {
    const response = await page.goto("/research/..%2Fetc%2Fpasswd");
    expect(response?.status()).toBe(404);
  });
});
