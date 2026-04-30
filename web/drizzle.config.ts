import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";

loadEnv({ path: "../.env" });
loadEnv();

export default defineConfig({
  out: "./src/lib/db/migrations",
  schema: "./src/lib/db/schema/*.ts",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.MIGRATION_DATABASE_URL ??
      process.env.DIRECT_URL ??
      process.env.DATABASE_URL ??
      "",
  },
  strict: true,
  verbose: true,
});
