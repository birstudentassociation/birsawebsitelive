"use client";

/**
 * The calendar builder: three steps (choose dates, add class times, add to a
 * calendar app) beside a live preview. Owns the selection, which lives in the
 * feed link's query string and in this browser's localStorage, never on the
 * server. The server render and first client render use the defaults and the
 * public feed link, so with JavaScript off the guides still work.
 */
import { useEffect, useMemo, useState } from "react";
import type { CalendarEvent } from "@/content/calendar/events";
import type { CalendarBuilderCopy, DeviceId } from "@/content/calendar-builder/types";
import { buildFeedLinks } from "@/lib/calendar-builder/links";
import {
  CATEGORY_IDS,
  DEFAULT_CATEGORIES,
  MAX_CLASSES,
  categoryForEvent,
  decodeSelection,
  encodeSelection,
  eventsForCategories,
  feedPath,
  type CategoryId,
  type ClassSlot,
  type Selection,
} from "@/lib/calendar-builder/selection";
import { todayInBangkok } from "@/lib/bangkok-today";
import { formatDate, type Locale } from "@/lib/i18n";
import ClassesStep, { type CourseOption } from "./ClassesStep";
import DeviceGuide from "./DeviceGuide";
import Preview, { type PreviewEvent } from "./Preview";
import { CategoryIcon, fill, plural, shortDate } from "./helpers";

export type BuilderTerm = {
  /** `2569-2`. */
  key: string;
  year: number;
  semester: number | string;
  start: string;
  end: string;
};

export type CalendarBuilderProps = {
  locale: Locale;
  copy: CalendarBuilderCopy;
  events: CalendarEvent[];
  courses: CourseOption[];
  term: BuilderTerm | null;
  /** Bangkok date when the page was rendered. */
  todayKey: string;
  siteUrl: string;
};

const STORAGE_KEY = "bir-calendar-builder:v1";

/** The reader's likely calendar app, from the user agent. */
export function guessDevice(userAgent: string, touchPoints = 0): DeviceId {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iphone";
  if (/Macintosh/i.test(userAgent)) return touchPoints > 1 ? "iphone" : "mac";
  if (/SamsungBrowser|SM-[A-Z0-9]|Samsung/i.test(userAgent)) return "samsung";
  if (/Android/i.test(userAgent)) return "android";
  if (/Windows|CrOS|Linux|X11/i.test(userAgent)) return "google";
  return "other";
}

function Step({
  n,
  id,
  heading,
  label,
  children,
}: {
  n: number;
  id: string;
  heading: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="flex scroll-mt-4 flex-col gap-5">
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-base font-bold text-surface"
        >
          {n}
        </span>
        <div>
          <p className="text-sm text-muted">{fill(label, { n })}</p>
          <h2 id={`${id}-heading`} className="font-display text-2xl">
            {heading}
          </h2>
        </div>
      </div>
      <div className="flex flex-col gap-5 sm:pl-[3.25rem]">{children}</div>
    </section>
  );
}

export default function CalendarBuilder({
  locale,
  copy,
  events,
  courses,
  term,
  todayKey: serverToday,
  siteUrl,
}: CalendarBuilderProps) {
  const [mounted, setMounted] = useState(false);
  const [todayKey, setTodayKey] = useState(serverToday);
  const [categories, setCategories] = useState<CategoryId[]>([...DEFAULT_CATEGORIES]);
  const [classes, setClasses] = useState<ClassSlot[]>([]);
  const [device, setDevice] = useState<DeviceId>("other");
  const [openRequest, setOpenRequest] = useState(0);

  // After mount: restore the saved choices, take the live date and guess the
  // device. Until then the server's defaults are shown, so hydration matches.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const restored = decodeSelection(new URLSearchParams(saved));
        setCategories(restored.categories);
        setClasses(restored.classes);
      }
    } catch {
      // Storage can be blocked. The page works without it.
    }
    setTodayKey(todayInBangkok());
    setDevice(guessDevice(navigator.userAgent, navigator.maxTouchPoints));
    setMounted(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const selection: Selection = useMemo(
    () => ({
      categories: CATEGORY_IDS.filter(
        (id) => categories.includes(id) && (id !== "classes" || term !== null)
      ),
      term: term?.key ?? "",
      classes: term ? classes : [],
    }),
    [categories, classes, term]
  );

  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        encodeSelection({ categories, term: term?.key ?? "", classes }).toString()
      );
    } catch {
      // Ignore storage failures.
    }
  }, [mounted, categories, classes, term]);

  const feedUrl = mounted
    ? `${siteUrl}${feedPath(locale, selection)}`
    : `${siteUrl}/${locale}/calendar.ics`;
  const links = useMemo(
    () => buildFeedLinks(feedUrl, copy.calendarName),
    [feedUrl, copy.calendarName]
  );

  const chosenEvents = useMemo(
    () => eventsForCategories(events, selection.categories),
    [events, selection.categories]
  );
  const previewEvents: PreviewEvent[] = chosenEvents.map((event) => ({
    id: event.id,
    start: event.start,
    end: event.end,
    title: event.title[locale],
    category: categoryForEvent(event),
  }));

  const classesChosen = selection.categories.includes("classes");
  const shownClasses = classesChosen ? selection.classes : [];
  const classesMissing = classesChosen && selection.classes.length === 0;
  const upcomingCount = previewEvents.filter((e) => (e.end ?? e.start) >= todayKey).length;

  const summary = (() => {
    const parts: string[] = [];
    if (upcomingCount > 0) parts.push(plural(copy.step3.summaryDates, upcomingCount));
    if (shownClasses.length > 0) parts.push(plural(copy.step3.summaryClasses, shownClasses.length));
    if (parts.length === 0) return copy.step3.summaryNone;
    if (parts.length === 1) return parts[0] as string;
    return fill(copy.step3.summaryJoin, { a: parts[0] as string, b: parts[1] as string });
  })();

  function toggle(id: CategoryId) {
    setCategories((current) =>
      current.includes(id) ? current.filter((c) => c !== id) : [...current, id]
    );
  }

  function categoryMeta(id: Exclude<CategoryId, "classes">): string {
    const upcoming = events
      .filter((e) => categoryForEvent(e) === id && (e.end ?? e.start) >= todayKey)
      .sort((a, b) => a.start.localeCompare(b.start) || a.id.localeCompare(b.id));
    const first = upcoming[0];
    if (!first) return copy.step1.none;
    const next = fill(copy.step1.next, {
      date: shortDate(locale, first.start < todayKey ? todayKey : first.start),
      title: first.title[locale],
    });
    return `${plural(copy.step1.upcoming, upcoming.length)}. ${next}`;
  }

  const termDates = term
    ? { start: formatDate(locale, term.start), end: formatDate(locale, term.end) }
    : null;

  return (
    <div className="wrap py-10">
      <noscript>
        <style>{`.js-only{display:none !important}.js-guide[hidden]{display:block !important}`}</style>
        <p className="mb-8 max-w-[var(--measure)] leading-relaxed text-muted">{copy.noScript}</p>
      </noscript>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-12">
        <div className="flex min-w-0 flex-col gap-12">
          <div className="js-only flex flex-col gap-12">
            <Step n={1} id="step-1" heading={copy.step1.heading} label={copy.stepLabel}>
              <p className="max-w-[var(--measure)] leading-relaxed text-muted">
                {copy.step1.intro}
              </p>
              <fieldset className="min-w-0 border-0 p-0">
                <legend className="sr-only">{copy.step1.heading}</legend>
                <ul className="flex flex-col gap-3">
                  {CATEGORY_IDS.map((id) => {
                    const disabled = id === "classes" && term === null;
                    const checked = categories.includes(id) && !disabled;
                    const meta =
                      id === "classes"
                        ? disabled
                          ? copy.step1.classesNoTerm
                          : classes.length > 0
                            ? plural(copy.step1.classesCount, classes.length)
                            : copy.step1.classesPrompt
                        : categoryMeta(id);
                    const info = copy.categories[id];
                    return (
                      <li key={id}>
                        <label
                          className={`flex min-h-11 cursor-pointer items-start gap-3.5 rounded-lg border bg-surface p-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink ${
                            checked ? "border-ink" : "border-line-strong"
                          } ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={() => toggle(id)}
                            aria-describedby={`cat-${id}-desc`}
                            className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-brand)]"
                          />
                          <span className="flex min-w-0 flex-col gap-1">
                            <span className="flex items-center gap-2 font-semibold text-ink">
                              <CategoryIcon id={id} className="h-[1.1rem] w-[1.1rem] shrink-0" />
                              {info.label}
                            </span>
                            <span id={`cat-${id}-desc`} className="flex flex-col gap-1">
                              <span className="text-sm leading-relaxed text-muted">
                                {info.description}
                              </span>
                              <span className="text-sm leading-relaxed text-ink">{meta}</span>
                            </span>
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
              <p className="lg:hidden">
                <a href="#preview" className="text-sm font-semibold text-brand-deep underline">
                  {copy.skipToPreview}
                </a>
              </p>
            </Step>

            <Step n={2} id="step-2" heading={copy.step2.heading} label={copy.stepLabel}>
              <p className="max-w-[var(--measure)] leading-relaxed text-muted">
                {copy.step2.intro}
              </p>
              <div>
                <ClassesStep
                  copy={copy}
                  term={term}
                  termDates={termDates}
                  courses={courses}
                  classes={classes}
                  onChange={(next) => setClasses(next.slice(0, MAX_CLASSES))}
                  onAdded={() =>
                    setCategories((current) =>
                      current.includes("classes") ? current : [...current, "classes"]
                    )
                  }
                  openRequest={openRequest}
                />
              </div>
            </Step>
          </div>

          <Step n={3} id="step-3" heading={copy.step3.heading} label={copy.stepLabel}>
            <p className="max-w-[var(--measure)] leading-relaxed text-muted">{copy.step3.intro}</p>
            <p className="js-only font-semibold text-ink">{summary}</p>
            {classesMissing ? (
              <p className="leading-relaxed text-ink">{copy.step3.classesMissing}</p>
            ) : null}
            <fieldset className="js-only min-w-0 border-0 p-0">
              <legend className="mb-3 text-base font-semibold text-ink">
                {copy.step3.question}
              </legend>
              <div className="flex flex-col gap-2">
                {copy.step3.guides.map((guide) => (
                  <label
                    key={guide.id}
                    className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-line-strong bg-surface px-4 py-2.5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink"
                  >
                    <input
                      type="radio"
                      name="device"
                      value={guide.id}
                      checked={device === guide.id}
                      onChange={() => setDevice(guide.id)}
                      className="h-5 w-5 shrink-0 accent-[var(--color-brand)]"
                    />
                    <span className="text-ink">{guide.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-col gap-10">
              {copy.step3.guides.map((guide) => (
                <DeviceGuide
                  key={guide.id}
                  guide={guide}
                  feedUrl={feedUrl}
                  links={links}
                  copy={copy.step3}
                  active={device === guide.id}
                />
              ))}
            </div>
            <div className="flex max-w-[var(--measure)] flex-col gap-2 text-sm leading-relaxed text-muted">
              <p>{copy.step3.subscribeNote}</p>
              <p>{copy.step3.changeNote}</p>
            </div>
          </Step>
        </div>

        <div className="js-only">
          <Preview
            locale={locale}
            copy={copy}
            events={previewEvents}
            classes={shownClasses}
            courses={courses}
            classesMissing={classesMissing}
            todayKey={todayKey}
            summary={summary}
            onAddClass={() => setOpenRequest((n) => n + 1)}
          />
        </div>
      </div>
    </div>
  );
}
