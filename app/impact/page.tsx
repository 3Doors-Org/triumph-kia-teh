import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { FadeIn } from "@/components/FadeIn";
import { site } from "@/lib/siteData";

export default function ImpactPage() {
  return (
    <>
      <Nav items={site.nav} brand="Triumph Kia Teh" />
      <FadeIn />
      <main className="pt-16">
        <section className="section">
          <div className="container-max">
            <div className="section-label">IMPACT</div>
            <h1 className="h2">Impact</h1>
            <p className="mt-4 muted max-w-3xl">
              Impact across institutions, communities, and systems. This page highlights measurable outputs and what those outputs unlock for students, researchers, and crisis-affected communities.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {site.hero.stats.map((s) => (
                <div key={s.label} className="card">
                  <div className="text-sm muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                    Metric
                  </div>
                  <div className="mt-3 text-lg font-semibold">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Dartmouth advising impact
                </div>
                <div className="mt-3 font-semibold">Dickey Center funding outcomes</div>
                <p className="mt-3 text-sm muted">
                  Advised 40+ students on international internships and research opportunities. 90% secured at least $5,000 in funding. Helped students access $200,000+ in total funding.
                </p>
                <a className="btn btn-secondary mt-6 w-fit" href="/about/">
                  Read the story
                </a>
              </div>

              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Research infrastructure
                </div>
                <div className="mt-3 font-semibold">Palaver Institute scale</div>
                <p className="mt-3 text-sm muted">
                  Built a mentorship-driven research fellowship producing 50+ journal articles in 12 months across nine disciplines. Recruitment drew 1,001 applications in two weeks. The annual conference draws 500+ in person and 200+ virtual participants.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a className="btn btn-secondary w-fit" href="/organizations/">
                    Explore organizations
                  </a>
                  <a className="btn btn-secondary w-fit" href="https://palaverinstitute.org" target="_blank" rel="noopener">
                    palaverinstitute.org
                  </a>
                </div>
              </div>

              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Crisis-affected communities
                </div>
                <div className="mt-3 font-semibold">DeWise Foundation outcomes</div>
                <p className="mt-3 text-sm muted">
                  Served 5,000+ crisis-affected people and raised $70,000+ in competitive grants. WiseBox deployed 1,000+ solar power banks to restore education access for displaced youth. WiseCool is projected to increase medication lifespan by 50% in rural clinics.
                </p>
                <a className="btn btn-secondary mt-6 w-fit" href="/projects/">
                  View projects
                </a>
              </div>

              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Education access systems
                </div>
                <div className="mt-3 font-semibold">Open Dreams and access pipeline</div>
                <p className="mt-3 text-sm muted">
                  Reached 4,500 students and generated 900 applications through a national college access program. Oversaw five regional hubs serving 150 scholars nationally and supported crisis-affected scholars through structured programming.
                </p>
                <a className="btn btn-secondary mt-6 w-fit" href="https://open-dreams.org" target="_blank" rel="noopener">
                  Open Dreams
                </a>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <a className="btn btn-primary" href="/contact/">
                Partner or collaborate
              </a>
              <a className="btn btn-secondary" href="/writing/">
                Read frameworks
              </a>
              <a className="btn btn-secondary" href="/achievements/">
                View achievements
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

