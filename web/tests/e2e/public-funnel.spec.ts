import { expect, test } from "@playwright/test";

import { waitForContactForm } from "./helpers/forms";

function isBenignBrowserConsoleError(text: string): boolean {
  return (
    /plausible/i.test(text) ||
    /clarity/i.test(text) ||
    /Failed to load resource/i.test(text) ||
    /net::ERR_/i.test(text) ||
    /favicon/i.test(text)
  );
}

test("home to organizations to contact submission", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (!isBenignBrowserConsoleError(text)) {
        consoleErrors.push(text);
      }
    }
  });
  page.on("pageerror", (err) => {
    consoleErrors.push(err.message);
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Practitioner and scholar",
  );

  await page.goto("/organizations");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Organizations");

  await page.goto("/contact?type=speaking&e2eBypass=1");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Contact");
  await waitForContactForm(page);

  await page.getByLabel(/Full name/i).fill("E2E Tester");
  await page.getByLabel(/Email address/i).fill("e2e@example.com");
  await page.getByLabel(/Subject/i).selectOption("speaking");
  await page
    .getByLabel(/Message/i)
    .fill("This is an automated end-to-end message used for deployment verification.");
  await expect(page.getByLabel(/Full name/i)).toHaveValue("E2E Tester");
  await expect(page.getByLabel(/Email address/i)).toHaveValue("e2e@example.com");

  const contactResponse = page.waitForResponse(
    (response) =>
      response.url().includes("/api/v1/contact") && response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Send message" }).click();
  const response = await contactResponse;
  expect(response.status(), await response.text()).toBe(201);
  await expect(page.getByText(/your message has been received/i)).toBeVisible({ timeout: 15_000 });

  expect(
    consoleErrors,
    `Unexpected browser console errors:\n${consoleErrors.join("\n")}`,
  ).toEqual([]);
});
