import Image from "next/image";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { getEntries } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Button from "@/components/Button";
import Card, { CardTitle } from "@/components/Card";
import Notice from "@/components/Notice";
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
    { href: "/information-services/equipment-loan", key: "borrowEquipment" },
    { href: "/student-life/course-reviews", key: "courseReviews" },
    { href: "/student-life/home/shuttle-bus", key: "shuttleBus" },
    { href: "/information-services", key: "informationServices" },
  ];

  const activityHighlightCards: {
    href: string;
    key: keyof typeof copy.activityHighlight.items;
  }[] = [
    { href: "/activity/roles", key: "roles" },
    { href: "/activity/regulations", key: "regulations" },
    { href: "/activity", key: "overview" },
  ];

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
      <section className="border-line bg-cream border-b">
        <div className="wrap grid gap-8 py-14 sm:py-20 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-10">
          <div className="max-w-[var(--measure)]">
            <h1 className="font-display text-4xl sm:text-5xl">{copy.hero.heading}</h1>
            <p className="text-muted mt-4 text-lg">{copy.hero.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={localeHref(locale, "/quick")}>{copy.hero.primaryCta}</Button>
              <Button href={localeHref(locale, "/information-services")} variant="secondary">
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

      {/* What's on */}
      {news.length > 0 ? (
        <section aria-labelledby="whats-on-heading" className="wrap py-12 sm:py-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h2 id="whats-on-heading" className="font-display text-2xl sm:text-3xl">
              {copy.whatsOn.heading}
            </h2>
            <a
              href={localeHref(locale, "/news")}
              className="text-brand-deep text-sm font-semibold hover:underline"
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
      <section aria-labelledby="calendar-heading" className="bg-cream border-line border-y">
        <div className="wrap py-12 sm:py-16">
          <div className="mb-6 max-w-[var(--measure)]">
            <h2 id="calendar-heading" className="font-display text-2xl sm:text-3xl">
              {copy.calendar.heading}
            </h2>
            <p className="text-muted mt-2 text-lg">{copy.calendar.intro}</p>
          </div>
          <EventCalendar
            events={calendarEvents}
            locale={locale}
            todayKey={todayKey}
            labels={{
              prevMonth: copy.calendar.prevMonth,
              nextMonth: copy.calendar.nextMonth,
              selectedFor: copy.calendar.selectedFor,
              noEventsDay: copy.calendar.noEventsDay,
              open: copy.calendar.open,
              eventCount: copy.calendar.eventCount,
              legend: copy.calendar.legend,
              styleLegend: copy.calendar.styleLegend,
            }}
          />
        </div>
      </section>

      {/* BIRSA activity highlight */}
      <section aria-labelledby="activity-highlight-heading" className="wrap py-12 sm:py-16">
        <div className="mb-6 max-w-[var(--measure)]">
          <h2 id="activity-highlight-heading" className="font-display text-2xl sm:text-3xl">
            {copy.activityHighlight.heading}
          </h2>
          <p className="text-muted mt-2 text-lg">{copy.activityHighlight.intro}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {activityHighlightCards.map(({ href, key }) => {
            const item = copy.activityHighlight.items[key];
            const fullHref = localeHref(locale, href);
            return (
              <Card key={key} href={fullHref}>
                <CardTitle href={fullHref}>{item.label}</CardTitle>
                <p className="text-muted text-sm leading-relaxed">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Quick links: top tasks, not a mirror of the header nav */}
      <section aria-labelledby="top-tasks-heading" className="bg-sunken border-line border-y">
        <div className="wrap py-12 sm:py-16">
          <h2 id="top-tasks-heading" className="font-display mb-6 text-2xl sm:text-3xl">
            {copy.quickLinks.heading}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinkCards.map(({ href, key }) => {
              const item = copy.quickLinks.items[key];
              const fullHref = localeHref(locale, href);
              return (
                <Card key={key} href={fullHref}>
                  <CardTitle href={fullHref}>{item.label}</CardTitle>
                  <p className="text-muted text-sm leading-relaxed">{item.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* New here? */}
      <section aria-labelledby="new-here-heading" className="wrap py-12 sm:py-16">
        <h2 id="new-here-heading" className="sr-only">
          {copy.newHere.title}
        </h2>
        <Notice variant="info" title={copy.newHere.title}>
          <p>{copy.newHere.body}</p>
          <p className="mt-2">
            <a
              href={localeHref(locale, "/student-life/getting-started")}
              className="text-brand-deep font-semibold hover:underline"
            >
              {copy.newHere.cta}
            </a>
          </p>
        </Notice>
      </section>
    </>
  );
}
