import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { getGuideEntries, guideTopics } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import NavList, { NavListItem } from "@/components/NavList";
import SearchBox from "@/components/search/SearchBox";
import {
  studentLifeCommonQuestions,
  studentLifeLabel,
  studentLifeTopics,
} from "@/content/student-life/topics";
import { onboardingUiCopy } from "@/content/onboarding";

// Index of the student-life section: search, the most common questions,
// the two non-guide destinations (getting started, course reviews) and the
// nine guide topics. The literal `course-reviews` and `getting-started`
// segments win over the dynamic `[topic]` segment.

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const copy: Record<
  Locale,
  {
    lede: string;
    searchPlaceholder: string;
    questionsHeading: string;
    topicsHeading: string;
  }
> = {
  en: {
    lede: "Guides to studying, living and getting around at BIR, and course reviews written by students.",
    searchPlaceholder: "Search for visa, GPA, shuttle or doctor",
    questionsHeading: "Common questions",
    topicsHeading: "Guides by topic",
  },
  th: {
    lede: "คู่มือการเรียน การใช้ชีวิต และการเดินทางที่ BIR พร้อมรีวิวรายวิชาจากนักศึกษา",
    searchPlaceholder: "ค้นหา เช่น วีซ่า เกรด รถเวียน โรงพยาบาล",
    questionsHeading: "คำถามที่พบบ่อย",
    topicsHeading: "คู่มือตามหัวข้อ",
  },
};

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
    title: studentLifeLabel[locale],
    description: copy[locale].lede,
    path: "/student-life",
  });
}

export default async function StudentLifePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];
  const title = studentLifeLabel[locale];
  const topics = studentLifeTopics[locale];
  const courseReview = dict.courseReview;
  const gettingStarted = onboardingUiCopy[locale].chooser;

  return (
    <>
      <PageHeader
        title={title}
        lede={t.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.site.name, href: "/" }, { label: title }]}
          />
        }
      />
      <div className="wrap flex flex-col gap-12 py-10">
        <div className="max-w-[var(--measure)]">
          <SearchBox
            locale={locale}
            labelText={dict.actions.searchPlaceholder}
            placeholder={t.searchPlaceholder}
            submitLabel={dict.actions.search}
            action={localeHref(locale, "/search")}
            id="student-life-q"
          />
        </div>

        <section aria-labelledby="common-questions" className="max-w-[var(--measure)]">
          <h2 id="common-questions" className="font-display text-2xl">
            {t.questionsHeading}
          </h2>
          <ul className="mt-4 flex flex-col gap-2">
            {studentLifeCommonQuestions[locale].map((item) => (
              <li key={item.href}>
                <Link
                  href={localeHref(locale, item.href)}
                  className="text-brand-deep underline decoration-1 underline-offset-4 hover:decoration-[3px]"
                >
                  {item.q}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <NavList>
          <NavListItem
            href={localeHref(locale, "/student-life/getting-started")}
            title={gettingStarted.title}
            as="h2"
          >
            {gettingStarted.lede}
          </NavListItem>
          <NavListItem
            href={localeHref(locale, "/student-life/course-reviews")}
            title={courseReview.title}
            as="h2"
          >
            {courseReview.lede}
          </NavListItem>
        </NavList>

        <section aria-labelledby="topics-heading" className="flex flex-col gap-6">
          <h2 id="topics-heading" className="font-display text-2xl">
            {t.topicsHeading}
          </h2>
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
            {guideTopics.map((topic) => {
              const topicCopy = topics[topic];
              const guides = getGuideEntries(locale, topic).filter(
                (entry) => !entry.frontmatter.placeholder
              );
              return (
                <section
                  key={topic}
                  aria-labelledby={`topic-${topic}`}
                  className="border-t border-line pt-4"
                >
                  <h3 id={`topic-${topic}`} className="font-display text-lg leading-snug">
                    <Link
                      href={localeHref(locale, `/student-life/${topic}`)}
                      className="text-brand-deep underline decoration-1 underline-offset-4 hover:decoration-[3px]"
                    >
                      {topicCopy.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-muted">{topicCopy.lede}</p>
                  <ul className="mt-3 flex flex-col gap-1.5 text-sm">
                    {guides.map((entry) => (
                      <li key={entry.slug}>
                        <Link
                          href={localeHref(locale, `/student-life/${topic}/${entry.slug}`)}
                          className="text-brand-deep hover:text-brand-dark"
                        >
                          {entry.frontmatter.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
