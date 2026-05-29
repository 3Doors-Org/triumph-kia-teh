import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OrganizationDetail } from "@/components/organizations/organizations-pages";
import { getOrganizationBySlug } from "@/lib/data/public-content";
import { isOrganizationSlug as isValidOrganizationSlug } from "@/lib/organizations/slugs";
import { buildPageMetadata } from "@/lib/seo";
import { buildOrganizationJsonLd, toJsonLdScriptContent } from "@/lib/seo/jsonld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ org: string }>;
}): Promise<Metadata> {
  const { org } = await params;
  const data = await getOrganizationBySlug(org);

  if (!data) {
    return { title: "Organization not found | Triumph Kia Teh" };
  }

  return buildPageMetadata({
    title: `${data.organization.name} | Triumph Kia Teh`,
    description: data.organization.mission,
    canonicalPath: `/organizations/${data.organization.slug}`,
  });
}

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ org: string }>;
}) {
  const { org } = await params;

  if (!isValidOrganizationSlug(org)) {
    notFound();
  }

  const data = await getOrganizationBySlug(org);
  if (!data) {
    notFound();
  }

  const jsonLd = buildOrganizationJsonLd({
    name: data.organization.name,
    slug: data.organization.slug,
    description: data.organization.mission,
    externalUrl: data.organization.externalUrl,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdScriptContent(jsonLd) }}
      />
      <OrganizationDetail {...data} />
    </>
  );
}
