/**
 * Data access for course review submissions: storing one, reading them back
 * for the moderation console, and recording an officer's decision.
 *
 * Imports `sql` from `@/lib/inventory/db` so the shared type parsers apply, and
 * gates every read and write behind `isCourseReviewConfigured()`, so the site
 * stays buildable and renderable with zero environment configuration and a
 * missing database never crashes a page. Reads return empty values and writes
 * return `false` rather than throwing, matching lib/feedback.ts.
 *
 * A submission holds no name, student ID, email address, IP address or user
 * agent: nothing in it can identify who wrote it. The text fields are
 * unmoderated until an officer approves them.
 */
import type { AcademicTerm, WorkloadBand } from "@/content/course-review/types";
import { sql } from "@/lib/inventory/db";
import {
  groupSubmissions,
  type GroupKey,
  type SubmissionGroup,
  type SubmissionStatus,
} from "@/lib/course-review/groups";
import { parseTermKey } from "@/lib/course-review/terms";
import type { ValidReview } from "@/lib/course-review/submit";

/**
 * A Postgres array literal for `values`, e.g. `{"a","b \"c\""}`. The
 * `sql` tag only takes primitives, so an array parameter goes in as this
 * string and is cast with `::text[]` or `::uuid[]` in the query.
 */
export function pgArray(values: readonly string[]): string {
  return `{${values.map((value) => `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`).join(",")}}`;
}

/**
 * A timestamp column as an ISO string. The driver hands back a `Date` for
 * `timestamptz` (only `date` columns are overridden to raw strings in
 * lib/inventory/db.ts), and the app-facing types promise strings.
 */
export function toIsoString(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : String(value);
}

export function isCourseReviewConfigured(): boolean {
  return !!process.env.POSTGRES_URL;
}

export type ReviewSubmission = {
  id: string;
  courseCode: string;
  term: AcademicTerm;
  instructorKey: string;
  workload: string;
  workloadBand: WorkloadBand | null;
  assessment: string;
  tips: string[];
  quote: string | null;
  locale: "en" | "th";
  status: SubmissionStatus;
  moderatedAt: string | null;
  createdAt: string;
};

type SubmissionRow = {
  id: string;
  course_code: string;
  term_year: number;
  term_semester: string;
  instructor_key: string;
  workload: string;
  workload_band: WorkloadBand | null;
  assessment: string;
  tips: string[];
  quote: string | null;
  locale: "en" | "th";
  status: SubmissionStatus;
  moderated_at: string | Date | null;
  created_at: string | Date;
};

/** The term a pair of `term_year` and `term_semester` columns names. Falls back to semester 1 for a value the check constraint should have stopped. */
export function termFromColumns(year: number, semester: string): AcademicTerm {
  return parseTermKey(`${year}-${semester}`) ?? { year, semester: 1 };
}

/** The `term_semester` column value for a term. */
export function semesterColumn(term: AcademicTerm): string {
  return String(term.semester);
}

function mapSubmission(row: SubmissionRow): ReviewSubmission {
  return {
    id: row.id,
    courseCode: row.course_code,
    term: termFromColumns(row.term_year, row.term_semester),
    instructorKey: row.instructor_key,
    workload: row.workload,
    workloadBand: row.workload_band,
    assessment: row.assessment,
    tips: row.tips ?? [],
    quote: row.quote,
    locale: row.locale,
    status: row.status,
    moderatedAt: row.moderated_at === null ? null : toIsoString(row.moderated_at),
    createdAt: toIsoString(row.created_at),
  };
}

/**
 * Inserts one submission as `pending`. Returns `false` (never throws) when the
 * database isn't configured or the insert fails, so the caller can tell the
 * reader nothing was saved instead of pretending it was.
 */
export async function insertSubmission(input: ValidReview): Promise<boolean> {
  if (!isCourseReviewConfigured()) {
    return false;
  }
  try {
    await sql`
      insert into course_review_submissions
        (course_code, term_year, term_semester, instructor_key, workload, workload_band,
         assessment, tips, quote, locale)
      values
        (${input.courseCode}, ${input.term.year}, ${semesterColumn(input.term)},
         ${input.instructorKey}, ${input.workload}, ${input.workloadBand}, ${input.assessment},
         ${pgArray(input.tips)}::text[], ${input.quote}, ${input.locale})
    `;
    return true;
  } catch {
    return false;
  }
}

/**
 * Every group of submissions with the count of each status, for the
 * moderation queue. Reads only the columns grouping needs, so no free text
 * is loaded for the overview.
 */
export async function listSubmissionGroups(): Promise<SubmissionGroup[]> {
  if (!isCourseReviewConfigured()) {
    return [];
  }
  try {
    const result = await sql<{
      course_code: string;
      term_year: number;
      term_semester: string;
      instructor_key: string;
      status: SubmissionStatus;
    }>`
      select course_code, term_year, term_semester, instructor_key, status
      from course_review_submissions
    `;
    return groupSubmissions(
      result.rows.map((row) => ({
        courseCode: row.course_code,
        term: termFromColumns(row.term_year, row.term_semester),
        instructorKey: row.instructor_key,
        status: row.status,
      }))
    );
  } catch {
    return [];
  }
}

/**
 * One group's submissions, oldest first (the order they arrived in). Throws on
 * a database error, for callers that must tell "none" from "could not read";
 * `listGroupSubmissions` is the forgiving version for pages.
 */
export async function readGroupSubmissions(key: GroupKey): Promise<ReviewSubmission[]> {
  const result = await sql<SubmissionRow>`
    select id, course_code, term_year, term_semester, instructor_key, workload, workload_band,
           assessment, tips, quote, locale, status, moderated_at, created_at
    from course_review_submissions
    where course_code = ${key.courseCode}
      and term_year = ${key.term.year}
      and term_semester = ${semesterColumn(key.term)}
      and instructor_key = ${key.instructorKey}
    order by created_at asc
  `;
  return result.rows.map(mapSubmission);
}

/** One group's submissions, oldest first. Empty when the database isn't configured or the read fails. */
export async function listGroupSubmissions(key: GroupKey): Promise<ReviewSubmission[]> {
  if (!isCourseReviewConfigured()) {
    return [];
  }
  try {
    return await readGroupSubmissions(key);
  } catch {
    return [];
  }
}

/**
 * Records an officer's decision on one submission and returns the group it
 * belongs to, or `null` when it could not be updated (no database, an unknown
 * id, or a failure). The group is returned so the caller can write the audit
 * entry and send the officer back to the right page without a second query.
 */
export async function decideSubmission(
  id: string,
  status: Exclude<SubmissionStatus, "pending">,
  officerId: string
): Promise<GroupKey | null> {
  if (!isCourseReviewConfigured()) {
    return null;
  }
  try {
    const result = await sql<{
      course_code: string;
      term_year: number;
      term_semester: string;
      instructor_key: string;
    }>`
      update course_review_submissions
      set status = ${status}, moderated_by = ${officerId}, moderated_at = now()
      where id = ${id}
      returning course_code, term_year, term_semester, instructor_key
    `;
    const row = result.rows[0];
    if (!row) {
      return null;
    }
    return {
      courseCode: row.course_code,
      term: termFromColumns(row.term_year, row.term_semester),
      instructorKey: row.instructor_key,
    };
  } catch {
    return null;
  }
}
