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
  loading: string;
  routeLabel: (n: string) => string;
  noneTracked: string;
  unavailable: string;
  updated: (time: string) => string;
  caveat: string;
};

const labels: Record<Locale, Labels> = {
  en: {
    heading: "Live buses opposite campus",
    loading: "Loading live arrivals",
    routeLabel: (n) => `Bus ${n}`,
    noneTracked: "None tracked",
    unavailable: "Live arrivals unavailable",
    updated: (time) => `Updated ${time}`,
    caveat: "GPS estimates for the stop opposite campus, not the shuttle stop.",
  },
  th: {
    heading: "รถเมล์เข้าป้ายตรงข้ามมหาวิทยาลัย",
    loading: "กำลังโหลดเวลารถเข้า",
    routeLabel: (n) => `สาย ${n}`,
    noneTracked: "ไม่มีรถที่ติดตามได้",
    unavailable: "แสดงเวลารถเข้าไม่ได้",
    updated: (time) => `อัปเดต ${time}`,
    caveat: "เวลาประมาณจาก GPS ของป้ายฝั่งตรงข้าม ไม่ใช่จุดขึ้นรถเวียน",
  },
};

type FeedState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; routes: RouteLiveTimes[]; updatedAt: string };

function RouteRow({ route, t, locale }: { route: RouteLiveTimes; t: Labels; locale: Locale }) {
  const [next, ...rest] = route.arrivals;
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5" aria-live="polite">
      <span className="font-semibold text-ink">{t.routeLabel(route.number)}</span>
      {next ? (
        <span className="text-right text-sm">
          <span className="font-semibold text-ink">{formatWait(next.waitSeconds, locale)}</span>
          {rest.length > 0 ? (
            <span className="text-muted">
              {" · "}
              {rest.map((a) => formatWait(a.waitSeconds, locale)).join(" · ")}
            </span>
          ) : null}
        </span>
      ) : (
        <span className="text-right text-sm text-muted">{t.noneTracked}</span>
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
    <div className="rounded-lg border border-line bg-sunken px-4 py-3 text-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
        <h3 className="my-0 font-display text-base">{t.heading}</h3>
        {updatedLabel ? <span className="text-xs text-muted">{updatedLabel}</span> : null}
      </div>

      {!mounted || feed.status === "loading" ? (
        <p className="mt-1 mb-0 text-muted">{t.loading}</p>
      ) : feed.status === "error" ? (
        <p className="mt-1 mb-0 text-muted">{t.unavailable}</p>
      ) : (
        <div className="mt-1 divide-y divide-line">
          {feed.routes.map((route) => (
            <RouteRow key={route.number} route={route} t={t} locale={locale} />
          ))}
        </div>
      )}

      <p className="mt-2 mb-0 text-xs text-muted">{t.caveat}</p>
    </div>
  );
}
