import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/lib/api/error-response";
import {
  revalidateContent,
  type RevalidateContentTarget,
} from "@/lib/cache/revalidate-content";

const revalidateBodySchema = z.object({
  target: z.enum(["writing", "research", "communityImpact"]),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
});

function isAuthorized(request: Request) {
  const secret = process.env.INTERNAL_REVALIDATE_SECRET;
  if (!secret) {
    return false;
  }
  return request.headers.get("x-internal-revalidate-secret") === secret;
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return apiError({ error: "Forbidden" }, 403);
  }
  if (!isAuthorized(request)) {
    return apiError({ error: "Forbidden" }, 403);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return apiError({ error: "Validation failed", fields: { body: "Invalid JSON body" } }, 400);
  }

  const parsed = revalidateBodySchema.safeParse(payload);
  if (!parsed.success) {
    return apiError({ error: "Validation failed", fields: { body: "Invalid revalidation payload" } }, 400);
  }

  const { target, slug } = parsed.data as { target: RevalidateContentTarget; slug?: string };
  const result = revalidateContent(target, { slug });
  return NextResponse.json(
    { ok: true, target, slug: slug ?? null, executed: result.executed, reason: result.reason },
    { status: 200 },
  );
}
