"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import {
  TIMETABLE_GROUPS,
  TIMETABLE_GROUP_NAMES,
  formatRoom,
  type TimetableEntry,
  type TimetableGroup,
} from "@/content/calendar/timetable";
import {
  STORAGE_KEY,
  STORAGE_KEY_V1,
  readStoredState,
  writeStoredState,
} from "@/lib/calendar-builder/storage";
import { getBangkokParts } from "@/lib/shuttle";
import { localeHref, type Locale } from "@/lib/i18n";
import {
  PREREQUISITES_2569_2,
  TAUGHT_WITH_2569_2,
  clashesWith,
  daysBetween,
  decodeShare,
  encodeShare,
  entryId,
  examClashesWith,
  examsOverlap,
  feeFor,
  idsFromSlots,
  mergeSlots,
  nextUp,
  resolveIds,
  termStatus,
  toMinutes,
  toggleEntry,
  weekBlocks,
  weekRange,
  type AgendaItem,
  type Milestone,
  type NoClassDay,
} from "@/lib/timetable-planner";
import { plannerCopy, type PlannerCopy } from "./copy";

export type TimetablePlannerProps = {
  locale: Locale;
  termKey: string;
  entries: TimetableEntry[];
  milestones: Milestone[];
  noClassDays: NoClassDay[];
  coursePages: string[];
  todayKey: string;
};

type Filter = "all" | "mine" | TimetableGroup;

const SHARE_PARAM = "courses";

function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in vars ? String(vars[key]) : whole
  );
}

function plural(forms: { one: string; other: string }, n: number): string {
  return fill(n === 1 ? forms.one : forms.other, { n });
}

const intl = (locale: Locale) => (locale === "th" ? "th-TH-u-ca-gregory" : "en-GB");

function longDate(locale: Locale, key: string): string {
  return new Intl.DateTimeFormat(intl(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${key}T00:00:00Z`));
}

function shortDate(locale: Locale, key: string): string {
  return new Intl.DateTimeFormat(intl(locale), {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${key}T00:00:00Z`));
}

function clock(locale: Locale, time: string): string {
  return locale === "th" ? time.replace(":", ".") : time;
}

function span(c: PlannerCopy, locale: Locale, start: string, end: string): string {
  return `${clock(locale, start)} ${c.to} ${clock(locale, end)}${c.timeSuffix}`;
}

function money(locale: Locale, n: number): string {
  return new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-GB").format(n);
}

function matches(entry: TimetableEntry, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = [
    entry.code,
    entry.title,
    entry.lecturer ?? "",
    entry.room,
    formatRoom(entry.room, "th"),
    entry.section ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return q.split(/\s+/).every((word) => hay.includes(word));
}

export default function TimetablePlanner({
  locale,
  termKey,
  entries,
  milestones,
  noClassDays,
  coursePages,
  todayKey: serverToday,
}: TimetablePlannerProps) {
  const c = plannerCopy[locale];
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState(serverToday);
  const [nowMinutes, setNowMinutes] = useState(0);
  const [mine, setMine] = useState<string[]>([]);
  const [shared, setShared] = useState<string[] | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [fitsOnly, setFitsOnly] = useState(false);
  const [message, setMessage] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const saved = readStoredState(
        window.localStorage.getItem(STORAGE_KEY),
        window.localStorage.getItem(STORAGE_KEY_V1)
      );
      setMine(idsFromSlots(termKey, saved.classesByTerm[termKey] ?? []));
    } catch {}
    const fromUrl = decodeShare(
      new URLSearchParams(window.location.search).get(SHARE_PARAM),
      entries
    );
    if (fromUrl.length > 0) setShared(fromUrl);
    const tick = () => {
      const parts = getBangkokParts();
      setToday(parts.date);
      setNowMinutes(parts.minutes);
    };
    tick();
    setMounted(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [entries, termKey]);

  useEffect(() => {
    if (!mounted || shared) return;
    try {
      const saved = readStoredState(
        window.localStorage.getItem(STORAGE_KEY),
        window.localStorage.getItem(STORAGE_KEY_V1)
      );
      const picked = resolveIds(mine, entries);
      const slots = mergeSlots(termKey, saved.classesByTerm[termKey] ?? [], picked, locale);
      const classesByTerm = { ...saved.classesByTerm, [termKey]: slots };
      window.localStorage.setItem(
        STORAGE_KEY,
        writeStoredState({ ...saved, term: saved.term ?? termKey, classesByTerm })
      );
      window.localStorage.removeItem(STORAGE_KEY_V1);
    } catch {}
  }, [mounted, mine, shared, entries, termKey, locale]);

  const ids = shared ?? mine;
  const picked = useMemo(() => resolveIds(ids, entries), [ids, entries]);
  const pickedIds = useMemo(() => new Set(picked.map(entryId)), [picked]);
  const pickedCodes = useMemo(() => new Set(picked.map((e) => e.code)), [picked]);
  const status = useMemo(() => termStatus(today, milestones), [today, milestones]);
  const upNext = useMemo(
    () => (mounted ? nextUp(today, nowMinutes, picked, milestones, noClassDays) : null),
    [mounted, today, nowMinutes, picked, milestones, noClassDays]
  );
  const pages = useMemo(() => new Set(coursePages), [coursePages]);

  useEffect(() => {
    if (!mounted) return;
    const url = new URL(window.location.href);
    url.hash = "";
    if (picked.length > 0) url.searchParams.set(SHARE_PARAM, encodeShare(picked.map(entryId)));
    else url.searchParams.delete(SHARE_PARAM);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShareUrl(url.toString().replace(/%2C/g, ","));
    setCopyState("idle");
  }, [mounted, picked]);

  function update(next: string[]) {
    if (shared) setShared(next);
    else setMine(next);
  }

  function toggle(entry: TimetableEntry) {
    setMessage("");
    update(toggleEntry(ids, entry, entries));
  }

  function quickAdd(group: "year1" | "year2" | "year3") {
    const inGroup = entries.filter((e) => e.group === group);
    const codes = [...new Set(inGroup.map((e) => e.code))];
    let next = [...ids];
    let added = 0;
    let needsSection = false;
    for (const code of codes) {
      const options = inGroup.filter((e) => e.code === code);
      if (pickedCodes.has(code)) continue;
      if (options.length > 1) {
        needsSection = true;
        continue;
      }
      next = toggleEntry(next, options[0] as TimetableEntry, entries);
      added++;
    }
    update(next);
    setFilter(group);
    setQuery("");
    const parts = [added > 0 ? plural(c.pick.quickDone, added) : c.pick.quickNone];
    if (needsSection) parts.push(c.pick.sectionPrompt);
    setMessage(parts.join(". ") + (locale === "en" ? "." : ""));
  }

  const visible = entries.filter((entry) => {
    if (filter === "mine" && !pickedIds.has(entryId(entry))) return false;
    if (filter !== "all" && filter !== "mine" && entry.group !== filter) return false;
    if (
      fitsOnly &&
      !pickedIds.has(entryId(entry)) &&
      (pickedCodes.has(entry.code) || clashesWith(entry, picked).length > 0)
    )
      return false;
    return matches(entry, query);
  });

  const clashPairs = useMemo(() => {
    let n = 0;
    picked.forEach((a, i) =>
      picked.slice(i + 1).forEach((b) => {
        if (clashesWith(a, [b]).length > 0) n++;
      })
    );
    return n;
  }, [picked]);

  const credits = picked.length * 3;
  const fee = feeFor(credits);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  function clearAll() {
    if (!window.confirm(c.actions.clearConfirm)) return;
    update([]);
    setMessage("");
  }

  function keepShared() {
    if (!shared) return;
    setMine(shared);
    setShared(null);
    dropShareParam();
  }

  function showMine() {
    setShared(null);
    dropShareParam();
  }

  function dropShareParam() {
    const url = new URL(window.location.href);
    url.searchParams.delete(SHARE_PARAM);
    window.history.replaceState(null, "", url.toString());
  }

  const filters: Filter[] = ["all", ...TIMETABLE_GROUPS, "mine"];

  return (
    <div className="flex flex-col gap-8 text-base leading-normal [&_h3]:mt-0 [&_li]:mt-0 [&_ol]:list-none [&_ol]:p-0 [&_ul]:list-none [&_ul]:p-0">
      <StatusCard c={c} locale={locale} status={status} upNext={upNext} today={today} />

      {shared ? (
        <div
          role="status"
          className="flex flex-col gap-3 rounded-lg border-[1.5px] border-info bg-info-tint p-4"
        >
          <p className="font-semibold">{c.shared.title}</p>
          <p className="text-sm">{c.shared.body}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={keepShared}
              className="focus-halo inline-flex h-11 items-center rounded-lg bg-brand px-4 font-semibold text-white hover:bg-brand-strong"
            >
              {c.shared.keep}
            </button>
            <button
              type="button"
              onClick={showMine}
              className="inline-flex h-11 items-center rounded-lg border-[1.5px] border-ink px-4 font-semibold hover:bg-sunken"
            >
              {c.shared.mine}
            </button>
          </div>
        </div>
      ) : null}

      <section aria-labelledby="planner-pick" className="flex flex-col gap-4">
        <div>
          <h3 id="planner-pick" className="font-display text-xl">
            {c.pick.heading}
          </h3>
          <p className="mt-1 text-muted">{c.pick.intro}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-muted">{c.pick.quickLabel}</span>
          {(["year1", "year2", "year3"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => quickAdd(g)}
              className="inline-flex h-10 items-center gap-1 rounded-full border-[1.5px] border-ink px-4 text-sm font-semibold hover:bg-sunken"
            >
              <span aria-hidden="true">+</span> {c.pick.quickYear[g]}
            </button>
          ))}
        </div>
        <p
          role="status"
          className={clsx("text-sm font-semibold text-success", !message && "sr-only")}
        >
          {message}
        </p>

        <div className="flex flex-col gap-1">
          <label htmlFor="planner-search" className="font-semibold">
            {c.pick.search}
          </label>
          <span id="planner-search-hint" className="text-sm text-muted">
            {c.pick.searchHint}
          </span>
          <input
            id="planner-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-describedby="planner-search-hint"
            autoComplete="off"
            className="h-11 w-full rounded-lg border-[1.5px] border-input-border bg-surface px-3"
          />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">{c.pick.filters}</legend>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const label =
                f === "all"
                  ? c.pick.all
                  : f === "mine"
                    ? `${c.pick.mine} (${picked.length})`
                    : c.pick.shortGroups[f];
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  title={f !== "all" && f !== "mine" ? TIMETABLE_GROUP_NAMES[f][locale] : undefined}
                  onClick={() => setFilter(f)}
                  className={clsx(
                    "inline-flex h-9 shrink-0 items-center rounded-full border-[1.5px] px-3 text-sm font-semibold",
                    filter === f
                      ? "border-ink bg-ink text-surface"
                      : "border-line-strong text-ink hover:bg-sunken"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={fitsOnly}
              onChange={(e) => setFitsOnly(e.target.checked)}
              className="mt-0.5 h-5 w-5 accent-[var(--color-brand)]"
            />
            <span>
              <span className="font-semibold">{c.pick.fits}</span>
              <span className="block text-muted">{c.pick.fitsHint}</span>
            </span>
          </label>
        </fieldset>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted" aria-live="polite">
            {plural(c.pick.count, visible.length)}
          </p>
          {visible.length === 0 ? (
            <div className="rounded-lg border border-dashed border-line-strong p-5 text-center">
              <p>{c.pick.noMatch}</p>
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mt-2 font-semibold text-brand-deep underline"
                >
                  {c.pick.reset}
                </button>
              ) : null}
            </div>
          ) : (
            <ul
              aria-label={c.pick.heading}
              className="flex max-h-[34rem] flex-col gap-2 overflow-y-auto overscroll-contain rounded-lg border border-line bg-sunken/50 p-2"
            >
              {visible.map((entry) => (
                <CourseRow
                  key={entryId(entry)}
                  c={c}
                  locale={locale}
                  entry={entry}
                  picked={picked}
                  selected={pickedIds.has(entryId(entry))}
                  hasPage={pages.has(entry.code)}
                  onToggle={() => toggle(entry)}
                />
              ))}
            </ul>
          )}
        </div>
      </section>

      <section aria-labelledby="planner-week" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 id="planner-week" className="font-display text-xl">
            {c.week.heading}
          </h3>
          {picked.length > 0 ? (
            <p className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-sunken px-3 py-1 font-semibold">
                {plural(c.pick.count, picked.length)}, {fill(c.week.credits, { n: credits })}
              </span>
              <span
                className={clsx(
                  "rounded-full px-3 py-1 font-semibold",
                  clashPairs > 0 ? "bg-warning-tint text-warning" : "bg-success-tint text-success"
                )}
              >
                {clashPairs > 0 ? `⚠ ${plural(c.week.clashes, clashPairs)}` : `✓ ${c.week.noClash}`}
              </span>
            </p>
          ) : null}
        </div>
        {picked.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line-strong p-5 text-center text-muted">
            {c.week.empty}
          </p>
        ) : (
          <>
            <WeekGrid c={c} locale={locale} picked={picked} today={today} status={status} />
            <WeekList c={c} locale={locale} picked={picked} />
            {fee ? (
              <p className="text-sm text-muted">
                {fill(c.week.fees, {
                  n: credits,
                  thai: money(locale, fee.thai),
                  foreign: money(locale, fee.foreign),
                })}
              </p>
            ) : credits > 21 ? (
              <p className="text-sm text-muted">{c.week.feesOver}</p>
            ) : null}
          </>
        )}
      </section>

      {picked.length > 0 ? (
        <section aria-labelledby="planner-exams" className="flex flex-col gap-4">
          <h3 id="planner-exams" className="font-display text-xl">
            {c.exams.heading}
          </h3>
          <ExamList c={c} locale={locale} picked={picked} kind="midterm" today={today} />
          <ExamList c={c} locale={locale} picked={picked} kind="final" today={today} />
        </section>
      ) : null}

      {picked.length > 0 ? (
        <div className="flex flex-col gap-3 rounded-lg border border-line bg-sunken p-4">
          <div className="flex flex-wrap gap-2">
            {!shared ? (
              <a
                href={localeHref(locale, "/services/calendar")}
                className="focus-halo inline-flex h-11 items-center rounded-lg bg-brand px-4 font-semibold text-white no-underline hover:bg-brand-strong"
              >
                {c.actions.calendar}
              </a>
            ) : null}
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex h-11 items-center rounded-lg border-[1.5px] border-ink px-4 font-semibold hover:bg-surface"
            >
              {copyState === "copied" ? `✓ ${c.actions.copied}` : c.actions.share}
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex h-11 items-center rounded-lg px-4 font-semibold text-brand-deep hover:bg-surface"
            >
              {c.actions.clear}
            </button>
          </div>
          {!shared ? <p className="text-sm text-muted">{c.actions.calendarHint}</p> : null}
          {copyState === "failed" ? (
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-semibold">{c.actions.copyFailed}</span>
              <input
                readOnly
                value={shareUrl}
                onFocus={(e) => e.currentTarget.select()}
                className="h-11 w-full rounded-lg border-[1.5px] border-input-border bg-surface px-3"
              />
            </label>
          ) : null}
          <span className="sr-only" role="status">
            {copyState === "copied" ? c.actions.copied : ""}
          </span>
        </div>
      ) : null}
    </div>
  );
}

function StatusCard({
  c,
  locale,
  status,
  upNext,
  today,
}: {
  c: PlannerCopy;
  locale: Locale;
  status: ReturnType<typeof termStatus>;
  upNext: { item: AgendaItem; live: boolean } | null;
  today: string;
}) {
  const focus = status.focus;
  let headline = c.status.ended;
  let sub = "";
  if (focus && focus.state === "now") {
    const m = focus.milestone;
    const end = longDate(locale, m.end);
    if (m.id === "registration") headline = fill(c.status.nowRegistration, { date: end });
    if (m.id === "payment") headline = fill(c.status.nowPayment, { date: end });
    if (m.id === "midterms") headline = fill(c.status.nowMidterms, { date: end });
    if (m.id === "finals") headline = fill(c.status.nowFinals, { date: end });
    if (m.id === "classes")
      headline = fill(c.status.nowClasses, { week: status.week ?? 1, total: status.totalWeeks });
  } else if (focus) {
    const m = focus.milestone;
    const when =
      focus.daysUntil === 1 ? c.status.tomorrow : plural(c.status.inDays, focus.daysUntil);
    headline = fill(c.status.next, {
      name: c.milestones[m.id],
      when,
      date: longDate(locale, m.start),
    });
  }
  if (status.focus?.state === "now" && status.focus.milestone.id !== "classes") {
    const classes = status.milestones.find((r) => r.milestone.id === "classes");
    if (classes?.state === "now" && status.week)
      sub = fill(c.status.nowClasses, { week: status.week, total: status.totalWeeks });
  }

  return (
    <section
      aria-label={c.status.label}
      className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-4 sm:p-5"
    >
      <div>
        <p className="text-sm font-semibold tracking-wide text-muted uppercase">{c.status.label}</p>
        <p className="mt-1 font-display text-xl text-ink">{headline}</p>
        {sub ? <p className="text-muted">{sub}</p> : null}
      </div>
      <ol className="grid grid-cols-5 gap-1" aria-label={c.status.label}>
        {status.milestones.map(({ milestone, state }) => (
          <li key={milestone.id} className="flex min-w-0 flex-col gap-1">
            <span
              aria-hidden="true"
              className={clsx(
                "h-1.5 rounded-full",
                state === "past" && "bg-ink",
                state === "now" && "bg-brand",
                state === "next" && "bg-line-strong",
                state === "later" && "bg-line"
              )}
            />
            <span
              className={clsx(
                "truncate text-xs font-semibold sm:text-sm",
                state === "now" ? "text-brand-deep" : state === "past" ? "text-muted" : "text-ink"
              )}
            >
              {c.milestones[milestone.id]}
              {state === "now" ? <span className="sr-only"> ({c.status.today})</span> : null}
              {state === "past" ? <span className="sr-only"> ({c.status.done})</span> : null}
            </span>
            <span className="truncate text-xs text-muted">
              {shortDate(locale, milestone.start).replace(/^\S+\s/, "")}
            </span>
          </li>
        ))}
      </ol>
      {upNext ? (
        <div className="flex items-start gap-3 rounded-lg bg-brand-tint p-3">
          <span
            aria-hidden="true"
            className={clsx(
              "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
              upNext.live ? "animate-pulse bg-brand" : "bg-brand-deep"
            )}
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-brand-deep">
              {upNext.live ? c.nextUp.live : c.nextUp.label}
            </p>
            <p className="font-semibold">
              {upNext.item.entry.code} {upNext.item.entry.title}
            </p>
            <p className="text-sm">
              {c.nextUp.kind[upNext.item.kind]}, {relativeDay(c, locale, today, upNext.item.date)},{" "}
              {span(c, locale, upNext.item.start, upNext.item.end)}
              {upNext.item.room ? `, ${formatRoom(upNext.item.room, locale)}` : ""}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function relativeDay(c: PlannerCopy, locale: Locale, today: string, date: string): string {
  const diff = daysBetween(today, date);
  if (diff === 0) return c.nextUp.today;
  if (diff === 1) return c.nextUp.tomorrow;
  return longDate(locale, date);
}

function CourseRow({
  c,
  locale,
  entry,
  picked,
  selected,
  hasPage,
  onToggle,
}: {
  c: PlannerCopy;
  locale: Locale;
  entry: TimetableEntry;
  picked: TimetableEntry[];
  selected: boolean;
  hasPage: boolean;
  onToggle: () => void;
}) {
  const others = picked.filter((p) => entryId(p) !== entryId(entry) && p.code !== entry.code);
  const clash = clashesWith(entry, others);
  const examClash = examClashesWith(entry, others).filter((e) => !clash.includes(e));
  const prereq = PREREQUISITES_2569_2[entry.code];
  const joint = TAUGHT_WITH_2569_2[entry.code];
  const sameCodePicked = !selected && picked.some((p) => p.code === entry.code);
  const finalRoom = entry.final.room ?? entry.final.groups?.map((g) => g.room).join(" / ");
  const labelId = `course-${entryId(entry)}`;

  return (
    <li
      className={clsx(
        "flex gap-3 rounded-lg border-[1.5px] p-3 transition-colors",
        selected ? "border-brand bg-brand-tint" : "border-line bg-surface"
      )}
    >
      <div className="min-w-0 flex-1">
        <p id={labelId} className="font-semibold">
          <span className="mr-1.5 font-mono text-[0.95em]">{entry.code}</span>
          {entry.title}
          {entry.section ? (
            <span className="ml-1.5 text-sm font-normal text-muted">
              {fill(c.pick.section, { section: entry.section })}
            </span>
          ) : null}
        </p>
        <p className="text-sm">
          <span className="font-semibold">{c.days[entry.day]}</span>{" "}
          {span(c, locale, entry.start, entry.end)}, {formatRoom(entry.room, locale)}
          {entry.lecturer ? <span className="text-muted">, {entry.lecturer}</span> : null}
        </p>
        <p className="text-sm text-muted">
          {c.pick.midterm} {shortDate(locale, entry.midterm.date)}, {c.pick.final}{" "}
          {shortDate(locale, entry.final.date)}
          {finalRoom ? ` ${formatRoom(finalRoom, locale)}` : ""}
        </p>
        {clash.length > 0 || examClash.length > 0 || prereq || joint ? (
          <p className="mt-1 flex flex-wrap gap-1.5">
            {clash.length > 0 ? (
              <Badge tone="warning">
                ⚠ {fill(c.pick.clash, { codes: clash.map((e) => e.code).join(", ") })}
              </Badge>
            ) : null}
            {examClash.length > 0 ? (
              <Badge tone="warning">
                ⚠ {fill(c.pick.examClash, { codes: examClash.map((e) => e.code).join(", ") })}
              </Badge>
            ) : null}
            {prereq ? <Badge tone="neutral">{fill(c.pick.needs, { code: prereq })}</Badge> : null}
            {joint ? (
              <Badge tone="neutral">{fill(c.pick.taughtWith, { code: joint })}</Badge>
            ) : null}
          </p>
        ) : null}
        {hasPage ? (
          <a
            href={localeHref(locale, `/student-life/course-reviews/${entry.code}`)}
            className="mt-1 inline-block text-sm font-semibold text-brand-deep underline"
          >
            {fill(c.pick.coursePage, { code: entry.code })}
          </a>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={selected}
        aria-describedby={labelId}
        className={clsx(
          "inline-flex h-11 min-w-[5.5rem] shrink-0 items-center justify-center gap-1 self-start rounded-lg px-3 text-sm font-semibold",
          selected
            ? "border-[1.5px] border-brand bg-surface text-brand-deep hover:bg-sunken"
            : "focus-halo bg-ink text-surface hover:opacity-85"
        )}
      >
        {selected ? (
          <>
            <span aria-hidden="true">✓</span> {c.pick.added}
          </>
        ) : sameCodePicked ? (
          c.pick.section.replace("{section}", entry.section ?? "")
        ) : (
          <>
            <span aria-hidden="true">+</span> {c.pick.add}
          </>
        )}
      </button>
    </li>
  );
}

function Badge({ tone, children }: { tone: "warning" | "neutral"; children: React.ReactNode }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-md px-2 py-0.5 text-xs font-semibold",
        tone === "warning" ? "bg-warning-tint text-warning" : "bg-sunken text-muted"
      )}
    >
      {children}
    </span>
  );
}

const HOUR_REM = 3.25;

function WeekGrid({
  c,
  locale,
  picked,
  today,
  status,
}: {
  c: PlannerCopy;
  locale: Locale;
  picked: TimetableEntry[];
  today: string;
  status: ReturnType<typeof termStatus>;
}) {
  const range = weekRange(picked);
  const hours: number[] = [];
  for (let m = range.from; m <= range.to; m += 60) hours.push(m);
  const height = ((range.to - range.from) / 60) * HOUR_REM;
  const todayDay = status.week ? new Date(`${today}T00:00:00Z`).getUTCDay() : 0;

  return (
    <div className="hidden sm:block" aria-hidden="true">
      <div className="grid grid-cols-[2.75rem_repeat(5,minmax(0,1fr))] gap-x-1">
        <div />
        {[1, 2, 3, 4, 5].map((d) => (
          <div
            key={d}
            className={clsx(
              "pb-1 text-center text-sm font-semibold",
              d === todayDay ? "text-brand-deep" : "text-muted"
            )}
          >
            {c.shortDays[d]}
          </div>
        ))}
        <div className="relative" style={{ height: `${height}rem` }}>
          {hours.map((m) => (
            <span
              key={m}
              className="absolute right-1 -translate-y-1/2 text-xs text-muted"
              style={{ top: `${((m - range.from) / (range.to - range.from)) * 100}%` }}
            >
              {clock(locale, `${String(m / 60).padStart(2, "0")}:00`)}
            </span>
          ))}
        </div>
        {[1, 2, 3, 4, 5].map((d) => (
          <div
            key={d}
            className={clsx(
              "relative rounded-md border border-line",
              d === todayDay ? "bg-brand-tint/50" : "bg-sunken/60"
            )}
            style={{ height: `${height}rem` }}
          >
            {hours.slice(1, -1).map((m) => (
              <span
                key={m}
                className="absolute inset-x-0 border-t border-dashed border-line"
                style={{ top: `${((m - range.from) / (range.to - range.from)) * 100}%` }}
              />
            ))}
            {weekBlocks(picked, d).map(({ entry, lane, lanes, clash }) => {
              const top = ((toMinutes(entry.start) - range.from) / (range.to - range.from)) * 100;
              const h =
                ((toMinutes(entry.end) - toMinutes(entry.start)) / (range.to - range.from)) * 100;
              return (
                <div
                  key={entryId(entry)}
                  className={clsx(
                    "absolute overflow-hidden rounded-md border-[1.5px] px-1.5 py-1 text-xs leading-tight shadow-sm",
                    clash ? "border-warning bg-warning-tint" : "border-brand bg-surface"
                  )}
                  style={{
                    top: `${top}%`,
                    height: `${h}%`,
                    left: `calc(${(lane / lanes) * 100}% + 2px)`,
                    width: `calc(${100 / lanes}% - 4px)`,
                  }}
                >
                  <p className="font-mono font-bold">
                    {clash ? "⚠ " : ""}
                    {entry.code}
                  </p>
                  <p className="text-muted">
                    {clock(locale, entry.start)} {c.to} {clock(locale, entry.end)}
                  </p>
                  <p className="font-semibold">{formatRoom(entry.room, locale)}</p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function WeekList({
  c,
  locale,
  picked,
}: {
  c: PlannerCopy;
  locale: Locale;
  picked: TimetableEntry[];
}) {
  return (
    <ol className="flex flex-col gap-3 sm:sr-only">
      {[1, 2, 3, 4, 5].map((d) => {
        const blocks = weekBlocks(picked, d);
        if (blocks.length === 0) return null;
        return (
          <li key={d} className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-muted">{c.days[d]}</p>
            <ul className="flex flex-col gap-1.5">
              {blocks.map(({ entry, clash }) => (
                <li
                  key={entryId(entry)}
                  className={clsx(
                    "flex gap-3 rounded-md border-[1.5px] p-2.5",
                    clash ? "border-warning bg-warning-tint" : "border-brand bg-surface"
                  )}
                >
                  <span className="flex w-14 shrink-0 flex-col text-sm leading-tight tabular-nums">
                    <span className="font-semibold">{clock(locale, entry.start)}</span>
                    <span className="text-muted">{clock(locale, entry.end)}</span>
                  </span>
                  <span className="min-w-0 text-sm">
                    <span className="font-semibold">
                      {clash ? "⚠ " : ""}
                      {entry.code}
                    </span>{" "}
                    {entry.title}
                    <span className="block font-semibold">{formatRoom(entry.room, locale)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}

function ExamList({
  c,
  locale,
  picked,
  kind,
  today,
}: {
  c: PlannerCopy;
  locale: Locale;
  picked: TimetableEntry[];
  kind: "midterm" | "final";
  today: string;
}) {
  const rows = picked
    .map((entry) => {
      const slot = kind === "midterm" ? entry.midterm : entry.final;
      const room =
        kind === "final"
          ? (entry.final.room ??
            entry.final.groups
              ?.map((g) =>
                locale === "th"
                  ? `กลุ่ม ${g.group} ${formatRoom(g.room, locale)}`
                  : `group ${g.group} ${g.room}`
              )
              .join(", "))
          : undefined;
      return { entry, slot, room };
    })
    .sort(
      (a, b) =>
        a.slot.date.localeCompare(b.slot.date) || toMinutes(a.slot.start) - toMinutes(b.slot.start)
    );
  const hasSaturday = rows.some((r) => new Date(`${r.slot.date}T00:00:00Z`).getUTCDay() === 6);

  return (
    <div className="flex flex-col gap-2">
      <h4 className="font-semibold">{kind === "midterm" ? c.exams.midterms : c.exams.finals}</h4>
      <ol className="flex flex-col divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
        {rows.map(({ entry, slot, room }) => {
          const clash = rows.some((o) => o.entry.code !== entry.code && examsOverlap(o.slot, slot));
          const past = slot.date < today;
          const days = daysBetween(today, slot.date);
          return (
            <li
              key={entryId(entry)}
              className={clsx("flex gap-3 p-3", clash && "bg-warning-tint", past && "opacity-60")}
            >
              <span className="flex w-14 shrink-0 flex-col items-center rounded-md bg-sunken py-1 text-center leading-tight">
                <span className="text-xs text-muted">
                  {shortDate(locale, slot.date).split(" ")[0]}
                </span>
                <span className="text-lg font-bold">{Number(slot.date.slice(8))}</span>
                <span className="text-xs text-muted">
                  {shortDate(locale, slot.date).split(" ").slice(2).join(" ")}
                </span>
              </span>
              <span className="min-w-0 flex-1 text-sm">
                <span className="block font-semibold">
                  <span className="font-mono">{entry.code}</span> {entry.title}
                </span>
                <span className="block">
                  {span(c, locale, slot.start, slot.end)}
                  {room ? (
                    <>
                      , <span className="font-semibold">{formatRoom(room, locale)}</span>
                    </>
                  ) : kind === "final" ? (
                    `, ${c.exams.noRoom}`
                  ) : null}
                </span>
                {clash ? (
                  <span className="mt-1 inline-flex rounded-md bg-surface px-2 py-0.5 text-xs font-semibold text-warning">
                    ⚠ {c.exams.clash}
                  </span>
                ) : null}
              </span>
              <span className="shrink-0 text-right text-xs text-muted">
                {past ? c.exams.past : days === 0 ? c.nextUp.today : plural(c.status.inDays, days)}
              </span>
            </li>
          );
        })}
      </ol>
      {kind === "midterm" && hasSaturday ? (
        <p className="text-sm text-muted">{c.exams.saturday}</p>
      ) : null}
      {kind === "final" ? <p className="text-sm text-muted">{c.exams.holiday}</p> : null}
    </div>
  );
}
