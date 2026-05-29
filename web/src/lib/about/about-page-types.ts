import { z } from "zod";

export const PATH_OF_PURPOSE_ICON_VALUES = [
  "graduation-cap",
  "rocket",
  "building",
  "book-open",
  "globe",
  "sparkles",
] as const;

export type PathOfPurposeIcon = (typeof PATH_OF_PURPOSE_ICON_VALUES)[number];

const milestoneSchema = z.object({
  year: z.string().trim().min(1).max(20),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(2000),
  icon: z.enum(PATH_OF_PURPOSE_ICON_VALUES),
});

const textItemSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(2000),
});

const institutionalSectionSchema = z.object({
  heading: z.string().trim().min(1).max(200),
  paragraphs: z.array(z.string().trim().min(1).max(2000)).min(1).max(8),
});

export const aboutPageContentSchema = z.object({
  hero: z.object({
    eyebrow: z.string().trim().min(1).max(80),
    name: z.string().trim().min(1).max(200),
    intro: z.string().trim().min(1).max(2000),
  }),
  journey: z.object({
    eyebrow: z.string().trim().min(1).max(80),
    title: z.string().trim().min(1).max(200),
    subtitle: z.string().trim().min(1).max(500),
    milestones: z.array(milestoneSchema).min(1).max(20),
  }),
  education: z.object({
    sectionEyebrow: z.string().trim().min(1).max(80),
    sectionTitle: z.string().trim().min(1).max(200),
    sectionSubtitle: z.string().trim().min(1).max(500),
    institution: z.string().trim().min(1).max(200),
    degree: z.string().trim().min(1).max(200),
    period: z.string().trim().min(1).max(120),
    location: z.string().trim().max(120).default(""),
    focusAreas: z.array(z.string().trim().min(1).max(80)).min(1).max(12),
    honorsHeading: z.string().trim().min(1).max(200),
    honors: z.array(textItemSchema).max(20),
    leadershipHeading: z.string().trim().min(1).max(200),
    leadership: z.array(textItemSchema).max(20),
  }),
  institutional: z.object({
    practiceLabel: z.string().trim().min(1).max(80),
    practiceIntro: z.string().trim().min(1).max(1000),
    sections: z.array(institutionalSectionSchema).min(1).max(10),
  }),
});

export type AboutPageContent = z.infer<typeof aboutPageContentSchema>;
