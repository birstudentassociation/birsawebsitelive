export type RatingBarProps = {
  label: string;
  /** 0–`max`. */
  value: number;
  max?: number;
  /** e.g. "/ 5" — appended after the numeric value. */
  outOf: string;
};

/**
 * A single labelled magnitude bar, e.g. "Workload — 2.0 / 5". Reuses the same
 * single-hue bar language as `CourseStats`' track breakdown: identity comes
 * from the adjacent label, not from color, so every bar stays the same
 * brand-red fill regardless of what it measures.
 */
export default function RatingBar({ label, value, max = 5, outOf }: RatingBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-ink font-medium">{label}</span>
        <span className="text-muted shrink-0">
          {value.toFixed(1)} {outOf}
        </span>
      </div>
      <div className="bg-sunken h-1.5 w-full overflow-hidden rounded-full">
        <div className="bg-brand h-full rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
