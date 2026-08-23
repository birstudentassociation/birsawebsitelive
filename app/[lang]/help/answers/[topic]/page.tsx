import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import Notice from "@/components/bds/Notice";
import { Heading, Text } from "@/components/bds/Type";
import { Wrap, Stack } from "@/components/bds/Layout";
import AnswersProfileSummary from "@/components/help/AnswersProfileSummary";
import { getTopic, parseProfile, serializeProfile } from "@/lib/smart-answers";
import { service, uiCopy } from "@/content/smart-answers";

/**
 * `/help/answers/[topic]`, the 2.0 mount of the Smart Answers topic start
 * page. See `/help/answers/page.tsx` for why this is a rebuild against
 * `bds/` primitives rather than a migration of `app/[lang]/answers/[topic]/page.tsx`.
 */

export function generateStaticParams() {
  return locales.flatMap((lang) => service.topics.map((topic) => ({ lang, topic: topic.slug })));
}

type PageParams = { lang: string; topic: string };
type PageSearchParams = { p?: string | string[] };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { lang, topic: slug } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const topic = getTopic(service, slug);
  if (!topic) return {};

  return buildMetadata({
    locale,
    title: topic.title[locale],
    description: topic.lede[locale],
    path: `/help/answers/${topic.slug}`,
  });
}

export default async function HelpTopicStartPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}) {
  const { lang, topic: slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const topic = getTopic(service, slug);
  if (!topic) notFound();
  const dict = getDictionary(locale);
  const t = uiCopy[locale];

  const { p } = await searchParams;
  const profile = parseProfile(p);
  const token = serializeProfile(profile);
  const carry = token ? `?p=${token}` : "";

  return (
    <>
      <PageHeader
        title={topic.title[locale]}
        lede={topic.lede[locale]}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: dict.hub.title, href: "/help" },
              { label: t.hub, href: "/help/answers" },
              { label: topic.title[locale] },
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
        <Stack gap="xl" className="max-w-[var(--measure)]">
          {topic.whatYoullNeed && topic.whatYoullNeed.length > 0 ? (
            <Stack gap="xs">
              <Heading level={2}>{t.whatYoullBeAsked}</Heading>
              <Text as="ul" step="body-sm" className="list-disc space-y-2 pl-5 text-muted">
                {topic.whatYoullNeed.map((item, index) => (
                  <Text as="li" step="body-sm" key={index}>
                    {item[locale]}
                  </Text>
                ))}
              </Text>
            </Stack>
          ) : null}

          <div>
            <Button href={localeHref(locale, `/help/answers/${topic.slug}/q${carry}`)}>
              {t.startNow}
            </Button>
          </div>

          <AnswersProfileSummary
            locale={locale}
            profile={profile}
            returnTo={`/help/answers/${topic.slug}${carry}`}
          />

          <Notice variant="info">{t.guidanceDisclaimer}</Notice>
        </Stack>
      </Wrap>
    </>
  );
}
