"use client";

/**
 * The live public-bus board for the "Live public bus tracker" guide. It renders
 * the three tracked stops (2373, 1573, 1061) with the full baked route list for
 * each — every line, the stops it reaches at five-stop increments, and its
 * terminus — and overlays live GPS arrival times fetched from the same-origin
 * `/api/bus-eta` proxy.
 *
 * Each stop is a collapsible card. Within a stop, once live data has loaded, the
 * lines with a bus on the way show first (soonest at the top) and the lines with
 * no tracked bus fold away into a single disclosure at the bottom, so the board
 * stays scannable. Before the fetch resolves — and so on the server and in the
 * first client paint — every line renders in its baked order with a neutral
 * time placeholder, which keeps the full route information present with no JS
 * and keeps SSR and hydration in agreement (like `ShuttleLiveWaitTimes`).
 *
 * The per-line layout stacks: the route-number chip and the live time sit on one
 * row, and the destination, route path and details sit underneath, which reads
 * cleanly on a phone as well as on a wide screen.
 */
import { useCallback, useEffect, useState } from "react";
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
  unavailable: string;
  notTracked: string;
  noneLive: string;
  untracked: (n: number) => string;
  towards: string;
  every: (min: number) => string;
  ac: string;
  acFull: string;
  wheelchair: string;
  lines: (n: number) => string;
  caveat: string;
  busAria: (route: string) => string;
};

const labels: Record<Locale, Labels> = {
  en: {
    live: "Live",
    updated: (time) => `updated ${time}`,
    unavailable: "Live times unavailable",
    notTracked: "Not tracked",
    noneLive: "No bus is being tracked at this stop right now.",
    untracked: (n) => `${n} more ${n === 1 ? "line" : "lines"}, no bus tracked`,
    towards: "towards",
    every: (min) => `every ${min} min`,
    ac: "AC",
    acFull: "Air-conditioned",
    wheelchair: "Step-free",
    lines: (n) => `${n} ${n === 1 ? "line" : "lines"}`,
    caveat:
      "Live times are GPS estimates from Namtang (OTP). A line with no live bus is still listed with its route; scheduled buses may run untracked.",
    busAria: (route) => `Bus ${route}`,
  },
  th: {
    live: "เรียลไทม์",
    updated: (time) => `อัปเดต ${time}`,
    unavailable: "แสดงเวลารถเข้าไม่ได้",
    notTracked: "ไม่มีรถที่ติดตามได้",
    noneLive: "ขณะนี้ยังไม่มีรถที่ติดตามได้ที่ป้ายนี้",
    untracked: (n) => `อีก ${n} สาย ยังไม่มีรถติดตาม`,
    towards: "ไป",
    every: (min) => `ทุก ${min} นาที`,
    ac: "แอร์",
    acFull: "รถปรับอากาศ",
    wheelchair: "ขึ้นได้ด้วยรถเข็น",
    lines: (n) => `${n} สาย`,
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

function hasLiveBus(line: BusLine, live: StopLiveArrivals | undefined): boolean {
  return (live?.[line.patternKey]?.length ?? 0) > 0;
}

/** A disclosure chevron that points right when closed, down when open. */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? "rotate-90" : ""}`}
    >
      <path d="M7 5l6 5-6 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The route chip: route number on its real brand colour. */
function RouteChip({ line, aria }: { line: BusLine; aria: string }) {
  return (
    <span
      className="inline-flex min-w-[3.25rem] items-center justify-center rounded-md px-2 py-1 font-mono text-sm font-semibold tabular-nums"
      style={{ backgroundColor: `#${line.color.toLowerCase()}`, color: chipTextColor(line.color) }}
      aria-label={aria}
    >
      {line.routeName}
    </span>
  );
}

/** The route path: waypoints at five-stop increments, then the terminus. */
function RoutePath({ line, locale, towards }: { line: BusLine; locale: Locale; towards: string }) {
  return (
    <p className="mt-0.5 mb-0 text-xs leading-snug text-muted">
      {line.downstream.map((stop, i) => (
        <span key={i}>
          {i > 0 ? <span className="text-line"> › </span> : null}
          {stop[locale]}
        </span>
      ))}
      <span>
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

/** The live-arrival time for one line, shown beside its chip. */
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

/**
 * One line, stacked: the route chip and the live time on the top row, the
 * destination, route path and details underneath. `showEta` is off inside the
 * folded "no bus tracked" group, where the group heading already says as much.
 */
function LineRow({
  line,
  arrivals,
  mounted,
  status,
  locale,
  t,
  showEta = true,
}: {
  line: BusLine;
  arrivals: LiveArrival[] | undefined;
  mounted: boolean;
  status: FeedState["status"];
  locale: Locale;
  t: Labels;
  showEta?: boolean;
}) {
  return (
    <li className="px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <RouteChip line={line} aria={t.busAria(line.routeName)} />
        {showEta ? (
          <div className="text-right">
            <EtaColumn
              arrivals={arrivals}
              mounted={mounted}
              status={status}
              locale={locale}
              t={t}
            />
          </div>
        ) : null}
      </div>
      <div className="mt-1.5">
        <p className="my-0 font-semibold text-ink">{line.headsign[locale]}</p>
        <RoutePath line={line} locale={locale} towards={t.towards} />
        <RouteMeta line={line} locale={locale} t={t} />
      </div>
    </li>
  );
}

function LineList({
  lines,
  live,
  mounted,
  status,
  locale,
  t,
  showEta,
}: {
  lines: BusLine[];
  live: StopLiveArrivals | undefined;
  mounted: boolean;
  status: FeedState["status"];
  locale: Locale;
  t: Labels;
  showEta?: boolean;
}) {
  return (
    <ul className="divide-y divide-line">
      {lines.map((line) => (
        <LineRow
          key={line.patternKey}
          line={line}
          arrivals={live?.[line.patternKey]}
          mounted={mounted}
          status={status}
          locale={locale}
          t={t}
          showEta={showEta}
        />
      ))}
    </ul>
  );
}

/** The folded group holding every line with no live bus at this stop. */
function UntrackedGroup({ lines, locale, t }: { lines: BusLine[]; locale: Locale; t: Labels }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-line bg-sunken">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-semibold tracking-wide text-muted uppercase hover:text-ink"
      >
        <Chevron open={open} />
        <span className="flex-1">{t.untracked(lines.length)}</span>
      </button>
      {open ? (
        <LineList
          lines={lines}
          live={undefined}
          mounted={true}
          status="ready"
          locale={locale}
          t={t}
          showEta={false}
        />
      ) : null}
    </div>
  );
}

/** One collapsible stop card. */
function StopCard({
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
  const [open, setOpen] = useState(true);
  const ready = mounted && status === "ready";

  let body: React.ReactNode;
  if (!ready) {
    // Server, first paint, loading, or error: show the whole route list.
    body = (
      <LineList
        lines={stop.lines}
        live={live}
        mounted={mounted}
        status={status}
        locale={locale}
        t={t}
      />
    );
  } else {
    const tracked = stop.lines
      .filter((line) => hasLiveBus(line, live))
      .sort((a, b) => soonestSeconds(a, live) - soonestSeconds(b, live));
    const untracked = stop.lines.filter((line) => !hasLiveBus(line, live));
    body = (
      <>
        {tracked.length > 0 ? (
          <LineList
            lines={tracked}
            live={live}
            mounted={mounted}
            status={status}
            locale={locale}
            t={t}
          />
        ) : (
          <p className="px-4 py-3 text-sm text-muted">{t.noneLive}</p>
        )}
        {untracked.length > 0 ? <UntrackedGroup lines={untracked} locale={locale} t={t} /> : null}
      </>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-surface">
      <h3 className="my-0">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-sunken"
        >
          <Chevron open={open} />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="font-display text-lg leading-tight text-ink">{stop.name[locale]}</span>
            {stop.detail ? (
              <span className="mt-0.5 text-xs font-normal text-muted">{stop.detail[locale]}</span>
            ) : null}
          </span>
          <span className="flex shrink-0 items-center gap-2">
            <span className="text-xs font-normal text-muted">{t.lines(stop.lines.length)}</span>
            {ready ? <LiveBadge label={t.live} /> : null}
          </span>
        </button>
      </h3>

      {open ? (
        <div className="border-t border-line">
          {body}
          {ready && updatedLabel ? (
            <p className="border-t border-line px-4 py-1.5 text-right text-xs text-muted">
              {updatedLabel}
            </p>
          ) : null}
        </div>
      ) : null}
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
        <StopCard
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
