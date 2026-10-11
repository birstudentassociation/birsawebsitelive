/**
 * Published course reviews: the summaries officers publish from approved
 * submissions, held in the database so publishing needs no commit.
 *
 * The course pages read them through `listPublishedReviews`, which returns an
 * empty list when the database isn't configured (so a static build with no
 * environment still renders) and merges with the reviews held in
 * content/course-review/courses.ts through `mergeReviews`. A published summary
 * is not personal data: it is written by an officer, carries no names, and
 * only exists once at least five approved submissions stand behind it.
 */
import type {
  AcademicTerm,
  Bi,
  Instructor,
  StudentReview,
  WorkloadBandCounts,
} from "@/content/course-review/types";
import { courseNode } from "@/lib/courses/graph";
import { sql } from "@/lib/inventory/db";
import { groupId, meetsThreshold, type GroupKey } from "@/lib/course-review/groups";
import { instructorByKey, instructorKey, OTHER_INSTRUCTOR } from "@/lib/course-review/instructors";
import {
  isCourseReviewConfigured,
  pgArray,
  readGroupSubmissions,
  semesterColumn,
  termFromColumns,
  toIsoString,
} from "@/lib/course-review/submissions";
import { termKey } from "@/lib/course-review/terms";
import { countBands } from "@/lib/course-review/workload";

/** What an officer writes and approves before a group is published. Every field is bilingual. */
export type ReviewSummary = {
  workload: Bi;
  assessment: Bi;
  tips: Bi[];
  quotes: Bi[];
};

/** A published summary as the console reads it back, for editing or unpublishing. */
export type PublishedGroup = {
  key: GroupKey;
  reviewCount: number;
  summary: ReviewSummary;
  bandCounts: WorkloadBandCounts;
  publishedAt: string;
};

type PublishedRow = {
  course_code: string;
  term_year: number;
  term_semester: string;
  instructor_key: string;
  instructor_name_en: string | null;
  instructor_name_th: string | null;
  review_count: number;
  workload_en: string;
  workload_th: string;
  assessment_en: string;
  assessment_th: string;
  tips: Bi[];
  quotes: Bi[];
  band_counts: WorkloadBandCounts;
  published_at: string | Date;
};

function keyOf(
  row: Pick<PublishedRow, "course_code" | "term_year" | "term_semester" | "instructor_key">
): GroupKey {
  return {
    courseCode: row.course_code,
    term: termFromColumns(row.term_year, row.term_semester),
    instructorKey: row.instructor_key,
  };
}

function mapGroup(row: PublishedRow): PublishedGroup {
  return {
    key: keyOf(row),
    reviewCount: row.review_count,
    summary: {
      workload: { en: row.workload_en, th: row.workload_th },
      assessment: { en: row.assessment_en, th: row.assessment_th },
      tips: row.tips ?? [],
      quotes: row.quotes ?? [],
    },
    bandCounts: row.band_counts ?? {},
    publishedAt: toIsoString(row.published_at),
  };
}

/**
 * A published row as the `StudentReview` the course page already renders.
 * The instructor is looked up by key among the course's current instructors,
 * which gives the profile link; one who has since left the list is rebuilt
 * from the name stored at publication, with no link.
 */
export function rowToReview(
  row: PublishedRow,
  instructors: readonly Instructor[] | undefined
): StudentReview {
  const review: StudentReview = {
    reviewCount: row.review_count,
    term: termFromColumns(row.term_year, row.term_semester),
    workload: { en: row.workload_en, th: row.workload_th },
    assessmentStyle: { en: row.assessment_en, th: row.assessment_th },
    tips: row.tips ?? [],
  };
  if (row.instructor_key === OTHER_INSTRUCTOR) {
    review.instructorElsewhere = true;
  } else {
    const current = instructorByKey(instructors, row.instructor_key);
    if (current) {
      review.instructor = current;
    } else if (row.instructor_name_en && row.instructor_name_th) {
      review.instructor = { name: { en: row.instructor_name_en, th: row.instructor_name_th } };
    }
  }
  if (row.quotes && row.quotes.length > 0) {
    review.quotes = row.quotes.map((text) => ({ text }));
  }
  if (row.band_counts && Object.keys(row.band_counts).length > 0) {
    review.workloadBands = row.band_counts;
  }
  return review;
}

/** Newest term first; within a year, summer then semester 2 then semester 1. */
function termOrder(term: AcademicTerm): number {
  return term.year * 4 + (term.semester === "summer" ? 3 : term.semester);
}

/** Who a review is about, for deciding whether a published one replaces a static one. */
function reviewIdentity(review: StudentReview): string {
  const who = review.instructor
    ? instructorKey(review.instructor)
    : review.instructorElsewhere
      ? OTHER_INSTRUCTOR
      : "";
  return `${termKey(review.term)}|${who}`;
}

/**
 * The reviews a course page shows: those held in content/course-review/courses.ts
 * plus those published in the database, newest term first. A published summary
 * for the same term and instructor as a static one replaces it, so moving a
 * hand-written review into the database does not show it twice.
 */
export function mergeReviews(
  staticReviews: readonly StudentReview[],
  published: readonly StudentReview[]
): StudentReview[] {
  const replaced = new Set(published.map(reviewIdentity));
  return [
    ...staticReviews.filter((review) => !replaced.has(reviewIdentity(review))),
    ...published,
  ].sort((a, b) => termOrder(b.term) - termOrder(a.term));
}

/**
 * Every published review for a course. Returns `[]` when the database isn't
 * configured or the query fails, so the page falls back to the reviews held
 * in the repository alone.
 */
export async function listPublishedReviews(
  courseCode: string,
  instructors?: readonly Instructor[]
): Promise<StudentReview[]> {
  if (!isCourseReviewConfigured()) {
    return [];
  }
  try {
    const result = await sql<PublishedRow>`
      select course_code, term_year, term_semester, instructor_key, instructor_name_en,
             instructor_name_th, review_count, workload_en, workload_th, assessment_en,
             assessment_th, tips, quotes, band_counts, published_at
      from published_course_reviews
      where course_code = ${courseCode}
    `;
    return result.rows.map((row) => rowToReview(row, instructors));
  } catch {
    return [];
  }
}

/**
 * Every published review, by course code. For the screens that look at many
 * courses at once (the plan screen's workload lines and shortlist), which
 * would otherwise query once per course. Returns an empty map when the database
 * isn't configured or the query fails, so those screens fall back to the
 * reviews held in the repository alone.
 */
export async function listPublishedReviewsByCourse(): Promise<Map<string, StudentReview[]>> {
  const byCourse = new Map<string, StudentReview[]>();
  if (!isCourseReviewConfigured()) {
    return byCourse;
  }
  try {
    const result = await sql<PublishedRow>`
      select course_code, term_year, term_semester, instructor_key, instructor_name_en,
             instructor_name_th, review_count, workload_en, workload_th, assessment_en,
             assessment_th, tips, quotes, band_counts, published_at
      from published_course_reviews
    `;
    for (const row of result.rows) {
      const review = rowToReview(row, courseNode(row.course_code)?.catalogue?.instructors);
      byCourse.set(row.course_code, [...(byCourse.get(row.course_code) ?? []), review]);
    }
    return byCourse;
  } catch {
    return new Map();
  }
}

/**
 * The course codes that have at least one published review, sorted. For the
 * catalogue's "reviewed" badge and filter, which need only whether a course has
 * one. Empty when the database isn't configured or the query fails.
 */
export async function listPublishedReviewCodes(): Promise<string[]> {
  if (!isCourseReviewConfigured()) {
    return [];
  }
  try {
    const result = await sql<Pick<PublishedRow, "course_code">>`
      select distinct course_code from published_course_reviews order by course_code
    `;
    return result.rows.map((row) => row.course_code);
  } catch {
    return [];
  }
}

/** The published summary for one group, or `null` when it has none or the database is unavailable. */
export async function getPublishedGroup(key: GroupKey): Promise<PublishedGroup | null> {
  if (!isCourseReviewConfigured()) {
    return null;
  }
  try {
    const result = await sql<PublishedRow>`
      select course_code, term_year, term_semester, instructor_key, instructor_name_en,
             instructor_name_th, review_count, workload_en, workload_th, assessment_en,
             assessment_th, tips, quotes, band_counts, published_at
      from published_course_reviews
      where course_code = ${key.courseCode}
        and term_year = ${key.term.year}
        and term_semester = ${semesterColumn(key.term)}
        and instructor_key = ${key.instructorKey}
    `;
    const row = result.rows[0];
    return row ? mapGroup(row) : null;
  } catch {
    return null;
  }
}

/** The group ids (see `groupId`) that have a published summary, with how many submissions each rests on. For the queue's published badges. */
export async function listPublishedGroupIds(): Promise<Map<string, number>> {
  const published = new Map<string, number>();
  if (!isCourseReviewConfigured()) {
    return published;
  }
  try {
    const result = await sql<
      Pick<
        PublishedRow,
        "course_code" | "term_year" | "term_semester" | "instructor_key" | "review_count"
      >
    >`
      select course_code, term_year, term_semester, instructor_key, review_count
      from published_course_reviews
    `;
    for (const row of result.rows) {
      published.set(groupId(keyOf(row)), row.review_count);
    }
    return published;
  } catch {
    return published;
  }
}

export type PublishResult =
  | { ok: true; reviewCount: number }
  | { ok: false; reason: "not-configured" | "below-threshold" | "error" };

/**
 * Publishes `summary` for a group, replacing any earlier summary for it.
 *
 * The count, the submission ids and the workload band distribution come from
 * the group's approved submissions as the database holds them now, never from
 * the caller, so a summary cannot claim more support than it has. Below
 * `PUBLICATION_THRESHOLD` (lib/course-review/groups.ts) approved submissions nothing is written.
 */
export async function publishGroup(
  key: GroupKey,
  summary: ReviewSummary,
  instructor: Instructor | undefined,
  officerId: string
): Promise<PublishResult> {
  if (!isCourseReviewConfigured()) {
    return { ok: false, reason: "not-configured" };
  }
  try {
    const approved = (await readGroupSubmissions(key)).filter(
      (submission) => submission.status === "approved"
    );
    if (!meetsThreshold(approved.length)) {
      return { ok: false, reason: "below-threshold" };
    }
    const bandCounts = countBands(approved.map((submission) => submission.workloadBand));
    const ids = approved.map((submission) => submission.id);
    await sql`
      insert into published_course_reviews
        (course_code, term_year, term_semester, instructor_key, instructor_name_en,
         instructor_name_th, review_count, workload_en, workload_th, assessment_en,
         assessment_th, tips, quotes, band_counts, published_by, published_at, submission_ids)
      values
        (${key.courseCode}, ${key.term.year}, ${semesterColumn(key.term)}, ${key.instructorKey},
         ${instructor?.name.en ?? null}, ${instructor?.name.th ?? null}, ${approved.length},
         ${summary.workload.en}, ${summary.workload.th}, ${summary.assessment.en},
         ${summary.assessment.th}, ${JSON.stringify(summary.tips)}::jsonb,
         ${JSON.stringify(summary.quotes)}::jsonb, ${JSON.stringify(bandCounts)}::jsonb,
         ${officerId}, now(), ${pgArray(ids)}::uuid[])
      on conflict (course_code, term_year, term_semester, instructor_key) do update set
        instructor_name_en = excluded.instructor_name_en,
        instructor_name_th = excluded.instructor_name_th,
        review_count = excluded.review_count,
        workload_en = excluded.workload_en,
        workload_th = excluded.workload_th,
        assessment_en = excluded.assessment_en,
        assessment_th = excluded.assessment_th,
        tips = excluded.tips,
        quotes = excluded.quotes,
        band_counts = excluded.band_counts,
        published_by = excluded.published_by,
        published_at = excluded.published_at,
        submission_ids = excluded.submission_ids
    `;
    return { ok: true, reviewCount: approved.length };
  } catch {
    return { ok: false, reason: "error" };
  }
}

/** Removes a group's published summary. Returns `true` when a summary was removed. Never throws. */
export async function unpublishGroup(key: GroupKey): Promise<boolean> {
  if (!isCourseReviewConfigured()) {
    return false;
  }
  try {
    const result = await sql`
      delete from published_course_reviews
      where course_code = ${key.courseCode}
        and term_year = ${key.term.year}
        and term_semester = ${semesterColumn(key.term)}
        and instructor_key = ${key.instructorKey}
    `;
    return (result.rowCount ?? 0) > 0;
  } catch {
    return false;
  }
}
