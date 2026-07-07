import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import RegulationView from "@/components/regulations/RegulationView";
import { documents, getDocument } from "@/content/activity/regulations";

export function generateStaticParams() {
  return locales.flatMap((lang) => documents.map((doc) => ({ lang, doc: doc.slug })));
}

const sectionLabel: Record<Locale, string> = {
  en: "BIRSA activity",
  th: "การดำเนินงานของ BIRSA",
};

const regsLabel: Record<Locale, string> = {
  en: "Student regulations and rules",
  th: "ระเบียบและข้อบังคับนักศึกษา",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; doc: string }>;
}): Promise<Metadata> {
  const { lang, doc: slug } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const doc = getDocument(slug);
  if (!doc) return {};
  return buildMetadata({
    locale,
    title: doc.shortTitle[locale],
    description: doc.citation[locale],
    path: `/activity/regulations/${slug}`,
  });
}

export default async function RegulationDocPage({
  params,
}: {
  params: Promise<{ lang: string; doc: string }>;
}) {
  const { lang, doc: slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const doc = getDocument(slug);
  if (!doc) notFound();

  return (
    <>
      <PageHeader
        title={doc.shortTitle[locale]}
        lede={doc.citation[locale]}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: sectionLabel[locale], href: "/activity" },
              { label: regsLabel[locale], href: "/activity/regulations" },
              { label: doc.shortTitle[locale] },
            ]}
          />
        }
      />
      <RegulationView doc={doc} locale={locale} />
    </>
  );
}
