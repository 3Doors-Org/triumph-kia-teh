import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { PORTFOLIO_ACHIEVEMENTS } from "../src/lib/achievements/portfolio-achievements-content";
import { loadWorkspaceEnvFiles } from "../src/lib/env/workspace-env";
import { achievements } from "../src/lib/db/schema";

loadWorkspaceEnvFiles();

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: url });
  const db = drizzle(pool);

  try {
    await db.delete(achievements);
    await db.insert(achievements).values(PORTFOLIO_ACHIEVEMENTS);
    console.log(`achievements: cleared and inserted ${PORTFOLIO_ACHIEVEMENTS.length} portfolio rows.`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
