import {
  findTimetableEntry,
  formatRoom,
  type ExamSlot,
  type TimetableEntry,
} from "@/content/calendar/timetable";
import type { ClassSlot } from "@/lib/calendar-builder/selection";
import type { Locale } from "@/lib/i18n";

export type MilestoneId = "registration" | "payment" | "classes" | "midterms" | "finals";

export type Milestone = { id: MilestoneId; start: string; end: string };

export const MILESTONES_2569_2: Milestone[] = [
  { id: "registration", start: "2026-11-30", end: "2026-12-04" },
  { id: "payment", start: "2026-11-30", end: "2027-01-01" },
  { id: "classes", start: "2027-01-04", end: "2027-05-01" },
  { id: "midterms", start: "2027-02-23", end: "2027-02-27" },
  { id: "finals", start: "2027-05-03", end: "2027-05-18" },
];

export const PREREQUISITES_2569_2: Record<string, string> = {
  PI321: "PI211",
  PI320: "PI211",
  PI370: "PI280",
  PI374: "PI280",
  PI474: "PI280",
};

export const TAUGHT_WITH_2569_2: Record<string, string> = { PI382: "PI490", PI490: "PI382" };

export type NoClassDay = { start: string; end: string; title: string };

export function entryId(entry: Pick<TimetableEntry, "code" | "section">): string {
  return entry.section ? `${entry.code}-${entry.section}` : entry.code;
}

export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function timesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return toMinutes(aStart) < toMinutes(bEnd) && toMinutes(bStart) < toMinutes(aEnd);
}

export function classesOverlap(a: TimetableEntry, b: TimetableEntry): boolean {
  return a.day === b.day && timesOverlap(a.start, a.end, b.start, b.end);
}

export function examsOverlap(a: ExamSlot, b: ExamSlot): boolean {
  return a.date === b.date && timesOverlap(a.start, a.end, b.start, b.end);
}

export function clashesWith(
  candidate: TimetableEntry,
  picked: readonly TimetableEntry[]
): TimetableEntry[] {
  return picked.filter(
    (other) =>
      entryId(other) !== entryId(candidate) &&
      other.code !== candidate.code &&
      classesOverlap(candidate, other)
  );
}

export function examClashesWith(
  candidate: TimetableEntry,
  picked: readonly TimetableEntry[]
): TimetableEntry[] {
  return picked.filter(
    (other) =>
      other.code !== candidate.code &&
      (examsOverlap(candidate.midterm, other.midterm) || examsOverlap(candidate.final, other.final))
  );
}

export function toggleEntry(
  ids: readonly string[],
  entry: TimetableEntry,
  all: readonly TimetableEntry[]
): string[] {
  const id = entryId(entry);
  if (ids.includes(id)) return ids.filter((x) => x !== id);
  const siblings = new Set(
    all.filter((e) => e.code === entry.code && entryId(e) !== id).map(entryId)
  );
  return [...ids.filter((x) => !siblings.has(x)), id];
}

export function resolveIds(
  ids: readonly string[],
  all: readonly TimetableEntry[]
): TimetableEntry[] {
  const byId = new Map(all.map((e) => [entryId(e), e]));
  const seenCodes = new Set<string>();
  const out: TimetableEntry[] = [];
  for (const id of ids) {
    const entry = byId.get(id);
    if (!entry || seenCodes.has(entry.code)) continue;
    seenCodes.add(entry.code);
    out.push(entry);
  }
  return out.sort(
    (a, b) =>
      a.day - b.day || toMinutes(a.start) - toMinutes(b.start) || a.code.localeCompare(b.code)
  );
}

export function encodeShare(ids: readonly string[]): string {
  return ids.join(",");
}

export function decodeShare(raw: string | null, all: readonly TimetableEntry[]): string[] {
  if (!raw) return [];
  const wanted = raw
    .split(",")
    .map((part) => part.trim().toUpperCase())
    .filter(Boolean);
  return resolveIds(wanted, all).map(entryId);
}

export function idsFromSlots(termKey: string, slots: readonly ClassSlot[]): string[] {
  const ids: string[] = [];
  for (const slot of slots) {
    const entry = findTimetableEntry(termKey, slot.code, slot.section);
    if (entry && !ids.includes(entryId(entry))) ids.push(entryId(entry));
  }
  return ids;
}

export function slotFromEntry(entry: TimetableEntry, locale: Locale): ClassSlot {
  const slot: ClassSlot = {
    code: entry.code,
    day: entry.day,
    start: entry.start,
    end: entry.end,
    place: formatRoom(entry.room, locale),
  };
  if (entry.section) slot.section = entry.section;
  return slot;
}

export function mergeSlots(
  termKey: string,
  existing: readonly ClassSlot[],
  picked: readonly TimetableEntry[],
  locale: Locale
): ClassSlot[] {
  const pickedIds = new Set(picked.map(entryId));
  const kept: ClassSlot[] = [];
  const keptIds = new Set<string>();
  for (const slot of existing) {
    const entry = findTimetableEntry(termKey, slot.code, slot.section);
    if (!entry) {
      if (!picked.some((p) => p.code === slot.code)) kept.push(slot);
      continue;
    }
    if (pickedIds.has(entryId(entry)) && !keptIds.has(entryId(entry))) {
      kept.push(slot);
      keptIds.add(entryId(entry));
    }
  }
  for (const entry of picked) {
    if (!keptIds.has(entryId(entry))) kept.push(slotFromEntry(entry, locale));
  }
  return kept;
}

const DAY_MS = 86_400_000;

function dateValue(key: string): number {
  return Date.parse(`${key}T00:00:00Z`);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((dateValue(to) - dateValue(from)) / DAY_MS);
}

export function addDays(key: string, days: number): string {
  return new Date(dateValue(key) + days * DAY_MS).toISOString().slice(0, 10);
}

export function isoWeekday(key: string): number {
  const d = new Date(dateValue(key)).getUTCDay();
  return d === 0 ? 7 : d;
}

export type MilestoneState = "past" | "now" | "next" | "later";

export type TermStatus = {
  milestones: { milestone: Milestone; state: MilestoneState; daysUntil: number }[];
  focus: { milestone: Milestone; state: "now" | "next"; daysUntil: number } | null;
  week: number | null;
  totalWeeks: number;
  ended: boolean;
};

const FOCUS_ORDER: MilestoneId[] = ["finals", "midterms", "registration", "payment", "classes"];

export function termStatus(today: string, milestones: readonly Milestone[]): TermStatus {
  const upcoming = milestones
    .filter((m) => m.start > today)
    .sort((a, b) => a.start.localeCompare(b.start));
  const nextStart = upcoming[0]?.start;
  const rows = milestones.map((milestone) => {
    let state: MilestoneState = "later";
    if (milestone.end < today) state = "past";
    else if (milestone.start <= today) state = "now";
    else if (milestone.start === nextStart) state = "next";
    return { milestone, state, daysUntil: daysBetween(today, milestone.start) };
  });
  const now = FOCUS_ORDER.map((id) =>
    rows.find((r) => r.milestone.id === id && r.state === "now")
  ).find(Boolean);
  const next = rows.find((r) => r.state === "next");
  const classes = milestones.find((m) => m.id === "classes");
  const totalWeeks = classes ? Math.ceil((daysBetween(classes.start, classes.end) + 1) / 7) : 0;
  const week =
    classes && today >= classes.start && today <= classes.end
      ? Math.floor(daysBetween(classes.start, today) / 7) + 1
      : null;
  const focus = now
    ? { milestone: now.milestone, state: "now" as const, daysUntil: 0 }
    : next
      ? { milestone: next.milestone, state: "next" as const, daysUntil: next.daysUntil }
      : null;
  return { milestones: rows, focus, week, totalWeeks, ended: !focus };
}

export type AgendaKind = "class" | "midterm" | "final";

export type AgendaItem = {
  kind: AgendaKind;
  entry: TimetableEntry;
  date: string;
  start: string;
  end: string;
  room?: string;
};

export function noClassOn(date: string, days: readonly NoClassDay[]): NoClassDay | undefined {
  return days.find((d) => date >= d.start && date <= d.end);
}

export function agendaFor(
  date: string,
  picked: readonly TimetableEntry[],
  milestones: readonly Milestone[],
  noClassDays: readonly NoClassDay[]
): AgendaItem[] {
  const items: AgendaItem[] = [];
  const classes = milestones.find((m) => m.id === "classes");
  const midterms = milestones.find((m) => m.id === "midterms");
  const inTeaching =
    classes !== undefined &&
    date >= classes.start &&
    date <= classes.end &&
    !(midterms && date >= midterms.start && date <= midterms.end) &&
    !noClassOn(date, noClassDays);
  const weekday = isoWeekday(date);
  for (const entry of picked) {
    if (inTeaching && entry.day === weekday) {
      items.push({
        kind: "class",
        entry,
        date,
        start: entry.start,
        end: entry.end,
        room: entry.room,
      });
    }
    if (entry.midterm.date === date) {
      items.push({
        kind: "midterm",
        entry,
        date,
        start: entry.midterm.start,
        end: entry.midterm.end,
      });
    }
    if (entry.final.date === date) {
      const groups = entry.final.groups;
      items.push({
        kind: "final",
        entry,
        date,
        start: entry.final.start,
        end: entry.final.end,
        room:
          entry.final.room ??
          (groups && groups.length > 0 ? groups.map((g) => g.room).join(" / ") : undefined),
      });
    }
  }
  return items.sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
}

export function nextUp(
  today: string,
  nowMinutes: number,
  picked: readonly TimetableEntry[],
  milestones: readonly Milestone[],
  noClassDays: readonly NoClassDay[],
  horizonDays = 60
): { item: AgendaItem; live: boolean } | null {
  if (picked.length === 0) return null;
  for (let offset = 0; offset <= horizonDays; offset++) {
    const date = addDays(today, offset);
    for (const item of agendaFor(date, picked, milestones, noClassDays)) {
      if (offset === 0 && toMinutes(item.end) <= nowMinutes) continue;
      return { item, live: offset === 0 && toMinutes(item.start) <= nowMinutes };
    }
  }
  return null;
}

export type WeekBlock = { entry: TimetableEntry; lane: number; lanes: number; clash: boolean };

export function weekBlocks(picked: readonly TimetableEntry[], day: number): WeekBlock[] {
  const onDay = picked
    .filter((e) => e.day === day)
    .sort((a, b) => toMinutes(a.start) - toMinutes(b.start) || a.code.localeCompare(b.code));
  return onDay.map((entry) => {
    const overlapping = onDay.filter((other) => classesOverlap(entry, other));
    return {
      entry,
      lane: overlapping.indexOf(entry),
      lanes: overlapping.length,
      clash: overlapping.length > 1,
    };
  });
}

export function weekRange(picked: readonly TimetableEntry[]): { from: number; to: number } {
  if (picked.length === 0) return { from: 9 * 60, to: 16 * 60 };
  const starts = picked.map((e) => toMinutes(e.start));
  const ends = picked.map((e) => toMinutes(e.end));
  return {
    from: Math.floor(Math.min(...starts) / 60) * 60,
    to: Math.ceil(Math.max(...ends) / 60) * 60,
  };
}

export const FEE_TABLE: { credits: number; thai: number; foreign: number }[] = [
  { credits: 3, thai: 22895, foreign: 32445 },
  { credits: 6, thai: 30395, foreign: 39945 },
  { credits: 9, thai: 37895, foreign: 47445 },
  { credits: 12, thai: 45395, foreign: 54945 },
  { credits: 15, thai: 52895, foreign: 62445 },
  { credits: 18, thai: 60395, foreign: 69945 },
  { credits: 21, thai: 67895, foreign: 77445 },
];

export function feeFor(credits: number): { thai: number; foreign: number } | null {
  const row = FEE_TABLE.find((r) => r.credits === credits);
  return row ? { thai: row.thai, foreign: row.foreign } : null;
}
