import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { DEFAULT_ABOUT_PAGE_CONTENT } from "../src/lib/about/default-about-content";
import {
  parseAboutContentFromDb,
  withExplicitEducationLocation,
} from "../src/lib/about/normalize-about-content";
import { aboutPageConfig } from "../src/lib/db/schema";
import { loadWorkspaceEnvFiles } from "../src/lib/env/workspace-env";

loadWorkspaceEnvFiles();

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const fullReset = process.env.ABOUT_APPLY_FULL === "true";
  const pool = new Pool({ connectionString: url });
  const db = drizzle(pool);

  try {
    const [existing] = await db
      .select({ content: aboutPageConfig.content })
      .from(aboutPageConfig)
      .where(eq(aboutPageConfig.id, 1))
      .limit(1);

    const content =
      fullReset || !existing?.content
        ? withExplicitEducationLocation(DEFAULT_ABOUT_PAGE_CONTENT)
        : withExplicitEducationLocation(parseAboutContentFromDb(existing.content));

    await db
      .insert(aboutPageConfig)
      .values({ id: 1, content, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: aboutPageConfig.id,
        set: { content, updatedAt: new Date() },
      });

    console.log(
      `about_page_config: upserted (mode=${fullReset ? "full" : "patch"}, education.location="${content.education.location}").`,
    );
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
