import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { FadeIn } from "@/components/FadeIn";
import { site } from "@/lib/siteData";

export default function ContactPage() {
  return (
    <>
      <Nav items={site.nav} brand="Triumph Kia Teh" />
      <FadeIn />
      <main className="pt-16">
        <section className="section">
          <div className="container-max">
            <div className="section-label">{site.contact.label}</div>
            <h1 className="h2">{site.contact.heading}</h1>
            <p className="mt-4 muted max-w-2xl">
              Use the form below for partnerships, speaking invitations, coaching inquiries, and research collaboration.
            </p>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {site.contact.ctas.map((cta) => (
                <div key={cta.title} className="card">
                  <div className="font-semibold">{cta.title}</div>
                  <p className="mt-3 text-sm muted">{cta.description}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {cta.links.map((l) => (
                      <a
                        key={l.href}
                        className="btn btn-secondary px-4 py-2 text-sm"
                        href={l.href}
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        rel={l.href.startsWith("http") ? "noopener" : undefined}
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <form
              id="contact-form"
              className="mt-12 grid max-w-xl gap-4"
              action={site.contact.form.formspreeAction}
              method="POST"
            >
              <input
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3"
                type="text"
                name="name"
                placeholder="Your Name"
                required
              />
              <input
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3"
                type="email"
                name="email"
                placeholder="Your Email"
                required
              />
              <input
                className="hidden"
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <select
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3"
                name="inquiry_type"
                defaultValue=""
              >
                <option value="">I am a...</option>
                <option value="student">Student seeking coaching</option>
                <option value="researcher">Researcher interested in Palaver</option>
                <option value="partner">Partner or funder</option>
                <option value="speaking">Speaking invitation</option>
                <option value="other">Other</option>
              </select>
              <textarea
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3"
                name="message"
                placeholder="Your message..."
                rows={6}
                required
              />
              <button type="submit" className="btn btn-primary w-fit">
                Send message
              </button>
              <div className="text-sm muted">
                <div>
                  Email:{" "}
                  <a className="text-[color:var(--color-accent)]" href={`mailto:${site.contact.form.email}`}>
                    {site.contact.form.email}
                  </a>
                </div>
                <div className="mt-2">
                  Tip: include your timeline, location (or time zone), and what success looks like.
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

