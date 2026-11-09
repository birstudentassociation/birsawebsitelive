export const LOAN_STATUSES = [
  "pending",
  "approved",
  "checked_out",
  "overdue",
  "returned",
  "rejected",
  "cancelled",
  "no_show",
] as const;

export type LoanStatus = (typeof LOAN_STATUSES)[number];

export const OPEN_LOAN_STATUSES = [
  "pending",
  "approved",
  "checked_out",
  "overdue",
] as const satisfies readonly LoanStatus[];

/**
 * `loans.status` values that mean the loan is over (db/migrations/005_loans.sql's
 * check constraint has eight statuses; these four are the terminal ones).
 * An open loan (pending, approved, checked_out, overdue) is never purged, no
 * matter how old it is: that is the single most important correctness
 * property of lib/privacy/retention.ts. `no_show` is included even though nothing in
 * lib/inventory/loans.ts currently transitions a loan to it: it is still a
 * real status with user-facing copy
 * (app/[lang]/services/equipment-loan/status/statusLookupCopy.ts), and
 * BIRSA's retention decision was two years for every category of personal
 * data, with no silent exception for a status nobody happens to set yet.
 */
export const CLOSED_LOAN_STATUSES = [
  "returned",
  "rejected",
  "cancelled",
  "no_show",
] as const satisfies readonly LoanStatus[];

export const UNIT_HOLDING_LOAN_STATUSES = [
  "approved",
  "checked_out",
  "overdue",
] as const satisfies readonly LoanStatus[];

export const ON_LOAN_STATUSES = ["checked_out", "overdue"] as const satisfies readonly LoanStatus[];

export const LOAN_TRANSITIONS = {
  approve: { from: ["pending"], to: "approved" },
  reject: { from: ["pending"], to: "rejected" },
  checkout: { from: ["approved"], to: "checked_out" },
  markOverdue: { from: ["checked_out"], to: "overdue" },
  checkin: { from: ON_LOAN_STATUSES, to: "returned" },
  cancel: { from: ["pending", "approved"], to: "cancelled" },
  borrowerCancel: { from: ["pending"], to: "cancelled" },
} as const satisfies Record<string, { from: readonly LoanStatus[]; to: LoanStatus }>;

export type LoanAction = keyof typeof LOAN_TRANSITIONS;

export function isLoanStatus(value: string): value is LoanStatus {
  return (LOAN_STATUSES as readonly string[]).includes(value);
}

export function canTransition(status: LoanStatus, action: LoanAction): boolean {
  return (LOAN_TRANSITIONS[action].from as readonly LoanStatus[]).includes(status);
}

export function isClosedLoanStatus(status: string): boolean {
  return (CLOSED_LOAN_STATUSES as readonly string[]).includes(status);
}

export function sqlStatusList(statuses: readonly LoanStatus[]): string {
  return statuses.map((status) => `'${status}'`).join(", ");
}

export function transitionFromSql(action: LoanAction): string {
  return sqlStatusList(LOAN_TRANSITIONS[action].from);
}
