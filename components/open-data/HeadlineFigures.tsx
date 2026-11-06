import type { Locale } from "@/lib/i18n";
import type { Headline } from "@/lib/open-data";

/**
 * Headline figures after the ONS feature card: the figure large, a label
 * saying what it counts, and an optional line of context. A plain list, so a
 * screen reader hears "฿230,822, planned spending" in reading order.
 */
export default function HeadlineFigures({
  headlines,
  locale,
}: {
  headlines: Headline[];
  locale: Locale;
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {headlines.map((h, i) => (
        <li key={i} className="flex flex-col gap-1 rounded-md border border-line bg-surface p-5">
          <span className="font-display text-3xl tabular-nums">{h.value}</span>
          <span className="font-semibold">{h.label[locale]}</span>
          {h.context ? <span className="text-sm text-muted">{h.context[locale]}</span> : null}
        </li>
      ))}
    </ul>
  );
}
