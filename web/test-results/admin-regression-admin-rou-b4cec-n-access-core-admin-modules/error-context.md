# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-regression.spec.ts >> admin route regression >> owner can access core admin modules
- Location: tests/e2e/admin-regression.spec.ts:23:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/admin$/
Received string:  "http://127.0.0.1:3000/admin/login"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    9 × unexpected value "http://127.0.0.1:3000/admin/login"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - complementary [ref=e3]:
      - paragraph [ref=e4]: Admin
      - paragraph [ref=e5]: editor
      - navigation "Admin navigation" [ref=e6]:
        - link "Dashboard" [ref=e7] [cursor=pointer]:
          - /url: /admin
        - link "Profile portrait" [ref=e8] [cursor=pointer]:
          - /url: /admin/profile-portrait
        - link "Writing" [ref=e9] [cursor=pointer]:
          - /url: /admin/writing
        - link "Research" [ref=e10] [cursor=pointer]:
          - /url: /admin/research
        - link "Impact" [ref=e11] [cursor=pointer]:
          - /url: /admin/community-impact
        - link "Achievements" [ref=e12] [cursor=pointer]:
          - /url: /admin/achievements
        - link "Media" [ref=e13] [cursor=pointer]:
          - /url: /admin/media-appearances
        - link "Metrics" [ref=e14] [cursor=pointer]:
          - /url: /admin/metrics
        - link "Testimonials" [ref=e15] [cursor=pointer]:
          - /url: /admin/testimonials
        - link "Assets" [ref=e16] [cursor=pointer]:
          - /url: /admin/assets
        - link "Site content" [ref=e17] [cursor=pointer]:
          - /url: /admin/site-content
    - generic [ref=e18]:
      - banner [ref=e19]:
        - generic [ref=e21]:
          - paragraph [ref=e22]: Admin / Dashboard
          - heading "Dashboard" [level=1] [ref=e23]
      - main [ref=e24]:
        - main [ref=e25]:
          - generic [ref=e26]:
            - generic [ref=e27]:
              - heading "Admin Login" [level=1] [ref=e28]
              - paragraph [ref=e29]: Sign in with your administrator credentials to continue.
            - generic [ref=e30]:
              - generic [ref=e31]:
                - generic [ref=e32]: Email
                - textbox "Email" [ref=e33]: owner@staging.local
              - generic [ref=e34]:
                - generic [ref=e35]: Password
                - generic [ref=e36]:
                  - textbox "Password" [ref=e37]: replace-with-strong-seed-password
                  - button "Show secret text" [ref=e38]: Show
              - alert [ref=e39]: Invalid email or password.
              - button "Sign in" [ref=e40]
            - paragraph [ref=e41]: Access is monitored. Unauthorized attempts are rate-limited and logged.
  - button "Open Next.js Dev Tools" [ref=e47] [cursor=pointer]:
    - img [ref=e48]
  - alert [ref=e51]
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | async function signInAsSeedOwner(page: import("@playwright/test").Page) {
  4  |   const email = process.env.SEED_ADMIN_EMAIL;
  5  |   const password = process.env.SEED_ADMIN_PASSWORD;
  6  | 
  7  |   test.skip(!email || !password, "Seed admin credentials are required for admin regression tests.");
  8  | 
  9  |   await page.goto("/admin/login");
  10 |   await page.getByLabel("Email").fill(email ?? "");
  11 |   await page.getByLabel("Password").fill(password ?? "");
  12 |   await page.getByRole("button", { name: "Sign in" }).click();
  13 | 
  14 |   if (page.url().includes("/admin/login")) {
  15 |     const loginError = page.locator("form [role='alert']");
  16 |     if (await loginError.isVisible().catch(() => false)) {
  17 |       test.skip(true, "Seed admin credentials are not valid for this environment.");
  18 |     }
  19 |   }
  20 | }
  21 | 
  22 | test.describe("admin route regression", () => {
  23 |   test("owner can access core admin modules", async ({ page }) => {
  24 |     await signInAsSeedOwner(page);
> 25 |     await expect(page).toHaveURL(/\/admin$/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  26 | 
  27 |     const checks = [
  28 |       { href: "/admin", heading: "Dashboard" },
  29 |       { href: "/admin/writing", heading: "Writing" },
  30 |       { href: "/admin/research", heading: "Research" },
  31 |       { href: "/admin/community-impact", heading: "Community Impact" },
  32 |       { href: "/admin/achievements", heading: "Achievements" },
  33 |       { href: "/admin/media-appearances", heading: "Media Appearances" },
  34 |       { href: "/admin/testimonials", heading: "Testimonials" },
  35 |       { href: "/admin/assets", heading: "Assets" },
  36 |       { href: "/admin/leads", heading: "Leads" },
  37 |       { href: "/admin/navigation", heading: "Navigation" },
  38 |       { href: "/admin/exit-intent", heading: "Exit intent" },
  39 |       { href: "/admin/analytics", heading: "Analytics" },
  40 |     ] as const;
  41 | 
  42 |     for (const check of checks) {
  43 |       await page.goto(check.href);
  44 |       await expect(page.locator("main").getByRole("heading", { name: check.heading })).toBeVisible();
  45 |     }
  46 |   });
  47 | });
  48 | 
```