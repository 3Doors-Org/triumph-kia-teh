export type AchievementCategory =
  | "academic"
  | "scholarship"
  | "grant"
  | "leadership"
  | "innovation"
  | "certification";

export type AchievementSeedRow = {
  id: string;
  title: string;
  summary: string;
  category: AchievementCategory;
  venue: string | null;
  achievedAt: Date | null;
  externalUrl: string | null;
  isPublished: boolean;
};

export const ACHIEVEMENT_CATEGORY_LABELS: Record<AchievementCategory, string> = {
  academic: "Academic",
  scholarship: "Scholarship",
  grant: "Grant",
  leadership: "Leadership",
  innovation: "Innovation",
  certification: "Certification",
};

export const ACHIEVEMENT_FILTER_CATEGORIES = [
  "all",
  "academic",
  "scholarship",
  "grant",
  "leadership",
  "innovation",
  "certification",
] as const;

export type AchievementFilterCategory = (typeof ACHIEVEMENT_FILTER_CATEGORIES)[number];

export const PORTFOLIO_ACHIEVEMENTS: AchievementSeedRow[] = [
  {
    id: "a1000001-0000-4000-8000-000000000001",
    title: "Youth4Climate Initiative Grant - DeWise Foundation",
    summary:
      "17 million XAF (~$30,000 USD) grant to scale WiseCool Project (solar-powered medical cold chains and telemedicine for underserved communities in Cameroon)",
    category: "grant",
    venue: "Youth4Climate Initiative",
    achievedAt: new Date("2025-11-01T00:00:00Z"),
    externalUrl: null,
    isPublished: true,
  },
  {
    id: "a1000001-0000-4000-8000-000000000002",
    title: "Evolutionary Game Theory Prize",
    summary: "1st Place, Annual Undergraduate Research Poster Competition 2025",
    category: "academic",
    venue: "Dartmouth Math Department",
    achievedAt: new Date("2025-06-01T00:00:00Z"),
    externalUrl: null,
    isPublished: true,
  },
  {
    id: "a1000001-0000-4000-8000-000000000003",
    title: "Davis Projects for Peace Award",
    summary: "$10,000 grant for WiseBox Project (1,000 solar-powered devices, 100 youth leaders trained)",
    category: "grant",
    venue: "Kathryn Davis Foundation",
    achievedAt: new Date("2025-05-01T00:00:00Z"),
    externalUrl: null,
    isPublished: true,
  },
  {
    id: "a1000001-0000-4000-8000-000000000004",
    title: "Nominee - Inducted Leader",
    summary: "National recognition for leadership excellence",
    category: "leadership",
    venue: "Sigma Alpha Pi (ΣAπ) - National Society of Leadership and Success",
    achievedAt: new Date("2025-05-01T00:00:00Z"),
    externalUrl: null,
    isPublished: true,
  },
  {
    id: "a1000001-0000-4000-8000-000000000005",
    title: "National MTN Cameroon ICT Innovation / PachiPanda Challenge",
    summary:
      "3rd Place National Cameroon Winner (WiseCool) | Advanced to Pan-African Innovation Challenge (3rd Place, Johannesburg)",
    category: "innovation",
    venue: "MTN Cameroon",
    achievedAt: new Date("2025-04-01T00:00:00Z"),
    externalUrl: null,
    isPublished: true,
  },
  {
    id: "a1000001-0000-4000-8000-000000000006",
    title: "Rufus Choate Scholar",
    summary:
      "Academic distinction for full year 2022-23 4.00 CGPA in the top 5% of all 4000+ Dartmouth Students",
    category: "academic",
    venue: "Undergraduate Deans Office",
    achievedAt: new Date("2023-06-01T00:00:00Z"),
    externalUrl: null,
    isPublished: true,
  },
  {
    id: "a1000001-0000-4000-8000-000000000007",
    title: "Unleash Global Talent '22",
    summary: "Selected as 1 of 1,000 global leaders from 19,000 applicants",
    category: "leadership",
    venue: "Unleash Innovation Lab - India 2022 Cohort",
    achievedAt: new Date("2022-12-01T00:00:00Z"),
    externalUrl: null,
    isPublished: true,
  },
  {
    id: "a1000001-0000-4000-8000-000000000008",
    title: "Great Issues Scholar (GIS)",
    summary:
      "Selected as 1 of 80 first-year scholars (from ~175-200 applicants) for year-long global engagement program. Participated in small-group discussions with faculty, visiting experts, and alumni on global health, climate change, international development, and security.",
    category: "academic",
    venue: "The John Sloan Dickey Center for International Understanding",
    achievedAt: new Date("2022-09-01T00:00:00Z"),
    externalUrl: null,
    isPublished: true,
  },
  {
    id: "a1000001-0000-4000-8000-000000000009",
    title: "King Scholar",
    summary:
      "Dartmouth's highest merit scholarship (~$400,000 over 4 years) | Full-ride scholarship for academic excellence and leadership potential",
    category: "scholarship",
    venue: "King Philantropies",
    achievedAt: new Date("2022-09-01T00:00:00Z"),
    externalUrl: null,
    isPublished: true,
  },
  {
    id: "a1000001-0000-4000-8000-00000000000a",
    title: "Open Dreams Scholar",
    summary:
      "Selected as 1 of ~20-25 scholars annually from Cameroon's top students (200+ scholars placed at 50+ elite universities globally since 2014). 1 of 2 scholars in Open Dreams' first-ever Ivy League cohort (2022), opening pathways for subsequent OD scholars to other Ivy institutions. Organization's 10th Anniversary (2024) named after me as 'A Decade of Triumph' and 2024 cohort named 'Batch of Triumph' in recognition of Ivy League pioneering achievement and community service impact.",
    category: "scholarship",
    venue: "Open Dreams",
    achievedAt: new Date("2022-09-01T00:00:00Z"),
    externalUrl: null,
    isPublished: true,
  },
  {
    id: "a1000001-0000-4000-8000-00000000000b",
    title: "Crossroads Emerging Leader '21 (Aspire Fellow '21)",
    summary:
      "Top 100 Finalist Global Leaders of ~4,000 applicants. Subsequently contributed to a fellow Aspire Leader Faith Nchotu's Community Action Award ($10K USD) project (1 of 6 globally funded in our 100 person cohort), project reaching 400+ students across 7 schools in Yaoundé.",
    category: "leadership",
    venue: "Aspire Institute",
    achievedAt: new Date("2021-12-01T00:00:00Z"),
    externalUrl: null,
    isPublished: true,
  },
  {
    id: "a1000001-0000-4000-8000-00000000000c",
    title: "Merit Award for Leadership & Outstanding Contributions",
    summary:
      'Dual merit awards earned during 6-week Public Health internship with MedLife. Developed fundraising campaign for COVID-19 relief efforts in Peru. Passed with distinction across all modules. Described as "standout" and "perfect example of the kind of Intern we look for."',
    category: "leadership",
    venue: "MedLife and Global Leadership Adventures - GIVI Program",
    achievedAt: new Date("2021-08-01T00:00:00Z"),
    externalUrl: null,
    isPublished: true,
  },
  {
    id: "a1000001-0000-4000-8000-00000000000d",
    title: "National Selectee - Advocating for Change for Adolescents Project (ACAP)",
    summary:
      "Selected as 1 of 2 regional representatives (Southwest Region of Cameroon) for National Training on Adolescent Health and Well-being in Yaoundé. Promoted from volunteer to Community Officer for DESERVE following national selection.",
    category: "leadership",
    venue: "Ministry of Youth Affairs and Civic Education, Cameroon",
    achievedAt: new Date("2021-02-01T00:00:00Z"),
    externalUrl: null,
    isPublished: true,
  },
  {
    id: "a1000001-0000-4000-8000-00000000000e",
    title: "3X Citation for Meritorious Performance",
    summary:
      "Academic excellence recognition for earning A* grades with special faculty notes on academic transcript",
    category: "academic",
    venue: "Undergraduate Deans Office",
    achievedAt: new Date("2025-01-01T00:00:00Z"),
    externalUrl: null,
    isPublished: true,
  },
  {
    id: "b2000001-0000-4000-8000-000000000001",
    title: "Certificate of Participation",
    summary:
      "Global Innovation Talent (top 1000 from 19000 applicants) at Unleash India 2022 on Infosys Campus Mysore",
    category: "certification",
    venue: "UNLEASH",
    achievedAt: new Date("2022-12-01T00:00:00Z"),
    externalUrl: null,
    isPublished: true,
  },
  {
    id: "b2000001-0000-4000-8000-000000000002",
    title: "Certificate of Accomplishment",
    summary:
      "Aspire Institute (formerly Crossroads Emerging Leaders Program) finalist certification of accomplishment. Top 100 Finalist Global Leaders of ~4,000 applicants.",
    category: "certification",
    venue: "The Lakshmi Mittal and Family South Asia Institute at Harvard University",
    achievedAt: new Date("2021-12-01T00:00:00Z"),
    externalUrl: null,
    isPublished: true,
  },
  {
    id: "b2000001-0000-4000-8000-000000000003",
    title: "Entrepreneurship in Emerging Economies",
    summary: "HarvardX SW47x Certificate",
    category: "certification",
    venue: "HarvardX",
    achievedAt: new Date("2021-12-01T00:00:00Z"),
    externalUrl: "https://courses.edx.org/certificates/87c11dd86ce54c58b90ac1138b8aee27",
    isPublished: true,
  },
];
