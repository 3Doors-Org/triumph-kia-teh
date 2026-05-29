"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { WRITING_DOOR_VALUES } from "@/lib/writing/filters";

type WritingEditorInitialValues = {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  door: string;
  tags: string;
  bodyText: string;
  status: "draft" | "published";
};

export function WritingEditorForm({
  mode,
  initialValues,
}: {
  mode: "create" | "edit";
  initialValues: WritingEditorInitialValues;
}) {
  const router = useRouter();
  const bodyTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [assets, setAssets] = useState<Array<{ id: string; publicUrl: string; filename: string; altText: string | null }>>([]);
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
          door: String(form.get("door") ?? ""),
          tags: String(form.get("tags") ?? ""),
          bodyText: String(form.get("bodyText") ?? ""),
          publish: form.get("status") === "published",
        };

        const endpoint =
          mode === "create" ? "/api/v1/writing" : `/api/v1/writing/${encodeURIComponent(initialValues.id ?? "")}`;
        const method = mode === "create" ? "POST" : "PATCH";
        const response = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as { error?: string };
          setErrorMessage(body.error ?? "Failed to save writing post.");
          setIsSaving(false);
          return;
        }

        router.push("/admin/writing");
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

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Door</span>
          <select name="door" defaultValue={initialValues.door} className="rounded-md border border-[var(--color-muted)] px-3 py-2">
            <option value="">None</option>
            {WRITING_DOOR_VALUES.map((door) => (
              <option key={door} value={door}>
                {door}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium">Status</span>
          <select name="status" defaultValue={initialValues.status} className="rounded-md border border-[var(--color-muted)] px-3 py-2">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium">Tags</span>
          <input
            name="tags"
            defaultValue={initialValues.tags}
            placeholder="comma,separated,tags"
            className="rounded-md border border-[var(--color-muted)] px-3 py-2"
          />
        </label>
      </div>

      <label className="grid gap-1 text-sm">
        <span className="font-medium">Body</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={async () => {
              setIsLoadingAssets(true);
              const response = await fetch("/api/v1/assets?mimeType=image/&limit=30");
              const body = (await response.json().catch(() => ({}))) as {
                data?: Array<{ id: string; publicUrl: string; filename: string; altText: string | null }>;
              };
              setAssets(body.data ?? []);
              setIsLoadingAssets(false);
            }}
            className="rounded-md border border-[var(--color-muted)] px-3 py-1 text-xs hover:bg-[var(--color-muted)]"
          >
            {isLoadingAssets ? "Loading images..." : "Browse images"}
          </button>
          {assets.length > 0 ? (
            <select
              onChange={(event) => {
                const asset = assets.find((entry) => entry.id === event.target.value);
                if (!asset || !bodyTextareaRef.current) return;
                const altText = asset.altText?.trim();
                if (!altText) {
                  setErrorMessage("Selected image has no alt text. Add alt text in Assets before inserting.");
                  event.currentTarget.selectedIndex = 0;
                  return;
                }
                const markdown = `![${altText}](${asset.publicUrl})`;
                const el = bodyTextareaRef.current;
                const start = el.selectionStart ?? el.value.length;
                const end = el.selectionEnd ?? el.value.length;
                el.setRangeText(markdown, start, end, "end");
                el.focus();
                event.currentTarget.selectedIndex = 0;
              }}
              className="max-w-[280px] rounded-md border border-[var(--color-muted)] px-2 py-1 text-xs"
            >
              <option value="">Insert image from library...</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.filename}
                </option>
              ))}
            </select>
          ) : null}
        </div>
        <textarea
          ref={bodyTextareaRef}
          name="bodyText"
          rows={18}
          required
          defaultValue={initialValues.bodyText}
          className="rounded-md border border-[var(--color-muted)] px-3 py-2 font-mono"
        />
      </label>

      {errorMessage ? <p role="alert" className="text-sm text-red-600">{errorMessage}</p> : null}

      <button
        type="submit"
        disabled={isSaving}
        className="rounded-md border border-[var(--color-muted)] px-4 py-2 text-sm hover:bg-[var(--color-muted)] disabled:opacity-50"
      >
        {isSaving ? "Saving..." : mode === "create" ? "Create post" : "Save changes"}
      </button>
    </form>
  );
}
