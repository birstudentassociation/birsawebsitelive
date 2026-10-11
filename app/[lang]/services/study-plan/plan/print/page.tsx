import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { listPublishedReviewsByCourse } from "@/lib/course-review/published";
import { findingSourcesFor } from "@/lib/course-review/reviewSources";
import { deserialisePlan, PLAN_FIELD } from "@/lib/study-plan/plan";
import { generatedOnForPrint } from "@/lib/study-plan/print";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PlanDocument from "@/components/study-plan/PlanDocument";
import { buildStudyPlanCopy } from "@/components/study-plan/studyPlanCopy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const copy = buildStudyPlanCopy(locale);

  return buildMetadata({
    locale,
    title: copy.print.title,
    description: copy.print.title,
    path: "/services/study-plan/plan/print",
  });
}

/**
 * The print page: everything on one page, no forms and no editing, meant to
 * be kept or printed for the student's own reference.
 *
 * The layout is `PlanDocument`, the same component the advisor's read-only
 * view renders, so the two cannot drift apart. This page supplies what is
 * its own: the title, the date it was generated, each term's assessment and
 * workload lines, and the reviews published from the database, which its
 * findings count. The printout is read away from the service, so
 * `PlanDocument` also carries the caveat about what the plan does not check.
 *
 * Passed courses are listed flat, not grouped by term: `StudyPlan.passed` is
 * a flat list with no term attribution, because the service never records
 * which term a passed course was taken in (see the header comment on
 * lib/study-plan/print.ts for why reconstructing that from the recommended
 * plan would be presenting a guess as fact). Only the terms the student
 * actually built (`plan.terms`) are grouped by term, because those carry
 * real term attribution the student chose.
 */
export default async function StudyPlanPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [PLAN_FIELD]?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const copy = buildStudyPlanCopy(locale);

  const { [PLAN_FIELD]: rawPlan } = await searchParams;
  const plan = rawPlan ? deserialisePlan(rawPlan) : null;
  if (!plan) {
    redirect(localeHref(locale, "/services/study-plan/minor"));
  }

  return (
    <div className="wrap max-w-[var(--measure)] py-10">
      <PlanDocument
        plan={plan}
        locale={locale}
        copy={copy}
        title={copy.print.title}
        sectionLevel={2}
        extraFacts={[{ label: copy.print.generatedOnLabel, value: generatedOnForPrint(locale) }]}
        termLines
        sources={findingSourcesFor(await listPublishedReviewsByCourse())}
      />
    </div>
  );
}
