import type { Metadata } from "next";
import { Calendar, Mail, MapPin } from "lucide-react";

import { ContactExitIntentGate } from "@/components/contact/contact-exit-intent-gate";
import { ContactFormNoSsr } from "@/components/contact/contact-form-no-ssr";
import { RevealSection } from "@/components/motion/reveal-section";
import { isServerTurnstileVerificationBypassed } from "@/lib/contact/turnstile-bypass";
import { isRevealEnabled } from "@/lib/motion/manifest";
import { buildPageMetadata } from "@/lib/seo";
import { Card } from "@/components/ui";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact | Triumph Kia Teh",
  description:
    "Contact Triumph Kia Teh for speaking, partnership, media, and collaboration inquiries.",
  canonicalPath: "/contact",
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const inquiryType =
    typeof resolvedSearchParams.type === "string" ? resolvedSearchParams.type : undefined;
  const queryBypass =
    process.env.NODE_ENV !== "production" && resolvedSearchParams.e2eBypass === "1";

  return (
    <>
      <ContactExitIntentGate />
      <section className="grid gap-8 lg:grid-cols-12">
        <RevealSection as="div" enabled={isRevealEnabled("contact", "header")} className="lg:col-span-5">
          <h1 className="text-4xl font-semibold">Contact</h1>
          <p className="mt-3 text-[var(--color-muted-fg)]">
            Use the form to send speaking, partnership, media, or general inquiries.
          </p>
          <div className="mt-6">
            <ContactFormNoSsr
              inquiryType={inquiryType}
              e2eTurnstileBypass={isServerTurnstileVerificationBypassed() || queryBypass}
            />
          </div>
        </RevealSection>
        <RevealSection as="div" enabled={isRevealEnabled("contact", "sidebar")} className="lg:col-span-7">
          <div className="space-y-4 lg:sticky lg:top-24">
            <Card className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted-fg)]">
                Let&apos;s connect
              </p>
              <h2 className="text-2xl font-semibold">Start a conversation</h2>
              <p className="text-sm text-[var(--color-muted-fg)]">
                Please share clear context so your message can be reviewed and routed quickly.
              </p>
              <ul className="space-y-2 text-sm text-[var(--color-muted-fg)]">
                <li>Partnerships: include timeline and organization details.</li>
                <li>Speaking: include event audience size and dates.</li>
                <li>Media: include publication, deadline, and topic scope.</li>
              </ul>
            </Card>
            <Card className="space-y-3">
              <h3 className="text-base font-semibold">Quick contact options</h3>
              <div className="space-y-2 text-sm">
                <a
                  className="group flex items-center gap-3 rounded-md p-2 -m-2 text-[var(--color-foreground)] transition-colors duration-300 hover:bg-[var(--color-muted)] hover:text-[var(--color-accent)]"
                  href="mailto:kiattriumph@gmail.com"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--color-accent)]/10 text-[var(--color-accent)] transition-colors duration-300 group-hover:bg-[var(--color-accent)]/20 group-hover:text-[var(--color-accent)]">
                    <Mail size={16} aria-hidden="true" />
                  </span>
                  <span>kiattriumph@gmail.com</span>
                </a>
                <a
                  className="group flex items-center gap-3 rounded-md p-2 -m-2 text-[var(--color-foreground)] transition-colors duration-300 hover:bg-[var(--color-muted)] hover:text-[var(--color-accent)]"
                  href="https://www.linkedin.com/in/triumph-kia-teh"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--color-accent)]/10 text-[var(--color-accent)] transition-colors duration-300 group-hover:bg-[var(--color-accent)]/20 group-hover:text-[var(--color-accent)]">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </span>
                  <span>LinkedIn: /in/triumph-kia-teh</span>
                </a>
                <div className="flex items-center gap-3 p-2 -m-2 text-[var(--color-muted-fg)]">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--color-muted)]">
                    <MapPin size={16} aria-hidden="true" className="text-[var(--color-accent)]" />
                  </span>
                  <span>Global, based in Dartmouth</span>
                </div>
                <a
                  className="group flex items-center gap-3 rounded-md p-2 -m-2 text-[var(--color-foreground)] transition-colors duration-300 hover:bg-[var(--color-muted)] hover:text-[var(--color-accent)]"
                  href="mailto:kiattriumph@gmail.com?subject=Consultation%20Request"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--color-accent)]/10 text-[var(--color-accent)] transition-colors duration-300 group-hover:bg-[var(--color-accent)]/20 group-hover:text-[var(--color-accent)]">
                    <Calendar size={16} aria-hidden="true" />
                  </span>
                  <span>Book a consultation</span>
                </a>
              </div>
            </Card>
            <Card className="space-y-2">
              <p className="text-sm text-[var(--color-muted-fg)]">
                Follow for frameworks, not motivation. I post regularly.
              </p>
            </Card>
          </div>
        </RevealSection>
      </section>
    </>
  );
}
