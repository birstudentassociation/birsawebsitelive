import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import TopicView from "@/components/open-data/TopicView";
import { editions, getEdition, getTopic } from "@/content/open-data";
import { openDataCopy } from "@/content/open-data/copy";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    editions.flatMap((edition) =>
      edition.topics.map((topic) => ({ lang, edition: edition.slug, topic: topic.slug }))
    )
  );
}

type Params = Promise<{ lang: string; edition: string; topic: string }>;

async function resolve(params: Params) {
  const { lang, edition: editionSlug, topic: topicSlug } = await params;
  if (!isLocale(lang)) return null;
  const edition = getEdition(editionSlug);
  const topic = edition ? getTopic(edition, topicSlug) : undefined;
  if (!edition || !topic) return null;
  return { locale: lang as Locale, edition, topic };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const r = await resolve(params);
  if (!r) return {};
  return buildMetadata({
    locale: r.locale,
    title: r.topic.title[r.locale],
    description: r.topic.summary[r.locale],
    path: `/open-data/${r.edition.slug}/${r.topic.slug}`,
  });
}

export default async function OpenDataTopicPage({ params }: { params: Params }) {
  const r = await resolve(params);
  if (!r) notFound();
  const { locale, edition, topic } = r;
  const dict = getDictionary(locale);
  const t = openDataCopy[locale];

  return (
    <>
      <PageHeader
        title={topic.title[locale]}
        lede={topic.summary[locale]}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: t.title, href: "/open-data" },
              { label: t.editionTitle(edition.label[locale]), href: `/open-data/${edition.slug}` },
              { label: topic.title[locale] },
            ]}
          />
        }
      />
      <TopicView edition={edition} topic={topic} locale={locale} />
    </>
  );
}
