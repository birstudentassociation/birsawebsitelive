import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { getGuideEntries, getGuideEntry, guideTopics, isGuideTopic } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import GuideArticle from "@/components/guide/GuideArticle";
import { studentLifeLabel, studentLifeTopics } from "@/content/student-life/topics";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    guideTopics.flatMap((topic) =>
      getGuideEntries(lang, topic).map((entry) => ({ lang, topic, slug: entry.slug }))
    )
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; topic: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, topic, slug } = await params;
  if (!isLocale(lang) || !isGuideTopic(topic)) return {};
  const locale: Locale = lang;
  const entry = getGuideEntry(locale, topic, slug);
  if (!entry) return {};

  return buildMetadata({
    locale,
    title: entry.frontmatter.title,
    description: entry.frontmatter.metaDescription ?? entry.frontmatter.summary,
    path: `/student-life/${topic}/${slug}`,
  });
}

export default async function StudentLifeGuidePage({
  params,
}: {
  params: Promise<{ lang: string; topic: string; slug: string }>;
}) {
  const { lang, topic, slug } = await params;
  if (!isLocale(lang) || !isGuideTopic(topic)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const entry = getGuideEntry(locale, topic, slug);
  if (!entry) notFound();
  const { frontmatter } = entry;

  const topicLabel = studentLifeTopics[locale][topic].title;
  const guidePath = `/student-life/${topic}/${slug}`;

  const siblings = getGuideEntries(locale, topic).filter((e) => !e.frontmatter.placeholder);
  const currentIndex = siblings.findIndex((e) => e.slug === slug);
  const prevEntry = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const nextEntry =
    currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

  const related = frontmatter.related.flatMap((ref) => {
    const [relTopic, relSlug] = ref.split("/");
    if (!relTopic || !relSlug || !isGuideTopic(relTopic)) return [];
    const relEntry = getGuideEntry(locale, relTopic, relSlug);
    return relEntry ? [{ href: `/student-life/${relTopic}/${relSlug}`, entry: relEntry }] : [];
  });

  return (
    <GuideArticle
      locale={locale}
      entry={entry}
      guidePath={guidePath}
      breadcrumbs={[
        { label: dict.site.name, href: "/" },
        { label: studentLifeLabel[locale], href: "/student-life" },
        { label: topicLabel, href: `/student-life/${topic}` },
        { label: frontmatter.title },
      ]}
      related={related.map(({ href, entry: rel }) => ({
        href,
        title: rel.frontmatter.title,
        summary: rel.frontmatter.summary,
      }))}
      prev={
        prevEntry
          ? {
              href: `/student-life/${topic}/${prevEntry.slug}`,
              title: prevEntry.frontmatter.title,
            }
          : null
      }
      next={
        nextEntry
          ? {
              href: `/student-life/${topic}/${nextEntry.slug}`,
              title: nextEntry.frontmatter.title,
            }
          : null
      }
      back={{ href: `/student-life/${topic}`, label: topicLabel }}
    />
  );
}
