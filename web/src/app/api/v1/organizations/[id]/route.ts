import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/lib/api/error-response";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { revalidateContent } from "@/lib/cache/revalidate-content";
import { db } from "@/lib/db";
import { organizations } from "@/lib/db/schema";
import { assertEditorialText } from "@/lib/editorial/lint";
import { ORGANIZATION_DOOR_VALUES, ORGANIZATION_SLUG_PATTERN } from "@/lib/organizations/constants";
import { normalizePublicHttpUrl } from "@/lib/security/url";

const paramsSchema = z.object({ id: z.string().uuid() });

const organizationPatchSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(2)
      .max(64)
      .regex(ORGANIZATION_SLUG_PATTERN)
      .optional(),
    name: z.string().trim().min(2).max(255).optional(),
    door: z.enum(ORGANIZATION_DOOR_VALUES).optional(),
    mission: z.string().trim().min(10).max(4000).optional(),
    externalUrl: z.string().trim().url().optional().or(z.literal("")).nullable(),
  })
  .strict()
  .refine((patch) => Object.keys(patch).length > 0, { message: "At least one field is required" });

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["owner", "editor"]);
    const params = paramsSchema.parse(await context.params);
    const payload = organizationPatchSchema.parse(await request.json());

    const [existing] = await db
      .select({ id: organizations.id, slug: organizations.slug })
      .from(organizations)
      .where(eq(organizations.id, params.id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    if (payload.name) assertEditorialText("organizations.name", payload.name);
    if (payload.mission) assertEditorialText("organizations.mission", payload.mission);

    let externalUrl: string | null | undefined;
    if (payload.externalUrl !== undefined) {
      if (payload.externalUrl === "" || payload.externalUrl === null) {
        externalUrl = null;
      } else {
        externalUrl = normalizePublicHttpUrl(payload.externalUrl);
        if (!externalUrl) {
          return apiError({ error: "Validation failed", fields: { externalUrl: "Invalid URL" } }, 400);
        }
      }
    }

    const [updated] = await db
      .update(organizations)
      .set({
        ...(payload.slug !== undefined ? { slug: payload.slug } : {}),
        ...(payload.name !== undefined ? { name: payload.name } : {}),
        ...(payload.door !== undefined ? { door: payload.door } : {}),
        ...(payload.mission !== undefined ? { mission: payload.mission } : {}),
        ...(externalUrl !== undefined ? { externalUrl } : {}),
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, params.id))
      .returning({ id: organizations.id, slug: organizations.slug });

    if (updated) {
      revalidateContent("organizations", { slug: updated.slug });
      if (payload.slug && payload.slug !== existing.slug) {
        revalidateContent("organizations", { slug: existing.slug });
      }
    }

    return NextResponse.json({ ok: true, slug: updated?.slug ?? null });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      const fields: Record<string, string> = {};
      for (const issue of error.issues) {
        const key = issue.path.length > 0 ? String(issue.path[0]) : "payload";
        if (!(key in fields)) fields[key] = issue.message;
      }
      return apiError({ error: "Validation failed", fields }, 400);
    }
    return apiError({ error: "Failed to update organization" }, 500);
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["owner"]);
    const params = paramsSchema.parse(await context.params);

    const [deleted] = await db
      .delete(organizations)
      .where(eq(organizations.id, params.id))
      .returning({ slug: organizations.slug });

    if (!deleted) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    revalidateContent("organizations", { slug: deleted.slug });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return apiError({ error: "Failed to delete organization" }, 500);
  }
}
