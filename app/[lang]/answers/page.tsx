import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Card, { CardTitle } from "@/components/Card";
import { flows, uiCopy } from "@/content/smart-answers";

/**
 * Smart Answers index: a short list of guided, question-driven checks (GOV.UK
 * "smart answers" pattern) built from the site's own regulations and service
 * content. Every step is a plain GET-form URL; nothing here needs JavaScript.
 */

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

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

export default async function AnswersIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = uiCopy[locale];

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
      <div className="wrap py-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {flows.map((flow) => {
            const href = localeHref(locale, `/answers/${flow.slug}`);
            return (
              <Card key={flow.slug} href={href}>
                <CardTitle href={href} as="h2">
                  {flow.title[locale]}
                </CardTitle>
                <p className="text-muted text-sm leading-relaxed">{flow.lede[locale]}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
