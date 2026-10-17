"use client";

import { useId, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";
import Tag from "@/components/Tag";
import { todayInBangkok } from "@/lib/bangkok-today";
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
  /** Subscribe affordance shown under the calendar. */
  subscribe: {
    heading: string;
    intro: string;
    webcal: string; // link text for the webcal:// subscribe link
    https: string; // link text for the plain https:// link
  };
};

export type EventCalendarProps = {
  events: CalendarEvent[];
  locale: Locale;
  /** Date in Asia/Bangkok as `YYYY-MM-DD` when the page was built. It is
   *  rendered first so SSR and hydration agree, then replaced after mount by
   *  the current Bangkok date. */
  todayKey: string;
  labels: EventCalendarLabels;
  /** Absolute https:// URL of this locale's calendar.ics feed. */
  icsUrl: string;
};

/** Icon shapes on a 20x20 grid, drawn once per calendar in a hidden sprite and
 *  referenced with `<use>`, so a day cell costs one `<svg>` per event. */
const KIND_SHAPE: Record<CalendarEventKind, ReactNode> = {
  // Five-point star: birsa.
  birsa: (
    <path d="M10 2.2 12.35 7.7 18.3 8.3 13.8 12.3 15.1 18.1 10 15 4.9 18.1 6.2 12.3 1.7 8.3 7.65 7.7Z" />
  ),
  // Columned building / landmark: university.
  university: (
    <>
      <path d="M2.5 7.2 10 2.5l7.5 4.7" />
      <path d="M3.3 7.6h13.4V16H3.3Z" />
      <path d="M5.8 7.6V16M9.9 7.6V16M14 7.6V16" />
      <path d="M2.5 16h15" />
    </>
  ),
};

const KINDS = Object.keys(KIND_SHAPE) as CalendarEventKind[];

function IconSprite({ prefix }: { prefix: string }) {
  return (
    <svg aria-hidden="true" className="hidden">
      {KINDS.map((kind) => (
        <symbol
          key={kind}
          id={`${prefix}-${kind}`}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          {KIND_SHAPE[kind]}
        </symbol>
      ))}
    </svg>
  );
}

function KindIcon({
  prefix,
  kind,
  className,
}: {
  prefix: string;
  kind: CalendarEventKind;
  className: string;
}) {
  return (
    <svg aria-hidden="true" className={className}>
      <use href={`#${prefix}-${kind}`} />
    </svg>
  );
}

const KIND_TEXT: Record<CalendarEventKind, string> = {
  birsa: "text-brand",
  university: "text-warning",
};

/** The coloured Tag that names an event's type, in the detail list and the legend. */
const KIND_TAG: Record<CalendarEventKind, "brand" | "amber"> = {
  birsa: "brand",
  university: "amber",
};

const KIND_TINT: Record<CalendarEventKind, string> = {
  birsa: "bg-brand-tint",
  university: "bg-warning-tint",
};

function subscribeNever(): () => void {
  return () => {};
}

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

export default function EventCalendar({
  events,
  locale,
  todayKey,
  labels,
  icsUrl,
}: EventCalendarProps) {
  // Unique per instance; useId's punctuation is stripped so it is a safe fragment.
  const iconPrefix = `cal-icon-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const webcalUrl = icsUrl.replace(/^https?:\/\//, "webcal://");
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

  const monthIndexFor = (day: string) =>
    Math.max(
      0,
      months.findIndex((m) => m.key === day.slice(0, 7))
    );

  const firstEventDayOfMonth = useMemo(
    () =>
      (monthKey: string): string | null => {
        const inMonth = events
          .filter((e) => coversDay(e, e.start) && e.start.slice(0, 7) === monthKey)
          .map((e) => e.start)
          .sort();
        return inMonth[0] ?? null;
      },
    [events]
  );

  // Prefer today if it falls in the opening month and has events.
  const openingDay = (day: string, index: number): string | null => {
    const monthKey = months[index]?.key;
    if (!monthKey) return null;
    if (monthKey === day.slice(0, 7) && events.some((e) => coversDay(e, day))) return day;
    return firstEventDayOfMonth(monthKey);
  };

  const today = useSyncExternalStore(
    subscribeNever,
    () => todayInBangkok(),
    () => todayKey
  );
  const [pickedMonthIndex, setPickedMonthIndex] = useState<number | null>(null);
  const [pickedDay, setPickedDay] = useState<string | null | undefined>(undefined);
  const monthIndex = pickedMonthIndex ?? monthIndexFor(today);
  const selectedDay = pickedDay === undefined ? openingDay(today, monthIndex) : pickedDay;

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
    if (!current)
      return { periods: [] as CalendarEvent[], laneOf: new Map<string, number>(), laneCount: 0 };
    const monthFirst = keyOf(current.year, current.month0, 1);
    const daysInMonth = new Date(current.year, current.month0 + 1, 0).getDate();
    const monthLast = keyOf(current.year, current.month0, daysInMonth);
    const inMonth = events.filter(
      (e) => isPeriod(e) && e.start <= monthLast && (e.end ?? e.start) >= monthFirst
    );
    inMonth.sort((a, b) =>
      a.start < b.start ? -1 : a.start > b.start ? 1 : (a.end ?? "") > (b.end ?? "") ? -1 : 1
    );

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

  // Events per day of the visible month, computed once instead of per cell.
  // `single` drops multi-day periods, which render as ribbons, not icons.
  const eventsByDay = useMemo(() => {
    const byDay = new Map<string, { all: CalendarEvent[]; single: CalendarEvent[] }>();
    if (!current) return byDay;
    const monthFirst = keyOf(current.year, current.month0, 1);
    const daysInMonth = new Date(current.year, current.month0 + 1, 0).getDate();
    const monthLast = keyOf(current.year, current.month0, daysInMonth);
    for (const e of events) {
      const end = e.end ?? e.start;
      if (e.start > monthLast || end < monthFirst) continue;
      const from = e.start < monthFirst ? 1 : Number(e.start.slice(8, 10));
      const to = end > monthLast ? daysInMonth : Number(end.slice(8, 10));
      const period = isPeriod(e);
      for (let d = from; d <= to; d += 1) {
        const dayKey = keyOf(current.year, current.month0, d);
        let entry = byDay.get(dayKey);
        if (!entry) byDay.set(dayKey, (entry = { all: [], single: [] }));
        entry.all.push(e);
        if (!period) entry.single.push(e);
      }
    }
    return byDay;
  }, [events, current]);

  const selectedEvents = useMemo(
    () => (selectedDay ? events.filter((e) => coversDay(e, selectedDay)) : []),
    [events, selectedDay]
  );

  function goToMonth(nextIndex: number) {
    const clamped = Math.min(Math.max(nextIndex, 0), months.length - 1);
    const target = months[clamped];
    if (!target || clamped === monthIndex) return;
    setPickedMonthIndex(clamped);
    setPickedDay(firstEventDayOfMonth(target.key));
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
    <div className="flex flex-col gap-6">
      <IconSprite prefix={iconPrefix} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        {/* Calendar grid */}
        <div className="rounded-lg border border-line bg-surface p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              type="button"
              className={navBtn}
              onClick={() => goToMonth(monthIndex - 1)}
              disabled={monthIndex === 0}
              aria-label={labels.prevMonth}
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
                <path
                  d="M12.5 4.5 7 10l5.5 5.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <h3 className="font-display text-xl text-ink" aria-live="polite">
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
                <path
                  d="M7.5 4.5 13 10l-5.5 5.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div aria-label={monthLabel}>
            <div className="grid grid-cols-7 gap-1 pb-1 text-center text-xs font-semibold text-muted">
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
                    ? periods.filter(
                        (p) =>
                          p.start <= (weekLastKey as string) &&
                          (p.end ?? p.start) >= (weekFirstKey as string)
                      )
                    : [];

                return (
                  <div key={weekIndex} className="flex flex-col">
                    <div className="grid grid-cols-7 gap-1">
                      {week.map((day, i) => {
                        // Filler cells are not rendered: the first day of a short
                        // first week is pushed to its column instead.
                        if (day === null) return null;
                        const dayKey = keyOf(current.year, current.month0, day);
                        const entry = eventsByDay.get(dayKey);
                        const dayEvents = entry?.all ?? [];
                        const singleEvents = entry?.single ?? [];
                        const hasEvents = dayEvents.length > 0;
                        const isToday = dayKey === today;
                        const isSelected = dayKey === selectedDay;

                        return (
                          <button
                            key={i}
                            type="button"
                            disabled={!hasEvents}
                            onClick={() => setPickedDay(dayKey)}
                            aria-pressed={isSelected}
                            aria-current={isToday ? "date" : undefined}
                            aria-label={dayLabel(dayKey, dayEvents.length)}
                            style={
                              i > 0 && week[i - 1] === null ? { gridColumnStart: i + 1 } : undefined
                            }
                            className={clsx(
                              "focus-halo relative flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-md text-sm",
                              hasEvents
                                ? "cursor-pointer font-semibold text-ink"
                                : "cursor-default text-muted",
                              isSelected
                                ? "bg-brand text-white"
                                : hasEvents
                                  ? "bg-sunken hover:bg-brand-tint"
                                  : "",
                              isToday && !isSelected && "ring-2 ring-line-strong ring-inset"
                            )}
                          >
                            {day}
                            {singleEvents.length > 0 ? (
                              <span
                                className="flex flex-wrap items-center justify-center gap-0.5"
                                aria-hidden="true"
                              >
                                {singleEvents.slice(0, 3).map((e) => (
                                  <KindIcon
                                    key={e.id}
                                    prefix={iconPrefix}
                                    kind={e.kind}
                                    className={clsx(
                                      "h-4 w-4 rounded p-0.5",
                                      isSelected
                                        ? "bg-white/25 text-white"
                                        : [KIND_TINT[e.kind], KIND_TEXT[e.kind]]
                                    )}
                                  />
                                ))}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>

                    {laneCount > 0 && (
                      <div
                        className="mt-0.5 grid grid-cols-7 gap-x-1 gap-y-0.5"
                        // Each period ribbon is a link; ≥1.5rem (24px) tall keeps
                        // the pointer target at the WCAG 2.5.8 (AA) minimum.
                        style={{ gridTemplateRows: `repeat(${laneCount}, 1.6rem)` }}
                      >
                        {weekFirstKey !== null && weekLastKey !== null
                          ? weekPeriods.map((p) => {
                              const segStart = p.start > weekFirstKey! ? p.start : weekFirstKey!;
                              const segEnd =
                                (p.end ?? p.start) < weekLastKey!
                                  ? (p.end ?? p.start)
                                  : weekLastKey!;
                              const segStartCol = week.findIndex(
                                (d) =>
                                  d !== null && keyOf(current.year, current.month0, d) === segStart
                              );
                              const segEndCol = week.findIndex(
                                (d) =>
                                  d !== null && keyOf(current.year, current.month0, d) === segEnd
                              );
                              if (segStartCol === -1 || segEndCol === -1) return null;
                              const lane = laneOf.get(p.id) ?? 0;

                              return (
                                <Link
                                  key={p.id}
                                  href={localeHref(locale, `/news/${p.slug}`)}
                                  title={p.title[locale]}
                                  style={{
                                    gridColumn: `${segStartCol + 1} / ${segEndCol + 2}`,
                                    gridRow: lane + 1,
                                  }}
                                  // A plain outlined entry, not a tinted bar: the type
                                  // shows in the icon, and in a Tag in the day's list.
                                  className="focus-halo flex min-w-0 items-center gap-1 overflow-hidden rounded-md border border-line-strong bg-surface px-1.5 text-xs font-semibold text-ink transition-colors hover:bg-sunken"
                                >
                                  <KindIcon
                                    prefix={iconPrefix}
                                    kind={p.kind}
                                    className={clsx("h-3 w-3 shrink-0", KIND_TEXT[p.kind])}
                                  />
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
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
              {(Object.keys(labels.legend) as CalendarEventKind[]).map((k) => (
                <li key={k} className="flex items-center gap-1.5">
                  <Tag variant={KIND_TAG[k]}>{labels.legend[k]}</Tag>
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
              <li className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-5 rounded-sm border border-line-strong bg-surface"
                  aria-hidden="true"
                />
                {labels.styleLegend.period}
              </li>
              <li className="flex items-center gap-1.5">
                <KindIcon
                  prefix={iconPrefix}
                  kind="birsa"
                  className="h-4 w-4 rounded bg-brand-tint p-0.5 text-brand"
                />
                {labels.styleLegend.single}
              </li>
            </ul>
          </div>
        </div>

        {/* Detail panel */}
        <div
          className="rounded-lg border border-line bg-sunken p-4 sm:p-5"
          role="region"
          aria-live="polite"
          aria-label={
            selectedDay
              ? labels.selectedFor.replace("{date}", formatDate(locale, selectedDay))
              : undefined
          }
        >
          <p className="mb-3 text-sm font-semibold text-muted">
            {selectedDay
              ? labels.selectedFor.replace("{date}", formatDate(locale, selectedDay))
              : ""}
          </p>
          {selectedEvents.length > 0 ? (
            <ul className="flex flex-col divide-y divide-line">
              {selectedEvents.map((event) => (
                <li key={event.id} className="py-3 first:pt-0 last:pb-0">
                  <Link
                    href={localeHref(locale, `/news/${event.slug}`)}
                    className="group focus-halo flex min-w-0 flex-col items-start gap-1 rounded-md"
                  >
                    <Tag variant={KIND_TAG[event.kind]}>{labels.legend[event.kind]}</Tag>
                    <span className="block text-sm leading-snug font-semibold text-ink group-hover:underline">
                      {event.title[locale]}
                    </span>
                    <span className="block text-xs text-muted">{eventRangeLabel(event)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">{labels.noEventsDay}</p>
          )}
        </div>
      </div>

      {/* Subscribe */}
      <div className="rounded-lg border border-line bg-surface p-4 sm:p-5">
        <h3 className="font-display text-base font-semibold text-ink">
          {labels.subscribe.heading}
        </h3>
        <p className="mt-1 text-sm text-muted">{labels.subscribe.intro}</p>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <li>
            <a
              href={webcalUrl}
              className="focus-halo rounded font-semibold text-brand-deep hover:underline"
            >
              {labels.subscribe.webcal}
            </a>
          </li>
          <li>
            <a
              href={icsUrl}
              className="focus-halo rounded font-semibold text-brand-deep hover:underline"
            >
              {labels.subscribe.https}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
