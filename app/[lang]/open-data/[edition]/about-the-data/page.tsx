import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import { editions, getEdition } from "@/content/open-data";
import { openDataCopy } from "@/content/open-data/copy";
import { about } from "@/content/open-data/2025-26/about";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => editions.map((edition) => ({ lang, edition: edition.slug })));
}

type Params = Promise<{ lang: string; edition: string }>;

const contactLabel: Record<Locale, string> = { en: "Contact BIRSA", th: "ติดต่อ BIRSA" };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, edition: slug } = await params;
  const edition = getEdition(slug);
  if (!isLocale(lang) || !edition) return {};
  const t = openDataCopy[lang];
  return buildMetadata({
    locale: lang,
    title: t.aboutTitle,
    description: t.aboutSummary,
    path: `/open-data/${edition.slug}/about-the-data`,
  });
}

export default async function AboutTheDataPage({ params }: { params: Params }) {
  const { lang, edition: slug } = await params;
  const edition = getEdition(slug);
  if (!isLocale(lang) || !edition) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = openDataCopy[locale];

  return (
    <>
      <PageHeader
        title={t.aboutTitle}
        lede={t.aboutSummary}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: t.title, href: "/open-data" },
              { label: t.editionTitle(edition.label[locale]), href: `/open-data/${edition.slug}` },
              { label: t.aboutTitle },
            ]}
          />
        }
      />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-10 py-10">
        {about.map((section) => (
          <section key={section.id} aria-labelledby={section.id}>
            <h2 id={section.id} className="font-display text-2xl">
              {section.heading[locale]}
            </h2>
            {section.paragraphs?.map((p, i) => (
              <p key={i} className="mt-3">
                {p[locale]}
              </p>
            ))}
            {section.items?.length ? (
              <ul className="mt-3 list-disc space-y-2 pl-6">
                {section.items.map((item, i) => (
                  <li key={i}>{item[locale]}</li>
                ))}
              </ul>
            ) : null}
            {section.id === "contact" ? (
              <p className="mt-3">
                <Link href={localeHref(locale, "/contact")}>{contactLabel[locale]}</Link>
              </p>
            ) : null}
          </section>
        ))}
      </div>
    </>
  );
}
