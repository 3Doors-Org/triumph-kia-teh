import { COMMUNITY_IMPACT_FEATURED_ENTRY_IDS } from "@/lib/community-impact/featured-entry-ids";

export type PortfolioProjectIcon = "zap" | "lightbulb" | "users" | "heart";

export type CommunityImpactPortfolioSeedProject = {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  skills: string[];
  icon: PortfolioProjectIcon;
  door: string;
  type: string;
  orgSlug: string | null;
  metricLabel: string;
  metricValue: number;
  startDateIso: string;
  createdAtIso: string;
};

export const COMMUNITY_IMPACT_PORTFOLIO_PROJECTS: CommunityImpactPortfolioSeedProject[] = [
  {
    id: COMMUNITY_IMPACT_FEATURED_ENTRY_IDS.wisecool,
    title: "WiseCool - Cold Storage Hospital Units",
    organization: "DeWise Foundation",
    period: "Jan 2025 – Present",
    icon: "zap",
    description:
      "Co-lead as CSO and Cofounder fundraising with President and Co-founder of Dewise and have secured over $33K USD from MTN Cameroon and Youth4Climate Initiative Grant to develop WiseCool, a solar-powered IoT cold storage custom refrigeration unit designed to provide reliable refrigeration for medications, and projected to increase lifespan by 50% more at rural clinics in crisis affected regions in Cameroon.",
    skills: ["Project Management", "Go-to-Market Strategy"],
    door: "ACCESS",
    type: "climate-health",
    orgSlug: "dewisefoundation",
    metricLabel: "Programme funding secured (USD)",
    metricValue: 33000,
    startDateIso: "2025-01-01T00:00:00.000Z",
    createdAtIso: "2025-05-08T12:00:00.000Z",
  },
  {
    id: COMMUNITY_IMPACT_FEATURED_ENTRY_IDS.wisebox,
    title: "WiseBox - Empowering Internally Displaced Youth",
    organization: "DeWise Foundation",
    period: "Jun 2025 – Jul 2025",
    icon: "lightbulb",
    description:
      "Sponsored by $10k Davis Projects for Peace awarded by Kathryn Davis Foundation through The John Sloan Dickey Center at Dartmouth. Developed 1,000+ solar-powered custom power banks, restoring education for displaced youth in conflict zones where hydro power outages last months. Trained 100 Climate Justice Young Leaders on climate justice, sustainable development, leadership, etc during hands-on project execution.",
    skills: ["Project Management"],
    door: "OPPORTUNITY",
    type: "education-energy",
    orgSlug: "dewisefoundation",
    metricLabel: "Davis Projects for Peace grant (USD)",
    metricValue: 10000,
    startDateIso: "2025-06-01T00:00:00.000Z",
    createdAtIso: "2025-05-07T12:00:00.000Z",
  },
  {
    id: COMMUNITY_IMPACT_FEATURED_ENTRY_IDS.energyFellowship,
    title: "National Energy Transition Fellowship (2024)",
    organization: "DeWise Foundation",
    period: "2024",
    icon: "users",
    description:
      "Co-designed and led the National Energy Transition Fellowship (2024) with 200+ attendees and mini-grants for youth-led climate initiatives, featured nationally on CRTV--Cameroon's premier national tv and radio station with representatives from the Ministry of Youths and Civic Education.",
    skills: ["Project Management"],
    door: "ACCESS",
    type: "fellowship",
    orgSlug: "dewisefoundation",
    metricLabel: "Fellowship convening reach",
    metricValue: 200,
    startDateIso: "2024-01-01T00:00:00.000Z",
    createdAtIso: "2025-05-06T12:00:00.000Z",
  },
  {
    id: COMMUNITY_IMPACT_FEATURED_ENTRY_IDS.generationAids,
    title: "Generation to End Aids Project",
    organization: "Funded by UNAIDS, OAK, Restless Development",
    period: "Jan 2022 – Aug 2022",
    icon: "heart",
    description:
      "Youth-led HIV/AIDS awareness initiative reaching 400+ community members through monthly outreach programs. Co-led team of 7 to dispel myths about AIDS, promote health equity, and increase testing access in Yaoundé communities. Coordinated both in-person education sessions (50+ attendees monthly) and social media campaigns. Work supported UNAIDS' policy development and statistical analysis on HIV/AIDS in Cameroon's youth populations.",
    skills: ["Community Outreach", "Project Management"],
    door: "ACCESS",
    type: "public-health",
    orgSlug: null,
    metricLabel: "Community members engaged",
    metricValue: 400,
    startDateIso: "2022-01-01T00:00:00.000Z",
    createdAtIso: "2025-05-05T12:00:00.000Z",
  },
];
