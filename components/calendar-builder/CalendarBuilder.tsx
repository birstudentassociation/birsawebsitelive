"use client";

/**
 * The calendar builder: three steps (choose dates, add class times, add to a
 * calendar app), one per page, beside a live preview. Owns the selection, which lives in the
 * feed link's query string and in this browser's localStorage, never on the
 * server. The server render and first client render use the defaults and the
 * public feed link, so with JavaScript off the guides still work.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/Button";
import type { CalendarEvent } from "@/content/calendar/events";
import { defaultTeachingTerm, termKeyOf } from "@/content/calendar/terms";
import { findTimetableEntry } from "@/content/calendar/timetable";
import type { CalendarBuilderCopy, DeviceId } from "@/content/calendar-builder/types";
import { buildFeedLinks } from "@/lib/calendar-builder/links";
import { examOccurrences, examTitle } from "@/lib/calendar-builder/exams";
import {
  STORAGE_KEY,
  STORAGE_KEY_V1,
  readStoredState,
  writeStoredState,
} from "@/lib/calendar-builder/storage";
import {
  CATEGORY_IDS,
  DEFAULT_CATEGORIES,
  MAX_CLASSES,
  categoryForEvent,
  eventsForCategories,
  feedPath,
  type CategoryId,
  type ClassSlot,
  type PublicCategoryId,
  type Selection,
} from "@/lib/calendar-builder/selection";
import { todayInBangkok } from "@/lib/bangkok-today";
import { formatDate, type Locale } from "@/lib/i18n";
import ClassesStep, { type BuilderTerm, type CourseOption } from "./ClassesStep";
import DeviceGuide from "./DeviceGuide";
import Preview, { type PreviewEvent } from "./Preview";
import { CategoryIcon, fill, plural, shortDate } from "./helpers";

export type { BuilderTerm };

export type CalendarBuilderProps = {
  locale: Locale;
  copy: CalendarBuilderCopy;
  events: CalendarEvent[];
  courses: CourseOption[];
  /** Terms that are current or still to come; empty when no dates are published. */
  terms: BuilderTerm[];
  /** The term to start on, from the server's date. */
  defaultTermKey: string;
  /** Bangkok date when the page was rendered. */
  todayKey: string;
  siteUrl: string;
};

/** The reader's likely calendar app, from the user agent. */
export function guessDevice(userAgent: string, touchPoints = 0): DeviceId {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iphone";
  if (/Macintosh/i.test(userAgent)) return touchPoints > 1 ? "iphone" : "mac";
  if (/SamsungBrowser|SM-[A-Z0-9]|Samsung/i.test(userAgent)) return "samsung";
  if (/Android/i.test(userAgent)) return "android";
  if (/Windows|CrOS|Linux|X11/i.test(userAgent)) return "google";
  return "other";
}

type StepNumber = 1 | 2 | 3;

function stepFromHash(hash: string): StepNumber | null {
  const match = /^#step-([123])$/.exec(hash);
  return match ? (Number(match[1]) as StepNumber) : null;
}

function Step({
  n,
  id,
  heading,
  label,
  hidden,
  back,
  children,
}: {
  n: number;
  id: string;
  heading: string;
  label: string;
  hidden: boolean;
  back?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      hidden={hidden}
      className="flex scroll-mt-24 flex-col gap-5"
    >
      {back}
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-base font-bold text-surface"
        >
          {n}
        </span>
        <div>
          <p className="text-sm text-muted">{fill(label, { n })}</p>
          <h2
            id={`${id}-heading`}
            tabIndex={-1}
            className="font-display text-2xl focus:outline-none"
          >
            {heading}
          </h2>
        </div>
      </div>
      <div className="flex flex-col gap-5 sm:pl-[3.25rem]">{children}</div>
    </section>
  );
}

function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 items-center gap-1.5 self-start text-sm font-semibold text-ink underline underline-offset-4"
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none">
        <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {label}
    </button>
  );
}

export default function CalendarBuilder({
  locale,
  copy,
  events,
  courses,
  terms,
  defaultTermKey,
  todayKey: serverToday,
  siteUrl,
}: CalendarBuilderProps) {
  const [mounted, setMounted] = useState(false);
  const [todayKey, setTodayKey] = useState(serverToday);
  const [categories, setCategories] = useState<CategoryId[]>([...DEFAULT_CATEGORIES]);
  const [termKey, setTermKey] = useState(defaultTermKey);
  const [classesByTerm, setClassesByTerm] = useState<Record<string, ClassSlot[]>>({});
  const [device, setDevice] = useState<DeviceId>("other");
  const [openRequest, setOpenRequest] = useState(0);
  const [step, setStep] = useState<StepNumber>(1);
  const moved = useRef(false);

  function goTo(next: StepNumber) {
    moved.current = true;
    setStep(next);
    try {
      window.history.pushState(null, "", `#step-${next}`);
    } catch {
      // History can be unavailable. The step still changes.
    }
  }

  useEffect(() => {
    const sync = () => setStep(stepFromHash(window.location.hash) ?? 1);
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    const heading = document.getElementById(`step-${step}-heading`);
    heading?.focus();
    document.getElementById(`step-${step}`)?.scrollIntoView?.({ block: "start" });
  }, [step]);

  // After mount: restore the saved choices, take the live date and guess the
  // device. Until then the server's defaults are shown, so hydration matches.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const today = todayInBangkok();
    let chosen = defaultTermKey;
    const live = defaultTeachingTerm(today);
    if (live && terms.some((t) => t.key === termKeyOf(live))) chosen = termKeyOf(live);
    try {
      const saved = readStoredState(
        window.localStorage.getItem(STORAGE_KEY),
        window.localStorage.getItem(STORAGE_KEY_V1)
      );
      setCategories(saved.categories);
      setClassesByTerm(saved.classesByTerm);
      if (saved.term && terms.some((t) => t.key === saved.term)) chosen = saved.term;
    } catch {
      // Storage can be blocked. The page works without it.
    }
    setTermKey(chosen);
    setStep(stepFromHash(window.location.hash) ?? 1);
    setTodayKey(today);
    setDevice(guessDevice(navigator.userAgent, navigator.maxTouchPoints));
    setMounted(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    // Runs once on mount, from the props the server rendered with.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const term = terms.find((t) => t.key === termKey) ?? null;
  const classes = useMemo(
    () => (term ? (classesByTerm[term.key] ?? []) : []),
    [classesByTerm, term]
  );
  const exams = useMemo(
    () => (term ? examOccurrences(term.key, classes, locale) : []),
    [classes, locale, term]
  );
  const timetabledCount = (list: ClassSlot[]) =>
    term ? list.filter((slot) => findTimetableEntry(term.key, slot.code, slot.section)).length : 0;
  const examsAvailable = exams.length > 0;

  const selection: Selection = useMemo(
    () => ({
      categories: CATEGORY_IDS.filter(
        (id) =>
          categories.includes(id) &&
          (id !== "classes" || term !== null) &&
          (id !== "exams" || examsAvailable)
      ),
      term: term?.key ?? "",
      classes: term ? classes : [],
    }),
    [categories, classes, term, examsAvailable]
  );

  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        writeStoredState({ categories, term: termKey, classesByTerm })
      );
      window.localStorage.removeItem(STORAGE_KEY_V1);
    } catch {
      // Ignore storage failures.
    }
  }, [mounted, categories, termKey, classesByTerm]);

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
  const examsChosen = selection.categories.includes("exams");
  const previewEvents: PreviewEvent[] = [
    ...chosenEvents.map((event) => ({
      id: event.id,
      start: event.start,
      end: event.end,
      title: event.title[locale],
      category: categoryForEvent(event),
    })),
    ...(examsChosen
      ? exams.map((exam) => ({
          id: exam.id,
          start: exam.date,
          title: examTitle(exam, locale),
          category: "exams" as const,
          time: fill(copy.preview.range, { start: exam.start, end: exam.end }),
          ...(exam.room ? { place: exam.room } : {}),
        }))
      : []),
  ];

  const classesChosen = selection.categories.includes("classes");
  const shownClasses = classesChosen ? selection.classes : [];
  const classesMissing = classesChosen && selection.classes.length === 0;
  const isUpcoming = (e: PreviewEvent) => (e.end ?? e.start) >= todayKey;
  const upcomingCount = previewEvents.filter((e) => e.category !== "exams" && isUpcoming(e)).length;
  const upcomingExams = previewEvents.filter((e) => e.category === "exams" && isUpcoming(e)).length;

  const summary = (() => {
    const parts: string[] = [];
    if (upcomingCount > 0) parts.push(plural(copy.step3.summaryDates, upcomingCount));
    if (shownClasses.length > 0) parts.push(plural(copy.step3.summaryClasses, shownClasses.length));
    if (upcomingExams > 0) parts.push(plural(copy.step3.summaryExams, upcomingExams));
    if (parts.length === 0) return copy.step3.summaryNone;
    if (parts.length === 1) return parts[0] as string;
    if (parts.length === 2) {
      return fill(copy.step3.summaryJoin, { a: parts[0] as string, b: parts[1] as string });
    }
    return fill(copy.step3.summaryJoin3, {
      a: parts[0] as string,
      b: parts[1] as string,
      c: parts[2] as string,
    });
  })();

  function changeClasses(next: ClassSlot[]) {
    const trimmed = next.slice(0, MAX_CLASSES);
    if (!term) return;
    setClassesByTerm((current) => ({ ...current, [term.key]: trimmed }));
    // Adding a class switches on "My class times", and the first class from
    // the timetable also switches on "My exams".
    const gain = (id: CategoryId) =>
      setCategories((current) => (current.includes(id) ? current : [...current, id]));
    if (trimmed.length > classes.length) gain("classes");
    if (timetabledCount(classes) === 0 && timetabledCount(trimmed) > 0) gain("exams");
  }

  function toggle(id: CategoryId) {
    setCategories((current) =>
      current.includes(id) ? current.filter((c) => c !== id) : [...current, id]
    );
  }

  function categoryMeta(id: PublicCategoryId): string {
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

  const termDates = Object.fromEntries(
    terms.map((t) => [
      t.key,
      { start: formatDate(locale, t.start), end: formatDate(locale, t.end) },
    ])
  );

  return (
    <div className="wrap py-10">
      <noscript>
        <style>{`.js-only{display:none !important}@layer base{.js-guide[hidden],#step-3[hidden]{display:flex !important}}`}</style>
        <p className="mb-8 max-w-[var(--measure)] leading-relaxed text-muted">{copy.noScript}</p>
      </noscript>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-12">
        <div className="flex min-w-0 flex-col gap-12">
          <div className="js-only flex flex-col gap-12">
            <Step
              n={1}
              id="step-1"
              heading={copy.step1.heading}
              label={copy.stepLabel}
              hidden={step !== 1}
            >
              <p className="max-w-[var(--measure)] leading-relaxed text-muted">
                {copy.step1.intro}
              </p>
              <fieldset className="min-w-0 border-0 p-0">
                <legend className="sr-only">{copy.step1.heading}</legend>
                <ul className="flex flex-col gap-3">
                  {CATEGORY_IDS.map((id) => {
                    const disabled =
                      (id === "classes" && term === null) || (id === "exams" && !examsAvailable);
                    const checked = categories.includes(id) && !disabled;
                    const meta =
                      id === "classes"
                        ? disabled
                          ? copy.step1.classesNoTerm
                          : classes.length > 0
                            ? plural(copy.step1.classesCount, classes.length)
                            : copy.step1.classesPrompt
                        : id === "exams"
                          ? disabled
                            ? copy.step1.examsNone
                            : plural(copy.step1.examsCount, exams.length)
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
              <div>
                <Button type="button" onClick={() => goTo(2)}>
                  {copy.continue}
                </Button>
              </div>
            </Step>

            <Step
              n={2}
              id="step-2"
              heading={copy.step2.heading}
              label={copy.stepLabel}
              hidden={step !== 2}
              back={<BackButton label={copy.back} onClick={() => goTo(1)} />}
            >
              <p className="max-w-[var(--measure)] leading-relaxed text-muted">
                {copy.step2.intro}
              </p>
              <div>
                <ClassesStep
                  copy={copy}
                  locale={locale}
                  terms={terms}
                  termKey={termKey}
                  onTermChange={setTermKey}
                  termDates={termDates}
                  courses={courses}
                  classes={classes}
                  onChange={changeClasses}
                  openRequest={openRequest}
                />
              </div>
              <div>
                <Button type="button" onClick={() => goTo(3)}>
                  {copy.continue}
                </Button>
              </div>
            </Step>
          </div>

          <Step
            n={3}
            id="step-3"
            heading={copy.step3.heading}
            label={copy.stepLabel}
            hidden={step !== 3}
            back={
              <div className="js-only">
                <BackButton label={copy.back} onClick={() => goTo(2)} />
              </div>
            }
          >
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
            termKey={termKey}
            classesMissing={classesMissing}
            todayKey={todayKey}
            summary={summary}
            onAddClass={() => {
              if (step !== 2) goTo(2);
              setOpenRequest((n) => n + 1);
            }}
          />
        </div>
      </div>
    </div>
  );
}
