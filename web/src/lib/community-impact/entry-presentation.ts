import { COMMUNITY_IMPACT_PORTFOLIO_PROJECTS } from "@/lib/community-impact/portfolio-projects-content";
import type { PortfolioProjectIcon } from "@/lib/community-impact/portfolio-projects-content";

export type CommunityImpactIconKey = PortfolioProjectIcon;

export type CommunityImpactEntryPresentation = {
  icon: CommunityImpactIconKey;
  periodLabel: string;
  tags: string[];
  organizationLine: string;
};

function buildPresentation(): Record<string, CommunityImpactEntryPresentation> {
  const out: Record<string, CommunityImpactEntryPresentation> = {};
  for (const p of COMMUNITY_IMPACT_PORTFOLIO_PROJECTS) {
    out[p.id] = {
      icon: p.icon,
      periodLabel: p.period,
      tags: p.skills,
      organizationLine: p.organization,
    };
  }
  return out;
}

const PRESENTATION = buildPresentation();

export function getCommunityImpactEntryPresentation(
  entryId: string,
): CommunityImpactEntryPresentation | null {
  return PRESENTATION[entryId] ?? null;
}
