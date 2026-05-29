export type TestimonialSeedRow = {
  id: string;
  authorName: string;
  authorTitle: string | null;
  authorOrganization: string | null;
  quote: string;
  status: string;
  avatarUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export const PORTFOLIO_TESTIMONIALS: TestimonialSeedRow[] = [];
