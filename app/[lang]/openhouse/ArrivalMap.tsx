import type { Locale } from "@/lib/i18n";

type Bi = { en: string; th: string };
const L = (bi: Bi, locale: Locale) => bi[locale];

/**
 * A bespoke, stylised diagram of Tha Prachan on the Chao Phraya — not a survey
 * map and not map tiles, so it sits inside the event's own identity. Geography
 * is approximate but true in relation: the campus on the east bank at the
 * river's bend, Wang Lang across the water, Sanam Luang beside it, Sanam Chai
 * to the south. Selecting an arrival mode traces that route into the campus;
 * the draw is CSS (keyed by mode) and degrades to a finished line under reduced
 * motion.
 */
const PLACES = {
  river: { en: "Chao Phraya", th: "เจ้าพระยา" },
  campus: { en: "Tha Prachan", th: "ท่าพระจันทร์" },
  wanglang: { en: "Wang Lang", th: "วังหลัง" },
  sanamluang: { en: "Sanam Luang", th: "สนามหลวง" },
  sanamchai: { en: "MRT Sanam Chai", th: "MRT สนามไชย" },
  pinklao: { en: "Pinklao", th: "ปิ่นเกล้า" },
} satisfies Record<string, Bi>;

const ROUTES: Record<string, { d: string; ox: number; oy: number }> = {
  ferry: { d: "M215 215 Q 272 196 330 205", ox: 215, oy: 215 },
  bus: { d: "M600 188 Q 470 188 330 205", ox: 600, oy: 188 },
  mrt: { d: "M470 300 Q 398 250 330 205", ox: 470, oy: 300 },
  shuttle: { d: "M412 352 Q 362 274 330 205", ox: 412, oy: 352 },
  walk: { d: "M410 180 Q 372 188 330 205", ox: 410, oy: 180 },
};

export default function ArrivalMap({ locale, mode }: { locale: Locale; mode?: string }) {
  const route = mode ? ROUTES[mode] : undefined;
  return (
    <svg
      className="oh-map-svg"
      viewBox="0 0 640 380"
      role="img"
      aria-label={
        locale === "th"
          ? "แผนผังคร่าว ๆ ของท่าพระจันทร์ริมแม่น้ำเจ้าพระยา"
          : "A stylised diagram of Tha Prachan on the Chao Phraya river"
      }
    >
      {/* River */}
      <path
        className="oh-map-water"
        d="M250 -10 C 250 90, 312 150, 300 205 S 250 320, 190 390"
        fill="none"
      />
      <text className="oh-map-river" x="243" y="70" transform="rotate(20 243 70)">
        {L(PLACES.river, locale)}
      </text>

      {/* Orientation labels */}
      <MapLabel x={150} y={92} label={L(PLACES.pinklao, locale)} anchor="middle" />
      <MapLabel x={205} y={236} label={L(PLACES.wanglang, locale)} anchor="middle" />
      <MapLabel x={420} y={176} label={L(PLACES.sanamluang, locale)} anchor="start" />
      <MapLabel x={478} y={314} label={L(PLACES.sanamchai, locale)} anchor="start" />

      {/* Selected route */}
      {route ? (
        <g key={mode}>
          <path className="oh-map-route" d={route.d} pathLength={1} fill="none" />
          <circle className="oh-map-origin" cx={route.ox} cy={route.oy} r={5} />
        </g>
      ) : null}

      {/* Campus */}
      <circle className="oh-map-campus-dot" cx={330} cy={205} r={7} />
      <text className="oh-map-campus" x={344} y={202}>
        {L(PLACES.campus, locale)}
      </text>
    </svg>
  );
}

function MapLabel({
  x,
  y,
  label,
  anchor,
}: {
  x: number;
  y: number;
  label: string;
  anchor: "start" | "middle" | "end";
}) {
  return (
    <text className="oh-map-label" x={x} y={y} textAnchor={anchor}>
      {label}
    </text>
  );
}
