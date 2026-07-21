// @vitest-environment jsdom
/**
 * Unit tests for `ConfirmDialog` and `useConfirmDialog`: check that the
 * dialog exposes an accessible name via `aria-labelledby`, that the
 * Confirm/Cancel buttons invoke the right callbacks, and that the rendered
 * markup has no axe violations.
 *
 * jsdom (pinned version here) reflects `<dialog>`'s `open` attribute but
 * does not implement `HTMLDialogElement.prototype.showModal()`/`.close()`
 * (there's no real top-layer, focus trap, or `::backdrop` in a DOM without
 * layout anyway, and jsdom's own HTMLDialogElement-impl.js is a bare
 * subclass of HTMLElement with none of those methods defined). Both are
 * polyfilled below with the minimal behaviour `ConfirmDialog`'s effect
 * depends on: toggling the `open` attribute so `dialog.open` reflects it.
 * Real-browser modal behaviour (focus trap, Escape, backdrop) is out of
 * scope for jsdom and would need a Playwright/e2e check instead.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import axe from "axe-core";

import ConfirmDialog from "@/components/ConfirmDialog";
import { useConfirmDialog } from "@/lib/useConfirmDialog";

const AXE_OPTIONS: Parameters<typeof axe.run>[1] = {
  runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
  rules: { "color-contrast": { enabled: false } },
};

beforeAll(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      this.removeAttribute("open");
    };
  }
});

afterEach(() => {
  cleanup();
});

describe("ConfirmDialog", () => {
  it("has an accessible name and no axe violations when open", async () => {
    const { container } = render(
      <ConfirmDialog
        open
        title="Deactivate Officer One?"
        body="They will no longer be able to sign in."
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );

    const dialog = container.querySelector("dialog");
    expect(dialog).not.toBeNull();
    const labelledById = dialog!.getAttribute("aria-labelledby");
    expect(labelledById).toBeTruthy();
    expect(document.getElementById(labelledById!)?.textContent).toBe("Deactivate Officer One?");

    const results = await axe.run(container, AXE_OPTIONS);
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  it("calls onConfirm when the confirm button is clicked", () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        open
        title="Retire this item?"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("calls onCancel when the cancel button is clicked", () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        open
        title="Retire this item?"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("renders a danger-styled confirm button when danger is set", () => {
    render(
      <ConfirmDialog
        open
        title="Retire this item?"
        danger
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    expect(confirmButton.className).toContain("bg-brand-strong");
  });
});

/**
 * A small host component, rather than calling `renderHook` + a manual
 * `render` of `result.current.dialog`, so the hook and its returned
 * `dialog` re-render together exactly as a real consumer would use them
 * (`useConfirmDialog` explicitly has no provider: each caller renders
 * `{dialog}` inline in its own tree).
 */
function ConfirmHarness({
  onPending,
}: {
  onPending: (pending: Promise<boolean>) => void;
}) {
  const { confirm, dialog } = useConfirmDialog({ confirmLabel: "Confirm", cancelLabel: "Cancel" });
  return (
    <>
      <button
        type="button"
        onClick={() => onPending(confirm({ title: "Blocklist this borrower?" }))}
      >
        Ask
      </button>
      {dialog}
    </>
  );
}

describe("useConfirmDialog", () => {
  it("resolves true when the dialog's confirm button is clicked", async () => {
    let pending: Promise<boolean> | undefined;
    render(<ConfirmHarness onPending={(p) => (pending = p)} />);

    fireEvent.click(screen.getByRole("button", { name: "Ask" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await expect(pending).resolves.toBe(true);
  });

  it("resolves false when the dialog's cancel button is clicked", async () => {
    let pending: Promise<boolean> | undefined;
    render(<ConfirmHarness onPending={(p) => (pending = p)} />);

    fireEvent.click(screen.getByRole("button", { name: "Ask" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await expect(pending).resolves.toBe(false);
  });
});
