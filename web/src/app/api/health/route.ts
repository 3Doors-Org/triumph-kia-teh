import { NextResponse } from "next/server";

export async function GET() {
  const startedAt = Date.now();

  try {
    const { sql } = await import("drizzle-orm");
    const { db } = await import("@/lib/db");
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
