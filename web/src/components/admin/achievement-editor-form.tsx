"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ConfirmDeleteDialog } from "@/components/admin/motion/confirm-delete-dialog";
import { SaveStatus } from "@/components/admin/motion/save-status";

type AchievementEditorInitialValues = {
  id?: string;
  title: string;
  summary: string;
  category: string;
  venue: string;
  achievedAt: string;
  externalUrl: string;
  isPublished: boolean;
};

export function AchievementEditorForm({
  mode,
  canDelete,
  initialValues,
}: {
  mode: "create" | "edit";
  canDelete: boolean;
  initialValues: AchievementEditorInitialValues;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setIsSaving(true);
        setErrorMessage(null);
        setSaveState("saving");

        const form = new FormData(event.currentTarget);
        const payload = {
          title: String(form.get("title") ?? ""),
          summary: String(form.get("summary") ?? ""),
          category: String(form.get("category") ?? ""),
          venue: String(form.get("venue") ?? ""),
          achievedAt: String(form.get("achievedAt") ?? ""),
          externalUrl: String(form.get("externalUrl") ?? ""),
          isPublished: form.get("isPublished") === "on",
        };

        const endpoint =
          mode === "create"
            ? "/api/v1/achievements"
            : `/api/v1/achievements/${encodeURIComponent(initialValues.id ?? "")}`;
        const method = mode === "create" ? "POST" : "PATCH";
        const response = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as { error?: string };
          setErrorMessage(body.error ?? "Failed to save achievement.");
          setIsSaving(false);
          setSaveState("error");
          return;
        }

        setSaveState("saved");
        router.push("/admin/achievements");
        router.refresh();
      }}
    >
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Title</span>
        <input
          name="title"
          required
          defaultValue={initialValues.title}
          className="rounded-md border border-(--color-muted) px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Summary</span>
        <textarea
          name="summary"
          rows={4}
          required
          defaultValue={initialValues.summary}
          className="rounded-md border border-(--color-muted) px-3 py-2"
        />
      </label>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Category</span>
          <input
            name="category"
            required
            defaultValue={initialValues.category}
            className="rounded-md border border-(--color-muted) px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Venue</span>
          <input
            name="venue"
            defaultValue={initialValues.venue}
            className="rounded-md border border-(--color-muted) px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Year/Date</span>
          <input
            name="achievedAt"
            type="date"
            defaultValue={initialValues.achievedAt}
            className="rounded-md border border-(--color-muted) px-3 py-2"
          />
        </label>
      </div>
      <label className="grid gap-1 text-sm">
        <span className="font-medium">External URL</span>
        <input
          name="externalUrl"
          defaultValue={initialValues.externalUrl}
          className="rounded-md border border-(--color-muted) px-3 py-2"
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input name="isPublished" type="checkbox" defaultChecked={initialValues.isPublished} />
        <span>Published</span>
      </label>

      <SaveStatus state={saveState} message={errorMessage} />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md border border-(--color-muted) px-4 py-2 text-sm hover:bg-(--color-muted) disabled:opacity-50"
        >
          {isSaving ? "Saving..." : mode === "create" ? "Create achievement" : "Save changes"}
        </button>
        {mode === "edit" && canDelete ? (
          <button
            type="button"
            className="rounded-md border border-red-500 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete (owner only)
          </button>
        ) : null}
      </div>
      <ConfirmDeleteDialog
        open={showDeleteDialog}
        title="Delete achievement?"
        description="This action permanently removes the achievement record."
        confirmLabel="Delete achievement"
        isBusy={isDeleting}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={async () => {
          if (!initialValues.id) {
            return;
          }
          setIsDeleting(true);
          const response = await fetch(`/api/v1/achievements/${encodeURIComponent(initialValues.id)}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            const body = (await response.json().catch(() => ({}))) as { error?: string };
            setErrorMessage(body.error ?? "Failed to delete achievement.");
            setSaveState("error");
            setIsDeleting(false);
            return;
          }
          setShowDeleteDialog(false);
          router.push("/admin/achievements");
          router.refresh();
        }}
      />
    </form>
  );
}
