/**
 * Data access for the elective demand signal: storing a submission, reading
 * the counts back for the officer console, and reading which terms a course
 * has enough demand to name on its page.
 *
 * Imports `sql` from `@/lib/inventory/db` so the shared type parsers apply, and
 * gates every read and write behind `isElectiveDemandConfigured()`, so the site
 * stays buildable and renderable with zero environment configuration and a
 * missing database never crashes a page. Reads return empty values and writes
 * return `false` rather than throwing, matching lib/course-review/submissions.ts.
 *
 * A row is one course in one term for one curriculum version and the day it
 * arrived. It has no submission id and the id is random, so nothing in the
 * table can tell which rows came from the same student, let alone who that was.
 */
import type { AcademicTerm } from "@/content/course-review/types";
import { sql } from "@/lib/inventory/db";
import { pgArray, semesterColumn, termFromColumns } from "@/lib/course-review/submissions";
import type { DemandPayload } from "@/lib/elective-demand/payload";
import { publishableTerms, type TermDemand } from "@/lib/elective-demand/threshold";

export function isElectiveDemandConfigured(): boolean {
  return !!process.env.POSTGRES_URL;
}

/** A course, a term and how many students planned it, as the officer console shows them. */
export type DemandCount = { courseCode: string; term: AcademicTerm; students: number };

/**
 * Stores one submission. Returns `false` (never throws) when the database
 * isn't configured or the insert fails, so the caller can tell the student
 * nothing was saved instead of pretending it was. The caller passes a payload
 * that `validateDemand` has already accepted; this function stores exactly its
 * four fields and cannot be handed anything else.
 */
export async function insertDemand(payload: DemandPayload): Promise<boolean> {
  if (!isElectiveDemandConfigured() || payload.entries.length === 0) {
    return false;
  }
  try {
    await sql`
      insert into elective_demand_entries (curriculum_version, course_code, term_year, term_semester)
      select ${payload.versionId}::text, entry.code, entry.year, entry.semester
      from unnest(
        ${pgArray(payload.entries.map((entry) => entry.code))}::text[],
        ${pgArray(payload.entries.map((entry) => String(entry.term.year)))}::int[],
        ${pgArray(payload.entries.map((entry) => semesterColumn(entry.term)))}::text[]
      ) as entry(code, year, semester)
    `;
    return true;
  } catch {
    return false;
  }
}

/**
 * Every course and term with the number of students who planned it, for the
 * officer console and its CSV export. Exact counts, because officers are
 * trusted and need them; the public path below never receives one.
 */
export async function listDemandCounts(): Promise<DemandCount[]> {
  if (!isElectiveDemandConfigured()) {
    return [];
  }
  try {
    const result = await sql<{
      course_code: string;
      term_year: number;
      term_semester: string;
      students: string | number;
    }>`
      select course_code, term_year, term_semester, count(*) as students
      from elective_demand_entries
      group by course_code, term_year, term_semester
      order by term_year desc, term_semester asc, count(*) desc, course_code asc
    `;
    return result.rows.map((row) => ({
      courseCode: row.course_code,
      term: termFromColumns(row.term_year, row.term_semester),
      students: Number(row.students),
    }));
  } catch {
    return [];
  }
}

/**
 * The terms a course page may say are in demand for. Reads the counts for one
 * course and passes them straight through `publishableTerms`, which drops every
 * count and every term below the threshold or already over, so the page is
 * handed terms and never numbers. Empty when the database isn't configured or
 * the read fails, which is also what a course nobody has planned looks like.
 */
export async function listDemandTerms(courseCode: string, now: Date): Promise<AcademicTerm[]> {
  if (!isElectiveDemandConfigured()) {
    return [];
  }
  try {
    const result = await sql<{
      term_year: number;
      term_semester: string;
      students: string | number;
    }>`
      select term_year, term_semester, count(*) as students
      from elective_demand_entries
      where course_code = ${courseCode}
      group by term_year, term_semester
    `;
    const demand: TermDemand[] = result.rows.map((row) => ({
      term: termFromColumns(row.term_year, row.term_semester),
      students: Number(row.students),
    }));
    return publishableTerms(demand, now);
  } catch {
    return [];
  }
}
