import type { Metadata } from "next";

const FALLBACK_BASE_URL = "http://localhost:3000";
const SITE_NAME = "Triumph Kia Teh";
const DEFAULT_TITLE = SITE_NAME;
const DEFAULT_DESCRIPTION = "Personal digital institution for writing, impact, and research.";

export function getSiteBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? FALLBACK_BASE_URL;
}

export function isNonProductionIndexingBlocked() {
  const explicit = process.env.APP_ENV ?? process.env.NEXT_PUBLIC_APP_ENV ?? process.env.VERCEL_ENV;
  if (!explicit) {
    return process.env.NODE_ENV !== "production";
  }
  return explicit !== "production";
}

export function buildPageMetadata(input: {
  title: string;
  description: string;
  canonicalPath: string;
}): Metadata {
  const { title, description, canonicalPath } = input;
  const blockIndexing = isNonProductionIndexingBlocked();

  return {
    metadataBase: new URL(getSiteBaseUrl()),
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: canonicalPath,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: !blockIndexing,
      follow: !blockIndexing,
    },
  };
}

export function buildDefaultSiteMetadata(): Metadata {
  return buildPageMetadata({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    canonicalPath: "/",
  });
}
