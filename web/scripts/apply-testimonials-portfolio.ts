import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { testimonials } from "../src/lib/db/schema";
import { loadWorkspaceEnvFiles } from "../src/lib/env/workspace-env";
import { PORTFOLIO_TESTIMONIALS } from "../src/lib/testimonials/portfolio-testimonials-content";

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
    await db.delete(testimonials);
    if (PORTFOLIO_TESTIMONIALS.length > 0) {
      await db.insert(testimonials).values(PORTFOLIO_TESTIMONIALS);
    }
    console.log(`testimonials: cleared; inserted ${PORTFOLIO_TESTIMONIALS.length} portfolio row(s).`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
