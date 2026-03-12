import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { Nav } from "@/components/Nav";
import { getAssetPath } from "@/lib/paths";
import { site } from "@/lib/siteData";
import { getWritingList } from "@/lib/content";

function DoorPill({ door }: { door: "ACCESS" | "EXCELLENCE" | "OPPORTUNITY" }) {
  const cls =
    door === "ACCESS"
      ? "bg-[rgba(232,168,56,0.18)] text-[color:var(--color-accent)]"
      : door === "EXCELLENCE"
        ? "bg-[rgba(76,175,130,0.18)] text-[color:var(--color-green)]"
        : "bg-[rgba(242,196,109,0.18)] text-[color:var(--color-accent-light)]";
  return (
    <span className={`inline-block rounded px-2 py-1 text-[11px] tracking-wider ${cls}`} style={{ fontFamily: "'DM Mono', monospace" }}>
      {door}
    </span>
  );
}

export default function Page() {
  const writing = getWritingList().slice(0, 3);

  return (
    <>
      <Nav items={site.nav} brand="Triumph Kia Teh" />
      <FadeIn />

      <main className="pt-16">
        {/* Hero */}
        <header id="hero" className="section">
          <div className="container-max grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <div className="fade-up" style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", color: "var(--color-accent)", fontSize: "0.8rem" }}>
                {site.taglineLabel}
              </div>
              <h1 className="fade-up mt-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.15, fontWeight: 600 }}>
                {site.hero.headline}
              </h1>
              <p className="fade-up mt-5 max-w-xl text-lg muted">
                {site.taglineLine}
                <br />
                {site.hero.subhead}
              </p>
              <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
                <a className="btn btn-primary" href="/about/">
                  Start here
                </a>
                <a className="btn btn-secondary" href="/contact/">
                  Contact
                </a>
              </div>
              <div className="fade-up mt-10 flex flex-wrap items-center gap-6 text-sm muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                {site.hero.stats.map((s) => (
                  <span key={s.label}>{s.label}</span>
                ))}
              </div>
            </div>

            <div className="fade-up rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3">
              <img
                src={getAssetPath(site.about.headshot.src)}
                alt={site.about.headshot.alt}
                className="w-full rounded-md object-cover"
              />
              <div className="mt-4 px-1">
                <div className="text-sm font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Triumph Kia Teh
                </div>
                <p className="mt-2 text-sm muted">
                  King Scholar. Dartmouth Class of 2026. Founder across Palaver Institute, DeWise Foundation, and 3Doors.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Snapshot */}
        <section id="about" className="section border-y border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
          <div className="container-max">
            <div className="section-label">SNAPSHOT</div>
            <h2 className="h2">A fast overview</h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Education
                </div>
                <div className="mt-3 font-semibold">Dartmouth College, Computer Science</div>
                <p className="mt-3 text-sm muted">
                  King Scholar (approximately $400,000). 4.0 GPA. Rufus Choate Scholar. Citations for Meritorious Performance.
                </p>
                <a className="btn btn-secondary mt-5 px-4 py-2 text-sm" href="/achievements/">
                  See achievements
                </a>
              </div>
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Work
                </div>
                <div className="mt-3 font-semibold">Three organizations. One mission.</div>
                <p className="mt-3 text-sm muted">
                  Palaver Institute builds research infrastructure. DeWise Foundation scales clean energy and education access. 3Doors shares frameworks across the full education journey.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a className="btn btn-secondary px-4 py-2 text-sm" href="/organizations/">
                    Organizations
                  </a>
                  <a className="btn btn-secondary px-4 py-2 text-sm" href="/projects/">
                    Projects
                  </a>
                </div>
              </div>
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Speaking and media
                </div>
                <div className="mt-3 font-semibold">Talks and national features</div>
                <p className="mt-3 text-sm muted">
                  Selected speaking and media: World Changers Association, CamLEI, CRTV national television, Equinox national TV.
                </p>
                <a className="btn btn-secondary mt-5 px-4 py-2 text-sm" href="/speaking/">
                  View speaking
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Doors */}
        <section id="story" className="section">
          <div className="container-max">
            <div className="section-label">{site.framework.label}</div>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="h2">{site.framework.heading}</h2>
              <p className="mt-4 muted">{site.framework.intro}</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {site.framework.doors.map((d) => (
                <div key={d.number} className="card hover:-translate-y-1 transition-transform">
                  <div className="text-sm" style={{ fontFamily: "'DM Mono', monospace", color: "var(--color-accent)" }}>
                    {d.number}
                  </div>
                  <div className="mt-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem" }}>
                    {d.title}
                  </div>
                  <p className="mt-3 text-sm muted">{d.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <a className="btn btn-secondary" href="/programs/">
                Explore programs
              </a>
            </div>
          </div>
        </section>

        {/* Organizations preview */}
        <section id="organizations" className="section">
          <div className="container-max">
            <div className="section-label">ORGANIZATIONS</div>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="h2">Three organizations</h2>
                <p className="mt-3 muted max-w-2xl">
                  A concise view of the three pillars, with detail on the Organizations page.
                </p>
              </div>
              <a className="btn btn-secondary w-fit" href="/organizations/">
                View all
              </a>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {site.organizations.map((org) => (
                <a key={org.name} className="card hover:-translate-y-1 transition-transform" href="/organizations/">
                  <img className="org-logo" src={getAssetPath(org.logoSrc)} alt={org.name} />
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem" }}>{org.name}</div>
                  <div className="mt-2 text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                    {org.metricsLine}
                  </div>
                  <p className="mt-4 text-sm muted">{org.missionLine}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Writing preview */}
        <section id="writing" className="section border-t border-[color:var(--color-border)]">
          <div className="container-max">
            <div className="section-label">WRITING</div>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="h2">Framework posts</h2>
                <p className="mt-3 muted max-w-2xl">
                  Writing across Access, Excellence, and Opportunity. Full posts live in the Writing section.
                </p>
              </div>
              <a className="btn btn-secondary w-fit" href="/writing/">
                Browse writing
              </a>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {writing.map((p) => (
                <a key={p.slug} href={`/writing/${p.slug}/`} className="card hover:-translate-y-1 transition-transform">
                  {p.door ? <DoorPill door={p.door} /> : null}
                  <div className="mt-3 font-semibold">{p.title}</div>
                  {p.summary ? <p className="mt-3 text-sm muted">{p.summary}</p> : null}
                  <div className="mt-4 text-sm text-[color:var(--color-accent)]">Read</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section id="contact" className="section">
          <div className="container-max">
            <div className="section-label">CONTACT</div>
            <h2 className="h2">Let’s build together</h2>
            <p className="mt-4 muted max-w-2xl">
              Partnerships, speaking, research, and student coaching inquiries.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a className="btn btn-primary" href="/contact/">
                Contact page
              </a>
              <a className="btn btn-secondary" href="mailto:triumph@palaverinstitute.org">
                Email
              </a>
              <a className="btn btn-secondary" href="https://www.linkedin.com/in/triumph-kia-teh/" target="_blank" rel="noopener">
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

