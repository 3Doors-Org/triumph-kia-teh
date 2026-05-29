import { aboutPageContentSchema, type AboutPageContent } from "@/lib/about/about-page-types";
import { DEFAULT_ABOUT_PAGE_CONTENT } from "@/lib/about/default-about-content";
import { EDUCATION_PROFILE } from "@/lib/about/education-content";

export function withExplicitEducationLocation(content: AboutPageContent): AboutPageContent {
  const location = content.education.location.trim() || EDUCATION_PROFILE.location;

  return {
    ...content,
    education: {
      ...content.education,
      location,
    },
  };
}

export function parseAboutContentFromDb(raw: unknown): AboutPageContent {
  const parsed = aboutPageContentSchema.safeParse(raw);
  if (!parsed.success) {
    return DEFAULT_ABOUT_PAGE_CONTENT;
  }
  return withExplicitEducationLocation(parsed.data);
}
