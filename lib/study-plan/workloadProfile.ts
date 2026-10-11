/**
 * The reported workload of a planned term, built from the workload bands on
 * student reviews: how many of its courses are reported as over 6 hours a
 * week by most of the students who gave an estimate.
 *
 * This extends the assessment profile (`assessmentProfile.ts`), which rests on
 * facts the catalogue records, with what students reported. The reviews come
 * from a lookup the caller supplies, so the repository's reviews and the
 * summaries published from the database can be counted together without this
 * module touching either; the default lookup reads the repository alone.
 * Sample reviews are demonstration content and never count.
 *
 * Every line says how many student reports it rests on and the term they are
 * for, and names the courses with no estimate on record rather than assuming
 * anything about them. Bands are only ever counted: nothing here averages
 * them, picks a middle one or turns a course into a number. A course counts as
 * "mostly over 6 hours" when more than half of the students who gave an
 * estimate in its most recent qualifying term chose that band.
 *
 * Pure functions with the lookup passed in, so the aggregation is testable
 * without the catalogue or a database.
 */
import type { AcademicTerm, StudentReview } from "@/content/course-review/types";
import { courseNode } from "@/lib/courses/graph";
import { latestBandReport } from "@/lib/course-review/reviewSummary";
import { describeRecordedTerm, PROFILE_COPY } from "@/lib/study-plan/assessmentProfile";

/**
 * A term with at least this many courses mostly reported in the top band
 * raises the `workloadLoad` note. Two is where the roadmap's own example
 * starts ("two courses in this term are reported as over 6 hours a week"),
 * and unlike exams, which are a few days at the end of a term, every one of
 * these is a weekly commitment, so two already adds up.
 */
export const WORKLOAD_TOP_BAND_TERM_COUNT = 2;

/** Looks up the reviews held for a course code. */
export type ReviewLookup = (code: string) => readonly StudentReview[];

/** The repository's reviews, through the course graph. */
export const catalogueReviews: ReviewLookup = (code) => courseNode(code)?.catalogue?.reviews ?? [];

export type CourseWorkload = {
  code: string;
  /** The term the answers are for. */
  term: AcademicTerm;
  /** Students who gave a band. */
  answers: number;
  /** How many of them chose the top band, over 6 hours a week. */
  top: number;
  /** More than half of the answers are in the top band. */
  mostlyTop: boolean;
};

export type TermWorkloadProfile = {
  /** Named courses in the term. Free elective credits are not courses and are not counted. */
  courseCount: number;
  /** Courses with enough band answers to repeat, in the order the term lists them. */
  reported: CourseWorkload[];
  /** The subset of `reported` where most students chose the top band. */
  topBand: CourseWorkload[];
  /** No usable estimate. Named, never assumed either way. */
  unreported: string[];
};

/** Aggregates the workload bands of the courses in one term. */
export function termWorkloadProfile(
  codes: readonly string[],
  lookup: ReviewLookup = catalogueReviews
): TermWorkloadProfile {
  const profile: TermWorkloadProfile = {
    courseCount: codes.length,
    reported: [],
    topBand: [],
    unreported: [],
  };
  for (const code of codes) {
    const bands = latestBandReport(lookup(code));
    if (!bands) {
      profile.unreported.push(code);
      continue;
    }
    const top = bands.counts.over_6 ?? 0;
    const entry: CourseWorkload = {
      code,
      term: bands.term,
      answers: bands.answers,
      top,
      mostlyTop: top * 2 > bands.answers,
    };
    profile.reported.push(entry);
    if (entry.mostlyTop) profile.topBand.push(entry);
  }
  return profile;
}

/** True when the term has enough courses mostly reported in the top band to raise the note. */
export function stacksWorkload(profile: TermWorkloadProfile): boolean {
  return profile.topBand.length >= WORKLOAD_TOP_BAND_TERM_COUNT;
}

function termOrder(term: AcademicTerm): number {
  return term.year * 10 + (term.semester === "summer" ? 3 : term.semester);
}

/** The distinct terms the given courses' answers are for, oldest first. */
export function reportedTerms(entries: readonly CourseWorkload[]): AcademicTerm[] {
  const terms = new Map<number, AcademicTerm>();
  for (const entry of entries) terms.set(termOrder(entry.term), entry.term);
  return [...terms.entries()].sort((a, b) => a[0] - b[0]).map(([, term]) => term);
}

/** How many students gave an estimate across the given courses. */
export function reportCount(entries: readonly CourseWorkload[]): number {
  return entries.reduce((sum, entry) => sum + entry.answers, 0);
}

/** Words for the workload line, one set per language. */
export type WorkloadCopy = {
  /** The top band as the course page words it, e.g. "over 6 hours a week". */
  topBandLabel: string;
  /** Contains "{count}", "{list}", "{reports}" and "{terms}". English says "One" for a single course. */
  topOneTemplate: string;
  topManyTemplate: string;
  /** Contains "{recorded}", "{total}", "{reports}" and "{terms}"; used when no course is mostly in the top band. */
  noneTopTemplate: string;
  /** Contains "{names}"; courses with no estimate, in a term where others have one. */
  unreportedTemplate: string;
  and: string;
};

function joinList(items: readonly string[], and: string): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} ${and} ${items.at(-1)}`;
}

const ENGLISH_NUMBER_WORDS = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
];

/** English writes a count of one to nine as a word, at the start of a sentence; Thai writes digits. */
function countWord(n: number, locale: "en" | "th"): string {
  return (locale === "en" ? ENGLISH_NUMBER_WORDS[n] : undefined) || String(n);
}

/** e.g. "semester 1, 2025/26" for each term, joined. */
export function describeReportedTerms(
  entries: readonly CourseWorkload[],
  locale: "en" | "th",
  copy: WorkloadCopy
): string {
  const terms = reportedTerms(entries).map((term) =>
    describeRecordedTerm(term, locale, PROFILE_COPY[locale])
  );
  return joinList(terms, copy.and);
}

/**
 * The one short line under a term, or null when no course in it has an
 * estimate on record: a term with nothing to report gets silence, not a line
 * about nothing. It always says how many student reports it rests on and the
 * term they are for.
 */
export function workloadLine(
  profile: TermWorkloadProfile,
  locale: "en" | "th",
  copy: WorkloadCopy
): string | null {
  if (profile.reported.length === 0) return null;
  const sentences: string[] = [];
  const about = profile.topBand.length > 0 ? profile.topBand : profile.reported;
  const reports = String(reportCount(about));
  const terms = describeReportedTerms(about, locale, copy);

  if (profile.topBand.length > 0) {
    const template = profile.topBand.length === 1 ? copy.topOneTemplate : copy.topManyTemplate;
    sentences.push(
      template
        .replace("{count}", countWord(profile.topBand.length, locale))
        .replace("{list}", profile.topBand.map((entry) => entry.code).join(", "))
        .replace("{reports}", reports)
        .replace("{terms}", terms)
    );
  } else {
    sentences.push(
      copy.noneTopTemplate
        .replace("{recorded}", String(profile.reported.length))
        .replace("{total}", String(profile.courseCount))
        .replace("{reports}", reports)
        .replace("{terms}", terms)
    );
  }
  if (profile.unreported.length > 0) {
    sentences.push(
      copy.unreportedTemplate.replace("{names}", joinList(profile.unreported, copy.and))
    );
  }
  return sentences.join(" ");
}

/**
 * The workload line's words. They live here, not with the screen copy, for the
 * same reason as `PROFILE_COPY`: the `workloadLoad` finding in `checkPlan`
 * states the same figures in the same words, and a finding cannot import from
 * a component. The top band's label matches the course page's (a test checks
 * it against the dictionary). The Thai is written as Thai sentences, which do
 * not end in a full stop.
 */
export const WORKLOAD_COPY: Record<"en" | "th", WorkloadCopy> = {
  en: {
    topBandLabel: "over 6 hours a week",
    topOneTemplate:
      "{count} course in this term is reported as over 6 hours a week by most of the students who gave an estimate ({list}). This rests on {reports} student reports for {terms}.",
    topManyTemplate:
      "{count} courses in this term are reported as over 6 hours a week by most of the students who gave an estimate ({list}). This rests on {reports} student reports for {terms}.",
    noneTopTemplate:
      "Workload estimates are on record for {recorded} of {total} courses, and for none of them do most students say over 6 hours a week. This rests on {reports} student reports for {terms}.",
    unreportedTemplate: "No workload estimates are on record for {names}.",
    and: "and",
  },
  th: {
    topBandLabel: "มากกว่า 6 ชั่วโมงต่อสัปดาห์",
    topOneTemplate:
      "มี {count} วิชาในภาคนี้ที่นักศึกษาส่วนใหญ่ซึ่งให้ข้อมูลระบุว่าใช้เวลามากกว่า 6 ชั่วโมงต่อสัปดาห์ ({list}) ข้อมูลนี้มาจากรายงานของนักศึกษา {reports} คน ของ{terms}",
    topManyTemplate:
      "มี {count} วิชาในภาคนี้ที่นักศึกษาส่วนใหญ่ซึ่งให้ข้อมูลระบุว่าใช้เวลามากกว่า 6 ชั่วโมงต่อสัปดาห์ ({list}) ข้อมูลนี้มาจากรายงานของนักศึกษา {reports} คน ของ{terms}",
    noneTopTemplate:
      "มีข้อมูลปริมาณงานของ {recorded} จาก {total} วิชา และไม่มีวิชาใดที่นักศึกษาส่วนใหญ่ระบุว่าใช้เวลามากกว่า 6 ชั่วโมงต่อสัปดาห์ ข้อมูลนี้มาจากรายงานของนักศึกษา {reports} คน ของ{terms}",
    unreportedTemplate: "ยังไม่มีข้อมูลปริมาณงานของวิชา {names}",
    and: "และ",
  },
};
