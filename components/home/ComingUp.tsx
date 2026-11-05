"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import Tag from "@/components/Tag";
import { todayInBangkok } from "@/lib/bangkok-today";
import { formatDate, localeHref, type Locale } from "@/lib/i18n";
import type { CalendarEvent, CalendarEventKind } from "@/content/calendar/events";

export type ComingUpLabels = {
  /** Shown when nothing is upcoming. */
  empty: string;
  /** Tag beside the date of an event that has started but not finished. */
  ongoing: string;
  /** Range template, `{start}` and `{end}` are substituted. */
  range: string;
  kinds: Record<CalendarEventKind, string>;
  panel: {
    heading: string;
    intro: string;
    points: string[];
    cta: string;
  };
};

export type ComingUpProps = {
  events: CalendarEvent[];
  locale: Locale;
  /** Bangkok date as `YYYY-MM-DD` when the page was built. Rendered first so
   *  SSR and hydration agree, then replaced after mount by the live date. */
  todayKey: string;
  labels: ComingUpLabels;
  /** How many dates to list. */
  limit?: number;
};

const KIND_TAG: Record<CalendarEventKind, "brand" | "amber"> = {
  birsa: "brand",
  university: "amber",
};

/** Icon shapes on a 20x20 grid, so a tag never relies on colour alone. */
const KIND_SHAPE: Record<CalendarEventKind, ReactNode> = {
  birsa: (
    <path d="M10 2.2 12.35 7.7 18.3 8.3 13.8 12.3 15.1 18.1 10 15 4.9 18.1 6.2 12.3 1.7 8.3 7.65 7.7Z" />
  ),
  university: (
    <>
      <path d="M2.5 7.2 10 2.5l7.5 4.7" />
      <path d="M3.3 7.6h13.4V16H3.3Z" />
      <path d="M5.8 7.6V16M9.9 7.6V16M14 7.6V16" />
      <path d="M2.5 16h15" />
    </>
  ),
};

function subscribeNever(): () => void {
  return () => {};
}

/** The next `limit` dates on or after `today`, soonest first. An event that
 *  has started but not ended still counts as upcoming. */
export function upcomingEvents(
  events: CalendarEvent[],
  today: string,
  limit: number
): CalendarEvent[] {
  return events
    .filter((e) => (e.end ?? e.start) >= today)
    .sort((a, b) => a.start.localeCompare(b.start) || a.id.localeCompare(b.id))
    .slice(0, limit);
}

function KindTag({ kind, label }: { kind: CalendarEventKind; label: string }) {
  return (
    <Tag variant={KIND_TAG[kind]} className="gap-1.5">
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="h-3.5 w-3.5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {KIND_SHAPE[kind]}
      </svg>
      {label}
    </Tag>
  );
}

function Tick() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="mt-0.5 h-5 w-5 shrink-0 text-success"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10" cy="10" r="8.25" />
      <path d="m6.5 10.3 2.4 2.4 4.6-5" />
    </svg>
  );
}

/**
 * Front-page "Coming up": the next few dates from the public calendar, with a
 * panel beside them that leads to the calendar builder.
 */
export default function ComingUp({ events, locale, todayKey, labels, limit = 5 }: ComingUpProps) {
  // Server and hydration use the build-time date; after mount the live
  // Bangkok date takes over, so a page served on a later day stays correct.
  const today = useSyncExternalStore(
    subscribeNever,
    () => todayInBangkok(),
    () => todayKey
  );
  const upcoming = upcomingEvents(events, today, limit);

  function dateLabel(event: CalendarEvent): string {
    const start = formatDate(locale, event.start);
    if (!event.end || event.end === event.start) return start;
    return labels.range.replace("{start}", start).replace("{end}", formatDate(locale, event.end));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start lg:gap-10">
      {upcoming.length > 0 ? (
        <ol className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface shadow-sm">
          {upcoming.map((event) => {
            const isOngoing = event.start < today;
            return (
              <li key={event.id} className="flex flex-col gap-2 px-4 py-4 sm:px-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <time
                    dateTime={event.start}
                    className="text-sm font-semibold text-ink tabular-nums"
                  >
                    {dateLabel(event)}
                  </time>
                  {isOngoing ? <Tag variant="forest">{labels.ongoing}</Tag> : null}
                </div>
                <Link
                  href={localeHref(locale, `/news/${event.slug}`)}
                  className="text-lg leading-snug font-semibold text-brand-deep underline decoration-1 underline-offset-4 hover:decoration-[3px]"
                >
                  {event.title[locale]}
                </Link>
                <div>
                  <KindTag kind={event.kind} label={labels.kinds[event.kind]} />
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="rounded-lg border border-line bg-surface px-5 py-6 text-lg text-muted shadow-sm">
          {labels.empty}
        </p>
      )}

      <div className="rounded-lg border border-line bg-surface p-5 shadow-sm sm:p-6">
        <h3 className="font-display text-xl leading-snug">{labels.panel.heading}</h3>
        <p className="mt-2 text-muted">{labels.panel.intro}</p>
        <ul className="mt-4 flex flex-col gap-2.5">
          {labels.panel.points.map((point) => (
            <li key={point} className="flex items-start gap-3">
              <Tick />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <Button
          href={localeHref(locale, "/services/calendar")}
          className="mt-6 w-full py-2 text-center !whitespace-normal sm:w-auto"
        >
          {labels.panel.cta}
        </Button>
      </div>
    </div>
  );
}
