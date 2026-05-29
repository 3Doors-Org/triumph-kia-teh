import { defineConfig } from "drizzle-kit";

import { loadWorkspaceEnvFiles } from "./src/lib/env/workspace-env";

loadWorkspaceEnvFiles();

function getMigrationUrl(): string {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  const migrationUrl = process.env.MIGRATION_DATABASE_URL?.trim();
  const directUrl = process.env.DIRECT_URL?.trim();

  return databaseUrl ?? migrationUrl ?? directUrl ?? "";
}

export default defineConfig({
  out: "./src/lib/db/migrations",
  schema: "./src/lib/db/schema/*.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: getMigrationUrl(),
  },
  strict: true,
  verbose: true,
});
