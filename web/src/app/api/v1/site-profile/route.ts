import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/lib/api/error-response";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { normalizePublicHttpUrl } from "@/lib/security/url";
import { getSiteProfile, upsertSiteProfilePortrait } from "@/lib/site-profile/queries";

const patchSchema = z.object({
  portraitPublicUrl: z.union([z.string().trim().min(1).max(2000), z.null()]),
});

function zodErrorToFields(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : "payload";
    if (!(key in fields)) fields[key] = issue.message;
  }
  return fields;
}

export async function GET() {
  try {
    await requireRole(["owner", "editor"]);
    const row = await getSiteProfile();
    return NextResponse.json({
      portraitPublicUrl: row?.portraitPublicUrl ?? null,
      updatedAt: row?.updatedAt?.toISOString() ?? null,
    });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return apiError({ error: "Failed to load site profile" }, 500);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireRole(["owner", "editor"]);
    const payload = patchSchema.parse(await request.json());

    if (payload.portraitPublicUrl === null) {
      await upsertSiteProfilePortrait(null);
    } else {
      const normalized = normalizePublicHttpUrl(payload.portraitPublicUrl);
      if (!normalized) {
        return apiError(
          { error: "Validation failed", fields: { portraitPublicUrl: "Must be a valid http(s) URL" } },
          400,
        );
      }
      await upsertSiteProfilePortrait(normalized);
    }

    revalidatePath("/");

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return apiError({ error: "Validation failed", fields: zodErrorToFields(error) }, 400);
    }
    return apiError({ error: "Failed to update site profile" }, 500);
  }
}
