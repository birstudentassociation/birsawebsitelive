/**
 * Vercel Blob helper for item photo uploads.
 *
 * Guarded against a missing `BLOB_READ_WRITE_TOKEN` the same way the rest of
 * the inventory suite is guarded against a missing `POSTGRES_URL`: callers
 * get an explicit `{ ok: false, reason: "not-configured" }` rather than a
 * thrown error, so the site stays buildable and usable with zero
 * environment configuration.
 */
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";

const MAX_BYTES = 5 * 1024 * 1024;

export function isBlobConfigured(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

/** Strips characters that are awkward in a blob pathname, keeping the upload's original name readable. */
function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function uploadImage(
  file: File,
  keyPrefix: string
): Promise<
  | { ok: true; url: string }
  | { ok: false; reason: "not-configured" | "invalid" | "too-large" | "error" }
> {
  if (!isBlobConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  if (!file.type.startsWith("image/")) {
    return { ok: false, reason: "invalid" };
  }

  if (file.size > MAX_BYTES) {
    return { ok: false, reason: "too-large" };
  }

  try {
    const safeName = sanitizeFileName(file.name || "photo");
    const pathname = `${keyPrefix}/${randomUUID()}-${safeName}`;
    const blob = await put(pathname, file, { access: "public" });
    return { ok: true, url: blob.url };
  } catch {
    return { ok: false, reason: "error" };
  }
}
