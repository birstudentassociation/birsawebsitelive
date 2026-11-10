import { academicCalendar2569, type AcademicItem } from "@/content/calendar/academic-2569";
import { calendarEvents, type CalendarEvent } from "@/content/calendar/events";
import { dueSoonCopy } from "@/components/home/dueSoonCopy";
import type { Locale } from "@/lib/i18n";

export type DueSource = "birsa" | "university" | "birOffice";

export type DueItem = {
  id: string;
  start: string;
  end?: string;
  title: string;
  href: string;
  source: DueSource;
  daysUntil: number;
  ongoing: boolean;
  closesInDays?: number;
  action?: { label: string; href: string };
};

const DEFAULT_LIMIT = 5;
const DEFAULT_WINDOW_DAYS = 30;
const CLOSING_SOON_DAYS = 14;
const ACADEMIC_CALENDAR_HREF = "/news/academic-calendar-2569";
const STUDY_PLAN_HREF = "/services/study-plan";
const WITHDRAW_GUIDE_HREF = "/student-life/studying/registration";
const CUT_OFF_KINDS: AcademicItem["kind"][] = ["deadline", "withdrawal", "registration"];

type Candidate = {
  id: string;
  start: string;
  end?: string;
  title: string;
  href: string;
  source: DueSource;
  fromAcademic: boolean;
  isCutOff: boolean;
  isRegistrationWindow: boolean;
  isWithdrawal: boolean;
};

function dayNumber(key: string): number {
  const [year = 0, month = 1, day = 1] = key.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

function lastDay(candidate: { start: string; end?: string }): string {
  return candidate.end ?? candidate.start;
}

function fromEvent(event: CalendarEvent, locale: Locale): Candidate {
  const source: DueSource = event.academic
    ? "birOffice"
    : event.kind === "birsa"
      ? "birsa"
      : "university";
  return {
    id: event.id,
    start: event.start,
    end: event.end,
    title: event.title[locale],
    href: `/news/${event.slug}`,
    source,
    fromAcademic: false,
    isCutOff: Boolean(event.academic),
    isRegistrationWindow: event.academic?.window === "registration",
    isWithdrawal: false,
  };
}

function fromAcademicItem(item: AcademicItem, locale: Locale): Candidate {
  return {
    id: item.id,
    start: item.start,
    end: item.end,
    title: item.title[locale],
    href: ACADEMIC_CALENDAR_HREF,
    source: "university",
    fromAcademic: true,
    isCutOff: CUT_OFF_KINDS.includes(item.kind),
    isRegistrationWindow: item.kind === "registration" && item.id.endsWith("-register"),
    isWithdrawal: item.kind === "withdrawal",
  };
}

function academicCandidates(locale: Locale): Candidate[] {
  return academicCalendar2569
    .filter((period) => period.track === undefined || period.track === "bir")
    .flatMap((period) => period.items.map((item) => fromAcademicItem(item, locale)));
}

function describesSameWindow(a: Candidate, b: Candidate): boolean {
  return a.start === b.start && lastDay(a) === lastDay(b);
}

function withoutShadowedAcademicItems(events: Candidate[], academic: Candidate[]): Candidate[] {
  return academic.filter((item) => !events.some((event) => describesSameWindow(event, item)));
}

function toDueItem(candidate: Candidate, todayKey: string, locale: Locale): DueItem {
  const today = dayNumber(todayKey);
  const startsIn = dayNumber(candidate.start) - today;
  const ongoing = candidate.start <= todayKey && lastDay(candidate) >= todayKey;
  const daysToLastDay = dayNumber(lastDay(candidate)) - today;
  const labels = dueSoonCopy[locale].actions;

  const item: DueItem = {
    id: candidate.id,
    start: candidate.start,
    title: candidate.title,
    href: candidate.href,
    source: candidate.source,
    daysUntil: Math.max(0, startsIn),
    ongoing,
  };
  if (candidate.end) item.end = candidate.end;
  if (candidate.isCutOff && daysToLastDay >= 0 && daysToLastDay <= CLOSING_SOON_DAYS) {
    item.closesInDays = daysToLastDay;
  }
  if (candidate.isRegistrationWindow && !ongoing) {
    item.action = { label: labels.planCourses, href: STUDY_PLAN_HREF };
  } else if (candidate.isWithdrawal) {
    item.action = { label: labels.withdraw, href: WITHDRAW_GUIDE_HREF };
  }
  return item;
}

export function getDueSoon(
  todayKey: string,
  locale: Locale,
  opts: { limit?: number; windowDays?: number } = {}
): DueItem[] {
  const limit = opts.limit ?? DEFAULT_LIMIT;
  const windowDays = opts.windowDays ?? DEFAULT_WINDOW_DAYS;
  const today = dayNumber(todayKey);

  const events = calendarEvents.map((event) => fromEvent(event, locale));
  const academic = withoutShadowedAcademicItems(events, academicCandidates(locale));

  return [...academic, ...events]
    .filter((candidate) => {
      const ongoing = candidate.start <= todayKey && lastDay(candidate) >= todayKey;
      const startsIn = dayNumber(candidate.start) - today;
      return ongoing || (startsIn >= 0 && startsIn <= windowDays);
    })
    .sort(
      (a, b) =>
        a.start.localeCompare(b.start) ||
        Number(b.fromAcademic) - Number(a.fromAcademic) ||
        a.id.localeCompare(b.id)
    )
    .slice(0, limit)
    .map((candidate) => toDueItem(candidate, todayKey, locale));
}
