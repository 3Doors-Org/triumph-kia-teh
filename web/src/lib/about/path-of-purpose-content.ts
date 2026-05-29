export type PathOfPurposeIcon =
  | "graduation-cap"
  | "rocket"
  | "building"
  | "book-open"
  | "globe"
  | "sparkles";

export type PathOfPurposeMilestone = {
  year: string;
  title: string;
  description: string;
  icon: PathOfPurposeIcon;
};

export const PATH_OF_PURPOSE_MILESTONES: PathOfPurposeMilestone[] = [
  {
    year: "2021",
    title: "The Foundation",
    description:
      "Left Cameroon's Anglophone crisis zone with nothing but a scholarship dream. Slept on floors in Yaoundé, volunteered at NGOs for WiFi access, and applied to every opportunity.",
    icon: "graduation-cap",
  },
  {
    year: "2022",
    title: "Access Achieved",
    description:
      "Secured full funding to Dartmouth College after three years of relentless pursuit. The journey from crisis zone to elite education began.",
    icon: "rocket",
  },
  {
    year: "2023",
    title: "Building Excellence",
    description:
      "Founded DeWise Foundation serving 3,000+ youth and Palaver Institute training African researchers. Raised $50,000+ in grants, published research papers.",
    icon: "building",
  },
  {
    year: "2024",
    title: "Thought Leadership",
    description:
      "Recognized as King Scholar, Rufus Choate Scholar, and Davis Projects for Peace recipient. Built 10+ leadership roles at Dartmouth.",
    icon: "book-open",
  },
  {
    year: "2025",
    title: "Global Impact",
    description:
      "Expanding pathways for student success across three phases. Connecting grassroots African researchers with diaspora mentors worldwide.",
    icon: "globe",
  },
  {
    year: "2026",
    title: "The Vision Continues",
    description:
      "Scaling the guidance that changed my trajectory. Building bridges between Access, Excellence, and Opportunity for the next generation.",
    icon: "sparkles",
  },
];
