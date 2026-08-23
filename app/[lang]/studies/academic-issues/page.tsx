import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import Notice from "@/components/bds/Notice";
import Accordion from "@/components/bds/Accordion";
import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";

/**
 * `/studies/academic-issues` (ROUTE-MAP-2.0 "Wave 5D").
 *
 * THE PAGE THIS WAVE'S BRIEF SINGLES OUT. Decision 2 in
 * `docs/DECISIONS-2.0.md` records that a real student's first instinct, when
 * asked where to drop a course late in the term, was Get help, not Your
 * studies, and the operator overrode that to Your studies. This page is why
 * that override can hold: it is linked from the `/studies` family index with
 * its own topic list ("Dropping or withdrawing from a course" listed first),
 * so a reader scanning that index sees their exact task before they ever
 * click through.
 *
 * SOURCE OF FACTS: every rule below is the BIR-specific rewrite already
 * published at `content/student-life/{en,th}/handbook/academic-life.mdx`
 * (SCOPE-AUDIT-2.0 §3.1, KEEP), copied into `studies.academicIssues` rather
 * than re-derived. Nothing here is invented: no deadline, credit figure or
 * grade rule appears that the handbook document does not already state. The
 * one thing the handbook does not carry, a process for disputing a grade, is
 * stated here as an honest gap ("grades" topic) rather than filled in, per
 * this wave's brief.
 *
 * WHY AN ACCORDION. Each topic is a distinct task a student arrives already
 * knowing (drop a course, missed an exam, a warning letter): nobody needs
 * every section open to use one of them, which is exactly the FAQ shape
 * `components/bds/Accordion`'s own TSDoc describes, and unlike the warning
 * about consecutive WARNINGs below, none of these sections is content a
 * reader cannot afford to miss by not opening it.
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
  const t = getDictionary(locale).academicIssues;
  return buildMetadata({
    locale,
    title: t.title,
    description: t.lede,
    path: "/studies/academic-issues",
  });
}

export default async function AcademicIssuesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.academicIssues;
  const familyLabel = dict.studiesIndex.title;

  const topicOrder = [
    "dropping",
    "examAbsence",
    "leave",
    "warningProbation",
    "plagiarism",
    "grades",
  ] as const;

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
              { label: familyLabel, href: "/studies" },
              { label: t.title },
            ]}
          />
        }
        helpSlot={
          <Button href={localeHref(locale, "/help")} variant="ghost">
            {dict.actions.getHelp}
          </Button>
        }
      />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
        <Text step="body" className="text-muted">
          {t.intro}
        </Text>

        <Notice variant="warning" title={t.warningLabel}>
          <Text step="body">{t.warningBody}</Text>
        </Notice>

        <Stack gap="sm" as="div">
          <Heading level={2} step="heading-2">
            {t.topicsLabel}
          </Heading>
          <Accordion
            items={topicOrder.map((id) => {
              const topic = t.topics[id];
              return {
                id,
                summary: topic.summary,
                children: (
                  <Stack gap="sm" as="div">
                    {topic.paragraphs.map((paragraph, index) => (
                      <Text as="p" step="body-sm" key={index}>
                        {paragraph}
                      </Text>
                    ))}
                  </Stack>
                ),
              };
            })}
          />
        </Stack>

        <Stack gap="sm" as="div" className="border-t border-line pt-8">
          <Heading level={2} step="heading-2">
            {t.contactHeading}
          </Heading>
          <Text step="body" className="text-muted">
            {t.contactBody}
          </Text>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button href={localeHref(locale, "/studies/handbook/about-bir")} variant="secondary">
              {t.contactCta}
            </Button>
            <Button
              href={localeHref(locale, "/studies/handbook/academic-life")}
              variant="secondary"
            >
              {t.handbookCta}
            </Button>
          </div>
        </Stack>
      </div>
    </>
  );
}
