import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { orgMetrics } from "../src/lib/db/schema";
import { loadWorkspaceEnvFiles } from "../src/lib/env/workspace-env";
import { PORTFOLIO_ORG_METRICS } from "../src/lib/organizations/portfolio-org-metrics-content";

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
    await db.delete(orgMetrics);
    if (PORTFOLIO_ORG_METRICS.length > 0) {
      await db.insert(orgMetrics).values(PORTFOLIO_ORG_METRICS);
    }
    console.log(`org_metrics: cleared; inserted ${PORTFOLIO_ORG_METRICS.length} portfolio row(s).`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
