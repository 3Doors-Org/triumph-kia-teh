import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { EDUCATION_PROFILE } from "@/lib/about/education-content";
import {
  parseAboutContentFromDb,
  withExplicitEducationLocation,
} from "@/lib/about/normalize-about-content";

describe("withExplicitEducationLocation", () => {
  it("fills missing location from education profile", () => {
    const result = withExplicitEducationLocation({
      hero: { eyebrow: "About", name: "Test", intro: "Intro text here." },
      journey: {
        eyebrow: "J",
        title: "Journey",
        subtitle: "Sub",
        milestones: [
          { year: "2020", title: "Start", description: "Began the work.", icon: "rocket" },
        ],
      },
      education: {
        sectionEyebrow: "Education",
        sectionTitle: "Title",
        sectionSubtitle: "Subtitle",
        institution: "Dartmouth College",
        degree: "BA",
        period: "2022–2026",
        location: "",
        focusAreas: ["CS"],
        honorsHeading: "Honors",
        honors: [],
        leadershipHeading: "Leadership",
        leadership: [],
      },
      institutional: {
        practiceLabel: "Practice",
        practiceIntro: "Intro",
        sections: [{ heading: "H", paragraphs: ["P"] }],
      },
    });

    assert.equal(result.education.location, EDUCATION_PROFILE.location);
  });

  it("preserves custom location when set", () => {
    const custom = "Cambridge, MA";
    const base = parseAboutContentFromDb({
      hero: { eyebrow: "About", name: "Test", intro: "Intro text here." },
      journey: {
        eyebrow: "J",
        title: "Journey",
        subtitle: "Sub",
        milestones: [
          { year: "2020", title: "Start", description: "Began the work.", icon: "rocket" },
        ],
      },
      education: {
        sectionEyebrow: "Education",
        sectionTitle: "Title",
        sectionSubtitle: "Subtitle",
        institution: "MIT",
        degree: "BA",
        period: "2020–2024",
        location: custom,
        focusAreas: ["CS"],
        honorsHeading: "Honors",
        honors: [],
        leadershipHeading: "Leadership",
        leadership: [],
      },
      institutional: {
        practiceLabel: "Practice",
        practiceIntro: "Intro",
        sections: [{ heading: "H", paragraphs: ["P"] }],
      },
    });

    assert.equal(base.education.location, custom);
  });
});
