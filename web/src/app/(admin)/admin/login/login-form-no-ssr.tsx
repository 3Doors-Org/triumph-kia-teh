"use client";

import dynamic from "next/dynamic";

const AdminLoginFormLazy = dynamic(
  () => import("./login-form").then((m) => ({ default: m.AdminLoginForm })),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-5" aria-busy="true" aria-label="Loading sign-in form">
        <div className="h-16 animate-pulse rounded-md bg-[var(--color-muted)]/50" />
        <div className="h-16 animate-pulse rounded-md bg-[var(--color-muted)]/50" />
        <div className="h-10 animate-pulse rounded-md bg-[var(--color-muted)]/50" />
      </div>
    ),
  },
);

export function AdminLoginFormNoSsr() {
  return <AdminLoginFormLazy />;
}
