/**
 * Turning "I am in year 3, semester 1" into "here is what we think you have
 * passed". This is what lets a student skip ticking forty boxes.
 *
 * Placeholders come back separately from named courses because roughly a
 * third of the published plan is slots rather than courses ("Minor Required
 * Course 1"), and only the student knows what filled them.
 */
import {
  resolveMinorCategory,
  type CategoryId,
  type CreditCategory,
  type CurriculumVersion,
  type LocalizedText,
  type MinorId,
  type TermKind,
  type TermRef,
} from "@/content/curriculum";

export type PlaceholderSlot = {
  id: string;
  label: LocalizedText;
  category: CategoryId;
  term: TermRef;
};

export type CategoryShortfall = {
  category: CreditCategory;
  earned: number;
  remaining: number;
};

const TERM_ORDER: Record<TermKind, number> = { semester1: 0, semester2: 1, summer: 2 };

/**
 * Sortable index so summer lands after semester 2 of the same year. Exported
 * so every place that orders terms (this module's own cutoff, the display
 * grouping on the assumed screen, the findings engine's timeline) shares one
 * rule; two copies of "summer sorts last" is exactly the kind of pair that
 * quietly disagrees after someone edits only one of them.
 */
export function termIndex(term: TermRef): number {
  return term.year * 10 + TERM_ORDER[term.kind];
}

/** Term kinds in sequence within a year, used by `nextTerm` to step forward one at a time. */
const TERM_SEQUENCE: TermKind[] = ["semester1", "semester2", "summer"];

/**
 * Matches `termRef`'s `year` cap in lib/study-plan/plan.ts: a plan can
 * represent breaking the seven-year limit (`maxYears`), but not run forever,
 * so a student adding terms one at a time eventually runs out of room to add
 * more.
 */
const MAX_TERM_YEAR = 8;

/**
 * The term immediately after `term`: semester 1, then semester 2, then
 * summer, then semester 1 of the next year. Returns null at the cap
 * (`MAX_TERM_YEAR` summer), which is what tells the "Add another term"
 * control on the plan screen to stop offering one.
 */
export function nextTerm(term: TermRef): TermRef | null {
  const kindIndex = TERM_SEQUENCE.indexOf(term.kind);
  if (kindIndex < TERM_SEQUENCE.length - 1) {
    return { year: term.year, kind: TERM_SEQUENCE[kindIndex + 1]! };
  }
  const year = term.year + 1;
  return year > MAX_TERM_YEAR ? null : { year, kind: "semester1" };
}

/**
 * Everything in the recommended plan strictly before `position`, split into
 * named courses and placeholder slots the student still has to fill in.
 */
export function assumedHistory(
  version: CurriculumVersion,
  position: TermRef
): { courses: string[]; placeholders: PlaceholderSlot[] } {
  const cutoff = termIndex(position);
  const courses = new Set<string>();
  const placeholders: PlaceholderSlot[] = [];

  for (const term of version.recommendedPlan.value) {
    if (termIndex(term.term) >= cutoff) continue;
    for (const entry of term.entries) {
      if (entry.kind === "course") {
        courses.add(entry.code);
      } else {
        placeholders.push({
          id: entry.id,
          label: entry.label,
          category: entry.category,
          term: term.term,
        });
      }
    }
  }

  return { courses: [...courses], placeholders };
}

/**
 * Combines a plan's passed and planned course codes (deduplicated) and its
 * passed and planned free elective credits, the two values every caller of
 * `remainingRequirements` needs to build first. Both the plan screen
 * (`app/[lang]/services/study-plan/plan/page.tsx`) and the findings engine
 * (`lib/study-plan/findings.ts`) computed this identically in two places
 * until it was pulled out here; the term-ordering helper above went through
 * the same three-copies-that-drifted history, so this one is factored out
 * before it has the chance to.
 */
export function planTotals(plan: {
  passed: string[];
  freeElectiveCreditsPassed: number;
  terms: { codes: string[]; freeElectiveCredits: number }[];
}): { allCodes: string[]; totalFreeElectiveCredits: number } {
  const plannedCodes = plan.terms.flatMap((t) => t.codes);
  const allCodes = [...new Set([...plan.passed, ...plannedCodes])];
  const plannedFreeElectives = plan.terms.reduce((n, t) => n + t.freeElectiveCredits, 0);
  const totalFreeElectiveCredits = plan.freeElectiveCreditsPassed + plannedFreeElectives;
  return { allCodes, totalFreeElectiveCredits };
}

/**
 * What the student still owes in each credit category.
 *
 * Minor courses need the chosen minor to be counted at all: they are pooled
 * under `category: "minor"` on the course, and only the pairing with a minor
 * decides whether a given course is one of the 9 required credits, one of the
 * 6 electives within the minor, or one of the 6 from another minor. Every
 * other course is counted straight off its own category.
 */
export function remainingRequirements(
  version: CurriculumVersion,
  passed: string[],
  minorId: MinorId,
  freeElectiveCredits: number
): CategoryShortfall[] {
  const passedSet = new Set(passed);
  const byCode = new Map(version.courses.value.map((c) => [c.code, c]));

  /** The requirement bucket this passed course counts toward, if any. */
  const bucketFor = (code: string): CategoryId | null => {
    const course = byCode.get(code);
    if (!course || course.excludedFromTotal) return null;
    if (course.category !== "minor") return course.category;
    return resolveMinorCategory(version, minorId, code);
  };

  return version.categories.map((category) => {
    // Free electives are counted, never matched: they may be any Thammasat
    // course, so no catalogue entry exists to sum. Matching them like every
    // other category would leave this bucket permanently unsatisfiable.
    if (category.id === "freeElective") {
      return {
        category,
        earned: freeElectiveCredits,
        remaining: Math.max(0, category.credits - freeElectiveCredits),
      };
    }
    let earned = 0;
    for (const code of passedSet) {
      if (bucketFor(code) !== category.id) continue;
      earned += byCode.get(code)?.credits ?? 0;
    }
    return { category, earned, remaining: Math.max(0, category.credits - earned) };
  });
}
