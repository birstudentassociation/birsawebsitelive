import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { informationTopics } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import NavList, { NavListItem } from "@/components/NavList";
import {
  informationLabel,
  informationLede,
  informationTopicCopy,
} from "@/content/information/topics";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  return buildMetadata({
    locale,
    title: informationLabel[locale],
    description: informationLede[locale],
    path: "/information",
  });
}

export default async function InformationPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const title = informationLabel[locale];

  return (
    <>
      <PageHeader
        title={title}
        lede={informationLede[locale]}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.site.name, href: "/" }, { label: title }]}
          />
        }
      />
      <div className="wrap py-10">
        <NavList>
          {informationTopics.map((topic) => (
            <NavListItem
              key={topic}
              href={localeHref(locale, `/information/${topic}`)}
              title={informationTopicCopy[locale][topic].title}
              as="h2"
            >
              {informationTopicCopy[locale][topic].lede}
            </NavListItem>
          ))}
        </NavList>
      </div>
    </>
  );
}
