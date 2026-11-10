import { academicCalendar2569 } from "@/content/calendar/academic-2569";
import { calendarEvents, type AcademicWindowKind } from "@/content/calendar/events";
import { teachingTerms } from "@/content/calendar/terms";
import type { AcademicTerm } from "@/content/course-review/types";

export type DateWindow = { start: string; end: string };

export type NextTermJourney = {
  term: AcademicTerm;
  termKey: string;
  teachingStart: string;
  registration?: DateWindow;
  payment?: DateWindow;
  addDrop?: DateWindow;
  journeyEnd: string;
};

export type JourneyPhase =
  | { kind: "beforeRegistration"; date: string }
  | { kind: "registrationOpen"; date: string }
  | { kind: "beforeAddDrop"; date: string }
  | { kind: "addDropOpen"; date: string }
  | { kind: "beforeTerm"; date: string };

export const CHIP_LEAD_DAYS = 42;

function dayNumber(key: string): number {
  const [year = 0, month = 1, day = 1] = key.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

function keyOf(term: AcademicTerm): string {
  return `${term.year}-${term.semester}`;
}

function windowFor(term: AcademicTerm, kind: AcademicWindowKind): DateWindow | undefined {
  const event = calendarEvents.find(
    (candidate) =>
      candidate.academic?.window === kind && keyOf(candidate.academic.term) === keyOf(term)
  );
  return event ? { start: event.start, end: event.end ?? event.start } : undefined;
}

function paymentFor(term: AcademicTerm): DateWindow | undefined {
  const prefix = `s${term.semester}`;
  for (const period of academicCalendar2569) {
    if (!period.id.startsWith(prefix) || period.track === "registrar") continue;
    const item = period.items.find((candidate) => /^s\d+b?-pay$/.test(candidate.id));
    if (item) return { start: item.start, end: item.end ?? item.start };
  }
  return undefined;
}

export function getNextTermJourney(todayKey: string): NextTermJourney | null {
  const sorted = [...teachingTerms].sort((a, b) => a.start.localeCompare(b.start));
  for (const teaching of sorted) {
    const registration = windowFor(teaching.term, "registration");
    const addDrop = windowFor(teaching.term, "add-drop");
    const journeyEnd = addDrop?.end ?? teaching.start;
    if (journeyEnd < todayKey) continue;
    return {
      term: teaching.term,
      termKey: keyOf(teaching.term),
      teachingStart: teaching.start,
      registration,
      payment: teaching.term.year === 2569 ? paymentFor(teaching.term) : undefined,
      addDrop,
      journeyEnd,
    };
  }
  return null;
}

export function getJourneyPhase(journey: NextTermJourney, todayKey: string): JourneyPhase {
  const { registration, addDrop, teachingStart } = journey;
  if (registration && todayKey < registration.start) {
    return { kind: "beforeRegistration", date: registration.start };
  }
  if (registration && todayKey <= registration.end) {
    return { kind: "registrationOpen", date: registration.end };
  }
  if (addDrop && todayKey < addDrop.start) return { kind: "beforeAddDrop", date: addDrop.start };
  if (addDrop && todayKey <= addDrop.end) return { kind: "addDropOpen", date: addDrop.end };
  return { kind: "beforeTerm", date: teachingStart };
}

export function shouldShowJourneyChip(journey: NextTermJourney, todayKey: string): boolean {
  const opensFrom = journey.registration?.start ?? journey.teachingStart;
  return (
    dayNumber(todayKey) >= dayNumber(opensFrom) - CHIP_LEAD_DAYS && todayKey <= journey.journeyEnd
  );
}
