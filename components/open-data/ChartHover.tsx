"use client";

import { useRef, useState } from "react";

type Tip = {
  value: string;
  label: string;
  x: number;
  y: number;
  align: "start" | "center" | "end";
};

/**
 * The hover layer for a server-drawn chart. Any mark inside with
 * `data-tip-value` (and optionally `data-tip-label`) shows a tooltip on
 * pointer hover and on keyboard focus. It only repeats what the direct
 * labels and the table already say, so the chart reads the same with
 * JavaScript off. Text goes in through React, never as HTML.
 */
export default function ChartHover({ children }: { children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip | null>(null);

  function show(target: EventTarget | null) {
    const el = target instanceof Element ? target.closest("[data-tip-value]") : null;
    const container = box.current;
    if (!el || !container || !container.contains(el)) {
      setTip(null);
      return;
    }
    const outer = container.getBoundingClientRect();
    const mark = el.getBoundingClientRect();
    const x = mark.left + mark.width / 2 - outer.left;
    // Near an edge the tooltip hangs inwards, so it never widens the page.
    const align = x < 96 ? "start" : x > outer.width - 96 ? "end" : "center";
    setTip({
      value: el.getAttribute("data-tip-value") ?? "",
      label: el.getAttribute("data-tip-label") ?? "",
      x:
        align === "start"
          ? Math.max(0, x - 16)
          : align === "end"
            ? Math.min(outer.width, x + 16)
            : x,
      y: mark.top - outer.top,
      align,
    });
  }

  return (
    <div
      ref={box}
      className="relative"
      onPointerOver={(e) => show(e.target)}
      onPointerLeave={() => setTip(null)}
      onFocus={(e) => show(e.target)}
      onBlur={() => setTip(null)}
      onKeyDown={(e) => e.key === "Escape" && setTip(null)}
    >
      {children}
      {tip ? (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute z-10 flex -translate-y-full ${tip.align === "center" ? "-translate-x-1/2" : tip.align === "end" ? "-translate-x-full" : ""} flex-col rounded-md border border-line-strong bg-surface px-3 py-2 text-sm whitespace-nowrap shadow-md`}
          style={{ left: tip.x, top: tip.y - 8 }}
        >
          <span className="font-semibold text-ink tabular-nums">{tip.value}</span>
          {tip.label ? <span className="text-muted">{tip.label}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
