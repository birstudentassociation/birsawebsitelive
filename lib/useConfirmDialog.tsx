"use client";

/**
 * Promise-based wrapper around `ConfirmDialog`: turns "ask the user yes/no"
 * into a single awaitable call, so a call site can replace
 * `if (!window.confirm(message)) return;` with
 * `if (!(await confirm({ title: message }))) return;` almost verbatim,
 * while getting a focus-trapped, screen-reader-friendly dialog instead of
 * the unstyled, untranslatable browser `confirm()` prompt.
 *
 * There is no global provider: each consumer calls this hook itself and
 * renders the returned `dialog` once in its own JSX, exactly like any other
 * piece of local UI state.
 */
import { useCallback, useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";

export type ConfirmOptions = {
  title: string;
  body?: string;
  danger?: boolean;
};

type PendingConfirm = ConfirmOptions & {
  resolve: (result: boolean) => void;
};

export type UseConfirmDialogLabels = {
  confirmLabel: string;
  cancelLabel: string;
};

export function useConfirmDialog(labels: UseConfirmDialogLabels): {
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
  dialog: React.ReactNode;
} {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setPending({ ...opts, resolve });
    });
  }, []);

  function settle(result: boolean) {
    setPending((current) => {
      current?.resolve(result);
      return null;
    });
  }

  const dialog = (
    <ConfirmDialog
      open={pending !== null}
      title={pending?.title ?? ""}
      body={pending?.body}
      danger={pending?.danger}
      confirmLabel={labels.confirmLabel}
      cancelLabel={labels.cancelLabel}
      onConfirm={() => settle(true)}
      onCancel={() => settle(false)}
    />
  );

  return { confirm, dialog };
}
