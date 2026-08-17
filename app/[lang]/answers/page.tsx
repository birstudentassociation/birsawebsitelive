import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import NavList, { NavListItem } from "@/components/NavList";
import GridRow, { GridMain } from "@/components/GridRow";
import ProfileSummary from "@/components/answers/ProfileSummary";
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
 * The single front door to Smart Answers. Three ways in, because people
 * arrive knowing different amounts about what they need:
 *
 *  - type what you need, and get matching topics;
 *  - browse the topics, grouped by area;
 *  - answer "what do you need?" and be routed, for people who cannot name
 *    the area their problem belongs to, which is most people with an
 *    unfamiliar problem.
 *
 * This page reads `searchParams` (the query box and the audience profile) so
 * it renders per request, like `/search` and `/news`. Every state is still a
 * plain, bookmarkable, no-JS GET URL.
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

  return buildMetadata({ locale, title: t.hub, description: t.hubLede, path: "/answers" });
}

function firstValue(value: string | string[] | undefined): string {
  if (value === undefined) return "";
  return Array.isArray(value) ? (value[0] ?? "") : value;
}

export default async function AnswersHubPage({
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
  const hubHref = localeHref(locale, "/answers");
  const returnTo = `/answers${carry}`;

  const topicHref = (topic: SmartAnswerTopic) =>
    localeHref(locale, `/answers/${topic.slug}${carry}`);

  const renderTopic = (topic: SmartAnswerTopic) => {
    const href = topicHref(topic);
    return (
      <NavListItem key={topic.slug} href={href} title={topic.title[locale]} as="h3">
        {topic.lede[locale]}
      </NavListItem>
    );
  };

  return (
    <>
      <PageHeader
        title={t.hub}
        lede={t.hubLede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.site.name, href: "/" }, { label: t.hub }]}
          />
        }
      />

      <div className="wrap flex flex-col gap-10 py-10">
        {/* Way in 1: say what you need. */}
        <form method="GET" action={hubHref} className="flex max-w-[var(--measure)] flex-col gap-3">
          {profileToken ? <input type="hidden" name="p" value={profileToken} /> : null}
          <label htmlFor="answers-q" className="font-display text-xl text-ink">
            {t.searchLabel}
          </label>
          <p id="answers-q-hint" className="text-sm text-muted">
            {t.searchHint}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* `flex-1` only from `sm:` up, where the wrapper is a row. Below
                that it stacks, and flex-1 would size the input's height
                rather than its width, collapsing it to a sliver. */}
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
          <section aria-labelledby="answers-results">
            <GridRow>
              <GridMain className="flex flex-col gap-4">
                <h2 id="answers-results" className="font-display text-2xl">
                  {matches.length > 0 ? t.searchResults : t.searchNoResults}
                </h2>
                {matches.length > 0 ? <NavList>{matches.map(renderTopic)}</NavList> : null}
                <div>
                  <Link href={hubHref} className="font-medium text-brand-deep hover:underline">
                    {t.searchClear}
                  </Link>
                </div>
              </GridMain>
            </GridRow>
          </section>
        ) : null}

        {/* Way in 2: be routed by a question. */}
        <section className="flex flex-col gap-4 rounded-lg border-l-4 border-brand bg-brand-tint p-6">
          <h2 className="font-display text-2xl">{t.triageHeading}</h2>
          <p className="max-w-[var(--measure)] leading-relaxed text-ink">{t.triageLede}</p>
          <div>
            <Button href={localeHref(locale, `/answers/${TRIAGE_SLUG}/q${carry}`)}>
              {t.triageStart}
            </Button>
          </div>
        </section>

        <ProfileSummary locale={locale} profile={profile} returnTo={returnTo} />

        {/* Way in 3: browse by area. */}
        {topicGroupList.map((group) => {
          const groupTopics = orderTopics(
            service.topics.filter((topic) => topic.group === group.id && !topic.hideFromHub),
            facts
          );
          if (groupTopics.length === 0) return null;

          return (
            <section key={group.id} aria-labelledby={`group-${group.id}`}>
              <GridRow>
                <GridMain className="flex flex-col gap-4">
                  <div>
                    <h2 id={`group-${group.id}`} className="font-display text-2xl">
                      {group.title[locale]}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted">
                      {group.description[locale]}
                    </p>
                  </div>
                  <NavList>{groupTopics.map(renderTopic)}</NavList>
                </GridMain>
              </GridRow>
            </section>
          );
        })}
      </div>
    </>
  );
}
