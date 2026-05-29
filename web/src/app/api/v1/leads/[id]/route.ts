import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

import { apiError } from "@/lib/api/error-response";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { leadStatusSchema } from "@/lib/leads/status";
import { logLeadAudit } from "@/lib/observability/logger";

const routeParamsSchema = z.object({
  id: z.string().uuid(),
});

const patchLeadSchema = z
  .object({
    status: leadStatusSchema.optional(),
    adminNotes: z.string().max(5000).nullable().optional(),
  })
  .strict()
  .refine((body) => body.status !== undefined || body.adminNotes !== undefined, {
    message: "At least one of status or adminNotes is required",
  });

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = routeParamsSchema.parse(await context.params);
    const session = await requireRole(["owner"]);
    const body = patchLeadSchema.parse(await request.json());

    const [existing] = await db
      .select({ id: leads.id })
      .from(leads)
      .where(eq(leads.id, params.id))
      .limit(1);
    if (!existing) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const [updated] = await db
      .update(leads)
      .set({
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.adminNotes !== undefined ? { adminNotes: body.adminNotes } : {}),
      })
      .where(eq(leads.id, params.id))
      .returning({
        id: leads.id,
        name: leads.name,
        email: leads.email,
        inquiryType: leads.inquiryType,
        message: leads.message,
        sourcePage: leads.sourcePage,
        status: leads.status,
        adminNotes: leads.adminNotes,
        createdAt: leads.createdAt,
      });

    if (updated) {
      logLeadAudit({ event: "lead_updated", leadId: updated.id, actorUserId: session.user.id });
    }

    return NextResponse.json({
      id: updated!.id,
      name: updated!.name,
      email: updated!.email,
      organization: null,
      subject: null,
      message: updated!.message,
      inquiryType: updated!.inquiryType,
      sourcePage: updated!.sourcePage,
      status: updated!.status,
      turnstileVerified: null,
      adminNotes: updated!.adminNotes,
      createdAt: updated!.createdAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof ZodError) {
      const fields: Record<string, string> = {};
      for (const issue of error.issues) {
        const key = issue.path.length > 0 ? String(issue.path[0]) : "payload";
        if (!(key in fields)) fields[key] = issue.message;
      }
      return apiError({ error: "Validation failed", fields }, 400);
    }
    throw error;
  }
}
