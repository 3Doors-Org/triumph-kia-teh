import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { FadeIn } from "@/components/FadeIn";
import { site } from "@/lib/siteData";
import { getWritingList } from "@/lib/content";

export const dynamic = "force-static";

export default function WritingIndexPage() {
  const posts = getWritingList();
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags ?? []))).sort((a, b) => a.localeCompare(b));

  return (
    <>
      <Nav items={site.nav} brand="Triumph Kia Teh" />
      <FadeIn />
      <main className="pt-16">
        <section className="section">
          <div className="container-max">
            <div className="section-label">WRITING</div>
            <h1 className="h2">Writing</h1>
            <p className="mt-4 muted max-w-3xl">{site.writing.intro}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a className="btn btn-primary" href={site.writing.profileCta.href} target="_blank" rel="noopener">
                {site.writing.profileCta.label}
              </a>
              <a className="btn btn-secondary" href="/programs/">
                3 Doors framework
              </a>
              <a className="btn btn-secondary" href="/contact/">
                Work with Triumph
              </a>
            </div>

            {allTags.length ? (
              <div className="mt-10">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Topics
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {allTags.slice(0, 18).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-3 py-1 text-xs muted"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {posts.map((p) => (
                <Link key={p.slug} href={`/writing/${p.slug}/`} className="card hover:-translate-y-1 transition-transform">
                  <div className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--color-accent)" }}>
                    {p.door ?? "POST"}
                  </div>
                  <div className="mt-2 font-semibold">{p.title}</div>
                  {p.summary ? <p className="mt-3 text-sm muted">{p.summary}</p> : null}
                  {p.tags?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tags.slice(0, 4).map((t) => (
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
                  <div className="mt-4 text-sm text-[color:var(--color-accent)]">Read</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

