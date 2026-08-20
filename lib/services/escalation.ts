/**
 * Escalation (REDESIGN-2.0 §5.1 item 8).
 *
 * "Who the daily cron chases when the standard is at risk"
 * (`defineService.ts`'s own words for `escalateTo`). PURE, NO ROUTE, CRON OR
 * DATABASE COUPLING, same reasoning as `lib/services/queue.ts`: this file
 * decides WHICH open submissions have breached (or are about to breach)
 * their service's `standardHours`, and nothing about how a caller learned
 * about those submissions or what it does once it has the list (email an
 * escalation, raise a console alert). `app/api/cron/daily/route.ts` is not on
 * this wave's owned path list; wiring this into that cron is later work that
 * calls `getSubmissionStore().listByService(...)`
 * (`lib/services/intake.ts`), passes the result here, and acts on what comes
 * back.
 */
import type { ServiceDefinition } from "@/lib/services/defineService";
import type { Submission } from "@/lib/services/intake";

/** Hours between `now` and `submission.createdAt`. Negative is impossible in practice (a submission cannot be created in the future) but not special-cased, since a clock skew of a few seconds either way should never flip a decision either way. */
function hoursSince(createdAt: string, now: Date): number {
  const created = new Date(createdAt).getTime();
  return (now.getTime() - created) / (1000 * 60 * 60);
}

/**
 * Whether a single open submission has breached its service's standard.
 * Closed submissions (`status: "done"`) are never overdue: once
 * `lib/services/queue.ts`'s `applyQueueDecision` has run, the standard has
 * already been met or missed and escalating it further chases nothing.
 */
export function isOverdue(
  submission: Submission,
  definition: ServiceDefinition,
  now: Date = new Date()
): boolean {
  if (submission.status === "done") return false;
  return hoursSince(submission.createdAt, now) >= definition.standardHours;
}

export type EscalationBatch = {
  escalateTo: ServiceDefinition["escalateTo"];
  serviceId: string;
  submissions: Submission[];
};

/**
 * Every open, overdue submission for one service, grouped for its
 * `escalateTo` portfolio. Returns `submissions: []` (never omits the
 * service) when nothing is overdue, so a caller building a daily digest can
 * tell "checked, nothing to escalate" apart from "never checked" without a
 * second lookup.
 */
export function escalationBatch(
  definition: ServiceDefinition,
  submissions: Submission[],
  now: Date = new Date()
): EscalationBatch {
  return {
    escalateTo: definition.escalateTo,
    serviceId: definition.id,
    submissions: submissions.filter((s) => isOverdue(s, definition, now)),
  };
}

/** `escalationBatch` across every service a caller passes in, keeping only the ones that actually have something overdue. What a daily cron job would iterate to build its escalation run. */
export function escalationBatches(
  definitions: ServiceDefinition[],
  submissionsByServiceId: Record<string, Submission[]>,
  now: Date = new Date()
): EscalationBatch[] {
  return definitions
    .map((definition) =>
      escalationBatch(definition, submissionsByServiceId[definition.id] ?? [], now)
    )
    .filter((batch) => batch.submissions.length > 0);
}
