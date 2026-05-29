type MediaCursorPayload = {
  publishedAt: string;
  id: string;
};

export function encodeMediaCursor(payload: MediaCursorPayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeMediaCursor(cursor: string): MediaCursorPayload | null {
  try {
    const decoded = Buffer.from(cursor, "base64url").toString("utf8");
    const value = JSON.parse(decoded) as Partial<MediaCursorPayload>;
    if (
      typeof value?.publishedAt !== "string" ||
      value.publishedAt.length === 0 ||
      Number.isNaN(new Date(value.publishedAt).getTime()) ||
      typeof value?.id !== "string" ||
      value.id.length === 0
    ) {
      return null;
    }
    return { publishedAt: value.publishedAt, id: value.id };
  } catch {
    return null;
  }
}
