/**
 * Grouping submissions for the moderation queue, and the publication
 * threshold that decides when a group may be published.
 *
 * A group is one course, one term and one instructor. The committee set the
 * threshold at five approved submissions, because a small elective can have a
 * dozen students and a single detailed review there is identifiable to the
 * lecturer. Pure functions over plain rows, so the rule is testable without a
 * database and the console and the publish action cannot disagree about it.
 */
import type { AcademicTerm } from "@/content/course-review/types";
import { parseTermKey, termKey } from "@/lib/course-review/terms";

/** A group is published only once this many of its submissions are approved. */
export const PUBLICATION_THRESHOLD = 5;

export type SubmissionStatus = "pending" | "approved" | "rejected";

export const SUBMISSION_STATUSES: readonly SubmissionStatus[] = ["pending", "approved", "rejected"];

/** What identifies a group. */
export type GroupKey = {
  courseCode: string;
  term: AcademicTerm;
  /** An instructor key from lib/course-review/instructors.ts, or "other". */
  instructorKey: string;
};

/** The columns grouping needs; a full submission satisfies it. */
export type GroupableSubmission = GroupKey & { status: SubmissionStatus };

export type GroupCounts = Record<SubmissionStatus, number> & { total: number };

export type SubmissionGroup = {
  key: GroupKey;
  counts: GroupCounts;
};

/** A group's key as one string, for comparing and for use in a URL: "PI280|2567-1|thames". */
export function groupId(key: GroupKey): string {
  return [key.courseCode, termKey(key.term), key.instructorKey].join("|");
}

/** The group a `groupId` string names, or null for anything `groupId` could not have produced. */
export function parseGroupId(id: string): GroupKey | null {
  const parts = id.split("|");
  if (parts.length !== 3) return null;
  const [courseCode, term, instructorKey] = parts as [string, string, string];
  const parsed = parseTermKey(term);
  if (!courseCode || !parsed || !instructorKey) return null;
  return { courseCode, term: parsed, instructorKey };
}

/** True when `approved` submissions are enough to publish. */
export function meetsThreshold(approved: number): boolean {
  return approved >= PUBLICATION_THRESHOLD;
}

/** How many more approved submissions a group needs, never below zero. */
export function approvalsNeeded(approved: number): number {
  return Math.max(0, PUBLICATION_THRESHOLD - approved);
}

function emptyCounts(): GroupCounts {
  return { pending: 0, approved: 0, rejected: 0, total: 0 };
}

/** Counts `submissions` by status. */
export function countStatuses(submissions: readonly { status: SubmissionStatus }[]): GroupCounts {
  const counts = emptyCounts();
  for (const submission of submissions) {
    counts[submission.status] += 1;
    counts.total += 1;
  }
  return counts;
}

/**
 * Groups submissions by course, term and instructor and counts each group's
 * statuses. Groups with something waiting for a decision come first, so the
 * queue opens on work to do; within that, by course code, newest term, then
 * instructor key, which keeps the order stable between page loads.
 */
export function groupSubmissions(submissions: readonly GroupableSubmission[]): SubmissionGroup[] {
  const groups = new Map<string, SubmissionGroup>();
  for (const submission of submissions) {
    const id = groupId(submission);
    let group = groups.get(id);
    if (!group) {
      group = {
        key: {
          courseCode: submission.courseCode,
          term: submission.term,
          instructorKey: submission.instructorKey,
        },
        counts: emptyCounts(),
      };
      groups.set(id, group);
    }
    group.counts[submission.status] += 1;
    group.counts.total += 1;
  }
  return [...groups.values()].sort(
    (a, b) =>
      Number(b.counts.pending > 0) - Number(a.counts.pending > 0) ||
      a.key.courseCode.localeCompare(b.key.courseCode) ||
      b.key.term.year - a.key.term.year ||
      termRank(b.key.term) - termRank(a.key.term) ||
      a.key.instructorKey.localeCompare(b.key.instructorKey)
  );
}

function termRank(term: AcademicTerm): number {
  return term.semester === "summer" ? 3 : term.semester;
}
