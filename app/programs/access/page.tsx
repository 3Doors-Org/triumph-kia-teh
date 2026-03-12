import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { FadeIn } from "@/components/FadeIn";
import { site } from "@/lib/siteData";

export default function AccessProgramPage() {
  return (
    <>
      <Nav items={site.nav} brand="Triumph Kia Teh" />
      <FadeIn />
      <main className="pt-16">
        <section className="section">
          <div className="container-max">
            <div className="section-label">DOOR 1</div>
            <h1 className="h2">Access</h1>
            <p className="mt-4 muted max-w-3xl">
              Door 1 is about entry and full funding. The goal is not a single acceptance, it is a repeatable system that turns strategy into offers, then turns offers into financial reality.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a className="btn btn-primary" href="/writing/">
                Read Access posts
              </a>
              <a className="btn btn-secondary" href="/contact/">
                Get advising or partner
              </a>
              <a className="btn btn-secondary" href="/programs/">
                All programs
              </a>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Who it is for
                </div>
                <ul className="mt-4 space-y-2 text-sm muted">
                  <li>Students targeting competitive admissions and scholarships</li>
                  <li>First generation and low income applicants</li>
                  <li>Crisis-affected students rebuilding a pipeline</li>
                </ul>
              </div>
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Outcomes
                </div>
                <ul className="mt-4 space-y-2 text-sm muted">
                  <li>Clear school list and fit strategy</li>
                  <li>Application materials that communicate value</li>
                  <li>Funding plan: scholarships, aid, and negotiation</li>
                </ul>
              </div>
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Core modules
                </div>
                <ul className="mt-4 space-y-2 text-sm muted">
                  <li>Positioning and narrative</li>
                  <li>Academic and extracurricular strategy</li>
                  <li>Letters, essays, and timelines</li>
                  <li>Financial aid and scholarship system</li>
                </ul>
              </div>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Proof points
                </div>
                <p className="mt-3 text-sm muted">
                  See the Achievements page for scholarships and recognition, and the Impact page for advising outcomes and scaled access systems.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a className="btn btn-secondary" href="/achievements/">
                    Achievements
                  </a>
                  <a className="btn btn-secondary" href="/impact/">
                    Impact
                  </a>
                </div>
              </div>
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Next step
                </div>
                <p className="mt-3 text-sm muted">
                  If you want a guided pathway, use Contact. If you want self-serve playbooks, start with Writing and follow the weekly frameworks.
                </p>
                <a className="btn btn-primary mt-6 w-fit" href="/contact/">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

