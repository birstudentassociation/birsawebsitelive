import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, formatDate, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import NavList, { NavListItem } from "@/components/bds/NavList";
import { Text } from "@/components/bds/Type";
import { Wrap } from "@/components/bds/Layout";
import { listPublishedDecisions } from "@/app/[lang]/about/cms";

/**
 * `/about/decisions` (Wave 5, REDESIGN-2.0 §3.2). What the committee has
 * decided, newest first.
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
    title: `${dict.about.decisionsIndex.title}: ${dict.site.name}`,
    description: dict.about.decisionsIndex.lede,
    path: "/about/decisions",
  });
}

export default async function AboutDecisionsIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.about.decisionsIndex;

  const items = await listPublishedDecisions();

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
          <Button href={localeHref(locale, "/contact")} variant="ghost">
            {dict.actions.contactUs}
          </Button>
        }
      />
      <Wrap className="py-10">
        {items.length === 0 ? (
          <Text step="body" className="text-muted">
            {t.empty}
          </Text>
        ) : (
          <NavList>
            {items.map((item) => (
              <NavListItem
                key={item.slug}
                href={localeHref(locale, `/about/decisions/${item.slug}`)}
                title={item.title}
                meta={formatDate(locale, item.decisionDate)}
                level={2}
              />
            ))}
          </NavList>
        )}
      </Wrap>
    </>
  );
}
