"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { LEAD_STATUS_VALUES, type LeadStatus } from "@/lib/leads/status";

export type SerializedLeadSummary = {
  id: string;
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  sourcePage: string;
  status: string;
  adminNotes: string | null;
  createdAt: string;
};

export function LeadsDetailPanel({ lead }: { lead: SerializedLeadSummary | null }) {
  if (!lead) {
    return (
      <aside className="rounded-lg border border-(--color-muted) bg-(--color-card) p-4 text-sm text-(--color-muted-fg)">
        Select an inquiry from the list to view the full message and update status or notes.
      </aside>
    );
  }

  return <LeadDetailBody key={lead.id} lead={lead} />;
}

function LeadDetailBody({ lead }: { lead: SerializedLeadSummary }) {
  const router = useRouter();
  const [notes, setNotes] = useState(lead.adminNotes ?? "");
  const [status, setStatus] = useState<LeadStatus>(lead.status as LeadStatus);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savingNotes, setSavingNotes] = useState(false);

  const notesDirty = notes !== (lead.adminNotes ?? "");

  return (
    <aside className="flex min-h-[320px] flex-col rounded-lg border border-(--color-muted) bg-(--color-card) p-4">
      <div className="space-y-1 border-b border-(--color-muted) pb-3">
        <h2 className="text-xl font-semibold">{lead.name}</h2>
        <p className="text-sm text-(--color-muted-fg)">{lead.email}</p>
        <p className="text-xs uppercase tracking-wide text-(--color-muted-fg)">
          {lead.inquiryType}
          {" · "}
          {lead.sourcePage}
        </p>
        <time className="text-xs text-(--color-muted-fg)" dateTime={lead.createdAt}>
          {new Date(lead.createdAt).toLocaleString()}
        </time>
      </div>

      <label className="mt-4 text-sm font-medium" htmlFor="lead-status">
        Status
      </label>
      <select
        id="lead-status"
        value={status}
        className="mt-1 rounded-md border border-(--color-muted) px-3 py-2 text-sm"
        onChange={(event) => {
          const previous = status;
          const next = event.target.value as LeadStatus;
          setStatus(next);
          setErrorMessage(null);
          void (async () => {
            try {
              const response = await fetch(`/api/v1/leads/${encodeURIComponent(lead.id)}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: next }),
              });
              if (!response.ok) {
                const body = (await response.json().catch(() => ({}))) as { error?: string };
                throw new Error(body.error ?? "Update failed.");
              }
              router.refresh();
            } catch (updateError) {
              setStatus(previous);
              setErrorMessage(updateError instanceof Error ? updateError.message : "Update failed.");
            }
          })();
        }}
      >
        {LEAD_STATUS_VALUES.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>

      <p className="mt-4 text-sm font-medium">Message</p>
      <pre className="mt-2 max-h-[340px] flex-1 overflow-auto whitespace-pre-wrap rounded-md border border-(--color-muted) bg-[var(--color-background)] p-3 text-sm leading-relaxed">
        {lead.message}
      </pre>

      <label className="mt-4 text-sm font-medium" htmlFor="lead-notes">
        Internal notes (owner-only, not emailed)
      </label>
      <textarea
        id="lead-notes"
        value={notes}
        disabled={savingNotes}
        rows={5}
        className="mt-1 w-full resize-y rounded-md border border-(--color-muted) px-3 py-2 text-sm"
        onChange={(event) => setNotes(event.target.value)}
      />

      {errorMessage ? <p className="mt-2 text-sm text-red-700">{errorMessage}</p> : null}

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          disabled={savingNotes || !notesDirty}
          className="rounded-md border border-(--color-muted) px-4 py-2 text-sm hover:bg-(--color-muted) disabled:opacity-50"
          onClick={async () => {
            const snapshot = lead.adminNotes ?? "";
            setSavingNotes(true);
            setErrorMessage(null);
            try {
              const response = await fetch(`/api/v1/leads/${encodeURIComponent(lead.id)}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adminNotes: notes }),
              });
              if (!response.ok) {
                const body = (await response.json().catch(() => ({}))) as { error?: string };
                throw new Error(body.error ?? "Failed to save notes.");
              }
              router.refresh();
            } catch (saveError) {
              setNotes(snapshot);
              setErrorMessage(saveError instanceof Error ? saveError.message : "Failed to save notes.");
            } finally {
              setSavingNotes(false);
            }
          }}
        >
          {savingNotes ? "Saving..." : "Save notes"}
        </button>
      </div>
    </aside>
  );
}
