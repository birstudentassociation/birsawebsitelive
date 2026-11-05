/**
 * What the calendar builder keeps in this browser's localStorage. Version 2
 * holds the chosen categories, the chosen term and one class list per term, so
 * switching terms loses nothing. Version 1 (a feed query string with one term's
 * classes) is read once and migrated. Parsing is total: bad input gives defaults.
 */
import {
  CATEGORY_IDS,
  DEFAULT_CATEGORIES,
  MAX_CLASSES,
  decodeSelection,
  decodeSlot,
  encodeSlot,
  type CategoryId,
  type ClassSlot,
} from "./selection";

export const STORAGE_KEY_V1 = "bir-calendar-builder:v1";
export const STORAGE_KEY = "bir-calendar-builder:v2";

export type StoredState = {
  categories: CategoryId[];
  /** Term key the student last chose, or null when none was saved. */
  term: string | null;
  classesByTerm: Record<string, ClassSlot[]>;
};

const TERM_KEY_RE = /^\d{4}-(1|2|summer)$/;

export function emptyStoredState(): StoredState {
  return { categories: [...DEFAULT_CATEGORIES], term: null, classesByTerm: {} };
}

function parseClasses(value: unknown): ClassSlot[] {
  if (!Array.isArray(value)) return [];
  const slots: ClassSlot[] = [];
  for (const raw of value) {
    if (slots.length >= MAX_CLASSES) break;
    if (typeof raw !== "string") continue;
    const slot = decodeSlot(raw);
    if (slot) slots.push(slot);
  }
  return slots;
}

/**
 * The saved state from the version 2 value, else migrated from version 1,
 * else defaults.
 */
export function readStoredState(v2: string | null, v1: string | null): StoredState {
  if (v2) {
    try {
      const data: unknown = JSON.parse(v2);
      if (data && typeof data === "object" && (data as { v?: unknown }).v === 2) {
        const record = data as { inc?: unknown; term?: unknown; classes?: unknown };
        const inc = typeof record.inc === "string" ? record.inc.split(",") : null;
        const classesByTerm: Record<string, ClassSlot[]> = {};
        if (record.classes && typeof record.classes === "object") {
          for (const [key, value] of Object.entries(record.classes)) {
            if (TERM_KEY_RE.test(key)) classesByTerm[key] = parseClasses(value);
          }
        }
        return {
          categories: inc ? CATEGORY_IDS.filter((id) => inc.includes(id)) : [...DEFAULT_CATEGORIES],
          term:
            typeof record.term === "string" && TERM_KEY_RE.test(record.term) ? record.term : null,
          classesByTerm,
        };
      }
    } catch {
      // Fall through to version 1 or defaults.
    }
  }
  if (v1) {
    const old = decodeSelection(new URLSearchParams(v1));
    const hasTerm = new URLSearchParams(v1).has("term");
    return {
      categories: old.categories,
      term: hasTerm && old.term ? old.term : null,
      classesByTerm: old.term && old.classes.length > 0 ? { [old.term]: old.classes } : {},
    };
  }
  return emptyStoredState();
}

export function writeStoredState(state: StoredState): string {
  const classes: Record<string, string[]> = {};
  for (const [key, slots] of Object.entries(state.classesByTerm)) {
    if (slots.length > 0) classes[key] = slots.slice(0, MAX_CLASSES).map(encodeSlot);
  }
  return JSON.stringify({
    v: 2,
    inc: state.categories.join(","),
    term: state.term,
    classes,
  });
}
