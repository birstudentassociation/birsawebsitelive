/**
 * When elective demand may be shown on a course page, and how.
 *
 * Counts are small by nature (a few dozen students plan an elective) and an
 * exact figure invites reading too much into it, so the public page states a
 * band and never a number: "Planned by 20 or more students for <term>". It is
 * shown only once the count reaches the threshold, and only for a term that
 * has not ended. Pure functions, with `now` a parameter, so the rule is
 * testable without a clock or a database.
 *
 * The count is not a head count. One browser sends once a term and one
 * network can send only a few times in ten minutes, but BIRSA holds nothing
 * that identifies a sender, so a determined person could send more. That is
 * why the page says "or more" and why the figure is an indication to the
 * programme office rather than a register.
 */
import type { AcademicTerm } from "@/content/course-review/types";
import { currentTerm } from "@/lib/course-review/terms";
import { termOrder } from "@/lib/elective-demand/terms";

/** How many students must have planned a course for a term before a course page says so. */
export const DEMAND_THRESHOLD = 20;

/** Whether a count is enough to publish. */
export function meetsDemandThreshold(count: number): boolean {
  return Number.isFinite(count) && count >= DEMAND_THRESHOLD;
}

/** A term and how many students planned a course for it. */
export type TermDemand = { term: AcademicTerm; students: number };

/**
 * The terms a course page may name: those at or above the threshold that have
 * not yet ended, earliest first. Returns the terms only, so the count cannot
 * reach the page.
 */
export function publishableTerms(demand: readonly TermDemand[], now: Date): AcademicTerm[] {
  const first = termOrder(currentTerm(now));
  return demand
    .filter((entry) => meetsDemandThreshold(entry.students) && termOrder(entry.term) >= first)
    .map((entry) => entry.term)
    .sort((a, b) => termOrder(a) - termOrder(b));
}
