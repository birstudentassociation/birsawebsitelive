/**
 * Exam events for the classes a student has added, taken from the BIR
 * timetable. Pure; shared by the feed and the preview so they always agree.
 */
import { findTimetableEntry, formatRoom, type FinalExam } from "@/content/calendar/timetable";
import type { Locale } from "@/lib/i18n";
import type { ClassSlot } from "./selection";

export type ExamKind = "midterm" | "final";

export type ExamOccurrence = {
  /** Stable id, also the basis of the feed's UID. */
  id: string;
  kind: ExamKind;
  code: string;
  title: string;
  section?: string;
  /** `YYYY-MM-DD`. */
  date: string;
  start: string;
  end: string;
  /** Exam room text in the reader's language; absent when none is announced. */
  room?: string;
};

function finalRoom(exam: FinalExam, locale: Locale): string | undefined {
  if (exam.groups && exam.groups.length > 0) {
    return exam.groups
      .map((g) =>
        locale === "th"
          ? `กลุ่ม ${g.group} ${formatRoom(g.room, locale)}`
          : `group ${g.group} ${g.room}`
      )
      .join(locale === "th" ? " " : ", ")
      .replace(/^group/, "Group");
  }
  return exam.room ? formatRoom(exam.room, locale) : undefined;
}

/**
 * Midterm and final for every class that is in the term's timetable, in date
 * order. A class with sections but no section chosen, or a course the
 * timetable does not list, has none.
 */
export function examOccurrences(
  termKey: string,
  classes: readonly ClassSlot[],
  locale: Locale
): ExamOccurrence[] {
  const seen = new Set<string>();
  const out: ExamOccurrence[] = [];
  for (const slot of classes) {
    const entry = findTimetableEntry(termKey, slot.code, slot.section);
    if (!entry) continue;
    const base = `exam-${termKey}-${entry.code}${entry.section ? `-${entry.section}` : ""}`;
    if (seen.has(base)) continue;
    seen.add(base);
    const common = {
      code: entry.code,
      title: entry.title,
      ...(entry.section ? { section: entry.section } : {}),
    };
    out.push({
      id: `${base}-midterm`,
      kind: "midterm",
      ...common,
      ...entry.midterm,
    });
    const room = finalRoom(entry.final, locale);
    out.push({
      id: `${base}-final`,
      kind: "final",
      ...common,
      date: entry.final.date,
      start: entry.final.start,
      end: entry.final.end,
      ...(room ? { room } : {}),
    });
  }
  return out.sort(
    (a, b) =>
      a.date.localeCompare(b.date) || a.start.localeCompare(b.start) || a.id.localeCompare(b.id)
  );
}

/** "Midterm PI271 Introduction to International Relations", or the Thai equivalent. */
export function examTitle(exam: ExamOccurrence, locale: Locale): string {
  const kind =
    locale === "th"
      ? exam.kind === "midterm"
        ? "สอบกลางภาค"
        : "สอบปลายภาค"
      : exam.kind === "midterm"
        ? "Midterm"
        : "Final";
  const section = exam.section
    ? locale === "th"
      ? ` ตอน ${exam.section}`
      : ` section ${exam.section}`
    : "";
  return `${kind} ${exam.code} ${exam.title}${section}`;
}
