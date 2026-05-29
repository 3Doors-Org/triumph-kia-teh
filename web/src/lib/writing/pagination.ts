type WritingCursorPayload = {
  publishedAt: string;
  id: string;
};

export function encodeWritingCursor(payload: WritingCursorPayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeWritingCursor(cursor: string): WritingCursorPayload | null {
  try {
    const raw = Buffer.from(cursor, "base64url").toString("utf8");
    const parsed = JSON.parse(raw) as Partial<WritingCursorPayload>;
    if (typeof parsed.publishedAt !== "string" || typeof parsed.id !== "string") {
      return null;
    }
    const publishedDate = new Date(parsed.publishedAt);
    if (Number.isNaN(publishedDate.getTime())) {
      return null;
    }
    return { publishedAt: parsed.publishedAt, id: parsed.id };
  } catch {
    return null;
  }
}
