"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type OrgMetricRow = {
  id: string;
  organization: string | null;
  label: string;
  value: number;
  suffix: string;
  sortOrder: number;
  updatedAt: string;
};

export function OrgMetricsTable({ rows }: { rows: OrgMetricRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-(--color-muted)">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-(--color-muted)/40 text-xs uppercase text-(--color-muted-fg)">
          <tr>
            <th className="px-3 py-2">Organization</th>
            <th className="px-3 py-2">Label</th>
            <th className="px-3 py-2">Value</th>
            <th className="px-3 py-2">Suffix</th>
            <th className="px-3 py-2">Order</th>
            <th className="px-3 py-2">Updated</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <OrgMetricEditableRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrgMetricEditableRow({ row }: { row: OrgMetricRow }) {
  const router = useRouter();
  const [label, setLabel] = useState(row.label);
  const [value, setValue] = useState(String(row.value));
  const [suffix, setSuffix] = useState(row.suffix);
  const [sortOrder, setSortOrder] = useState(String(row.sortOrder));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty =
    label !== row.label ||
    value !== String(row.value) ||
    suffix !== row.suffix ||
    sortOrder !== String(row.sortOrder);

  return (
    <tr className="border-t border-(--color-muted) align-top">
      <td className="px-3 py-2 text-(--color-muted-fg)">{row.organization ?? "Site-wide"}</td>
      <td className="px-3 py-2">
        <input
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          className="w-full min-w-[140px] rounded-md border border-(--color-muted) px-2 py-1"
        />
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          min={0}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="w-24 rounded-md border border-(--color-muted) px-2 py-1"
        />
      </td>
      <td className="px-3 py-2">
        <input
          value={suffix}
          onChange={(event) => setSuffix(event.target.value)}
          className="w-20 rounded-md border border-(--color-muted) px-2 py-1"
        />
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          min={0}
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          className="w-20 rounded-md border border-(--color-muted) px-2 py-1"
        />
      </td>
      <td className="px-3 py-2 text-xs text-(--color-muted-fg)">
        {new Date(row.updatedAt).toLocaleString()}
      </td>
      <td className="px-3 py-2">
        {error ? <p className="mb-1 text-xs text-red-700">{error}</p> : null}
        <button
          type="button"
          disabled={saving || !dirty}
          className="rounded-md border border-(--color-muted) px-2 py-1 text-xs hover:bg-(--color-muted) disabled:opacity-40"
          onClick={async () => {
            setSaving(true);
            setError(null);
            try {
              const response = await fetch(`/api/v1/org-metrics/${encodeURIComponent(row.id)}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  label,
                  value: Number(value),
                  suffix,
                  sortOrder: Number(sortOrder),
                }),
              });
              if (!response.ok) {
                const body = (await response.json().catch(() => ({}))) as { error?: string };
                throw new Error(body.error ?? "Save failed.");
              }
              router.refresh();
            } catch (saveError) {
              setError(saveError instanceof Error ? saveError.message : "Save failed.");
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </td>
    </tr>
  );
}
