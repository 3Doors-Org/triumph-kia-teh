import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { loadWorkspaceEnvFiles } from "../src/lib/env/workspace-env";
import { users } from "../src/lib/db/schema";

loadWorkspaceEnvFiles();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email) {
    throw new Error("ADMIN_EMAIL is required");
  }
  if (!password || password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters");
  }
  if (password.length > 256) {
    throw new Error("ADMIN_PASSWORD must be 256 characters or fewer");
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }

  const pool = new Pool({ connectionString: url });
  const db = drizzle(pool);
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const updated = await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date(), role: "owner" })
      .where(eq(users.email, email))
      .returning({ email: users.email, name: users.name, role: users.role });

    if (updated.length === 0) {
      throw new Error(`No user found for email: ${email}`);
    }

    const verified = await bcrypt.compare(password, passwordHash);
    console.log("Updated admin:", updated[0]);
    console.log("Bcrypt verify:", verified);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
