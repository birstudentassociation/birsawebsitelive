import Link from "next/link";

import Table from "@/components/bds/Table";
import { Text } from "@/components/bds/Type";
import { formatDate, localeHref, type Locale } from "@/lib/i18n";
import type { CalendarEvent } from "@/content/calendar/events";

export type UpcomingEventsTableLabels = {
  heading: string;
  empty: string;
  dateHeader: string;
  eventHeader: string;
  typeHeader: string;
  legendBirsa: string;
  legendUniversity: string;
  /** Joins a start and end date, e.g. "to" / "ถึง" (NEWS-STYLE §2.8: never a dash). */
  dateRangeJoiner: string;
};

/**
 * `/whats-on/calendar` (Wave 5, `components/whatson/`).
 *
 * A plain, server-rendered table of every dated item, in date order. This is
 * the no-JavaScript guarantee `EventCalendar` alone cannot give: `EventCalendar`
 * is a client component whose month grid still renders without a script
 * (Next.js server-renders a client component's initial markup, REDESIGN-2.0
 * §7), but its month navigation and day selection do not respond without one.
 * A reader with JavaScript off, or simply on a slow connection before it has
 * loaded, still needs a way to see every date on the calendar. This table,
 * needing no script at all, is that way: real `<a href>` links, a real
 * `<table>`, nothing that depends on a click handler.
 */
export type UpcomingEventsTableProps = {
  events: CalendarEvent[];
  locale: Locale;
  labels: UpcomingEventsTableLabels;
  /**
   * Hide the table's own caption visually while keeping it as the scroll
   * region's accessible name (`Table`'s own `captionHidden`). Pass this when
   * a heading immediately above the table already states `labels.heading`,
   * so the caption is not repeated to a sighted reader.
   */
  captionHidden?: boolean;
};

function eventRangeLabel(locale: Locale, event: CalendarEvent, joiner: string): string {
  const start = formatDate(locale, event.start);
  if (!event.end || event.end === event.start) return start;
  return `${start} ${joiner} ${formatDate(locale, event.end)}`;
}

export default function UpcomingEventsTable({
  events,
  locale,
  labels,
  captionHidden,
}: UpcomingEventsTableProps) {
  const sorted = [...events].sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));

  if (sorted.length === 0) {
    return (
      <Text step="body" className="text-muted">
        {labels.empty}
      </Text>
    );
  }

  return (
    <Table
      caption={labels.heading}
      captionHidden={captionHidden}
      columns={[
        { key: "date", header: labels.dateHeader },
        { key: "title", header: labels.eventHeader },
        { key: "kind", header: labels.typeHeader },
      ]}
      rows={sorted.map((event) => ({
        date: eventRangeLabel(locale, event, labels.dateRangeJoiner),
        title: (
          <Link
            href={localeHref(locale, `/whats-on/news/${event.slug}`)}
            className="font-semibold text-brand-deep hover:underline"
          >
            {event.title[locale]}
          </Link>
        ),
        kind: event.kind === "birsa" ? labels.legendBirsa : labels.legendUniversity,
      }))}
      rowKey={(row, index) => sorted[index]?.id ?? String(index)}
    />
  );
}
