import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import {
  cellText,
  isBilingual,
  moneyDecimals,
  shortYear,
  YEARS,
  type Column,
  type Dataset,
  type TrendChart,
} from "@/lib/open-data";

/*
 * Trend charts for the open data pages, drawn on the server as SVG and
 * HTML. They follow one set of rules: one hue, the year being talked about
 * in full colour and the rest quieter, axes from zero, every value labelled
 * so nobody has to read an axis, a missing year drawn as "no record" and
 * never as zero, and the hover layer (ChartHover) only repeating what is
 * already printed.
 */

const copy: Record<Locale, { noRecord: string; noRecordLong: string }> = {
  en: { noRecord: "No record", noRecordLong: "No record held for this year" },
  th: { noRecord: "ไม่มีข้อมูล", noRecordLong: "ไม่มีข้อมูลของปีนี้" },
};

function numericColumn(dataset: Dataset, key: string): Column {
  const column = dataset.columns.find((c) => c.key === key);
  if (!column) throw new Error(`No column ${key} in ${dataset.id}`);
  return column;
}

function formatter(dataset: Dataset, column: Column, locale: Locale) {
  const decimals =
    column.kind === "money"
      ? moneyDecimals(
          dataset.rows.map((r) => r[column.key]).filter((v): v is number => typeof v === "number")
        )
      : 0;
  return (v: number) => cellText(locale, column, v, decimals);
}

/** "฿35k", for the small multiples where a full figure would collide. */
function compact(column: Column, v: number): string {
  const prefix = column.kind === "money" ? "฿" : "";
  if (Math.abs(v) < 1000) return `${prefix}${v}`;
  const k = v / 1000;
  return `${prefix}${Number.isInteger(k) ? k : k.toFixed(1)}k`;
}

/** Gridline step giving 3 to 5 round intervals. */
function niceStep(max: number): number {
  if (max <= 0) return 1;
  const rough = max / 4;
  const power = 10 ** Math.floor(Math.log10(rough));
  for (const m of [1, 2, 2.5, 5, 10]) if (rough <= m * power) return m * power;
  return 10 * power;
}

/** A column with a 4px rounded data end and a square foot on the baseline. */
function columnPath(x: number, y: number, w: number, base: number): string {
  const h = base - y;
  const r = Math.min(4, h, w / 2);
  if (h <= 0) return "";
  return `M${x},${base}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${base}Z`;
}

type Point = { year: string; label: string; value: number | null };

function yearPoints(dataset: Dataset, valueKey: string, locale: Locale, rows = dataset.rows) {
  return rows.map((row): Point => ({
    year: shortYear(locale, row.year),
    label: isBilingual(row.year) ? row.year[locale] : String(row.year ?? ""),
    value: typeof row[valueKey] === "number" ? (row[valueKey] as number) : null,
  }));
}

/** Index of the year in focus: the latest one with a value. */
function emphasis(points: Point[]): number {
  for (let i = points.length - 1; i >= 0; i--) if (points[i]!.value !== null) return i;
  return -1;
}

function Columns({
  points,
  max,
  format,
  label,
  width,
  height,
  colW,
  gridlines,
  locale,
  titleId,
  descId,
}: {
  points: Point[];
  max: number;
  format: (v: number) => string;
  label: (v: number) => string;
  width: number;
  height: number;
  colW: number;
  gridlines: boolean;
  locale: Locale;
  titleId: string;
  descId?: string;
}) {
  const t = copy[locale];
  const step = niceStep(max);
  const axisMax = Math.max(step, Math.ceil(max / step) * step);
  const top = 26;
  const bottom = 30;
  const left = gridlines ? 52 : 0;
  const base = height - bottom;
  const plotH = base - top;
  const slot = (width - left) / points.length;
  const y = (v: number) => base - (v / axisMax) * plotH;
  const focus = emphasis(points);
  const ticks: number[] = [];
  if (gridlines) for (let v = step; v <= axisMax + step / 2; v += step) ticks.push(v);
  const small = !gridlines;

  return (
    <svg
      role="group"
      aria-labelledby={titleId}
      aria-describedby={descId}
      viewBox={`0 0 ${width} ${height}`}
      className={clsx("h-auto w-full overflow-visible text-ink", !small && "max-w-3xl")}
    >
      {ticks.map((v) => (
        <g key={v} aria-hidden="true">
          <line x1={left} x2={width} y1={y(v)} y2={y(v)} className="stroke-line" strokeWidth={1} />
          <text x={left - 8} y={y(v) + 4} textAnchor="end" className="fill-muted text-[12px]">
            {format(v)}
          </text>
        </g>
      ))}
      <line
        aria-hidden="true"
        x1={left}
        x2={width}
        y1={base}
        y2={base}
        className="stroke-line-strong"
        strokeWidth={1.5}
      />
      {points.map((p, i) => {
        const cx = left + slot * i + slot / 2;
        const x = cx - colW / 2;
        const on = i === focus;
        const tipValue = p.value === null ? t.noRecord : format(p.value);
        return (
          <g
            key={p.year}
            tabIndex={0}
            role="img"
            aria-label={`${p.label}, ${p.value === null ? t.noRecordLong : format(p.value)}`}
            data-tip-value={tipValue}
            data-tip-label={p.label}
            className="group outline-none"
          >
            <rect
              x={left + slot * i + 2}
              y={top - 22}
              width={slot - 4}
              height={plotH + 22}
              rx={4}
              className="fill-transparent group-hover:fill-sunken group-focus-visible:fill-sunken group-focus-visible:stroke-ink group-focus-visible:stroke-2"
            />
            {p.value === null ? (
              <>
                <circle
                  cx={cx}
                  cy={base - 6}
                  r={4}
                  className="fill-surface stroke-line-strong"
                  strokeWidth={2}
                />
                {small ? null : (
                  <text
                    x={cx}
                    y={base - 18}
                    textAnchor="middle"
                    className="fill-muted text-[12px] italic"
                  >
                    {t.noRecord}
                  </text>
                )}
              </>
            ) : (
              <>
                <path
                  d={columnPath(x, y(p.value), colW, base)}
                  className={on ? "fill-forest" : "fill-muted/35"}
                />
                <text
                  x={cx}
                  y={y(p.value) - 7}
                  textAnchor="middle"
                  className={clsx(
                    "fill-current tabular-nums",
                    small ? "text-[12px]" : "text-[13px]",
                    on && "font-semibold"
                  )}
                >
                  {label(p.value)}
                </text>
              </>
            )}
            <text
              x={cx}
              y={base + (small ? 16 : 20)}
              textAnchor="middle"
              className={clsx("fill-muted", small ? "text-[11px]" : "text-[13px]")}
            >
              {p.year}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** One column per year: the shape of a single measure over time. */
export function YearColumns({
  dataset,
  valueKey,
  locale,
  titleId,
  descId,
}: {
  dataset: Dataset;
  valueKey: string;
  locale: Locale;
  titleId: string;
  descId?: string;
}) {
  const column = numericColumn(dataset, valueKey);
  const format = formatter(dataset, column, locale);
  const points = yearPoints(dataset, valueKey, locale);
  const max = Math.max(0, ...points.map((p) => p.value ?? 0));
  return (
    <Columns
      points={points}
      max={max}
      format={format}
      label={format}
      width={640}
      height={280}
      colW={36}
      gridlines
      locale={locale}
      titleId={titleId}
      descId={descId}
    />
  );
}

/**
 * Small multiples: the same measure for several things (say, each recurring
 * event's planned budget), one panel each, all on one scale so panels can be
 * compared by eye. Years with no record show as a hollow dot.
 */
export function SmallMultiples({
  dataset,
  groupKey,
  valueKey,
  locale,
  titleId,
}: {
  dataset: Dataset;
  groupKey: string;
  valueKey: string;
  locale: Locale;
  titleId: string;
}) {
  const column = numericColumn(dataset, valueKey);
  const format = formatter(dataset, column, locale);
  const groups = new Map<string, Dataset["rows"]>();
  for (const row of dataset.rows) {
    const g = row[groupKey];
    const name = isBilingual(g) ? g[locale] : String(g ?? "");
    groups.set(name, [...(groups.get(name) ?? []), row]);
  }
  const max = Math.max(
    0,
    ...dataset.rows.map((r) => (typeof r[valueKey] === "number" ? (r[valueKey] as number) : 0))
  );

  return (
    <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...groups.entries()].map(([name, rows], i) => {
        // Every panel shows every year, so the panels line up.
        const byYear = YEARS.map((y) => {
          const row = rows.find((r) => isBilingual(r.year) && r.year.en === y.long.en);
          return row ?? { year: { ...y.long } };
        });
        const id = `${titleId}-panel-${i}`;
        return (
          <li key={name} className="flex flex-col gap-1">
            <h4 id={id} className="font-semibold">
              {name}
            </h4>
            <Columns
              points={yearPoints(dataset, valueKey, locale, byYear)}
              max={max}
              format={format}
              label={(v) => compact(column, v)}
              width={300}
              height={150}
              colW={22}
              gridlines={false}
              locale={locale}
              titleId={id}
            />
          </li>
        );
      })}
    </ul>
  );
}

const levelText: Record<Locale, Record<"full" | "partial" | "none", string>> = {
  en: { full: "Held", partial: "Partly held", none: "Not held" },
  th: { full: "มี", partial: "มีบางส่วน", none: "ไม่มี" },
};

function Dot({ level }: { level: "full" | "partial" | "none" }) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true" className="inline-block">
      {level === "full" ? <circle cx={8} cy={8} r={6.5} className="fill-forest" /> : null}
      {level === "partial" ? (
        <>
          <circle cx={8} cy={8} r={5.5} className="fill-surface stroke-forest" strokeWidth={2} />
          <path d="M8,2.5A5.5,5.5 0 0 0 8,13.5Z" className="fill-forest" />
        </>
      ) : null}
      {level === "none" ? (
        <circle cx={8} cy={8} r={4} className="fill-none stroke-line-strong" strokeWidth={1.5} />
      ) : null}
    </svg>
  );
}

/**
 * A grid of items against years, each cell a dot: full, half or empty. It is
 * a real table, so it reads correctly without the dots, and each dot carries
 * its state as text for screen readers.
 */
export function Matrix({
  dataset,
  legend,
  locale,
  caption,
}: {
  dataset: Dataset;
  legend: Extract<TrendChart, { kind: "matrix" }>["legend"];
  locale: Locale;
  caption: string;
}) {
  const [first, ...years] = dataset.columns;
  const levelOf = (v: unknown) =>
    legend.find((l) => isBilingual(v as never) && l.value.en === (v as { en: string }).en);

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted" aria-hidden="true">
        {legend.map((l) => (
          <li key={l.value.en} className="flex items-center gap-2">
            <Dot level={l.level} />
            {l.value[locale]}
          </li>
        ))}
      </ul>
      <div
        role="region"
        aria-label={caption}
        tabIndex={0}
        className="relative max-w-full overflow-x-auto rounded-md border border-line bg-surface focus-visible:outline-3 focus-visible:outline-offset-2"
      >
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-line bg-sunken">
              <th scope="col" className="px-3 py-2 text-left font-semibold">
                {first!.label[locale]}
              </th>
              {years.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className="px-2 py-2 text-center font-semibold whitespace-nowrap"
                >
                  {shortYear(locale, c.label)}
                  <span className="sr-only"> ({c.label[locale]})</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataset.rows.map((row, r) => (
              <tr key={r} className="border-b border-line last:border-b-0">
                <th scope="row" className="px-3 py-2 text-left font-normal">
                  {cellText(locale, first!, row[first!.key])}
                </th>
                {years.map((c) => {
                  const v = row[c.key];
                  const l = levelOf(v);
                  const text = isBilingual(v) ? v[locale] : "";
                  return (
                    <td key={c.key} className="px-2 py-2 text-center">
                      {l ? <Dot level={l.level} /> : null}
                      <span className="sr-only">{text || levelText[locale].none}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * A sparkline for a figure tile: a 2px line through the years that have a
 * value, broken where a year has none, ending in a ringed dot on the latest.
 */
export function Sparkline({ values }: { values: (number | null)[] }) {
  const width = 132;
  const height = 40;
  const pad = 5;
  const max = Math.max(1, ...values.map((v) => v ?? 0));
  const x = (i: number) => pad + (i * (width - pad * 2)) / Math.max(1, values.length - 1);
  const y = (v: number) => height - pad - (v / max) * (height - pad * 2);
  const runs: string[] = [];
  let run: string[] = [];
  values.forEach((v, i) => {
    if (v === null) {
      if (run.length > 1) runs.push(run.join(" "));
      run = [];
    } else run.push(`${x(i)},${y(v)}`);
  });
  if (run.length > 1) runs.push(run.join(" "));
  const last = emphasis(values.map((value) => ({ year: "", label: "", value })));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true">
      <line
        x1={pad}
        x2={width - pad}
        y1={height - pad}
        y2={height - pad}
        className="stroke-line"
        strokeWidth={1}
      />
      {runs.map((points) => (
        <polyline
          key={points}
          points={points}
          fill="none"
          className="stroke-muted/60"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
      {values.map((v, i) =>
        v === null ? (
          <circle
            key={i}
            cx={x(i)}
            cy={height - pad}
            r={2.5}
            className="fill-surface stroke-line-strong"
            strokeWidth={1.5}
          />
        ) : i === last ? (
          <circle
            key={i}
            cx={x(i)}
            cy={y(v)}
            r={4}
            className="fill-forest stroke-surface"
            strokeWidth={2}
          />
        ) : (
          <circle key={i} cx={x(i)} cy={y(v)} r={2.5} className="fill-muted/60" />
        )
      )}
    </svg>
  );
}
