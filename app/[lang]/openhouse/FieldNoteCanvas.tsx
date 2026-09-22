"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n";
import { CAMPUS, CAMPUS_COORDS, RIVER, projector, smoothPath } from "@/lib/openhouse-geo";

export const FIELDNOTE_CANVAS_ID = "oh-fieldnote-canvas";

export type FieldNoteEntry = { time: string; label: string; value: string };

export type FieldNoteText = {
  kicker: string;
  edition: string;
  title: string;
  date: string;
  keptBy: string;
  empty: string;
  place: string;
  campus: string;
};

const W = 1080;
const H = 1350;
const M = 96;
const PAPER = "#fbf7ef";
const INK = "#211c19";
const MUTED = "#5b524a";
const BRAND = "#d81f26";
const RULE = "#e3d8c6";
const WATER = "#dfe7e4";

/**
 * The souvenir, drawn to a 1080×1350 (4:5) canvas that is both what the page
 * shows and exactly what "Save" downloads. It uses the site's own loaded
 * fonts (read from the CSS custom properties, so Thai falls through to
 * JenjrusVris/Sarabun exactly as it does on the page), the real river course
 * and Thammasat's position on it. The fixed paper palette is deliberate: the
 * card is an object, independent of the site theme. The name, if any, is drawn
 * locally and never leaves the browser.
 */
export default function FieldNoteCanvas({
  locale,
  name,
  entries,
  text,
  label,
}: {
  locale: Locale;
  name: string;
  entries: FieldNoteEntry[];
  text: FieldNoteText;
  label: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    const canvas = ref.current;
    if (!canvas) return;
    void drawCard(canvas, { locale, name: name.trim(), entries, text }, () => cancelled);
    return () => {
      cancelled = true;
    };
  }, [locale, name, entries, text]);

  return (
    <canvas
      ref={ref}
      id={FIELDNOTE_CANVAS_ID}
      className="oh-card-canvas"
      width={W}
      height={H}
      role="img"
      aria-label={label}
    />
  );
}

type CardData = { locale: Locale; name: string; entries: FieldNoteEntry[]; text: FieldNoteText };

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

let logoPromise: Promise<HTMLImageElement | null> | null = null;
function loadLogo(): Promise<HTMLImageElement | null> {
  logoPromise ??= new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = "/birsa-logo.png";
  });
  return logoPromise;
}

async function drawCard(canvas: HTMLCanvasElement, d: CardData, cancelled: () => boolean) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const display = cssVar("--font-heading") || "Georgia, serif";
  const sans = cssVar("--font-body") || "system-ui, sans-serif";
  const th = d.locale === "th";

  const sample = [
    d.text.title,
    d.name,
    d.text.empty,
    ...d.entries.flatMap((e) => [e.label, e.value]),
  ].join(" ");
  await Promise.all([
    document.fonts.load(`600 96px ${display}`, sample),
    document.fonts.load(`600 28px ${sans}`, sample),
    document.fonts.load(`500 28px ${sans}`, sample),
  ]).catch(() => undefined);
  const logo = await loadLogo();
  if (cancelled()) return;

  const track = (em: string) => {
    if ("letterSpacing" in ctx)
      (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = em;
  };

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = "alphabetic";

  // Masthead.
  ctx.fillStyle = BRAND;
  ctx.font = `600 24px ${sans}`;
  track(th ? "0.04em" : "0.2em");
  ctx.textAlign = "left";
  ctx.fillText(d.text.kicker, M, M + 20);
  ctx.fillStyle = MUTED;
  ctx.textAlign = "right";
  ctx.fillText(d.text.edition, W - M, M + 20);
  track("0px");
  ctx.fillStyle = RULE;
  ctx.fillRect(M, M + 48, W - 2 * M, 2);

  // Title: the largest size that sets it on one line; failing that, two
  // balanced lines rather than a one-word widow.
  ctx.textAlign = "left";
  ctx.fillStyle = INK;
  const maxW = W - 2 * M;
  let size = 104;
  let lines: string[] = [];
  for (; size >= 78; size -= 2) {
    ctx.font = `600 ${size}px ${display}`;
    if (ctx.measureText(d.text.title).width <= maxW) break;
  }
  ctx.font = `600 ${size}px ${display}`;
  if (ctx.measureText(d.text.title).width <= maxW) {
    lines = [d.text.title];
  } else {
    size = 84;
    ctx.font = `600 ${size}px ${display}`;
    lines = balance(ctx, d.text.title, maxW, d.locale);
  }
  const lead = size * (th ? 1.34 : 1.08);
  let y = M + 48 + 40 + size;
  for (const line of lines.slice(0, 2)) {
    ctx.fillText(line, M, y);
    y += lead;
  }

  ctx.font = `500 28px ${sans}`;
  ctx.fillStyle = MUTED;
  const byline = d.name ? `${d.text.date}  ·  ${d.text.keptBy} ${d.name}` : d.text.date;
  ctx.fillText(ellipsize(ctx, byline, maxW), M, y - lead + size * 0.2 + 52);

  // River column: the real Chao Phraya, with the campus marked.
  const top = y - lead + size * 0.2 + 120;
  const bottom = H - M - 150;
  const riverBox = { x: W - M - 190, y: top, w: 190, h: bottom - top };
  const project = projector(RIVER, riverBox);
  const path = new Path2D(smoothPath(RIVER.map(project)));
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = WATER;
  ctx.lineWidth = 26;
  ctx.stroke(path);
  ctx.strokeStyle = "#8f8578";
  ctx.lineWidth = 2.5;
  ctx.stroke(path);
  const c = project(CAMPUS);
  ctx.fillStyle = BRAND;
  ctx.beginPath();
  ctx.arc(c.x, c.y, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = PAPER;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.font = `600 22px ${sans}`;
  ctx.fillStyle = INK;
  ctx.textAlign = "right";
  ctx.fillText(d.text.campus, W - M, c.y + 50);
  ctx.textAlign = "left";

  // Timeline: every entry is measured, then stacked; type only shrinks if
  // the whole day would otherwise overrun the river column.
  const colW = riverBox.x - M - 64;
  const railX = M + 8;
  const textX = M + 40;
  if (d.entries.length === 0) {
    ctx.font = `600 40px ${display}`;
    ctx.fillStyle = MUTED;
    wrap(ctx, d.text.empty, colW, d.locale)
      .slice(0, 3)
      .forEach((l, i) => ctx.fillText(l, M, top + 60 + i * 54));
  } else {
    const avail = bottom - top - 20;
    const valueLead = th ? 1.3 : 1.12;
    // Rhythm: a value sits close under its time (proximity binds them) and
    // a clear gap separates one entry from the next.
    const lift = 14;
    const after = 60;
    const entryHeight = (n: number, size: number) =>
      lift + size * 0.95 + (n - 1) * size * valueLead + size * 0.3 + after;
    let vs = 44;
    let blocks: string[][] = [];
    for (; vs >= 30; vs -= 2) {
      ctx.font = `600 ${vs}px ${display}`;
      blocks = d.entries.map((e) => {
        const lines = wrap(ctx, e.value, colW - 40, d.locale);
        return lines.length === 2 ? balance(ctx, e.value, colW - 40, d.locale) : lines.slice(0, 2);
      });
      const total = blocks.reduce((h, b) => h + entryHeight(b.length, vs), -after + 26);
      if (total <= avail) break;
    }
    let ey = top + 24;
    const starts: number[] = [];
    d.entries.forEach((e, i) => {
      starts.push(ey);
      ctx.fillStyle = BRAND;
      ctx.beginPath();
      ctx.arc(railX, ey - 8, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = `600 26px ${sans}`;
      ctx.fillText(e.time, textX, ey);
      const tw = ctx.measureText(e.time).width;
      ctx.font = `600 20px ${sans}`;
      ctx.fillStyle = MUTED;
      track(th ? "0.02em" : "0.14em");
      ctx.fillText(th ? e.label : e.label.toUpperCase(), textX + tw + 22, ey - 1);
      track("0px");
      ctx.font = `600 ${vs}px ${display}`;
      ctx.fillStyle = INK;
      const block = blocks[i] ?? [];
      block.forEach((l, j) => ctx.fillText(l, textX, ey + lift + vs * 0.95 + j * vs * valueLead));
      ey += entryHeight(block.length, vs);
    });
    ctx.fillStyle = RULE;
    const last = starts[starts.length - 1] ?? top;
    if (starts.length > 1)
      ctx.fillRect(railX - 1, (starts[0] ?? top) - 8, 2, last - (starts[0] ?? top));
    // Re-draw the dots over the rail.
    ctx.fillStyle = BRAND;
    for (const sy of starts) {
      ctx.beginPath();
      ctx.arc(railX, sy - 8, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Footer.
  const fy = H - M - 96;
  ctx.fillStyle = RULE;
  ctx.fillRect(M, fy, W - 2 * M, 2);
  ctx.font = `600 26px ${sans}`;
  ctx.fillStyle = INK;
  ctx.fillText(d.text.place, M, fy + 52);
  ctx.font = `500 22px ${sans}`;
  ctx.fillStyle = MUTED;
  ctx.fillText(CAMPUS_COORDS, M, fy + 86);
  ctx.textAlign = "right";
  ctx.font = `600 34px ${display}`;
  ctx.fillStyle = INK;
  ctx.fillText("BIRSA", W - M, fy + 66);
  if (logo) {
    const bw = ctx.measureText("BIRSA").width;
    ctx.drawImage(logo, W - M - bw - 76, fy + 22, 60, 60);
  }
  ctx.textAlign = "left";
}

function segmentWords(text: string, locale: Locale): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const seg = new Intl.Segmenter(locale, { granularity: "word" });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return text.split(/(\s+)/);
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number, locale: Locale): string[] {
  const out: string[] = [];
  let line = "";
  for (const piece of segmentWords(text, locale)) {
    const next = line + piece;
    if (line && ctx.measureText(next.trimEnd()).width > max) {
      out.push(line.trimEnd());
      line = piece.trimStart();
    } else {
      line = next;
    }
  }
  if (line.trim()) out.push(line.trimEnd());
  return out;
}

/** Split a title into two lines of similar width instead of leaving a widow. */
function balance(
  ctx: CanvasRenderingContext2D,
  text: string,
  max: number,
  locale: Locale
): string[] {
  const words = segmentWords(text, locale);
  let best: string[] = wrap(ctx, text, max, locale);
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join("").trim();
    const b = words.slice(i).join("").trim();
    if (!a || !b) continue;
    const wa = ctx.measureText(a).width;
    const wb = ctx.measureText(b).width;
    if (wa > max || wb > max) continue;
    const diff = Math.abs(wa - wb) - (/[,;·]$/.test(a) ? max / 2 : 0);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = [a, b];
    }
  }
  return best;
}

function ellipsize(ctx: CanvasRenderingContext2D, text: string, max: number): string {
  if (ctx.measureText(text).width <= max) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > max) t = t.slice(0, -1);
  return `${t}…`;
}
