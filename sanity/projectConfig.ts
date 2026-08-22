/**
 * The Sanity project this site reads from and writes to.
 *
 * FROZEN CONTRACT. Wave 3 agents read these; none of them changes the values.
 *
 * The project id is not a secret. It appears in the URL of every published
 * asset and in the client bundle of any page that queries Sanity, so it lives
 * in code where it can be read next to what uses it, rather than in an
 * environment variable that only pretends to hide it. The write TOKEN is a
 * secret and is never in this file or any other.
 */
export const SANITY_PROJECT_ID = "vbo54y9j";
export const SANITY_DATASET = "production";

/**
 * The API version pins the query language and response shape. Sanity dates
 * these deliberately so an upgrade is a decision rather than something that
 * happens to a site overnight. Move it on purpose, with the release notes open.
 */
export const SANITY_API_VERSION = "2024-10-01";

/**
 * WHICH PLAN THIS RUNS ON, AND WHAT THAT COSTS, because the two limits below
 * are invisible until they bite and both break something the plan promised.
 *
 * The operator has knowingly accepted the FREE plan (DECISIONS-2.0.md gate 1).
 * REDESIGN-2.0.md section 6.11 called that the one indefensible answer, so the
 * consequences are recorded where the code lives, not only in a document:
 *
 *   1. ADMIN AND VIEWER ROLES ONLY. Every officer who can edit anything is an
 *      administrator of everything. Section 7.1's permission model does not
 *      exist here, and section 7.2's two person rule degrades into twenty
 *      administrators. Nothing in this codebase can enforce what the plan does
 *      not offer, so `/officer/access` and its drift cron are the only place
 *      the real access picture is visible. That makes them more important on
 *      this plan, not less.
 *
 *   2. THREE DAY HISTORY RETENTION. Section 6.5's "revert, one click, no
 *      developer" is true for three days. An officer's mistake from last week
 *      is a developer's problem again, and the officer has no way of knowing
 *      that from inside the Studio unless something tells them.
 *
 * Neither is a reason to avoid Sanity. Both are reasons to know.
 */
export const SANITY_PLAN = "free" as const;

/**
 * Days of document history the plan retains. Read by anything that tells an
 * officer what they can still undo, so the interface never offers a revert the
 * plan cannot honour.
 */
export const SANITY_HISTORY_RETENTION_DAYS = 3;
