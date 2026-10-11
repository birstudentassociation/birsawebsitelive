/**
 * The assessment shape of a planned term, built from the catalogue's
 * `assessmentFacts`: how many of its courses have a final exam and what it is
 * worth, how many are marked on coursework alone, and where attendance is
 * graded.
 *
 * Only what the catalogue has recorded is counted. A course with no recorded
 * facts, or facts that do not add up to a whole grade, is listed as unknown by
 * code and is never assumed to have, or not have, an exam. Most courses are in
 * that position today (six courses have facts), so every line this produces
 * says how many courses it rests on, and the term the facts were recorded for,
 * rather than reading as a statement about the whole term.
 *
 * Pure functions with the lookup passed in, so the aggregation is testable
 * without the catalogue; the default lookup reads it through the course graph.
 * Facts and words only: nothing here scores or ranks a course.
 */
import type { AcademicTerm, AssessmentFacts } from "@/content/course-review/types";
import { courseNode } from "@/lib/courses/graph";
import { termYearLabel } from "@/lib/course-review/terms";

/**
 * A final exam worth at least this much of the grade makes a course
 * "exam-heavy". 40% is the figure the roadmap's own example uses, and it is
 * where the recorded exams stop being one component among several.
 */
export const EXAM_HEAVY_WEIGHT = 40;

/**
 * A term with at least this many exam-heavy courses raises the `examLoad`
 * note. Three is "several": two heavy exams in a term is ordinary, three is a
 * pattern a student would want to know about before registering.
 */
export const EXAM_HEAVY_TERM_COUNT = 3;

export type AssessmentKind =
  /** A final exam, or a final oral assessment, is among the recorded components. */
  | "finalExam"
  /** The recorded weights add up to the whole grade and none of them is an exam. */
  | "courseworkOnly"
  /** Fully recorded, no final exam, but another exam (a midterm, say). */
  | "otherExam"
  /** Nothing recorded, or a partial record that cannot say. */
  | "unknown";

export type CourseAssessment = {
  code: string;
  kind: AssessmentKind;
  /** The final exam's share of the grade, when one is recorded. */
  finalExamWeight: number | null;
  /** Attendance is one of the graded components. */
  attendanceGraded: boolean;
  /** The facts include a statement about attendance (a rule, or that none is taken). */
  attendanceNoted: boolean;
  /** The term the facts were recorded for. */
  term: AcademicTerm | null;
};

/** Looks up the recorded facts for a course code. */
export type AssessmentLookup = (code: string) => AssessmentFacts | undefined;

/** The catalogue's recorded facts, through the course graph. */
export const catalogueAssessmentFacts: AssessmentLookup = (code) =>
  courseNode(code)?.catalogue?.assessmentFacts;

/** "Final exam", and also "Final oral assessment", which the catalogue's exam format calls an exam. */
const FINAL_EXAM = /\bfinal\b.*\b(exam|examination|assessment)\b/i;

/** What one course's recorded facts say about its assessment. */
export function classifyAssessment(
  code: string,
  facts: AssessmentFacts | undefined
): CourseAssessment {
  const weights = facts?.weights ?? [];
  const finalExam = weights.find((component) => FINAL_EXAM.test(component.label.en));
  const total = weights.reduce((sum, component) => sum + component.weight, 0);
  const anyExam = weights.some((component) => /exam/i.test(component.label.en));

  let kind: AssessmentKind = "unknown";
  if (finalExam) kind = "finalExam";
  else if (weights.length > 0 && total === 100) kind = anyExam ? "otherExam" : "courseworkOnly";

  return {
    code,
    kind,
    finalExamWeight: finalExam?.weight ?? null,
    attendanceGraded: weights.some((component) => /attendance/i.test(component.label.en)),
    attendanceNoted: facts?.attendance !== undefined,
    term: facts?.term ?? null,
  };
}

export type TermAssessmentProfile = {
  /** Named courses in the term. Free elective credits are not courses and are not counted. */
  courseCount: number;
  /** Courses with a recorded final exam, with its weight, in the order the term lists them. */
  finalExam: { code: string; weight: number }[];
  /** The subset of `finalExam` worth `EXAM_HEAVY_WEIGHT` or more. */
  examHeavy: { code: string; weight: number }[];
  courseworkOnly: string[];
  otherExam: string[];
  /** No usable record. Named, never assumed either way. */
  unknown: string[];
  attendanceGraded: string[];
  attendanceNoted: string[];
  /** The distinct terms the facts were recorded for, oldest first. */
  recordedTerms: AcademicTerm[];
};

function termOrder(term: AcademicTerm): number {
  return term.year * 10 + (term.semester === "summer" ? 3 : term.semester);
}

/** Aggregates the recorded facts of the courses in one term. */
export function termAssessmentProfile(
  codes: readonly string[],
  lookup: AssessmentLookup = catalogueAssessmentFacts
): TermAssessmentProfile {
  const profile: TermAssessmentProfile = {
    courseCount: codes.length,
    finalExam: [],
    examHeavy: [],
    courseworkOnly: [],
    otherExam: [],
    unknown: [],
    attendanceGraded: [],
    attendanceNoted: [],
    recordedTerms: [],
  };
  const terms = new Map<number, AcademicTerm>();

  for (const code of codes) {
    const assessment = classifyAssessment(code, lookup(code));
    if (assessment.kind === "finalExam" && assessment.finalExamWeight !== null) {
      const entry = { code, weight: assessment.finalExamWeight };
      profile.finalExam.push(entry);
      if (entry.weight >= EXAM_HEAVY_WEIGHT) profile.examHeavy.push(entry);
    } else if (assessment.kind === "courseworkOnly") profile.courseworkOnly.push(code);
    else if (assessment.kind === "otherExam") profile.otherExam.push(code);
    else profile.unknown.push(code);

    if (assessment.attendanceGraded) profile.attendanceGraded.push(code);
    if (assessment.attendanceNoted) profile.attendanceNoted.push(code);
    // A course whose facts classify as unknown can still carry a term, but its
    // facts are not being relied on, so only recorded courses cite one.
    if (assessment.term && assessment.kind !== "unknown") {
      terms.set(termOrder(assessment.term), assessment.term);
    }
  }

  profile.recordedTerms = [...terms.entries()].sort((a, b) => a[0] - b[0]).map(([, t]) => t);
  return profile;
}

/** True when the term stacks enough exam-heavy courses to raise the note. */
export function stacksExams(profile: TermAssessmentProfile): boolean {
  return profile.examHeavy.length >= EXAM_HEAVY_TERM_COUNT;
}

/** Words for the profile line, one set per language. */
export type ProfileCopy = {
  /** Contains "{recorded}" and "{total}". */
  recordedTemplate: string;
  /** Contains "{names}"; used when no course in the term has anything on record. */
  noneRecordedTemplate: string;
  /** Contains "{n}" and "{list}", the list being codes with their weights. */
  finalExamTemplate: string;
  /** Contains "{n}" and "{list}". */
  courseworkOnlyTemplate: string;
  /** Contains "{list}"; courses whose attendance is part of the grade. */
  attendanceGradedTemplate: string;
  /** Contains "{names}"; courses with nothing on record, in a term where others have. */
  unknownTemplate: string;
  /** Contains "{terms}". */
  recordedForTemplate: string;
  /** Contains "{semester}" and "{year}". */
  termTemplate: string;
  semester1: string;
  semester2: string;
  summer: string;
  /** Joins the last two of a list, e.g. "and". */
  and: string;
};

function joinList(items: readonly string[], and: string): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} ${and} ${items.at(-1)}`;
}

/** e.g. "semester 1, 2025/26" in English, "ภาคเรียนที่ 1 ปีการศึกษา 2568" in Thai. */
export function describeRecordedTerm(
  term: AcademicTerm,
  locale: "en" | "th",
  copy: ProfileCopy
): string {
  const semester =
    term.semester === "summer"
      ? copy.summer
      : term.semester === 1
        ? copy.semester1
        : copy.semester2;
  return copy.termTemplate
    .replace("{semester}", semester)
    .replace("{year}", termYearLabel(term, locale));
}

/**
 * The one short line under a term, or null when the term holds no named
 * course. It always says how many courses it rests on, names the courses with
 * nothing on record, and cites the term the facts were recorded for.
 */
export function profileLine(
  profile: TermAssessmentProfile,
  locale: "en" | "th",
  copy: ProfileCopy
): string | null {
  if (profile.courseCount === 0) return null;
  const recorded = profile.courseCount - profile.unknown.length;
  const and = copy.and;

  if (recorded === 0) {
    return copy.noneRecordedTemplate.replace("{names}", joinList(profile.unknown, and));
  }

  const sentences = [
    copy.recordedTemplate
      .replace("{recorded}", String(recorded))
      .replace("{total}", String(profile.courseCount)),
  ];
  if (profile.finalExam.length > 0) {
    sentences.push(
      copy.finalExamTemplate
        .replace("{n}", String(profile.finalExam.length))
        .replace("{list}", profile.finalExam.map((e) => `${e.code} ${e.weight}%`).join(", "))
    );
  }
  if (profile.courseworkOnly.length > 0) {
    sentences.push(
      copy.courseworkOnlyTemplate
        .replace("{n}", String(profile.courseworkOnly.length))
        .replace("{list}", profile.courseworkOnly.join(", "))
    );
  }
  if (profile.attendanceGraded.length > 0) {
    sentences.push(
      copy.attendanceGradedTemplate.replace("{list}", profile.attendanceGraded.join(", "))
    );
  }
  if (profile.unknown.length > 0) {
    sentences.push(copy.unknownTemplate.replace("{names}", joinList(profile.unknown, and)));
  }
  const terms = profile.recordedTerms.map((term) => describeRecordedTerm(term, locale, copy));
  if (terms.length > 0) {
    sentences.push(copy.recordedForTemplate.replace("{terms}", joinList(terms, and)));
  }
  return sentences.join(" ");
}

/**
 * The profile line's words. They live here, not with the screen copy, because
 * the `examLoad` finding in `checkPlan` cites the recorded term in the same
 * words and a finding cannot import from a component. The screens take them
 * from here too, so the line and the finding never describe a term two ways.
 * The Thai is written as Thai sentences, which do not end in a full stop.
 */
export const PROFILE_COPY: Record<"en" | "th", ProfileCopy> = {
  en: {
    recordedTemplate: "Assessment on record for {recorded} of {total} courses.",
    noneRecordedTemplate: "No assessment facts are on record for {names}.",
    finalExamTemplate: "Final exam in {n} ({list}).",
    courseworkOnlyTemplate: "Coursework only in {n} ({list}).",
    attendanceGradedTemplate: "Attendance is graded in {list}.",
    unknownTemplate: "Nothing on record for {names}.",
    recordedForTemplate: "Recorded for {terms}.",
    termTemplate: "{semester}, {year}",
    semester1: "semester 1",
    semester2: "semester 2",
    summer: "summer",
    and: "and",
  },
  th: {
    recordedTemplate: "มีข้อมูลการวัดผลของ {recorded} จาก {total} วิชา",
    noneRecordedTemplate: "ยังไม่มีข้อมูลการวัดผลของวิชา {names}",
    finalExamTemplate: "มีสอบปลายภาค {n} วิชา ({list})",
    courseworkOnlyTemplate: "วัดผลจากงานในรายวิชาทั้งหมด {n} วิชา ({list})",
    attendanceGradedTemplate: "มีคะแนนการเข้าเรียนในวิชา {list}",
    unknownTemplate: "ยังไม่มีข้อมูลของวิชา {names}",
    recordedForTemplate: "ข้อมูลของ{terms}",
    termTemplate: "{semester} ปีการศึกษา {year}",
    semester1: "ภาคเรียนที่ 1",
    semester2: "ภาคเรียนที่ 2",
    summer: "ภาคฤดูร้อน",
    and: "และ",
  },
};
