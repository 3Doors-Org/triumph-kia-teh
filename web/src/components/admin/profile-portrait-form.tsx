"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type State =
  | { status: "idle" }
  | { status: "uploading"; progress: number }
  | { status: "confirming" }
  | { status: "saving" }
  | { status: "done"; message: string }
  | { status: "error"; message: string };

function uploadFileWithProgress(url: string, file: File, onProgress: (n: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", url);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) resolve();
      else reject(new Error("Direct upload failed"));
    };
    request.onerror = () => reject(new Error("Network error during upload"));
    request.send(file);
  });
}

export function ProfilePortraitForm({
  initialPortraitUrl,
  ownerDisplayName,
}: {
  initialPortraitUrl: string | null;
  ownerDisplayName: string;
}) {
  const router = useRouter();
  const [portraitUrl, setPortraitUrl] = useState<string | null>(initialPortraitUrl);
  const [state, setState] = useState<State>({ status: "idle" });

  const initials = ownerDisplayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "TK";

  async function persistUrl(url: string | null) {
    setState({ status: "saving" });
    const res = await fetch("/api/v1/site-profile", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ portraitPublicUrl: url }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string; fields?: Record<string, string> };
      const msg =
        body.fields?.portraitPublicUrl ?? body.error ?? "Failed to save portrait URL";
      throw new Error(msg);
    }
    setPortraitUrl(url);
    setState({ status: "done", message: "Saved. The home page will show this portrait." });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="flex w-48 flex-col items-center rounded-2xl border border-[var(--color-muted)] bg-[var(--color-muted)]/40 p-6">
          {portraitUrl ? (
            <img
              src={portraitUrl}
              alt={ownerDisplayName}
              className="h-32 w-32 rounded-full border-2 border-[var(--color-accent)]/50 object-cover"
              width={128}
              height={128}
            />
          ) : (
            <div
              className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-[var(--color-muted)] bg-[var(--color-card)]"
              role="img"
              aria-label={`${ownerDisplayName} placeholder`}
            >
              <span className="font-[var(--font-display)] text-3xl font-semibold text-[var(--color-accent)]">
                {initials}
              </span>
            </div>
          )}
          <p className="mt-3 text-center text-xs text-[var(--color-muted-fg)]">Home hero preview</p>
        </div>
        <div className="min-w-0 flex-1 space-y-2 text-sm text-[var(--color-muted-fg)]">
          <p>
            Upload a square or portrait-oriented image (JPEG, PNG, or WebP). After upload, the public URL is saved
            automatically and the home page updates.
          </p>
          <p>
            Tip: you can also paste a URL from{" "}
            <a className="font-medium text-[var(--color-accent)] hover:underline" href="/admin/assets">
              Assets
            </a>{" "}
            after uploading there.
          </p>
        </div>
      </div>

      <form
        className="space-y-4 rounded-md border border-[var(--color-muted)] p-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setState({ status: "idle" });
          const form = new FormData(event.currentTarget);
          const file = form.get("file");
          const altText = String(form.get("altText") ?? "").trim();
          if (!(file instanceof File) || file.size === 0) {
            setState({ status: "error", message: "Choose an image file to upload." });
            return;
          }
          if (!file.type.startsWith("image/")) {
            setState({ status: "error", message: "Only image files are allowed." });
            return;
          }
          if (altText.length < 3) {
            setState({ status: "error", message: "Alt text must be at least 3 characters (accessibility)." });
            return;
          }

          try {
            setState({ status: "uploading", progress: 0 });
            const initResponse = await fetch("/api/v1/assets/upload-url", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                filename: file.name,
                mimeType: file.type,
                fileSizeBytes: file.size,
              }),
            });
            if (!initResponse.ok) {
              const body = (await initResponse.json().catch(() => ({}))) as { error?: string };
              throw new Error(body.error ?? "Failed to initiate upload");
            }
            const initBody = (await initResponse.json()) as {
              uploadUrl: string;
              storageKey: string;
              assetId: string;
            };

            await uploadFileWithProgress(initBody.uploadUrl, file, (progress) =>
              setState({ status: "uploading", progress }),
            );

            setState({ status: "confirming" });
            const confirmResponse = await fetch("/api/v1/assets/confirm", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                assetId: initBody.assetId,
                storageKey: initBody.storageKey,
                altText,
              }),
            });
            if (!confirmResponse.ok) {
              const body = (await confirmResponse.json().catch(() => ({}))) as { error?: string };
              throw new Error(body.error ?? "Failed to confirm upload");
            }
            const confirmed = (await confirmResponse.json()) as { publicUrl: string };
            await persistUrl(confirmed.publicUrl);
          } catch (error) {
            setState({
              status: "error",
              message: error instanceof Error ? error.message : "Upload failed",
            });
          }
        }}
      >
        <h2 className="text-lg font-semibold">Upload new portrait</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span className="font-medium">Image file</span>
            <input
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="rounded-md border border-[var(--color-muted)] px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium">Alt text</span>
            <input
              name="altText"
              placeholder={`e.g. ${ownerDisplayName}, portrait`}
              defaultValue={`${ownerDisplayName}, portrait`}
              className="rounded-md border border-[var(--color-muted)] px-3 py-2"
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={
              state.status === "uploading" ||
              state.status === "confirming" ||
              state.status === "saving"
            }
            className="rounded-md border border-[var(--color-muted)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-muted)] disabled:opacity-50"
          >
            {state.status === "uploading"
              ? `Uploading… ${state.progress}%`
              : state.status === "confirming" || state.status === "saving"
                ? "Saving…"
                : "Upload and set as portrait"}
          </button>
        </div>
      </form>

      <form
        className="space-y-2 rounded-md border border-[var(--color-muted)] p-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setState({ status: "idle" });
          const form = new FormData(event.currentTarget);
          const url = String(form.get("url") ?? "").trim();
          if (!url) {
            setState({ status: "error", message: "Paste a public image URL." });
            return;
          }
          try {
            await persistUrl(url);
          } catch (error) {
            setState({
              status: "error",
              message: error instanceof Error ? error.message : "Save failed",
            });
          }
        }}
      >
        <h2 className="text-lg font-semibold">Or paste image URL</h2>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Public URL (https)</span>
          <input
            name="url"
            type="url"
            placeholder="https://…"
            className="max-w-xl rounded-md border border-[var(--color-muted)] px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={state.status === "saving"}
          className="rounded-md border border-[var(--color-muted)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-muted)] disabled:opacity-50"
        >
          Save URL
        </button>
      </form>

      <div className="rounded-md border border-[var(--color-muted)] p-4">
        <h2 className="text-lg font-semibold">Remove portrait</h2>
        <p className="mt-1 text-sm text-[var(--color-muted-fg)]">
          Clears the public image and restores the initials placeholder on the home page.
        </p>
        <button
          type="button"
          disabled={!portraitUrl || state.status === "saving"}
          className="mt-3 rounded-md border border-[var(--color-destructive)]/40 px-4 py-2 text-sm font-medium text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10 disabled:opacity-40"
          onClick={async () => {
            try {
              await persistUrl(null);
            } catch (error) {
              setState({
                status: "error",
                message: error instanceof Error ? error.message : "Remove failed",
              });
            }
          }}
        >
          Remove portrait
        </button>
      </div>

      {state.status === "done" ? (
        <p className="text-sm font-medium text-green-700">{state.message}</p>
      ) : null}
      {state.status === "error" ? <p className="text-sm font-medium text-[var(--color-destructive)]">{state.message}</p> : null}
    </div>
  );
}
