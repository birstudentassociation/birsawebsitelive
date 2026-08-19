"use client";

/**
 * Live "next estimated departure" board for both shuttle lines. Ticks every
 * second on the client only; before mount it renders a neutral placeholder
 * (line names + a "loading" label, no time-dependent content) so SSR and
 * the first client render match exactly (same pattern as `ThemeToggle`).
 *
 * Weekday/minute-of-day always comes from `getBangkokParts`, which reads the
 * Asia/Bangkok timezone explicitly, so the countdown is correct regardless
 * of the viewer's device timezone. Sub-minute seconds are derived from the
 * local `Date` object purely for a smooth visual countdown; seconds-within-a-
 * minute don't shift between timezones, so this is safe.
 */
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import {
  shuttleLines,
  getBangkokParts,
  getExtension,
  getSuspension,
  nextDeparture,
  type LineId,
  type NextDepartureResult,
} from "@/lib/shuttle";

export type ShuttleTimerProps = {
  locale: Locale;
};

const lineAccents: Record<LineId, string> = {
  "sanam-chai": "#C3002F",
  pinklao: "#FFD13F",
};

type Labels = {
  loading: string;
  nextDeparture: string;
  weekendTitle: string;
  weekendBody: string;
  offTitle: string;
  offBody: string;
  suspendedTitle: string;
  suspendedBody: (resumes: string) => string;
  upcomingSuspension: (dates: string, resumes: string) => string;
  extension: (lines: string, everyMinutes: number, lastDeparture: string) => string;
  minutes: (n: number) => string;
  seconds: (n: number) => string;
  caveat: string;
};

const labels: Record<Locale, Labels> = {
  en: {
    loading: "Loading live times",
    nextDeparture: "Next departure",
    weekendTitle: "Not in service",
    weekendBody: "Service runs Monday to Friday. There's no shuttle at weekends.",
    offTitle: "Not in service",
    offBody: "The next bus shows here about an hour before it departs.",
    suspendedTitle: "Service suspended today",
    suspendedBody: (resumes) => `The shuttle resumes on ${resumes}.`,
    upcomingSuspension: (dates, resumes) =>
      `Service is suspended ${dates}, and resumes on ${resumes}.`,
    extension: (lines, everyMinutes, lastDeparture) =>
      `Late buses tonight on the ${lines} only, every ${everyMinutes} minutes past its normal last bus, until ${lastDeparture}. The countdown above includes them.`,
    minutes: (n) => `in ${n} min`,
    seconds: (n) => `in ${n} sec`,
    caveat: "Times are scheduled departures. In heavy traffic, buses can run a few minutes late.",
  },
  th: {
    loading: "กำลังโหลดเวลา",
    nextDeparture: "รถคันต่อไป",
    weekendTitle: "งดให้บริการ",
    weekendBody: "ให้บริการวันจันทร์ถึงศุกร์เท่านั้น เสาร์อาทิตย์ไม่มีรถ",
    offTitle: "งดให้บริการ",
    offBody: "รถคันต่อไปจะแสดงที่นี่ประมาณหนึ่งชั่วโมงก่อนออก",
    suspendedTitle: "วันนี้งดให้บริการ",
    suspendedBody: (resumes) => `รถเวียนจะกลับมาให้บริการอีกครั้ง ${resumes}`,
    upcomingSuspension: (dates, resumes) =>
      `งดให้บริการวันที่ ${dates} และกลับมาให้บริการอีกครั้ง ${resumes}`,
    extension: (lines, everyMinutes, lastDeparture) =>
      `คืนนี้มีรถรอบดึกเฉพาะ ${lines} โดยออกทุก ${everyMinutes} นาที ต่อจากรอบสุดท้ายตามตารางปกติ จนถึง ${lastDeparture} เวลาที่นับถอยหลังด้านบนรวมรอบพิเศษนี้แล้ว`,
    minutes: (n) => `อีก ${n} นาที`,
    seconds: (n) => `อีก ${n} วินาที`,
    caveat: "เวลาที่แสดงเป็นเวลาตามตารางเดินรถ ช่วงรถติดหนักอาจล่าช้ากว่าที่แจ้งไว้บ้าง",
  },
};

function StatusBlock({
  result,
  secondsPastMinute,
  locale,
  t,
}: {
  result: NextDepartureResult;
  secondsPastMinute: number;
  locale: Locale;
  t: Labels;
}) {
  if (result.status === "suspended") {
    return (
      <div>
        <p className="font-semibold text-ink">{t.suspendedTitle}</p>
        <p className="text-sm text-muted">
          {t.suspendedBody(result.suspension.resumesLabel[locale])}
        </p>
      </div>
    );
  }

  if (result.status === "no-service-weekend") {
    return (
      <div>
        <p className="font-semibold text-ink">{t.weekendTitle}</p>
        <p className="text-sm text-muted">{t.weekendBody}</p>
      </div>
    );
  }

  if (result.status === "not-in-service") {
    return (
      <div>
        <p className="font-semibold text-ink">{t.offTitle}</p>
        <p className="text-sm text-muted">{t.offBody}</p>
      </div>
    );
  }

  const totalSeconds = Math.max(0, result.minutesUntil * 60 - secondsPastMinute);
  const countdown =
    totalSeconds < 60 ? t.seconds(totalSeconds) : t.minutes(Math.floor(totalSeconds / 60));

  return (
    <div>
      <p className="text-ink">
        {t.nextDeparture}:{" "}
        <span className="font-semibold">
          {result.hh}:{result.mm}
        </span>
      </p>
      <p aria-hidden="true" className="text-sm font-semibold text-brand-deep">
        {countdown}
      </p>
    </div>
  );
}

export default function ShuttleTimer({ locale }: ShuttleTimerProps) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date());
  const t = labels[locale];

  useEffect(() => {
    // A live clock cannot be rendered on the server without the first client
    // paint disagreeing with it. Gating on mount is what makes the countdown
    // hydration-safe; the interval below is the ongoing subscription.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col gap-4 rounded-lg border border-line bg-sunken p-5">
        <p className="text-sm text-muted">{t.loading}</p>
        <ul className="flex flex-col gap-2">
          {shuttleLines.map((line) => (
            <li key={line.id} className="font-semibold text-ink">
              {line.name[locale]}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const parts = getBangkokParts(now);
  const secondsPastMinute = now.getSeconds();
  // Only the heads-up case is shown here; an active suspension is already
  // spelled out on each line's card by `StatusBlock`.
  const upcoming = getSuspension(parts.date);
  const upcomingNote =
    upcoming?.phase === "upcoming"
      ? t.upcomingSuspension(
          upcoming.suspension.dates[locale],
          upcoming.suspension.resumesLabel[locale]
        )
      : undefined;

  // A late-night extension announced for today, e.g. the extra Pinklao buses
  // on 19 August 2026. `nextDeparture` already counts its departures in for
  // the lines it covers; this note is what tells the reader why one line's
  // board is still live in the late evening and the other's is not.
  const extension = upcoming?.phase === "active" ? undefined : getExtension(parts.date);
  const extensionNote = extension
    ? t.extension(
        shuttleLines
          .filter((line) => extension.lines.includes(line.id))
          .map((line) => line.name[locale])
          .join(locale === "en" ? " and " : " และ "),
        extension.everyMinutes,
        extension.lastDeparture
      )
    : undefined;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-line bg-sunken p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {shuttleLines.map((line) => {
          const result = nextDeparture(line.id, parts);
          return (
            <div
              key={line.id}
              className="rounded-lg border border-line bg-surface p-4"
              style={{ borderLeftWidth: "4px", borderLeftColor: lineAccents[line.id] }}
              aria-live="polite"
            >
              <h3 className="mt-0 font-display text-lg">{line.name[locale]}</h3>
              <StatusBlock
                result={result}
                secondsPastMinute={secondsPastMinute}
                locale={locale}
                t={t}
              />
            </div>
          );
        })}
      </div>
      {extensionNote ? <p className="text-sm font-semibold text-ink">{extensionNote}</p> : null}
      {upcomingNote ? <p className="text-sm font-semibold text-ink">{upcomingNote}</p> : null}
      <p className="text-xs text-muted">{t.caveat}</p>
    </div>
  );
}
