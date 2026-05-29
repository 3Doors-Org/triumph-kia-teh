import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { loadWorkspaceEnvFiles } from "@/lib/env/workspace-env";

import * as schema from "./schema";

type DbSchema = typeof schema;
type Db = NodePgDatabase<DbSchema>;

let pool: Pool | undefined;
let dbInstance: Db | undefined;

function getConnectionString(): string {
  loadWorkspaceEnvFiles();

  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new Error("DATABASE_URL is required for database initialization");
  }

  return connectionString;
}

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: getConnectionString(),
      max: 10,
      idleTimeoutMillis: 30_000,
    });
  }

  return pool;
}

function getDb(): Db {
  if (!dbInstance) {
    dbInstance = drizzle(getPool(), { schema });
  }

  return dbInstance;
}

export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance as object, prop, receiver);

    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(instance);
    }

    return value;
  },
});
