import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";
import { todayInBangkok } from "@/lib/bangkok-today";
import { calendarEvents } from "@/content/calendar/events";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import { Heading } from "@/components/bds/Type";
import EventCalendar from "@/components/home/EventCalendar";
import UpcomingEventsTable from "@/components/whatson/UpcomingEventsTable";

/**
 * `/whats-on/calendar` (Wave 5, REDESIGN-2.0 SS3.2).
 *
 * Reuses `components/home/EventCalendar.tsx` unchanged (frozen for this
 * wave, per the brief): its keyboard operation and accessible day names are
 * correct today, so this page passes it the same `EventCalendarLabels`
 * shape it already defines rather than rebuilding it.
 *
 * `EventCalendar` is a client component whose month grid still server
 * renders with JavaScript off, per its own header, but the month navigation
 * and day selection do not respond without a script. So this page also
 * always renders `UpcomingEventsTable` (Wave 5, `components/whatson/`)
 * underneath: a plain, always-visible `<table>` of every dated item, so a
 * reader with JavaScript off, or on a slow connection before the script has
 * loaded, still has a complete, working way to see every date on the
 * calendar. It is not hidden behind a "if no JS" branch; both are always in
 * the page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return buildMetadata({
    locale: lang,
    title: `${dict.whatson.calendar.title}: ${dict.site.name}`,
    description: dict.whatson.calendar.lede,
    path: "/whats-on/calendar",
  });
}

export default async function WhatsOnCalendarPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.whatson.calendar;

  const icsUrl = `${SITE_URL}${localeHref(locale, "/calendar.ics")}`;

  return (
    <>
      <PageHeader
        title={t.title}
        lede={t.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: dict.whatson.hub.title, href: "/whats-on" },
              { label: t.title },
            ]}
          />
        }
        helpSlot={
          <Button href={localeHref(locale, "/contact")} variant="ghost">
            {dict.actions.contactUs}
          </Button>
        }
      />
      <div className="wrap flex flex-col gap-10 py-10">
        {/* `data-frozen-calendar` marks the boundary of `components/home/EventCalendar.tsx`,
            which this wave reuses unchanged rather than edits: it is how
            `tests/unit/whatson-routes.test.tsx`'s D7 sweep excludes that
            component's own (frozen, unowned) markup from this wave's
            "no raw Tailwind type utility" assertion, which applies only to
            what this wave built. */}
        <div data-frozen-calendar>
          <EventCalendar
            events={calendarEvents}
            locale={locale}
            todayKey={todayInBangkok()}
            labels={{
              prevMonth: t.prevMonth,
              nextMonth: t.nextMonth,
              selectedFor: t.selectedFor,
              noEventsDay: t.noEventsDay,
              open: t.open,
              eventCount: t.eventCount,
              legend: t.legend,
              styleLegend: t.styleLegend,
              subscribe: t.subscribe,
            }}
            icsUrl={icsUrl}
          />
        </div>

        <div className="flex flex-col gap-4 border-t border-line pt-8">
          <Heading level={2} step="heading-2">
            {t.upcoming.heading}
          </Heading>
          <UpcomingEventsTable
            events={calendarEvents}
            locale={locale}
            captionHidden
            labels={{
              heading: t.upcoming.heading,
              empty: t.upcoming.empty,
              dateHeader: t.upcoming.dateHeader,
              eventHeader: t.upcoming.eventHeader,
              typeHeader: t.upcoming.typeHeader,
              legendBirsa: t.legend.birsa,
              legendUniversity: t.legend.university,
              dateRangeJoiner: t.upcoming.dateRangeJoiner,
            }}
          />
        </div>
      </div>
    </>
  );
}
