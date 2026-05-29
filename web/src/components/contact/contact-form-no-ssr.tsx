"use client";

import dynamic from "next/dynamic";

const ContactFormLazy = dynamic(
  () => import("@/components/contact/contact-form").then((m) => ({ default: m.ContactForm })),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-[32rem] w-full rounded-md border border-[var(--color-muted)] bg-[var(--color-card)]/40"
        aria-busy="true"
        aria-label="Loading contact form"
      />
    ),
  },
);

export function ContactFormNoSsr({
  inquiryType,
  e2eTurnstileBypass,
}: {
  inquiryType?: string;
  e2eTurnstileBypass?: boolean;
}) {
  return <ContactFormLazy inquiryType={inquiryType} e2eTurnstileBypass={e2eTurnstileBypass} />;
}
