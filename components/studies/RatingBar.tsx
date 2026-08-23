import { Text } from "@/components/bds/Type";

export type RatingBarProps = {
  label: string;
  /** 0 to `max`. */
  value: number;
  max?: number;
  /** e.g. "/ 5": appended after the numeric value. */
  outOf: string;
};

/**
 * BIRSA Design System (Wave 5D, `/studies` route family only): a single
 * labelled magnitude bar, e.g. "Workload: 2.0 / 5". Every bar renders the
 * same brand fill regardless of what it measures, so the number and its
 * label carry the meaning rather than the bar's colour (never colour alone,
 * BUILD-BRIEF-2.0 section 7).
 *
 * Not added to `components/bds/` because it is not part of this wave's
 * owned paths; it lives in `components/studies/` and is built on `Text`
 * (`components/bds/Type.tsx`) rather than a raw Tailwind text size, per the
 * same rule every other component in this wave follows.
 */
export default function RatingBar({ label, value, max = 5, outOf }: RatingBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <Text as="span" step="body-sm" className="font-semibold text-ink">
          {label}
        </Text>
        <Text as="span" step="body-sm" className="shrink-0 text-muted">
          {value.toFixed(1)} {outOf}
        </Text>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-sunken" aria-hidden="true">
        <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
