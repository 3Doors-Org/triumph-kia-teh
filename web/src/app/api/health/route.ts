import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET() {
  const startedAt = Date.now();

  try {
    await db.execute(sql`select 1`);

    return NextResponse.json(
      {
        status: "ok",
        checks: {
          database: "ok",
        },
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        status: "degraded",
        checks: {
          database: "error",
        },
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
      },
      { status: 503 },
    );
  }
}
