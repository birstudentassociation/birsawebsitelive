/**
 * The officer queue (REDESIGN-2.0 §5.1 item 6).
 *
 * PURE, NO ROUTE OR DATABASE COUPLING, ON PURPOSE (Wave 4A brief item 5).
 * Every function here takes a `Submission[]` the caller already has and
 * returns a derived view or a decision; none of them fetch, none of them
 * write, none of them know `lib/inventory/auth.ts` or a route exists.
 * Wave 4C lifts the officer console and is the one that will call
 * `getSubmissionStore().listByService(...)` (`lib/services/intake.ts`),
 * check the signed-in officer's portfolio against `lib/inventory/auth.ts`,
 * and pass the result through these functions. Keeping the boundary here
 * means Wave 4C can build the console against this file today without
 * waiting on how officer sessions are threaded through a Server Component,
 * and this file never has to change when that wiring does.
 *
 * "SCOPED TO THE PORTFOLIO THAT OWNS THE SERVICE" (§5.1 item 6): a service's
 * queue belongs to `definition.owner`, so `scopeQueueToOwner` (an officer in
 * a portfolio sees only their own portfolio's services) is the actual access
 * boundary; whether a given officer HOLDS that portfolio is
 * `lib/inventory/auth.ts`'s job, not this file's, and this module never
 * imports that file.
 */
import type { PortfolioId } from "@/lib/portfolios";
import type { ServiceDefinition } from "@/lib/services/defineService";
import type { Submission, SubmissionStatus } from "@/lib/services/intake";

export type QueueDecision = "approve" | "reject";

/**
 * Whether `portfolio` may see `definition`'s queue. `secondHolder` is
 * included deliberately: §7.2's two-person rule exists so a portfolio is
 * never held by, or answerable to, exactly one person, and a queue only the
 * primary owner can see is a queue the second holder cannot cover if the
 * owner is unavailable.
 */
export function scopeQueueToPortfolio(
  definitions: ServiceDefinition[],
  portfolio: PortfolioId
): ServiceDefinition[] {
  return definitions.filter((d) => d.owner === portfolio || d.secondHolder === portfolio);
}

/** `submissions` still open (not `"done"`), oldest first, so an officer works the longest-waiting request first by default. */
export function openQueueItems(submissions: Submission[]): Submission[] {
  return submissions
    .filter((s) => s.status !== "done")
    .slice()
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

/**
 * Applies a decision to one submission, returning a new `Submission` (never
 * mutates its argument, so a caller holding the old array in state does not
 * see it change out from under it). `"approve"` and `"reject"` both close the
 * item: REDESIGN-2.0 names no in-between state for a chassis decision beyond
 * "received" while it waits, so both a yes and a no are the same "done, and
 * the retention clock can start" transition, and `retentionTrigger: "closed"`
 * services (`defineService.ts`) rely on `closedAt` being set here rather than
 * left `null`.
 */
export function applyQueueDecision(
  submission: Submission,
  decision: QueueDecision,
  now: Date = new Date()
): Submission {
  const status: SubmissionStatus = "done";
  void decision; // Recorded by the caller (Wave 4C's console) alongside its own audit log; this module only knows "open" versus "closed", not why.
  return { ...submission, status, closedAt: now.toISOString() };
}

/** Marks a submission as being actively worked, distinct from merely "received" and waiting. Purely a display state: `openQueueItems` still returns it, since "in progress" is still open. */
export function markInProgress(submission: Submission): Submission {
  return { ...submission, status: "in-progress" };
}
