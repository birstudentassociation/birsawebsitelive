import DataTable from "@/components/open-data/DataTable";
import ChartHover from "@/components/open-data/ChartHover";
import { Matrix, SmallMultiples, YearColumns } from "@/components/open-data/TrendCharts";
import { localeHref, type Locale } from "@/lib/i18n";
import { csvSizeLabel, trendCsvPath, type TrendSection } from "@/lib/open-data";

const copy: Record<
  Locale,
  {
    figure: string;
    table: string;
    showTable: string;
    notes: string;
    note: string;
    download: (title: string) => string;
    source: (s: string) => string;
  }
> = {
  en: {
    figure: "Figure",
    table: "Table",
    showTable: "Show the figures as a table",
    notes: "Notes",
    note: "note",
    download: (title) => `Download ${title.charAt(0).toLowerCase()}${title.slice(1)}`,
    source: (s) => `Source, ${s}`,
  },
  th: {
    figure: "แผนภูมิที่",
    table: "ตารางที่",
    showTable: "แสดงตัวเลขเป็นตาราง",
    notes: "หมายเหตุ",
    note: "หมายเหตุ",
    download: (title) => `ดาวน์โหลด${title}`,
    source: (s) => `ที่มา ${s}`,
  },
};

/**
 * One trend: the question, the key fact, a few main points, one figure that
 * shows the shape across the years, then the same figures as a table and a
 * CSV. A matrix is already a table, so it is not repeated.
 */
export default function TrendSectionView({
  section,
  index,
  locale,
}: {
  section: TrendSection;
  /** 1-based, for "Figure 1" and "Table 1". */
  index: number;
  locale: Locale;
}) {
  const t = copy[locale];
  const { chart, dataset } = section;
  const titleId = `${section.id}-chart-title`;
  const descId = `${section.id}-chart-desc`;
  const caption = `${t.figure} ${index}, ${chart.title[locale]}`;

  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      className="flex scroll-mt-6 flex-col gap-6 border-t border-line pt-10"
    >
      <div className="max-w-[var(--measure)]">
        <h2 id={`${section.id}-heading`} className="font-display text-2xl">
          {section.title[locale]}
        </h2>
        <p className="mt-2 text-lg">{section.summary[locale]}</p>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          {section.mainPoints.map((p, i) => (
            <li key={i}>{p[locale]}</li>
          ))}
        </ul>
      </div>

      <figure className="flex flex-col gap-4 rounded-md border border-line bg-surface p-4 sm:p-6">
        <div>
          <p className="text-sm text-muted">
            {t.figure} {index}
          </p>
          <h3 id={titleId} className="text-lg font-semibold">
            {chart.title[locale]}
          </h3>
          <p className="text-muted">{chart.subtitle[locale]}</p>
          <p id={descId} className="sr-only">
            {chart.alt[locale]}
          </p>
        </div>
        {chart.kind === "columns" ? (
          <ChartHover>
            <YearColumns
              dataset={dataset}
              valueKey={chart.valueKey}
              locale={locale}
              titleId={titleId}
              descId={descId}
            />
          </ChartHover>
        ) : null}
        {chart.kind === "multiples" ? (
          <ChartHover>
            <SmallMultiples
              dataset={dataset}
              groupKey={chart.groupKey}
              valueKey={chart.valueKey}
              locale={locale}
              titleId={titleId}
            />
          </ChartHover>
        ) : null}
        {chart.kind === "matrix" ? (
          <Matrix dataset={dataset} legend={chart.legend} locale={locale} caption={caption} />
        ) : null}
        <figcaption className="text-sm text-muted">{t.source(dataset.source[locale])}</figcaption>
      </figure>

      {chart.kind !== "matrix" ? (
        <details className="rounded-md border border-line bg-surface px-4 py-3">
          <summary className="cursor-pointer font-semibold">{t.showTable}</summary>
          <div className="mt-3">
            <DataTable dataset={dataset} locale={locale} figureLabel={`${t.table} ${index}`} />
          </div>
        </details>
      ) : null}

      {dataset.notes?.length ? (
        <div className="max-w-[var(--measure)] text-sm">
          <h3 className="font-semibold">{t.notes}</h3>
          <ol className="mt-1 space-y-1">
            {dataset.notes.map((note, n) => (
              <li key={n}>
                [{t.note} {n + 1}] {note[locale]}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <p>
        <a href={localeHref(locale, trendCsvPath(section.id))} download className="font-semibold">
          {t.download(dataset.title[locale])}
        </a>{" "}
        <span className="text-sm text-muted">(CSV, {csvSizeLabel(dataset, locale)})</span>
      </p>
    </section>
  );
}
