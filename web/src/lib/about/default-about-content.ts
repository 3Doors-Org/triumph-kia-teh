import type { AboutPageContent } from "@/lib/about/about-page-types";
import { EDUCATION_PROFILE } from "@/lib/about/education-content";
import { PATH_OF_PURPOSE_MILESTONES } from "@/lib/about/path-of-purpose-content";

export const DEFAULT_ABOUT_PAGE_CONTENT: AboutPageContent = {
  hero: {
    eyebrow: "About",
    name: "Triumph Kia Teh",
    intro:
      "As a practitioner and scholar, he builds durable systems where access, excellence, and opportunity meet, with a long view toward institutions and communities that can rely on them for years, not seasons.",
  },
  journey: {
    eyebrow: "THE JOURNEY",
    title: "A Path of Purpose",
    subtitle: "From curiosity to impact: key milestones that shaped the vision.",
    milestones: PATH_OF_PURPOSE_MILESTONES,
  },
  education: {
    sectionEyebrow: "Education",
    sectionTitle: "Academic foundation",
    sectionSubtitle: "Building excellence through rigorous academics and transformative leadership.",
    institution: EDUCATION_PROFILE.institution,
    degree: EDUCATION_PROFILE.degree,
    period: EDUCATION_PROFILE.period,
    location: EDUCATION_PROFILE.location,
    focusAreas: [...EDUCATION_PROFILE.focusAreas],
    honorsHeading: "Academic honors & recognition",
    honors: EDUCATION_PROFILE.honors.map((item) => ({ ...item })),
    leadershipHeading: "Leadership & impact",
    leadership: EDUCATION_PROFILE.leadership.map((item) => ({ ...item })),
  },
  institutional: {
    practiceLabel: "In practice",
    practiceIntro:
      "The timeline above is personal context. This section is where the same arc shows up in institutions and programmes: what the work is, how it is organized, and where it lives on this site.",
    sections: [
      {
        heading: "Institutional focus",
        paragraphs: [
          "His work centers on institutional design, leadership development, and applied research that improves implementation quality in complex social contexts. The objective is consistent: turn single interventions into durable systems that communities can navigate with confidence.",
          "This site documents that work as infrastructure rather than narrative. Each research output and community record is structured to remain discoverable, linked across the site, and usable over time.",
        ],
      },
      {
        heading: "Leadership and organizations",
        paragraphs: [
          "Triumph leads and supports initiatives across multiple organizations, including 3Doors, the Palaver Institute, and the DeWise Foundation. These institutions operate across a shared framework while serving distinct implementation roles in education access, governance quality, and opportunity systems.",
          "He convenes partners, researchers, and practitioners to build measurable pathways that improve outcomes for students, institutions, and communities.",
        ],
      },
    ],
  },
};
