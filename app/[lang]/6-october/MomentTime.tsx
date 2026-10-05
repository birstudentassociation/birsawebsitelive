"use client";

import { useEffect, useState } from "react";

export type Clock = { day: number; minutes: number };

type State = "past" | "now" | "upcoming" | null;

const BANGKOK_OFFSET = 7 * 60 * 60 * 1000;
const OCTOBER = 9;

function bangkokNow() {
  const d = new Date(Date.now() + BANGKOK_OFFSET);
  return {
    month: d.getUTCMonth(),
    day: d.getUTCDate(),
    minutes: d.getUTCHours() * 60 + d.getUTCMinutes(),
  };
}

const passed = (clock: Clock, now: { day: number; minutes: number }) =>
  now.day > clock.day || (now.day === clock.day && now.minutes >= clock.minutes);

function stateFor(clock: Clock, next: Clock | null): State {
  const now = bangkokNow();
  if (now.month !== OCTOBER || (now.day !== 5 && now.day !== 6)) return null;
  if (!passed(clock, now)) return "upcoming";
  return next && passed(next, now) ? "past" : "now";
}

export default function MomentTime({
  time,
  clock,
  next,
  nowLabel,
}: {
  time: string;
  clock: Clock;
  next: Clock | null;
  nowLabel: string;
}) {
  const [state, setState] = useState<State>(null);

  useEffect(() => {
    const tick = () => setState(stateFor(clock, next));
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [clock, next]);

  const tone =
    state === "past" || state === "now"
      ? "text-brand-deep"
      : state === "upcoming"
        ? "text-muted"
        : "text-ink";

  return (
    <div className="flex shrink-0 flex-col gap-1 sm:w-32">
      <p className={`font-display text-2xl whitespace-nowrap tabular-nums ${tone}`}>{time}</p>
      {state === "now" ? (
        <p className="flex items-center gap-2 text-xs font-semibold text-brand-deep">
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-deep opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-brand-deep" />
          </span>
          {nowLabel}
        </p>
      ) : null}
    </div>
  );
}
