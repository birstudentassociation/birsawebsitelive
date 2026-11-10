import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import ComingUp from "@/components/home/ComingUp";
import { DueSoonRow } from "@/components/home/DueSoon";
import { calendarEvents } from "@/content/calendar/events";
import { homeEn } from "@/content/home/en";
import { homeTh } from "@/content/home/th";
import { todayInBangkok } from "@/lib/bangkok-today";
import { getDueSoon } from "@/lib/home/due-soon";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

const copy = {
  en: {
    title: "Dates for BIR students",
    lede: "Registration, withdrawal, exam and event dates for this academic year, soonest first.",
    upcomingHeading: "Upcoming dates",
    calendarHeading: "Events and activities",
    empty: "No dates are recorded yet. New dates appear here when they are announced.",
  },
  th: {
    title: "วันสำคัญสำหรับนักศึกษา BIR",
    lede: "วันลงทะเบียน ถอนรายวิชา สอบ และกิจกรรมของปีการศึกษานี้ เรียงจากวันที่ใกล้ที่สุด",
    upcomingHeading: "กำหนดการที่กำลังจะมาถึง",
    calendarHeading: "กิจกรรมและงานต่างๆ",
    empty: "ยังไม่มีวันที่บันทึกไว้ เมื่อมีการประกาศวันใหม่ จะแสดงที่นี่",
  },
};

const comingUpLabels = { en: homeEn.comingUp.labels, th: homeTh.comingUp.labels };

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
  return buildMetadata({
    locale: lang,
    title: copy[lang].title,
    description: copy[lang].lede,
    path: "/dates",
  });
}

export default async function DatesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const text = copy[locale];
  const todayKey = todayInBangkok();
  const items = getDueSoon(todayKey, locale, { limit: 100, windowDays: 400 });

  return (
    <>
      <PageHeader
        title={text.title}
        lede={text.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.site.name, href: "/" }, { label: text.title }]}
          />
        }
      />
      <div className="wrap flex flex-col gap-12 py-10">
        <section aria-labelledby="upcoming-dates-heading">
          <h2 id="upcoming-dates-heading" className="mb-4 font-display text-2xl">
            {text.upcomingHeading}
          </h2>
          {items.length > 0 ? (
            <ol className="divide-y divide-line rounded-2xl border border-line bg-surface p-4 sm:p-5">
              {items.map((item) => (
                <DueSoonRow key={item.id} item={item} locale={locale} />
              ))}
            </ol>
          ) : (
            <p className="text-muted">{text.empty}</p>
          )}
        </section>
        <section aria-labelledby="calendar-heading">
          <h2 id="calendar-heading" className="mb-4 font-display text-2xl">
            {text.calendarHeading}
          </h2>
          <ComingUp
            events={calendarEvents}
            locale={locale}
            todayKey={todayKey}
            labels={comingUpLabels[locale]}
            limit={10}
          />
        </section>
      </div>
    </>
  );
}
