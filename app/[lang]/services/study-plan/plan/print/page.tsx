import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CURRICULUM_VERSIONS, type CategoryId, type TermKind, type TermRef } from "@/content/curriculum";
import { remainingRequirements, termIndex } from "@/lib/study-plan/derive";
import { checkPlan } from "@/lib/study-plan/findings";
import { deserialisePlan, PLAN_FIELD } from "@/lib/study-plan/plan";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import InferenceNotice from "@/components/study-plan/InferenceNotice";
import FindingsList from "@/components/study-plan/FindingsList";
import { buildStudyPlanCopy, type StudyPlanCopy } from "@/components/study-plan/studyPlanCopy";
import { getStudyPlanDraft } from "../../actions";

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

/** e.g. "Year 3, Semester 1", built from the same `copy.terms` labels every other step in this journey uses. */
function formatTermLabel(copy: StudyPlanCopy, term: TermRef): string {
  return `${copy.terms.yearTemplate.replace("{n}", String(term.year))}, ${copy.terms[term.kind]}`;
}

/** See the identical function on the plan screen: the three minor buckets are named for the student's actual chosen minor. */
function categoryLabel(
  copy: StudyPlanCopy,
  categoryId: CategoryId,
  categoryName: string,
  minorName: string
): string {
  switch (categoryId) {
    case "minorRequired":
      return copy.plan.minorRequiredTemplate.replace("{minor}", minorName);
    case "minorElective":
      return copy.plan.minorElectiveTemplate.replace("{minor}", minorName);
    case "minorElectiveOther":
      return copy.plan.minorElectiveOtherTemplate.replace("{minor}", minorName);
    default:
      return categoryName;
  }
}

type PrintTerm = {
  term: TermRef;
  courses: { code: string; title: string; credits: number }[];
  freeElectiveCredits: number;
};

/**
 * The print page: everything on one page, no forms and no editing, meant to
 * be handed to an advisor. Terms before the student's current position come
 * from the recommended plan filtered to what they actually passed (the same
 * derivation `assumedHistory` uses for the "check what we have assumed"
 * step); terms at or after it come straight from the plan the student built.
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

  const draft = await getStudyPlanDraft();
  if (!draft.positionYear || !draft.positionKind) {
    redirect(localeHref(locale, "/services/study-plan/where"));
  }
  const position: TermRef = { year: Number(draft.positionYear), kind: draft.positionKind as TermKind };

  const version = CURRICULUM_VERSIONS[plan.versionId];
  const chosenMinor = version.minors.find((m) => m.id === plan.minorId);
  const minorName = chosenMinor?.name[locale] ?? "";
  const courseByCode = new Map(version.courses.value.map((c) => [c.code, c]));
  const passedSet = new Set(plan.passed);

  const cutoff = termIndex(position);
  const pastTerms: PrintTerm[] = [];
  for (const plannedTerm of version.recommendedPlan.value) {
    if (termIndex(plannedTerm.term) >= cutoff) continue;
    const courses: { code: string; title: string; credits: number }[] = [];
    for (const entry of plannedTerm.entries) {
      if (entry.kind !== "course" || !passedSet.has(entry.code)) continue;
      const course = courseByCode.get(entry.code);
      courses.push({ code: entry.code, title: course?.title ?? "", credits: course?.credits ?? 0 });
    }
    if (courses.length === 0) continue;
    pastTerms.push({ term: plannedTerm.term, courses, freeElectiveCredits: 0 });
  }

  const futureTerms: PrintTerm[] = plan.terms
    .filter((t) => t.codes.length > 0 || t.freeElectiveCredits > 0)
    .sort((a, b) => termIndex(a.term) - termIndex(b.term))
    .map((t) => ({
      term: t.term,
      courses: t.codes.map((code) => {
        const course = courseByCode.get(code);
        return { code, title: course?.title ?? "", credits: course?.credits ?? 0 };
      }),
      freeElectiveCredits: t.freeElectiveCredits,
    }));

  const allTerms = [...pastTerms, ...futureTerms];

  const plannedCodes = plan.terms.flatMap((t) => t.codes);
  const allCodes = [...new Set([...plan.passed, ...plannedCodes])];
  const plannedFreeElectives = plan.terms.reduce((n, t) => n + t.freeElectiveCredits, 0);
  const totalFreeElectiveCredits = plan.freeElectiveCreditsPassed + plannedFreeElectives;

  const findings = checkPlan(version, plan);
  const shortfalls = remainingRequirements(version, allCodes, plan.minorId, totalFreeElectiveCredits);

  const generatedOn = new Date().toLocaleDateString(locale === "th" ? "th-TH" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="wrap max-w-[var(--measure)] flex flex-col gap-8 py-10">
      <div>
        <h1 className="font-display text-3xl">{copy.print.title}</h1>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted font-semibold">{copy.print.curriculumLabel}</dt>
            <dd className="text-ink">{version.label[locale]}</dd>
          </div>
          <div>
            <dt className="text-muted font-semibold">{copy.print.cohortLabel}</dt>
            <dd className="text-ink">{plan.cohort}</dd>
          </div>
          <div>
            <dt className="text-muted font-semibold">{copy.print.minorLabel}</dt>
            <dd className="text-ink">{minorName}</dd>
          </div>
          <div>
            <dt className="text-muted font-semibold">{copy.print.generatedOnLabel}</dt>
            <dd className="text-ink">{generatedOn}</dd>
          </div>
        </dl>
      </div>

      <InferenceNotice version={version} cohortCode={plan.cohort} locale={locale} />

      <div>
        <h2 className="font-display text-xl">{copy.print.termsHeading}</h2>
        <div className="mt-4 flex flex-col gap-4">
          {allTerms.map((printTerm) => {
            const termCredits =
              printTerm.courses.reduce((n, c) => n + c.credits, 0) + printTerm.freeElectiveCredits;
            return (
              <div key={`${printTerm.term.year}-${printTerm.term.kind}`} className="border-line rounded-lg border p-4">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-lg">{formatTermLabel(copy, printTerm.term)}</h3>
                  <p className="text-muted text-sm">
                    {termCredits} {copy.plan.creditsUnit}
                  </p>
                </div>
                {printTerm.courses.length > 0 ? (
                  <ul className="mt-2 flex flex-col gap-1 text-sm">
                    {printTerm.courses.map((course) => (
                      <li key={course.code}>
                        <span className="font-semibold">{course.code}</span>
                        {course.title ? ` ${course.title}` : ""} &middot; {course.credits}{" "}
                        {copy.plan.creditsUnit}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {printTerm.freeElectiveCredits > 0 ? (
                  <p className="text-muted mt-2 text-sm">
                    {copy.print.freeElectiveCreditsTemplate.replace(
                      "{n}",
                      String(printTerm.freeElectiveCredits)
                    )}
                  </p>
                ) : null}
                {printTerm.courses.length === 0 && printTerm.freeElectiveCredits === 0 ? (
                  <p className="text-muted mt-2 text-sm">{copy.print.noCoursesInTerm}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl">{copy.print.findingsHeading}</h2>
        <div className="mt-4">
          <FindingsList findings={findings} locale={locale} emptyMessage={copy.print.findingsEmpty} />
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl">{copy.print.owedHeading}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-sm">
            <thead>
              <tr className="border-line border-b text-left">
                <th className="text-muted py-2 pr-3 font-semibold">{copy.print.owedCategoryHeader}</th>
                <th className="text-muted py-2 pr-3 font-semibold">{copy.print.owedEarnedHeader}</th>
                <th className="text-muted py-2 font-semibold">{copy.print.owedRemainingHeader}</th>
              </tr>
            </thead>
            <tbody>
              {shortfalls.map((shortfall) => (
                <tr key={shortfall.category.id} className="border-line border-b">
                  <td className="text-ink py-2 pr-3">
                    {categoryLabel(copy, shortfall.category.id, shortfall.category.name[locale], minorName)}
                  </td>
                  <td className="text-ink py-2 pr-3">{shortfall.earned}</td>
                  <td className="text-ink py-2">{shortfall.remaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
