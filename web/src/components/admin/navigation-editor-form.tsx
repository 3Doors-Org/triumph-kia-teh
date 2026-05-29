"use client";

import { useState } from "react";

import type { PublicNavItem } from "@/lib/navigation/public-data";

type Props = {
  initialNavItems: PublicNavItem[];
  initialFooterLinks: PublicNavItem[];
  allowedHrefPrefixes: readonly string[];
};

function clone(items: PublicNavItem[]): PublicNavItem[] {
  return items.map((item) => ({ ...item }));
}

export function NavigationEditorForm({
  initialNavItems,
  initialFooterLinks,
  allowedHrefPrefixes,
}: Props) {
  const [navItems, setNavItems] = useState(() => clone(initialNavItems));
  const [footerLinks, setFooterLinks] = useState(() => clone(initialFooterLinks));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allowlistSnippet = allowedHrefPrefixes.join(", ");

  return (
    <div className="space-y-10">
      <p className="text-sm text-(--color-muted-fg)">
        Only relative URLs on this allowlist are permitted:{" "}
        <span className="font-mono text-xs">{allowlistSnippet}</span>
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Header navigation</h2>
        <ItemEditorList items={navItems} onChange={setNavItems} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Footer links</h2>
        <ItemEditorList items={footerLinks} onChange={setFooterLinks} />
      </section>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="flex gap-3">
        <button
          type="button"
          disabled={saving}
          className="rounded-md border border-(--color-muted) px-4 py-2 text-sm hover:bg-(--color-muted) disabled:opacity-50"
          onClick={async () => {
            setSaving(true);
            setError(null);
            try {
              const response = await fetch("/api/v1/navigation", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  navItems,
                  footerLinks,
                }),
              });
              const body = (await response.json().catch(() => ({}))) as { error?: string; fields?: Record<string, string> };
              if (!response.ok) {
                const message =
                  body.fields && Object.keys(body.fields).length > 0
                    ? Object.values(body.fields).join(" ")
                    : body.error ?? "Save failed.";
                throw new Error(message);
              }
            } catch (saveError) {
              setError(saveError instanceof Error ? saveError.message : "Save failed.");
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? "Saving..." : "Publish navigation"}
        </button>
      </div>
    </div>
  );
}

function ItemEditorList({
  items,
  onChange,
}: {
  items: PublicNavItem[];
  onChange: (next: PublicNavItem[]) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={`${item.href}-${index}`}
          className="grid gap-2 rounded-lg border border-(--color-muted) p-3 md:grid-cols-[140px_minmax(0,1fr)_minmax(0,1fr)_auto_auto]"
        >
          <div className="flex flex-col gap-1 text-xs text-(--color-muted-fg)">
            <span>Order {index + 1}</span>
            <label className="flex items-center gap-2 text-[var(--color-foreground)]">
              <input
                type="checkbox"
                checked={item.enabled !== false}
                onChange={(event) =>
                  replaceItem(items, index, { ...item, enabled: event.target.checked }, onChange)
                }
              />
              Visible
            </label>
          </div>
          <label className="grid gap-1 text-sm md:col-span-1">
            <span className="font-medium">Label</span>
            <input
              value={item.label}
              className="rounded-md border border-(--color-muted) px-3 py-2 text-sm"
              onChange={(event) =>
                replaceItem(items, index, { ...item, label: event.target.value }, onChange)
              }
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium">Href</span>
            <input
              value={item.href}
              className="rounded-md border border-(--color-muted) px-3 py-2 font-mono text-sm"
              onChange={(event) =>
                replaceItem(items, index, { ...item, href: event.target.value }, onChange)
              }
            />
          </label>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={index === 0}
              className="rounded-md border border-(--color-muted) px-2 py-1 text-xs hover:bg-(--color-muted) disabled:opacity-40"
              onClick={() => moveItem(items, index, index - 1, onChange)}
            >
              Up
            </button>
            <button
              type="button"
              disabled={index >= items.length - 1}
              className="rounded-md border border-(--color-muted) px-2 py-1 text-xs hover:bg-(--color-muted) disabled:opacity-40"
              onClick={() => moveItem(items, index, index + 1, onChange)}
            >
              Down
            </button>
          </div>
          <button
            type="button"
            className="self-start rounded-md border border-red-500 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
            onClick={() => removeItem(items, index, onChange)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="rounded-md border border-dashed border-(--color-muted) px-3 py-2 text-sm hover:bg-(--color-muted)"
        onClick={() => onChange([...items, { label: "New link", href: "/", enabled: true }])}
      >
        Add item
      </button>
    </div>
  );
}

function replaceItem(
  items: PublicNavItem[],
  index: number,
  replacement: PublicNavItem,
  onChange: (next: PublicNavItem[]) => void,
) {
  const copy = [...items];
  copy[index] = replacement;
  onChange(copy);
}

function moveItem(
  items: PublicNavItem[],
  from: number,
  to: number,
  onChange: (next: PublicNavItem[]) => void,
) {
  if (to < 0 || to >= items.length) return;
  const copy = [...items];
  const [removed] = copy.splice(from, 1);
  if (!removed) return;
  copy.splice(to, 0, removed);
  onChange(copy);
}

function removeItem(
  items: PublicNavItem[],
  index: number,
  onChange: (next: PublicNavItem[]) => void,
) {
  const copy = items.filter((_, i) => i !== index);
  onChange(copy);
}
