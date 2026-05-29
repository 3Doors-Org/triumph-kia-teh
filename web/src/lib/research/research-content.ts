export type ResearchSeedRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  abstract: string;
  authors: string[];
  venue: string;
  status: "published" | "in_progress" | "working_paper";
  externalUrl: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  isPublished: boolean;
};

export const RESEARCH_OUTPUTS: ResearchSeedRow[] = [
  {
    id: "3f30a4dc-5ce9-429d-bf4c-75fe2422d972",
    slug: "computational-modeling-social-influence-investment-decision-making",
    title:
      "Computational Modeling of Social Influence in Investment Decision-Making: Market Sentiment vs. Learning Effects in Human Stock Choice Task",
    summary:
      "Research publication exploring computational models of social influence in financial decision-making processes.",
    abstract:
      "This research develops and evaluates computational models of social influence in financial decision-making. It compares sentiment-driven behavior with adaptive learning effects in a controlled human stock-choice task, showing how collective cues can accelerate both effective and ineffective decision trajectories.",
    authors: ["Triumph Kia Teh"],
    venue: "Zenodo",
    status: "published",
    externalUrl: "https://doi.org/10.5281/zenodo.17284572",
    publishedAt: new Date("2025-10-27T00:00:00Z"),
    createdAt: new Date("2025-10-27T12:00:00Z"),
    isPublished: true,
  },
  {
    id: "7c47bf28-6a0d-4965-a8b7-bf171d025ce9",
    slug: "evolutionary-game-theory-risks-college-dating-strategies",
    title: "Evolutionary Game Theory Modeling of Risks in College Dating Strategies",
    summary:
      "Academic research applying evolutionary game theory to analyze dating strategy risks in college environments.",
    abstract:
      "Using an evolutionary game theory approach, this study models the risk structure embedded in college dating strategies. The work maps payoff dynamics, stability conditions, and adaptation patterns that influence decision quality and welfare outcomes in peer-concentrated social systems.",
    authors: ["Triumph Kia Teh"],
    venue: "Zenodo",
    status: "published",
    externalUrl: "https://doi.org/10.5281/zenodo.17284126",
    publishedAt: new Date("2025-10-27T00:00:00Z"),
    createdAt: new Date("2025-10-27T11:00:00Z"),
    isPublished: true,
  },
];
