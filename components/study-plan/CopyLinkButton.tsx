"use client";

/**
 * A "Copy link" button for the share-with-an-advisor link, which only exists
 * once JavaScript has run.
 *
 * The link itself is ordinary visible text beside it, so a reader without
 * JavaScript, or in a browser that refuses clipboard access, selects and
 * copies it by hand. This button renders nothing until the page has hydrated
 * and the Clipboard API is present, so nobody is offered a control that
 * cannot work. A failed copy says so and points back at the text.
 */
import { useState, useSyncExternalStore } from "react";
import Button from "@/components/Button";

export type CopyLinkButtonProps = {
  /** The text to copy: the whole link. */
  link: string;
  label: string;
  copiedLabel: string;
  failedLabel: string;
};

function subscribe(): () => void {
  return () => {};
}

function getSnapshot(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.clipboard?.writeText === "function";
}

function getServerSnapshot(): boolean {
  return false;
}

export default function CopyLinkButton({
  link,
  label,
  copiedLabel,
  failedLabel,
}: CopyLinkButtonProps) {
  const available = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [outcome, setOutcome] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setOutcome("copied");
    } catch {
      setOutcome("failed");
    }
  }

  if (!available) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="button" variant="secondary" onClick={copy}>
        {label}
      </Button>
      <span role="status" className="text-sm text-muted">
        {outcome === "copied" ? copiedLabel : outcome === "failed" ? failedLabel : ""}
      </span>
    </div>
  );
}
