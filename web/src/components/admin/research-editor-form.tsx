"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { RESEARCH_STATUS_VALUES } from "@/lib/research/filters";

type ResearchEditorInitialValues = {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  abstract: string;
  authors: string;
  venue: string;
  status: (typeof RESEARCH_STATUS_VALUES)[number];
  externalUrl: string;
  isPublished: boolean;
};

export function ResearchEditorForm({
  mode,
  initialValues,
}: {
  mode: "create" | "edit";
  initialValues: ResearchEditorInitialValues;
}) {
  const router = useRouter();
  const abstractTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [assets, setAssets] = useState<Array<{ id: string; publicUrl: string; filename: string; mimeType: string; altText: string | null }>>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setIsSaving(true);
        setErrorMessage(null);

        const form = new FormData(event.currentTarget);
        const payload = {
          title: String(form.get("title") ?? ""),
          slug: String(form.get("slug") ?? ""),
          summary: String(form.get("summary") ?? ""),
          abstract: String(form.get("abstract") ?? ""),
          authors: String(form.get("authors") ?? ""),
          venue: String(form.get("venue") ?? ""),
          status: String(form.get("status") ?? "published"),
          externalUrl: String(form.get("externalUrl") ?? ""),
          isPublished: form.get("isPublished") === "on",
        };

        const endpoint =
          mode === "create"
            ? "/api/v1/research"
            : `/api/v1/research/by-id/${encodeURIComponent(initialValues.id ?? "")}`;
        const method = mode === "create" ? "POST" : "PATCH";
        const response = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as { error?: string };
          setErrorMessage(body.error ?? "Failed to save research item.");
          setIsSaving(false);
          return;
        }

        router.push("/admin/research");
        router.refresh();
      }}
    >
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Title</span>
        <input
          name="title"
          required
          defaultValue={initialValues.title}
          className="rounded-md border border-[var(--color-muted)] px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Slug</span>
        <input
          name="slug"
          required
          defaultValue={initialValues.slug}
          className="rounded-md border border-[var(--color-muted)] px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Summary</span>
        <textarea
          name="summary"
          rows={3}
          defaultValue={initialValues.summary}
          className="rounded-md border border-[var(--color-muted)] px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Abstract</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={async () => {
              setIsLoadingAssets(true);
              const response = await fetch("/api/v1/assets?limit=30");
              const body = (await response.json().catch(() => ({}))) as {
                data?: Array<{ id: string; publicUrl: string; filename: string; mimeType: string; altText: string | null }>;
              };
              setAssets(body.data ?? []);
              setIsLoadingAssets(false);
            }}
            className="rounded-md border border-[var(--color-muted)] px-3 py-1 text-xs hover:bg-[var(--color-muted)]"
          >
            {isLoadingAssets ? "Loading assets..." : "Browse assets"}
          </button>
          {assets.length > 0 ? (
            <select
              onChange={(event) => {
                const asset = assets.find((entry) => entry.id === event.target.value);
                if (!asset || !abstractTextareaRef.current) return;
                if (asset.mimeType.startsWith("image/") && !asset.altText?.trim()) {
                  setErrorMessage("Selected image has no alt text. Add alt text in Assets before inserting.");
                  event.currentTarget.selectedIndex = 0;
                  return;
                }
                const insertion =
                  asset.mimeType.startsWith("image/")
                    ? `![${asset.altText?.trim()}](${asset.publicUrl})`
                    : `[${asset.filename}](${asset.publicUrl})`;
                const el = abstractTextareaRef.current;
                const start = el.selectionStart ?? el.value.length;
                const end = el.selectionEnd ?? el.value.length;
                el.setRangeText(insertion, start, end, "end");
                el.focus();
                event.currentTarget.selectedIndex = 0;
              }}
              className="max-w-[280px] rounded-md border border-[var(--color-muted)] px-2 py-1 text-xs"
            >
              <option value="">Insert asset link...</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.filename}
                </option>
              ))}
            </select>
          ) : null}
        </div>
        <textarea
          ref={abstractTextareaRef}
          name="abstract"
          rows={8}
          required
          defaultValue={initialValues.abstract}
          className="rounded-md border border-[var(--color-muted)] px-3 py-2"
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Authors (comma separated)</span>
          <input
            name="authors"
            defaultValue={initialValues.authors}
            className="rounded-md border border-[var(--color-muted)] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Venue</span>
          <input
            name="venue"
            defaultValue={initialValues.venue}
            className="rounded-md border border-[var(--color-muted)] px-3 py-2"
          />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Status</span>
          <select name="status" defaultValue={initialValues.status} className="rounded-md border border-[var(--color-muted)] px-3 py-2">
            {RESEARCH_STATUS_VALUES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm md:col-span-2">
          <span className="font-medium">External URL</span>
          <input
            name="externalUrl"
            defaultValue={initialValues.externalUrl}
            className="rounded-md border border-[var(--color-muted)] px-3 py-2"
          />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input name="isPublished" type="checkbox" defaultChecked={initialValues.isPublished} />
        <span>Published</span>
      </label>

      {errorMessage ? (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSaving}
        className="rounded-md border border-[var(--color-muted)] px-4 py-2 text-sm hover:bg-[var(--color-muted)] disabled:opacity-50"
      >
        {isSaving ? "Saving..." : mode === "create" ? "Create research item" : "Save changes"}
      </button>
    </form>
  );
}
