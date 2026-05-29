import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/lib/api/error-response";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { db } from "@/lib/db";
import { assets } from "@/lib/db/schema";
import { logAssetAudit } from "@/lib/observability/logger";

const confirmPayloadSchema = z.object({
  assetId: z.string().uuid(),
  storageKey: z.string().trim().min(1).max(600),
  width: z.coerce.number().int().min(1).max(20_000).optional(),
  height: z.coerce.number().int().min(1).max(20_000).optional(),
  altText: z.string().trim().min(3).max(500).optional().default(""),
});

function zodErrorToFields(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : "payload";
    if (!(key in fields)) fields[key] = issue.message;
  }
  return fields;
}

export async function POST(request: Request) {
  try {
    const session = await requireRole(["owner", "editor"]);
    const payload = confirmPayloadSchema.parse(await request.json());

    const [existing] = await db
      .select({
        id: assets.id,
        mimeType: assets.mimeType,
        storageKey: assets.storageKey,
        uploadedByUserId: assets.uploadedByUserId,
      })
      .from(assets)
      .where(and(eq(assets.id, payload.assetId), eq(assets.uploadStatus, "pending")))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    if (existing.uploadedByUserId !== session.user.id && session.user.role !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (existing.storageKey !== payload.storageKey) {
      return apiError({ error: "Validation failed", fields: { storageKey: "Storage key mismatch" } }, 400);
    }
    if (existing.mimeType.startsWith("image/") && !payload.altText.trim()) {
      return apiError({ error: "Validation failed", fields: { altText: "Alt text is required for images" } }, 400);
    }

    const [confirmed] = await db
      .update(assets)
      .set({
        width: payload.width ?? null,
        height: payload.height ?? null,
        altText: payload.altText.trim() || null,
        uploadStatus: "ready",
        updatedAt: new Date(),
      })
      .where(eq(assets.id, payload.assetId))
      .returning({
        id: assets.id,
        filename: assets.filename,
        publicUrl: assets.publicUrl,
        mimeType: assets.mimeType,
        fileSizeBytes: assets.fileSizeBytes,
        width: assets.width,
        height: assets.height,
        altText: assets.altText,
        createdAt: assets.createdAt,
      });

    if (!confirmed) {
      return apiError({ error: "Failed to confirm upload" }, 500);
    }

    logAssetAudit({
      event: "asset_upload_confirmed",
      assetId: confirmed.id,
      actorUserId: session.user.id,
    });

    return NextResponse.json(
      {
        ...confirmed,
        createdAt: confirmed.createdAt.toISOString(),
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return apiError({ error: "Validation failed", fields: zodErrorToFields(error) }, 400);
    }
    return apiError({ error: "Failed to confirm asset upload" }, 500);
  }
}
