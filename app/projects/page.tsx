import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { FadeIn } from "@/components/FadeIn";
import { getAssetPath } from "@/lib/paths";
import { site } from "@/lib/siteData";

export default function ProjectsPage() {
  return (
    <>
      <Nav items={site.nav} brand="Triumph Kia Teh" />
      <FadeIn />
      <main className="pt-16">
        <section className="section">
          <div className="container-max">
            <div className="section-label">PROJECTS</div>
            <h1 className="h2">Projects</h1>
            <p className="mt-4 muted max-w-3xl">
              Projects built for deployment realities. Each project links to a dedicated detail page with the core problem, approach, and measurable outcomes.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a className="btn btn-primary" href="/contact/">
                Collaborate on a project
              </a>
              <a className="btn btn-secondary" href="/impact/">
                View impact
              </a>
              <a className="btn btn-secondary" href="/organizations/">
                Explore organizations
              </a>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {site.projects.map((p) => (
                <a key={p.slug} className="card hover:-translate-y-1 transition-transform" href={`/projects/${p.slug}/`}>
                  {p.heroImage ? (
                    <img
                      src={getAssetPath(p.heroImage.src)}
                      alt={p.heroImage.alt}
                      className="mb-4 h-44 w-full rounded-md object-cover border border-[color:var(--color-border)]"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="font-semibold">{p.title}</div>
                  <p className="mt-3 text-sm muted">{p.summary}</p>
                  {p.metrics?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.metrics.slice(0, 3).map((m) => (
                        <span
                          key={m}
                          className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-3 py-1 text-xs muted"
                          style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

