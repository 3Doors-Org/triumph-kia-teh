import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/lib/api/error-response";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { db } from "@/lib/db";
import { assets } from "@/lib/db/schema";
import { logAssetAudit } from "@/lib/observability/logger";
import { R2StorageProvider } from "@/lib/storage";

const routeParamsSchema = z.object({
  id: z.string().uuid(),
});

function zodErrorToFields(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : "params";
    if (!(key in fields)) fields[key] = issue.message;
  }
  return fields;
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = routeParamsSchema.parse(await context.params);
    const session = await requireRole(["owner"]);

    const [asset] = await db
      .select({
        id: assets.id,
        storageKey: assets.storageKey,
      })
      .from(assets)
      .where(eq(assets.id, params.id))
      .limit(1);
    if (!asset) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const provider = new R2StorageProvider();
    await provider.deleteObject(asset.storageKey);
    const [deleted] = await db
      .delete(assets)
      .where(eq(assets.id, params.id))
      .returning({ id: assets.id, storageKey: assets.storageKey });

    if (!deleted) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    logAssetAudit({
      event: "asset_deleted",
      assetId: deleted.id,
      actorUserId: session.user.id,
    });

    return NextResponse.json(
      { message: "Asset deleted successfully", deletedId: deleted.id, storageKey: deleted.storageKey },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return apiError({ error: "Validation failed", fields: zodErrorToFields(error) }, 400);
    }
    return apiError({ error: "Failed to delete asset" }, 500);
  }
}
