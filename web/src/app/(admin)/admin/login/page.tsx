import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminLoginFormNoSsr } from "./login-form-no-ssr";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Admin Login | Triumph Kia Teh",
  description: "Secure administrator sign-in.",
  canonicalPath: "/admin/login",
});

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-primary)] px-4 py-10">
      <section className="w-full max-w-md space-y-6 rounded-xl bg-[var(--color-card)] p-8 shadow-xl">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-[var(--color-foreground)]">Admin Login</h1>
          <p className="text-sm text-[var(--color-muted-fg)]">
            Sign in with your administrator credentials to continue.
          </p>
        </header>
        <Suspense fallback={<p className="text-sm text-[var(--color-muted-fg)]">Loading login form...</p>}>
          <AdminLoginFormNoSsr />
        </Suspense>
        <p className="text-xs text-[var(--color-muted-fg)]">
          Access is monitored. Unauthorized attempts are rate-limited and logged.
        </p>
      </section>
    </main>
  );
}
