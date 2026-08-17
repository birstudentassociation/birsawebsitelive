import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import Notice from "@/components/Notice";
import ProfileSummary from "@/components/answers/ProfileSummary";
import { getTopic, parseProfile, serializeProfile } from "@/lib/smart-answers";
import { service, uiCopy } from "@/content/smart-answers";

/**
 * Start page for one topic: title, lede, what you'll be asked, and the way
 * in. The GOV.UK start-page pattern, kept because it is the page worth
 * indexing and worth linking to from elsewhere on the site, where the step
 * URLs behind it are not.
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
    path: `/answers/${topic.slug}`,
  });
}

export default async function TopicStartPage({
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
              { label: t.hub, href: "/answers" },
              { label: topic.title[locale] },
            ]}
          />
        }
      />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
        {topic.whatYoullNeed && topic.whatYoullNeed.length > 0 ? (
          <div>
            <h2 className="font-display text-xl">{t.whatYoullBeAsked}</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-muted">
              {topic.whatYoullNeed.map((item, index) => (
                <li key={index}>{item[locale]}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div>
          <Button href={localeHref(locale, `/answers/${topic.slug}/q${carry}`)}>
            {t.startNow}
          </Button>
        </div>

        <ProfileSummary
          locale={locale}
          profile={profile}
          returnTo={`/answers/${topic.slug}${carry}`}
        />

        <Notice variant="info">{t.guidanceDisclaimer}</Notice>
      </div>
    </>
  );
}
