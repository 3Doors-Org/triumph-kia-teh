export type OrgMetricSeedRow = {
  id: string;
  orgId: string | null;
  label: string;
  value: number;
  suffix: string;
  sortOrder: number;
};

export const PORTFOLIO_ORG_METRICS: OrgMetricSeedRow[] = [];
