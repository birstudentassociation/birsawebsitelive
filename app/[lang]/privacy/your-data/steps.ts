// Lives outside actions.ts because a "use server" file may only export
// async functions: this constant (and the step type derived from it) is
// plain runtime and type data, not a server action, so it cannot live there.

/**
 * Step order for the `/privacy/your-data` PDPA rights journey. Unlike the
 * contact and start-a-club journeys, the first question does not live at the
 * journey's own root: `/privacy/your-data` is a plain explanatory start page
 * (what the journey is for, that it's free, and the section 30 deadline), so
 * a reader who arrives here understands the request before answering
 * anything. `what` is therefore its own step and URL.
 */
export const RIGHTS_STEPS = ["what", "name", "email", "details", "check"] as const;
export type RightsStep = (typeof RIGHTS_STEPS)[number];
