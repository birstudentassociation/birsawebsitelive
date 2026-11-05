import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import CalendarBuilder from "@/components/calendar-builder/CalendarBuilder";
import { calendarEvents } from "@/content/calendar/events";
import { currentAndUpcomingTerms, defaultTeachingTerm, termKeyOf } from "@/content/calendar/terms";
import { getCalendarBuilderCopy } from "@/content/calendar-builder";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import { todayInBangkok } from "@/lib/bangkok-today";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = getCalendarBuilderCopy(lang);
  return buildMetadata({
    locale: lang,
    title: copy.meta.title,
    description: copy.meta.description,
    path: "/services/calendar",
  });
}

/** Every course code in any curriculum version, once, for the class form's suggestions. */
function courseOptions() {
  const byCode = new Map<string, string>();
  for (const version of Object.values(CURRICULUM_VERSIONS)) {
    for (const course of version.courses.value) {
      if (!byCode.has(course.code)) byCode.set(course.code, course.title);
    }
  }
  return [...byCode]
    .map(([code, title]) => ({ code, title }))
    .sort((a, b) => a.code.localeCompare(b.code));
}

export default async function CalendarBuilderPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const copy = getCalendarBuilderCopy(locale);
  const todayKey = todayInBangkok();
  const terms = currentAndUpcomingTerms(todayKey).map((t) => ({
    key: termKeyOf(t),
    year: t.term.year,
    semester: t.term.semester,
    start: t.start,
    end: t.end,
  }));
  const defaultTerm = defaultTeachingTerm(todayKey);
  const servicesLabel = locale === "th" ? "ข้อมูลและบริการ" : "Information and services";

  return (
    <>
      <PageHeader
        title={copy.title}
        lede={copy.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: servicesLabel, href: "/services" },
              { label: copy.title },
            ]}
          />
        }
      />
      <CalendarBuilder
        locale={locale}
        copy={copy}
        events={calendarEvents}
        courses={courseOptions()}
        terms={terms}
        defaultTermKey={defaultTerm ? termKeyOf(defaultTerm) : ""}
        todayKey={todayKey}
        siteUrl={SITE_URL}
      />
    </>
  );
}
