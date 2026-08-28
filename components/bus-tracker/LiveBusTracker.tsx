"use client";

/**
 * The live public-bus board for the "Live public bus tracker" guide. It renders
 * the three tracked stops (2373, 1573, 1061) with the full baked route list for
 * each — every line, its next three stops, and its terminus — and overlays live
 * GPS arrival times fetched from the same-origin `/api/bus-eta` proxy.
 *
 * The static structure (`lib/bus-tracker/data.ts`) renders on the server and in
 * the first client paint identically, so the route information is present with
 * no JS and indexable. Only the live-time column and the "updated" clock depend
 * on the fetch, so those are gated on `mounted` to keep SSR and hydration in
 * agreement, exactly like `ShuttleLiveWaitTimes`. Within each stop the lines are
 * re-sorted so the soonest actual arrival rises to the top, turning the baked
 * list into a live departure board.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { busTrackerData } from "@/lib/bus-tracker/data";
import type { BusLine, BusStopData } from "@/lib/bus-tracker/types";
import {
  compactFare,
  formatWait,
  headwayMinutes,
  type BusEtaResponse,
  type LiveArrival,
  type StopLiveArrivals,
} from "@/lib/bus-tracker/live";

export type LiveBusTrackerProps = { locale: Locale };

const POLL_INTERVAL_MS = 30_000;
/** Live arrivals shown per line: the soonest, plus this many following. */
const MAX_ARRIVALS_SHOWN = 3;

type Labels = {
  live: string;
  updated: (time: string) => string;
  loading: string;
  unavailable: string;
  notTracked: string;
  towards: string;
  every: (min: number) => string;
  ac: string;
  acFull: string;
  wheelchair: string;
  linesAt: (n: number) => string;
  caveat: string;
  busAria: (route: string) => string;
};

const labels: Record<Locale, Labels> = {
  en: {
    live: "Live",
    updated: (time) => `updated ${time}`,
    loading: "Loading",
    unavailable: "Live times unavailable",
    notTracked: "Not tracked",
    towards: "towards",
    every: (min) => `every ${min} min`,
    ac: "AC",
    acFull: "Air-conditioned",
    wheelchair: "Step-free",
    linesAt: (n) => `${n} ${n === 1 ? "line" : "lines"}`,
    caveat:
      "Live times are GPS estimates from Namtang (OTP). A line with no live bus is still listed with its route; scheduled buses may run untracked.",
    busAria: (route) => `Bus ${route}`,
  },
  th: {
    live: "เรียลไทม์",
    updated: (time) => `อัปเดต ${time}`,
    loading: "กำลังโหลด",
    unavailable: "แสดงเวลารถเข้าไม่ได้",
    notTracked: "ไม่มีรถที่ติดตามได้",
    towards: "ไป",
    every: (min) => `ทุก ${min} นาที`,
    ac: "แอร์",
    acFull: "รถปรับอากาศ",
    wheelchair: "ขึ้นได้ด้วยรถเข็น",
    linesAt: (n) => `${n} สาย`,
    caveat:
      "เวลารถเข้าเป็นค่าประมาณจาก GPS ของนำทาง (ขบ.) สายที่ไม่มีรถติดตามจะยังแสดงเส้นทางไว้ และอาจมีรถวิ่งตามตารางโดยไม่ถูกติดตาม",
    busAria: (route) => `สาย ${route}`,
  },
};

type FeedState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; stops: BusEtaResponse["stops"]; updatedAt: string };

/**
 * Picks near-black or near-white text for a route chip from its brand hex, by
 * relative luminance, so a pale route colour (yellow, orange) stays legible.
 */
function chipTextColor(hex: string): string {
  const h = hex.replace(/^#/, "");
  if (h.length !== 6) return "#ffffff";
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? "#141414" : "#ffffff";
}

function soonestSeconds(line: BusLine, live: StopLiveArrivals | undefined): number {
  const arrivals = live?.[line.patternKey];
  return arrivals && arrivals.length > 0 ? arrivals[0]!.waitSeconds : Number.POSITIVE_INFINITY;
}

/** The route chip: route number on its real brand colour. */
function RouteChip({ line, aria }: { line: BusLine; aria: string }) {
  const bg = `#${line.color.toLowerCase()}`;
  return (
    <span
      className="inline-flex min-w-[3.25rem] items-center justify-center rounded-md px-2 py-1 font-mono text-sm font-semibold tabular-nums"
      style={{ backgroundColor: bg, color: chipTextColor(line.color) }}
      aria-label={aria}
    >
      {line.routeName}
    </span>
  );
}

/** The next-stops-and-terminus path: downstream stops, then the terminus. */
function RoutePath({ line, locale, towards }: { line: BusLine; locale: Locale; towards: string }) {
  return (
    <p className="mt-0.5 mb-0 text-xs leading-snug text-muted">
      {line.downstream.map((stop, i) => (
        <span key={i}>
          {i > 0 ? <span className="text-line"> › </span> : null}
          {stop[locale]}
        </span>
      ))}
      <span className="text-muted">
        {line.downstream.length > 0 ? " " : ""}
        {towards}{" "}
      </span>
      <span className="font-semibold text-ink">{line.terminus[locale]}</span>
    </p>
  );
}

/** Compact per-line meta: accessibility badges, headway, fare, operator. */
function RouteMeta({ line, locale, t }: { line: BusLine; locale: Locale; t: Labels }) {
  const minutes = headwayMinutes(line.headway[locale]);
  const fare = line.fare[locale] ? compactFare(line.fare[locale]) : "";
  const bits = [minutes !== null ? t.every(minutes) : "", fare, line.operator[locale]].filter(
    Boolean
  );

  if (bits.length === 0 && !line.airConditioned && !line.wheelchairAccessible) return null;

  return (
    <p className="mt-1 mb-0 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted">
      {line.airConditioned ? (
        <span className="rounded border border-line px-1 font-medium text-ink" title={t.acFull}>
          {t.ac}
        </span>
      ) : null}
      {line.wheelchairAccessible ? (
        <span
          className="rounded border border-line px-1"
          title={t.wheelchair}
          aria-label={t.wheelchair}
        >
          ♿
        </span>
      ) : null}
      {bits.map((bit, i) => (
        <span key={i}>
          {i > 0 ? <span aria-hidden="true">· </span> : null}
          {bit}
        </span>
      ))}
    </p>
  );
}

/** The live-arrival column for one line. */
function EtaColumn({
  arrivals,
  mounted,
  status,
  locale,
  t,
}: {
  arrivals: LiveArrival[] | undefined;
  mounted: boolean;
  status: FeedState["status"];
  locale: Locale;
  t: Labels;
}) {
  if (!mounted || status === "loading") {
    return <span className="text-sm text-muted tabular-nums">·&#8202;·&#8202;·</span>;
  }
  if (status === "error") {
    return <span className="text-sm text-muted">—</span>;
  }
  if (!arrivals || arrivals.length === 0) {
    return <span className="text-sm text-muted">{t.notTracked}</span>;
  }
  const [next, ...rest] = arrivals.slice(0, MAX_ARRIVALS_SHOWN);
  return (
    <span className="text-sm tabular-nums" aria-live="polite">
      <span className="font-semibold text-ink">{formatWait(next!.waitSeconds, locale)}</span>
      {rest.length > 0 ? (
        <span className="text-muted">
          {" · "}
          {rest.map((a) => formatWait(a.waitSeconds, locale)).join(" · ")}
        </span>
      ) : null}
    </span>
  );
}

/** A "Live" badge: a green dot with a pulsing ring (dropped for reduced motion). */
function LiveBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-success uppercase">
      <span className="relative inline-flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75 motion-reduce:hidden" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
      </span>
      {label}
    </span>
  );
}

function StopSection({
  stop,
  live,
  mounted,
  status,
  updatedLabel,
  locale,
  t,
}: {
  stop: BusStopData;
  live: StopLiveArrivals | undefined;
  mounted: boolean;
  status: FeedState["status"];
  updatedLabel: string | null;
  locale: Locale;
  t: Labels;
}) {
  // Soonest live arrival first; ties and untracked lines keep the baked order.
  const orderedLines = useMemo(() => {
    return [...stop.lines].sort((a, b) => soonestSeconds(a, live) - soonestSeconds(b, live));
  }, [stop.lines, live]);

  const showLive = mounted && status === "ready";

  return (
    <section className="rounded-lg border border-line bg-surface">
      <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-line px-4 py-3">
        <div className="min-w-0">
          <h3 className="my-0 font-display text-lg text-ink">{stop.name[locale]}</h3>
          {stop.detail ? (
            <p className="mt-0.5 mb-0 text-xs text-muted">{stop.detail[locale]}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs text-muted">{t.linesAt(stop.lines.length)}</span>
          {showLive ? <LiveBadge label={t.live} /> : null}
          {showLive && updatedLabel ? (
            <span className="text-xs text-muted">{updatedLabel}</span>
          ) : null}
        </div>
      </header>

      <ul className="divide-y divide-line">
        {orderedLines.map((line) => (
          <li key={line.patternKey} className="flex items-start gap-3 px-4 py-2.5">
            <div className="shrink-0 pt-0.5">
              <RouteChip line={line} aria={t.busAria(line.routeName)} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="my-0 truncate font-semibold text-ink">{line.headsign[locale]}</p>
              <RoutePath line={line} locale={locale} towards={t.towards} />
              <RouteMeta line={line} locale={locale} t={t} />
            </div>
            <div className="shrink-0 pt-0.5 text-right">
              <EtaColumn
                arrivals={live?.[line.patternKey]}
                mounted={mounted}
                status={status}
                locale={locale}
                t={t}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function LiveBusTracker({ locale }: LiveBusTrackerProps) {
  const [mounted, setMounted] = useState(false);
  const [feed, setFeed] = useState<FeedState>({ status: "loading" });
  const t = labels[locale];

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/bus-eta?locale=${locale}`, { cache: "no-store" });
      const body = (await res.json()) as Partial<BusEtaResponse> & { ok?: boolean };
      if (!res.ok || !body.ok || !body.stops) {
        setFeed({ status: "error" });
        return;
      }
      setFeed({
        status: "ready",
        stops: body.stops,
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
    <div className="flex flex-col gap-4">
      {mounted && feed.status === "error" ? (
        <p className="rounded-lg border border-line bg-sunken px-4 py-2 text-sm text-muted">
          {t.unavailable}
        </p>
      ) : null}

      {busTrackerData.map((stop) => (
        <StopSection
          key={stop.stopId}
          stop={stop}
          live={feed.status === "ready" ? feed.stops[String(stop.stopId)] : undefined}
          mounted={mounted}
          status={feed.status}
          updatedLabel={updatedLabel}
          locale={locale}
          t={t}
        />
      ))}

      <p className="mt-1 mb-0 text-xs text-muted">{t.caveat}</p>
    </div>
  );
}
