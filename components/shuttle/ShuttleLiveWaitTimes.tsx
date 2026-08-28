"use client";

/**
 * Live public-bus arrival board for the "Opposite Tha Prachan" stop, shown
 * alongside `ShuttleServiceNotice` while the shuttle runs a modified service.
 * When the university reduces the Sanam Chai Line, it points students at public
 * bus routes 53, 43 and 15 from the stop across Phrachan Road; this board shows
 * how long until the next of each actually arrives.
 *
 * The numbers come from the OTP "Namtang" live GPS feed via the same-origin
 * proxy at `/api/shuttle-eta` (see `app/api/shuttle-eta/route.ts`); the parsing
 * lives in `lib/shuttle-live.ts`. Like `ShuttleTimer`, this renders a neutral
 * placeholder before mount so SSR and the first client paint agree, then polls
 * on the client only. It renders nothing when there is no active service
 * modification, so it appears and disappears together with the notice it
 * accompanies.
 */
import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { serviceModification } from "@/lib/shuttle";
import { formatWait, type RouteLiveTimes } from "@/lib/shuttle-live";

export type ShuttleLiveWaitTimesProps = {
  locale: Locale;
};

const POLL_INTERVAL_MS = 30_000;

type Labels = {
  heading: string;
  intro: string;
  loading: string;
  routeLabel: (n: string) => string;
  then: string;
  noneTracked: string;
  ac: string;
  unavailable: string;
  updated: (time: string) => string;
  caveat: string;
};

const labels: Record<Locale, Labels> = {
  en: {
    heading: "Live buses at Opposite Tha Prachan",
    intro:
      "Public bus routes 53, 43 and 15 stop across Phrachan Road from campus. These are live arrivals from the Namtang tracking feed.",
    loading: "Loading live arrivals",
    routeLabel: (n) => `Bus ${n}`,
    then: "then",
    noneTracked: "No bus being tracked right now",
    ac: "air-con",
    unavailable: "Live arrivals are unavailable right now. Try again in a moment.",
    updated: (time) => `Updated ${time}`,
    caveat:
      "Estimates come from the buses' GPS and can shift with traffic. Times are for the stop opposite campus, not the shuttle boarding point.",
  },
  th: {
    heading: "รถเมล์แบบเรียลไทม์ที่ป้ายตรงข้ามท่าพระจันทร์",
    intro:
      "รถเมล์สาย 53 43 และ 15 จอดที่ป้ายฝั่งตรงข้ามมหาวิทยาลัยบนถนนพระจันทร์ ข้อมูลด้านล่างเป็นเวลารถเข้าจริงจากระบบติดตามนำทาง",
    loading: "กำลังโหลดเวลารถเข้า",
    routeLabel: (n) => `สาย ${n}`,
    then: "คันถัดไป",
    noneTracked: "ขณะนี้ยังไม่มีรถที่ติดตามได้",
    ac: "ปรับอากาศ",
    unavailable: "ขณะนี้ไม่สามารถแสดงเวลารถเข้าได้ กรุณาลองใหม่อีกครั้ง",
    updated: (time) => `อัปเดตเมื่อ ${time}`,
    caveat:
      "เวลาที่แสดงคำนวณจาก GPS ของรถและอาจคลาดเคลื่อนตามสภาพจราจร เป็นเวลาของป้ายฝั่งตรงข้ามมหาวิทยาลัย ไม่ใช่จุดขึ้นรถเวียน",
  },
};

type FeedState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; routes: RouteLiveTimes[]; updatedAt: string };

function RouteCard({ route, t, locale }: { route: RouteLiveTimes; t: Labels; locale: Locale }) {
  const [next, ...rest] = route.arrivals;
  return (
    <div
      className="rounded-lg border border-line bg-surface p-4"
      style={{ borderLeftWidth: "4px", borderLeftColor: route.accent }}
      aria-live="polite"
    >
      <div className="mb-1 flex flex-wrap items-baseline gap-x-2">
        <h3 className="my-0 font-display text-lg">{t.routeLabel(route.number)}</h3>
        <span className="text-sm text-muted">{route.name[locale]}</span>
      </div>
      {next ? (
        <div>
          <p className="text-ink">
            <span className="text-xl font-semibold text-brand-deep">
              {formatWait(next.waitSeconds, locale)}
            </span>
            {next.airCondition ? <span className="ml-2 text-xs text-muted">{t.ac}</span> : null}
          </p>
          {rest.length > 0 ? (
            <p className="text-sm text-muted">
              {t.then} {rest.map((a) => formatWait(a.waitSeconds, locale)).join(", ")}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-muted">{t.noneTracked}</p>
      )}
    </div>
  );
}

export default function ShuttleLiveWaitTimes({ locale }: ShuttleLiveWaitTimesProps) {
  const [mounted, setMounted] = useState(false);
  const [feed, setFeed] = useState<FeedState>({ status: "loading" });
  const t = labels[locale];

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/shuttle-eta?locale=${locale}`, { cache: "no-store" });
      const body = (await res.json()) as {
        ok?: boolean;
        routes?: RouteLiveTimes[];
        updatedAt?: string;
      };
      if (!res.ok || !body.ok || !body.routes) {
        setFeed({ status: "error" });
        return;
      }
      setFeed({
        status: "ready",
        routes: body.routes,
        updatedAt: body.updatedAt ?? new Date().toISOString(),
      });
    } catch {
      setFeed({ status: "error" });
    }
  }, [locale]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    void load();
    const id = setInterval(() => void load(), POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [load]);

  // Only meaningful while the shuttle is running a modified service; disappears
  // with the notice it accompanies when service returns to normal.
  if (!serviceModification) return null;

  const updatedLabel =
    feed.status === "ready"
      ? t.updated(
          new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Bangkok",
          }).format(new Date(feed.updatedAt))
        )
      : null;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-line bg-sunken p-5">
      <div>
        <h3 className="my-0 font-display text-lg">{t.heading}</h3>
        <p className="mt-1 mb-0 text-sm text-muted">{t.intro}</p>
      </div>

      {!mounted || feed.status === "loading" ? (
        <p className="text-sm text-muted">{t.loading}</p>
      ) : feed.status === "error" ? (
        <p className="text-sm text-muted">{t.unavailable}</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {feed.routes.map((route) => (
              <RouteCard key={route.number} route={route} t={t} locale={locale} />
            ))}
          </div>
          {updatedLabel ? <p className="text-xs text-muted">{updatedLabel}</p> : null}
        </>
      )}

      <p className="text-xs text-muted">{t.caveat}</p>
    </div>
  );
}
