"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";

type AdminLogoutButtonProps = {
  variant?: "sidebar" | "header";
};

export function AdminLogoutButton({ variant = "sidebar" }: AdminLogoutButtonProps) {
  const [submitting, setSubmitting] = useState(false);

  async function onLogout() {
    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.status === 200) {
        window.location.assign("/admin/login");
        return;
      }
    } catch {
      /* fall through */
    }

    setSubmitting(false);
  }

  const className =
    variant === "header"
      ? "inline-flex items-center gap-2 rounded-md border border-[var(--color-muted)] px-3 py-1.5 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)] disabled:opacity-70"
      : "inline-flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-[var(--color-muted-fg)] transition-colors hover:bg-[var(--color-destructive)]/10 hover:text-[var(--color-destructive)] disabled:opacity-70";

  return (
    <button
      type="button"
      className={className}
      onClick={onLogout}
      disabled={submitting}
      aria-busy={submitting}
    >
      <LogOut aria-hidden="true" className="h-4 w-4 shrink-0" />
      {submitting ? "Signing out…" : "Log out"}
    </button>
  );
}
