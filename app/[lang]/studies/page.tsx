import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import NavList, { NavListItem } from "@/components/bds/NavList";

/**
 * `/studies`, the family index (REDESIGN-2.0 SS3.2, ROUTE-MAP-2.0 "Wave 5D").
 * "Study plan, course reviews, curriculum, academic issues, electives."
 *
 * LABELS. The card sort (DECISIONS-2.0.md, Decision 2) sent "drop a course
 * late in the term" and "pick electives" to Get help by default, and the
 * operator overrode both to Your studies. That override only holds if a
 * reader lands here and immediately recognises the entry they need, so
 * every entry below is named the way a student would say it, not the way
 * the handbook or the curriculum document says it: "Academic issues", not
 * "Registration and withdrawal procedures"; "Curriculum and electives", not
 * "Credit requirement schedule". The academic issues entry carries its own
 * topic list (dropping a course is the first one named) precisely because
 * that is the task the card sort showed a real student going looking for
 * somewhere else.
 */

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
  const t = getDictionary(locale).studiesIndex;
  return buildMetadata({ locale, title: t.title, description: t.lede, path: "/studies" });
}

export default async function StudiesIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.studiesIndex;

  return (
    <>
      <PageHeader
        title={t.title}
        lede={t.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.site.name, href: "/" }, { label: t.title }]}
          />
        }
        helpSlot={
          <Button href={localeHref(locale, "/help")} variant="ghost">
            {dict.actions.getHelp}
          </Button>
        }
      />
      <div className="wrap flex flex-col gap-10 py-10">
        <NavList>
          <NavListItem
            href={localeHref(locale, "/studies/study-plan")}
            title={t.entries.studyPlan.title}
            level={2}
          >
            {t.entries.studyPlan.description}
          </NavListItem>
          <NavListItem
            href={localeHref(locale, "/studies/course-reviews")}
            title={t.entries.courseReviews.title}
            level={2}
          >
            {t.entries.courseReviews.description}
          </NavListItem>
          <NavListItem
            href={localeHref(locale, "/studies/curriculum")}
            title={t.entries.curriculum.title}
            level={2}
            topics={{
              label: t.entries.curriculum.topicsLabel,
              items: t.entries.curriculum.topics,
            }}
          >
            {t.entries.curriculum.description}
          </NavListItem>
          <NavListItem
            href={localeHref(locale, "/studies/academic-issues")}
            title={t.entries.academicIssues.title}
            level={2}
            topics={{
              label: t.entries.academicIssues.topicsLabel,
              items: t.entries.academicIssues.topics,
            }}
          >
            {t.entries.academicIssues.description}
          </NavListItem>
          <NavListItem
            href={localeHref(locale, "/studies/handbook")}
            title={t.entries.handbook.title}
            level={2}
          >
            {t.entries.handbook.description}
          </NavListItem>
        </NavList>
      </div>
    </>
  );
}
