/**
 * The calendar builder's selection model: which categories of public dates a
 * student wants, plus their own weekly class slots. Pure; it round-trips
 * through the feed URL's query string and never throws on decode.
 */
import type { CalendarEvent } from "@/content/calendar/events";
import { teachingTerms } from "@/content/calendar/terms";
import type { Locale } from "@/lib/i18n";

export type CategoryId = "birsa" | "holidays" | "registration" | "classes";

export const CATEGORY_IDS: readonly CategoryId[] = ["birsa", "holidays", "registration", "classes"];

export const DEFAULT_CATEGORIES: readonly CategoryId[] = ["birsa", "holidays", "registration"];

export type ClassSlot = {
  /** Course code, e.g. `PI271`. */
  code: string;
  /** ISO weekday, Monday = 1 to Sunday = 7. */
  day: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** `HH:MM`, 24-hour. */
  start: string;
  /** `HH:MM`, 24-hour. */
  end: string;
  place?: string;
};

export type Selection = {
  categories: CategoryId[];
  /** Term key `<BE year>-<semester>`, e.g. `2569-2`. */
  term: string;
  classes: ClassSlot[];
};

export const MAX_CLASSES = 20;
export const MAX_PLACE_LENGTH = 40;

export type ClassSlotError =
  | "code-missing"
  | "code-invalid"
  | "day-missing"
  | "start-invalid"
  | "end-invalid"
  | "end-before-start"
  | "place-too-long";

const CODE_RE = /^[A-Z]{2,4}\d{3}[A-Z]?$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const TERM_RE = /^\d{4}-(1|2|summer)$/;

/** Input to validation: a form's possibly incomplete slot. */
export type ClassSlotDraft = {
  code?: string;
  day?: number;
  start?: string;
  end?: string;
  place?: string;
};

/** Every problem with a slot, in a stable order; empty when it is valid. */
export function validateClassSlot(slot: ClassSlotDraft): ClassSlotError[] {
  const errors: ClassSlotError[] = [];
  const code = (slot.code ?? "").trim().toUpperCase();
  if (!code) errors.push("code-missing");
  else if (!CODE_RE.test(code)) errors.push("code-invalid");
  if (!Number.isInteger(slot.day) || (slot.day as number) < 1 || (slot.day as number) > 7) {
    errors.push("day-missing");
  }
  const startOk = TIME_RE.test(slot.start ?? "");
  const endOk = TIME_RE.test(slot.end ?? "");
  if (!startOk) errors.push("start-invalid");
  if (!endOk) errors.push("end-invalid");
  if (startOk && endOk && (slot.end as string) <= (slot.start as string)) {
    errors.push("end-before-start");
  }
  if ((slot.place ?? "").trim().length > MAX_PLACE_LENGTH) errors.push("place-too-long");
  return errors;
}

/** The category a public event belongs to. */
export function categoryForEvent(event: CalendarEvent): Exclude<CategoryId, "classes"> {
  if (event.academic) return "registration";
  return event.kind === "birsa" ? "birsa" : "holidays";
}

/** The public events in the chosen categories, in their original order. */
export function eventsForCategories(
  events: CalendarEvent[],
  categories: readonly CategoryId[]
): CalendarEvent[] {
  const chosen = new Set(categories);
  return events.filter((event) => {
    if (event.academic) return chosen.has("registration");
    if (event.kind === "birsa") return chosen.has("birsa");
    return chosen.has("holidays");
  });
}

function defaultTerm(): string {
  const first = teachingTerms[0];
  return first ? `${first.term.year}-${first.term.semester}` : "";
}

/** Encodes a selection as query parameters (`inc`, `term`, repeated `c`). */
export function encodeSelection(selection: Selection): URLSearchParams {
  const params = new URLSearchParams();
  params.set("inc", selection.categories.join(","));
  params.set("term", selection.term);
  for (const slot of selection.classes) {
    const hhmm = (t: string) => t.replace(":", "");
    const place = slot.place?.trim() ?? "";
    params.append(
      "c",
      [slot.code.trim().toUpperCase(), slot.day, hhmm(slot.start), hhmm(slot.end), place].join("~")
    );
  }
  return params;
}

function decodeSlot(raw: string): ClassSlot | null {
  const [code = "", day = "", start = "", end = "", ...rest] = raw.split("~");
  const time = (t: string) => (/^\d{4}$/.test(t) ? `${t.slice(0, 2)}:${t.slice(2)}` : t);
  const draft = {
    code: code.trim().toUpperCase(),
    day: /^[1-7]$/.test(day) ? Number(day) : undefined,
    start: time(start),
    end: time(end),
    place: rest.join("~").trim(),
  };
  if (validateClassSlot(draft).length > 0) return null;
  const slot: ClassSlot = {
    code: draft.code,
    day: draft.day as ClassSlot["day"],
    start: draft.start,
    end: draft.end,
  };
  if (draft.place) slot.place = draft.place;
  return slot;
}

/**
 * Decodes a selection from query parameters. Total: unknown categories,
 * malformed slots and anything past `MAX_CLASSES` are dropped. A missing
 * `inc` means the defaults; an empty one means nothing.
 */
export function decodeSelection(params: URLSearchParams): Selection {
  const inc = params.get("inc");
  const categories =
    inc === null
      ? [...DEFAULT_CATEGORIES]
      : CATEGORY_IDS.filter((id) => inc.split(",").includes(id));
  const term = params.get("term") ?? "";
  const classes: ClassSlot[] = [];
  for (const raw of params.getAll("c")) {
    if (classes.length >= MAX_CLASSES) break;
    const slot = decodeSlot(raw);
    if (slot) classes.push(slot);
  }
  return { categories, term: TERM_RE.test(term) ? term : defaultTerm(), classes };
}

/** Path (with query) of the personal feed for a selection. */
export function feedPath(locale: Locale, selection: Selection): string {
  return `/${locale}/my-calendar.ics?${encodeSelection(selection).toString()}`;
}
