// Lives outside actions.ts because a "use server" file may only export
// async functions: this constant (and the step type derived from it) is
// plain runtime and type data, not a server action, so it cannot live there.

export const LOAN_STATUS_STEPS = ["reference", "email"] as const;
export type LoanStatusStep = (typeof LOAN_STATUS_STEPS)[number];
