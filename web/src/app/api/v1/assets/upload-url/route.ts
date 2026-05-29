import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { apiError } from "@/lib/api/error-response";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { db } from "@/lib/db";
import { assets } from "@/lib/db/schema";
import { logAssetAudit } from "@/lib/observability/logger";
import { isAllowedUploadMimeType, isAllowedUploadSize, R2StorageProvider } from "@/lib/storage";

const uploadUrlPayloadSchema = z.object({
  filename: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(3).max(100),
  fileSizeBytes: z.coerce.number().int().min(1).max(50 * 1024 * 1024),
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
    const payload = uploadUrlPayloadSchema.parse(await request.json());
    if (!isAllowedUploadMimeType(payload.mimeType)) {
      return apiError({ error: "Validation failed", fields: { mimeType: "MIME type is not allowed" } }, 400);
    }
    if (!isAllowedUploadSize(payload.mimeType, payload.fileSizeBytes)) {
      return apiError({ error: "Validation failed", fields: { fileSizeBytes: "File exceeds size policy for this MIME type" } }, 400);
    }

    const [newAsset] = await db
      .insert(assets)
      .values({
        filename: payload.filename,
        storageKey: "",
        publicUrl: "",
        mimeType: payload.mimeType,
        fileSizeBytes: payload.fileSizeBytes,
        uploadStatus: "pending",
        uploadedByUserId: session.user.id,
      })
      .returning({ id: assets.id });

    if (!newAsset) {
      return apiError({ error: "Unable to initialize upload" }, 500);
    }

    const provider = new R2StorageProvider();
    const signed = await provider.initiateUpload({
      assetId: newAsset.id,
      filename: payload.filename,
      mimeType: payload.mimeType,
      fileSizeBytes: payload.fileSizeBytes,
    });

    await db
      .update(assets)
      .set({
        storageKey: signed.storageKey,
        publicUrl: provider.toPublicUrl(signed.storageKey),
        updatedAt: new Date(),
      })
      .where(eq(assets.id, newAsset.id));

    logAssetAudit({
      event: "asset_upload_initiated",
      assetId: newAsset.id,
      actorUserId: session.user.id,
    });

    return NextResponse.json(
      {
        uploadUrl: signed.uploadUrl,
        storageKey: signed.storageKey,
        assetId: newAsset.id,
        expiresAt: signed.expiresAt,
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
    return apiError({ error: "Failed to initiate asset upload" }, 500);
  }
}
