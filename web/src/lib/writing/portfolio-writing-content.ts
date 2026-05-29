export type WritingPostSeedRow = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  bodyJson: Record<string, unknown>;
  status: "published" | "draft";
  door: string | null;
  publishedAt: Date | null;
};

export const PORTFOLIO_WRITING_POSTS: WritingPostSeedRow[] = [];
