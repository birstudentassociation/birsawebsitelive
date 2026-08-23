import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import PageHeader from "@/components/bds/PageHeader";
import Button from "@/components/bds/Button";
import { localeHref } from "@/lib/i18n";
import RegulationView from "@/components/regulations/RegulationView";
import { documents, getDocument } from "@/content/activity/regulations";

/**
 * `/help/regulations/[doc]` (ROUTE-MAP-2.0 Wave 5C).
 *
 * Renders through `components/regulations/RegulationView`, the existing
 * legislation.gov.uk-style renderer for these documents, unedited: it is
 * out of this agent's owned paths (`components/regulations/` is not
 * `components/help/`), so it is read and reused rather than forked or
 * modified, the same pattern `components/help/AnswersProfileSummary.tsx`
 * already sets for a different 1.0 component. `RegulationView` carries its
 * own internal "back to the regulations library" link to the 1.0
 * `/activity/regulations` route rather than this one; that route stays
 * live until Wave 6 migrates it, so the link is not broken, only not yet
 * updated to the 2.0 path. Flagged in this wave's report rather than fixed
 * here, since fixing it means editing a file outside this agent's owned
 * paths.
 */

export function generateStaticParams() {
  return locales.flatMap((lang) => documents.map((doc) => ({ lang, doc: doc.slug })));
}

const sectionLabel: Record<Locale, string> = {
  en: "Rules and rights",
  th: "กฎและสิทธิของคุณ",
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
    path: `/help/regulations/${slug}`,
  });
}

export default async function HelpRegulationDocPage({
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
              { label: dict.hub.title, href: "/help" },
              { label: sectionLabel[locale], href: "/help/regulations" },
              { label: doc.shortTitle[locale] },
            ]}
          />
        }
        helpSlot={
          <Button href={localeHref(locale, "/contact")} variant="secondary">
            {dict.actions.contactUs}
          </Button>
        }
      />
      <RegulationView doc={doc} locale={locale} />
    </>
  );
}
