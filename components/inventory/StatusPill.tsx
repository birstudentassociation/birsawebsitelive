import clsx from "clsx";
import type { LoanStatus } from "@/lib/inventory/types";

/**
 * Small coloured pill for a loan's lifecycle status. Single source of truth
 * for status colours: shared by the officer console (LoanQueue,
 * BorrowerDetail) and the public loan-status lookup (StatusLookup), so a
 * given status always reads the same colour everywhere.
 * Colour never travels alone: the status word is always shown alongside it.
 */
const STATUS_STYLES: Record<LoanStatus, string> = {
  pending: "bg-warning-tint text-warning",
  approved: "bg-info-tint text-info",
  checked_out: "bg-forest-tint text-forest",
  overdue: "bg-error-tint text-error",
  returned: "bg-success-tint text-success",
  rejected: "bg-error-tint text-error",
  cancelled: "bg-sunken text-muted",
  no_show: "bg-sunken text-muted",
};

export default function StatusPill({ status, label }: { status: LoanStatus; label: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
        STATUS_STYLES[status]
      )}
    >
      {label}
    </span>
  );
}
