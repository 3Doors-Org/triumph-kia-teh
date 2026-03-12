import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { FadeIn } from "@/components/FadeIn";
import { getAssetPath } from "@/lib/paths";
import { site } from "@/lib/siteData";

export default function OrganizationsPage() {
  return (
    <>
      <Nav items={site.nav} brand="Triumph Kia Teh" />
      <FadeIn />
      <main className="pt-16">
        <section className="section">
          <div className="container-max">
            <div className="section-label">ORGANIZATIONS</div>
            <h1 className="h2">Organizations</h1>
            <p className="mt-4 muted max-w-2xl">
              Three organizations. One mission. Each addresses a different part of the access to excellence to opportunity journey.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a className="btn btn-primary" href="/contact/">
                Partner with an organization
              </a>
              <a className="btn btn-secondary" href="/impact/">
                View impact
              </a>
              <a className="btn btn-secondary" href="/projects/">
                Explore projects
              </a>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-3">
              {site.organizations.map((org) => (
                <div key={org.name} className="card">
                  <img className="org-logo" src={getAssetPath(org.logoSrc)} alt={org.name} />
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem" }}>{org.name}</div>
                  <div className="mt-1 text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                    {org.founded}
                  </div>
                  <div className="mt-4 font-medium">{org.missionLine}</div>
                  <div className="mt-3 text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--color-accent)" }}>
                    {org.metricsLine}
                  </div>
                  <p className="mt-4 text-sm muted">{org.description}</p>

                  {org.links.length ? (
                    <div className="mt-5 flex flex-wrap gap-3">
                      {org.links.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          target={l.href.startsWith("http") ? "_blank" : undefined}
                          rel={l.href.startsWith("http") ? "noopener" : undefined}
                          className="btn btn-secondary px-4 py-2 text-sm"
                        >
                          {l.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  ACCESS
                </div>
                <div className="mt-3 font-semibold">Open Dreams</div>
                <p className="mt-3 text-sm muted">
                  National college access pipeline. Built to turn guidance into outcomes at scale for first generation and crisis-affected students.
                </p>
              </div>
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  EXCELLENCE
                </div>
                <div className="mt-3 font-semibold">Palaver Institute</div>
                <p className="mt-3 text-sm muted">
                  Research mentorship and publishing infrastructure. Designed to help students build credible bodies of work with tight feedback loops.
                </p>
              </div>
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  OPPORTUNITY
                </div>
                <div className="mt-3 font-semibold">DeWise Foundation</div>
                <p className="mt-3 text-sm muted">
                  Crisis response, energy transition, and health access projects. Built for deployment realities, not theory.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

