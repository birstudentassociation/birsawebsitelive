"use client";

import { useState } from "react";
import Button from "@/components/Button";
import type { CalendarBuilderCopy } from "@/content/calendar-builder/types";
import type { CategoryId, ClassSlot } from "@/lib/calendar-builder/selection";
import type { Locale } from "@/lib/i18n";
import type { CourseOption } from "./ClassesStep";
import { CategoryIcon, fill, monthLabel, shortDate } from "./helpers";

export type PreviewEvent = {
  id: string;
  start: string;
  end?: string;
  title: string;
  category: Exclude<CategoryId, "classes">;
};

export type PreviewProps = {
  locale: Locale;
  copy: CalendarBuilderCopy;
  events: PreviewEvent[];
  /** Classes to show; empty unless "My class times" is chosen. */
  classes: ClassSlot[];
  courses: CourseOption[];
  /** "My class times" is chosen but nothing has been added. */
  classesMissing: boolean;
  todayKey: string;
  summary: string;
  onAddClass: () => void;
};

type Month = { key: string; label: string; items: PreviewEvent[] };

function groupByMonth(locale: Locale, events: PreviewEvent[]): Month[] {
  const months: Month[] = [];
  for (const event of events) {
    const key = event.start.slice(0, 7);
    let month = months.find((m) => m.key === key);
    if (!month) {
      month = { key, label: monthLabel(locale, event.start), items: [] };
      months.push(month);
    }
    month.items.push(event);
  }
  return months;
}

function MonthList({
  months,
  locale,
  copy,
  todayKey,
}: {
  months: Month[];
  locale: Locale;
  copy: CalendarBuilderCopy;
  todayKey: string;
}) {
  return (
    <>
      {months.map((month) => (
        <section key={month.key} className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold tracking-wide text-muted">{month.label}</h3>
          <ul className="flex flex-col divide-y divide-line">
            {month.items.map((event) => {
              const date = event.end
                ? fill(copy.preview.range, {
                    start: shortDate(locale, event.start),
                    end: shortDate(locale, event.end),
                  })
                : shortDate(locale, event.start);
              const ongoing = event.start <= todayKey && (event.end ?? event.start) >= todayKey;
              return (
                <li key={event.id} className="flex flex-col gap-0.5 py-2.5">
                  <p className="text-sm font-semibold text-ink">
                    {date}
                    {ongoing ? (
                      <span className="ml-2 font-normal text-muted">({copy.preview.ongoing})</span>
                    ) : null}
                  </p>
                  <p className="text-[0.95rem] leading-snug text-ink">{event.title}</p>
                  <p className="flex items-center gap-1.5 text-xs text-muted">
                    <CategoryIcon id={event.category} className="h-3.5 w-3.5 shrink-0" />
                    {copy.categories[event.category].preview}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}

/** Live agenda of exactly what the feed will contain. */
export default function Preview({
  locale,
  copy,
  events,
  classes,
  courses,
  classesMissing,
  todayKey,
  summary,
  onAddClass,
}: PreviewProps) {
  const p = copy.preview;
  const [showPast, setShowPast] = useState(false);
  const sorted = [...events].sort(
    (a, b) => a.start.localeCompare(b.start) || a.id.localeCompare(b.id)
  );
  const isPast = (event: PreviewEvent) => (event.end ?? event.start) < todayKey;
  const past = sorted.filter(isPast);
  const upcoming = sorted.filter((event) => !isPast(event));
  const nothing = sorted.length === 0 && classes.length === 0;

  return (
    <aside
      id="preview"
      aria-labelledby="preview-heading"
      className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-5 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto"
    >
      <div>
        <h2 id="preview-heading" className="font-display text-xl">
          {p.heading}
        </h2>
        <p role="status" className="mt-1 text-sm font-semibold text-ink">
          {summary}
        </p>
      </div>

      {classesMissing ? (
        <div className="flex flex-col items-start gap-3 border-l-[5px] border-line-strong py-1 pl-4">
          <p className="leading-relaxed text-ink">{p.classesMissing}</p>
          <Button type="button" variant="secondary" onClick={onAddClass}>
            {p.addClass}
          </Button>
        </div>
      ) : null}

      {nothing && !classesMissing ? <p className="text-muted">{p.empty}</p> : null}

      {classes.length > 0 ? (
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold tracking-wide text-muted">{p.classesHeading}</h3>
          <ul className="flex flex-col divide-y divide-line">
            {[...classes]
              .sort((a, b) => a.day - b.day || a.start.localeCompare(b.start))
              .map((slot) => {
                const course = courses.find((option) => option.code === slot.code);
                return (
                  <li
                    key={`${slot.code}-${slot.day}-${slot.start}`}
                    className="flex flex-col gap-0.5 py-2.5"
                  >
                    <p className="text-sm font-semibold text-ink">
                      {fill(p.every, {
                        day: p.days[slot.day - 1] ?? "",
                        start: slot.start,
                        end: slot.end,
                      })}
                    </p>
                    <p className="text-[0.95rem] leading-snug break-words text-ink">
                      {slot.code}
                      {course ? ` ${course.title}` : ""}
                      {slot.place ? `, ${fill(p.placeAt, { place: slot.place })}` : ""}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted">
                      <CategoryIcon id="classes" className="h-3.5 w-3.5 shrink-0" />
                      {copy.categories.classes.preview}
                    </p>
                  </li>
                );
              })}
          </ul>
        </section>
      ) : null}

      {past.length > 0 ? (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            aria-expanded={showPast}
            aria-controls="preview-past"
            onClick={() => setShowPast(!showPast)}
            className="focus-halo min-h-11 self-start rounded-md text-sm font-semibold text-brand-deep underline"
          >
            {showPast ? p.hidePast : fill(p.showPast, { n: past.length })}
          </button>
          <div id="preview-past" hidden={!showPast} className="flex flex-col gap-4">
            <MonthList
              months={groupByMonth(locale, past)}
              locale={locale}
              copy={copy}
              todayKey={todayKey}
            />
          </div>
        </div>
      ) : null}

      <MonthList
        months={groupByMonth(locale, upcoming)}
        locale={locale}
        copy={copy}
        todayKey={todayKey}
      />
    </aside>
  );
}
