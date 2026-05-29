"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ConfirmDeleteDialog } from "@/components/admin/motion/confirm-delete-dialog";
import { SaveStatus } from "@/components/admin/motion/save-status";

type TestimonialEditorInitialValues = {
  id?: string;
  authorName: string;
  authorTitle: string;
  authorOrganization: string;
  quote: string;
  status: "draft" | "published";
  avatarUrl: string;
  sortOrder: number;
  isPublished: boolean;
};

export function TestimonialEditorForm({
  mode,
  canDelete,
  initialValues,
}: {
  mode: "create" | "edit";
  canDelete: boolean;
  initialValues: TestimonialEditorInitialValues;
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
          authorName: String(form.get("authorName") ?? ""),
          authorTitle: String(form.get("authorTitle") ?? ""),
          authorOrganization: String(form.get("authorOrganization") ?? ""),
          quote: String(form.get("quote") ?? ""),
          status: String(form.get("status") ?? "published"),
          avatarUrl: String(form.get("avatarUrl") ?? ""),
          sortOrder: Number(form.get("sortOrder") ?? 0),
          isPublished: form.get("isPublished") === "on",
        };

        const endpoint =
          mode === "create"
            ? "/api/v1/testimonials"
            : `/api/v1/testimonials/${encodeURIComponent(initialValues.id ?? "")}`;
        const method = mode === "create" ? "POST" : "PATCH";
        const response = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as { error?: string };
          setErrorMessage(body.error ?? "Failed to save testimonial.");
          setIsSaving(false);
          setSaveState("error");
          return;
        }

        setSaveState("saved");
        router.push("/admin/testimonials");
        router.refresh();
      }}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Author Name</span>
          <input name="authorName" required defaultValue={initialValues.authorName} className="rounded-md border border-(--color-muted) px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Author Title</span>
          <input name="authorTitle" defaultValue={initialValues.authorTitle} className="rounded-md border border-(--color-muted) px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Author Organization</span>
          <input
            name="authorOrganization"
            defaultValue={initialValues.authorOrganization}
            className="rounded-md border border-(--color-muted) px-3 py-2"
          />
        </label>
      </div>
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Quote</span>
        <textarea name="quote" rows={6} required defaultValue={initialValues.quote} className="rounded-md border border-(--color-muted) px-3 py-2" />
      </label>
      <div className="grid gap-4 md:grid-cols-4">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Status</span>
          <select name="status" defaultValue={initialValues.status} className="rounded-md border border-(--color-muted) px-3 py-2">
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm md:col-span-2">
          <span className="font-medium">Avatar URL (temporary)</span>
          <input name="avatarUrl" defaultValue={initialValues.avatarUrl} className="rounded-md border border-(--color-muted) px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Sort Order</span>
          <input
            name="sortOrder"
            type="number"
            min={0}
            defaultValue={String(initialValues.sortOrder)}
            className="rounded-md border border-(--color-muted) px-3 py-2"
          />
        </label>
      </div>
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
          {isSaving ? "Saving..." : mode === "create" ? "Create testimonial" : "Save changes"}
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
        title="Delete testimonial?"
        description="This action permanently removes this testimonial."
        confirmLabel="Delete testimonial"
        isBusy={isDeleting}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={async () => {
          if (!initialValues.id) {
            return;
          }
          setIsDeleting(true);
          const response = await fetch(`/api/v1/testimonials/${encodeURIComponent(initialValues.id)}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            const body = (await response.json().catch(() => ({}))) as { error?: string };
            setErrorMessage(body.error ?? "Failed to delete testimonial.");
            setSaveState("error");
            setIsDeleting(false);
            return;
          }
          setShowDeleteDialog(false);
          router.push("/admin/testimonials");
          router.refresh();
        }}
      />
    </form>
  );
}
