import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { FadeIn } from "@/components/FadeIn";
import { site } from "@/lib/siteData";

export default function SpeakingPage() {
  return (
    <>
      <Nav items={site.nav} brand="Triumph Kia Teh" />
      <FadeIn />
      <main className="pt-16">
        <section className="section">
          <div className="container-max">
            <div className="section-label">{site.speaking.label}</div>
            <h1 className="h2">{site.speaking.heading}</h1>
            <p className="mt-4 muted max-w-2xl">{site.speaking.intro}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a className="btn btn-primary" href="/contact/">
                Invite Triumph to speak
              </a>
              <a className="btn btn-secondary" href={site.speaking.ctaEmail}>
                Email
              </a>
              <a
                className="btn btn-secondary"
                href="https://www.linkedin.com/in/triumph-kia-teh/"
                target="_blank"
                rel="noopener"
              >
                LinkedIn
              </a>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {site.speaking.items.map((s) => (
                <div key={s.title} className="card hover:-translate-y-1 transition-transform">
                  <div className="font-semibold">{s.title}</div>
                  <p className="mt-3 text-sm muted">{s.summary}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Topics
                </div>
                <ul className="mt-4 space-y-2 text-sm muted">
                  <li>Scholarship strategy and systems of access</li>
                  <li>Building student success infrastructure</li>
                  <li>Research infrastructure and knowledge production</li>
                  <li>Clean energy, health access, and crisis response innovation</li>
                </ul>
              </div>
              <div className="card">
                <div className="text-xs muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Format
                </div>
                <ul className="mt-4 space-y-2 text-sm muted">
                  <li>Keynotes and conference talks</li>
                  <li>Panels and fireside conversations</li>
                  <li>Workshops for students and young professionals</li>
                  <li>Media interviews and institutional features</li>
                </ul>
              </div>
            </div>

            <p className="mt-8 muted">
              Speaking invitations:{" "}
              <a className="text-[color:var(--color-accent)]" href={site.speaking.ctaEmail}>
                triumph@palaverinstitute.org
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

