"use client";

import { useMemo, useState, type ReactElement } from "react";
import Link from "next/link";
import clsx from "clsx";
import { formatDate, localeHref, type Locale } from "@/lib/i18n";
import type { CalendarEvent, CalendarEventKind } from "@/content/calendar/events";

export type EventCalendarLabels = {
  prevMonth: string;
  nextMonth: string;
  selectedFor: string; // "Events on {date}": {date} is substituted
  noEventsDay: string; // shown when a day has no events
  open: string; // accessible verb for the link, e.g. "Read"
  /** Localized, plural-aware event-count suffix for a day cell's accessible
   *  name. `{n}` is substituted; `one` is used when there is exactly one event. */
  eventCount: { one: string; other: string };
  legend: Record<CalendarEventKind, string>;
  styleLegend: { period: string; single: string };
};

export type EventCalendarProps = {
  events: CalendarEvent[];
  locale: Locale;
  /** Current date in Asia/Bangkok as `YYYY-MM-DD`, computed on the server so
   *  SSR and hydration agree (no `new Date()` in the client render path). */
  todayKey: string;
  labels: EventCalendarLabels;
};

type IconProps = { className?: string };

/** Five-point star: birsa. */
function StarIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M10 2.2 12.35 7.7 18.3 8.3 13.8 12.3 15.1 18.1 10 15 4.9 18.1 6.2 12.3 1.7 8.3 7.65 7.7Z" />
    </svg>
  );
}

/** Open book: academic. */
function BookIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M10 5.2c-1.1-1-2.7-1.5-4.6-1.5-.9 0-1.6.08-2.1.2v10.6c.5-.12 1.2-.2 2.1-.2 1.9 0 3.5.5 4.6 1.5" />
      <path d="M10 5.2c1.1-1 2.7-1.5 4.6-1.5.9 0 1.6.08 2.1.2v10.6c-.5-.12-1.2-.2-2.1-.2-1.9 0-3.5.5-4.6 1.5Z" />
      <path d="M10 5.2v10.6" />
    </svg>
  );
}

/** Columned building / landmark: university. */
function BuildingIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M2.5 7.2 10 2.5l7.5 4.7" />
      <path d="M3.3 7.6h13.4V16H3.3Z" />
      <path d="M5.8 7.6V16M9.9 7.6V16M14 7.6V16" />
      <path d="M2.5 16h15" />
    </svg>
  );
}

const KIND_ICON: Record<CalendarEventKind, (props: IconProps) => ReactElement> = {
  birsa: StarIcon,
  academic: BookIcon,
  university: BuildingIcon,
};

const KIND_TEXT: Record<CalendarEventKind, string> = {
  birsa: "text-brand",
  academic: "text-forest",
  university: "text-warning",
};

const KIND_BORDER: Record<CalendarEventKind, string> = {
  birsa: "border-brand",
  academic: "border-forest",
  university: "border-warning",
};

const KIND_TINT: Record<CalendarEventKind, string> = {
  birsa: "bg-brand-tint",
  academic: "bg-forest-tint",
  university: "bg-warning-tint",
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function keyOf(year: number, month0: number, day: number): string {
  return `${year}-${pad(month0 + 1)}-${pad(day)}`;
}

/** An event covers a day when start <= day <= (end ?? start); ISO strings sort lexically. */
function coversDay(event: CalendarEvent, dayKey: string): boolean {
  return dayKey >= event.start && dayKey <= (event.end ?? event.start);
}

/** A period is any event with a distinct end date (multi-day). */
function isPeriod(event: CalendarEvent): boolean {
  return Boolean(event.end) && event.end !== event.start;
}

type Week = (number | null)[];

function chunkWeeks(cells: (number | null)[]): Week[] {
  const weeks: Week[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export default function EventCalendar({ events, locale, todayKey, labels }: EventCalendarProps) {
  const intlLocale = locale === "th" ? "th-TH-u-ca-gregory" : "en-GB";

  // Distinct months that actually contain events, sorted ascending.
  const months = useMemo(() => {
    const keys = new Set<string>();
    for (const event of events) {
      keys.add(event.start.slice(0, 7));
      if (event.end) keys.add(event.end.slice(0, 7));
    }
    return Array.from(keys)
      .sort()
      .map((k) => {
        const [y = "0", m = "1"] = k.split("-");
        return { key: k, year: Number(y), month0: Number(m) - 1 };
      });
  }, [events]);

  const todayMonthKey = todayKey.slice(0, 7);
  const initialMonthIndex = Math.max(
    0,
    months.findIndex((m) => m.key === todayMonthKey)
  );

  const firstEventDayOfMonth = useMemo(
    () => (monthKey: string): string | null => {
      const inMonth = events
        .filter((e) => coversDay(e, e.start) && e.start.slice(0, 7) === monthKey)
        .map((e) => e.start)
        .sort();
      return inMonth[0] ?? null;
    },
    [events]
  );

  const [monthIndex, setMonthIndex] = useState(initialMonthIndex);
  const [selectedDay, setSelectedDay] = useState<string | null>(() => {
    const monthKey = months[initialMonthIndex]?.key;
    if (!monthKey) return null;
    // Prefer today if it falls in the opening month and has events.
    if (monthKey === todayMonthKey && events.some((e) => coversDay(e, todayKey))) {
      return todayKey;
    }
    return firstEventDayOfMonth(monthKey);
  });

  const current = months[monthIndex];

  const weekdays = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(intlLocale, { weekday: "short" });
    // 2024-06-02 is a Sunday: build a stable Sun→Sat header.
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 5, 2 + i)));
  }, [intlLocale]);

  const monthLabel = useMemo(() => {
    if (!current) return "";
    return new Intl.DateTimeFormat(intlLocale, { month: "long", year: "numeric" }).format(
      new Date(current.year, current.month0, 1)
    );
  }, [current, intlLocale]);

  const cells = useMemo(() => {
    if (!current) return [] as (number | null)[];
    const startWeekday = new Date(current.year, current.month0, 1).getDay(); // 0 = Sun
    const daysInMonth = new Date(current.year, current.month0 + 1, 0).getDate();
    const out: (number | null)[] = Array.from({ length: startWeekday }, () => null);
    for (let d = 1; d <= daysInMonth; d += 1) out.push(d);
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [current]);

  const weeks = useMemo(() => chunkWeeks(cells), [cells]);

  // Multi-day events (periods) intersecting the visible month, with a
  // greedily-assigned lane so overlapping periods stack instead of collide.
  const { periods, laneOf, laneCount } = useMemo(() => {
    if (!current) return { periods: [] as CalendarEvent[], laneOf: new Map<string, number>(), laneCount: 0 };
    const monthFirst = keyOf(current.year, current.month0, 1);
    const daysInMonth = new Date(current.year, current.month0 + 1, 0).getDate();
    const monthLast = keyOf(current.year, current.month0, daysInMonth);
    const inMonth = events.filter((e) => isPeriod(e) && e.start <= monthLast && (e.end ?? e.start) >= monthFirst);
    inMonth.sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : (a.end ?? "") > (b.end ?? "") ? -1 : 1));

    const laneEnds: string[] = [];
    const lanes = new Map<string, number>();
    for (const p of inMonth) {
      let lane = 0;
      while (lane < laneEnds.length && (laneEnds[lane] ?? "") >= p.start) lane += 1;
      laneEnds[lane] = p.end ?? p.start;
      lanes.set(p.id, lane);
    }
    return { periods: inMonth, laneOf: lanes, laneCount: laneEnds.length };
  }, [events, current]);

  const selectedEvents = useMemo(
    () => (selectedDay ? events.filter((e) => coversDay(e, selectedDay)) : []),
    [events, selectedDay]
  );

  function goToMonth(nextIndex: number) {
    const clamped = Math.min(Math.max(nextIndex, 0), months.length - 1);
    const target = months[clamped];
    if (!target || clamped === monthIndex) return;
    setMonthIndex(clamped);
    setSelectedDay(firstEventDayOfMonth(target.key));
  }

  function eventRangeLabel(event: CalendarEvent): string {
    const start = formatDate(locale, event.start);
    if (!event.end || event.end === event.start) return start;
    return `${start} to ${formatDate(locale, event.end)}`;
  }

  /** A day cell's accessible name: the localized date, plus a localized,
   *  plural-aware event count when the day has events. */
  function dayLabel(dayKey: string, count: number): string {
    const date = formatDate(locale, dayKey);
    if (count === 0) return date;
    const template = count === 1 ? labels.eventCount.one : labels.eventCount.other;
    return `${date}, ${template.replace("{n}", String(count))}`;
  }

  if (!current) return null;

  const navBtn =
    "focus-halo inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-surface text-ink transition-colors hover:bg-sunken disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      {/* Calendar grid */}
      <div className="border-line bg-surface rounded-lg border p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            className={navBtn}
            onClick={() => goToMonth(monthIndex - 1)}
            disabled={monthIndex === 0}
            aria-label={labels.prevMonth}
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
              <path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h3 className="font-display text-ink text-xl" aria-live="polite">
            {monthLabel}
          </h3>
          <button
            type="button"
            className={navBtn}
            onClick={() => goToMonth(monthIndex + 1)}
            disabled={monthIndex === months.length - 1}
            aria-label={labels.nextMonth}
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
              <path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div aria-label={monthLabel}>
          <div className="text-muted grid grid-cols-7 gap-1 pb-1 text-center text-xs font-semibold">
            {weekdays.map((w, i) => (
              <div key={i} className="py-1">
                {w}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-y-1.5">
            {weeks.map((week, weekIndex) => {
              // First/last real day keys within this week, for clamping ribbon segments.
              let weekFirstKey: string | null = null;
              let weekLastKey: string | null = null;
              for (const day of week) {
                if (day === null) continue;
                const dk = keyOf(current.year, current.month0, day);
                if (weekFirstKey === null) weekFirstKey = dk;
                weekLastKey = dk;
              }

              const weekPeriods =
                weekFirstKey !== null && weekLastKey !== null
                  ? periods.filter((p) => p.start <= (weekLastKey as string) && (p.end ?? p.start) >= (weekFirstKey as string))
                  : [];

              return (
                <div key={weekIndex} className="flex flex-col">
                  <div className="grid grid-cols-7 gap-1">
                    {week.map((day, i) => {
                      if (day === null) return <div key={i} aria-hidden="true" />;
                      const dayKey = keyOf(current.year, current.month0, day);
                      const dayEvents = events.filter((e) => coversDay(e, dayKey));
                      const singleEvents = dayEvents.filter((e) => !isPeriod(e));
                      const hasEvents = dayEvents.length > 0;
                      const isToday = dayKey === todayKey;
                      const isSelected = dayKey === selectedDay;

                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={!hasEvents}
                          onClick={() => setSelectedDay(dayKey)}
                          aria-pressed={isSelected}
                          aria-current={isToday ? "date" : undefined}
                          aria-label={dayLabel(dayKey, dayEvents.length)}
                          className={clsx(
                            "focus-halo relative flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-md text-sm transition-colors",
                            hasEvents ? "text-ink cursor-pointer font-semibold" : "text-muted cursor-default",
                            isSelected
                              ? "bg-brand text-white"
                              : hasEvents
                                ? "bg-sunken hover:bg-brand-tint"
                                : "",
                            isToday && !isSelected && "ring-line-strong ring-2 ring-inset"
                          )}
                        >
                          <span>{day}</span>
                          {singleEvents.length > 0 ? (
                            <span className="flex flex-wrap items-center justify-center gap-0.5" aria-hidden="true">
                              {singleEvents.slice(0, 3).map((e) => {
                                const Icon = KIND_ICON[e.kind];
                                return (
                                  <span
                                    key={e.id}
                                    title={e.title[locale]}
                                    className={clsx(
                                      "inline-flex h-4 w-4 items-center justify-center rounded",
                                      isSelected ? "bg-white/25" : KIND_TINT[e.kind]
                                    )}
                                  >
                                    <Icon className={clsx("h-3 w-3", isSelected ? "text-white" : KIND_TEXT[e.kind])} />
                                  </span>
                                );
                              })}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  {laneCount > 0 && (
                    <div
                      className="grid grid-cols-7 gap-x-1 gap-y-0.5 mt-0.5"
                      // Each period ribbon is a link; ≥1.5rem (24px) tall keeps
                      // the pointer target at the WCAG 2.5.8 (AA) minimum.
                      style={{ gridTemplateRows: `repeat(${laneCount}, 1.6rem)` }}
                    >
                      {weekFirstKey !== null && weekLastKey !== null
                        ? weekPeriods.map((p) => {
                            const segStart = p.start > weekFirstKey! ? p.start : weekFirstKey!;
                            const segEnd = (p.end ?? p.start) < weekLastKey! ? (p.end ?? p.start) : weekLastKey!;
                            const segStartCol = week.findIndex(
                              (d) => d !== null && keyOf(current.year, current.month0, d) === segStart
                            );
                            const segEndCol = week.findIndex(
                              (d) => d !== null && keyOf(current.year, current.month0, d) === segEnd
                            );
                            if (segStartCol === -1 || segEndCol === -1) return null;
                            const roundedLeft = p.start >= weekFirstKey!;
                            const roundedRight = (p.end ?? p.start) <= weekLastKey!;
                            const lane = laneOf.get(p.id) ?? 0;
                            const Icon = KIND_ICON[p.kind];

                            return (
                              <Link
                                key={p.id}
                                href={localeHref(locale, `/news/${p.slug}`)}
                                title={p.title[locale]}
                                style={{
                                  gridColumn: `${segStartCol + 1} / ${segEndCol + 2}`,
                                  gridRow: lane + 1,
                                }}
                                className={clsx(
                                  "focus-halo flex min-w-0 items-center gap-1 overflow-hidden px-1.5 text-xs font-semibold transition-opacity hover:opacity-80",
                                  KIND_TINT[p.kind],
                                  "text-ink",
                                  roundedLeft ? "rounded-l-md" : "",
                                  roundedRight ? "rounded-r-md" : "",
                                  roundedLeft ? clsx("border-l-4", KIND_BORDER[p.kind]) : ""
                                )}
                              >
                                <Icon className={clsx("h-3 w-3 shrink-0", KIND_TEXT[p.kind])} />
                                <span className="truncate">{p.title[locale]}</span>
                              </Link>
                            );
                          })
                        : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-col gap-2">
          <ul className="text-muted flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {(Object.keys(labels.legend) as CalendarEventKind[]).map((k) => {
              const Icon = KIND_ICON[k];
              return (
                <li key={k} className="flex items-center gap-1.5">
                  <Icon className={clsx("h-3.5 w-3.5", KIND_TEXT[k])} />
                  {labels.legend[k]}
                </li>
              );
            })}
          </ul>
          <ul className="text-muted flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <li className="flex items-center gap-1.5">
              <span className="bg-brand-tint border-brand h-2.5 w-5 rounded-sm border-l-4" aria-hidden="true" />
              {labels.styleLegend.period}
            </li>
            <li className="flex items-center gap-1.5">
              <span className="bg-brand-tint inline-flex h-4 w-4 items-center justify-center rounded" aria-hidden="true">
                <StarIcon className="text-brand h-3 w-3" />
              </span>
              {labels.styleLegend.single}
            </li>
          </ul>
        </div>
      </div>

      {/* Detail panel */}
      <div
        className="border-line bg-sunken rounded-lg border p-4 sm:p-5"
        role="region"
        aria-live="polite"
        aria-label={selectedDay ? labels.selectedFor.replace("{date}", formatDate(locale, selectedDay)) : undefined}
      >
        <p className="text-muted mb-3 text-sm font-semibold">
          {selectedDay ? labels.selectedFor.replace("{date}", formatDate(locale, selectedDay)) : ""}
        </p>
        {selectedEvents.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {selectedEvents.map((event) => {
              const Icon = KIND_ICON[event.kind];
              return (
                <li key={event.id}>
                  <Link
                    href={localeHref(locale, `/news/${event.slug}`)}
                    className="group border-line bg-surface hover:border-brand focus-halo flex gap-2.5 rounded-md border p-3 transition-colors"
                  >
                    <Icon className={clsx("mt-0.5 h-4 w-4 shrink-0", KIND_TEXT[event.kind])} />
                    <span className="min-w-0">
                      <span className="text-ink block text-sm font-semibold leading-snug group-hover:underline">
                        {event.title[locale]}
                      </span>
                      <span className="text-muted mt-0.5 block text-xs">{eventRangeLabel(event)}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-muted text-sm">{labels.noEventsDay}</p>
        )}
      </div>
    </div>
  );
}
