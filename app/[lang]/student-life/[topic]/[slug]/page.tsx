import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, formatDate, localeHref, locales, type Locale } from "@/lib/i18n";
import { getGuideEntries, getGuideEntry, guideTopics, isGuideTopic } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Mdx } from "@/lib/mdx";
import { extractToc } from "@/lib/toc";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import ExternalLink from "@/components/ExternalLink";
import Tag from "@/components/Tag";
import { studentLifeLabel, studentLifeTopics } from "@/content/student-life/topics";
import { audienceLabels } from "@/content/student-life/labels";

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

const labels: Record<
  Locale,
  {
    updated: string;
    checked: string;
    owner: string;
    quickAnswers: string;
    readMore: string;
    onThisPage: string;
    related: string;
    sources: string;
    prevNextNav: string;
    previous: string;
    next: string;
    helpTitle: string;
    helpBody: string;
    helpCta: string;
    backTo: string;
  }
> = {
  en: {
    updated: "Updated",
    checked: "Last checked",
    owner: "Responsible office",
    quickAnswers: "Quick answers",
    readMore: "Details",
    onThisPage: "On this page",
    related: "Related guides",
    sources: "Sources",
    prevNextNav: "Previous and next guides",
    previous: "Previous",
    next: "Next",
    helpTitle: "Report a problem with this guide",
    helpBody:
      "Students write and update this guide. If something is wrong or out of date, tell BIRSA.",
    helpCta: "Tell BIRSA",
    backTo: "Back to",
  },
  th: {
    updated: "อัปเดตล่าสุด",
    checked: "ตรวจสอบล่าสุด",
    owner: "หน่วยงานที่รับผิดชอบ",
    quickAnswers: "คำตอบโดยย่อ",
    readMore: "รายละเอียด",
    onThisPage: "ในหน้านี้",
    related: "คู่มือที่เกี่ยวข้อง",
    sources: "แหล่งที่มา",
    prevNextNav: "คู่มือก่อนหน้าและถัดไป",
    previous: "ก่อนหน้า",
    next: "ถัดไป",
    helpTitle: "แจ้งปัญหาเกี่ยวกับคู่มือนี้",
    helpBody: "นักศึกษาเป็นผู้เขียนและดูแลคู่มือนี้ หากพบข้อมูลที่ผิดหรือล้าสมัย แจ้ง BIRSA ได้",
    helpCta: "แจ้ง BIRSA",
    backTo: "กลับไป",
  },
};

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

  const t = labels[locale];
  const topicLabel = studentLifeTopics[locale][topic].title;
  const topicHref = localeHref(locale, `/student-life/${topic}`);
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

  const toc = extractToc(entry.content);
  const showToc = toc.length >= 2;

  const reportHref = `${localeHref(locale, "/contact")}?about=${encodeURIComponent(
    localeHref(locale, guidePath)
  )}`;

  const tocList = (
    <ul className="flex flex-col gap-2 text-sm">
      {toc.map((item) => (
        <li key={item.id} className={item.level === 3 ? "ml-4" : undefined}>
          <a href={`#${item.id}`} className="text-brand-deep hover:text-brand-dark">
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <PageHeader
        title={frontmatter.title}
        lede={frontmatter.summary}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: studentLifeLabel[locale], href: "/student-life" },
              { label: topicLabel, href: `/student-life/${topic}` },
              { label: frontmatter.title },
            ]}
          />
        }
      />
      <div className="wrap py-10 lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-x-12">
        <div className="flex min-w-0 flex-col gap-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            {frontmatter.audience !== "all" ? (
              <Tag variant="brand">{audienceLabels[locale][frontmatter.audience]}</Tag>
            ) : null}
            {frontmatter.owner ? (
              <p>
                {t.owner} {frontmatter.owner}
              </p>
            ) : null}
            <p>
              {t.checked} {formatDate(locale, frontmatter.reviewed)}
            </p>
            <p>
              {t.updated} {formatDate(locale, frontmatter.updated)}
            </p>
          </div>

          {frontmatter.quickAnswers.length > 0 ? (
            <section
              aria-labelledby="quick-answers"
              className="rounded-lg border border-line bg-sunken p-5"
            >
              <h2 id="quick-answers" className="font-display text-lg">
                {t.quickAnswers}
              </h2>
              <dl className="mt-3 flex flex-col gap-4">
                {frontmatter.quickAnswers.map((item) => (
                  <div key={item.q}>
                    <dt className="font-semibold text-ink">{item.q}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-ink">
                      {item.a}
                      {item.anchor ? (
                        <>
                          {" "}
                          <a
                            href={`#${item.anchor}`}
                            className="font-semibold text-brand-deep underline hover:text-brand-dark"
                          >
                            {t.readMore}
                          </a>
                        </>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {showToc ? (
            <details className="rounded-lg border border-line bg-sunken p-5 lg:hidden print:hidden">
              <summary className="cursor-pointer text-sm font-semibold tracking-wide text-muted uppercase">
                {t.onThisPage}
              </summary>
              <nav aria-label={t.onThisPage} className="mt-3">
                {tocList}
              </nav>
            </details>
          ) : null}

          <Mdx source={entry.content} newTabLabel={dict.a11y.newTab} locale={locale} />

          {related.length > 0 ? (
            <section aria-labelledby="related-guides" className="print:hidden">
              <h2 id="related-guides" className="font-display text-xl">
                {t.related}
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {related.map(({ href, entry: rel }) => (
                  <li key={href}>
                    <Link
                      href={localeHref(locale, href)}
                      className="font-semibold text-brand-deep underline underline-offset-4 hover:text-brand-dark"
                    >
                      {rel.frontmatter.title}
                    </Link>
                    <span className="block text-sm text-muted">{rel.frontmatter.summary}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {frontmatter.sources.length > 0 ? (
            <section aria-labelledby="guide-sources" className="text-sm text-muted">
              <h2 id="guide-sources" className="font-semibold text-ink">
                {t.sources}
              </h2>
              <ul className="mt-2 flex flex-col gap-1">
                {frontmatter.sources.map((source) => (
                  <li key={source.href}>
                    <ExternalLink
                      href={source.href}
                      newTabLabel={dict.a11y.newTab}
                      className="text-brand-deep underline hover:text-brand-dark"
                    >
                      {source.label}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {prevEntry || nextEntry ? (
            <nav
              aria-label={t.prevNextNav}
              className="grid grid-cols-1 gap-4 border-t border-line pt-8 sm:grid-cols-2 print:hidden"
            >
              <div>
                {prevEntry ? (
                  <Link
                    href={localeHref(locale, `/student-life/${topic}/${prevEntry.slug}`)}
                    className="flex h-full flex-col gap-1 rounded-lg border border-line bg-surface p-4 hover:border-brand"
                  >
                    <span className="text-xs font-semibold tracking-wide text-muted uppercase">
                      &larr; {t.previous}
                    </span>
                    <span className="font-semibold text-ink">{prevEntry.frontmatter.title}</span>
                  </Link>
                ) : null}
              </div>
              <div>
                {nextEntry ? (
                  <Link
                    href={localeHref(locale, `/student-life/${topic}/${nextEntry.slug}`)}
                    className="flex h-full flex-col gap-1 rounded-lg border border-line bg-surface p-4 text-right hover:border-brand"
                  >
                    <span className="text-xs font-semibold tracking-wide text-muted uppercase">
                      {t.next} &rarr;
                    </span>
                    <span className="font-semibold text-ink">{nextEntry.frontmatter.title}</span>
                  </Link>
                ) : null}
              </div>
            </nav>
          ) : null}

          <div className="flex flex-col items-start gap-4 rounded-lg border border-line bg-sunken p-8 print:hidden">
            <h2 className="font-display text-xl">{t.helpTitle}</h2>
            <p className="max-w-[var(--measure)] text-muted">{t.helpBody}</p>
            <Button href={reportHref}>{t.helpCta}</Button>
          </div>

          <Link
            href={topicHref}
            className="text-sm font-semibold text-brand-deep hover:text-brand-dark print:hidden"
          >
            &larr; {t.backTo} {topicLabel}
          </Link>
        </div>

        {showToc ? (
          <aside className="hidden lg:block print:hidden">
            <nav
              aria-label={t.onThisPage}
              className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-lg border border-line bg-sunken p-5"
            >
              <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">
                {t.onThisPage}
              </h2>
              <div className="mt-3">{tocList}</div>
            </nav>
          </aside>
        ) : null}
      </div>
    </>
  );
}
