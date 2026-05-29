export type MediaFormat = "podcast" | "article" | "panel" | "interview" | "video";

export type MediaSeedRow = {
  id: string;
  title: string;
  outlet: string;
  format: MediaFormat;
  summary: string;
  externalUrl: string;
  publishedAt: Date | null;
  isPublished: boolean;
};

export const PORTFOLIO_MEDIA_APPEARANCES: MediaSeedRow[] = [];
