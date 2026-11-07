import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrendSectionView from "@/components/open-data/TrendSectionView";
import { editions } from "@/content/open-data";
import { openDataCopy } from "@/content/open-data/copy";
import { trends, trendsIntro } from "@/content/open-data/trends";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = openDataCopy[lang];
  return buildMetadata({
    locale: lang,
    title: t.trendsTitle,
    description: t.trendsLede,
    path: "/open-data/trends",
  });
}

/**
 * Five years side by side. Each section is one comparison the records can
 * honestly support, with a figure, its table and a CSV. The first section is
 * what each year holds, so every later gap is explained before it is seen.
 */
export default async function OpenDataTrendsPage({ params }: { params: Params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = openDataCopy[locale];

  return (
    <>
      <PageHeader
        title={t.trendsTitle}
        lede={t.trendsLede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: t.title, href: "/open-data" },
              { label: t.trendsTitle },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-10 py-10">
        <div className="flex max-w-[var(--measure)] flex-col gap-3">
          {trendsIntro.map((p, i) => (
            <p key={i}>{p[locale]}</p>
          ))}
        </div>

        <nav aria-labelledby="on-this-page" className="max-w-[var(--measure)]">
          <h2 id="on-this-page" className="text-sm font-semibold text-muted">
            {t.onThisPage}
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-6">
            {trends.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.title[locale]}</a>
              </li>
            ))}
          </ol>
        </nav>

        {trends.map((section, i) => (
          <TrendSectionView key={section.id} section={section} index={i + 1} locale={locale} />
        ))}

        <nav aria-labelledby="each-year" className="border-t border-line pt-8">
          <h2 id="each-year" className="font-display text-xl">
            {t.editionsHeading}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {editions.map((edition) => (
              <li key={edition.slug}>
                <Link href={localeHref(locale, `/open-data/${edition.slug}`)}>
                  {t.editionTitle(edition.label[locale])}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
