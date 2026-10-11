/**
 * "What if": the plan with one thing changed, and what that does to the term
 * the student graduates in.
 *
 * Two changes are modelled. A course moved one term later, and a term left
 * empty (an exchange or a leave, say). In both, only the displaced courses
 * move, and then anything that depended on a moved course is pushed to the
 * first term after it, repeatedly, until every prerequisite that moved is
 * again satisfied by an earlier term. Prerequisites that were already broken
 * before the change are left alone: `checkPlan` reports those, and a what-if
 * should show the cost of the change, not repair the plan.
 *
 * Two things are deliberately not modelled. Credit limits do not move
 * anything: a term that would exceed its limit is reported in `overloaded`
 * and the graduation term assumes the student could carry it. And nothing is
 * re-planned, so the result is the least a change costs, not what a careful
 * student would end up doing.
 *
 * "One term later" means the next semester for a course in a semester, and
 * the next summer for a course in a summer, because a summer holds the
 * internship and little else, and a semester course has no reason to land
 * there. Pure functions over the plan and the course graph; the input plan is
 * never mutated.
 */
import type { CurriculumVersion, TermRef } from "@/content/curriculum";
import { prerequisites, recommendedIn, unlocks } from "@/lib/courses/graph";
import { projectedGraduation, termIndex } from "@/lib/study-plan/derive";
import type { PlannedCourseTerm, StudyPlan } from "@/lib/study-plan/plan";

export type PlanChange =
  /** Move one planned course one term later. */
  | { kind: "deferCourse"; code: string }
  /** Take every course (and free elective credit) out of a term, moving each one term later. */
  | { kind: "emptyTerm"; term: TermRef };

export type PushedBack = {
  code: string;
  from: TermRef;
  to: TermRef;
  /** `moved` was displaced by the change itself, `dependent` was pushed because a prerequisite moved. */
  reason: "moved" | "dependent";
};

export type OverloadedTerm = { term: TermRef; credits: number; limit: number };

export type WhatIfResult = {
  change: PlanChange;
  /** False when the change named a course or term the plan does not have, so nothing moved. */
  applied: boolean;
  /** The plan with the change made. The same plan, unchanged, when `applied` is false. */
  plan: StudyPlan;
  graduationBefore: TermRef | null;
  graduationAfter: TermRef | null;
  graduationMoved: boolean;
  /** The moved courses first, then those pushed by them, each group in term order. */
  pushedBack: PushedBack[];
  /** Terms that go over their credit limit because of the change, and were not over it before. */
  overloaded: OverloadedTerm[];
};

/** One term later: the next semester, or for a summer the next summer. Not capped at year 8. */
export function laterTerm(term: TermRef): TermRef {
  if (term.kind === "summer") return { year: term.year + 1, kind: "summer" };
  if (term.kind === "semester1") return { year: term.year, kind: "semester2" };
  return { year: term.year + 1, kind: "semester1" };
}

function sameTerm(a: TermRef, b: TermRef): boolean {
  return termIndex(a) === termIndex(b);
}

/** Credits in each of a plan's terms, courses by the version's catalogue plus free elective credits. */
function termCredits(version: CurriculumVersion, term: PlannedCourseTerm): number {
  const byCode = new Map(version.courses.value.map((c) => [c.code, c]));
  return (
    term.codes.reduce((n, code) => n + (byCode.get(code)?.credits ?? 0), 0) +
    term.freeElectiveCredits
  );
}

function overloadedTerms(version: CurriculumVersion, plan: StudyPlan): Map<number, OverloadedTerm> {
  const rules = version.rules.value;
  const over = new Map<number, OverloadedTerm>();
  for (const term of plan.terms) {
    const limit =
      term.term.kind === "summer" ? rules.maxCreditsSummerTerm : rules.maxCreditsRegularTerm;
    const credits = termCredits(version, term);
    if (credits > limit) over.set(termIndex(term.term), { term: term.term, credits, limit });
  }
  return over;
}

/** Each planned course's term, in plan order. A course in two terms keeps the first. */
function plannedTerms(plan: StudyPlan): Map<string, TermRef> {
  const where = new Map<string, TermRef>();
  for (const term of plan.terms) {
    for (const code of term.codes) if (!where.has(code)) where.set(code, term.term);
  }
  return where;
}

function unchanged(plan: StudyPlan, change: PlanChange): WhatIfResult {
  const graduation = projectedGraduation(plan);
  return {
    change,
    applied: false,
    plan,
    graduationBefore: graduation,
    graduationAfter: graduation,
    graduationMoved: false,
    pushedBack: [],
    overloaded: [],
  };
}

/** Runs a change against a plan and reports what it costs. */
export function whatIf(
  version: CurriculumVersion,
  plan: StudyPlan,
  change: PlanChange
): WhatIfResult {
  const before = plannedTerms(plan);
  const after = new Map(before);
  const moved = new Set<string>();
  const freeElectiveMoves: { from: TermRef; to: TermRef; credits: number }[] = [];

  if (change.kind === "deferCourse") {
    const from = before.get(change.code);
    if (!from) return unchanged(plan, change);
    after.set(change.code, laterTerm(from));
    moved.add(change.code);
  } else {
    const entry = plan.terms.find((t) => sameTerm(t.term, change.term));
    if (!entry || (entry.codes.length === 0 && entry.freeElectiveCredits === 0)) {
      return unchanged(plan, change);
    }
    for (const code of entry.codes) {
      after.set(code, laterTerm(change.term));
      moved.add(code);
    }
    if (entry.freeElectiveCredits > 0) {
      freeElectiveMoves.push({
        from: change.term,
        to: laterTerm(change.term),
        credits: entry.freeElectiveCredits,
      });
    }
  }

  // Push dependents of anything that moved past it. Each pass can only move a
  // course later, and there are finitely many courses and terms in range, so
  // this settles; the pass cap is a guard against a cycle in bad data.
  const dependents = new Set<string>();
  const passes = after.size + 1;
  for (let pass = 0; pass < passes; pass += 1) {
    let changed = false;
    for (const code of [...after.keys()]) {
      for (const prerequisite of prerequisites(code, version.id)) {
        if (!moved.has(prerequisite) && !dependents.has(prerequisite)) continue;
        const needed = after.get(prerequisite);
        const term = after.get(code)!;
        if (!needed || termIndex(term) > termIndex(needed)) continue;
        let target = term;
        while (termIndex(target) <= termIndex(needed)) target = laterTerm(target);
        after.set(code, target);
        dependents.add(code);
        changed = true;
      }
    }
    if (!changed) break;
  }

  // Rebuild the terms: every planned course in the term it now sits in.
  const terms: PlannedCourseTerm[] = plan.terms.map((t) => ({
    term: t.term,
    codes: t.codes.filter((code) => sameTerm(after.get(code) ?? t.term, t.term)),
    freeElectiveCredits:
      t.freeElectiveCredits -
      freeElectiveMoves.filter((m) => sameTerm(m.from, t.term)).reduce((n, m) => n + m.credits, 0),
  }));
  const entryFor = (target: TermRef): PlannedCourseTerm => {
    let entry = terms.find((t) => sameTerm(t.term, target));
    if (!entry) {
      entry = { term: target, codes: [], freeElectiveCredits: 0 };
      terms.push(entry);
    }
    return entry;
  };
  for (const [code, term] of after) {
    const original = before.get(code)!;
    if (!sameTerm(term, original)) entryFor(term).codes.push(code);
  }
  for (const move of freeElectiveMoves) entryFor(move.to).freeElectiveCredits += move.credits;

  const counterfactual: StudyPlan = {
    ...plan,
    terms: terms.sort((a, b) => termIndex(a.term) - termIndex(b.term)),
  };

  const pushedBack: PushedBack[] = [...after]
    .filter(([code, term]) => !sameTerm(term, before.get(code)!))
    .map(([code, to]) => ({
      code,
      from: before.get(code)!,
      to,
      reason: (moved.has(code) ? "moved" : "dependent") as PushedBack["reason"],
    }))
    .sort(
      (a, b) =>
        (a.reason === b.reason ? 0 : a.reason === "moved" ? -1 : 1) ||
        termIndex(a.to) - termIndex(b.to) ||
        a.code.localeCompare(b.code)
    );

  const wasOver = overloadedTerms(version, plan);
  const overloaded = [...overloadedTerms(version, counterfactual)]
    .filter(([index]) => !wasOver.has(index))
    .map(([, over]) => over)
    .sort((a, b) => termIndex(a.term) - termIndex(b.term));

  const graduationBefore = projectedGraduation(plan);
  const graduationAfter = projectedGraduation(counterfactual);
  return {
    change,
    applied: true,
    plan: counterfactual,
    graduationBefore,
    graduationAfter,
    graduationMoved:
      graduationBefore !== null &&
      graduationAfter !== null &&
      !sameTerm(graduationBefore, graduationAfter),
    pushedBack,
    overloaded,
  };
}

/**
 * The planned courses on the critical path: those that take part in a
 * prerequisite chain inside the plan (they need, or are needed by, another
 * planned course) and whose deferral by one term moves the graduation term.
 *
 * A course that merely sits in the final term, with no prerequisite link to
 * anything else planned, also moves graduation if deferred, but it is not a
 * chain, so it is not marked here; its own "if I move this later" says so.
 * Chains come from the graph's `prerequisiteChain` edges (`prerequisites` and
 * `unlocks`) for the student's own curriculum version.
 */
export function criticalPath(version: CurriculumVersion, plan: StudyPlan): string[] {
  const planned = plannedTerms(plan);
  const critical: string[] = [];
  for (const code of planned.keys()) {
    const linked =
      prerequisites(code, version.id).some((p) => planned.has(p)) ||
      unlocks(code, version.id).some((d) => planned.has(d));
    if (!linked) continue;
    if (whatIf(version, plan, { kind: "deferCourse", code }).graduationMoved) critical.push(code);
  }
  return critical.sort();
}

export type PlannedDeferral = {
  code: string;
  planned: TermRef;
  recommended: TermRef;
  graduation: TermRef;
  recommendedGraduation: TermRef;
};

/**
 * Courses the plan has later than the recommended plan does, on the critical
 * path, while the plan graduates later than the recommended plan does. It
 * is a deferral "already in the plan" that matters: the chain it sits on runs
 * to the last planned term, so the delay is carried to graduation rather than
 * absorbed by spare terms. Courses the recommended plan does not name (chosen
 * electives) are skipped, as there is nothing to be later than.
 */
export function deferralsOnCriticalPath(
  version: CurriculumVersion,
  plan: StudyPlan
): PlannedDeferral[] {
  const graduation = projectedGraduation(plan);
  const recommendedTerms = version.recommendedPlan.value.map((t) => t.term);
  const recommendedGraduation = recommendedTerms.sort((a, b) => termIndex(a) - termIndex(b)).at(-1);
  if (!graduation || !recommendedGraduation) return [];
  if (termIndex(graduation) <= termIndex(recommendedGraduation)) return [];

  const planned = plannedTerms(plan);
  const deferrals: PlannedDeferral[] = [];
  for (const code of criticalPath(version, plan)) {
    const where = planned.get(code)!;
    const recommended = recommendedIn(code, version.id)
      .sort((a, b) => termIndex(a) - termIndex(b))
      .at(-1);
    if (!recommended || termIndex(where) <= termIndex(recommended)) continue;
    deferrals.push({ code, planned: where, recommended, graduation, recommendedGraduation });
  }
  return deferrals;
}
