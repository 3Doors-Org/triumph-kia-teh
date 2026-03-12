import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { FadeIn } from "@/components/FadeIn";
import { site } from "@/lib/siteData";
import { getWritingBySlug, getWritingList } from "@/lib/content";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getWritingList().map((p) => ({ slug: p.slug }));
}

export default function WritingPostPage({ params }: { params: { slug: string } }) {
  const { frontmatter, content } = getWritingBySlug(params.slug);

  return (
    <>
      <Nav items={site.nav} brand="Triumph Kia Teh" />
      <FadeIn />
      <main className="pt-16">
        <section className="section">
          <div className="container-max">
            <div className="section-label">WRITING</div>
            <h1 className="h2">{frontmatter.title}</h1>
            {frontmatter.summary ? <p className="mt-4 muted max-w-3xl">{frontmatter.summary}</p> : null}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {frontmatter.door ? (
                <span
                  className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-3 py-1 text-xs muted"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {frontmatter.door}
                </span>
              ) : null}
              {frontmatter.date ? (
                <span className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {frontmatter.date}
                </span>
              ) : null}
              {frontmatter.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {frontmatter.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-3 py-1 text-xs muted"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <a className="btn btn-primary" href={site.writing.profileCta.href} target="_blank" rel="noopener">
                Follow on LinkedIn
              </a>
              <a className="btn btn-secondary" href="/programs/">
                3 Doors framework
              </a>
              <a className="btn btn-secondary" href="/contact/">
                Work with Triumph
              </a>
            </div>
            <div className="mt-8">
              <article className="prose prose-invert max-w-none prose-p:text-[color:var(--color-text)] prose-a:text-[color:var(--color-accent)]">
                <MDXRemote source={content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
              </article>
            </div>
            <div className="mt-10">
              <a className="btn btn-secondary" href="/writing/">
                Back to Writing
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

