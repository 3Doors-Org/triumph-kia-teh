import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/lib/api/error-response";
import { listOrganizationsForAdmin } from "@/lib/admin/organizations-list";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { revalidateContent } from "@/lib/cache/revalidate-content";
import { db } from "@/lib/db";
import { organizations } from "@/lib/db/schema";
import { assertEditorialText } from "@/lib/editorial/lint";
import { ORGANIZATION_DOOR_VALUES, ORGANIZATION_SLUG_PATTERN } from "@/lib/organizations/constants";
import { normalizePublicHttpUrl } from "@/lib/security/url";

const organizationMutationSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(64)
    .regex(ORGANIZATION_SLUG_PATTERN, "Slug must be lowercase letters, numbers, and hyphens"),
  name: z.string().trim().min(2).max(255),
  door: z.enum(ORGANIZATION_DOOR_VALUES),
  mission: z.string().trim().min(10).max(4000),
  externalUrl: z.string().trim().url().optional().or(z.literal("")).default(""),
});

export async function GET() {
  try {
    await requireRole(["owner", "editor"]);
    const rows = await listOrganizationsForAdmin();
    return NextResponse.json({
      data: rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        door: row.door,
        mission: row.mission,
        externalUrl: row.externalUrl,
        updatedAt: row.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    await requireRole(["owner", "editor"]);
    const payload = organizationMutationSchema.parse(await request.json());

    assertEditorialText("organizations.name", payload.name);
    assertEditorialText("organizations.mission", payload.mission);

    const externalUrl = payload.externalUrl ? normalizePublicHttpUrl(payload.externalUrl) : null;
    if (payload.externalUrl && !externalUrl) {
      return apiError({ error: "Validation failed", fields: { externalUrl: "Invalid URL" } }, 400);
    }

    const [created] = await db
      .insert(organizations)
      .values({
        slug: payload.slug,
        name: payload.name,
        door: payload.door,
        mission: payload.mission,
        externalUrl,
      })
      .returning({ id: organizations.id, slug: organizations.slug });

    if (created) {
      revalidateContent("organizations", { slug: created.slug });
    }

    return NextResponse.json({ ok: true, id: created?.id ?? null, slug: created?.slug ?? null }, { status: 201 });
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
    if (error instanceof Error && error.message.includes("unique")) {
      return apiError({ error: "An organization with this slug already exists" }, 400);
    }
    return apiError({ error: "Failed to create organization" }, 500);
  }
}
