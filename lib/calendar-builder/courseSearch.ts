/**
 * Filtering for the class form's course combobox. Pure and React free.
 *
 * A query is matched against the course code, title, lecturer, day names in
 * English and Thai, class and exam rooms, times and group names, ignoring
 * case, spaces and dots. Every word of the query has to match somewhere, so
 * "tue pi2" finds Tuesday courses with a PI2xx code. A lone digit only matches
 * a whole word, so "year 1" does not drag in Year 2 and Year 3.
 */
import {
  TIMETABLE_GROUPS,
  TIMETABLE_GROUP_NAMES,
  formatRoom,
  timetableForTerm,
  type TimetableEntry,
  type TimetableGroup,
} from "@/content/calendar/timetable";

export const DAY_NAMES_EN = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
export const DAY_NAMES_TH = [
  "วันจันทร์",
  "วันอังคาร",
  "วันพุธ",
  "วันพฤหัสบดี",
  "วันศุกร์",
  "วันเสาร์",
  "วันอาทิตย์",
] as const;

/** The most "other" courses listed at once, so an empty query is not a wall of options. */
export const OTHER_COURSE_LIMIT = 30;

export type CurriculumCourse = { code: string; title: string };

export type CourseResult =
  | {
      kind: "timetable";
      /** Stable option id, the course code. */
      key: string;
      code: string;
      title: string;
      /** One entry, or two for a course with sections. */
      entries: TimetableEntry[];
    }
  | { kind: "other"; key: string; code: string; title: string };

export type CourseResultGroup = {
  id: string;
  label: string;
  kind: "timetable" | "other";
  options: CourseResult[];
};

export type CourseSearchResult = {
  groups: CourseResultGroup[];
  /** Options shown. */
  shown: number;
  /** "Other" courses matching beyond the limit. */
  hidden: number;
};

/** Lowercases and drops dots and zero width spaces, keeping a map back to the source text. */
function foldWithMap(text: string): { folded: string; map: number[] } {
  let folded = "";
  const map: number[] = [];
  const source = text.normalize("NFC");
  for (let i = 0; i < source.length; i++) {
    const ch = source[i] as string;
    if (ch === "." || ch === "​") continue;
    const lower = ch.toLowerCase();
    for (let j = 0; j < lower.length; j++) {
      folded += lower[j];
      map.push(i);
    }
  }
  return { folded, map };
}

export function fold(text: string): string {
  return foldWithMap(text).folded;
}

/** Words of a query, folded, in order. Empty for a blank query. */
export function queryTokens(query: string): string[] {
  return query
    .trim()
    .split(/\s+/)
    .map(fold)
    .filter((t) => t.length > 0);
}

const compact = (text: string) => fold(text).replace(/\s+/g, "");

function tokenIn(token: string, field: string): boolean {
  if (token.length === 1 && /\d/.test(token)) {
    return field.split(/[\s:,/()-]+/).includes(token);
  }
  return field.includes(token);
}

/**
 * How a query is read. `strict` wants the whole query, spaces ignored, inside
 * one field ("pi 271" is PI271). `tokens` wants each word somewhere ("tue pi2").
 * `any` accepts either.
 */
export type MatchMode = "any" | "strict" | "tokens";

/** Whether a query matches any of the fields. A blank query matches. */
export function matchesFields(
  fields: readonly string[],
  query: string,
  mode: MatchMode = "any"
): boolean {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return true;
  if (mode !== "tokens") {
    const whole = compact(query);
    if (whole && fields.some((f) => compact(f).includes(whole))) return true;
    if (mode === "strict") return false;
  }
  const folded = fields.map(fold);
  return tokens.every((token) => folded.some((field) => tokenIn(token, field)));
}

function timetableFields(entries: TimetableEntry[]): string[] {
  const first = entries[0] as TimetableEntry;
  const fields = [first.code, first.title];
  if (first.lecturer) fields.push(first.lecturer);
  const names = TIMETABLE_GROUP_NAMES[first.group];
  fields.push(names.en, names.th);
  fields.push(DAY_NAMES_EN[first.day - 1] as string, DAY_NAMES_TH[first.day - 1] as string);
  fields.push(DAY_NAMES_EN[first.day - 1]?.slice(0, 3) as string);
  fields.push(first.start, first.end);
  for (const entry of entries) {
    for (const room of [
      entry.room,
      entry.final.room,
      ...(entry.final.groups ?? []).map((g) => g.room),
    ]) {
      if (!room) continue;
      fields.push(room, formatRoom(room, "th"));
    }
    if (entry.section) fields.push(entry.section);
  }
  return fields;
}

/** Timetable entries grouped by course code, keeping the timetable's order. */
function entriesByCode(termKey: string): Map<string, TimetableEntry[]> {
  const byCode = new Map<string, TimetableEntry[]>();
  for (const entry of timetableForTerm(termKey)) {
    const list = byCode.get(entry.code);
    if (list) list.push(entry);
    else byCode.set(entry.code, [entry]);
  }
  return byCode;
}

export type SearchCoursesInput = {
  termKey: string;
  query: string;
  locale: "en" | "th";
  curriculum: readonly CurriculumCourse[];
  /** Heading for courses outside the timetable. */
  otherLabel: string;
};

/**
 * Timetabled courses first, grouped Year 1, Year 2 required, Year 3 then the
 * minor groups, then curriculum courses the timetable does not list.
 */
export function searchCourses(input: SearchCoursesInput): CourseSearchResult {
  const { termKey, query, locale, curriculum, otherLabel } = input;
  const byCode = entriesByCode(termKey);
  // Reading the query as one run of characters ("pi 300", "year 1") is more
  // exact than word by word, so it wins whenever it finds anything.
  const strictHit =
    [...byCode.values()].some((entries) =>
      matchesFields(timetableFields(entries), query, "strict")
    ) || curriculum.some((c) => matchesFields([c.code, c.title], query, "strict"));
  const mode: MatchMode = strictHit ? "strict" : "tokens";
  const groups: CourseResultGroup[] = [];
  const byGroup = new Map<TimetableGroup, CourseResult[]>();
  for (const [code, entries] of byCode) {
    if (!matchesFields(timetableFields(entries), query, mode)) continue;
    const first = entries[0] as TimetableEntry;
    const list = byGroup.get(first.group) ?? [];
    list.push({ kind: "timetable", key: code, code, title: first.title, entries });
    byGroup.set(first.group, list);
  }
  for (const group of TIMETABLE_GROUPS) {
    const options = byGroup.get(group);
    if (options?.length) {
      groups.push({
        id: group,
        label: TIMETABLE_GROUP_NAMES[group][locale],
        kind: "timetable",
        options,
      });
    }
  }
  let shown = groups.reduce((n, g) => n + g.options.length, 0);
  const others = curriculum.filter(
    (course) => !byCode.has(course.code) && matchesFields([course.code, course.title], query, mode)
  );
  let hidden = 0;
  if (others.length > 0) {
    const options: CourseResult[] = others
      .slice(0, OTHER_COURSE_LIMIT)
      .map((c) => ({ kind: "other", key: c.code, code: c.code, title: c.title }));
    hidden = others.length - options.length;
    shown += options.length;
    groups.push({ id: "other", label: otherLabel, kind: "other", options });
  }
  return { groups, shown, hidden };
}

export type HighlightPart = { text: string; match: boolean };

/** Splits text into parts, marking where the query's words occur. */
export function highlightParts(text: string, query: string): HighlightPart[] {
  const tokens = queryTokens(query).filter((t) => t.length > 1 || !/\d/.test(t));
  if (tokens.length === 0 || !text) return [{ text, match: false }];
  const { folded, map } = foldWithMap(text);
  const marked = new Array<boolean>(text.length).fill(false);
  for (const token of tokens) {
    let at = folded.indexOf(token);
    while (at !== -1) {
      const from = map[at] as number;
      const to = (map[at + token.length - 1] as number) + 1;
      for (let i = from; i < to; i++) marked[i] = true;
      at = folded.indexOf(token, at + 1);
    }
  }
  const parts: HighlightPart[] = [];
  for (let i = 0; i < text.length; i++) {
    const match = marked[i] as boolean;
    const last = parts[parts.length - 1];
    if (last && last.match === match) last.text += text[i];
    else parts.push({ text: text[i] as string, match });
  }
  return parts;
}
