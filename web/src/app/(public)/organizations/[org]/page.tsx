import { notFound } from "next/navigation";

import { PageSectionSkeleton } from "@/components/layout/page-section-skeleton";

const ORGS = new Set(["3doors", "palaverinstitute", "dewisefoundation"]);

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ org: string }>;
}) {
  const { org } = await params;

  if (!ORGS.has(org)) {
    notFound();
  }

  return (
    <PageSectionSkeleton
      title={`Organization: ${org}`}
      description="Organization subpage shell with reusable structure for hero, impact, narrative, and related content."
    />
  );
}
