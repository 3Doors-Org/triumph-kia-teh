import { Award, GraduationCap, Users } from "lucide-react";

import { RevealSection } from "@/components/motion/reveal-section";
import { Badge, Card } from "@/components/ui";
import type { AboutPageContent } from "@/lib/about/about-page-types";
import { isRevealEnabled } from "@/lib/motion/manifest";

export function EducationSection({ education }: { education: AboutPageContent["education"] }) {
  return (
    <RevealSection
      as="section"
      enabled={isRevealEnabled("about", "education")}
      aria-labelledby="education-heading"
      className="-mx-4 bg-muted/30 px-4 py-10 md:rounded-2xl md:px-6 md:py-12"
    >
      <header className="mb-10 space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-accent)">{education.sectionEyebrow}</p>
        <h2
          id="education-heading"
          style={{ fontFamily: "var(--font-display)" }}
          className="text-3xl font-semibold md:text-4xl"
        >
          {education.sectionTitle}
        </h2>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-(--color-muted-fg)">{education.sectionSubtitle}</p>
      </header>

      <Card className="mb-8 p-6 md:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-(--color-accent)">
            <GraduationCap size={32} aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h3 style={{ fontFamily: "var(--font-display)" }} className="mb-1 text-2xl font-semibold">
              {education.degree}
            </h3>
            <p className="mb-2 text-base font-semibold text-(--color-accent)">{education.institution}</p>
            <p className="mb-1 text-sm text-(--color-muted-fg)">{education.period}</p>
            {education.location ? (
              <p className="mb-4 text-sm text-(--color-muted-fg)">{education.location}</p>
            ) : (
              <div className="mb-4" />
            )}
            <div className="flex flex-wrap gap-2">
              {education.focusAreas.map((area) => (
                <Badge key={area} variant="outline" className="text-xs">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {education.honors.length > 0 ? (
        <>
          <h3
            id="education-honors-heading"
            style={{ fontFamily: "var(--font-display)" }}
            className="mb-6 text-2xl font-semibold text-(--color-foreground)"
          >
            {education.honorsHeading}
          </h3>
          <ul className="mb-8 grid gap-6 md:grid-cols-2">
            {education.honors.map((honor) => (
              <li key={honor.title}>
                <Card className="h-full p-6 transition-shadow hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <Award className="mt-1 shrink-0 text-(--color-accent)" size={24} aria-hidden />
                    <div>
                      <h4 style={{ fontFamily: "var(--font-display)" }} className="mb-2 text-lg font-semibold">
                        {honor.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-(--color-muted-fg)">{honor.description}</p>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {education.leadership.length > 0 ? (
        <>
          <h3
            style={{ fontFamily: "var(--font-display)" }}
            className="mb-6 text-2xl font-semibold text-(--color-foreground)"
          >
            {education.leadershipHeading}
          </h3>
          <ul className="grid gap-6 md:grid-cols-3">
            {education.leadership.map((item) => (
              <li key={item.title}>
                <Card className="h-full p-6 transition-shadow hover:shadow-md">
                  <Users className="mb-4 text-(--color-accent)" size={32} aria-hidden />
                  <h4 style={{ fontFamily: "var(--font-display)" }} className="mb-2 text-lg font-semibold">
                    {item.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-(--color-muted-fg)">{item.description}</p>
                </Card>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </RevealSection>
  );
}
