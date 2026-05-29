import { routes } from "@/lib/routes";
import { COMMUNITY_IMPACT_DOOR_VALUES } from "@/lib/community-impact/filters";
import { WRITING_DOOR_VALUES } from "@/lib/writing/filters";

const CANONICAL_DOOR_VALUES = ["ACCESS", "EXCELLENCE", "OPPORTUNITY"] as const;

export function getTier1RequiredRoutes(): string[] {
  return [
    routes.public.home,
    routes.public.about,
    routes.public.organizations,
    routes.public.org3doors,
    routes.public.orgPalaverInstitute,
    routes.public.orgDewiseFoundation,
    routes.public.communityImpact,
  ];
}

export function getTier1RouteCoverage(): { route: string; exists: boolean }[] {
  return getTier1RequiredRoutes().map((route) => ({
    route,
    exists: typeof route === "string" && route.startsWith("/"),
  }));
}

export function getDoorTaxonomyViolations(): string[] {
  const violations: string[] = [];

  for (const door of WRITING_DOOR_VALUES) {
    if (!CANONICAL_DOOR_VALUES.includes(door)) {
      violations.push(`writing: unexpected door '${door}'`);
    }
  }
  for (const door of COMMUNITY_IMPACT_DOOR_VALUES) {
    if (!CANONICAL_DOOR_VALUES.includes(door)) {
      violations.push(`community-impact: unexpected door '${door}'`);
    }
  }

  return violations;
}
