import { defineConfig } from "@playwright/test";

export default defineConfig({
  globalSetup: "./tests/e2e/global-setup.ts",
  testDir: "./tests/e2e",
  timeout: 45_000,
  use: {
    baseURL: "http://127.0.0.1:3000",
    headless: true,
  },
  webServer: {
    command: "pnpm dev -p 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    env: {
      NODE_ENV: "development",
      DATABASE_URL:
        process.env.DATABASE_URL ??
        "postgresql://migration_user:migration_password@127.0.0.1:5432/personal_website",
      MIGRATION_DATABASE_URL:
        process.env.MIGRATION_DATABASE_URL ??
        process.env.DATABASE_URL ??
        "postgresql://migration_user:migration_password@127.0.0.1:5432/personal_website",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "http://127.0.0.1:3000",
      NEXTAUTH_SECRET:
        process.env.NEXTAUTH_SECRET ?? "ci-placeholder-secret-at-least-32-chars",
      IP_HASH_SALT: process.env.IP_HASH_SALT ?? "ci-e2e-ip-hash-salt",
      NEXT_PUBLIC_E2E_BYPASS_TURNSTILE: "true",
      TEST_BYPASS_TURNSTILE: "true",
      NEXT_PUBLIC_ENABLE_ANALYTICS_DEV: "true",
      NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "triumphkiateh.com",
      NEXT_PUBLIC_PLAUSIBLE_API_HOST:
        process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST ?? "https://plausible.io",
      PLAUSIBLE_API_HOST: process.env.PLAUSIBLE_API_HOST ?? "https://plausible.io",
      NEXT_PUBLIC_CLARITY_PROJECT_ID:
        process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "ci-e2e-clarity",
    },
    timeout: 120_000,
  },
});
