import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import NavList, { NavListItem } from "@/components/bds/NavList";

/**
 * `/whats-on` (Wave 5, REDESIGN-2.0 §3.2).
 *
 * The hub for the least validated part of the 2.0 IA (DECISIONS-2.0.md,
 * Decision 2: "What's on received ZERO picks across all eight [card sort]
 * tasks"). Nothing here tested What's on, so this page exists to do the job
 * the card sort could not: a reader arriving from anywhere, with no prior
 * context, should be able to tell from this one screen that news, events,
 * the calendar, clubs and sport all live under it.
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
    title: `${dict.whatson.hub.title}: ${dict.site.name}`,
    description: dict.whatson.hub.lede,
    path: "/whats-on",
  });
}

export default async function WhatsOnPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.whatson;

  const sections = [
    { href: "/whats-on/news", ...t.hub.sections.news },
    { href: "/whats-on/events", ...t.hub.sections.events },
    { href: "/whats-on/calendar", ...t.hub.sections.calendar },
    { href: "/whats-on/clubs", ...t.hub.sections.clubs },
    { href: "/whats-on/sport", ...t.hub.sections.sport },
  ];

  return (
    <>
      <PageHeader
        title={t.hub.title}
        lede={t.hub.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.site.name, href: "/" }, { label: t.hub.title }]}
          />
        }
        helpSlot={
          <Button href={localeHref(locale, "/contact")} variant="ghost">
            {dict.actions.contactUs}
          </Button>
        }
      />
      <div className="wrap py-10">
        <NavList>
          {sections.map((section) => (
            <NavListItem
              key={section.href}
              href={localeHref(locale, section.href)}
              title={section.title}
              level={2}
            >
              {section.body}
            </NavListItem>
          ))}
        </NavList>
      </div>
    </>
  );
}
