import { z } from "zod";

export const inquiryTypeValues = [
  "strategic_consulting",
  "career_development_coaching",
  "educational_consulting",
  "research_mentorship",
  "collaboration",
  "other",
  "general",
  "speaking",
  "partnership",
  "media",
] as const;

export type InquiryType = (typeof inquiryTypeValues)[number];

export const contactSubjectSelectOptions: ReadonlyArray<{ value: InquiryType; label: string }> = [
  { value: "strategic_consulting", label: "Strategic Consulting" },
  { value: "career_development_coaching", label: "Career Development Coaching" },
  { value: "educational_consulting", label: "Educational Consulting" },
  { value: "research_mentorship", label: "Research Mentorship" },
  { value: "collaboration", label: "Collaboration" },
  { value: "other", label: "Other" },
  { value: "general", label: "General" },
  { value: "speaking", label: "Speaking" },
  { value: "partnership", label: "Partnership" },
  { value: "media", label: "Media" },
];

function isInquiryType(value: string): value is InquiryType {
  return (inquiryTypeValues as readonly string[]).includes(value);
}

export const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Please enter your full name.")
      .max(200, "Name is too long. Please use 200 characters or fewer."),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .max(255, "Email is too long."),
    inquiryType: z
      .string()
      .refine((v) => isInquiryType(v), { message: "Please select an inquiry type." }),
    message: z
      .string()
      .trim()
      .min(10, "Please share a bit more detail (at least 10 characters).")
      .max(3000, "Message is too long. Please keep it under 3000 characters."),
    website: z.string().max(255).optional().default(""),
    turnstileToken: z.string().min(1, "Please complete the security check."),
    sourcePage: z.string().trim().max(120).optional().default("/contact"),
  })
  .strict();

export type ContactInput = z.infer<typeof contactSchema>;
