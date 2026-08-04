import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  CURRICULUM_VERSIONS,
  type CategoryId,
  type CurriculumVersion,
  type TermKind,
  type TermRef,
} from "@/content/curriculum";
import { nextTerm, planTotals, remainingRequirements, termIndex } from "@/lib/study-plan/derive";
import { checkPlan, projectedGraduation } from "@/lib/study-plan/findings";
import { deserialisePlan, PLAN_FIELD, serialisePlan } from "@/lib/study-plan/plan";
import {
  suggestForTerm,
  type SuggestedCourse,
  type TermSuggestion,
} from "@/lib/study-plan/suggest";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import InferenceNotice from "@/components/study-plan/InferenceNotice";
import FindingsList from "@/components/study-plan/FindingsList";
import TermEditor, {
  termKey,
  type TermEditorCourse,
  type TermEditorCourseGroup,
  type TermEditorSlot,
} from "@/components/study-plan/TermEditor";
import PlanStore from "@/components/study-plan/PlanStore";
import DeletePlanButton from "@/components/study-plan/DeletePlanButton";
import { buildStudyPlanCopy, type StudyPlanCopy } from "@/components/study-plan/studyPlanCopy";
import {
  addCourseToTerm,
  addTermToPlan,
  deleteStudyPlan,
  getStudyPlanDraft,
  populatePlanFromRecommended,
  removeCourseFromTerm,
  setTermFreeElectiveCredits,
} from "../actions";

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
    title: copy.plan.title,
    description: copy.plan.hint,
    path: "/services/study-plan/plan",
  });
}

/** e.g. "Year 3, Semester 1", built from the same `copy.terms` labels every other step in this journey uses. */
function formatTermLabel(copy: StudyPlanCopy, term: TermRef): string {
  return `${copy.terms.yearTemplate.replace("{n}", String(term.year))}, ${copy.terms[term.kind]}`;
}

/**
 * Name for one row of "what you still owe". The three minor buckets are
 * named for the student's actual chosen minor, not generically, so a student
 * never has to remember which minor they picked to read their own plan; the
 * `minorElectiveOther` bucket (a student's electives from a minor other than
 * their own) is likewise anchored to the chosen minor, since that is what
 * makes those credits "other" in the first place.
 */
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

/** Converts one engine-side suggested course into the shape `TermEditor` renders. */
function toTermEditorCourse(course: SuggestedCourse): TermEditorCourse {
  return {
    code: course.code,
    title: course.title,
    credits: course.credits,
    missingPrerequisites: course.missingPrerequisites,
  };
}

/**
 * Turns `suggestForTerm`'s groups into what `TermEditor` renders, resolving
 * each group's label. The "recommended" and "other" groups get fixed copy
 * and owe nothing (their `remaining` is always 0 from the engine, mapped to
 * null here since the idea of "credits still needed" does not apply to
 * them); a requirement bucket goes through `categoryLabel`, the same helper
 * the "what you still owe" table above uses, so a minor bucket reads as the
 * student's own minor in both places and the two can never quietly drift
 * apart on how they name it.
 */
function buildCourseGroups(
  copy: StudyPlanCopy,
  version: CurriculumVersion,
  locale: Locale,
  minorName: string,
  suggestion: TermSuggestion
): TermEditorCourseGroup[] {
  return suggestion.groups.map((group) => {
    if (group.id === "recommended") {
      return {
        id: group.id,
        label: copy.plan.pickRecommendedGroup,
        remaining: null,
        courses: group.courses.map(toTermEditorCourse),
      };
    }
    if (group.id === "other") {
      return {
        id: group.id,
        label: copy.plan.pickOtherGroup,
        remaining: null,
        courses: group.courses.map(toTermEditorCourse),
      };
    }
    const categoryName = version.categories.find((c) => c.id === group.id)?.name[locale] ?? "";
    return {
      id: group.id,
      label: categoryLabel(copy, group.id, categoryName, minorName),
      remaining: group.remaining,
      courses: group.courses.map(toTermEditorCourse),
    };
  });
}

/**
 * The plan screen: the destination the whole service exists to produce. Shows
 * the plan, checks it against the rules without ever blocking on what it
 * finds (see `lib/study-plan/findings.ts`), and lets the student edit every
 * term ahead of them.
 */
export default async function StudyPlanPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [PLAN_FIELD]?: string; term?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const copy = buildStudyPlanCopy(locale);

  const { [PLAN_FIELD]: rawPlan, term: requestedTermKey } = await searchParams;
  const plan = rawPlan ? deserialisePlan(rawPlan) : null;
  if (!plan) {
    redirect(localeHref(locale, "/services/study-plan/minor"));
  }

  // readDraft is safe to call during render (read-only); the draft is only
  // ever written from a Server Action.
  const draft = await getStudyPlanDraft();
  if (!draft.positionYear || !draft.positionKind) {
    redirect(localeHref(locale, "/services/study-plan/where"));
  }
  const position: TermRef = {
    year: Number(draft.positionYear),
    kind: draft.positionKind as TermKind,
  };

  const version = CURRICULUM_VERSIONS[plan.versionId];
  const chosenMinor = version.minors.find((m) => m.id === plan.minorId);
  const minorName = chosenMinor?.name[locale] ?? "";
  const courseByCode = new Map(version.courses.value.map((c) => [c.code, c]));

  const { allCodes, totalFreeElectiveCredits } = planTotals(plan);

  const findings = checkPlan(version, plan);
  const shortfalls = remainingRequirements(
    version,
    allCodes,
    plan.minorId,
    totalFreeElectiveCredits
  );
  const totalRemaining = shortfalls.reduce((n, s) => n + s.remaining, 0);
  const earnedCredits = version.graduationCredits.value - totalRemaining;

  const projected = projectedGraduation(plan);

  // Every future term is offered for editing, whether or not the student has
  // put anything in it yet. The recommended plan's own term list seeds this
  // (exactly as `assumedHistory` uses the same `termIndex` cutoff to decide
  // which terms are already in the past), but it is not the only source: a
  // student running behind the recommended plan's nominal end (see
  // `addTermToPlan`) has appended terms of their own, and those have to keep
  // showing up here too, or they would vanish again on the next render.
  const cutoff = termIndex(position);
  const recommendedFutureTerms = version.recommendedPlan.value
    .map((t) => t.term)
    .filter((term) => termIndex(term) >= cutoff);
  const seenTermKeys = new Set<string>();
  const futureTerms: TermRef[] = [];
  for (const term of [...recommendedFutureTerms, ...plan.terms.map((t) => t.term)]) {
    const key = termKey(term);
    if (seenTermKeys.has(key)) continue;
    seenTermKeys.add(key);
    futureTerms.push(term);
  }
  futureTerms.sort((a, b) => termIndex(a) - termIndex(b));

  // Exactly one term is expanded, so the screen offers one thing to act on
  // rather than ten. Which one is the server's decision, not the browser's:
  // every plan-editing action redirects back here with `?term=` naming the
  // term it just changed, so the student returns to the term they were
  // working in with it still open. That keeps a JavaScript-off browser and a
  // scripted one identical, rather than relying on a browser expanding a
  // `<details>` because the URL fragment points inside it. Falling back to the
  // nearest term is the right default on first arrival: it is the one the
  // student is registering for now.
  const openTermKey =
    requestedTermKey && seenTermKeys.has(requestedTermKey)
      ? requestedTermKey
      : futureTerms[0]
        ? termKey(futureTerms[0])
        : null;

  // The term "Add another term" would append: the term after the last one
  // currently shown, or the student's own position when the list above is
  // empty (a recommended plan shorter than where the student already is).
  // Null once `nextTerm` hits the year-8 cap, which hides the control.
  const lastShownTerm = futureTerms.at(-1) ?? null;
  const nextTermRef = lastShownTerm ? nextTerm(lastShownTerm) : position;

  const serialisedPlan = serialisePlan(plan);
  const printHref = `${localeHref(locale, "/services/study-plan/plan/print")}?${PLAN_FIELD}=${encodeURIComponent(serialisedPlan)}`;

  const termEditorCopy = {
    creditsTemplate: copy.plan.termCreditsTemplate,
    addLabel: copy.plan.addCourseLabel,
    addPrompt: copy.plan.addCoursePrompt,
    addButtonLabel: copy.plan.addCourseButton,
    noCoursesAvailable: copy.plan.noCoursesAvailable,
    removeLabel: copy.plan.removeCourseButton,
    freeElectiveLabel: copy.plan.freeElectiveLabel,
    updateFreeElectiveLabel: copy.plan.updateFreeElectiveButton,
    creditsUnit: copy.plan.creditsUnit,
    errorSummaryTitle: copy.errorSummaryTitle,
    pickHeading: copy.plan.pickHeading,
    pickSlotAnyCourse: copy.plan.pickSlotAnyCourse,
    pickNothingOwed: copy.plan.pickNothingOwed,
    termEmpty: copy.plan.termEmpty,
    moreOptionsLabel: copy.plan.moreOptionsLabel,
    moreCandidatesTemplate: copy.plan.moreCandidatesTemplate,
    recommendedTermCompleteTemplate: copy.plan.recommendedTermCompleteTemplate,
    pickRemainingTemplate: copy.plan.pickRemainingTemplate,
    pickPrerequisiteTemplate: copy.plan.pickPrerequisiteTemplate,
    internshipOnlyTerm: copy.plan.internshipOnlyTerm,
  };

  return (
    <>
      <PageHeader title={copy.plan.title} lede={copy.plan.hint} />
      {/* Renders nothing; only mirrors the plan to localStorage so it survives closing the tab. */}
      <PlanStore plan={serialisedPlan} />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-10 py-10">
        <InferenceNotice version={version} cohortCode={plan.cohort} locale={locale} />

        <div className="border-line flex flex-col gap-4 rounded-lg border p-5">
          <h2 className="font-display text-xl">{version.label[locale]}</h2>
          <dl className="grid gap-6 sm:grid-cols-3">
            <div>
              <dt className="text-muted text-sm font-semibold">{copy.plan.cohortLabel}</dt>
              <dd className="text-ink text-lg font-semibold">{plan.cohort}</dd>
            </div>
            <div>
              <dt className="text-muted text-sm font-semibold">{copy.plan.creditsPlannedLabel}</dt>
              <dd className="text-ink text-lg font-semibold">
                {earnedCredits} / {version.graduationCredits.value}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-sm font-semibold">
                {copy.plan.projectedGraduationLabel}
              </dt>
              <dd className="text-ink text-lg font-semibold">
                {projected ? formatTermLabel(copy, projected) : copy.plan.noProjectedGraduation}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="font-display text-xl">{copy.plan.findingsHeading}</h2>
          <div className="mt-4">
            <FindingsList
              findings={findings}
              locale={locale}
              emptyMessage={copy.plan.findingsEmpty}
            />
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl">{copy.plan.owedHeading}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-sm">
              <thead>
                <tr className="border-line border-b text-left">
                  <th className="text-muted py-2 pr-3 font-semibold">
                    {copy.plan.owedCategoryHeader}
                  </th>
                  <th className="text-muted py-2 pr-3 font-semibold">
                    {copy.plan.owedEarnedHeader}
                  </th>
                  <th className="text-muted py-2 font-semibold">{copy.plan.owedRemainingHeader}</th>
                </tr>
              </thead>
              <tbody>
                {shortfalls.map((shortfall) => (
                  <tr key={shortfall.category.id} className="border-line border-b">
                    <td className="text-ink py-2 pr-3">
                      {categoryLabel(
                        copy,
                        shortfall.category.id,
                        shortfall.category.name[locale],
                        minorName
                      )}
                    </td>
                    <td className="text-ink py-2 pr-3">{shortfall.earned}</td>
                    <td className="text-ink py-2">{shortfall.remaining}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-display text-xl">{copy.plan.termsHeading}</h2>
          <p className="text-muted leading-relaxed">{copy.plan.termsHint}</p>

          {/*
            Before the term list, not after it: filling every term at once is
            the shortcut past the forty add-a-course presses the list below
            would otherwise cost, so it has to be visible before the student
            starts making them. Its own bordered card competed with the term
            cards it sits above, so it is now a plain block: the same words,
            the same plain form that works with JavaScript off, but visibly
            introduction to the list rather than another item in it.
          */}
          <div className="flex flex-col gap-3">
            <p className="text-muted leading-relaxed">{copy.plan.populateHint}</p>
            <form action={populatePlanFromRecommended.bind(null, locale)}>
              <input type="hidden" name={PLAN_FIELD} value={serialisedPlan} />
              <Button type="submit" variant="secondary">
                {copy.plan.populateButton}
              </Button>
            </form>
          </div>

          {futureTerms.map((term) => {
            const plannedTerm = plan.terms.find(
              (t) => t.term.year === term.year && t.term.kind === term.kind
            );
            // Courses already placed in this term carry no prerequisite
            // annotation: the picker annotates a course to warn before it is
            // added, while a course already in the plan is checked by
            // `checkPlan` and reported in the findings list at the top of this
            // page, which states the same problem once for the whole plan
            // rather than once per term. Repeating it on every placed course
            // would be the same warning twice in two voices.
            const placed = (plannedTerm?.codes ?? []).map((code) => {
              const course = courseByCode.get(code);
              return {
                code,
                title: course?.title ?? "",
                credits: course?.credits ?? 0,
                missingPrerequisites: [],
              };
            });
            const suggestion = suggestForTerm(version, plan, term);
            const courseGroups = buildCourseGroups(copy, version, locale, minorName, suggestion);
            const openSlots: TermEditorSlot[] = suggestion.openSlots.map((slot) => ({
              id: slot.id,
              label: slot.label[locale],
              candidates: slot.candidates.map(toTermEditorCourse),
            }));
            return (
              <TermEditor
                key={termKey(term)}
                term={term}
                defaultOpen={termKey(term) === openTermKey}
                termLabel={formatTermLabel(copy, term)}
                plan={serialisedPlan}
                placed={placed}
                freeElectiveCredits={plannedTerm?.freeElectiveCredits ?? 0}
                courseGroups={courseGroups}
                openSlots={openSlots}
                internshipOnly={suggestion.internshipOnly}
                recommendedTermComplete={suggestion.recommendedTermComplete}
                recommendedCredits={suggestion.recommendedCredits}
                addAction={addCourseToTerm.bind(null, locale)}
                removeAction={removeCourseFromTerm.bind(null, locale)}
                freeElectiveAction={setTermFreeElectiveCredits.bind(null, locale)}
                copy={termEditorCopy}
              />
            );
          })}

          {nextTermRef ? (
            <form action={addTermToPlan.bind(null, locale)}>
              <input type="hidden" name={PLAN_FIELD} value={serialisedPlan} />
              <input type="hidden" name="year" value={nextTermRef.year} />
              <input type="hidden" name="kind" value={nextTermRef.kind} />
              <Button type="submit" variant="secondary">
                {copy.plan.addTermButton}
              </Button>
            </form>
          ) : null}
        </div>

        <div>
          <Link href={printHref} className="text-brand-deep font-semibold hover:underline">
            {copy.plan.printLinkLabel} &rarr;
          </Link>
        </div>

        <Notice variant="info" title={copy.plan.doesNotCheckHeading}>
          <ul className="flex flex-col gap-1.5">
            {copy.plan.doesNotCheck.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true">&bull;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Notice>

        <div className="border-line flex flex-col gap-3 rounded-lg border p-5">
          <h2 className="font-display text-xl">{copy.delete.heading}</h2>
          <p className="text-muted leading-relaxed">{copy.delete.body}</p>
          <form action={deleteStudyPlan.bind(null, locale)}>
            <DeletePlanButton>{copy.delete.buttonLabel}</DeletePlanButton>
          </form>
        </div>
      </div>
    </>
  );
}
