# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public-funnel.spec.ts >> home to organizations to contact submission
- Location: tests/e2e/public-funnel.spec.ts:3:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/your message has been received/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/your message has been received/i)

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e5]:
        - link "Triumph Kia Teh" [ref=e7] [cursor=pointer]:
          - /url: /
        - navigation "Primary navigation" [ref=e8]:
          - link "About" [ref=e9] [cursor=pointer]:
            - /url: /about
            - text: About
          - link "Organizations" [ref=e10] [cursor=pointer]:
            - /url: /organizations
            - text: Organizations
          - link "Community Impact" [ref=e11] [cursor=pointer]:
            - /url: /community-impact
            - text: Community Impact
          - link "Achievements" [ref=e12] [cursor=pointer]:
            - /url: /achievements
            - text: Achievements
          - link "Media" [ref=e13] [cursor=pointer]:
            - /url: /media
            - text: Media
          - link "Writing" [ref=e14] [cursor=pointer]:
            - /url: /writing
            - text: Writing
          - link "Research" [ref=e15] [cursor=pointer]:
            - /url: /research
            - text: Research
          - link "Contact" [ref=e16] [cursor=pointer]:
            - /url: /contact
            - text: Contact
    - main [ref=e17]:
      - generic [ref=e19]:
        - generic [ref=e21]:
          - generic [ref=e22]:
            - paragraph [ref=e23]: Let's connect
            - heading "Start a conversation" [level=2] [ref=e24]
            - paragraph [ref=e25]: Whether you're seeking strategic counsel, exploring collaboration, or simply want to exchange ideas — I'm always open to meaningful dialogue.
          - generic [ref=e26]:
            - heading "Quick contact options" [level=3] [ref=e27]
            - generic [ref=e28]:
              - link "Email kiattriumph@gmail.com" [ref=e29] [cursor=pointer]:
                - /url: mailto:kiattriumph@gmail.com
                - img [ref=e31]
                - generic [ref=e34]:
                  - paragraph [ref=e35]: Email
                  - paragraph [ref=e36]: kiattriumph@gmail.com
              - link "LinkedIn /in/triumph-kia-teh" [ref=e37] [cursor=pointer]:
                - /url: https://www.linkedin.com/in/triumph-kia-teh
                - img [ref=e39]
                - generic [ref=e43]:
                  - paragraph [ref=e44]: LinkedIn
                  - paragraph [ref=e45]: /in/triumph-kia-teh
              - generic [ref=e46]:
                - img [ref=e48]
                - generic [ref=e51]:
                  - paragraph [ref=e52]: Location
                  - paragraph [ref=e53]: Global — based in Dartmouth
              - link "Consultation Book a consultation" [ref=e54] [cursor=pointer]:
                - /url: mailto:kiattriumph@gmail.com?subject=Consultation%20Request
                - img [ref=e56]
                - generic [ref=e58]:
                  - paragraph [ref=e59]: Consultation
                  - paragraph [ref=e60]: Book a consultation
          - generic [ref=e61]:
            - paragraph [ref=e62]: Follow for frameworks, not motivation. I post regularly.
            - paragraph [ref=e63]:
              - text: Building in student success or African research? Reach out at
              - link "kiattriumph@gmail.com" [ref=e64] [cursor=pointer]:
                - /url: mailto:kiattriumph@gmail.com
              - text: .
        - generic [ref=e65]:
          - heading "Contact" [level=1] [ref=e66]
          - paragraph [ref=e67]: Use the form to send speaking, partnership, media, or general inquiries.
          - generic [ref=e69]:
            - generic [ref=e70]:
              - generic [ref=e71]: Full name
              - textbox "Full name" [ref=e72]:
                - /placeholder: Joe Doe
                - text: E2E Tester
              - paragraph
            - generic [ref=e73]:
              - generic [ref=e74]: Email address
              - textbox "Email address" [ref=e75]:
                - /placeholder: joe.doe@example.com
                - text: e2e@example.com
              - paragraph
            - generic [ref=e76]:
              - generic [ref=e77]: Inquiry type
              - combobox "Inquiry type" [ref=e78]:
                - option "Speaking" [selected]
                - option "Partnership"
                - option "Media"
                - option "General"
            - generic [ref=e79]:
              - generic [ref=e80]: Message
              - textbox "Message" [ref=e81]:
                - /placeholder: Please share the purpose, timeline, and key details of your request.
                - text: This is an automated end-to-end message used for deployment verification.
              - generic [ref=e82]:
                - paragraph
                - paragraph [ref=e83]: 73/3000 characters
              - paragraph [ref=e84]: Maximum 3000 characters (roughly 450-600 words).
            - textbox
            - button "Submitting..." [disabled]
    - contentinfo [ref=e85]:
      - generic [ref=e86]:
        - generic [ref=e87]:
          - paragraph [ref=e88]: Triumph Kia Teh
          - paragraph [ref=e89]: Practitioner-scholar platform for institutional leadership, research, writing, and community impact.
          - link "Start a conversation" [ref=e90] [cursor=pointer]:
            - /url: /contact
        - navigation "Footer quick links" [ref=e91]:
          - paragraph [ref=e92]: Quick Links
          - list [ref=e93]:
            - listitem [ref=e94]:
              - link "Home" [ref=e95] [cursor=pointer]:
                - /url: /
            - listitem [ref=e96]:
              - link "About" [ref=e97] [cursor=pointer]:
                - /url: /about
        - navigation "Footer explore links" [ref=e98]:
          - paragraph [ref=e99]: Explore
          - list [ref=e100]:
            - listitem [ref=e101]:
              - link "About" [ref=e102] [cursor=pointer]:
                - /url: /about
            - listitem [ref=e103]:
              - link "Organizations" [ref=e104] [cursor=pointer]:
                - /url: /organizations
            - listitem [ref=e105]:
              - link "Community Impact" [ref=e106] [cursor=pointer]:
                - /url: /community-impact
            - listitem [ref=e107]:
              - link "Achievements" [ref=e108] [cursor=pointer]:
                - /url: /achievements
            - listitem [ref=e109]:
              - link "Media" [ref=e110] [cursor=pointer]:
                - /url: /media
            - listitem [ref=e111]:
              - link "Writing" [ref=e112] [cursor=pointer]:
                - /url: /writing
            - listitem [ref=e113]:
              - link "Research" [ref=e114] [cursor=pointer]:
                - /url: /research
            - listitem [ref=e115]:
              - link "Contact" [ref=e116] [cursor=pointer]:
                - /url: /contact
      - generic [ref=e117]:
        - generic [ref=e118]: © 2026 Triumph Kia Teh. All rights reserved.
        - generic [ref=e119]: Built for long-horizon institutional work.
  - button "Open Next.js Dev Tools" [ref=e125] [cursor=pointer]:
    - img [ref=e126]
  - alert [ref=e129]
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | test("home to organizations to contact submission", async ({ page }) => {
  4  |   const consoleErrors: string[] = [];
  5  |   page.on("console", (msg) => {
  6  |     if (msg.type() === "error") {
  7  |       consoleErrors.push(msg.text());
  8  |     }
  9  |   });
  10 |   page.on("pageerror", (err) => {
  11 |     consoleErrors.push(err.message);
  12 |   });
  13 | 
  14 |   await page.goto("/");
  15 |   await expect(page.getByRole("heading", { level: 1 })).toContainText(
  16 |     "Practitioner-Scholar",
  17 |   );
  18 | 
  19 |   await page.goto("/organizations");
  20 |   await expect(page.getByRole("heading", { level: 1 })).toContainText("Organizations");
  21 | 
  22 |   await page.goto("/contact?type=speaking&e2eBypass=1");
  23 |   await expect(page.getByRole("heading", { level: 1 })).toContainText("Contact");
  24 | 
  25 |   await page.getByLabel("Full name").fill("E2E Tester");
  26 |   await page.getByLabel("Email").fill("e2e@example.com");
  27 |   await page.getByLabel("Inquiry type").selectOption("speaking");
  28 |   await page
  29 |     .getByLabel("Message")
  30 |     .fill("This is an automated end-to-end message used for deployment verification.");
  31 | 
  32 |   await page.getByRole("button", { name: "Send message" }).click();
> 33 |   await expect(page.getByText(/your message has been received/i)).toBeVisible();
     |                                                                   ^ Error: expect(locator).toBeVisible() failed
  34 | 
  35 |   expect(
  36 |     consoleErrors,
  37 |     `Unexpected browser console errors:\n${consoleErrors.join("\n")}`,
  38 |   ).toEqual([]);
  39 | });
  40 | 
```