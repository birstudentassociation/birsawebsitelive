/**
 * Pure text matching behind `components/forms/CourseCombobox.tsx`.
 *
 * Kept free of React (and of anything DOM-shaped) so it can be exercised
 * directly in tests and reused server-side by `resolveCourseCode` below,
 * which Server Actions call when a typed course name reaches the server
 * without ever having been resolved to a code client-side (JavaScript off,
 * or a blur that never fired).
 */

export type MatchableOption = { value: string; label: string; keywords?: string };

/**
 * Lowercased, punctuation-stripped, whitespace-collapsed form used for every
 * comparison in this file. Unicode-aware so Thai letters (and any other
 * script) survive; only punctuation and symbols are stripped.
 */
export function normaliseCourseQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Options whose label+keywords contain every whitespace-separated token of
 * the query, each as a substring. Order is preserved. An empty query returns
 * every option unchanged, so this doubles as "show everything" when nothing
 * has been typed yet.
 */
export function filterCourseOptions<T extends MatchableOption>(options: T[], query: string): T[] {
  const normalisedQuery = normaliseCourseQuery(query);
  if (normalisedQuery === "") return options;

  const tokens = normalisedQuery.split(" ");
  return options.filter((option) => {
    const haystack = normaliseCourseQuery(`${option.label} ${option.keywords ?? ""}`);
    return tokens.every((token) => haystack.includes(token));
  });
}

/**
 * The single option a typed string unambiguously means, or null. Tried in
 * order: an exact (case-insensitive) match on `value` always wins first, so
 * typing the bare course code ("PI380") resolves even when several labels
 * contain that string as a substring; then an exact match on the normalised
 * label; then, if the filter narrows to exactly one option, that one; then,
 * among several filtered options, one whose normalised label starts with the
 * normalised query, if exactly one does. An empty/whitespace-only query
 * always returns null — there is nothing to unambiguously mean.
 */
export function resolveCourseQuery<T extends MatchableOption>(
  options: T[],
  query: string
): T | null {
  const normalisedQuery = normaliseCourseQuery(query);
  if (normalisedQuery === "") return null;

  const trimmedQuery = query.trim().toLowerCase();
  const byValue = options.find((option) => option.value.toLowerCase() === trimmedQuery);
  if (byValue) return byValue;

  const byLabel = options.find((option) => normaliseCourseQuery(option.label) === normalisedQuery);
  if (byLabel) return byLabel;

  const filtered = filterCourseOptions(options, query);
  if (filtered.length === 1) return filtered[0] ?? null;
  if (filtered.length > 1) {
    const prefixMatches = filtered.filter((option) =>
      normaliseCourseQuery(option.label).startsWith(normalisedQuery)
    );
    if (prefixMatches.length === 1) return prefixMatches[0] ?? null;
  }

  return null;
}

/**
 * The server-side counterpart of the combobox above: given the catalogue and
 * whatever text reached the server, returns the course code it unambiguously
 * means, or null. Server Actions call this to accept a typed course name
 * that arrived unresolved (JavaScript off, or a blur that never fired), so
 * the same matching rules apply on the server as in the browser.
 */
export function resolveCourseCode(
  courses: { code: string; title: string }[],
  raw: string
): string | null {
  const options = courses.map((course) => ({
    value: course.code,
    label: `${course.code} ${course.title}`,
  }));
  const match = resolveCourseQuery(options, raw);
  return match ? match.value : null;
}
