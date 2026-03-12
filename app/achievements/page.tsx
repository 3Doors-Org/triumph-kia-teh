import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { FadeIn } from "@/components/FadeIn";
import { site } from "@/lib/siteData";

export default function AchievementsPage() {
  return (
    <>
      <Nav items={site.nav} brand="Triumph Kia Teh" />
      <FadeIn />
      <main className="pt-16">
        <section className="section">
          <div className="container-max">
            <div className="section-label">ACHIEVEMENTS</div>
            <h1 className="h2">Achievements</h1>
            <p className="mt-4 muted max-w-3xl">
              Selected awards, scholarships, and recognition across academics, research, and crisis response innovation. This page is designed for fast scanning with optional depth.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Scholarship
                </div>
                <div className="mt-3 font-semibold">King Scholar</div>
                <p className="mt-3 text-sm muted">
                  Dartmouth's highest merit scholarship. Approximately $400,000 over four years. Seven recipients from 30,000+ applicants.
                </p>
                <a className="btn btn-secondary mt-6 w-fit" href="/about/">
                  See education context
                </a>
              </div>
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Academic record
                </div>
                <div className="mt-3 font-semibold">4.0 GPA and top standing</div>
                <p className="mt-3 text-sm muted">
                  Rufus Choate Scholar, citations for meritorious academic performance, and research recognition in computational modeling.
                </p>
                <a className="btn btn-secondary mt-6 w-fit" href="/impact/">
                  View impact
                </a>
              </div>
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Innovation
                </div>
                <div className="mt-3 font-semibold">Clean energy and health infrastructure</div>
                <p className="mt-3 text-sm muted">
                  Awards and grants powering DeWise projects like WiseBox and WiseCool across crisis-affected regions.
                </p>
                <a className="btn btn-secondary mt-6 w-fit" href="/projects/">
                  View projects
                </a>
              </div>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {site.recognition.awards.map((a) => (
                <div key={`${a.name}-${a.year}`} className="card">
                  <div className="font-semibold">{a.name}</div>
                  <div className="mt-1 text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                    {a.issuer}
                  </div>
                  <div className="mt-1 text-xs" style={{ color: "var(--color-accent)", fontFamily: "'DM Mono', monospace" }}>
                    {a.year}
                  </div>
                  <p className="mt-3 text-sm muted">{a.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <a className="btn btn-primary" href="/contact/">
                Invite Triumph to speak
              </a>
              <a className="btn btn-secondary" href="/speaking/">
                Speaking and media
              </a>
              <a className="btn btn-secondary" href="/writing/">
                Read writing
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

