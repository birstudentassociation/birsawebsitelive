/**
 * Server component: renders both shuttle lines as a poster-style tube map,
 * reproducing the layout of the official printed Pinklao line poster. An
 * inline SVG is centred on the Tha Prachan campus (Thammasat) hub, drawn as
 * a double-ringed interchange roundel near the vertical middle of the
 * diagram. Station names come entirely from `lib/shuttle`, never hardcoded
 * here.
 *
 * The Pinklao line (kind `loop`) rises above the hub as a tall "racetrack":
 * two close, parallel vertical rails topped by a semicircular arch, with
 * both rails necking inward at the bottom to converge back on the hub. Its
 * 8 intermediate stops sit in two columns (one per rail), each drawn as a
 * small filled rectangle tick perpendicular to its rail rather than a
 * roundel, in classic tube-map style.
 *
 * The Sanam Chai line (kind `point-to-point`) is drawn as a straight red
 * spur dropping from the hub straight down to its one destination stop,
 * also a rectangle tick.
 *
 * Both lines use fixed brand hex colours (`#C3002F` Sanam Chai, `#FFD13F`
 * Pinklao) identical in light and dark mode, drawn flat with no outline.
 * Everything else (ink, muted text, surface, hub roundel) uses
 * `var(--color-*)` tokens from `app/globals.css`; only the two line colours
 * are literal hex.
 *
 * A visually hidden ordered list beneath the diagram carries the exact same
 * stop sequence the old plain `<ol>` markup gave screen reader and no-CSS
 * users, so the accessible contract is unchanged even though the visible
 * presentation is graphical.
 *
 * Used from `content/student-life/{en,th}/home/shuttle-bus.mdx` via the MDX
 * component map in `lib/mdx.tsx`.
 */
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import { shuttleLines, getLine, type LineId, type Stop } from "@/lib/shuttle";
import Tag from "@/components/Tag";

export type ShuttleRouteProps = {
  locale: Locale;
};

type Labels = {
  campus: string;
  hubNote: string;
  mapTitle: string;
  mapAriaLabel: string;
  kind: Record<"point-to-point" | "loop", string>;
};

const labels: Record<Locale, Labels> = {
  en: {
    campus: "Boarding point",
    hubNote: "Both lines board and finish here.",
    mapTitle: "Route map",
    mapAriaLabel:
      "Diagram of the Sanam Chai and Pinklao shuttle lines, both centred on Thammasat University, Tha Prachan.",
    kind: {
      "point-to-point": "Point-to-point: the bus runs straight there and back.",
      loop: "Loop: the bus circles through Pinklao and returns to campus.",
    },
  },
  th: {
    campus: "จุดขึ้นรถ",
    hubNote: "ขึ้นรถและลงรถทั้งสองสายที่นี่",
    mapTitle: "แผนที่เส้นทาง",
    mapAriaLabel:
      "แผนภาพเส้นทางรถรับส่งสายสนามไชยและสายปิ่นเกล้า ทั้งสองสายเริ่มต้นที่มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์",
    kind: {
      "point-to-point": "วิ่งตรงไปกลับ ไม่มีการวนรอบ",
      loop: "วิ่งวนเป็นลูป ผ่านฝั่งปิ่นเกล้าแล้ววนกลับมหาลัย",
    },
  },
};

// The two line colours are fixed brand hex values, identical in both
// themes, per the official printed poster. Do not swap these per theme and
// do not replace them with `var(--color-*)` tokens.
const lineColor: Record<LineId, string> = {
  "sanam-chai": "#C3002F",
  pinklao: "#FFD13F",
};

const LINE_WIDTH = 5;

// Map geometry, poster layout: the Pinklao racetrack rises above the hub,
// the Sanam Chai spur drops straight down below it. The viewBox is cropped
// tight to the drawn content (not a wide, mostly-empty canvas) so the map
// scales up to fill its column and the labels read at a comfortable size.
const VIEW_MIN_X = 210;
const VIEW_MIN_Y = 62;
const VIEW_W = 505;
const VIEW_H = 562;
const HUB = { x: 460, y: 360 };

// Pinklao racetrack: two vertical rails 72 apart, centred on the hub's x,
// joined by a semicircular arch at the top and necking inward to the hub at
// the bottom.
const RAIL_LEFT_X = 424;
const RAIL_RIGHT_X = 496;
const RAIL_TOP_Y = 110; // where the straight rails meet the arch
const RAIL_BOTTOM_Y = 320; // where the straight rails end and the neck begins
const ARCH_RADIUS = 36;

/** One continuous path: leave the hub, neck up to the right rail, straight
 * up the right rail, arch over the top, straight down the left rail, neck
 * back down to the hub. Travel direction follows this same path (up the
 * right rail, over the arch, down the left rail), matching the data order. */
const PINKLAO_PATH = [
  `M ${HUB.x} ${HUB.y}`,
  `C ${HUB.x + 20} ${HUB.y - 2} ${RAIL_RIGHT_X} ${RAIL_BOTTOM_Y + 25} ${RAIL_RIGHT_X} ${RAIL_BOTTOM_Y}`,
  `L ${RAIL_RIGHT_X} ${RAIL_TOP_Y}`,
  `A ${ARCH_RADIUS} ${ARCH_RADIUS} 0 0 0 ${RAIL_LEFT_X} ${RAIL_TOP_Y}`,
  `L ${RAIL_LEFT_X} ${RAIL_BOTTOM_Y}`,
  `C ${RAIL_LEFT_X} ${RAIL_BOTTOM_Y + 25} ${HUB.x - 20} ${HUB.y - 2} ${HUB.x} ${HUB.y}`,
].join(" ");

// Sanam Chai spur: straight run south from the hub to the MRT station.
const SPUR_END = { x: HUB.x, y: 560 };

// Station tick rectangles: short, perpendicular to their line, pointing
// outward, per the poster's tube-map station marks.
const TICK_LENGTH = 12;
const TICK_THICKNESS = 5;

// The 4 shared row heights used by both Pinklao rail columns.
const ROWS = [140, 195, 250, 305] as const;

type Anchor = "start" | "end" | "middle";

function StopLabel({
  x,
  y,
  anchor,
  primary,
  secondary,
}: {
  x: number;
  y: number;
  anchor: Anchor;
  primary: string;
  secondary: string;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor}>
      <tspan
        x={x}
        dy="-0.35em"
        className="text-xs font-medium"
        style={{ fill: "var(--color-ink)" }}
      >
        {primary}
      </tspan>
      <tspan x={x} dy="1.15em" className="text-[10px]" style={{ fill: "var(--color-muted)" }}>
        {secondary}
      </tspan>
    </text>
  );
}

/** A station rectangle tick, filled in its line's brand colour. */
function StationTick({
  x,
  y,
  width,
  height,
  color,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}) {
  return <rect x={x} y={y} width={width} height={height} fill={color} />;
}

/** Draws a line in its brand colour. */
function LinePath({ d, color }: { d: string; color: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={LINE_WIDTH}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export default function ShuttleRoute({ locale }: ShuttleRouteProps) {
  const t = labels[locale];
  const other: Locale = locale === "en" ? "th" : "en";

  const sanamChai = getLine("sanam-chai");
  const pinklao = getLine("pinklao");

  // Both lines' stop arrays are non-empty by construction (see
  // `lib/shuttle.ts`); the assertions below just satisfy
  // `noUncheckedIndexedAccess`.
  const campusStop = sanamChai.stops[0]!;
  const sanamChaiStation = sanamChai.stops[sanamChai.stops.length - 1]!;

  // The 8 intermediate Pinklao stops, in travel order. The poster splits
  // them into two columns of 4: the first half rides up the right rail
  // (bottom to top), the second half rides down the left rail (top to
  // bottom).
  const pinklaoIntermediate = pinklao.stops.slice(1, -1);
  const half = Math.ceil(pinklaoIntermediate.length / 2);
  const rightStops = pinklaoIntermediate.slice(0, half);
  const leftStops = pinklaoIntermediate.slice(half);

  const LABEL_GAP = 8;

  const rightColumn = rightStops.map((stop, index) => {
    // index 0 (first stop leaving the hub) sits at the bottom row, index
    // half-1 (last before the arch) sits at the top row.
    const rowIndex = ROWS.length - 1 - index;
    const y = ROWS[rowIndex] ?? ROWS[ROWS.length - 1]!;
    return { stop, y };
  });

  const leftColumn = leftStops.map((stop, index) => {
    // index 0 (first stop after the arch) sits at the top row, working
    // back down towards the hub.
    const y = ROWS[index] ?? ROWS[ROWS.length - 1]!;
    return { stop, y };
  });

  // Below and to the right of the hub roundel, in the open wedge between the
  // downward Sanam Chai spur and the lower-right of the Pinklao rail, so
  // this long campus name never crosses a line or another station label.
  const hubLabel = { x: HUB.x + 22, y: HUB.y + 12, anchor: "start" as Anchor };
  const stationLabel = { x: SPUR_END.x, y: SPUR_END.y + 30, anchor: "middle" as Anchor };

  return (
    <section className="flex flex-col gap-6">
      <h3 className="font-display text-lg">{t.mapTitle}</h3>

      <div className="overflow-x-auto">
        <svg
          viewBox={`${VIEW_MIN_X} ${VIEW_MIN_Y} ${VIEW_W} ${VIEW_H}`}
          role="img"
          aria-label={t.mapAriaLabel}
          className="w-full"
        >
          {/* Pinklao racetrack: rises from the hub, up the right rail, over
              the arch, down the left rail, and necks back to the hub. */}
          <LinePath d={PINKLAO_PATH} color={lineColor.pinklao} />

          {/* Sanam Chai spur: a straight run south from the hub. */}
          <LinePath
            d={`M ${HUB.x} ${HUB.y} L ${SPUR_END.x} ${SPUR_END.y}`}
            color={lineColor["sanam-chai"]}
          />

          {/* Right-column Pinklao stops: ticks extend rightward from the
              right rail, labels sit to their right. */}
          {rightColumn.map(({ stop, y }, index) => (
            <g key={`pinklao-right-${index}`}>
              <StationTick
                x={RAIL_RIGHT_X}
                y={y - TICK_THICKNESS / 2}
                width={TICK_LENGTH}
                height={TICK_THICKNESS}
                color={lineColor.pinklao}
              />
              <StopLabel
                x={RAIL_RIGHT_X + TICK_LENGTH + LABEL_GAP}
                y={y}
                anchor="start"
                primary={stop[locale]}
                secondary={stop[other]}
              />
            </g>
          ))}

          {/* Left-column Pinklao stops: ticks extend leftward from the left
              rail, labels sit to their left. */}
          {leftColumn.map(({ stop, y }, index) => (
            <g key={`pinklao-left-${index}`}>
              <StationTick
                x={RAIL_LEFT_X - TICK_LENGTH}
                y={y - TICK_THICKNESS / 2}
                width={TICK_LENGTH}
                height={TICK_THICKNESS}
                color={lineColor.pinklao}
              />
              <StopLabel
                x={RAIL_LEFT_X - TICK_LENGTH - LABEL_GAP}
                y={y}
                anchor="end"
                primary={stop[locale]}
                secondary={stop[other]}
              />
            </g>
          ))}

          {/* Sanam Chai's one destination stop: a horizontal tick crossing
              the vertical spur. */}
          <StationTick
            x={SPUR_END.x - TICK_LENGTH / 2}
            y={SPUR_END.y - TICK_THICKNESS / 2}
            width={TICK_LENGTH}
            height={TICK_THICKNESS}
            color={lineColor["sanam-chai"]}
          />
          <StopLabel
            x={stationLabel.x}
            y={stationLabel.y}
            anchor={stationLabel.anchor}
            primary={sanamChaiStation[locale]}
            secondary={sanamChaiStation[other]}
          />

          {/* Campus interchange hub, drawn last so both lines appear to
              plug straight into it. Bigger, double-ringed roundel marks it
              as the interchange rather than an ordinary stop. */}
          <circle
            cx={HUB.x}
            cy={HUB.y}
            r={18}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={4}
          />
          <circle
            cx={HUB.x}
            cy={HUB.y}
            r={11}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={2}
          />
          <StopLabel
            x={hubLabel.x}
            y={hubLabel.y}
            anchor={hubLabel.anchor}
            primary={campusStop[locale]}
            secondary={campusStop[other]}
          />
        </svg>
      </div>

      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {shuttleLines.map((line) => (
          <li key={line.id} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-3 w-3 rounded-full border"
              style={{
                backgroundColor: lineColor[line.id],
                borderColor: "var(--color-ink)",
              }}
            />
            <span className="text-ink font-medium">{line.name[locale]}</span>
            <span className="text-muted">{t.kind[line.kind]}</span>
          </li>
        ))}
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="border-ink bg-surface inline-block h-4 w-4 rounded-full border-2"
          />
          <Tag variant="brand">{t.campus}</Tag>
          <span className="text-muted">{t.hubNote}</span>
        </li>
      </ul>

      {/* Accessible fallback: the same stop sequence the old plain <ol>
          gave screen reader and no-CSS users, unaffected by the SVG above. */}
      <div className="sr-only">
        {shuttleLines.map((line) => (
          <div key={`sr-${line.id}`}>
            <h4>{line.name[locale]}</h4>
            <p>{t.kind[line.kind]}</p>
            <ol>
              {line.stops.map((stop: Stop, index) => (
                <li key={`sr-${stop.en}-${index}`}>
                  {stop[locale]} ({stop[other]}){stop.isCampus ? `, ${t.campus}` : ""}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
