import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { CURRICULUM_VERSIONS, SOURCES } from "@/content/curriculum";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import Notice from "@/components/bds/Notice";
import Table from "@/components/bds/Table";
import ExternalLink from "@/components/bds/ExternalLink";
import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";

/**
 * `/studies/curriculum` (ROUTE-MAP-2.0 "Wave 5D").
 *
 * SOURCE OF DATA: `content/curriculum` (frozen, read only). This is the same
 * data the study plan service plans against, not a second, separately
 * authored copy: the "2568" version (cohorts 68 and 69, the current intake),
 * its credit categories, its three minors and its 94-course catalogue, all
 * read straight from the module rather than re-typed here. Every figure this
 * page states (126 total credits, 9 credits per elective group, and so on)
 * was checked against `CURRICULUM_VERSIONS["2568"]` before being written into
 * the dictionary copy, so nothing on this page is an invented number.
 *
 * THE WIDE TABLE. The 94-row course catalogue is the widest table in this
 * wave (BUILD-BRIEF-2.0 section 7 calls this out specifically): it scrolls
 * inside `Table`'s own `overflow-x-auto` region, never the page itself, and
 * that region is `tabIndex={0}` with an accessible name from the caption, so
 * it is reachable and operable from the keyboard alone.
 */

const CURRENT_VERSION_ID = "2568" as const;

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
  const t = getDictionary(locale).curriculum;
  return buildMetadata({
    locale,
    title: t.title,
    description: t.lede,
    path: "/studies/curriculum",
  });
}

export default async function CurriculumPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.curriculum;
  const familyLabel = dict.studiesIndex.title;

  const version = CURRICULUM_VERSIONS[CURRENT_VERSION_ID];
  const categoryName = new Map(version.categories.map((c) => [c.id, c.name]));
  const sourceUrl = SOURCES.comparison2568.url;

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
      <div className="wrap flex flex-col gap-10 py-10">
        <Notice variant="info" title={t.versionNoteTitle}>
          <Text step="body">{t.versionNoteBody}</Text>
        </Notice>

        <section className="flex flex-col gap-4">
          <Heading level={2} step="heading-2">
            {t.categoriesHeading}
          </Heading>
          <Text step="body" className="max-w-[var(--measure)] text-muted">
            {t.categoriesIntro}
          </Text>

          <Table
            caption={t.categoriesHeading}
            captionHidden
            rowHeaders
            columns={[
              { key: "name", header: t.categoriesHeading },
              { key: "credits", header: t.totalLabel, align: "right" },
            ]}
            rows={version.categories.map((category) => ({
              name: category.name[locale],
              credits: category.credits,
            }))}
            rowKey={(row) => String(row.name)}
          />

          <div className="flex items-center justify-between gap-4 rounded-lg border border-line bg-sunken p-5">
            <Text step="body" className="font-semibold text-ink">
              {t.totalLabel}
            </Text>
            <Heading level={3} step="display-1">
              {version.graduationCredits.value}
            </Heading>
          </div>
        </section>

        <section className="flex flex-col gap-4 border-t border-line pt-8">
          <Heading level={2} step="heading-2">
            {t.catalogueHeading}
          </Heading>
          <Text step="body" className="max-w-[var(--measure)] text-muted">
            {t.catalogueIntro}
          </Text>

          <Table
            caption={t.catalogueCaption}
            rowHeaders
            columns={[
              { key: "code", header: t.columnCode },
              { key: "title", header: t.columnTitle },
              { key: "credits", header: t.columnCredits, align: "right" },
              { key: "category", header: t.columnCategory },
            ]}
            rows={version.courses.value.map((course) => ({
              code: course.code,
              title: course.title,
              credits: course.credits,
              category:
                course.category === "minor"
                  ? t.minorCategoryLabel
                  : (categoryName.get(course.category)?.[locale] ?? course.category),
            }))}
            rowKey={(row) => String(row.code)}
          />

          {sourceUrl ? (
            <Text step="body-sm">
              <ExternalLink href={sourceUrl} newTabLabel={dict.a11y.newTab}>
                {t.sourceLabel}
              </ExternalLink>
            </Text>
          ) : null}
        </section>

        <section className="flex flex-col gap-8 border-t border-line pt-8">
          <Stack gap="sm" as="div">
            <Heading level={2} step="heading-2">
              {t.electivesHeading}
            </Heading>
            <Text step="body" className="max-w-[var(--measure)] text-muted">
              {t.electivesIntro}
            </Text>
          </Stack>

          <Stack gap="xs" as="div">
            <Heading level={3} step="heading-3">
              {t.areaStudiesHeading}
            </Heading>
            <Text step="body" className="max-w-[var(--measure)] text-muted">
              {t.areaStudiesBody}
            </Text>
          </Stack>

          <Stack gap="xs" as="div">
            <Heading level={3} step="heading-3">
              {t.approachesHeading}
            </Heading>
            <Text step="body" className="max-w-[var(--measure)] text-muted">
              {t.approachesBody}
            </Text>
          </Stack>

          <Stack gap="xs" as="div">
            <Heading level={3} step="heading-3">
              {t.minorsHeading}
            </Heading>
            <Text step="body" className="max-w-[var(--measure)] text-muted">
              {t.minorsBody}
            </Text>
            <ul className="mt-1 flex flex-col gap-1">
              {version.minors.map((minor) => (
                <Text as="li" step="body-sm" key={minor.id} className="text-ink">
                  {minor.name[locale]}
                </Text>
              ))}
            </ul>
          </Stack>

          <Stack gap="xs" as="div">
            <Heading level={3} step="heading-3">
              {t.freeElectiveHeading}
            </Heading>
            <Text step="body" className="max-w-[var(--measure)] text-muted">
              {t.freeElectiveBody}
            </Text>
          </Stack>
        </section>

        <div className="flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:gap-6">
          <Button href={localeHref(locale, "/studies/course-reviews")} variant="secondary">
            {t.courseReviewsCta}
          </Button>
          <Button href={localeHref(locale, "/studies/study-plan")} variant="secondary">
            {t.studyPlanCta}
          </Button>
        </div>
      </div>
    </>
  );
}
