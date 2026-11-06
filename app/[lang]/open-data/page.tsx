import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import { editions } from "@/content/open-data";
import { openDataCopy } from "@/content/open-data/copy";

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
      <div className="wrap py-10">
        <ul className="flex max-w-[var(--measure)] flex-col gap-4">
          {editions.map((edition) => (
            <li key={edition.slug} className="rounded-md border border-line bg-surface p-6">
              <h2 className="font-display text-xl">
                <Link href={localeHref(locale, `/open-data/${edition.slug}`)}>
                  {t.editionTitle(edition.label[locale])}
                </Link>
              </h2>
              <p className="mt-2 text-muted">{t.editionLede}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
