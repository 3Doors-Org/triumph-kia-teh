"use client";

import { useState } from "react";

type UploadState = {
  progress: number;
  status: "idle" | "uploading" | "confirming" | "done" | "error";
  message?: string;
};

export function AssetsUploadPanel() {
  const [state, setState] = useState<UploadState>({ progress: 0, status: "idle" });

  return (
    <form
      className="space-y-3 rounded-md border border-[var(--color-muted)] p-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const file = form.get("file");
        const altText = String(form.get("altText") ?? "").trim();
        if (!(file instanceof File)) {
          setState({ progress: 0, status: "error", message: "Select a file first." });
          return;
        }

        try {
          setState({ progress: 0, status: "uploading" });
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
            setState({ progress, status: "uploading" }),
          );

          setState({ progress: 100, status: "confirming" });
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
          setState({ progress: 100, status: "done", message: "Upload complete. Refresh list to view asset." });
        } catch (error) {
          setState({
            progress: 0,
            status: "error",
            message: error instanceof Error ? error.message : "Upload failed",
          });
        }
      }}
    >
      <h2 className="text-lg font-semibold">Upload Asset</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">File</span>
          <input
            name="file"
            type="file"
            required
            className="rounded-md border border-[var(--color-muted)] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Alt text (required for images)</span>
          <input
            name="altText"
            placeholder="Describe the image for accessibility"
            className="rounded-md border border-[var(--color-muted)] px-3 py-2"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={state.status === "uploading" || state.status === "confirming"}
        className="rounded-md border border-[var(--color-muted)] px-4 py-2 text-sm hover:bg-[var(--color-muted)] disabled:opacity-50"
      >
        {state.status === "uploading" ? "Uploading..." : state.status === "confirming" ? "Confirming..." : "Upload"}
      </button>
      {state.status === "uploading" || state.status === "confirming" || state.status === "done" ? (
        <p className="text-sm text-[var(--color-muted-fg)]">Progress: {Math.round(state.progress)}%</p>
      ) : null}
      {state.message ? (
        <p
          className={`text-sm ${state.status === "error" ? "text-red-600" : "text-[var(--color-muted-fg)]"}`}
          role={state.status === "error" ? "alert" : undefined}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function uploadFileWithProgress(url: string, file: File, onProgress: (progress: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", url);
    request.setRequestHeader("Content-Type", file.type);
    request.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress((event.loaded / event.total) * 100);
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        resolve();
      } else {
        reject(new Error("Direct upload failed"));
      }
    };
    request.onerror = () => reject(new Error("Network error during upload"));
    request.send(file);
  });
}
