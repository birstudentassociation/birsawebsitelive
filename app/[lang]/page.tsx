import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { getEntries } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import Button from "@/components/bds/Button";
import NavList, { NavListItem } from "@/components/bds/NavList";
import { Heading, Text } from "@/components/bds/Type";
import { Section, Wrap } from "@/components/bds/Layout";
import { defaultPrimaryNav } from "@/components/bds/nav";
import WhatsOnCard from "@/components/home/WhatsOnCard";
import { homeNamespace as homeEn } from "@/content/dictionaries/en/home";
import { homeNamespace as homeTh } from "@/content/dictionaries/th/home";

/**
 * The 2.0 home page (REDESIGN-2.0 §3.2, §8.2, ROUTE-MAP-2.0 "Wave 5A").
 *
 * `content/dictionaries/{en,th}/home.ts` is this wave's one namespace file
 * and is not wired into `content/dictionaries/{en,th}/index.ts` yet (see
 * that file's own header), so `homeCopy` is read directly rather than
 * through `getDictionary()`. `getDictionary()` is still used for the chrome
 * strings this page borrows (`dict.chrome...` is not needed here; nothing
 * currently is, `homeCopy` covers every string this page renders).
 *
 * FOUR BLOCKS, NO MORE (§8.2's own ceiling, fixing D5: "1.0's home page
 * carried six blocks and about nineteen destinations"):
 *
 *   1. A short hero, one <h1>, one primary action. NOT built from
 *      `components/bds/PageHeader`, on purpose: that component's `helpSlot`
 *      is WCAG 3.2.6 consistent help, a fixed, genuine help link in the same
 *      place on every content page, and this hero's job is different, one
 *      primary call to action rather than a help link. Conflating the two
 *      by putting the CTA in `helpSlot` would misuse the contract and leave
 *      the home page with no real consistent-help link at all. So the hero
 *      is bespoke, and still carries a genuine, consistently placed help
 *      link of its own (reusing `Header`'s own "Get help" label from
 *      `defaultPrimaryNav`, not a new translation) alongside the one
 *      primary action, rather than dropping consistent help to keep the
 *      component list short. Recorded as a deliberate deviation from
 *      "every page opens with PageHeader" in the Wave 5A report.
 *   2. Top tasks, a `NavList` (the job is "pick where to go next").
 *   3. What's on, three items and a link, using `Card` (each item carries a
 *      date, which is exactly `Card`'s own usage rule over `NavList`).
 *   4. "An emergency and service status region that is usually empty."
 *      This is NOT a fourth block of markup on this page: `EmergencyBanner`
 *      already renders sitewide, above every page, from
 *      `app/[lang]/layout.tsx`, and is invisible whenever nothing is active,
 *      which is what "usually empty" describes. A second, page-level status
 *      widget with no live status data behind it would either duplicate the
 *      sitewide banner or invent a "some services degraded" indicator BIRSA
 *      has no system to back, which BUILD-BRIEF-2.0 §3 forbids. Recorded as
 *      a decision in the Wave 5A report, not a silent omission.
 *
 * No calendar: §8.2 moves the month calendar to `/whats-on`, owned by
 * another wave.
 */
const homeCopy: Record<Locale, typeof homeEn> = { en: homeEn, th: homeTh };

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

const TOP_TASKS: {
  key: keyof (typeof homeEn)["home"]["topTasks"]["items"];
  href: string;
}[] = [
  { key: "borrowEquipment", href: "/do/equipment-loan" },
  { key: "gettingStarted", href: "/help/getting-started" },
  { key: "courseReviews", href: "/studies/course-reviews" },
  { key: "joinAClub", href: "/whats-on/clubs" },
  { key: "whatsOn", href: "/whats-on/news" },
];

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const copy = homeCopy[locale].home;
  const news = getEntries("news", locale).slice(0, 3);
  const helpNavLabel = defaultPrimaryNav.find((item) => item.href === "/help")?.label[locale];

  return (
    <>
      <section className="border-b border-line bg-cream">
        <Wrap className="flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between sm:py-14">
          <div className="max-w-[var(--measure)]">
            <Heading level={1}>{copy.hero.heading}</Heading>
            <Text step="body" className="mt-3 text-muted">
              {copy.hero.intro}
            </Text>
            <div className="mt-6">
              <Button href={localeHref(locale, "/do")}>{copy.hero.primaryCta}</Button>
            </div>
          </div>
          {helpNavLabel ? (
            <Button href={localeHref(locale, "/help")} variant="ghost" className="shrink-0">
              {helpNavLabel}
            </Button>
          ) : null}
        </Wrap>
      </section>

      <Section>
        <Wrap className="max-w-[var(--measure)]">
          <Heading level={2}>{copy.topTasks.heading}</Heading>
          <NavList className="mt-6">
            {TOP_TASKS.map(({ key, href }) => {
              const item = copy.topTasks.items[key];
              return (
                <NavListItem key={key} href={localeHref(locale, href)} title={item.label}>
                  {item.hint}
                </NavListItem>
              );
            })}
          </NavList>
        </Wrap>
      </Section>

      {news.length > 0 ? (
        <Section className="border-t border-line bg-sunken">
          <Wrap>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <Heading level={2}>{copy.whatsOn.heading}</Heading>
              <a
                href={localeHref(locale, "/whats-on/news")}
                className="focus-halo font-semibold text-brand-deep underline"
              >
                <Text as="span" step="body-sm">
                  {copy.whatsOn.seeAll}
                </Text>
              </a>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((entry) => (
                <WhatsOnCard
                  key={entry.slug}
                  locale={locale}
                  href={localeHref(locale, `/whats-on/news/${entry.slug}`)}
                  frontmatter={entry.frontmatter}
                  eventLabel={locale === "th" ? "กิจกรรม" : "Event"}
                  newsLabel={locale === "th" ? "ข่าว" : "News"}
                />
              ))}
            </div>
          </Wrap>
        </Section>
      ) : null}
    </>
  );
}
