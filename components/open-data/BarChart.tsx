import type { Locale } from "@/lib/i18n";
import {
  cellText,
  formatMoney,
  formatNumber,
  isBilingual,
  moneyDecimals,
  type ChartSpec,
  type Dataset,
} from "@/lib/open-data";

type Bar = { label: string; value: number };

/** Gridline step that gives 3 to 6 round intervals (1, 2 or 5 times a power of ten). */
function niceStep(max: number): number {
  if (max <= 0) return 1;
  const rough = max / 4;
  const power = 10 ** Math.floor(Math.log10(rough));
  for (const m of [1, 2, 5, 10]) {
    if (rough <= m * power) return m * power;
  }
  return 10 * power;
}

export function chartBars(spec: ChartSpec, dataset: Dataset, locale: Locale): Bar[] {
  const labelColumn = dataset.columns.find((c) => c.key === spec.labelKey);
  if (!labelColumn) return [];
  const totals = new Map<string, number>();
  for (const row of dataset.rows) {
    const raw = row[spec.labelKey];
    const label = isBilingual(raw) ? raw[locale] : cellText(locale, labelColumn, raw);
    const value = typeof row[spec.valueKey] === "number" ? (row[spec.valueKey] as number) : 0;
    if (!spec.groupBy && totals.has(label)) {
      totals.set(`${label} (${totals.size + 1})`, value);
    } else {
      totals.set(label, (totals.get(label) ?? 0) + value);
    }
  }
  // High to low; zero bars stay, last, because "nothing planned" is a finding too.
  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Horizontal bar chart as server-rendered SVG, after the ONS chart guidance:
 * sorted high to low, axis from zero, round gridlines each labelled, one
 * colour, value labels on the bars so nobody has to read the axis, a title
 * that states the finding and a source line. No client JavaScript. The full
 * figures are always in the table beside it, so the SVG is described by its
 * alt sentence and not read out bar by bar.
 */
export default function BarChart({
  spec,
  dataset,
  locale,
  figureLabel,
  sourceLine,
}: {
  spec: ChartSpec;
  dataset: Dataset;
  locale: Locale;
  figureLabel: string;
  sourceLine: string;
}) {
  const bars = chartBars(spec, dataset, locale);
  const valueColumn = dataset.columns.find((c) => c.key === spec.valueKey);
  const isMoney = valueColumn?.kind === "money";
  const decimals = isMoney ? moneyDecimals(bars.map((b) => b.value)) : 0;
  const fmt = (v: number) => (isMoney ? formatMoney(v, decimals) : formatNumber(v));

  const max = Math.max(0, ...bars.map((b) => b.value));
  const step = niceStep(max);
  const axisMax = Math.max(step, Math.ceil(max / step) * step);
  const ticks: number[] = [];
  for (let v = 0; v <= axisMax + step / 2; v += step) ticks.push(v);

  // Layout in SVG units. Labels sit above each bar, so long Thai labels never
  // fight the bars for width and the chart works at phone width.
  const width = 640;
  const left = 4;
  const right = 24;
  const plot = width - left - right;
  const rowH = 44;
  const top = 8;
  const axisH = 28;
  const height = top + bars.length * rowH + axisH;
  const x = (v: number) => left + (v / axisMax) * plot;

  const titleId = `chart-${spec.datasetId}-title`;

  return (
    <figure className="flex flex-col gap-3" aria-labelledby={titleId}>
      <div>
        <p className="text-sm text-muted">{figureLabel}</p>
        <h3 id={titleId} className="text-lg font-semibold">
          {spec.title[locale]}
        </h3>
        <p className="text-muted">{spec.subtitle[locale]}</p>
      </div>
      <svg
        role="img"
        aria-label={spec.alt[locale]}
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full max-w-3xl text-ink"
      >
        {ticks.map((v) => (
          <g key={v}>
            <line
              x1={x(v)}
              x2={x(v)}
              y1={top}
              y2={top + bars.length * rowH}
              className="stroke-line-strong"
              strokeWidth={v === 0 ? 1.5 : 1}
            />
            <text
              x={x(v)}
              y={top + bars.length * rowH + 20}
              textAnchor={v === 0 ? "start" : v === axisMax ? "end" : "middle"}
              className="fill-muted text-[13px]"
            >
              {fmt(v)}
            </text>
          </g>
        ))}
        {bars.map((bar, i) => {
          const y = top + i * rowH;
          const w = Math.max(0, x(bar.value) - left);
          const inside = w > plot * 0.7;
          return (
            <g key={bar.label}>
              <text x={left} y={y + 13} className="fill-current text-[14px]">
                {bar.label}
              </text>
              <rect x={left} y={y + 18} width={w} height={18} className="fill-forest" />
              <text
                x={inside ? left + w - 6 : left + w + 6}
                y={y + 32}
                textAnchor={inside ? "end" : "start"}
                className={
                  inside
                    ? "fill-cream text-[13px] font-semibold"
                    : "fill-current text-[13px] font-semibold"
                }
              >
                {fmt(bar.value)}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="text-sm text-muted">{sourceLine}</figcaption>
    </figure>
  );
}
