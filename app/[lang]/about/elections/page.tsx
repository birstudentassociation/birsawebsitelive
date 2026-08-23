import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import { Heading, Text } from "@/components/bds/Type";
import { Wrap } from "@/components/bds/Layout";

/**
 * `/about/elections` (Wave 5, REDESIGN-2.0 §3.2).
 *
 * The facts here are real, not invented: they come from the Faculty's own
 * regulation, Part 9, "The BIR Election Committee (กกต.BIR)"
 * (`content/activity/regulations/part09.ts`, provisions 75 to 78), which is
 * already published on the live site at `/activity/regulations`. This page
 * only summarises that regulation's own procedural facts (that a dedicated
 * election committee runs the election, chaired by a Faculty administrator
 * rather than a student, formed within 30 days of the second semester
 * opening) and links to the full text rather than restating it, so the two
 * pages cannot drift apart. No date, candidate or result is stated here,
 * because none is a fact this wave has a source for.
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
    title: `${dict.about.elections.title}: ${dict.site.name}`,
    description: dict.about.elections.lede,
    path: "/about/elections",
  });
}

export default async function AboutElectionsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.about.elections;

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
      <Wrap className="flex flex-col gap-8 py-10">
        <section className="flex flex-col gap-3">
          <Heading level={2}>{t.committeeHeading}</Heading>
          <Text step="body">{t.committeeBody}</Text>
        </section>

        <section className="flex flex-col gap-3">
          <Heading level={2}>{t.timingHeading}</Heading>
          <Text step="body">{t.timingBody}</Text>
        </section>

        <section className="flex flex-col gap-3">
          <Heading level={2}>{t.resultsHeading}</Heading>
          <Text step="body">{t.resultsBody}</Text>
          <div className="flex flex-wrap gap-3">
            <Button href={localeHref(locale, "/about/decisions")} variant="secondary">
              {t.resultsCta}
            </Button>
            <Button href={localeHref(locale, "/activity/regulations/political-science-2565")} variant="secondary">
              {t.regulationCta}
            </Button>
          </div>
        </section>
      </Wrap>
    </>
  );
}
