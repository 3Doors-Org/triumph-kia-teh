"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ConfirmDeleteDialog } from "@/components/admin/motion/confirm-delete-dialog";
import { SaveStatus } from "@/components/admin/motion/save-status";
import { COMMUNITY_IMPACT_DOOR_VALUES } from "@/lib/community-impact/filters";

type CommunityImpactEditorInitialValues = {
  id?: string;
  title: string;
  summary: string;
  door: (typeof COMMUNITY_IMPACT_DOOR_VALUES)[number];
  type: string;
  metricLabel: string;
  metricValue: number;
  orgSlug: string;
  startDate: string;
  isPublished: boolean;
};

export function CommunityImpactEditorForm({
  mode,
  canDelete,
  initialValues,
}: {
  mode: "create" | "edit";
  canDelete: boolean;
  initialValues: CommunityImpactEditorInitialValues;
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
          door: String(form.get("door") ?? "ACCESS"),
          type: String(form.get("type") ?? ""),
          metric: {
            label: String(form.get("metricLabel") ?? ""),
            value: Number(form.get("metricValue") ?? 0),
          },
          orgSlug: String(form.get("orgSlug") ?? ""),
          startDate: String(form.get("startDate") ?? ""),
          isPublished: form.get("isPublished") === "on",
        };

        const endpoint =
          mode === "create"
            ? "/api/v1/community-impact"
            : `/api/v1/community-impact/${encodeURIComponent(initialValues.id ?? "")}`;
        const method = mode === "create" ? "POST" : "PATCH";
        const response = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as { error?: string };
          setErrorMessage(body.error ?? "Failed to save community impact entry.");
          setIsSaving(false);
          setSaveState("error");
          return;
        }

        setSaveState("saved");
        router.push("/admin/community-impact");
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
          <span className="font-medium">Door</span>
          <select name="door" defaultValue={initialValues.door} className="rounded-md border border-(--color-muted) px-3 py-2">
            {COMMUNITY_IMPACT_DOOR_VALUES.map((door) => (
              <option key={door} value={door}>
                {door}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Type</span>
          <input
            name="type"
            required
            defaultValue={initialValues.type}
            className="rounded-md border border-(--color-muted) px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Organization Slug</span>
          <input
            name="orgSlug"
            defaultValue={initialValues.orgSlug}
            className="rounded-md border border-(--color-muted) px-3 py-2"
          />
        </label>
      </div>

      <fieldset className="space-y-3 rounded-md border border-(--color-muted) p-3">
        <legend className="px-1 text-sm font-medium">Impact Metric</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span className="font-medium">Metric Label</span>
            <input
              name="metricLabel"
              required
              defaultValue={initialValues.metricLabel}
              className="rounded-md border border-(--color-muted) px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium">Metric Value</span>
            <input
              name="metricValue"
              type="number"
              min={0}
              required
              defaultValue={String(initialValues.metricValue)}
              className="rounded-md border border-(--color-muted) px-3 py-2"
            />
          </label>
        </div>
      </fieldset>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Start Date (optional)</span>
          <input
            name="startDate"
            type="date"
            defaultValue={initialValues.startDate}
            className="rounded-md border border-(--color-muted) px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="isPublished" type="checkbox" defaultChecked={initialValues.isPublished} />
          <span>Published</span>
        </label>
      </div>

      <SaveStatus state={saveState} message={errorMessage} />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md border border-(--color-muted) px-4 py-2 text-sm hover:bg-(--color-muted) disabled:opacity-50"
        >
          {isSaving ? "Saving..." : mode === "create" ? "Create impact entry" : "Save changes"}
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
        title="Delete impact entry?"
        description="This action permanently removes the community impact record."
        confirmLabel="Delete entry"
        isBusy={isDeleting}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={async () => {
          if (!initialValues.id) {
            return;
          }
          setIsDeleting(true);
          const response = await fetch(`/api/v1/community-impact/${encodeURIComponent(initialValues.id)}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            const body = (await response.json().catch(() => ({}))) as { error?: string };
            setErrorMessage(body.error ?? "Failed to delete entry.");
            setSaveState("error");
            setIsDeleting(false);
            return;
          }
          setShowDeleteDialog(false);
          router.push("/admin/community-impact");
          router.refresh();
        }}
      />
    </form>
  );
}
