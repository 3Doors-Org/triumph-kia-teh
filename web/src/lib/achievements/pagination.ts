type AchievementCursorPayload = {
  achievedAt: string;
  id: string;
};

export function encodeAchievementsCursor(payload: AchievementCursorPayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeAchievementsCursor(cursor: string): AchievementCursorPayload | null {
  try {
    const decoded = Buffer.from(cursor, "base64url").toString("utf8");
    const value = JSON.parse(decoded) as Partial<AchievementCursorPayload>;
    if (
      typeof value?.achievedAt !== "string" ||
      value.achievedAt.length === 0 ||
      Number.isNaN(new Date(value.achievedAt).getTime()) ||
      typeof value?.id !== "string" ||
      value.id.length === 0
    ) {
      return null;
    }
    return { achievedAt: value.achievedAt, id: value.id };
  } catch {
    return null;
  }
}
