import { expect, test } from "@playwright/test";

test("contact submit button disables while request is inflight", async ({ page }) => {
  let requestCount = 0;
  await page.route("**/api/v1/contact", async (route) => {
    requestCount += 1;
    await new Promise((resolve) => setTimeout(resolve, 800));
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        message: "ok",
        leadId: "lead-e2e",
      }),
    });
  });

  await page.goto("/contact?type=media&e2eBypass=1");
  await page.getByLabel(/Full name/i).fill("Double Submit");
  await page.getByLabel(/Email address/i).fill("double-submit@example.com");
  await page.getByLabel(/Subject/i).selectOption("media");
  await page.getByLabel(/Message/i).fill("This message validates disabled submit during inflight state.");

  const submit = page.getByRole("button", { name: "Send message" });
  await submit.dblclick();
  await expect(page.getByText(/your message has been received/i)).toBeVisible();
  expect(requestCount).toBe(1);
});
