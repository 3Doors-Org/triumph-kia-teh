import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { apiError } from "@/lib/api/error-response";
import { getLeadsPage, parseAdminLeadsQuery } from "@/lib/admin/leads-list";
import { requireRole, RoleAccessError } from "@/lib/auth/require-role";

function zodErrorToMessage(error: ZodError): string {
  return error.issues[0]?.message ?? "Validation failed";
}

function serializeLead(row: {
  id: string;
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  sourcePage: string;
  status: string;
  adminNotes: string | null;
  createdAt: Date;
}) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    organization: null,
    subject: null,
    message: row.message,
    inquiryType: row.inquiryType,
    sourcePage: row.sourcePage,
    status: row.status,
    turnstileVerified: null,
    adminNotes: row.adminNotes,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function GET(request: Request) {
  try {
    await requireRole(["owner"]);
    const url = new URL(request.url);
    const query = parseAdminLeadsQuery(url.searchParams);
    const { data, nextCursor, total } = await getLeadsPage(query);
    return NextResponse.json({
      data: data.map(serializeLead),
      nextCursor,
      total,
    });
  } catch (error) {
    if (error instanceof RoleAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof ZodError) {
      return apiError({ error: zodErrorToMessage(error) }, 400);
    }
    throw error;
  }
}
