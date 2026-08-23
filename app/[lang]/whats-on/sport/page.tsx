import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, formatDate, type Locale } from "@/lib/i18n";
import { getClubEntries } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import Table from "@/components/bds/Table";
import { Heading, Text } from "@/components/bds/Type";
import ClubCard from "@/components/whatson/ClubCard";
import { sportFixtures } from "@/components/whatson/fixtures";

/**
 * `/whats-on/sport` (Wave 5, REDESIGN-2.0 SS3.2).
 *
 * BIR's sports clubs, and their fixtures once one is confirmed. Nobody at
 * BIRSA has confirmed a fixture yet (`components/whatson/fixtures.ts`), so
 * `sportFixtures` is genuinely empty rather than a placeholder waiting to be
 * filled with invented dates or opponents: the empty state below is the
 * honest answer, not a stand-in for real data this wave does not have.
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
    title: `${dict.whatson.sport.title}: ${dict.site.name}`,
    description: dict.whatson.sport.lede,
    path: "/whats-on/sport",
  });
}

export default async function WhatsOnSportPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.whatson.sport;

  const sportsClubs = getClubEntries(locale).filter(
    (entry) => entry.frontmatter.category === "sports"
  );

  const clubTitleByLocale = new Map(
    getClubEntries(locale).map((entry) => [entry.slug, entry.frontmatter.title])
  );

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
        {sportFixtures.length > 0 ? (
          <Table
            caption={t.title}
            captionHidden
            columns={[
              { key: "date", header: t.fixtureDateHeader },
              { key: "club", header: t.fixtureClubHeader },
              { key: "opponent", header: t.fixtureOpponentHeader },
              { key: "venue", header: t.fixtureVenueHeader },
            ]}
            rows={sportFixtures.map((fixture) => ({
              date: formatDate(locale, fixture.date),
              club: clubTitleByLocale.get(fixture.club) ?? fixture.club,
              opponent: fixture.opponent[locale],
              venue: fixture.venue?.[locale] ?? "",
            }))}
            rowKey={(_row, index) => sportFixtures[index]?.id ?? String(index)}
          />
        ) : (
          <div className="flex flex-col items-start gap-2 rounded-lg border border-line bg-sunken p-6">
            <Heading level={2} step="heading-2">
              {t.noFixturesTitle}
            </Heading>
            <Text step="body" className="max-w-[var(--measure)] text-muted">
              {t.noFixturesBody}
            </Text>
          </div>
        )}

        <div className="flex flex-col gap-5 border-t border-line pt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <Heading level={2} step="heading-2">
              {t.clubsHeading}
            </Heading>
            <Button href={localeHref(locale, "/whats-on/clubs")} variant="secondary">
              {t.clubsCta}
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sportsClubs.map((entry) => (
              <ClubCard
                key={entry.slug}
                locale={locale}
                openLabel={dict.whatson.clubs.openToJoin}
                club={{
                  slug: entry.slug,
                  title: entry.frontmatter.title,
                  tagline: entry.frontmatter.tagline,
                  category: entry.frontmatter.category,
                  joinOpen: entry.frontmatter.joinOpen,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
