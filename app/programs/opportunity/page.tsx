import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { FadeIn } from "@/components/FadeIn";
import { site } from "@/lib/siteData";

export default function OpportunityProgramPage() {
  return (
    <>
      <Nav items={site.nav} brand="Triumph Kia Teh" />
      <FadeIn />
      <main className="pt-16">
        <section className="section">
          <div className="container-max">
            <div className="section-label">DOOR 3</div>
            <h1 className="h2">Opportunity</h1>
            <p className="mt-4 muted max-w-3xl">
              Door 3 is about conversion. Education is only valuable when it converts into options: internships, jobs, graduate school, entrepreneurship, and long-term impact.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a className="btn btn-primary" href="/writing/">
                Read Opportunity posts
              </a>
              <a className="btn btn-secondary" href="/projects/">
                See projects
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
                  <li>Students targeting internships and full-time roles</li>
                  <li>Founders and builders converting ideas into systems</li>
                  <li>Graduate school candidates building credibility</li>
                </ul>
              </div>
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Outcomes
                </div>
                <ul className="mt-4 space-y-2 text-sm muted">
                  <li>Clear opportunity map and decision framework</li>
                  <li>Compounding network and mentorship strategy</li>
                  <li>Portfolio that signals proof, not potential</li>
                </ul>
              </div>
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Core modules
                </div>
                <ul className="mt-4 space-y-2 text-sm muted">
                  <li>Career strategy and interview readiness</li>
                  <li>Graduate school positioning</li>
                  <li>Networking systems and relationship design</li>
                  <li>Impact projects and operational execution</li>
                </ul>
              </div>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Proof points
                </div>
                <p className="mt-3 text-sm muted">
                  This Door connects directly to projects and organizations that ship real outcomes in the world.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a className="btn btn-secondary" href="/organizations/">
                    Organizations
                  </a>
                  <a className="btn btn-secondary" href="/projects/">
                    Projects
                  </a>
                </div>
              </div>
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Next step
                </div>
                <p className="mt-3 text-sm muted">
                  If you are building a program, funding pipeline, or partnership, reach out. If you are building your path, start with Writing and apply the weekly playbooks.
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

