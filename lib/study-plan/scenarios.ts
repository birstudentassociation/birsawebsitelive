/**
 * Scenarios: several named plans kept side by side on one device, and the two
 * built-in questions worth asking of a plan ("what if I switch minor?" and
 * "what if I spend a term away?"), plus a comparison of any two.
 *
 * Managing the saved scenarios themselves (add, rename, delete, switch) is in
 * `scenarioStore.ts`, which is light enough for the browser; this module needs
 * the curriculum and the findings engine. Nothing here touches storage.
 *
 * The two helpers and the comparison are computed from a plan alone, so the
 * plan screen can show them on the server from the plan in the URL, with
 * JavaScript off. Saving a result as a scenario is what needs storage.
 *
 * Like the rest of the service these report facts about a plan and never
 * block one: a scenario that breaks a rule is still a scenario, and its
 * findings are counted in the comparison.
 */
import {
  CURRICULUM_VERSIONS,
  resolveMinorCategory,
  type CategoryId,
  type CurriculumVersion,
  type LocalizedText,
  type MinorId,
  type TermRef,
} from "@/content/curriculum";
import { prerequisiteChain } from "@/lib/courses/graph";
import {
  planTotals,
  projectedGraduation,
  remainingRequirements,
  type CategoryShortfall,
} from "@/lib/study-plan/derive";
import { checkPlan, type FindingSources } from "@/lib/study-plan/findings";
import type { StudyPlan } from "@/lib/study-plan/plan";
import { whatIf, type WhatIfResult } from "@/lib/study-plan/whatIf";

// ---------------------------------------------------------------------------
// Minor switch
// ---------------------------------------------------------------------------

/** What happens to one minor course's credits when the student's minor changes. */
export type MinorSwitchOutcome =
  /** Counts in the same bucket under both minors. */
  | "carried"
  /** Now counts as one of the credits from another minor. */
  | "otherMinor"
  /** Counts in a different bucket of the new minor, say required becomes elective. */
  | "reclassified";

export type MinorSwitchRow = {
  code: string;
  credits: number;
  /** In the plan's future terms, as opposed to already passed. */
  planned: boolean;
  from: CategoryId | null;
  to: CategoryId | null;
  outcome: MinorSwitchOutcome;
};

export type MinorSwitchResult = {
  fromMinor: MinorId;
  toMinor: MinorId;
  /** The plan with only its minor changed, ready to be kept as a scenario. */
  plan: StudyPlan;
  rows: MinorSwitchRow[];
  credits: {
    carriedOver: number;
    movedToOtherMinor: number;
    reclassified: number;
    /** Minor credits beyond what the minor's three buckets ask for, which count towards nothing. */
    noLongerCounting: number;
  };
  /** Credits still short of the graduation total, before and after. */
  remainingBefore: number;
  remainingAfter: number;
};

const MINOR_BUCKETS: readonly CategoryId[] = [
  "minorRequired",
  "minorElective",
  "minorElectiveOther",
];

/** Minor credits that fall outside what the three minor buckets need: earned beyond the requirement. */
function strandedMinorCredits(shortfalls: CategoryShortfall[]): number {
  return shortfalls
    .filter((s) => MINOR_BUCKETS.includes(s.category.id))
    .reduce((n, s) => n + Math.max(0, s.earned - s.category.credits), 0);
}

function totalRemaining(shortfalls: CategoryShortfall[]): number {
  return shortfalls.reduce((n, s) => n + s.remaining, 0);
}

/**
 * Re-resolves every passed and planned minor course under another minor. The
 * courses themselves do not move: a minor course's bucket depends only on the
 * minor chosen (`resolveMinorCategory`), so changing the minor is changing how
 * the same credits are counted. Each course lands in one of three groups, and
 * credits beyond what the minor needs are reported as no longer counting, using
 * the same `remainingRequirements` the "what you still owe" table does.
 */
export function minorSwitch(
  version: CurriculumVersion,
  plan: StudyPlan,
  toMinor: MinorId
): MinorSwitchResult {
  const byCode = new Map(version.courses.value.map((c) => [c.code, c]));
  const plannedCodes = new Set(plan.terms.flatMap((t) => t.codes));
  const { allCodes, totalFreeElectiveCredits } = planTotals(plan);

  const rows: MinorSwitchRow[] = [];
  for (const code of allCodes) {
    const course = byCode.get(code);
    if (!course || course.category !== "minor" || course.excludedFromTotal) continue;
    const from = resolveMinorCategory(version, plan.minorId, code);
    const to = resolveMinorCategory(version, toMinor, code);
    if (from === null && to === null) continue;
    let outcome: MinorSwitchOutcome = "reclassified";
    if (from === to) outcome = "carried";
    else if (to === "minorElectiveOther") outcome = "otherMinor";
    rows.push({
      code,
      credits: course.credits,
      planned: plannedCodes.has(code) && !plan.passed.includes(code),
      from,
      to,
      outcome,
    });
  }
  rows.sort((a, b) => a.code.localeCompare(b.code));

  const sum = (outcome: MinorSwitchOutcome) =>
    rows.filter((r) => r.outcome === outcome).reduce((n, r) => n + r.credits, 0);

  const before = remainingRequirements(version, allCodes, plan.minorId, totalFreeElectiveCredits);
  const after = remainingRequirements(version, allCodes, toMinor, totalFreeElectiveCredits);

  return {
    fromMinor: plan.minorId,
    toMinor,
    plan: { ...plan, minorId: toMinor },
    rows,
    credits: {
      carriedOver: sum("carried"),
      movedToOtherMinor: sum("otherMinor"),
      reclassified: sum("reclassified"),
      noLongerCounting: Math.max(0, strandedMinorCredits(after) - strandedMinorCredits(before)),
    },
    remainingBefore: totalRemaining(before),
    remainingAfter: totalRemaining(after),
  };
}

// ---------------------------------------------------------------------------
// Away term
// ---------------------------------------------------------------------------

/** Both leave the term with no BIR courses. The kind is a label; what an exchange brings back is agreed with the faculty and is not modelled. */
export type AwayKind = "exchange" | "leave";

export type AwayTermResult = {
  kind: AwayKind;
  term: TermRef;
  whatIf: WhatIfResult;
  /** Courses displaced from the term that others depend on, with the dependants that are also in the plan. */
  chains: { code: string; dependents: string[] }[];
  /** True when the plan then runs past the years the rules allow. Leave does not extend that limit. */
  beyondTimeLimit: boolean;
  /** The plan with the term emptied and everything displaced moved, ready to be kept as a scenario. */
  plan: StudyPlan;
};

/** A term with no BIR courses, and the effect on prerequisite chains and graduation. */
export function awayTerm(
  version: CurriculumVersion,
  plan: StudyPlan,
  term: TermRef,
  kind: AwayKind
): AwayTermResult {
  const result = whatIf(version, plan, { kind: "emptyTerm", term });
  const planned = new Set(result.plan.terms.flatMap((t) => t.codes));
  const chains = result.pushedBack
    .filter((moved) => moved.reason === "moved")
    .map((moved) => ({
      code: moved.code,
      dependents: prerequisiteChain(moved.code, version.id).filter((code) => planned.has(code)),
    }))
    .filter((chain) => chain.dependents.length > 0);
  const graduation = result.graduationAfter;
  return {
    kind,
    term,
    whatIf: result,
    chains,
    beyondTimeLimit: graduation !== null && graduation.year > version.rules.value.maxYears,
    plan: result.plan,
  };
}

// ---------------------------------------------------------------------------
// Comparison
// ---------------------------------------------------------------------------

export type ScenarioSummary = {
  name: string;
  graduation: TermRef | null;
  /** Credits counted towards the graduation total, as the plan screen's headline figure. */
  creditsCounted: number;
  creditsRequired: number;
  categories: { id: CategoryId; name: LocalizedText; earned: number; required: number }[];
  findings: { problem: number; warning: number; note: number };
};

export type ScenarioComparison = {
  a: ScenarioSummary;
  b: ScenarioSummary;
  /** Credits earned in each category, for every category either scenario has. */
  categories: { id: CategoryId; name: LocalizedText; a: number | null; b: number | null }[];
  graduationDiffers: boolean;
};

/** The figures a comparison shows for one plan, each in the plan's own curriculum version. */
export function summariseScenario(
  name: string,
  plan: StudyPlan,
  sources?: FindingSources
): ScenarioSummary {
  const version = CURRICULUM_VERSIONS[plan.versionId];
  const { allCodes, totalFreeElectiveCredits } = planTotals(plan);
  const shortfalls = remainingRequirements(
    version,
    allCodes,
    plan.minorId,
    totalFreeElectiveCredits
  );
  const findings = { problem: 0, warning: 0, note: 0 };
  for (const finding of checkPlan(version, plan, sources)) findings[finding.severity] += 1;
  return {
    name,
    graduation: projectedGraduation(plan),
    creditsCounted: version.graduationCredits.value - totalRemaining(shortfalls),
    creditsRequired: version.graduationCredits.value,
    categories: shortfalls.map((s) => ({
      id: s.category.id,
      name: s.category.name,
      earned: s.earned,
      required: s.category.credits,
    })),
    findings,
  };
}

function sameTerm(a: TermRef | null, b: TermRef | null): boolean {
  if (a === null || b === null) return a === b;
  return a.year === b.year && a.kind === b.kind;
}

export function compareScenarios(
  a: { name: string; plan: StudyPlan },
  b: { name: string; plan: StudyPlan },
  sources?: FindingSources
): ScenarioComparison {
  const left = summariseScenario(a.name, a.plan, sources);
  const right = summariseScenario(b.name, b.plan, sources);
  const ids = new Map<CategoryId, LocalizedText>();
  for (const category of [...left.categories, ...right.categories]) {
    if (!ids.has(category.id)) ids.set(category.id, category.name);
  }
  return {
    a: left,
    b: right,
    categories: [...ids].map(([id, name]) => ({
      id,
      name,
      a: left.categories.find((c) => c.id === id)?.earned ?? null,
      b: right.categories.find((c) => c.id === id)?.earned ?? null,
    })),
    graduationDiffers: !sameTerm(left.graduation, right.graduation),
  };
}
