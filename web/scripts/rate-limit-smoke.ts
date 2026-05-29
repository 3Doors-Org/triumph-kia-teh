import path from "node:path";

import { config } from "dotenv";

config({ path: path.resolve(process.cwd(), "../.env") });
config({ path: path.resolve(process.cwd(), ".env") });

async function run() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000";
  const loginUrl = `${baseUrl}/api/v1/auth/login`;
  const contactUrl = `${baseUrl}/api/v1/contact`;

  const loginAttempts = await Promise.all(
    Array.from({ length: 7 }).map(() =>
      fetch(loginUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: baseUrl,
          referer: `${baseUrl}/admin/login`,
        },
        body: JSON.stringify({ email: "nobody@example.com", password: "notarealpassword" }),
      }),
    ),
  );

  const contactAttempts = await Promise.all(
    Array.from({ length: 6 }).map((_, index) =>
      fetch(contactUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: `Rate Limit Check ${index}`,
          email: `ratelimit-${index}@example.com`,
          inquiryType: "general",
          message: "This is a controlled rate limit smoke request body.",
          website: "",
          turnstileToken: "e2e-test-token",
          sourcePage: "/contact",
        }),
      }),
    ),
  );

  console.log(
    JSON.stringify(
      {
        loginStatuses: loginAttempts.map((r) => r.status),
        contactStatuses: contactAttempts.map((r) => r.status),
      },
      null,
      2,
    ),
  );
}

void run().catch((error) => {
  console.error("[rate-limit-smoke][error]", error);
  process.exitCode = 1;
});
