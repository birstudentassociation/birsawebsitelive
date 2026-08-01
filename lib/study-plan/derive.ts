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

/** Sortable index so summer lands after semester 2 of the same year. */
function termIndex(term: TermRef): number {
  return term.year * 10 + TERM_ORDER[term.kind];
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
