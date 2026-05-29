"use client";

import { useState } from "react";

import { ExitIntentModal } from "@/components/exit-intent/exit-intent-modal";
import type { ExitIntentContextKey } from "@/lib/exit-intent/contexts";
import { EXIT_INTENT_CONTEXT_KEYS } from "@/lib/exit-intent/contexts";
import { routes } from "@/lib/routes";

export type ExitIntentDraftBlock = {
  headline: string;
  supportingLine: string;
  ctaLabel: string;
  ctaUrl: string;
  dismissText: string;
  contextDelayMs: string;
};

type Props = {
  isActive: boolean;
  triggerDelayMs: number;
  contexts: Partial<Record<ExitIntentContextKey, Partial<ExitIntentDraftBlock>>>;
};

function baseBlock(seed?: Partial<ExitIntentDraftBlock>): ExitIntentDraftBlock {
  return {
    headline: seed?.headline ?? "",
    supportingLine: seed?.supportingLine ?? "",
    ctaLabel: seed?.ctaLabel ?? "",
    ctaUrl: seed?.ctaUrl ?? "",
    dismissText: seed?.dismissText?.trim() ? seed.dismissText : "Not now",
    contextDelayMs: seed?.contextDelayMs != null ? String(seed.contextDelayMs) : "",
  };
}

export function ExitIntentEditorForm(initial: Props) {
  const [isActive, setIsActive] = useState(initial.isActive);
  const [globalDelay, setGlobalDelay] = useState(String(initial.triggerDelayMs));
  const [contexts, setContexts] = useState<Record<ExitIntentContextKey, ExitIntentDraftBlock>>(() => {
    const map = {} as Record<ExitIntentContextKey, ExitIntentDraftBlock>;
    for (const key of EXIT_INTENT_CONTEXT_KEYS) {
      map[key] = baseBlock(initial.contexts[key]);
    }
    return map;
  });
  const [previewKey, setPreviewKey] = useState<ExitIntentContextKey>("home");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewBlock = contexts[previewKey];
  const previewCtaUrl = previewBlock.ctaUrl.trim() || routes.public.contact;

  return (
    <div className="space-y-10">
      <section className="space-y-3 rounded-lg border border-(--color-muted) p-4">
        <h2 className="text-lg font-semibold">Global controls</h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
          />
          Exit intent active
        </label>
        <label className="grid max-w-xs gap-1 text-sm">
          <span className="font-medium">Activation delay (ms)</span>
          <input
            type="number"
            min={0}
            max={600_000}
            value={globalDelay}
            onChange={(event) => setGlobalDelay(event.target.value)}
            className="rounded-md border border-(--color-muted) px-3 py-2"
          />
        </label>
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-sm">
            <span className="font-medium">Preview context</span>
            <select
              value={previewKey}
              onChange={(event) => setPreviewKey(event.target.value as ExitIntentContextKey)}
              className="rounded-md border border-(--color-muted) px-3 py-2"
            >
              {EXIT_INTENT_CONTEXT_KEYS.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="rounded-md border border-(--color-muted) px-3 py-2 text-sm hover:bg-(--color-muted)"
            onClick={() => setPreviewOpen(true)}
          >
            Sandbox preview
          </button>
        </div>
        <p className="text-xs text-(--color-muted-fg)">
          Preview uses your unsaved draft text and does not emit analytics events.
        </p>
      </section>

      {EXIT_INTENT_CONTEXT_KEYS.map((key) => (
        <section key={key} className="space-y-3 rounded-lg border border-(--color-muted) p-4">
          <h2 className="text-lg font-semibold capitalize">{key.replaceAll("-", " ")}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-1 text-sm md:col-span-2">
              <span className="font-medium">Headline</span>
              <input
                value={contexts[key].headline}
                onChange={(event) =>
                  setContexts({ ...contexts, [key]: { ...contexts[key], headline: event.target.value } })
                }
                className="rounded-md border border-(--color-muted) px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm md:col-span-2">
              <span className="font-medium">Supporting line</span>
              <textarea
                value={contexts[key].supportingLine}
                onChange={(event) =>
                  setContexts({
                    ...contexts,
                    [key]: { ...contexts[key], supportingLine: event.target.value },
                  })
                }
                rows={3}
                className="rounded-md border border-(--color-muted) px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium">CTA label</span>
              <input
                value={contexts[key].ctaLabel}
                onChange={(event) =>
                  setContexts({ ...contexts, [key]: { ...contexts[key], ctaLabel: event.target.value } })
                }
                className="rounded-md border border-(--color-muted) px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium">CTA URL</span>
              <input
                value={contexts[key].ctaUrl}
                onChange={(event) =>
                  setContexts({ ...contexts, [key]: { ...contexts[key], ctaUrl: event.target.value } })
                }
                className="rounded-md border border-(--color-muted) px-3 py-2 font-mono text-xs"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium">Dismiss label</span>
              <input
                value={contexts[key].dismissText}
                onChange={(event) =>
                  setContexts({ ...contexts, [key]: { ...contexts[key], dismissText: event.target.value } })
                }
                className="rounded-md border border-(--color-muted) px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium">Context delay override (ms, optional)</span>
              <input
                value={contexts[key].contextDelayMs}
                onChange={(event) =>
                  setContexts({
                    ...contexts,
                    [key]: { ...contexts[key], contextDelayMs: event.target.value },
                  })
                }
                className="rounded-md border border-(--color-muted) px-3 py-2"
              />
            </label>
          </div>
        </section>
      ))}

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <button
        type="button"
        disabled={saving}
        className="rounded-md border border-(--color-muted) px-4 py-2 text-sm hover:bg-(--color-muted) disabled:opacity-50"
        onClick={async () => {
          setSaving(true);
          setError(null);

          type ContextPayload = {
            headline: string;
            supportingLine: string;
            ctaLabel: string;
            ctaUrl: string;
            dismissText: string;
            triggerDelayMs?: number;
          };

          const merged: Partial<Record<ExitIntentContextKey, ContextPayload>> = {};
          for (const key of EXIT_INTENT_CONTEXT_KEYS) {
            const block = contexts[key];
            if (!block.headline.trim() || !block.ctaLabel.trim() || !block.ctaUrl.trim()) {
              continue;
            }
            const entry: ContextPayload = {
              headline: block.headline.trim(),
              supportingLine: block.supportingLine.trim(),
              ctaLabel: block.ctaLabel.trim(),
              ctaUrl: block.ctaUrl.trim(),
              dismissText: block.dismissText.trim() || "Not now",
            };
            if (block.contextDelayMs.trim()) {
              const parsed = Number(block.contextDelayMs);
              if (!Number.isNaN(parsed)) {
                entry.triggerDelayMs = parsed;
              }
            }
            merged[key] = entry;
          }

          try {
            const response = await fetch("/api/v1/exit-intent", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                isActive,
                triggerDelayMs: Number(globalDelay),
                contexts: merged,
              }),
            });
            const body = (await response.json().catch(() => ({}))) as {
              error?: string;
              fields?: Record<string, string>;
            };
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
        {saving ? "Saving..." : "Save configuration"}
      </button>

      <ExitIntentModal
        contextKey={previewKey}
        isOpen={previewOpen}
        headline={previewBlock.headline.trim() || "Preview headline"}
        supportingLine={previewBlock.supportingLine}
        ctaLabel={previewBlock.ctaLabel.trim() || "Preview CTA"}
        ctaUrl={previewCtaUrl}
        dismissText={previewBlock.dismissText.trim() || "Not now"}
        reducedMotion={false}
        suppressAnalytics
        onDismiss={() => setPreviewOpen(false)}
      />
    </div>
  );
}
