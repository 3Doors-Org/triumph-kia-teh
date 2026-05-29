const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileResponse = {
  success: boolean;
};

export async function verifyTurnstileToken(token: string, remoteIp: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return { success: false, reason: "missing_secret" as const };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4_000);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: remoteIp ?? undefined,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      return { success: false, reason: "verification_http_error" as const };
    }

    const data = (await response.json()) as TurnstileResponse;
    return { success: data.success, reason: data.success ? null : ("invalid_token" as const) };
  } catch {
    return { success: false, reason: "verification_unavailable" as const };
  } finally {
    clearTimeout(timeout);
  }
}
