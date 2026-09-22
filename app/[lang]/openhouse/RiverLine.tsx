import type { Locale } from "@/lib/i18n";
import { CAMPUS, CAMPUS_COORDS, RIVER, projector, smoothPath } from "@/lib/openhouse-geo";

const W = 360;
const H = 720;
const project = projector(RIVER, { x: 12, y: 24, w: 280, h: 672 });
const riverD = smoothPath(RIVER.map(project));
const campus = project(CAMPUS);

/**
 * The Chao Phraya between Phra Pinklao and Memorial bridges, drawn from its
 * real course, with Thammasat marked where it actually sits on the east bank.
 * Decorative (the page says all of this in words), so hidden from assistive
 * tech. The centre line draws in once on reveal; reduced motion and no-JS get
 * the finished line.
 */
export default function RiverLine({ locale }: { locale: Locale }) {
  return (
    <svg
      className="oh-river oh-trace"
      data-reveal
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      focusable="false"
    >
      <path className="oh-river-body" d={riverD} pathLength={1} fill="none" />
      <path className="oh-river-line" d={riverD} pathLength={1} fill="none" />
      <g className="oh-river-mark">
        <line x1={campus.x} y1={campus.y} x2={campus.x + 34} y2={campus.y} />
        <circle cx={campus.x} cy={campus.y} r={6} />
        <text className="oh-river-name" x={campus.x + 42} y={campus.y + 2}>
          {locale === "th" ? "ท่าพระจันทร์" : "Tha Prachan"}
        </text>
        <text className="oh-river-coords" x={campus.x + 42} y={campus.y + 24}>
          {CAMPUS_COORDS}
        </text>
      </g>
      <text className="oh-river-caption" x={12} y={H - 4}>
        {locale === "th" ? "แม่น้ำเจ้าพระยา" : "Chao Phraya"}
      </text>
    </svg>
  );
}
