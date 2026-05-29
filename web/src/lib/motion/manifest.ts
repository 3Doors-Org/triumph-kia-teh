export type PublicPageMotionKey =
  | "home"
  | "about"
  | "organizations"
  | "organization-detail"
  | "community-impact"
  | "achievements"
  | "media"
  | "writing"
  | "writing-detail"
  | "research"
  | "research-detail"
  | "contact"
  | "testimonials";

const REVEAL_MANIFEST: Record<PublicPageMotionKey, ReadonlySet<string>> = {
  home: new Set(["metrics", "organizations", "writing", "cta"]),
  about: new Set(["header", "story", "education", "body", "explore"]),
  organizations: new Set(["header", "grid"]),
  "organization-detail": new Set(["hero", "metrics", "writing", "cta"]),
  "community-impact": new Set(["header", "filters", "results"]),
  achievements: new Set(["header", "results"]),
  media: new Set(["header", "filters", "results"]),
  writing: new Set(["header", "search", "results"]),
  "writing-detail": new Set(["header", "content", "related"]),
  research: new Set(["header", "filters", "results"]),
  "research-detail": new Set(["header", "abstract", "external"]),
  contact: new Set(["header", "sidebar"]),
  testimonials: new Set(["header", "results"]),
};

export function isRevealEnabled(page: PublicPageMotionKey, section: string): boolean {
  return REVEAL_MANIFEST[page].has(section);
}
