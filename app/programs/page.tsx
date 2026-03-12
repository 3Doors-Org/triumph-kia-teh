import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { FadeIn } from "@/components/FadeIn";
import { site } from "@/lib/siteData";

export default function ProgramsPage() {
  return (
    <>
      <Nav items={site.nav} brand="Triumph Kia Teh" />
      <FadeIn />
      <main className="pt-16">
        <section className="section">
          <div className="container-max">
            <div className="section-label">PROGRAMS</div>
            <h1 className="h2">Programs</h1>
            <p className="mt-4 muted max-w-3xl">
              The 3 Doors framework is an operating system for student success: access (getting in and fully funded), excellence (thriving inside), and opportunity (converting education into long-term impact). Use these pages as a map, then follow the writing for the weekly playbooks.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a className="btn btn-primary" href="/writing/">
                Read the weekly frameworks
              </a>
              <a className="btn btn-secondary" href="/contact/">
                Work with Triumph
              </a>
              <a className="btn btn-secondary" href="/organizations/">
                Explore organizations
              </a>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {site.programs.map((p) => (
                <a key={p.slug} href={`/programs/${p.slug}/`} className="card hover:-translate-y-1 transition-transform">
                  <div className="font-semibold">{p.title}</div>
                  <p className="mt-3 text-sm muted">{p.summary}</p>
                  <div className="mt-6">
                    <span className="btn btn-secondary px-4 py-2 text-sm">{p.cta.label}</span>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  How to use this section
                </div>
                <ul className="mt-4 space-y-2 text-sm muted">
                  <li>Start with the Door that matches your current bottleneck</li>
                  <li>Use the Door page for the map, then use Writing for weekly playbooks</li>
                  <li>If you are an institution or funder, use Contact to discuss partnership</li>
                </ul>
              </div>
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Want a custom pathway?
                </div>
                <p className="mt-3 text-sm muted">
                  Triumph builds systems that scale outcomes. If you want a cohort program, advising pipeline, or a research infrastructure built for your community, reach out.
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

