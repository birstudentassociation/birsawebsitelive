import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import { Wrap } from "@/components/bds/Layout";
import CommitteeRoster from "@/components/about/CommitteeRoster";

/**
 * `/about/committee` (Wave 5, REDESIGN-2.0 §3.2).
 *
 * The full roster, replacing 1.0's `/activity/roles`. Reuses
 * `components/about/CommitteeRoster.tsx` as-is: it already renders
 * `content/committee.ts` in officer/assistant groups with
 * `components/bds/Portrait`'s placeholder fallback, and its 1.0 caller
 * (`content/activity/en/birsa.mdx` via `lib/mdx.tsx`'s component map) keeps
 * working unchanged because this page only imports it, never edits it.
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
    title: `${dict.about.committee.title}: ${dict.site.name}`,
    description: dict.about.committee.lede,
    path: "/about/committee",
  });
}

export default async function AboutCommitteePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.about.committee;

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
              { label: dict.about.hub.title, href: "/about" },
              { label: t.title },
            ]}
          />
        }
        helpSlot={
          <Button href={localeHref(locale, "/about/portfolios")} variant="ghost">
            {dict.about.hub.sections.portfolios.title}
          </Button>
        }
      />
      <Wrap className="py-10">
        <CommitteeRoster locale={locale} />
      </Wrap>
    </>
  );
}
