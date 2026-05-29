type CommunityImpactCursorPayload = {
  createdAt: string;
  id: string;
};

export function encodeCommunityImpactCursor(payload: CommunityImpactCursorPayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeCommunityImpactCursor(cursor: string): CommunityImpactCursorPayload | null {
  try {
    const raw = Buffer.from(cursor, "base64url").toString("utf8");
    const parsed = JSON.parse(raw) as Partial<CommunityImpactCursorPayload>;
    if (!parsed.createdAt || !parsed.id) {
      return null;
    }
    return { createdAt: parsed.createdAt, id: parsed.id };
  } catch {
    return null;
  }
}
