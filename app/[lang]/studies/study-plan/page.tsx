import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";

/**
 * `/studies/study-plan` (ROUTE-MAP-2.0 "Wave 5D").
 *
 * A LANDING PAGE, DELIBERATELY, NOT THE TOOL ITSELF. The brief for this wave
 * is explicit and repeated: "Do NOT touch app/[lang]/services/study-plan/ or
 * components/study-plan/... LINK to it; do not rebuild it and do not touch
 * it." The interactive multi-step tool (cohort, curriculum, where, minor,
 * assumed, plan) is a working service with its own passing tests, and it
 * stays exactly where it is, at `/services/study-plan`, unmodified. This page
 * is the `/studies` family's front door to it: what it does, what it needs,
 * and a link in.
 *
 * A CONTRACT TENSION FOUND HERE, reported rather than resolved unilaterally.
 * `lib/redirects.ts` (frozen) maps `/services/study-plan` and its whole
 * subtree, `subtree: true`, to `/studies/study-plan`. Taken literally, that
 * rule asks for `/studies/study-plan/cohort`, `/studies/study-plan/plan` and
 * so on to exist as real pages, which would mean either duplicating the
 * service's routing at a second location or moving it, both of which this
 * wave's brief explicitly forbids. Two things make it safe to leave that
 * rule unresolved rather than build the missing subtree: `proxy.ts` does not
 * yet import `resolveRedirect` from `lib/redirects.ts` at all, so the rule is
 * not live and `/services/study-plan` remains directly reachable exactly as
 * it is today; and wiring that map into `proxy.ts` is not a path this wave
 * owns. Flagged in the wave report for whoever does that wiring: either the
 * study-plan redirect rule needs to become a bare (non-subtree) rule to this
 * landing page, or a future wave needs to actually migrate the service's
 * routes, and that is a decision for the redirect map's owner, not this
 * agent.
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
  const t = getDictionary(locale).studyPlan;
  return buildMetadata({
    locale,
    title: t.title,
    description: t.lede,
    path: "/studies/study-plan",
  });
}

export default async function StudyPlanLandingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.studyPlan;
  const familyLabel = dict.studiesIndex.title;

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
        <Stack gap="sm">
          <Heading level={2} step="heading-2">
            {t.aboutHeading}
          </Heading>
          <Text step="body" className="text-muted">
            {t.aboutBody}
          </Text>
        </Stack>

        <Stack gap="sm">
          <Heading level={2} step="heading-2">
            {t.privacyHeading}
          </Heading>
          <Text step="body" className="text-muted">
            {t.privacyBody}
          </Text>
        </Stack>

        <div>
          <Button href={localeHref(locale, "/services/study-plan")} variant="start">
            {t.startLabel}
          </Button>
        </div>

        <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:gap-6">
          <Button href={localeHref(locale, "/studies/curriculum")} variant="secondary">
            {t.curriculumCta}
          </Button>
          <Button href={localeHref(locale, "/studies/course-reviews")} variant="secondary">
            {t.courseReviewsCta}
          </Button>
        </div>
      </div>
    </>
  );
}
