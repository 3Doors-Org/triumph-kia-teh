import { NextResponse } from "next/server";

import { apiError } from "@/lib/api/error-response";
import { submitContact } from "@/lib/contact/submit-contact";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { sendContactNotifications } from "@/lib/email/contact-notifications";
import { getClientIp } from "@/lib/security/privacy";
import { enforceContactRateLimit } from "@/lib/security/rate-limit";
import { verifyTurnstileToken } from "@/lib/security/turnstile";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError({ error: "Validation failed" }, 400);
  }

  const result = await submitContact(
    body,
    {
      ip: getClientIp(request.headers),
      userAgent: request.headers.get("user-agent"),
    },
    {
      enforceRateLimit: enforceContactRateLimit,
      verifyTurnstile: verifyTurnstileToken,
      insertLead: async (input) => {
        const [inserted] = await db.insert(leads).values(input).returning({ id: leads.id });
        if (!inserted?.id) {
          throw new Error("Lead insert did not return an id");
        }
        return inserted;
      },
      notifyLead: sendContactNotifications,
    },
  );

  if (result.status === 429) {
    return apiError(result.body, 429, { "Retry-After": String(result.retryAfter) });
  }
  if (result.status === 400 || result.status === 500 || result.status === 503) {
    return apiError(result.body, result.status);
  }

  return NextResponse.json(result.body, { status: result.status });
}
