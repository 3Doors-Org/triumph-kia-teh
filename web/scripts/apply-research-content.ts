import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { loadWorkspaceEnvFiles } from "../src/lib/env/workspace-env";
import { researchItems } from "../src/lib/db/schema";
import { RESEARCH_OUTPUTS } from "../src/lib/research/research-content";

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
    await db.delete(researchItems);
    await db.insert(researchItems).values(RESEARCH_OUTPUTS);
    console.log(`research_items: cleared and inserted ${RESEARCH_OUTPUTS.length} research rows.`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
