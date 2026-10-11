/**
 * What the elective demand signal sends, and the check that nothing else can
 * be stored.
 *
 * The payload is a curriculum version id and a list of course code and term
 * pairs. That is all. It has no cohort, no minor, no passed courses and no
 * identifier of any kind, and the type makes that structural: there is no
 * field to put them in. The plan screen builds the payload from the plan and
 * shows it to the student before they send it; the server action takes it back
 * as two plain form fields, `validateDemand` re-checks every value against
 * the curriculum, and only the validated result reaches the database.
 *
 * Which courses count as electives is the curriculum's own answer: a course in
 * a category the student chooses from (`chooseFrom`), or a minor course that is
 * an elective rather than required for the minor they chose. The minor is read
 * to classify and then dropped; it is not part of what is sent.
 */
import type { AcademicTerm } from "@/content/course-review/types";
import {
  CURRICULUM_VERSIONS,
  resolveMinorCategory,
  type Course,
  type CurriculumVersion,
  type CurriculumVersionId,
  type MinorId,
} from "@/content/curriculum";
import { parseTermKey, termKey } from "@/lib/course-review/terms";
import { academicTermOf, termOrder } from "@/lib/elective-demand/terms";
import type { StudyPlan } from "@/lib/study-plan/plan";

/** One planned elective: the course and the calendar term it is planned for. */
export type DemandEntry = { code: string; term: AcademicTerm };

/** Everything a submission carries. */
export type DemandPayload = {
  versionId: CurriculumVersionId;
  entries: DemandEntry[];
};

/** The most entries one submission may hold: more than any plan the service can build. */
export const MAX_DEMAND_ENTRIES = 60;

/** The earliest and latest academic years (Buddhist Era) a submission may name. */
const FIRST_YEAR = 2560;
const LAST_YEAR = 2620;

const VERSION_IDS = Object.keys(CURRICULUM_VERSIONS) as CurriculumVersionId[];

/** Form field names, shared by the plan screen's form and the server action that reads it. */
export const DEMAND_FIELDS = {
  version: "version",
  entries: "entries",
  agree: "share",
  honeypot: "nickname",
} as const;

/** Whether a course is an elective for a student taking `minorId`. */
export function isElective(version: CurriculumVersion, minorId: MinorId, course: Course): boolean {
  if (course.internship || course.excludedFromTotal) return false;
  if (course.category === "minor") {
    const bucket = resolveMinorCategory(version, minorId, course.code);
    return bucket === "minorElective" || bucket === "minorElectiveOther";
  }
  return (
    version.categories.find((category) => category.id === course.category)?.chooseFrom === true
  );
}

/**
 * The electives in a plan, each with the calendar term it is planned for,
 * earliest term first and each pair once. Free elective credits are counted in
 * credits rather than as courses (see `PlannedCourseTerm`), so they never
 * appear.
 */
export function buildDemandPayload(plan: StudyPlan): DemandPayload {
  const version = CURRICULUM_VERSIONS[plan.versionId];
  const byCode = new Map(version.courses.value.map((course) => [course.code, course]));
  const seen = new Set<string>();
  const entries: DemandEntry[] = [];

  for (const planned of plan.terms) {
    const term = academicTermOf(plan.startYear, planned.term);
    for (const code of planned.codes) {
      const course = byCode.get(code);
      if (!course || !isElective(version, plan.minorId, course)) continue;
      const key = `${code}@${termKey(term)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push({ code, term });
    }
  }

  entries.sort((a, b) => termOrder(a.term) - termOrder(b.term) || a.code.localeCompare(b.code));
  return { versionId: plan.versionId, entries: entries.slice(0, MAX_DEMAND_ENTRIES) };
}

/** The entries as one form value, e.g. `PI380@2569-1,PI391@2569-2`. */
export function encodeDemandEntries(entries: readonly DemandEntry[]): string {
  return entries.map((entry) => `${entry.code}@${termKey(entry.term)}`).join(",");
}

/** What the server action reads from the form. */
export type RawDemandForm = {
  versionId: string;
  entries: string;
  agreed: boolean;
  honeypot: string;
};

export type DemandRefusal = "not-agreed" | "invalid";

export type DemandValidation =
  { ok: true; data: DemandPayload } | { ok: false; reason: DemandRefusal };

/**
 * Checks a submission and returns only what may be stored. Every code must be
 * a course in the named curriculum and every term must be a real academic term
 * in range; one bad entry refuses the whole submission rather than dropping it
 * silently, because a tampered form is not a partly good one. Duplicates are
 * folded into one.
 */
export function validateDemand(raw: RawDemandForm): DemandValidation {
  if (!raw.agreed) return { ok: false, reason: "not-agreed" };

  const versionId = VERSION_IDS.find((id) => id === raw.versionId);
  if (!versionId) return { ok: false, reason: "invalid" };
  const known = new Set(CURRICULUM_VERSIONS[versionId].courses.value.map((course) => course.code));

  const parts = raw.entries.split(",").filter((part) => part.length > 0);
  if (parts.length === 0 || parts.length > MAX_DEMAND_ENTRIES) {
    return { ok: false, reason: "invalid" };
  }

  const seen = new Set<string>();
  const entries: DemandEntry[] = [];
  for (const part of parts) {
    const match = /^([A-Z]{2,4}\d{3})@(\d{4}-(?:1|2|summer))$/.exec(part);
    const term = match ? parseTermKey(match[2]!) : null;
    if (!match || !term || !known.has(match[1]!)) return { ok: false, reason: "invalid" };
    if (term.year < FIRST_YEAR || term.year > LAST_YEAR) return { ok: false, reason: "invalid" };
    if (seen.has(part)) continue;
    seen.add(part);
    entries.push({ code: match[1]!, term });
  }

  return { ok: true, data: { versionId, entries } };
}
