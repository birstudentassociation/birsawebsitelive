/**
 * Small pieces of the prerequisite map shared by its server-rendered form and
 * its plan-aware client form: the sideways-scrolling frame and the legend.
 * No state and no hooks, so both can render them.
 */
import clsx from "clsx";
import type { ToneStyle } from "@/components/course-review/mapTones";

/**
 * The frame the drawing scrolls in. The map is wider than a phone, so it
 * scrolls inside this box rather than widening the page; the box is focusable
 * so a keyboard user can scroll it, and says so in a line below.
 */
export function MapScroller({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        role="region"
        aria-label={label}
        tabIndex={0}
        className="focus-halo max-w-full overflow-x-auto rounded-lg border border-line bg-surface p-2"
      >
        {children}
      </div>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}

export type LegendItem = { key: string; label: string; tone: ToneStyle };

/** A key to the colours: a chip per tone, with the same border style and glyph the node uses. */
export function MapLegend({ title, items }: { title: string; items: LegendItem[] }) {
  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <p className="font-semibold text-ink">{title}</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
        {items.map(({ key, label, tone }) => (
          <li key={key} className="flex items-center gap-2 text-muted">
            <span
              aria-hidden="true"
              className={clsx(
                "inline-flex h-5 w-8 shrink-0 items-center justify-center rounded border-[1.5px] text-xs text-ink",
                tone.swatch,
                tone.dash === "dashed" && "border-dashed",
                tone.dash === "dotted" && "border-dotted"
              )}
            >
              {tone.glyph}
            </span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
