import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, formatDate, localeHref, locales, type Locale } from "@/lib/i18n";
import { getGuideEntries, guideTopics, isGuideTopic } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import NavList, { NavListItem } from "@/components/NavList";
import GridRow, { GridMain } from "@/components/GridRow";
import { studentLifeLabel, studentLifeTopics } from "@/content/student-life/topics";
import { audienceLabels } from "@/content/student-life/labels";

export function generateStaticParams() {
  return locales.flatMap((lang) => guideTopics.map((topic) => ({ lang, topic })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; topic: string }>;
}): Promise<Metadata> {
  const { lang, topic } = await params;
  if (!isLocale(lang) || !isGuideTopic(topic)) return {};
  const locale: Locale = lang;
  const t = studentLifeTopics[locale][topic];

  return buildMetadata({
    locale,
    title: t.title,
    description: t.lede,
    path: `/student-life/${topic}`,
  });
}

const copy: Record<Locale, { checked: string; includes: string }> = {
  en: { checked: "Last checked", includes: "Includes" },
  th: { checked: "ตรวจสอบล่าสุด", includes: "เนื้อหา" },
};

export default async function StudentLifeTopicPage({
  params,
}: {
  params: Promise<{ lang: string; topic: string }>;
}) {
  const { lang, topic } = await params;
  if (!isLocale(lang) || !isGuideTopic(topic)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];
  const topicCopy = studentLifeTopics[locale][topic];

  const entries = getGuideEntries(locale, topic).filter((entry) => !entry.frontmatter.placeholder);

  return (
    <>
      <PageHeader
        title={topicCopy.title}
        lede={topicCopy.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: studentLifeLabel[locale], href: "/student-life" },
              { label: topicCopy.title },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-10 py-10">
        <GridRow>
          <GridMain>
            <NavList>
              {entries.map((entry) => {
                const { frontmatter } = entry;
                const href = localeHref(locale, `/student-life/${topic}/${entry.slug}`);
                return (
                  // h2: these rows are the page's top-level sections, sitting
                  // directly under the h1 with no intervening heading, so the
                  // default h3 would skip a level.
                  <NavListItem
                    key={entry.slug}
                    href={href}
                    title={frontmatter.title}
                    as="h2"
                    meta={
                      frontmatter.audience !== "all"
                        ? audienceLabels[locale][frontmatter.audience]
                        : undefined
                    }
                    topics={
                      frontmatter.keyQuestions.length > 0
                        ? { label: t.includes, items: frontmatter.keyQuestions }
                        : undefined
                    }
                    footnote={`${t.checked} ${formatDate(locale, frontmatter.reviewed)}`}
                  >
                    {frontmatter.summary}
                  </NavListItem>
                );
              })}
            </NavList>
          </GridMain>
        </GridRow>
      </div>
    </>
  );
}
