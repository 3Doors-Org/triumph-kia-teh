import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { FadeIn } from "@/components/FadeIn";
import { getAssetPath } from "@/lib/paths";
import { site } from "@/lib/siteData";

export function generateStaticParams() {
  return site.projects.map((p) => ({ slug: p.slug }));
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = site.projects.find((p) => p.slug === params.slug);
  const title = project?.title ?? params.slug;

  return (
    <>
      <Nav items={site.nav} brand="Triumph Kia Teh" />
      <FadeIn />
      <main className="pt-16">
        <section className="section">
          <div className="container-max">
            <div className="section-label">PROJECT</div>
            <h1 className="h2">{title}</h1>
            {project ? (
              <>
                <p className="mt-4 muted max-w-3xl">{project.summary}</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a className="btn btn-primary" href="/contact/">
                    Discuss this project
                  </a>
                  <a className="btn btn-secondary" href="/projects/">
                    Back to projects
                  </a>
                  <a className="btn btn-secondary" href="/impact/">
                    View impact
                  </a>
                </div>
                {project.heroImage ? (
                  <img
                    className="mt-8 w-full max-h-[420px] rounded-lg object-cover border border-[color:var(--color-border)]"
                    src={getAssetPath(project.heroImage.src)}
                    alt={project.heroImage.alt}
                  />
                ) : null}
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                  <div className="card">
                    <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                      Problem
                    </div>
                    <p className="mt-3 text-sm muted">
                      The project summary captures the core need. This page is structured so each project can expand into problem, approach, deployment, and results without changing the route.
                    </p>
                  </div>
                  <div className="card">
                    <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                      Approach
                    </div>
                    <p className="mt-3 text-sm muted">
                      Built with constraints in mind: cost, maintenance, local infrastructure, and the realities of crisis-affected communities.
                    </p>
                  </div>
                </div>
                {project.metrics?.length ? (
                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {project.metrics.map((m) => (
                      <div key={m} className="card">
                        <div className="text-sm muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                          Metric
                        </div>
                        <div className="mt-3 font-semibold">{m}</div>
                      </div>
                    ))}
                  </div>
                ) : null}
                {project.links?.length ? (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {project.links.map((l) => (
                      <a key={l.href} className="btn btn-secondary" href={l.href} target="_blank" rel="noopener">
                        {l.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <p className="mt-4 muted max-w-2xl">Project not found.</p>
            )}
            <div className="mt-10 flex flex-wrap gap-4">
              <a className="btn btn-secondary" href="/projects/">
                Back to projects
              </a>
              <a className="btn btn-secondary" href="/organizations/">
                Explore organizations
              </a>
              <a className="btn btn-secondary" href="/writing/">
                Read related writing
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

