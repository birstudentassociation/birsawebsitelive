// Lives outside actions.ts because a "use server" file may only export
// async functions: this constant (and the step type derived from it) is
// plain runtime and type data, not a server action, so it cannot live there.

export const LOAN_STEPS = [
  "name",
  "studentId",
  "email",
  "phone",
  "dates",
  "reason",
  "check",
] as const;
export type LoanStep = (typeof LOAN_STEPS)[number];
