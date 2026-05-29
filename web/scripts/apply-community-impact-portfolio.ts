import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { COMMUNITY_IMPACT_PORTFOLIO_PROJECTS } from "../src/lib/community-impact/portfolio-projects-content";
import * as schema from "../src/lib/db/schema";
import { loadWorkspaceEnvFiles } from "../src/lib/env/workspace-env";

loadWorkspaceEnvFiles();

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: url });
  const db = drizzle(pool, { schema });

  try {
    await db.delete(schema.communityImpactEntries);
    await db.insert(schema.communityImpactEntries).values(
      COMMUNITY_IMPACT_PORTFOLIO_PROJECTS.map((p) => ({
        id: p.id,
        title: p.title,
        summary: p.description,
        door: p.door,
        type: p.type,
        orgSlug: p.orgSlug,
        metricLabel: p.metricLabel,
        metricValue: p.metricValue,
        startDate: new Date(p.startDateIso),
        isPublished: true,
        createdAt: new Date(p.createdAtIso),
      })),
    );
    console.log(
      `community_impact_entries: cleared and inserted ${COMMUNITY_IMPACT_PORTFOLIO_PROJECTS.length} portfolio rows.`,
    );
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
