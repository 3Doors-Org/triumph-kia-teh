import { site } from "@/lib/siteData";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      <div className="container-max py-12">
        <div className="grid gap-8 md:grid-cols-3 md:items-start">
          <div>
            <div className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Triumph Kia Teh
            </div>
            <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">
              The Student Success Architect
              <br />
              {site.taglineLine}
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold">Quick links</div>
            <ul className="mt-3 grid gap-2 text-sm text-[color:var(--color-text-muted)]">
              <li>
                <a className="hover:text-[color:var(--color-text)]" href="/about/">
                  About
                </a>
              </li>
              <li>
                <a className="hover:text-[color:var(--color-text)]" href="/impact/">
                  Impact
                </a>
              </li>
              <li>
                <a className="hover:text-[color:var(--color-text)]" href="/organizations/">
                  Organizations
                </a>
              </li>
              <li>
                <a className="hover:text-[color:var(--color-text)]" href="/projects/">
                  Projects
                </a>
              </li>
              <li>
                <a className="hover:text-[color:var(--color-text)]" href="/writing/">
                  Writing
                </a>
              </li>
              <li>
                <a className="hover:text-[color:var(--color-text)]" href="/contact/">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold">Connect</div>
            <ul className="mt-3 grid gap-2 text-sm text-[color:var(--color-text-muted)]">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a className="hover:text-[color:var(--color-text)]" href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel={s.href.startsWith("http") ? "noopener" : undefined}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[color:var(--color-border)] pt-6 text-center text-xs text-[color:var(--color-text-muted)]">
          © 2026 Triumph Kia Teh. Built to open doors.
        </div>
      </div>
    </footer>
  );
}

