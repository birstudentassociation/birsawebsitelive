/**
 * When a course has been recorded as taught, derived from the terms the
 * catalogue already carries: the term on each student review that is not a
 * sample, and the term the assessment facts were recorded for.
 *
 * This is history and never an offering promise. The study plan design rules
 * out per-term offering data maintained by hand (it needs BIRSA to commit to
 * updating it every semester), so nothing here says a course will run in a
 * term, and a term missing from the history may simply not have been
 * recorded. The derivation is disclosed wherever it is shown, with
 * `OFFERING_HISTORY_NOTICE`, following the same rule as the curriculum's
 * inferred parts: the service may use derived data, but not silently.
 *
 * `offeringHistory` takes extra reviews as an optional second argument so
 * reviews published through the officer console (`lib/course-review/
 * published.ts`, read from the database) can be counted without changing any
 * caller that does not have them. A review that appears both in the catalogue
 * and in the extras counts once, because the history keeps distinct terms.
 *
 * Pure functions over static data, with no React.
 */
import type { LocalizedText, TermKind } from "@/content/curriculum/types";
import type { AcademicTerm, StudentReview } from "@/content/course-review/types";
import { courseNode } from "@/lib/courses/graph";
import { termYearLabel } from "@/lib/course-review/terms";

export type OfferingHistory = {
  code: string;
  /** The distinct terms the course is recorded in, oldest first. */
  terms: AcademicTerm[];
  /** Academic years (Buddhist Era) recorded for each term kind, oldest first. */
  yearsByKind: Record<TermKind, number[]>;
};

/**
 * Shown wherever a history is shown. It says what the history is made of, that
 * it is not a promise, and where the real answer is.
 */
export const OFFERING_HISTORY_NOTICE: LocalizedText = {
  en: "This is history, not a promise. It is worked out from the terms recorded on student reviews and in the assessment facts BIRSA holds, so a term missing here may simply not have been recorded. BIRSA does not hold timetable data and cannot say whether a course will run in a given term. Check the faculty timetable before you register.",
  th: "ข้อมูลนี้เป็นประวัติที่เคยบันทึกไว้ ไม่ใช่คำยืนยันว่าจะเปิดสอน ระบบสรุปจากภาคการศึกษาที่ระบุไว้ในรีวิวของนักศึกษาและในข้อมูลการวัดผลที่ BIRSA มี ภาคที่ไม่ปรากฏจึงอาจเป็นเพียงภาคที่ยังไม่มีผู้บันทึก BIRSA ไม่มีข้อมูลตารางสอนและไม่อาจบอกได้ว่ารายวิชาจะเปิดในภาคใดหรือไม่ โปรดตรวจสอบตารางสอนของคณะก่อนลงทะเบียน",
};

function kindOf(term: AcademicTerm): TermKind {
  return term.semester === "summer" ? "summer" : term.semester === 1 ? "semester1" : "semester2";
}

function termOrder(term: AcademicTerm): number {
  return term.year * 10 + (term.semester === "summer" ? 3 : term.semester);
}

/**
 * The terms a course is recorded as taught in, or null when nothing is
 * recorded. A code outside the review catalogue has no reviews or assessment
 * facts of its own, so it has a history only when `extraReviews` (the
 * summaries published from the database, which any course page can collect)
 * name a term; a code no curriculum lists has none. Sample reviews are
 * demonstration content and never count.
 */
export function offeringHistory(
  code: string,
  extraReviews: readonly StudentReview[] = []
): OfferingHistory | null {
  const node = courseNode(code);
  if (!node) return null;
  const course = node.catalogue;

  const found = new Map<number, AcademicTerm>();
  const add = (term: AcademicTerm) => found.set(termOrder(term), term);
  for (const review of [...(course?.reviews ?? []), ...extraReviews]) {
    if (!review.sample) add(review.term);
  }
  if (course?.assessmentFacts) add(course.assessmentFacts.term);
  if (found.size === 0) return null;

  const terms = [...found.entries()].sort((a, b) => a[0] - b[0]).map(([, term]) => term);
  const yearsByKind: Record<TermKind, number[]> = { semester1: [], semester2: [], summer: [] };
  for (const term of terms) yearsByKind[kindOf(term)].push(term.year);
  return { code, terms, yearsByKind };
}

/** True when the history has the course in a term of this kind. */
export function recordedInKind(history: OfferingHistory, kind: TermKind): boolean {
  return history.yearsByKind[kind].length > 0;
}

/** Words for the history line, one set per language. */
export type HistoryCopy = {
  /** Contains "{terms}". */
  template: string;
  /** Contains "{semester}" and "{years}". */
  groupTemplate: string;
  semester1: string;
  semester2: string;
  summer: string;
  and: string;
};

function joinList(items: readonly string[], and: string): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} ${and} ${items.at(-1)}`;
}

/** The recorded terms as a phrase, e.g. "semester 1 of 2023/24 and 2024/25, and summer of 2025/26". */
export function describeTerms(
  history: OfferingHistory,
  locale: "en" | "th",
  copy: HistoryCopy
): string {
  const kinds: TermKind[] = ["semester1", "semester2", "summer"];
  const groups = kinds
    .filter((kind) => history.yearsByKind[kind].length > 0)
    .map((kind) =>
      copy.groupTemplate.replace("{semester}", copy[kind]).replace(
        "{years}",
        joinList(
          history.yearsByKind[kind].map((year) => termYearLabel({ year, semester: 1 }, locale)),
          copy.and
        )
      )
    );
  return joinList(groups, copy.and);
}

/** "Recorded as taught in semester 1 of 2023/24 and 2024/25". */
export function historyLine(
  history: OfferingHistory,
  locale: "en" | "th",
  copy: HistoryCopy
): string {
  return copy.template.replace("{terms}", describeTerms(history, locale, copy));
}

/**
 * The history line's words, here rather than with the screen copy for the same
 * reason as `PROFILE_COPY` in lib/study-plan/assessmentProfile.ts: the
 * `offering` finding in `checkPlan` states the history in these words.
 */
export const HISTORY_COPY: Record<"en" | "th", HistoryCopy> = {
  en: {
    template: "Recorded as taught in {terms}",
    groupTemplate: "{semester} of {years}",
    semester1: "semester 1",
    semester2: "semester 2",
    summer: "summer",
    and: "and",
  },
  th: {
    template: "เคยมีบันทึกว่าเปิดสอนใน{terms}",
    groupTemplate: "{semester} ปีการศึกษา {years}",
    semester1: "ภาคเรียนที่ 1",
    semester2: "ภาคเรียนที่ 2",
    summer: "ภาคฤดูร้อน",
    and: "และ",
  },
};
