"use client";

/**
 * Photo picker + uploader for inventory items. Uploads go to
 * `/api/inventory/upload` (which stores the file in Vercel Blob) and report
 * the resulting URL back to the caller via `onUploaded`; the caller is
 * responsible for persisting that URL (e.g. PATCHing the item).
 */
import { useId, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import Button from "@/components/Button";

export type PhotoUploadLabels = {
  upload: string;
  uploading: string;
  remove: string;
  hint: string;
  tooLarge: string;
  notConfigured: string;
  error: string;
  /**
   * Accessible name for the current-photo preview image, e.g. "Photo of
   * <item name>" (in the active locale). Required: the preview conveys the
   * item's appearance, so it must have descriptive alt text (WCAG 1.1.1),
   * never the upload verb.
   */
  photoAlt: string;
};

export type PhotoUploadProps = {
  currentUrl: string | null;
  onUploaded: (url: string) => void;
  labels: PhotoUploadLabels;
};

type UploadResponse = { ok: boolean; url?: string; reason?: string };

export default function PhotoUpload({ currentUrl, onUploaded, labels }: PhotoUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; kind: "success" | "error" } | null>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setMessage(null);
  }

  function handleRemoveSelection() {
    setSelectedFile(null);
    setMessage(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function handleUpload() {
    if (!selectedFile) {
      return;
    }
    setUploading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.set("file", selectedFile);
      const response = await fetch("/api/inventory/upload", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json().catch(() => null)) as UploadResponse | null;

      if (response.ok && result?.ok && result.url) {
        onUploaded(result.url);
        setSelectedFile(null);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        return;
      }

      if (result?.reason === "not-configured") {
        setMessage({ text: labels.notConfigured, kind: "error" });
      } else if (result?.reason === "too-large") {
        setMessage({ text: labels.tooLarge, kind: "error" });
      } else if (response.status >= 500) {
        setMessage({ text: labels.error, kind: "error" });
      } else {
        setMessage({ text: labels.error, kind: "error" });
      }
    } catch {
      setMessage({ text: labels.error, kind: "error" });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {currentUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentUrl}
          alt={labels.photoAlt}
          className="border-line max-h-48 w-auto rounded-lg border object-contain"
        />
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-ink text-sm font-semibold">
          {labels.upload}
        </label>
        <p className="text-muted text-sm">{labels.hint}</p>
        <input
          ref={inputRef}
          id={inputId}
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          onChange={handleFileChange}
          className="focus-halo border-input-border bg-surface text-ink w-full rounded-md border px-3.5 py-2.5 text-[0.95rem]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={handleUpload} disabled={!selectedFile || uploading}>
          {uploading ? labels.uploading : labels.upload}
        </Button>
        {uploading ? (
          <span role="status" className="sr-only">
            {labels.uploading}
          </span>
        ) : null}
        {selectedFile ? (
          <Button
            type="button"
            variant="ghost"
            onClick={handleRemoveSelection}
            disabled={uploading}
          >
            {labels.remove}
          </Button>
        ) : null}
      </div>

      {message ? (
        // Success/progress uses role="status" (polite, implicit live
        // region); errors use role="alert" (assertive), same pattern as
        // OfficerLogin's error handling (WCAG 4.1.3 Status Messages).
        <p
          role={message.kind === "success" ? "status" : "alert"}
          className={
            message.kind === "success"
              ? "text-success text-sm font-medium"
              : "text-error text-sm font-medium"
          }
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
