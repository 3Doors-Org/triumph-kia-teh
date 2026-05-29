import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ScrollDepthTracker } from "@/components/analytics/scroll-depth-tracker";
import { RevealSection } from "@/components/motion/reveal-section";
import { Card } from "@/components/ui";
import { isRevealEnabled } from "@/lib/motion/manifest";
import { renderPostBody } from "@/lib/rich-text/render-post";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";
import { buildBlogPostingJsonLd, toJsonLdScriptContent } from "@/lib/seo/jsonld";
import {
  getCachedPublishedWritingPostBySlug,
  getCachedPublishedWritingSlugs,
  getCachedRelatedPublishedWritingPosts,
} from "@/lib/writing/queries";

export const revalidate = 300;
export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const slugs = await getCachedPublishedWritingSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cleanSlug = slug.trim().toLowerCase();
  const post = await getCachedPublishedWritingPostBySlug(cleanSlug);

  if (!post) {
    return buildPageMetadata({
      title: "Writing | Triumph Kia Teh",
      description: "Long-form writing by Triumph Kia Teh.",
      canonicalPath: routes.public.writing,
    });
  }

  const rendered = renderPostBody(post.bodyJson);
  const description =
    post.excerpt ?? (rendered.plainText.slice(0, 155) || "Long-form writing by Triumph Kia Teh.");

  return buildPageMetadata({
    title: `${post.title} | Triumph Kia Teh`,
    description,
    canonicalPath: routes.public.writingBySlug(post.slug),
  });
}

export default async function WritingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cleanSlug = slug.trim().toLowerCase();

  const post = await getCachedPublishedWritingPostBySlug(cleanSlug);
  if (!post) {
    notFound();
  }

  const publishedAt = toDate(post.publishedAt);
  const updatedAt = toDate(post.updatedAt);
  const rendered = renderPostBody(post.bodyJson);
  const jsonLd = buildBlogPostingJsonLd({
    title: post.title,
    slug: post.slug,
    description: post.excerpt ?? (rendered.plainText.slice(0, 180) || post.title),
    datePublished: publishedAt?.toISOString(),
    dateModified: updatedAt?.toISOString(),
  });
  const relatedPosts = await getCachedRelatedPublishedWritingPosts(
    {
      id: post.id,
      door: post.door,
      tags: post.tags,
    },
    3,
  );

  return (
    <article className="space-y-10">
      <ScrollDepthTracker
        contentId={`writing:${post.slug}`}
        eventProps={{ content_type: "writing_post", door: post.door ?? "unknown" }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdScriptContent(jsonLd) }}
      />
      <RevealSection
        as="header"
        enabled={isRevealEnabled("writing-detail", "header")}
        className="space-y-4 border-b border-[var(--color-muted)]/40 pb-8"
      >
        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-[var(--color-muted-fg)]">
          {post.door ? <span>{post.door}</span> : null}
          {publishedAt ? (
            <>
              {post.door ? <span aria-hidden="true">•</span> : null}
              <time dateTime={publishedAt.toISOString()}>
                {publishedAt.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </>
          ) : null}
          <span aria-hidden="true">•</span>
          <span>{rendered.readingTimeMinutes} min read</span>
        </div>

        {post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 text-xs text-[var(--color-muted-fg)]">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-[var(--color-primary)]/20 px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">{post.title}</h1>
        {post.excerpt ? <p className="max-w-3xl text-lg text-[var(--color-muted-fg)]">{post.excerpt}</p> : null}
      </RevealSection>

      <RevealSection enabled={isRevealEnabled("writing-detail", "content")}>
        <section
          className="prose prose-slate max-w-3xl prose-headings:font-semibold prose-h2:mt-12 prose-h2:text-3xl prose-h3:mt-8 prose-h3:text-2xl prose-a:text-[var(--color-accent)] prose-blockquote:border-l-[var(--color-accent)] prose-blockquote:text-[var(--color-muted-fg)]"
          dangerouslySetInnerHTML={{ __html: rendered.html }}
        />
      </RevealSection>

      {relatedPosts.length > 0 ? (
        <RevealSection
          as="section"
          enabled={isRevealEnabled("writing-detail", "related")}
          className="space-y-4 border-t border-[var(--color-muted)]/40 pt-8"
        >
          <h2 className="text-2xl font-semibold">Related Writing</h2>
          <p className="text-sm text-[var(--color-muted-fg)]">From the same door and adjacent themes.</p>
          <ul className="grid gap-4 md:grid-cols-3" aria-label="Related writing">
            {relatedPosts.map((related) => (
              <li key={related.id}>
                <Card className="space-y-2">
                  <h3 className="text-lg font-medium leading-snug">
                    <Link className="hover:underline" href={routes.public.writingBySlug(related.slug)}>
                      {related.title}
                    </Link>
                  </h3>
                  {related.excerpt ? <p className="text-sm text-[var(--color-muted-fg)]">{related.excerpt}</p> : null}
                </Card>
              </li>
            ))}
          </ul>
        </RevealSection>
      ) : null}
    </article>
  );
}

function toDate(value: Date | string | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
