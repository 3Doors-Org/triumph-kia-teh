import { z } from "zod";

export const communityImpactMetricsSchema = z.object({
  label: z.string().trim().min(1).max(100),
  value: z.number().int().nonnegative(),
  suffix: z.string().trim().max(16).optional().default("+"),
});

export type CommunityImpactMetrics = z.infer<typeof communityImpactMetricsSchema>;

export function parseCommunityImpactMetrics(input: unknown): CommunityImpactMetrics | null {
  const parsed = communityImpactMetricsSchema.safeParse(input);
  if (!parsed.success) {
    return null;
  }
  return parsed.data;
}
