import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import { editions } from "@/content/open-data";
import { openDataCopy } from "@/content/open-data/copy";
import { trends } from "@/content/open-data/trends";
import { Sparkline } from "@/components/open-data/TrendCharts";
import { cellText, isBilingual } from "@/lib/open-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = openDataCopy[lang];
  return buildMetadata({
    locale: lang,
    title: t.title,
    description: t.indexLede,
    path: "/open-data",
  });
}

export default async function OpenDataIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = openDataCopy[locale];

  // Figure tiles: each trend marked as a tile, its latest year with a value
  // as the figure, and every year as a sparkline.
  const tiles = trends
    .filter((section) => section.tile && section.chart.kind === "columns")
    .map((section) => {
      const key = (section.chart as { valueKey: string }).valueKey;
      const column = section.dataset.columns.find((c) => c.key === key)!;
      const values = section.dataset.rows.map((r) =>
        typeof r[key] === "number" ? (r[key] as number) : null
      );
      const last = values.findLastIndex((v) => v !== null);
      return {
        section,
        values,
        latest: values[last] ?? 0,
        latestYear: isBilingual(section.dataset.rows[last]?.year)
          ? (section.dataset.rows[last]!.year as { en: string; th: string })[locale]
          : "",
        format: (v: number) => cellText(locale, column, v),
      };
    })
    .slice(0, 4);

  return (
    <>
      <PageHeader
        title={t.title}
        lede={t.indexLede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.site.name, href: "/" }, { label: t.title }]}
          />
        }
      />
      <div className="wrap flex flex-col gap-12 py-10">
        <section aria-labelledby="five-years" className="flex flex-col gap-5">
          <div className="max-w-[var(--measure)]">
            <h2 id="five-years" className="font-display text-2xl">
              {t.trendsTitle}
            </h2>
            <p className="mt-2 text-muted">{t.trendsLede}</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tiles.map(({ section, values, latest, latestYear, format }) => (
              <li
                key={section.id}
                className="flex flex-col gap-2 rounded-md border border-line bg-surface p-5"
              >
                <span className="font-semibold">{section.tile!.label[locale]}</span>
                <span className="font-display text-3xl tabular-nums">{format(latest)}</span>
                <span className="text-sm text-muted">
                  {latestYear}
                  <br />
                  {section.tile!.context[locale]}
                </span>
                <span className="mt-auto pt-2">
                  <Sparkline values={values} />
                </span>
                <Link
                  href={localeHref(locale, `/open-data/trends#${section.id}`)}
                  className="text-sm"
                >
                  {section.title[locale]}
                </Link>
              </li>
            ))}
          </ul>
          <p>
            <Link href={localeHref(locale, "/open-data/trends")} className="font-semibold">
              {t.trendsLink}
            </Link>
          </p>
        </section>

        <section aria-labelledby="each-year" className="flex flex-col gap-4">
          <div className="max-w-[var(--measure)]">
            <h2 id="each-year" className="font-display text-2xl">
              {t.editionsHeading}
            </h2>
            <p className="mt-2 text-muted">{t.editionsLede}</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {editions.map((edition) => (
              <li key={edition.slug} className="rounded-md border border-line bg-surface p-6">
                <h3 className="font-display text-xl">
                  <Link href={localeHref(locale, `/open-data/${edition.slug}`)}>
                    {t.editionTitle(edition.label[locale])}
                  </Link>
                </h3>
                <p className="mt-2 text-muted">{edition.lede[locale]}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
