import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { FadeIn } from "@/components/FadeIn";
import { site } from "@/lib/siteData";
import { getAssetPath } from "@/lib/paths";

export default function AboutPage() {
  return (
    <>
      <Nav items={site.nav} brand="Triumph Kia Teh" />
      <FadeIn />
      <main className="pt-16">
        <header className="section">
          <div className="container-max grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <div className="section-label">ABOUT</div>
              <h1 className="h2 whitespace-pre-line">{site.about.heading}</h1>
              <p className="mt-5 muted max-w-2xl">
                A long-form view of the story, the academic record, and the work. This page is designed to complement the route-based site so visitors can go deeper without repeating the entire homepage.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a className="btn btn-primary" href="/organizations/">
                  View organizations
                </a>
                <a className="btn btn-secondary" href="/projects/">
                  View projects
                </a>
                <a className="btn btn-secondary" href="/writing/">
                  Read writing
                </a>
              </div>
            </div>

            <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3">
              <img
                src={getAssetPath(site.about.headshot.src)}
                alt={site.about.headshot.alt}
                className="w-full rounded-md object-cover"
              />
            </div>
          </div>
        </header>

        <section className="section border-y border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
          <div className="container-max">
            <div className="section-label">BIO</div>
            <h2 className="h2">The story in full</h2>
            <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
              <div className="space-y-4">
                {site.about.paragraphs.map((p) => (
                  <p key={p} className="text-[color:var(--color-text)]">
                    {p}
                  </p>
                ))}
                <blockquote
                  className="mt-8 border-l-4 border-[color:var(--color-accent)] pl-4 text-[color:var(--color-accent)]"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem" }}
                >
                  &quot;{site.about.quote}&quot;
                </blockquote>
              </div>

              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  At a glance
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <div className="font-semibold">Dartmouth Class of 2026</div>
                    <div className="muted">Computer Science</div>
                  </div>
                  <div>
                    <div className="font-semibold">King Scholar</div>
                    <div className="muted">Approximately $400,000 merit scholarship</div>
                  </div>
                  <div>
                    <div className="font-semibold">Academic record</div>
                    <div className="muted">4.0 GPA. Rufus Choate Scholar. Citations for Meritorious Performance</div>
                  </div>
                  <div>
                    <div className="font-semibold">Impact</div>
                    <div className="muted">{site.hero.stats.map((s) => s.label).join(". ")}</div>
                  </div>
                </div>
                <a className="btn btn-secondary mt-6 w-full" href="/impact/">
                  Explore impact
                </a>
              </div>
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-3">
              {site.about.gallery.map((img) => (
                <img
                  key={img.src}
                  src={getAssetPath(img.src)}
                  alt={img.alt}
                  className="h-44 w-full rounded-md border border-[color:var(--color-border)] object-cover"
                  loading="lazy"
                />
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {site.about.tags.map((t) => (
                <span
                  key={t}
                  className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-3 py-2 text-xs text-[color:var(--color-text-muted)]"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container-max">
            <div className="section-label">EDUCATION</div>
            <h2 className="h2">{site.education.heading}</h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
              <div className="card">
                <div className="text-[color:var(--color-accent)]" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {site.education.degreeLine}
                </div>
                <p className="mt-4 muted">{site.education.context}</p>
                <p className="mt-6 muted">{site.education.note}</p>
                <div className="mt-8">
                  <a className="btn btn-secondary" href="/achievements/">
                    View awards and recognition
                  </a>
                </div>
              </div>

              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Selected honors
                </div>
                <ul className="mt-4 space-y-3 text-sm">
                  {site.education.honors.slice(0, 6).map((h) => (
                    <li key={h} className="border-b border-[color:var(--color-border)] pb-3 last:border-b-0 last:pb-0">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section border-y border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
          <div className="container-max">
            <div className="section-label">EXPERIENCE</div>
            <h2 className="h2">Leadership and track record</h2>
            <p className="mt-4 muted max-w-2xl">
              A selected timeline. The full buildout of each role will be expanded across Impact, Achievements, and Projects pages.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {site.experience.items.map((it) => (
                <div key={`${it.dateRange}-${it.role}`} className="card">
                  <div className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--color-accent)" }}>
                    {it.dateRange}
                  </div>
                  <div className="mt-1 font-semibold">{it.role}</div>
                  <div className="mt-1 text-sm muted">{it.organization}</div>
                  <p className="mt-3 text-sm muted">{it.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container-max">
            <div className="section-label">NEXT</div>
            <h2 className="h2">Where to go next</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <a className="card hover:-translate-y-1 transition-transform" href="/organizations/">
                <div className="font-semibold">Organizations</div>
                <p className="mt-3 text-sm muted">3Doors, Palaver Institute, and DeWise Foundation.</p>
              </a>
              <a className="card hover:-translate-y-1 transition-transform" href="/projects/">
                <div className="font-semibold">Projects</div>
                <p className="mt-3 text-sm muted">WiseBox, WiseCool, and project detail pages.</p>
              </a>
              <a className="card hover:-translate-y-1 transition-transform" href="/contact/">
                <div className="font-semibold">Contact</div>
                <p className="mt-3 text-sm muted">Partnerships, speaking, research, and coaching inquiries.</p>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

