import { execSync } from "node:child_process";

import { loadWorkspaceEnvFiles } from "../../src/lib/env/workspace-env";

export default async function globalSetup() {
  const cwd = process.cwd();
  loadWorkspaceEnvFiles(cwd);

  if (!process.env.DATABASE_URL) {
    console.warn("[e2e global-setup] DATABASE_URL not set; skipping db:migrate (contact E2E may fail).");
    return;
  }

  try {
    execSync("pnpm db:migrate", { stdio: "inherit", cwd, env: process.env });
  } catch {
    console.warn("[e2e global-setup] db:migrate failed; continuing without DB bootstrap.");
    return;
  }

  const hasSeedInputs =
    Boolean(process.env.SEED_ADMIN_EMAIL) &&
    Boolean(process.env.SEED_ADMIN_NAME) &&
    Boolean(process.env.SEED_ADMIN_PASSWORD);
  if (!hasSeedInputs) {
    console.warn("[e2e global-setup] Seed env vars not set; skipping db:seed.");
    return;
  }

  try {
    execSync("pnpm db:seed", {
      stdio: "inherit",
      cwd,
      env: {
        ...process.env,
        ALLOW_SEED: "true",
      },
    });
  } catch {
    console.warn("[e2e global-setup] db:seed failed; continuing with empty-state-compatible tests.");
  }
}
