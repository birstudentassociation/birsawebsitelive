import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { getClubEntries } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import ExternalLink from "@/components/bds/ExternalLink";
import { Heading, Text } from "@/components/bds/Type";
import ClubsExplorer from "@/components/whatson/ClubsExplorer";
import type { ClubSummary } from "@/content/clubs/clubs";

/**
 * `/whats-on/clubs` (Wave 5, REDESIGN-2.0 SS3.2, SS3.6; docs/SCOPE-AUDIT-2.0.md
 * row for `home/getting-involved.mdx`, disposition ABSORB).
 *
 * The canonical BIR club directory. `home/getting-involved.mdx` absorbs into
 * this page for its BIR club content; that source document also carried
 * TPC-level club tables and TUSU/TUSC contact details, which are those
 * bodies' own information copied out of their own handbook. The audit's
 * instruction is explicit that BIRSA republishing a second copy of someone
 * else's directory is exactly the failure SS3.6 exists to stop, so this page
 * signposts TUSU Tha Prachan and TUSC rather than restating their club
 * tables or committee lists.
 *
 * `/do` already links here for "join a club" (Wave 5A, `app/[lang]/do/page.tsx`):
 * this directory, plus each club's own contact links on its detail page, IS
 * the join path. This page does not build a joining flow of its own.
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
    title: `${dict.whatson.clubs.title}: ${dict.site.name}`,
    description: dict.whatson.clubs.lede,
    path: "/whats-on/clubs",
  });
}

export default async function WhatsOnClubsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.whatson.clubs;

  // Only the card fields cross into the client explorer; MDX bodies stay server-side.
  const clubs: ClubSummary[] = getClubEntries(locale).map((entry) => ({
    slug: entry.slug,
    title: entry.frontmatter.title,
    tagline: entry.frontmatter.tagline,
    category: entry.frontmatter.category,
    joinOpen: entry.frontmatter.joinOpen,
  }));

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
        <ClubsExplorer
          clubs={clubs}
          locale={locale}
          dict={{
            search: t.search,
            searchPlaceholder: t.searchPlaceholder,
            category: t.category,
            allCategories: t.allCategories,
            showing: t.showing,
            result: t.result,
            results: t.results,
            noResults: t.noResults,
            clearFilters: t.clearFilters,
            openToJoin: t.openToJoin,
          }}
        />

        <div className="flex flex-col items-start gap-4 rounded-lg border border-line bg-sunken p-8">
          <Heading level={2} step="heading-2">
            {t.startTitle}
          </Heading>
          <Text step="body" className="max-w-[var(--measure)] text-muted">
            {t.startBody}
          </Text>
          <Button href={localeHref(locale, "/clubs/start")}>{t.startCta}</Button>
        </div>

        <div className="flex flex-col gap-6 border-t border-line pt-8">
          <div className="max-w-[var(--measure)]">
            <Heading level={2} step="heading-2">
              {t.beyondTitle}
            </Heading>
            <Text step="body" className="mt-2 text-muted">
              {t.beyondLede}
            </Text>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-5">
              <Heading level={3} step="heading-3">
                {t.tusuTitle}
              </Heading>
              <Text step="body-sm" className="text-muted">
                {t.tusuBody}
              </Text>
              <ExternalLink
                href="https://instagram.com/tusu.tpc"
                newTabLabel={dict.a11y.newTab}
                className="mt-1 w-fit font-semibold text-brand-deep"
              >
                {t.tusuCta}
              </ExternalLink>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-5">
              <Heading level={3} step="heading-3">
                {t.tuscTitle}
              </Heading>
              <Text step="body-sm" className="text-muted">
                {t.tuscBody}
              </Text>
              <ExternalLink
                href="https://instagram.com/tusc.tpc"
                newTabLabel={dict.a11y.newTab}
                className="mt-1 w-fit font-semibold text-brand-deep"
              >
                {t.tuscCta}
              </ExternalLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
