import { PageSectionSkeleton } from "@/components/layout/page-section-skeleton";

export default async function WritingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <PageSectionSkeleton
      title={`Writing: ${slug}`}
      description="Long-form writing detail shell prepared for secure rich-content rendering pipelines."
    />
  );
}
