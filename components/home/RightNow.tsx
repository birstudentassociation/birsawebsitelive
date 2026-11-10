"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import clsx from "clsx";
import Icon from "@/components/icons/Icon";
import { localeHref, type Locale } from "@/lib/i18n";
import { STOP_IDS, type BusEtaResponse } from "@/lib/bus-tracker/live";
import type { ConditionsSnapshot, Level } from "@/lib/conditions/types";
import {
  getBangkokParts,
  getDepartureMinutes,
  isModified,
  nextDeparture,
  serviceModification,
} from "@/lib/shuttle";
import { rightNowCopy, type RightNowCopy } from "./rightNowCopy";

export type RightNowProps = {
  locale: Locale;
  className?: string;
};

const STORAGE_KEY = "birsa.home.liveUpdates";
const REFRESH_INTERVAL_MS = 60_000;
const SHUTTLE_LINE = "sanam-chai";

type BusArrival = { route: string; stopId: string; waitSeconds: number };
type BusState =
  { status: "loading" } | { status: "failed" } | { status: "ready"; soonest: BusArrival | null };
type ConditionsState =
  | { status: "loading" }
  | { status: "failed" }
  | { status: "ready"; level: Level; feelsLike: number | null };

const pausedListeners = new Set<() => void>();
let memoryPaused = false;

function readPaused(): boolean {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "off";
  } catch {
    return memoryPaused;
  }
}

function writePaused(paused: boolean) {
  memoryPaused = paused;
  try {
    if (paused) window.localStorage.setItem(STORAGE_KEY, "off");
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    memoryPaused = paused;
  }
  pausedListeners.forEach((listener) => listener());
}

function subscribePaused(listener: () => void) {
  pausedListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    pausedListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

const subscribeNothing = () => () => {};

function formatClock(date: Date): string {
  const { minutes } = getBangkokParts(date);
  const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function localiseClock(clock: string, locale: Locale): string {
  return locale === "th" ? clock.replace(":", ".") : clock;
}

function routeLabel(patternKey: string): string {
  const routeName = patternKey.split("|")[0] ?? patternKey;
  const bracketed = /\(([^)]+)\)/.exec(routeName);
  return (bracketed?.[1] ?? routeName).trim();
}

function soonestArrival(body: BusEtaResponse): BusArrival | null {
  let soonest: BusArrival | null = null;
  for (const stopId of STOP_IDS) {
    const byPattern = body.stops?.[String(stopId)] ?? {};
    for (const [key, arrivals] of Object.entries(byPattern)) {
      const first = arrivals[0];
      if (first && (soonest === null || first.waitSeconds < soonest.waitSeconds)) {
        soonest = {
          route: routeLabel(key),
          stopId: String(stopId),
          waitSeconds: first.waitSeconds,
        };
      }
    }
  }
  return soonest;
}

function overallLevel(snapshot: ConditionsSnapshot): Level {
  const levels = snapshot.cards.map((card) => card.level);
  if (levels.includes("disruption")) return "disruption";
  if (levels.includes("takeCare")) return "takeCare";
  if (levels.includes("normal")) return "normal";
  return "unknown";
}

function feelsLikeOf(snapshot: ConditionsSnapshot): number | null {
  for (const id of ["heatIndexObserved", "heatIndex"] as const) {
    const value = snapshot.readings.find((reading) => reading.id === id)?.value;
    if (typeof value === "number" && Number.isFinite(value)) return Math.round(value);
  }
  return null;
}

async function loadBus(locale: Locale, signal: AbortSignal): Promise<BusState> {
  try {
    const response = await fetch(`/api/bus-eta?locale=${locale}`, { cache: "no-store", signal });
    const body = (await response.json()) as BusEtaResponse;
    if (!response.ok || !body.ok || !body.stops) return { status: "failed" };
    return { status: "ready", soonest: soonestArrival(body) };
  } catch {
    return { status: "failed" };
  }
}

async function loadConditions(signal: AbortSignal): Promise<ConditionsState> {
  try {
    const response = await fetch("/api/conditions", { signal });
    const body = (await response.json()) as ConditionsSnapshot & { ok?: boolean };
    if (!response.ok || !body.ok || !Array.isArray(body.cards)) return { status: "failed" };
    return { status: "ready", level: overallLevel(body), feelsLike: feelsLikeOf(body) };
  } catch {
    return { status: "failed" };
  }
}

function shuttleValue(now: Date, locale: Locale, t: RightNowCopy["shuttle"]): string {
  const parts = getBangkokParts(now);
  const result = nextDeparture(SHUTTLE_LINE, parts);
  if (result.status === "no-service-weekend") return t.weekend;
  if (result.status === "no-service-holiday") return t.holiday;
  if (result.status === "upcoming") {
    return t.leaves(localiseClock(`${result.hh}:${result.mm}`, locale), result.minutesUntil);
  }
  const first = getDepartureMinutes(SHUTTLE_LINE, parts.date)[0];
  if (first !== undefined && parts.minutes < first) {
    const hh = String(Math.floor(first / 60)).padStart(2, "0");
    const mm = String(first % 60).padStart(2, "0");
    return t.firstToday(localiseClock(`${hh}:${mm}`, locale));
  }
  return t.noMoreToday;
}

type TileProps = {
  href: string;
  icon: "shuttle" | "bus" | "conditions";
  tone: string;
  label: string;
  value: string;
};

function Tile({ href, icon, tone, label, value }: TileProps) {
  return (
    <li>
      <Link
        href={href}
        className={clsx(
          "flex min-h-16 items-center gap-3 rounded-xl border border-line px-3 py-2 hover:border-input-border",
          tone
        )}
      >
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-forest"
        >
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-sm text-muted">{label}</span>
          <span className="sr-only">. </span>
          <span className="font-semibold text-ink">{value}</span>
        </span>
      </Link>
    </li>
  );
}

export default function RightNow({ locale, className }: RightNowProps) {
  const t = rightNowCopy[locale];
  const mounted = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false
  );
  const paused = useSyncExternalStore(subscribePaused, readPaused, () => false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [bus, setBus] = useState<BusState>({ status: "loading" });
  const [conditions, setConditions] = useState<ConditionsState>({ status: "loading" });
  const controllerRef = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setUpdatedAt(new Date());
    const [nextBus, nextConditions] = await Promise.all([
      loadBus(locale, controller.signal),
      loadConditions(controller.signal),
    ]);
    if (controller.signal.aborted) return;
    setBus(nextBus);
    setConditions(nextConditions);
    setUpdatedAt(new Date());
  }, [locale]);

  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!mounted) return;
    const shouldLoad = !paused || !hasLoadedRef.current;
    if (shouldLoad) {
      hasLoadedRef.current = true;
      void refresh();
    }
    if (paused) return;
    const id = setInterval(() => void refresh(), REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [mounted, paused, refresh]);

  useEffect(
    () => () => {
      controllerRef.current?.abort();
    },
    []
  );

  const togglePaused = () => writePaused(!paused);

  const clock = mounted && updatedAt ? localiseClock(formatClock(updatedAt), locale) : null;
  const statusLine = clock === null ? t.checking : paused ? t.pausedAt(clock) : t.updatedAt(clock);

  const shuttleLabel =
    serviceModification && isModified(SHUTTLE_LINE)
      ? t.shuttle.labelWithFlag(serviceModification.flag[locale])
      : t.shuttle.label;
  const shuttleText =
    mounted && updatedAt ? shuttleValue(updatedAt, locale, t.shuttle) : t.checking;

  let busLabel = t.bus.label;
  let busValue = t.checking;
  let busTone = "bg-sunken";
  if (bus.status === "failed" || (bus.status === "ready" && bus.soonest === null)) {
    busValue = t.bus.unavailable;
  } else if (bus.status === "ready" && bus.soonest) {
    const { route, stopId, waitSeconds } = bus.soonest;
    const minutes = Math.round(waitSeconds / 60);
    busLabel = t.bus.labelAtStop(t.bus.stopNames[stopId] ?? "");
    busValue = waitSeconds < 60 ? t.bus.arriving(route) : t.bus.arrival(route, minutes);
    busTone = "bg-forest-tint";
  }

  let conditionsValue = t.checking;
  let conditionsTone = "bg-sunken";
  if (conditions.status === "failed") {
    conditionsValue = t.conditions.unavailable;
  } else if (conditions.status === "ready") {
    if (conditions.level === "unknown") {
      conditionsValue = t.conditions.unavailable;
    } else {
      const verdict =
        conditions.level === "normal"
          ? t.conditions.normal
          : conditions.level === "takeCare"
            ? t.conditions.takeCare
            : t.conditions.disruption;
      conditionsValue =
        conditions.feelsLike === null
          ? verdict
          : t.conditions.withFeelsLike(verdict, conditions.feelsLike);
      conditionsTone = conditions.level === "normal" ? "bg-success-tint" : "bg-warning-tint";
    }
  }

  return (
    <section
      aria-labelledby="right-now-heading"
      className={clsx("rounded-2xl border border-line bg-surface p-4 sm:p-5", className)}
    >
      <h2 id="right-now-heading" className="font-display text-xl">
        {t.heading}
      </h2>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="flex items-center gap-2 text-sm text-muted">
          <span
            aria-hidden="true"
            className={clsx("h-2.5 w-2.5 rounded-full", paused ? "bg-muted" : "bg-success")}
          />
          <span>{statusLine}</span>
        </p>
        <button
          type="button"
          aria-pressed={paused}
          onClick={togglePaused}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-input-border px-3 text-sm font-semibold text-ink"
        >
          <Icon name="pause" className="h-4 w-4" />
          {paused ? t.resume : t.pause}
        </button>
      </div>
      <ul className="mt-4 flex flex-col gap-3">
        <Tile
          href={localeHref(locale, "/student-life/getting-around/shuttle-bus")}
          icon="shuttle"
          tone="bg-forest-tint"
          label={shuttleLabel}
          value={shuttleText}
        />
        <Tile
          href={localeHref(locale, "/student-life/getting-around/live-bus-tracker")}
          icon="bus"
          tone={busTone}
          label={busLabel}
          value={busValue}
        />
        <Tile
          href={localeHref(locale, "/conditions")}
          icon="conditions"
          tone={conditionsTone}
          label={t.conditions.label}
          value={conditionsValue}
        />
      </ul>
    </section>
  );
}
