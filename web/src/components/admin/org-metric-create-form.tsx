"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type OrgOption = { id: string; name: string; slug: string };

export function OrgMetricCreateForm({ organizations }: { organizations: OrgOption[] }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <form
      className="max-w-lg space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setIsSaving(true);
        setErrorMessage(null);

        const form = new FormData(event.currentTarget);
        const orgIdRaw = String(form.get("orgId") ?? "");
        const payload = {
          orgId: orgIdRaw.length > 0 ? orgIdRaw : null,
          label: String(form.get("label") ?? ""),
          value: Number(form.get("value") ?? 0),
          suffix: String(form.get("suffix") ?? "+"),
          sortOrder: Number(form.get("sortOrder") ?? 0),
        };

        const response = await fetch("/api/v1/org-metrics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as { error?: string };
          setErrorMessage(body.error ?? "Failed to create metric.");
          setIsSaving(false);
          return;
        }

        router.push("/admin/metrics");
        router.refresh();
      }}
    >
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Organization (optional)</span>
        <select name="orgId" className="rounded-md border border-(--color-muted) px-3 py-2">
          <option value="">Site-wide (home)</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Label</span>
        <input name="label" required className="rounded-md border border-(--color-muted) px-3 py-2" />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Value</span>
        <input name="value" type="number" min={0} required defaultValue={0} className="rounded-md border border-(--color-muted) px-3 py-2" />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Suffix</span>
        <input name="suffix" defaultValue="+" className="rounded-md border border-(--color-muted) px-3 py-2" />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Sort order</span>
        <input name="sortOrder" type="number" min={0} defaultValue={0} className="rounded-md border border-(--color-muted) px-3 py-2" />
      </label>

      {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}

      <button
        type="submit"
        disabled={isSaving}
        className="rounded-md bg-(--color-primary) px-4 py-2 text-sm font-medium text-(--color-primary-fg) disabled:opacity-50"
      >
        {isSaving ? "Creating..." : "Create metric"}
      </button>
    </form>
  );
}
