import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { getInformationGuideEntries, getInformationGuideEntry } from "@/lib/content";
import { resolveRelatedPath } from "@/lib/guide-related";
import { buildMetadata } from "@/lib/seo";
import GuideArticle from "@/components/guide/GuideArticle";
import { informationTopicCopy } from "@/content/information/topics";

const TOPIC = "applying-to-bir";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getInformationGuideEntries(lang, TOPIC).map((entry) => ({ lang, slug: entry.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const entry = getInformationGuideEntry(locale, TOPIC, slug);
  if (!entry) return {};

  return buildMetadata({
    locale,
    title: entry.frontmatter.title,
    description: entry.frontmatter.metaDescription ?? entry.frontmatter.summary,
    path: `/services/${TOPIC}/${slug}`,
  });
}

export default async function InformationGuidePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const entry = getInformationGuideEntry(locale, TOPIC, slug);
  if (!entry) notFound();
  const { frontmatter } = entry;

  const infoServicesLabel = dict.nav.find((n) => n.href === "/services")!.label;
  const topicLabel = informationTopicCopy[locale][TOPIC].title;
  const siblings = getInformationGuideEntries(locale, TOPIC).filter(
    (e) => !e.frontmatter.placeholder
  );
  const currentIndex = siblings.findIndex((e) => e.slug === slug);
  const prevEntry = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const nextEntry =
    currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

  const related = frontmatter.related.flatMap((ref) => {
    const link = resolveRelatedPath(locale, ref);
    return link ? [link] : [];
  });

  return (
    <GuideArticle
      locale={locale}
      entry={entry}
      guidePath={`/services/${TOPIC}/${slug}`}
      breadcrumbs={[
        { label: dict.site.name, href: "/" },
        { label: infoServicesLabel, href: "/services" },
        { label: topicLabel, href: `/services/${TOPIC}` },
        { label: frontmatter.title },
      ]}
      related={related}
      prev={
        prevEntry
          ? { href: `/services/${TOPIC}/${prevEntry.slug}`, title: prevEntry.frontmatter.title }
          : null
      }
      next={
        nextEntry
          ? { href: `/services/${TOPIC}/${nextEntry.slug}`, title: nextEntry.frontmatter.title }
          : null
      }
      back={{ href: `/services/${TOPIC}`, label: topicLabel }}
    />
  );
}
