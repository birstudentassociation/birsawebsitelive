import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import Notice from "@/components/Notice";
import { flows, getFlow, uiCopy } from "@/content/smart-answers";

/**
 * GOV.UK-style "start page" for one Smart Answers flow: title, lede, an
 * optional "what you'll be asked" list, and a prominent "Start now" link into
 * the question engine at `./q`.
 */

export function generateStaticParams() {
  return locales.flatMap((lang) => flows.map((flow) => ({ lang, flow: flow.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; flow: string }>;
}): Promise<Metadata> {
  const { lang, flow: flowSlug } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const flow = getFlow(flowSlug);
  if (!flow) return {};

  return buildMetadata({
    locale,
    title: flow.title[locale],
    description: flow.lede[locale],
    path: `/answers/${flow.slug}`,
  });
}

export default async function FlowStartPage({
  params,
}: {
  params: Promise<{ lang: string; flow: string }>;
}) {
  const { lang, flow: flowSlug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const flow = getFlow(flowSlug);
  if (!flow) notFound();
  const dict = getDictionary(locale);
  const t = uiCopy[locale];

  return (
    <>
      <PageHeader
        title={flow.title[locale]}
        lede={flow.lede[locale]}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: t.hub, href: "/answers" },
              { label: flow.title[locale] },
            ]}
          />
        }
      />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
        {flow.whatYoullNeed && flow.whatYoullNeed.length > 0 ? (
          <div>
            <h2 className="font-display text-xl">{t.whatYoullBeAsked}</h2>
            <ul className="text-muted mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed">
              {flow.whatYoullNeed.map((item, index) => (
                <li key={index}>{item[locale]}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div>
          <Button href={localeHref(locale, `/answers/${flow.slug}/q`)}>{t.startNow}</Button>
        </div>

        <Notice variant="info">{t.guidanceDisclaimer}</Notice>
      </div>
    </>
  );
}
