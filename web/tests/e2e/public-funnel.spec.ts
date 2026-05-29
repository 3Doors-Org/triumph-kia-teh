import { expect, test } from "@playwright/test";

test("home to organizations to contact submission", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });
  page.on("pageerror", (err) => {
    consoleErrors.push(err.message);
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Practitioner-Scholar",
  );

  await page.goto("/organizations");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Organizations");

  await page.goto("/contact?type=speaking&e2eBypass=1");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Contact");

  await page.getByLabel(/Full name/i).fill("E2E Tester");
  await page.getByLabel(/Email address/i).fill("e2e@example.com");
  await page.getByLabel(/Subject/i).selectOption("speaking");
  await page
    .getByLabel(/Message/i)
    .fill("This is an automated end-to-end message used for deployment verification.");

  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText(/your message has been received/i)).toBeVisible();

  expect(
    consoleErrors,
    `Unexpected browser console errors:\n${consoleErrors.join("\n")}`,
  ).toEqual([]);
});
