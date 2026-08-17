import Image from "next/image";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { getEntries } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Button from "@/components/Button";
import NavList, { NavListItem } from "@/components/NavList";
import GridRow, { GridMain, GridAside } from "@/components/GridRow";
import FeaturedRail, { type FeaturedItem } from "@/components/home/FeaturedRail";
import NewsCard from "@/components/news/NewsCard";
import EventCalendar from "@/components/home/EventCalendar";
import { calendarEvents } from "@/content/calendar/events";
import { homeEn } from "@/content/home/en";
import { homeTh } from "@/content/home/th";
import { socials } from "@/content/site";

const homeCopy = { en: homeEn, th: homeTh };

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
    title: `${dict.site.name}: ${dict.site.fullName}`,
    description: dict.site.description,
    path: "/",
  });
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const copy = homeCopy[locale];
  const news = getEntries("news", locale).slice(0, 3);

  // Compute "today" in Bangkok on the server so the calendar's SSR and
  // hydration agree (en-CA renders as YYYY-MM-DD).
  const todayKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const quickLinkCards: { href: string; key: keyof typeof copy.quickLinks.items }[] = [
    { href: "/services/study-plan", key: "planDegree" },
    { href: "/student-life/home/places-nearby", key: "placesNearby" },
    { href: "/student-life/getting-started", key: "gettingStarted" },
    { href: "/student-life/home/shuttle-bus", key: "shuttleBus" },
  ];

  const activityHighlightCards: {
    href: string;
    key: keyof typeof copy.activityHighlight.items;
  }[] = [
    { href: "/activity/roles", key: "roles" },
    { href: "/activity/regulations", key: "regulations" },
    { href: "/activity", key: "overview" },
  ];

  // The rail sits beside the top tasks, so it deliberately carries none of
  // them. These are three things worth a look that the list next to it does
  // not already point at.
  const featuredItems: FeaturedItem[] = (
    [
      { key: "courseReviews", href: "/student-life/course-reviews", icon: "review" },
      { key: "equipmentLoan", href: "/services/equipment-loan", icon: "loan" },
      { key: "clubs", href: "/clubs", icon: "club" },
    ] as const
  ).map(({ key, href, icon }) => ({
    href: localeHref(locale, href),
    icon,
    label: copy.featured.items[key].label,
    description: copy.featured.items[key].description,
  }));

  const instagram = socials.find((s) => s.id === "instagram");
  const facebook = socials.find((s) => s.id === "facebook");
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BIR Student Association (BIRSA)",
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/birsa-logo.png`,
    sameAs: [instagram?.href, facebook?.href].filter((href): href is string => Boolean(href)),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {/* Hero */}
      <section className="border-b border-line bg-cream">
        <div className="wrap grid gap-8 py-14 sm:py-20 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-10">
          <div className="max-w-[var(--measure)]">
            <h1 className="font-display text-4xl sm:text-5xl">{copy.hero.heading}</h1>
            <p className="mt-4 text-lg text-muted">{copy.hero.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={localeHref(locale, "/quick")}>{copy.hero.primaryCta}</Button>
              <Button href={localeHref(locale, "/services")} variant="secondary">
                {copy.hero.secondaryCta}
              </Button>
            </div>
          </div>
          <div aria-hidden="true" className="hidden justify-center md:flex">
            <Image
              src="/birsa-logo.png"
              alt=""
              width={320}
              height={320}
              className="h-auto w-full max-w-[18rem] opacity-90"
              priority
            />
          </div>
        </div>
      </section>

      {/* Quick links: top tasks, not a mirror of the header nav. Sits directly
          under the hero, so it takes only a bottom border (the hero supplies
          the line above it). */}
      <section aria-labelledby="top-tasks-heading" className="border-b border-line bg-sunken">
        <div className="wrap py-12 sm:py-16">
          <GridRow>
            <GridMain>
              <h2 id="top-tasks-heading" className="mb-6 font-display text-2xl sm:text-3xl">
                {copy.quickLinks.heading}
              </h2>
              <NavList>
                {quickLinkCards.map(({ href, key }) => {
                  const item = copy.quickLinks.items[key];
                  return (
                    <NavListItem key={key} href={localeHref(locale, href)} title={item.label}>
                      {item.description}
                    </NavListItem>
                  );
                })}
              </NavList>
            </GridMain>
            <GridAside>
              <FeaturedRail
                heading={copy.featured.heading}
                headingId="featured-heading"
                items={featuredItems}
              />
            </GridAside>
          </GridRow>
        </div>
      </section>

      {/* What's on */}
      {news.length > 0 ? (
        <section aria-labelledby="whats-on-heading" className="wrap py-12 sm:py-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h2 id="whats-on-heading" className="font-display text-2xl sm:text-3xl">
              {copy.whatsOn.heading}
            </h2>
            <a
              href={localeHref(locale, "/news")}
              className="text-sm font-semibold text-brand-deep hover:underline"
            >
              {copy.whatsOn.seeAll}
            </a>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((entry) => (
              <NewsCard
                key={entry.slug}
                locale={locale}
                dict={dict}
                slug={entry.slug}
                frontmatter={entry.frontmatter}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* Activity calendar */}
      <section aria-labelledby="calendar-heading" className="border-y border-line bg-cream">
        <div className="wrap py-12 sm:py-16">
          <div className="mb-6 max-w-[var(--measure)]">
            <h2 id="calendar-heading" className="font-display text-2xl sm:text-3xl">
              {copy.calendar.heading}
            </h2>
            <p className="mt-2 text-lg text-muted">{copy.calendar.intro}</p>
          </div>
          <EventCalendar
            events={calendarEvents}
            locale={locale}
            todayKey={todayKey}
            icsUrl={`${SITE_URL}/${locale}/calendar.ics`}
            labels={{
              prevMonth: copy.calendar.prevMonth,
              nextMonth: copy.calendar.nextMonth,
              selectedFor: copy.calendar.selectedFor,
              noEventsDay: copy.calendar.noEventsDay,
              open: copy.calendar.open,
              eventCount: copy.calendar.eventCount,
              legend: copy.calendar.legend,
              styleLegend: copy.calendar.styleLegend,
              subscribe: copy.calendar.subscribe,
            }}
          />
        </div>
      </section>

      {/* BIRSA activity highlight */}
      <section aria-labelledby="activity-highlight-heading" className="wrap py-12 sm:py-16">
        <GridRow>
          <GridMain>
            <div className="mb-6">
              <h2 id="activity-highlight-heading" className="font-display text-2xl sm:text-3xl">
                {copy.activityHighlight.heading}
              </h2>
              <p className="mt-2 text-lg text-muted">{copy.activityHighlight.intro}</p>
            </div>
            <NavList>
              {activityHighlightCards.map(({ href, key }) => {
                const item = copy.activityHighlight.items[key];
                return (
                  <NavListItem key={key} href={localeHref(locale, href)} title={item.label}>
                    {item.description}
                  </NavListItem>
                );
              })}
            </NavList>
          </GridMain>
        </GridRow>
      </section>
    </>
  );
}
