/**
 * Which term kind a course is designated to, kept in one place for every
 * curriculum version. Codes are shared across versions, so one map keyed by
 * code serves all of them and a version cannot drift from the others.
 *
 * Only semester 2 designations exist today, taken from the faculty's course
 * offering for Academic Year 2026, semester 2. A designated course cannot be
 * placed in a semester 1 term. Summer is deliberately not restricted.
 */
import type { Derived, TermKind } from "./types";

/** The term kind a course is taught in. */
export type DesignatedTerm = "semester2";

const SEMESTER_2_COURSES = [
  "AH208",
  "LAS101",
  "PI122",
  "PI211",
  "PI270",
  "PI271",
  "PI272",
  "PI292",
  "PI320",
  "PI321",
  "PI341",
  "PI342",
  "PI343",
  "PI346",
  "PI370",
  "PI374",
  "PI381",
  "PI382",
  "PI384",
  "PI387",
  "PI397",
  "PI414",
  "PI474",
  "PI478",
  "PI479",
  "PI480",
  "PI488",
  "PI489",
  "PI490",
  "PI494",
  "PI495",
  "TU102",
] as const;

export const OFFERING_TERMS: Derived<Readonly<Record<string, DesignatedTerm>>> = {
  value: Object.fromEntries(SEMESTER_2_COURSES.map((code) => [code, "semester2" as const])),
  derivation: { kind: "published", source: "courseOffering2026S2" },
};

/** The term kind a course is designated to, or null when none is recorded. */
export function designatedTerm(code: string): DesignatedTerm | null {
  return Object.hasOwn(OFFERING_TERMS.value, code) ? OFFERING_TERMS.value[code]! : null;
}

/** False only for a designated semester 2 course in a semester 1 term. */
export function canPlaceInTerm(code: string, kind: TermKind): boolean {
  return !(designatedTerm(code) === "semester2" && kind === "semester1");
}
