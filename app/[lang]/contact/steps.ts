// Lives outside actions.ts because a "use server" file may only export
// async functions: this constant (and the step type derived from it) is
// plain runtime and type data, not a server action, so it cannot live there.

/** Step order, used both for the "Step X of Y" indicator and for redirect-to-first-problem. */
export const CONTACT_STEPS = ["category", "subject", "message", "name", "email", "check"] as const;
export type ContactStep = (typeof CONTACT_STEPS)[number];
