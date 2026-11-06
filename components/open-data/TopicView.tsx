import Link from "next/link";
import WarningText from "@/components/WarningText";
import DataTable from "@/components/open-data/DataTable";
import BarChart from "@/components/open-data/BarChart";
import HeadlineFigures from "@/components/open-data/HeadlineFigures";
import { localeHref, type Locale } from "@/lib/i18n";
import { csvPath, csvSizeLabel, type Edition, type Topic } from "@/lib/open-data";

const copy: Record<
  Locale,
  {
    mainPoints: string;
    data: string;
    figure: string;
    table: string;
    notes: string;
    download: (title: string) => string;
    csv: string;
    about: string;
    source: string;
    period: string;
    status: string;
    final: string;
    sourceLine: (s: string) => string;
    moreTopics: string;
    aboutData: string;
  }
> = {
  en: {
    mainPoints: "Main points",
    data: "The data",
    figure: "Figure",
    table: "Table",
    notes: "Notes",
    download: (title) => `Download ${title.charAt(0).toLowerCase()}${title.slice(1)}`,
    csv: "CSV",
    about: "About this data",
    source: "Source",
    period: "Period covered",
    status: "Status",
    final: "Final. This data will not be updated.",
    sourceLine: (s) => `Source, ${s}`,
    moreTopics: "More from BIRSA in numbers",
    aboutData: "About the data, sources and gaps",
  },
  th: {
    mainPoints: "ประเด็นสำคัญ",
    data: "ข้อมูล",
    figure: "แผนภูมิที่",
    table: "ตารางที่",
    notes: "หมายเหตุ",
    download: (title) => `ดาวน์โหลด${title}`,
    csv: "CSV",
    about: "เกี่ยวกับข้อมูลนี้",
    source: "แหล่งที่มา",
    period: "ช่วงเวลา",
    status: "สถานะ",
    final: "ข้อมูลฉบับสุดท้าย จะไม่มีการแก้ไขอีก",
    sourceLine: (s) => `ที่มา ${s}`,
    moreTopics: "หัวข้ออื่นใน BIRSA ในตัวเลข",
    aboutData: "เกี่ยวกับข้อมูล แหล่งที่มา และส่วนที่ไม่มี",
  },
};

/**
 * The body of every open data topic page, in a fixed order so each page reads
 * the same way: headline figures, the one caveat, main points, one chart,
 * then each dataset as a table with its notes, download and metadata.
 */
export default function TopicView({
  edition,
  topic,
  locale,
}: {
  edition: Edition;
  topic: Topic;
  locale: Locale;
}) {
  const t = copy[locale];
  const chartDataset = topic.chart
    ? topic.datasets.find((d) => d.id === topic.chart!.datasetId)
    : undefined;
  const others = edition.topics.filter((x) => x.slug !== topic.slug);

  return (
    <div className="wrap flex flex-col gap-12 py-10">
      {topic.headlines?.length ? (
        <HeadlineFigures headlines={topic.headlines} locale={locale} />
      ) : null}

      {topic.warning ? (
        <WarningText locale={locale} className="max-w-[var(--measure)]">
          {topic.warning[locale]}
        </WarningText>
      ) : null}

      <section aria-labelledby="main-points" className="max-w-[var(--measure)]">
        <h2 id="main-points" className="font-display text-2xl">
          {t.mainPoints}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          {topic.mainPoints.map((point, i) => (
            <li key={i}>{point[locale]}</li>
          ))}
        </ul>
      </section>

      {topic.chart && chartDataset ? (
        <BarChart
          spec={topic.chart}
          dataset={chartDataset}
          locale={locale}
          figureLabel={`${t.figure} 1`}
          sourceLine={t.sourceLine(chartDataset.source[locale])}
        />
      ) : null}

      <section aria-labelledby="the-data" className="flex flex-col gap-12">
        <h2 id="the-data" className="font-display text-2xl">
          {t.data}
        </h2>
        {topic.datasets.map((dataset, i) => {
          const label = `${t.table} ${i + 1}`;
          const href = localeHref(locale, csvPath(edition.slug, topic.slug, dataset.id));
          return (
            <section
              key={dataset.id}
              id={dataset.id}
              aria-label={dataset.title[locale]}
              className="flex flex-col gap-4"
            >
              <p className="max-w-[var(--measure)] text-muted">{dataset.summary[locale]}</p>
              <DataTable dataset={dataset} locale={locale} figureLabel={label} />

              {dataset.notes?.length ? (
                <div className="max-w-[var(--measure)] text-sm">
                  <h3 className="font-semibold">{t.notes}</h3>
                  <ol className="mt-1 space-y-1">
                    {dataset.notes.map((note, n) => (
                      <li key={n}>
                        [{locale === "th" ? "หมายเหตุ" : "note"} {n + 1}] {note[locale]}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}

              <p>
                <a href={href} download className="font-semibold">
                  {t.download(dataset.title[locale])}
                </a>{" "}
                <span className="text-sm text-muted">
                  ({t.csv}, {csvSizeLabel(dataset, locale)})
                </span>
              </p>

              <details className="max-w-[var(--measure)] rounded-md border border-line bg-surface px-4 py-3">
                <summary className="cursor-pointer font-semibold">{t.about}</summary>
                <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[max-content_1fr]">
                  <dt className="font-semibold">{t.source}</dt>
                  <dd>{dataset.source[locale]}</dd>
                  <dt className="font-semibold">{t.period}</dt>
                  <dd>{dataset.period[locale]}</dd>
                  <dt className="font-semibold">{t.status}</dt>
                  <dd>{t.final}</dd>
                </dl>
              </details>
            </section>
          );
        })}
      </section>

      <nav aria-labelledby="more-topics" className="border-t border-line pt-8">
        <h2 id="more-topics" className="font-display text-xl">
          {t.moreTopics}
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {others.map((other) => (
            <li key={other.slug}>
              <Link href={localeHref(locale, `/open-data/${edition.slug}/${other.slug}`)}>
                {other.title[locale]}
              </Link>
            </li>
          ))}
          <li>
            <Link href={localeHref(locale, `/open-data/${edition.slug}/about-the-data`)}>
              {t.aboutData}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
