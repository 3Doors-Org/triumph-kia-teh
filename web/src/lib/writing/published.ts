import { eq, type SQL } from "drizzle-orm";

import { posts } from "@/lib/db/schema";

export const PUBLISHED_POST_STATUS = "published" as const;

export function postsPublishedWhere(): SQL {
  return eq(posts.status, PUBLISHED_POST_STATUS);
}
