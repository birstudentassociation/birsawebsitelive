/**
 * Teaching terms with published dates, used by the calendar builder to repeat
 * a student's weekly classes. Only terms the faculty has published are listed;
 * no dates are inferred.
 */
import type { AcademicTerm } from "@/content/course-review/types";
import type { SourceId } from "@/content/curriculum/sources";

export type TeachingTerm = {
  term: AcademicTerm;
  /** First day of teaching, `YYYY-MM-DD`. */
  start: string;
  /** Last day of teaching, `YYYY-MM-DD`. */
  end: string;
  source: SourceId;
};

export const teachingTerms: TeachingTerm[] = [
  {
    term: { year: 2569, semester: 2 },
    start: "2027-01-04",
    end: "2027-05-01",
    source: "courseOffering2026S2",
  },
];

/**
 * The term containing `todayKey` (`YYYY-MM-DD`, Bangkok), else the earliest
 * term starting after it, else null.
 */
export function currentOrNextTeachingTerm(todayKey: string): TeachingTerm | null {
  const sorted = [...teachingTerms].sort((a, b) => a.start.localeCompare(b.start));
  return sorted.find((t) => t.end >= todayKey) ?? null;
}
