import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { aboutPageContentSchema } from "@/lib/about/about-page-types";
import { getCachedAboutPageContent } from "@/lib/about/queries";
import { apiError } from "@/lib/api/error-response";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { revalidateContent } from "@/lib/cache/revalidate-content";
import { db } from "@/lib/db";
import { aboutPageConfig } from "@/lib/db/schema";

const patchSchema = z.object({ content: aboutPageContentSchema });

export async function GET() {
  const content = await getCachedAboutPageContent();
  return NextResponse.json({ content });
}

export async function PATCH(request: Request) {
  try {
    await requireRole(["owner", "editor"]);
    const { content } = patchSchema.parse(await request.json());

    await db
      .insert(aboutPageConfig)
      .values({ id: 1, content, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: aboutPageConfig.id,
        set: { content, updatedAt: new Date() },
      });

    revalidateContent("aboutPage");

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      const fields: Record<string, string> = {};
      for (const issue of error.issues) {
        const key = issue.path.join(".") || "content";
        if (!(key in fields)) fields[key] = issue.message;
      }
      return apiError({ error: "Validation failed", fields }, 400);
    }
    return apiError({ error: "Failed to update about page" }, 500);
  }
}

export async function DELETE() {
  try {
    await requireRole(["owner"]);
    await db.delete(aboutPageConfig).where(eq(aboutPageConfig.id, 1));
    revalidateContent("aboutPage");
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return apiError({ error: "Failed to reset about page" }, 500);
  }
}
