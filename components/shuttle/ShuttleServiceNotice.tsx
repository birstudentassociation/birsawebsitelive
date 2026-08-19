"use client";

/**
 * Announcement banner for dated changes to shuttle service: a break in
 * service, e.g. the Tha Prachan suspension of 28 to 30 July 2026, and a
 * one-off late-night extension, e.g. the extra buses on 19 August 2026.
 *
 * The data lives in `serviceSuspensions` and `serviceExtensions` in
 * `lib/shuttle.ts` and is read through `getSuspension` and `getExtension`,
 * which return nothing once the announced dates have passed. That is what
 * makes these notices expire on their own: the page is statically
 * prerendered, so the check has to happen on the client, and it re-runs
 * every minute so a tab left open overnight moves on by itself. Before mount
 * nothing is rendered at all, which keeps SSR and the first client render
 * identical (same pattern as `ShuttleTimer`).
 */
import { useEffect, useState } from "react";
import Notice from "@/components/Notice";
import type { Locale } from "@/lib/i18n";
import {
  getBangkokParts,
  getExtension,
  getExtraDepartureTimes,
  getSuspension,
  shuttleLines,
  type ShuttleLine,
} from "@/lib/shuttle";

export type ShuttleServiceNoticeProps = {
  locale: Locale;
};

const labels = {
  en: {
    activeTitle: "Shuttle service is suspended",
    activeBody: (dates: string, resumes: string) =>
      `There is no TU Shuttle Bus at Tha Prachan from ${dates}. Service resumes on ${resumes}.`,
    upcomingTitle: "Shuttle service will be suspended",
    upcomingBody: (dates: string, resumes: string) =>
      `There will be no TU Shuttle Bus at Tha Prachan from ${dates}. Service resumes on ${resumes}.`,
    alternatives:
      "The timetable below applies on the days either side of this. During the suspension, use the Chao Phraya boat, the MRT at Sanam Chai, or a ride-hailing app.",
    extensionTitle: "Late buses tonight",
    extensionBody: (
      lines: string,
      dateLabel: string,
      everyMinutes: number,
      lastDeparture: string
    ) =>
      `Buses run later than usual on the ${lines} tonight, ${dateLabel}. They leave every ${everyMinutes} minutes after the line's normal last bus, up to a final departure at ${lastDeparture}.`,
    extensionUnaffected: (lines: string) => `The ${lines} keeps its normal timetable tonight.`,
    extensionExtras: "Extra departures from campus tonight",
    extensionCaveat:
      "The timetable below is the normal weekday one and does not include tonight's extra buses. The live board above already counts them in.",
  },
  th: {
    activeTitle: "รถเวียนงดให้บริการ",
    activeBody: (dates: string, resumes: string) =>
      `รถเวียนธรรมศาสตร์ ท่าพระจันทร์ งดให้บริการวันที่ ${dates} และกลับมาให้บริการอีกครั้ง ${resumes}`,
    upcomingTitle: "รถเวียนจะงดให้บริการ",
    upcomingBody: (dates: string, resumes: string) =>
      `รถเวียนธรรมศาสตร์ ท่าพระจันทร์ จะงดให้บริการวันที่ ${dates} และกลับมาให้บริการอีกครั้ง ${resumes}`,
    alternatives:
      "ตารางเวลาด้านล่างใช้กับวันก่อนและหลังช่วงนี้ ระหว่างที่งดให้บริการ เดินทางด้วยเรือเจ้าพระยา MRT สนามไชย หรือแอปเรียกรถแทนได้",
    extensionTitle: "คืนนี้มีรถเวียนรอบดึก",
    extensionBody: (
      lines: string,
      dateLabel: string,
      everyMinutes: number,
      lastDeparture: string
    ) =>
      `${dateLabel} ${lines} มีรถรอบดึกเพิ่ม โดยออกทุก ${everyMinutes} นาที ต่อจากรอบสุดท้ายตามตารางปกติของสายนั้น จนถึงรอบสุดท้ายเวลา ${lastDeparture}`,
    extensionUnaffected: (lines: string) => `${lines} ยังวิ่งตามตารางเวลาปกติในคืนนี้`,
    extensionExtras: "รอบพิเศษที่ออกจากมหาลัยคืนนี้",
    extensionCaveat:
      "ตารางเวลาด้านล่างเป็นตารางวันธรรมดาปกติ ยังไม่รวมรอบพิเศษของคืนนี้ ส่วนบอร์ดเวลาด้านบนรวมให้แล้ว",
  },
} as const;

/** Joins line names for prose, e.g. "Pinklao Line" or "Sanam Chai Line and Pinklao Line". */
function listNames(lines: ShuttleLine[], locale: Locale): string {
  const names = lines.map((line) => line.name[locale]);
  if (names.length < 2) return names.join("");
  return `${names.slice(0, -1).join(", ")} ${locale === "en" ? "and" : "และ"} ${names[names.length - 1]}`;
}

export default function ShuttleServiceNotice({ locale }: ShuttleServiceNoticeProps) {
  const [date, setDate] = useState<string | undefined>(undefined);

  useEffect(() => {
    const read = () => setDate(getBangkokParts().date);
    read();
    const id = setInterval(read, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!date) return null;

  const t = labels[locale];
  const state = getSuspension(date);
  const active = state?.phase === "active";
  // A suspension means there are no buses at all that day, so a late-night
  // extension announced for the same date would only confuse; the suspension
  // is the message that matters.
  const extension = active ? undefined : getExtension(date);
  const extendedLines = shuttleLines.filter((line) => extension?.lines.includes(line.id));
  const unaffectedLines = shuttleLines.filter((line) => !extension?.lines.includes(line.id));

  if (!state && !extension) return null;

  return (
    <div className="flex flex-col gap-4">
      {extension ? (
        <Notice variant="info" title={t.extensionTitle}>
          <p className="mb-2">
            {t.extensionBody(
              listNames(extendedLines, locale),
              extension.dateLabel[locale],
              extension.everyMinutes,
              extension.lastDeparture
            )}
          </p>
          {unaffectedLines.length ? (
            <p className="mb-2">{t.extensionUnaffected(listNames(unaffectedLines, locale))}</p>
          ) : null}
          <p className="mb-2">{t.extensionExtras}</p>
          <ul className="mb-2">
            {extendedLines.map((line) => (
              <li key={line.id}>
                {line.name[locale]} {getExtraDepartureTimes(line.id, date).join(", ")}
              </li>
            ))}
          </ul>
          <p>{t.extensionCaveat}</p>
        </Notice>
      ) : null}
      {state ? (
        <Notice
          variant={active ? "error" : "warning"}
          title={active ? t.activeTitle : t.upcomingTitle}
        >
          <p className="mb-2">
            {active
              ? t.activeBody(state.suspension.dates[locale], state.suspension.resumesLabel[locale])
              : t.upcomingBody(
                  state.suspension.dates[locale],
                  state.suspension.resumesLabel[locale]
                )}
          </p>
          <p>{t.alternatives}</p>
        </Notice>
      ) : null}
    </div>
  );
}
