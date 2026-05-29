"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type LoginFields = {
  email: string;
  password: string;
};

type LoginErrorState = {
  form?: string;
  email?: string;
  password?: string;
};

function sanitizeCallbackUrl(value: string | null): string {
  if (!value) {
    return "/admin";
  }
  if (!value.startsWith("/admin")) {
    return "/admin";
  }
  return value;
}

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fields, setFields] = useState<LoginFields>({ email: "", password: "" });
  const [errors, setErrors] = useState<LoginErrorState>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: LoginErrorState = {};
    const email = fields.email.trim().toLowerCase();
    const password = fields.password;

    if (!email.includes("@")) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});
    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 200) {
      const callbackUrl = sanitizeCallbackUrl(searchParams.get("callbackUrl"));
      router.replace(callbackUrl);
      return;
    }

    if (response.status === 429) {
      const payload = (await response.json()) as { retryAfter?: number };
      const seconds = typeof payload.retryAfter === "number" ? payload.retryAfter : 60;
      setErrors({
        form: `Too many login attempts. Try again in ${seconds} seconds.`,
      });
      setSubmitting(false);
      return;
    }

    setErrors({ form: "Invalid email or password." });
    setSubmitting(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="space-y-1">
        <label htmlFor="admin-email" className="block text-sm font-medium text-[var(--color-foreground)]">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          data-lpignore="true"
          data-1p-ignore="true"
          value={fields.email}
          onChange={(event) => setFields((prev) => ({ ...prev, email: event.target.value }))}
          className="w-full rounded-md border border-[var(--color-muted)] px-3 py-2 text-sm"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "admin-email-error" : undefined}
          disabled={submitting}
          required
        />
        {errors.email ? (
          <p id="admin-email-error" className="text-xs text-[var(--color-destructive)]">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-1">
        <label htmlFor="admin-password" className="block text-sm font-medium text-[var(--color-foreground)]">
          Password
        </label>
        <div className="flex gap-2">
          <input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            data-lpignore="true"
            data-1p-ignore="true"
            value={fields.password}
            onChange={(event) => setFields((prev) => ({ ...prev, password: event.target.value }))}
            className="w-full rounded-md border border-[var(--color-muted)] px-3 py-2 text-sm"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "admin-password-error" : undefined}
            disabled={submitting}
            required
          />
          <button
            type="button"
            className="rounded-md border border-[var(--color-muted)] px-3 py-2 text-xs"
            aria-label={showPassword ? "Hide secret text" : "Show secret text"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((value) => !value)}
            disabled={submitting}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password ? (
          <p id="admin-password-error" className="text-xs text-[var(--color-destructive)]">
            {errors.password}
          </p>
        ) : null}
      </div>

      {errors.form ? (
        <p role="alert" className="rounded-md border border-[var(--color-destructive)]/30 bg-[var(--color-destructive)]/10 px-3 py-2 text-sm text-[var(--color-destructive)]">
          {errors.form}
        </p>
      ) : null}

      <button
        type="submit"
        className="w-full rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-fg)] hover:opacity-95 disabled:opacity-70"
        disabled={submitting}
      >
        {submitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
