"use client";

/**
 * Announcement banner for a dated break in shuttle service, e.g. the Tha
 * Prachan suspension of 28 to 30 July 2026.
 *
 * The data lives in `serviceSuspensions` in `lib/shuttle.ts` and is read
 * through `getSuspension`, which returns nothing once the last suspended day
 * has passed. That is what makes this notice expire on its own: the page is
 * statically prerendered, so the check has to happen on the client, and it
 * re-runs every minute so a tab left open overnight moves on by itself. Before
 * mount nothing is rendered at all, which keeps SSR and the first client
 * render identical (same pattern as `ShuttleTimer`).
 */
import { useEffect, useState } from "react";
import Notice from "@/components/Notice";
import type { Locale } from "@/lib/i18n";
import { getBangkokParts, getSuspension } from "@/lib/shuttle";

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
  },
} as const;

export default function ShuttleServiceNotice({ locale }: ShuttleServiceNoticeProps) {
  const [date, setDate] = useState<string | undefined>(undefined);

  useEffect(() => {
    const read = () => setDate(getBangkokParts().date);
    read();
    const id = setInterval(read, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!date) return null;

  const state = getSuspension(date);
  if (!state) return null;

  const t = labels[locale];
  const { dates, resumesLabel } = state.suspension;
  const active = state.phase === "active";

  return (
    <Notice variant={active ? "error" : "warning"} title={active ? t.activeTitle : t.upcomingTitle}>
      <p className="mb-2">
        {active
          ? t.activeBody(dates[locale], resumesLabel[locale])
          : t.upcomingBody(dates[locale], resumesLabel[locale])}
      </p>
      <p>{t.alternatives}</p>
    </Notice>
  );
}
