"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ORGANIZATION_DOOR_VALUES } from "@/lib/organizations/constants";

type OrganizationEditorInitialValues = {
  id?: string;
  slug: string;
  name: string;
  door: string;
  mission: string;
  externalUrl: string;
};

export function OrganizationEditorForm({
  mode,
  initialValues,
}: {
  mode: "create" | "edit";
  initialValues: OrganizationEditorInitialValues;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <form
      className="max-w-2xl space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setIsSaving(true);
        setErrorMessage(null);

        const form = new FormData(event.currentTarget);
        const payload = {
          slug: String(form.get("slug") ?? "").trim().toLowerCase(),
          name: String(form.get("name") ?? ""),
          door: String(form.get("door") ?? "INSTITUTION"),
          mission: String(form.get("mission") ?? ""),
          externalUrl: String(form.get("externalUrl") ?? ""),
        };

        const endpoint =
          mode === "create"
            ? "/api/v1/organizations"
            : `/api/v1/organizations/${encodeURIComponent(initialValues.id ?? "")}`;
        const method = mode === "create" ? "POST" : "PATCH";

        const response = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as { error?: string; fields?: Record<string, string> };
          const message =
            body.fields && Object.keys(body.fields).length > 0
              ? Object.values(body.fields).join(" ")
              : body.error ?? "Failed to save organization.";
          setErrorMessage(message);
          setIsSaving(false);
          return;
        }

        router.push("/admin/site-content/organizations");
        router.refresh();
      }}
    >
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Slug</span>
        <input
          name="slug"
          required
          defaultValue={initialValues.slug}
          disabled={mode === "edit"}
          pattern="[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?"
          className="rounded-md border border-(--color-muted) px-3 py-2 disabled:opacity-60"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Name</span>
        <input name="name" required defaultValue={initialValues.name} className="rounded-md border border-(--color-muted) px-3 py-2" />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Door</span>
        <select name="door" defaultValue={initialValues.door} className="rounded-md border border-(--color-muted) px-3 py-2">
          {ORGANIZATION_DOOR_VALUES.map((door) => (
            <option key={door} value={door}>
              {door}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Mission</span>
        <textarea
          name="mission"
          required
          rows={6}
          defaultValue={initialValues.mission}
          className="rounded-md border border-(--color-muted) px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium">External URL</span>
        <input
          name="externalUrl"
          type="url"
          defaultValue={initialValues.externalUrl}
          placeholder="https://"
          className="rounded-md border border-(--color-muted) px-3 py-2"
        />
      </label>

      {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}

      <button
        type="submit"
        disabled={isSaving}
        className="rounded-md bg-(--color-primary) px-4 py-2 text-sm font-medium text-(--color-primary-fg) disabled:opacity-50"
      >
        {isSaving ? "Saving..." : mode === "create" ? "Create organization" : "Save changes"}
      </button>
    </form>
  );
}
