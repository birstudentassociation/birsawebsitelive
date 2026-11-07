import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeadlineFigures from "@/components/open-data/HeadlineFigures";
import { editions, getEdition } from "@/content/open-data";
import { openDataCopy } from "@/content/open-data/copy";
import type { Headline } from "@/lib/open-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => editions.map((edition) => ({ lang, edition: edition.slug })));
}

type Params = Promise<{ lang: string; edition: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, edition: slug } = await params;
  const edition = getEdition(slug);
  if (!isLocale(lang) || !edition) return {};
  const t = openDataCopy[lang];
  return buildMetadata({
    locale: lang,
    title: t.editionTitle(edition.label[lang]),
    description: edition.lede[lang],
    path: `/open-data/${edition.slug}`,
  });
}

/**
 * The edition landing page, after the ONS headline release: headline
 * figures, then the main points, then a card per topic. Figures and points
 * are drawn from the topics themselves (each topic's first headline and first
 * main point), so this page can never disagree with the pages it links to.
 */
export default async function OpenDataEditionPage({ params }: { params: Params }) {
  const { lang, edition: slug } = await params;
  const edition = getEdition(slug);
  if (!isLocale(lang) || !edition) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = openDataCopy[locale];
  const title = t.editionTitle(edition.label[locale]);

  const headlines = edition.topics
    .map((topic) => topic.headlines?.[0])
    .filter((h): h is Headline => Boolean(h))
    .slice(0, 4);
  const mainPoints = edition.topics
    .map((topic) => topic.mainPoints[0])
    .filter(Boolean)
    .slice(0, 6);

  return (
    <>
      <PageHeader
        title={title}
        lede={edition.lede[locale]}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: t.title, href: "/open-data" },
              { label: title },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-12 py-10">
        <p className="text-sm text-muted">
          {t.published} {formatDate(locale, edition.published)}. {t.status}
        </p>

        {headlines.length ? <HeadlineFigures headlines={headlines} locale={locale} /> : null}

        {mainPoints.length ? (
          <section aria-labelledby="main-points" className="max-w-[var(--measure)]">
            <h2 id="main-points" className="font-display text-2xl">
              {t.mainPoints}
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              {mainPoints.map((point, i) => (
                <li key={i}>{point![locale]}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="topics">
          <h2 id="topics" className="font-display text-2xl">
            {t.topics}
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {edition.topics.map((topic) => (
              <li key={topic.slug} className="rounded-md border border-line bg-surface p-6">
                <h3 className="text-lg font-semibold">
                  <Link href={localeHref(locale, `/open-data/${edition.slug}/${topic.slug}`)}>
                    {topic.title[locale]}
                  </Link>
                </h3>
                <p className="mt-2 text-muted">{topic.summary[locale]}</p>
              </li>
            ))}
            <li className="rounded-md border border-line bg-sunken p-6">
              <h3 className="text-lg font-semibold">
                <Link href={localeHref(locale, `/open-data/${edition.slug}/about-the-data`)}>
                  {t.aboutTitle}
                </Link>
              </h3>
              <p className="mt-2 text-muted">{t.aboutSummary}</p>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
