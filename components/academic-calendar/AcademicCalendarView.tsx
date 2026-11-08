"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import clsx from "clsx";
import type {
  AcademicItem,
  AcademicItemKind,
  AcademicPeriod,
  AcademicTrack,
} from "@/content/calendar/academic-2569";
import {
  ACADEMIC_KINDS,
  barPosition,
  buildAcademicIcs,
  dayIndex,
  formatItemDate,
  formatLongDay,
  formatMonthSpan,
  itemStatus,
  monthName,
  periodSpan,
  periodsForTrack,
  timelineAxis,
  type ItemStatus,
} from "@/lib/academic-calendar";
import { todayInBangkok } from "@/lib/bangkok-today";
import type { Locale } from "@/lib/i18n";

const copy = {
  en: {
    today: "Today is",
    glance: "At a glance",
    onNow: "On now",
    comingUp: "Coming up",
    nothingNow: "Nothing is running today.",
    nothingNext: "No more dates this academic year.",
    nextExams: "Next exams",
    nextRegistration: "Next registration or payment",
    nextHoliday: "Next holiday",
    none: "None left",
    track: "Which dates do you follow?",
    tracks: { bir: "BIR programme", registrar: "Regular programme" },
    trackHint: "Semester 2 dates differ between BIR and the regular programme.",
    show: "Show",
    hidePast: "Hide dates that have passed",
    download: "Add these dates to my calendar",
    downloadHint:
      "Downloads an .ics file with the dates shown, for Google Calendar, Apple Calendar or Outlook.",
    calendarName: "Thammasat academic calendar 2569",
    jump: "Jump to",
    allPast: "All these dates have passed.",
    noneShown: "No dates match what you picked.",
    timeline: "Timeline",
    todayMarker: "Today",
    kinds: {
      exam: "Exams",
      registration: "Registration and fees",
      withdrawal: "Withdrawing with a W",
      deadline: "Other deadlines",
      holiday: "Holidays",
      term: "Term dates",
    },
    status: {
      past: "Passed",
      endsToday: "Ends today",
      left: (n: number) => (n === 1 ? "1 day left" : `${n} days left`),
      today: "Today",
      tomorrow: "Tomorrow",
      inDays: (n: number) => `In ${n} days`,
      inWeeks: (n: number) => `In ${n} weeks`,
    },
  },
  th: {
    today: "วันนี้คือ",
    glance: "สรุปภาพรวม",
    onNow: "กำลังเกิดขึ้นตอนนี้",
    comingUp: "กำลังจะมาถึง",
    nothingNow: "วันนี้ไม่มีกำหนดการ",
    nothingNext: "ไม่มีกำหนดการเหลือในปีการศึกษานี้แล้ว",
    nextExams: "การสอบครั้งถัดไป",
    nextRegistration: "ลงทะเบียนหรือชำระเงินครั้งถัดไป",
    nextHoliday: "วันหยุดถัดไป",
    none: "ไม่มีแล้ว",
    track: "นักศึกษายึดกำหนดการแบบไหน",
    tracks: { bir: "โครงการ BIR", registrar: "ภาคปกติ" },
    trackHint: "กำหนดการภาคการศึกษาที่ 2 ของ BIR ไม่ตรงกับภาคปกติ",
    show: "แสดง",
    hidePast: "ซ่อนวันที่ผ่านไปแล้ว",
    download: "เพิ่มวันเหล่านี้ลงในปฏิทินของฉัน",
    downloadHint:
      "ดาวน์โหลดไฟล์ .ics ของวันที่แสดงอยู่ ใช้กับ Google Calendar, Apple Calendar หรือ Outlook ได้",
    calendarName: "ปฏิทินการศึกษาธรรมศาสตร์ 2569",
    jump: "ไปที่",
    allPast: "วันที่ในหัวข้อนี้ผ่านไปหมดแล้ว",
    noneShown: "ไม่มีวันที่ตรงกับที่เลือก",
    timeline: "เส้นเวลา",
    todayMarker: "วันนี้",
    kinds: {
      exam: "การสอบ",
      registration: "ลงทะเบียนและชำระเงิน",
      withdrawal: "ถอนรายวิชาโดยบันทึก W",
      deadline: "กำหนดการอื่น ๆ",
      holiday: "วันหยุด",
      term: "วันเปิดและปิดภาค",
    },
    status: {
      past: "ผ่านแล้ว",
      endsToday: "วันสุดท้ายวันนี้",
      left: (n: number) => `เหลืออีก ${n} วัน`,
      today: "วันนี้",
      tomorrow: "พรุ่งนี้",
      inDays: (n: number) => `อีก ${n} วัน`,
      inWeeks: (n: number) => `อีก ${n} สัปดาห์`,
    },
  },
} as const;

type Copy = (typeof copy)[Locale];

const BAR: Record<AcademicItemKind, string> = {
  exam: "bg-brand",
  registration: "bg-forest",
  withdrawal: "bg-warning",
  deadline: "bg-ink",
  holiday:
    "bg-[repeating-linear-gradient(135deg,var(--color-success)_0_3px,transparent_3px_6px)] ring-1 ring-success",
  term: "bg-muted",
};

function statusLabel(c: Copy, status: ItemStatus): string {
  if (status.kind === "past") return c.status.past;
  if (status.kind === "now") {
    return status.daysLeft === 0 ? c.status.endsToday : c.status.left(status.daysLeft);
  }
  if (status.daysUntil === 0) return c.status.today;
  if (status.daysUntil === 1) return c.status.tomorrow;
  if (status.daysUntil > 42) return c.status.inWeeks(Math.round(status.daysUntil / 7));
  return c.status.inDays(status.daysUntil);
}

function StatusChip({ c, status }: { c: Copy; status: ItemStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap",
        status.kind === "now" && "bg-brand text-white",
        status.kind === "upcoming" && status.daysUntil <= 14 && "bg-warning-tint text-warning",
        status.kind === "upcoming" && status.daysUntil > 14 && "bg-sunken text-ink",
        status.kind === "past" && "text-muted"
      )}
    >
      {statusLabel(c, status)}
    </span>
  );
}

function Swatch({ kind, className }: { kind: AcademicItemKind; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={clsx("inline-block h-3 w-3 shrink-0 rounded-sm", BAR[kind], className)}
    />
  );
}

const subscribe = () => () => {};

type Entry = { item: AcademicItem; period: AcademicPeriod };

export default function AcademicCalendarView({
  locale,
  periods,
  todayKey: serverToday,
  siteUrl,
}: {
  locale: Locale;
  periods: AcademicPeriod[];
  todayKey: string;
  siteUrl: string;
}) {
  const c = copy[locale];
  const todayKey = useSyncExternalStore(
    subscribe,
    () => todayInBangkok(),
    () => serverToday
  );
  const [track, setTrack] = useState<AcademicTrack>("bir");
  const [kinds, setKinds] = useState<AcademicItemKind[]>(ACADEMIC_KINDS);
  const [hidePast, setHidePast] = useState(false);

  const visiblePeriods = useMemo(() => periodsForTrack(periods, track), [periods, track]);

  const all: Entry[] = useMemo(
    () =>
      visiblePeriods
        .flatMap((period) => period.items.map((item) => ({ item, period })))
        .sort((a, b) => a.item.start.localeCompare(b.item.start)),
    [visiblePeriods]
  );

  const onNow = all
    .filter((e) => itemStatus(e.item, todayKey).kind === "now")
    .sort((a, b) => (a.item.end ?? a.item.start).localeCompare(b.item.end ?? b.item.start));
  const upcoming = all.filter((e) => itemStatus(e.item, todayKey).kind === "upcoming");
  const nextOf = (pred: (i: AcademicItem) => boolean) =>
    all.find((e) => pred(e.item) && itemStatus(e.item, todayKey).kind !== "past");
  const tiles: { label: string; entry?: Entry }[] = [
    { label: c.nextExams, entry: nextOf((i) => i.kind === "exam" && Boolean(i.end)) },
    { label: c.nextRegistration, entry: nextOf((i) => i.kind === "registration") },
    { label: c.nextHoliday, entry: nextOf((i) => i.kind === "holiday") },
  ];

  const shown = (item: AcademicItem) =>
    kinds.includes(item.kind) && !(hidePast && itemStatus(item, todayKey).kind === "past");

  const toggleKind = (kind: AcademicItemKind) =>
    setKinds((prev) =>
      prev.includes(kind)
        ? prev.filter((k) => k !== kind)
        : ACADEMIC_KINDS.filter((k) => k === kind || prev.includes(k))
    );

  const download = () => {
    const entries = all.filter((e) => shown(e.item));
    const body = buildAcademicIcs(entries, locale, siteUrl, c.calendarName);
    const url = URL.createObjectURL(new Blob([body], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `thammasat-academic-calendar-2569-${track}-${locale}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="my-8 flex flex-col gap-8 lg:w-[min(64rem,calc(100vw-4rem))] [&_h3]:mt-0 [&_li]:mt-0">
      <section
        aria-labelledby="ac-glance"
        className="rounded-xl border border-line bg-surface p-5 sm:p-6"
      >
        <p className="text-sm text-muted">
          {c.today}{" "}
          <span className="font-semibold text-ink">{formatLongDay(locale, todayKey)}</span>
        </p>
        <h2 id="ac-glance" className="mt-1 font-display text-2xl">
          {c.glance}
        </h2>

        <ul role="list" className="mt-4 grid list-none gap-3 pl-0 sm:grid-cols-3">
          {tiles.map(({ label, entry }) => {
            const status = entry ? itemStatus(entry.item, todayKey) : null;
            return (
              <li key={label} className="flex flex-col gap-1 rounded-lg bg-sunken p-4">
                <span className="text-sm font-semibold text-muted">{label}</span>
                {entry && status ? (
                  <>
                    <span className="font-display text-2xl leading-tight">
                      {status.kind === "upcoming"
                        ? statusLabel(c, status)
                        : status.kind === "now"
                          ? c.onNow
                          : ""}
                    </span>
                    <span className="text-sm leading-snug">{entry.item.title[locale]}</span>
                    <span className="text-sm text-muted">
                      {formatItemDate(locale, entry.item, true)}
                    </span>
                  </>
                ) : (
                  <span className="font-display text-2xl">{c.none}</span>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="flex items-center gap-2 font-semibold">
              <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
              </span>
              {c.onNow}
            </h3>
            {onNow.length ? (
              <ul role="list" className="mt-2 flex list-none flex-col gap-2 pl-0">
                {onNow.map(({ item }) => (
                  <li key={item.id} className="flex items-start gap-2">
                    <Swatch kind={item.kind} className="mt-1.5" />
                    <span className="min-w-0 flex-1 leading-snug">
                      {item.title[locale]}
                      <span className="block text-sm text-muted">
                        {formatItemDate(locale, item)}
                      </span>
                    </span>
                    <StatusChip c={c} status={itemStatus(item, todayKey)} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-muted">{c.nothingNow}</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold">{c.comingUp}</h3>
            {upcoming.length ? (
              <ul role="list" className="mt-2 flex list-none flex-col gap-2 pl-0">
                {upcoming.slice(0, 5).map(({ item }) => (
                  <li key={item.id} className="flex items-start gap-2">
                    <Swatch kind={item.kind} className="mt-1.5" />
                    <span className="min-w-0 flex-1 leading-snug">
                      {item.title[locale]}
                      <span className="block text-sm text-muted">
                        {formatItemDate(locale, item)}
                      </span>
                    </span>
                    <StatusChip c={c} status={itemStatus(item, todayKey)} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-muted">{c.nothingNext}</p>
            )}
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-5 rounded-xl border border-line p-5 sm:p-6">
        <fieldset>
          <legend className="font-semibold">{c.track}</legend>
          <p className="text-sm text-muted">{c.trackHint}</p>
          <div className="mt-2 inline-flex flex-wrap rounded-full border-[1.5px] border-line-strong p-1">
            {(["bir", "registrar"] as const).map((value) => (
              <label
                key={value}
                className={clsx(
                  "cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand",
                  track === value ? "bg-ink text-surface" : "text-ink hover:bg-sunken"
                )}
              >
                <input
                  type="radio"
                  name="ac-track"
                  value={value}
                  checked={track === value}
                  onChange={() => setTrack(value)}
                  className="sr-only"
                />
                {c.tracks[value]}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-semibold">{c.show}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {ACADEMIC_KINDS.map((kind) => {
              const on = kinds.includes(kind);
              return (
                <button
                  key={kind}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleKind(kind)}
                  className={clsx(
                    "inline-flex h-9 items-center gap-2 rounded-full border-[1.5px] px-3 text-sm font-semibold",
                    on
                      ? "border-ink bg-surface text-ink"
                      : "border-line text-muted line-through decoration-1 hover:bg-sunken"
                  )}
                >
                  <Swatch kind={kind} className={on ? undefined : "opacity-40"} />
                  {c.kinds[kind]}
                </button>
              );
            })}
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={hidePast}
              onChange={(e) => setHidePast(e.target.checked)}
              className="h-5 w-5 accent-[var(--color-brand)]"
            />
            <span className="font-semibold">{c.hidePast}</span>
          </label>
        </fieldset>

        <div>
          <button
            type="button"
            onClick={download}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
              <path d="M6 2a1 1 0 0 1 1 1v1h6V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1Zm10 7H4v7h12V9Z" />
            </svg>
            {c.download}
          </button>
          <p className="mt-1 text-sm text-muted">{c.downloadHint}</p>
        </div>

        <nav aria-label={c.jump}>
          <p className="text-sm font-semibold text-muted">{c.jump}</p>
          <ul role="list" className="mt-1 flex list-none flex-wrap gap-x-4 gap-y-1 pl-0">
            {visiblePeriods.map((period) => {
              const span = periodSpan(period);
              const current =
                dayIndex(span.start) <= dayIndex(todayKey) &&
                dayIndex(todayKey) <= dayIndex(span.end);
              return (
                <li key={period.id}>
                  <a
                    href={`#ac-${period.id}`}
                    aria-current={current ? "true" : undefined}
                    className="font-semibold text-brand-deep underline-offset-2 hover:underline aria-[current]:underline"
                  >
                    {period.title[locale]}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {visiblePeriods.map((period) => (
        <PeriodSection
          key={period.id}
          c={c}
          locale={locale}
          period={period}
          todayKey={todayKey}
          shown={shown}
          hidePast={hidePast}
        />
      ))}
    </div>
  );
}

function PeriodSection({
  c,
  locale,
  period,
  todayKey,
  shown,
  hidePast,
}: {
  c: Copy;
  locale: Locale;
  period: AcademicPeriod;
  todayKey: string;
  shown: (item: AcademicItem) => boolean;
  hidePast: boolean;
}) {
  const span = periodSpan(period);
  const axis = timelineAxis(period);
  const items = [...period.items].sort((a, b) => a.start.localeCompare(b.start)).filter(shown);
  const todayOffset = dayIndex(todayKey) - axis.start;
  const todayPct =
    todayOffset >= 0 && todayOffset < axis.length ? (todayOffset / axis.length) * 100 : null;
  const allPast = hidePast && period.items.every((i) => itemStatus(i, todayKey).kind === "past");

  return (
    <section id={`ac-${period.id}`} aria-labelledby={`ac-${period.id}-h`} className="scroll-mt-24">
      <h2 id={`ac-${period.id}-h`} className="font-display text-2xl">
        {period.title[locale]}
        <span className="block text-base font-normal text-muted">
          {formatMonthSpan(locale, span.start, span.end)}
        </span>
      </h2>
      {period.intro ? <p className="mt-2 max-w-[var(--measure)]">{period.intro[locale]}</p> : null}

      {items.length === 0 ? (
        <p className="mt-4 text-muted">{allPast ? c.allPast : c.noneShown}</p>
      ) : (
        <div className="mt-4 rounded-xl border border-line bg-surface">
          <div
            aria-hidden="true"
            className="grid grid-cols-1 border-b border-line px-4 pt-3 pb-2 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-4"
          >
            <span className="hidden text-xs font-semibold text-muted sm:block">{c.timeline}</span>
            <div className="relative h-5 text-xs text-muted">
              {axis.months.map((m) => (
                <span
                  key={m.key}
                  className="absolute top-0 border-l border-line pl-1 leading-5 whitespace-nowrap"
                  style={{ left: `${(m.offset / axis.length) * 100}%` }}
                >
                  {monthName(locale, m.month, true)}
                </span>
              ))}
            </div>
          </div>
          <ol role="list" className="list-none pl-0">
            {items.map((item) => {
              const status = itemStatus(item, todayKey);
              const bar = barPosition(axis, item);
              return (
                <li
                  key={item.id}
                  className={clsx(
                    "grid grid-cols-1 gap-x-4 gap-y-2 border-b border-line px-4 py-3 last:border-b-0 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]",
                    status.kind === "now" && "bg-brand-tint",
                    status.kind === "past" && "text-muted"
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Swatch kind={item.kind} />
                    <time
                      dateTime={item.start}
                      className={clsx("font-semibold", status.kind !== "past" && "text-ink")}
                    >
                      {formatItemDate(locale, item)}
                    </time>
                    <StatusChip c={c} status={status} />
                  </div>
                  <div className="min-w-0">
                    <p className="leading-snug">
                      {item.title[locale]}
                      <span className="sr-only"> ({c.kinds[item.kind]})</span>
                    </p>
                    <div aria-hidden="true" className="relative mt-2 h-2 rounded-full bg-sunken">
                      {axis.months.slice(1).map((m) => (
                        <span
                          key={m.key}
                          className="absolute top-0 h-full w-px bg-line"
                          style={{ left: `${(m.offset / axis.length) * 100}%` }}
                        />
                      ))}
                      <span
                        className={clsx(
                          "absolute top-0 h-full min-w-2 rounded-full",
                          BAR[item.kind],
                          status.kind === "past" && "opacity-40"
                        )}
                        style={{ left: `${bar.left}%`, width: `${bar.width}%` }}
                      />
                      {todayPct !== null ? (
                        <span
                          className="absolute -top-1 -bottom-1 w-0.5 rounded bg-brand-deep"
                          style={{ left: `${todayPct}%` }}
                        />
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          {todayPct !== null ? (
            <p className="flex items-center gap-2 border-t border-line px-4 py-2 text-xs text-muted">
              <span aria-hidden="true" className="inline-block h-3 w-0.5 rounded bg-brand-deep" />
              {c.todayMarker}
            </p>
          ) : null}
        </div>
      )}

      {period.notes?.length ? (
        <div className="mt-3 flex max-w-[var(--measure)] flex-col gap-2">
          {period.notes.map((note) => (
            <p key={note.en} className="border-l-4 border-line-strong pl-3 text-sm leading-relaxed">
              {note[locale]}
            </p>
          ))}
        </div>
      ) : null}
    </section>
  );
}
