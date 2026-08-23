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
import { listPublishedMinutes } from "@/app/[lang]/about/cms";

/**
 * `/about/minutes` (Wave 5, REDESIGN-2.0 §3.2, Decision 2).
 *
 * "When is the next general meeting" landed here directly (Decision 2), so
 * this list is ordered newest meeting first and states plainly when there
 * is nothing published yet, rather than showing a stale or empty-looking
 * page with no explanation.
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
    title: `${dict.about.minutesIndex.title}: ${dict.site.name}`,
    description: dict.about.minutesIndex.lede,
    path: "/about/minutes",
  });
}

export default async function AboutMinutesIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.about.minutesIndex;

  const items = await listPublishedMinutes();

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
                href={localeHref(locale, `/about/minutes/${item.slug}`)}
                title={item.title}
                meta={formatDate(locale, item.meetingDate)}
                level={2}
              />
            ))}
          </NavList>
        )}
      </Wrap>
    </>
  );
}
