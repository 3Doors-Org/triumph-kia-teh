import { and, count, desc, eq, ilike } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { assets, users } from "@/lib/db/schema";

const adminAssetsFiltersSchema = z.object({
  q: z.string().trim().max(180).optional(),
  mimeType: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
});

export type AdminAssetsFilters = z.infer<typeof adminAssetsFiltersSchema>;

export function parseAdminAssetsFilters(searchParams: URLSearchParams): AdminAssetsFilters {
  return adminAssetsFiltersSchema.parse({
    q: emptyToUndefined(searchParams.get("q")),
    mimeType: emptyToUndefined(searchParams.get("mimeType")),
    page: emptyToUndefined(searchParams.get("page")) ?? "1",
    limit: emptyToUndefined(searchParams.get("limit")) ?? "24",
  });
}

export async function getAdminAssetsPage(filters: AdminAssetsFilters) {
  const where = and(
    eq(assets.uploadStatus, "ready"),
    filters.q
      ? and(
          ilike(assets.filename, `%${escapeIlikeFragment(filters.q)}%`),
        )
      : undefined,
    filters.mimeType ? ilike(assets.mimeType, `${escapeIlikeFragment(filters.mimeType)}%`) : undefined,
  );

  const offset = (filters.page - 1) * filters.limit;
  const [rows, totalRowsResult] = await Promise.all([
    db
      .select({
        id: assets.id,
        filename: assets.filename,
        publicUrl: assets.publicUrl,
        mimeType: assets.mimeType,
        fileSizeBytes: assets.fileSizeBytes,
        altText: assets.altText,
        width: assets.width,
        height: assets.height,
        createdAt: assets.createdAt,
        uploadedByName: users.name,
      })
      .from(assets)
      .innerJoin(users, eq(assets.uploadedByUserId, users.id))
      .where(where)
      .orderBy(desc(assets.createdAt))
      .offset(offset)
      .limit(filters.limit),
    db.select({ value: count() }).from(assets).where(where),
  ]);

  const totalRows = Number(totalRowsResult[0]?.value ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalRows / filters.limit));
  return {
    rows,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      totalRows,
      totalPages,
      hasNextPage: filters.page < totalPages,
      hasPreviousPage: filters.page > 1,
    },
  };
}

function emptyToUndefined(value: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function escapeIlikeFragment(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}
