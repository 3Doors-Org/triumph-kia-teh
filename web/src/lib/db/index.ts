import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { loadWorkspaceEnvFiles } from "@/lib/env/workspace-env";

import * as schema from "./schema";

loadWorkspaceEnvFiles();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required for database initialization");
}

const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30_000,
});

export const db = drizzle(pool, { schema });
