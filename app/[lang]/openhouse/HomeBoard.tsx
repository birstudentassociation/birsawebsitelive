"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { COPY, t } from "@/content/openhouse/copy";
import {
  getBangkokParts,
  nextDeparture,
  shuttleLines,
  type NextDepartureResult,
} from "@/lib/shuttle";

type Row = {
  id: string;
  name: { en: string; th: string };
  dest: { en: string; th: string };
  result: NextDepartureResult;
};

/**
 * A typeset departures board from the real shuttle timetable. It is explicitly
 * a schedule, never live tracking: the note says so, and the weekend and
 * after-hours states are honest rather than a fabricated next time. Times are
 * computed on the client only (after mount) so the board reflects the visitor's
 * own clock without a hydration mismatch.
 */
export default function HomeBoard({ locale }: { locale: Locale }) {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    const compute = () => {
      const parts = getBangkokParts();
      setRows(
        shuttleLines.map((line) => ({
          id: line.id,
          name: line.name,
          dest: line.stops.find((s) => !s.isCampus) ?? line.stops[line.stops.length - 1]!,
          result: nextDeparture(line.id, parts),
        }))
      );
    };
    compute();
    const timer = window.setInterval(compute, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="oh-board" aria-live="polite">
      {shuttleLines.map((line) => {
        const row = rows?.find((r) => r.id === line.id) ?? null;
        const dest = line.stops.find((s) => !s.isCampus) ?? line.stops[line.stops.length - 1]!;
        return (
          <div key={line.id} className="oh-board-row">
            <div className="oh-board-route">
              <span className="oh-board-from">
                {locale === "th" ? "ท่าพระจันทร์" : "Tha Prachan"}
              </span>
              <span className="oh-board-arrow" aria-hidden="true">
                →
              </span>
              <span className="oh-board-to">{t(dest, locale)}</span>
            </div>
            <div className="oh-board-status">{renderStatus(locale, row?.result)}</div>
          </div>
        );
      })}
      <p className="oh-board-note">{t(COPY.homeNote, locale)}</p>
    </div>
  );
}

function renderStatus(locale: Locale, result: NextDepartureResult | undefined) {
  if (!result) {
    return <span className="oh-board-time oh-time">—</span>;
  }
  if (result.status === "no-service-weekend") {
    return <span className="oh-board-state">{t(COPY.homeWeekend, locale)}</span>;
  }
  if (result.status === "not-in-service") {
    return <span className="oh-board-state">{t(COPY.homeClosed, locale)}</span>;
  }
  return (
    <span className="oh-board-upcoming">
      <span className="oh-board-label">{t(COPY.homeNext, locale)}</span>
      <span className="oh-board-time oh-time">
        {result.hh}:{result.mm}
      </span>
      <span className="oh-board-in">
        {result.minutesUntil} {t(COPY.homeMinutes, locale)}
      </span>
    </span>
  );
}
