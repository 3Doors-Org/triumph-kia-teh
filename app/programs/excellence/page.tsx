import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { FadeIn } from "@/components/FadeIn";
import { site } from "@/lib/siteData";

export default function ExcellenceProgramPage() {
  return (
    <>
      <Nav items={site.nav} brand="Triumph Kia Teh" />
      <FadeIn />
      <main className="pt-16">
        <section className="section">
          <div className="container-max">
            <div className="section-label">DOOR 2</div>
            <h1 className="h2">Excellence</h1>
            <p className="mt-4 muted max-w-3xl">
              Door 2 is about performance and credibility. Once you are in, excellence becomes a system: habits, academic strategy, leadership, research output, and a track record that compounds.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a className="btn btn-primary" href="/writing/">
                Read Excellence posts
              </a>
              <a className="btn btn-secondary" href="/organizations/">
                Palaver Institute
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
                  <li>Students who want top academic standing</li>
                  <li>Researchers building publishable work</li>
                  <li>Leaders building real campus systems</li>
                </ul>
              </div>
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Outcomes
                </div>
                <ul className="mt-4 space-y-2 text-sm muted">
                  <li>Repeatable academic performance system</li>
                  <li>Leadership portfolio with measurable wins</li>
                  <li>Research output and mentorship infrastructure</li>
                </ul>
              </div>
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Core modules
                </div>
                <ul className="mt-4 space-y-2 text-sm muted">
                  <li>Study design and time architecture</li>
                  <li>Faculty relationships and recommendations</li>
                  <li>Research pipeline and publication strategy</li>
                  <li>Systems thinking for campus impact</li>
                </ul>
              </div>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Research infrastructure
                </div>
                <p className="mt-3 text-sm muted">
                  Palaver Institute is the flagship excellence engine: mentorship, publishing, and a community built around high standards and output.
                </p>
                <a className="btn btn-secondary mt-6 w-fit" href="https://palaverinstitute.org" target="_blank" rel="noopener">
                  palaverinstitute.org
                </a>
              </div>
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Next step
                </div>
                <p className="mt-3 text-sm muted">
                  Use Writing to follow the weekly playbooks. If you want to build a cohort, research program, or advising pipeline, reach out.
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

