import { getSiteBaseUrl } from "@/lib/seo";

type BlogPostingInput = {
  title: string;
  slug: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
};

type OrganizationJsonLdInput = {
  name: string;
  slug: string;
  description: string;
  externalUrl?: string | null;
};

function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const base = getSiteBaseUrl().replace(/\/+$/, "");
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

export function buildBlogPostingJsonLd(input: BlogPostingInput) {
  const payload: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    mainEntityOfPage: absoluteUrl(`/writing/${input.slug}`),
    url: absoluteUrl(`/writing/${input.slug}`),
    author: {
      "@type": "Person",
      name: "Triumph Kia Teh",
    },
    publisher: {
      "@type": "Person",
      name: "Triumph Kia Teh",
    },
  };

  if (input.datePublished) {
    payload.datePublished = input.datePublished;
  }
  if (input.dateModified) {
    payload.dateModified = input.dateModified;
  }
  return payload;
}

export function buildOrganizationJsonLd(input: OrganizationJsonLdInput) {
  const payload: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input.name,
    description: input.description,
    url: input.externalUrl ? absoluteUrl(input.externalUrl) : absoluteUrl(`/organizations/${input.slug}`),
    sameAs: input.externalUrl ? [absoluteUrl(input.externalUrl)] : undefined,
    founder: {
      "@type": "Person",
      name: "Triumph Kia Teh",
    },
  };

  return payload;
}

export function toJsonLdScriptContent(value: unknown): string {
  return JSON.stringify(value);
}
