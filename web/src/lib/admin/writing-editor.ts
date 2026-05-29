import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";

export async function getAdminWritingPostBySlug(slug: string) {
  const [row] = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      summary: posts.summary,
      door: posts.door,
      status: posts.status,
      tags: posts.tags,
      bodyJson: posts.bodyJson,
    })
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  return row ?? null;
}

export function bodyJsonToPlainText(input: unknown): string {
  if (!isRecord(input)) {
    return "";
  }

  const content = Array.isArray(input.content) ? input.content : [];
  const parts: Array<string> = [];
  for (const node of content) {
    if (!isRecord(node)) {
      continue;
    }
    if (node.type !== "paragraph") {
      continue;
    }
    const nodeContent = Array.isArray(node.content) ? node.content : [];
    const text = nodeContent
      .map((child) => (isRecord(child) && child.type === "text" ? String(child.text ?? "") : ""))
      .join("");
    if (text.length > 0) {
      parts.push(text);
    }
  }
  return parts.join("\n\n");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
