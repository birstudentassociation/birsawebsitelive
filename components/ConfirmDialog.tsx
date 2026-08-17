"use client";

/**
 * Accessible confirm/cancel dialog, built on the native `<dialog>` element
 * rather than a hand-rolled modal overlay: `showModal()` gives us a focus
 * trap and top-layer stacking for free, the "cancel" event gives us Escape
 * handling for free, and the `::backdrop` pseudo-element (styled below via
 * Tailwind's `backdrop:` variant) gives us a dimmed background for free.
 * Visibility is fully controlled by the `open` prop; an effect calls
 * `showModal()`/`close()` to keep the native element's state in sync with
 * React's, since `<dialog>` has no declarative "open as modal" attribute.
 */
import { useEffect, useId, useRef } from "react";
import Button from "@/components/Button";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  body?: string;
  confirmLabel: string;
  cancelLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel,
  danger,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        // The native "cancel" event fires on Escape. Prevent the dialog's
        // own close so every dismissal path (Escape, backdrop, Cancel
        // button) routes through `onCancel` the same way.
        event.preventDefault();
        onCancel();
      }}
      onClick={(event) => {
        // A click that lands on the <dialog> element itself (not one of its
        // children) is a click on the ::backdrop area, since the dialog box
        // is sized to its content. Treat it as Cancel.
        if (event.target === dialogRef.current) onCancel();
      }}
      className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-lg border border-line bg-surface p-0 shadow-lg backdrop:bg-ink/50"
    >
      <div className="flex flex-col gap-4 p-6">
        <h2 id={titleId} className="font-display text-lg text-ink">
          {title}
        </h2>
        {body ? <p className="text-sm leading-relaxed text-ink">{body}</p> : null}
        <div className="flex flex-wrap justify-end gap-3 pt-1">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
