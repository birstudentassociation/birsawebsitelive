"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { formatDate, localeHref, type Locale } from "@/lib/i18n";
import type { CalendarEvent, CalendarEventKind } from "@/content/calendar/events";

export type EventCalendarLabels = {
  prevMonth: string;
  nextMonth: string;
  selectedFor: string; // "Events on {date}" — {date} is substituted
  noEventsDay: string; // shown when a day has no events
  open: string; // accessible verb for the link, e.g. "Read"
  legend: Record<CalendarEventKind, string>;
};

export type EventCalendarProps = {
  events: CalendarEvent[];
  locale: Locale;
  /** Current date in Asia/Bangkok as `YYYY-MM-DD`, computed on the server so
   *  SSR and hydration agree (no `new Date()` in the client render path). */
  todayKey: string;
  labels: EventCalendarLabels;
};

const KIND_DOT: Record<CalendarEventKind, string> = {
  birsa: "bg-brand",
  academic: "bg-forest",
  university: "bg-warning",
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
    // 2024-06-02 is a Sunday — build a stable Sun→Sat header.
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
    return `${start} – ${formatDate(locale, event.end)}`;
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

        <div role="grid" aria-label={monthLabel}>
          <div role="row" className="text-muted grid grid-cols-7 gap-1 pb-1 text-center text-xs font-semibold">
            {weekdays.map((w, i) => (
              <div role="columnheader" key={i} className="py-1">
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={i} aria-hidden="true" />;
              const dayKey = keyOf(current.year, current.month0, day);
              const dayEvents = events.filter((e) => coversDay(e, dayKey));
              const hasEvents = dayEvents.length > 0;
              const isToday = dayKey === todayKey;
              const isSelected = dayKey === selectedDay;
              const kinds = Array.from(new Set(dayEvents.map((e) => e.kind)));

              return (
                <div role="gridcell" key={i} className="aspect-square">
                  <button
                    type="button"
                    disabled={!hasEvents}
                    onClick={() => setSelectedDay(dayKey)}
                    aria-pressed={isSelected}
                    aria-current={isToday ? "date" : undefined}
                    className={clsx(
                      "focus-halo relative flex h-full w-full flex-col items-center justify-center gap-1 rounded-md text-sm transition-colors",
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
                    {hasEvents ? (
                      <span className="flex items-center gap-0.5" aria-hidden="true">
                        {kinds.slice(0, 3).map((k) => (
                          <span
                            key={k}
                            className={clsx(
                              "h-1.5 w-1.5 rounded-full",
                              isSelected ? "bg-white" : KIND_DOT[k]
                            )}
                          />
                        ))}
                      </span>
                    ) : null}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <ul className="text-muted mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {(Object.keys(labels.legend) as CalendarEventKind[]).map((k) => (
            <li key={k} className="flex items-center gap-1.5">
              <span className={clsx("h-2 w-2 rounded-full", KIND_DOT[k])} aria-hidden="true" />
              {labels.legend[k]}
            </li>
          ))}
        </ul>
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
            {selectedEvents.map((event) => (
              <li key={event.id}>
                <Link
                  href={localeHref(locale, `/news/${event.slug}`)}
                  className="group border-line bg-surface hover:border-brand focus-halo flex gap-2.5 rounded-md border p-3 transition-colors"
                >
                  <span className={clsx("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", KIND_DOT[event.kind])} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="text-ink block text-sm font-semibold leading-snug group-hover:underline">
                      {event.title[locale]}
                    </span>
                    <span className="text-muted mt-0.5 block text-xs">{eventRangeLabel(event)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted text-sm">{labels.noEventsDay}</p>
        )}
      </div>
    </div>
  );
}
