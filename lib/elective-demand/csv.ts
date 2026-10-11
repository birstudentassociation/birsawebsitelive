/**
 * The officer CSV export of elective demand: one row per course and term with
 * the number of students who planned it. Follows lib/csv.ts like every other
 * export (formula-injection guard, CRLF line endings, trailing CRLF).
 *
 * `demandCsv` is the pure builder over rows already read, so it is testable
 * without a database; `demandCsvFromDatabase` reads them. With no database it
 * returns the header alone, so a download always produces a valid file.
 */
import { csvField } from "@/lib/csv";
import { courseNode } from "@/lib/courses/graph";
import { listDemandCounts, type DemandCount } from "@/lib/elective-demand/store";
import { termYearLabel } from "@/lib/course-review/terms";

export const DEMAND_CSV_HEADER = [
  "course_code",
  "course_title",
  "academic_year_be",
  "academic_year_ce",
  "semester",
  "students",
];

function csvRow(fields: unknown[]): string {
  return fields.map(csvField).join(",");
}

/** The CSV for these counts, in the order given. */
export function demandCsv(counts: readonly DemandCount[]): string {
  const rows = counts.map((count) => [
    count.courseCode,
    courseNode(count.courseCode)?.title ?? "",
    count.term.year,
    termYearLabel(count.term, "en"),
    count.term.semester,
    count.students,
  ]);
  return [csvRow(DEMAND_CSV_HEADER), ...rows.map(csvRow)].join("\r\n") + "\r\n";
}

/** The CSV for everything in the database. Header only when it is not configured or empty. */
export async function demandCsvFromDatabase(): Promise<string> {
  return demandCsv(await listDemandCounts());
}
