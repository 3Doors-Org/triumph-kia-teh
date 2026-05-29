import crypto from "node:crypto";

const dayStamp = () => new Date().toISOString().split("T")[0] ?? "unknown";

export function hashForPrivacy(raw: string | null | undefined) {
  if (!raw) {
    return null;
  }

  const salt = process.env.IP_HASH_SALT ?? "dev-fallback-salt";
  return crypto
    .createHash("sha256")
    .update(`${raw}:${dayStamp()}:${salt}`)
    .digest("hex");
}

export function getClientIp(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }
  return headers.get("x-real-ip");
}
