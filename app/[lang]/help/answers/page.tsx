import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import NavList, { NavListItem } from "@/components/bds/NavList";
import { Heading, Text } from "@/components/bds/Type";
import { Wrap, Stack } from "@/components/bds/Layout";
import AnswersProfileSummary from "@/components/help/AnswersProfileSummary";
import {
  matchTopics,
  orderTopics,
  parseProfile,
  profileToFacts,
  serializeProfile,
} from "@/lib/smart-answers";
import { service, topicGroupList, TRIAGE_SLUG, uiCopy } from "@/content/smart-answers";
import type { SmartAnswerTopic } from "@/content/smart-answers/types";

/**
 * `/help/answers`, the 2.0 mount of Smart Answers (ROUTE-MAP-2.0 Wave 5C
 * `/help/answers`, `/help/answers/[topic]`, `/help/answers/[topic]/q`,
 * `/help/answers/you`).
 *
 * A rebuild of `app/[lang]/answers/page.tsx` against `bds/` primitives
 * (`PageHeader`, `Breadcrumbs`, `Button`, `NavList`, `Text`/`Heading`)
 * rather than the 1.0 components it imports, which reach for raw Tailwind
 * size utilities (defect D7). The 1.0 route stays live and unedited; this
 * is a new mount, not a migration of that file (BUILD-BRIEF-2.0 §10, Wave 6
 * does migration and redirects). `content/smart-answers/**` and
 * `lib/smart-answers.ts` are read, not owned by this agent, and are shared
 * unedited with the 1.0 route.
 */

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

type PageSearchParams = { q?: string | string[]; p?: string | string[] };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = uiCopy[locale];

  return buildMetadata({ locale, title: t.hub, description: t.hubLede, path: "/help/answers" });
}

function firstValue(value: string | string[] | undefined): string {
  if (value === undefined) return "";
  return Array.isArray(value) ? (value[0] ?? "") : value;
}

export default async function HelpAnswersHubPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<PageSearchParams>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = uiCopy[locale];

  const { q, p } = await searchParams;
  const query = firstValue(q).trim();
  const profile = parseProfile(p);
  const facts = profileToFacts(profile);
  const profileToken = serializeProfile(profile);
  const carry = profileToken ? `?p=${profileToken}` : "";

  const matches = query ? matchTopics(service, query) : [];
  const hubHref = localeHref(locale, "/help/answers");
  const returnTo = `/help/answers${carry}`;

  const topicHref = (topic: SmartAnswerTopic) =>
    localeHref(locale, `/help/answers/${topic.slug}${carry}`);

  const renderTopic = (topic: SmartAnswerTopic) => (
    <NavListItem key={topic.slug} href={topicHref(topic)} title={topic.title[locale]} level={3}>
      {topic.lede[locale]}
    </NavListItem>
  );

  return (
    <>
      <PageHeader
        title={t.hub}
        lede={t.hubLede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: dict.hub.title, href: "/help" },
              { label: t.hub },
            ]}
          />
        }
        helpSlot={
          <Button href={localeHref(locale, "/contact")} variant="secondary">
            {dict.actions.contactUs}
          </Button>
        }
      />

      <Wrap className="py-10">
        <Stack gap="2xl">
          <form
            method="GET"
            action={hubHref}
            className="flex max-w-[var(--measure)] flex-col gap-3"
          >
            {profileToken ? <input type="hidden" name="p" value={profileToken} /> : null}
            <label htmlFor="answers-q">
              <Text as="span" step="heading-3">
                {t.searchLabel}
              </Text>
            </label>
            {/* The id lives on a wrapper because `Text` does not take one, by
                design. `aria-describedby` resolves against this element's text
                content, so the description a screen reader announces is
                unchanged. */}
            <div id="answers-q-hint">
              <Text as="p" step="body-sm" className="text-muted">
                {t.searchHint}
              </Text>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="answers-q"
                name="q"
                type="search"
                defaultValue={query}
                aria-describedby="answers-q-hint"
                className="focus-halo h-11 w-full rounded-lg border border-input-border bg-surface px-4 text-ink sm:flex-1"
              />
              <Button type="submit">{t.searchButton}</Button>
            </div>
          </form>

          {query ? (
            <section aria-label={matches.length > 0 ? t.searchResults : t.searchNoResults}>
              <Stack gap="md" className="max-w-[var(--measure)]">
                <Heading level={2}>
                  {matches.length > 0 ? t.searchResults : t.searchNoResults}
                </Heading>
                {matches.length > 0 ? <NavList>{matches.map(renderTopic)}</NavList> : null}
                <div>
                  <Link href={hubHref} className="font-medium text-brand-deep hover:underline">
                    <Text as="span" step="body-sm">
                      {t.searchClear}
                    </Text>
                  </Link>
                </div>
              </Stack>
            </section>
          ) : null}

          <Stack gap="sm" className="rounded-lg border-l-4 border-brand bg-brand-tint p-6">
            <Heading level={2}>{t.triageHeading}</Heading>
            <Text step="body" className="max-w-[var(--measure)] text-ink">
              {t.triageLede}
            </Text>
            <div>
              <Button href={localeHref(locale, `/help/answers/${TRIAGE_SLUG}/q${carry}`)}>
                {t.triageStart}
              </Button>
            </div>
          </Stack>

          <AnswersProfileSummary locale={locale} profile={profile} returnTo={returnTo} />

          {topicGroupList.map((group) => {
            const groupTopics = orderTopics(
              service.topics.filter((topic) => topic.group === group.id && !topic.hideFromHub),
              facts
            );
            if (groupTopics.length === 0) return null;

            return (
              <section key={group.id} aria-label={group.title[locale]}>
                <Stack gap="md" className="max-w-[var(--measure)]">
                  <Stack gap="3xs">
                    <Heading level={2}>{group.title[locale]}</Heading>
                    <Text step="body-sm" className="text-muted">
                      {group.description[locale]}
                    </Text>
                  </Stack>
                  <NavList>{groupTopics.map(renderTopic)}</NavList>
                </Stack>
              </section>
            );
          })}
        </Stack>
      </Wrap>
    </>
  );
}
