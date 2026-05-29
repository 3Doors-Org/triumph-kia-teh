import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { mediaAppearances } from "../src/lib/db/schema";
import { loadWorkspaceEnvFiles } from "../src/lib/env/workspace-env";
import { PORTFOLIO_MEDIA_APPEARANCES } from "../src/lib/media/portfolio-media-content";

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
    await db.delete(mediaAppearances);
    if (PORTFOLIO_MEDIA_APPEARANCES.length > 0) {
      await db.insert(mediaAppearances).values(PORTFOLIO_MEDIA_APPEARANCES);
    }
    console.log(
      `media_appearances: cleared; inserted ${PORTFOLIO_MEDIA_APPEARANCES.length} portfolio row(s).`,
    );
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
