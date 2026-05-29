import { NextResponse } from "next/server";

import { getResearchBySlug } from "@/lib/research/queries";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const normalizedSlug = slug.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const item = await getResearchBySlug(normalizedSlug);

  if (!item) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  return NextResponse.json(
    {
      data: {
        ...item,
        publishedAt: item.publishedAt?.toISOString() ?? null,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      },
    },
    { status: 200 },
  );
}
