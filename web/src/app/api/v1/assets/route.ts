import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/lib/api/error-response";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { db } from "@/lib/db";
import { assets, users } from "@/lib/db/schema";

const listQuerySchema = z.object({
  q: z.string().trim().max(180).optional(),
  mimeType: z.string().trim().min(3).max(100).optional(),
  uploadedBy: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
});

function emptyToUndefined(value: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function zodErrorToFields(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : "query";
    if (!(key in fields)) fields[key] = issue.message;
  }
  return fields;
}

export async function GET(request: Request) {
  try {
    await requireRole(["owner", "editor"]);
    const { searchParams } = new URL(request.url);
    const query = listQuerySchema.parse({
      q: emptyToUndefined(searchParams.get("q")),
      mimeType: emptyToUndefined(searchParams.get("mimeType")),
      uploadedBy: emptyToUndefined(searchParams.get("uploadedBy")),
      page: emptyToUndefined(searchParams.get("page")) ?? "1",
      limit: emptyToUndefined(searchParams.get("limit")) ?? "24",
    });

    const where = and(
      eq(assets.uploadStatus, "ready"),
      query.mimeType ? ilike(assets.mimeType, `${escapeIlikeFragment(query.mimeType)}%`) : undefined,
      query.uploadedBy ? eq(assets.uploadedByUserId, query.uploadedBy) : undefined,
      query.q
        ? or(
            ilike(assets.filename, `%${escapeIlikeFragment(query.q)}%`),
            ilike(assets.altText, `%${escapeIlikeFragment(query.q)}%`),
          )
        : undefined,
    );

    const offset = (query.page - 1) * query.limit;
    const [rows, totalRowsResult] = await Promise.all([
      db
        .select({
          id: assets.id,
          filename: assets.filename,
          storageKey: assets.storageKey,
          publicUrl: assets.publicUrl,
          mimeType: assets.mimeType,
          fileSizeBytes: assets.fileSizeBytes,
          width: assets.width,
          height: assets.height,
          altText: assets.altText,
          uploadedById: users.id,
          uploadedByName: users.name,
          createdAt: assets.createdAt,
        })
        .from(assets)
        .innerJoin(users, eq(assets.uploadedByUserId, users.id))
        .where(where)
        .orderBy(desc(assets.createdAt))
        .offset(offset)
        .limit(query.limit),
      db.select({ value: count() }).from(assets).where(where),
    ]);

    const totalRows = Number(totalRowsResult[0]?.value ?? 0);
    return NextResponse.json(
      {
        data: rows.map((row) => ({
          id: row.id,
          filename: row.filename,
          storageKey: row.storageKey,
          publicUrl: row.publicUrl,
          mimeType: row.mimeType,
          fileSizeBytes: row.fileSizeBytes,
          width: row.width,
          height: row.height,
          altText: row.altText,
          uploadedBy: { id: row.uploadedById, name: row.uploadedByName },
          createdAt: row.createdAt.toISOString(),
        })),
        total: totalRows,
        nextCursor: null,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return apiError({ error: "Validation failed", fields: zodErrorToFields(error) }, 400);
    }
    return apiError({ error: "Failed to load assets" }, 500);
  }
}

function escapeIlikeFragment(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}
