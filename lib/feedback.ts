/**
 * Data access for the satisfaction feedback feature (GOV.UK Service Manual,
 * "feedback pages"): submitting a response, reading it back for the officer
 * console, and a CSV export builder.
 *
 * Follows the same convention as lib/inventory/db.ts: import `sql` from
 * `@vercel/postgres` directly and gate every read/write behind
 * `isFeedbackConfigured()`, so the site stays buildable and renderable with
 * zero environment configuration and a missing database never crashes a
 * page. This module is kept self-contained (its own `sql` import and its own
 * tiny CSV helpers) rather than importing from lib/inventory/*, because
 * feedback is a site-wide concern, not part of the inventory suite; both
 * simply point at the same POSTGRES_URL.
 */
import { sql } from "@vercel/postgres";
import { FEEDBACK_RATINGS, type FeedbackRating } from "@/lib/validation";

export function isFeedbackConfigured(): boolean {
  return !!process.env.POSTGRES_URL;
}

export type FeedbackEntry = {
  id: string;
  rating: FeedbackRating;
  comment: string | null;
  locale: "en" | "th";
  /** The path the feedback was given from, e.g. "/en/contact". */
  path: string;
  createdAt: string;
};

type FeedbackRow = {
  id: string;
  rating: FeedbackRating;
  comment: string | null;
  locale: "en" | "th";
  source_path: string;
  created_at: string;
};

function mapFeedback(row: FeedbackRow): FeedbackEntry {
  return {
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    locale: row.locale,
    path: row.source_path,
    createdAt: row.created_at,
  };
}

export type SubmitFeedbackInput = {
  rating: FeedbackRating;
  /** Pass "" for no comment; stored as null. */
  comment: string;
  locale: "en" | "th";
  path: string;
};

/**
 * Inserts one feedback response. Returns `false` (never throws) when the
 * database isn't configured or the insert fails, matching the site-wide
 * "degrade gracefully" convention: the caller decides what to show the
 * reader, but the page itself never breaks.
 */
export async function submitFeedback(input: SubmitFeedbackInput): Promise<boolean> {
  if (!isFeedbackConfigured()) {
    return false;
  }
  try {
    await sql`
      insert into satisfaction_feedback (rating, comment, locale, source_path)
      values (${input.rating}, ${input.comment || null}, ${input.locale}, ${input.path})
    `;
    return true;
  } catch {
    return false;
  }
}

// Caps the on-screen recent-comments list so the officer console never loads
// an unbounded result set into a client-paginated table (mirrors
// lib/inventory/borrowers.ts, which loads its full list client-side too).
// The CSV export below uses the same cap: the comment column is unmoderated
// free text a visitor could have typed anything into, so this site holds no
// more of it than it has to, per the data-minimisation audit.
const RECENT_LIMIT = 500;

/** Most recent feedback responses, newest first, capped at RECENT_LIMIT. For the officer console's on-screen list; see `feedbackCsv` for the uncapped export. */
export async function listRecentFeedback(): Promise<FeedbackEntry[]> {
  if (!isFeedbackConfigured()) {
    return [];
  }
  try {
    const result = await sql<FeedbackRow>`
      select id, rating, comment, locale, source_path, created_at
      from satisfaction_feedback
      order by created_at desc
      limit ${RECENT_LIMIT}
    `;
    return result.rows.map(mapFeedback);
  } catch {
    return [];
  }
}

/** A record with every rating present, set to 0. Pure; the starting point `mergeRatingCounts` fills in. */
export function zeroRatingCounts(): Record<FeedbackRating, number> {
  const counts = {} as Record<FeedbackRating, number>;
  for (const rating of FEEDBACK_RATINGS) {
    counts[rating] = 0;
  }
  return counts;
}

/**
 * Merges partial (rating, count) pairs, such as a SQL `group by rating`
 * result, into a full record covering all five ratings (missing ones read as
 * 0). Pure and DB-free so it's covered directly by unit tests.
 */
export function mergeRatingCounts(
  rows: { rating: FeedbackRating; count: number }[]
): Record<FeedbackRating, number> {
  const counts = zeroRatingCounts();
  for (const row of rows) {
    counts[row.rating] = row.count;
  }
  return counts;
}

/**
 * The share of responses that were "satisfied" or "very satisfied", rounded
 * to the nearest whole percent. Pure; returns 0 (rather than NaN) when there
 * are no responses at all.
 */
export function satisfactionRate(counts: Record<FeedbackRating, number>): number {
  const total = FEEDBACK_RATINGS.reduce((sum, rating) => sum + counts[rating], 0);
  if (total === 0) {
    return 0;
  }
  const satisfied = counts.very_satisfied + counts.satisfied;
  return Math.round((satisfied / total) * 100);
}

/** Rating distribution across all responses (not capped), zero-filled for every rating. Powers the officer console's summary cards. */
export async function getRatingCounts(): Promise<Record<FeedbackRating, number>> {
  if (!isFeedbackConfigured()) {
    return zeroRatingCounts();
  }
  try {
    const result = await sql<{ rating: FeedbackRating; count: string }>`
      select rating, count(*)::text as count
      from satisfaction_feedback
      group by rating
    `;
    return mergeRatingCounts(
      result.rows.map((row) => ({ rating: row.rating, count: Number(row.count) }))
    );
  } catch {
    return zeroRatingCounts();
  }
}

/** Wraps a CSV field in double quotes (doubling internal quotes) when it contains a comma, quote, or newline. */
function csvField(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function csvRow(fields: unknown[]): string {
  return fields.map(csvField).join(",");
}

/** Builds a CSV string (header + rows) with CRLF line endings, including a trailing CRLF. */
function buildCsv(header: string[], rows: unknown[][]): string {
  const lines = [csvRow(header), ...rows.map((row) => csvRow(row))];
  return lines.join("\r\n") + "\r\n";
}

const FEEDBACK_CSV_HEADER = ["rating", "comment", "locale", "path", "submittedAt"];

/**
 * Every feedback response as a CSV file, oldest first (natural reading
 * order for a downloaded log), for the officer console's export link.
 * Capped at RECENT_LIMIT, the same cap as `listRecentFeedback`, so the
 * export cannot hold more unmoderated free text than the on-screen list
 * does. Returns a header-only string when the database isn't configured or
 * the query fails, so the download link always produces a valid (if empty)
 * file rather than an error page.
 */
export async function feedbackCsv(): Promise<string> {
  if (!isFeedbackConfigured()) {
    return buildCsv(FEEDBACK_CSV_HEADER, []);
  }
  try {
    const result = await sql<FeedbackRow>`
      select * from (
        select id, rating, comment, locale, source_path, created_at
        from satisfaction_feedback
        order by created_at desc
        limit ${RECENT_LIMIT}
      ) recent
      order by created_at asc
    `;
    const rows = result.rows.map((row) => [
      row.rating,
      row.comment ?? "",
      row.locale,
      row.source_path,
      row.created_at,
    ]);
    return buildCsv(FEEDBACK_CSV_HEADER, rows);
  } catch {
    return buildCsv(FEEDBACK_CSV_HEADER, []);
  }
}
