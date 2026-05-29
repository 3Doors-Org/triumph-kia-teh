import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { posts } from "../src/lib/db/schema";
import { loadWorkspaceEnvFiles } from "../src/lib/env/workspace-env";
import { PORTFOLIO_WRITING_POSTS } from "../src/lib/writing/portfolio-writing-content";

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
    await db.delete(posts);
    if (PORTFOLIO_WRITING_POSTS.length > 0) {
      throw new Error("PORTFOLIO_WRITING_POSTS seed rows require authorId mapping in this script.");
    }
    console.log(`posts: cleared; inserted ${PORTFOLIO_WRITING_POSTS.length} portfolio row(s).`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
