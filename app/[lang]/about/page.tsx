import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import NavList, { NavListItem } from "@/components/bds/NavList";
import { Wrap } from "@/components/bds/Layout";

/**
 * `/about` (Wave 5, REDESIGN-2.0 §3.2, Decision 2).
 *
 * The hub for "About BIRSA": committee, this year, minutes, decisions,
 * budget, elections, and how to reach a portfolio. Decision 2 sent two
 * concrete tasks here directly ("when is the next general meeting" to
 * minutes, "what the committee spent" to budget), which is why those two
 * sit first among the sections below rather than in alphabetical order.
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
    title: `${dict.about.hub.title}: ${dict.site.name}`,
    description: dict.about.hub.lede,
    path: "/about",
  });
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.about;

  const sections = [
    { href: "/about/minutes", ...t.hub.sections.minutes },
    { href: "/about/budget", ...t.hub.sections.budget },
    { href: "/about/decisions", ...t.hub.sections.decisions },
    { href: "/about/committee", ...t.hub.sections.committee },
    { href: "/about/portfolios", ...t.hub.sections.portfolios },
    { href: "/about/this-year", ...t.hub.sections.thisYear },
    { href: "/about/elections", ...t.hub.sections.elections },
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
      <Wrap className="py-10">
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
      </Wrap>
    </>
  );
}
