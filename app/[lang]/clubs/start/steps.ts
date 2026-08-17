// Lives outside actions.ts because a "use server" file may only export
// async functions: this constant (and the step type derived from it) is
// plain runtime and type data, not a server action, so it cannot live there.

/**
 * Step order. `clubName` and `members` come first (what the club is, and
 * whether there's already interest) so a reader who doesn't yet have that
 * settled isn't asked to write the full description before finding out;
 * contact details come last, after the substance of the idea.
 */
export const START_CLUB_STEPS = [
  "clubName",
  "members",
  "description",
  "name",
  "email",
  "check",
] as const;
export type StartClubStep = (typeof START_CLUB_STEPS)[number];
