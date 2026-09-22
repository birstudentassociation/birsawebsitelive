/**
 * The recurring route line. `pathLength={1}` normalises the geometry so the
 * draw-in maths in openhouse.css work regardless of the real path length. The
 * shape is a stylised reach of the Chao Phraya past Tha Prachan, not a survey
 * line, so it is decorative and hidden from assistive tech.
 */
export default function RiverTrace(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 600 120" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M4 78 C 90 78, 120 30, 190 32 S 300 92, 372 74 S 500 24, 596 40"
        pathLength={1}
        stroke="var(--oh-accent)"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}
