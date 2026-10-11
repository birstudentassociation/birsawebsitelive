import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CURRICULUM_VERSIONS, type CurriculumVersion, type TermRef } from "@/content/curriculum";
import { courseContextLine } from "@/lib/course-review/context";
import {
  OFFERING_HISTORY_NOTICE,
  historyLine,
  offeringHistory,
} from "@/lib/courses/offeringHistory";
import { ADD_PARAM, applyAddParam } from "@/lib/study-plan/addToPlan";
import {
  nextTerm,
  planTotals,
  remainingRequirements,
  screenTerms,
  termKey,
} from "@/lib/study-plan/derive";
import { profileLine, termAssessmentProfile } from "@/lib/study-plan/assessmentProfile";
import { checkPlan, projectedGraduation } from "@/lib/study-plan/findings";
import { deserialisePlan, PLAN_FIELD, serialisePlan } from "@/lib/study-plan/plan";
import { resolvePosition } from "@/lib/study-plan/position";
import {
  AWAY_FIELD,
  AWAY_KIND_FIELD,
  COMPARE_FIELD,
  COMPARE_NAME_FIELD,
  MINOR_FIELD,
} from "@/lib/study-plan/scenarioStore";
import { criticalPath, whatIf } from "@/lib/study-plan/whatIf";
import { whatIfSentences } from "@/lib/study-plan/whatIfText";
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
import AddOutcomeNotice from "@/components/study-plan/AddOutcomeNotice";
import InferenceNotice from "@/components/study-plan/InferenceNotice";
import FindingsList from "@/components/study-plan/FindingsList";
import TermEditor, {
  type TermEditorCourse,
  type TermEditorCourseGroup,
  type TermEditorSlot,
} from "@/components/study-plan/TermEditor";
import PlanStore from "@/components/study-plan/PlanStore";
import DeletePlanButton from "@/components/study-plan/DeletePlanButton";
import ScenarioSection from "@/components/study-plan/ScenarioSection";
import { buildTermInsightCopy } from "@/components/study-plan/termInsightCopy";
import PlanOutreach from "@/components/study-plan/PlanOutreach";
import { buildPlanLinkCopy } from "@/components/study-plan/planLinkCopy";
import {
  buildStudyPlanCopy,
  categoryLabel,
  formatTermRef,
  type StudyPlanCopy,
} from "@/components/study-plan/studyPlanCopy";
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
  return formatTermRef(copy.terms, term);
}

/**
 * Converts one engine-side suggested course into the shape `TermEditor`
 * renders, adding the catalogue's one line of facts about it where there is
 * one. `contextLine` is built once per page render with the locale's copy.
 */
function toTermEditorCourse(
  course: SuggestedCourse,
  contextLine: (code: string) => string | null
): TermEditorCourse {
  return {
    code: course.code,
    title: course.title,
    credits: course.credits,
    missingPrerequisites: course.missingPrerequisites,
    context: contextLine(course.code),
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
  suggestion: TermSuggestion,
  contextLine: (code: string) => string | null
): TermEditorCourseGroup[] {
  const toCourse = (course: SuggestedCourse) => toTermEditorCourse(course, contextLine);
  return suggestion.groups.map((group) => {
    if (group.id === "recommended") {
      return {
        id: group.id,
        label: copy.plan.pickRecommendedGroup,
        remaining: null,
        courses: group.courses.map(toCourse),
      };
    }
    if (group.id === "other") {
      return {
        id: group.id,
        label: copy.plan.pickOtherGroup,
        remaining: null,
        courses: group.courses.map(toCourse),
      };
    }
    const categoryName = version.categories.find((c) => c.id === group.id)?.name[locale] ?? "";
    return {
      id: group.id,
      label: categoryLabel(copy.plan, group.id, categoryName, minorName),
      remaining: group.remaining,
      courses: group.courses.map(toCourse),
    };
  });
}

/** The first value of a query parameter, which Next types as a string or an array when repeated. */
function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
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
  searchParams: Promise<{
    [PLAN_FIELD]?: string;
    [ADD_PARAM]?: string | string[];
    term?: string | string[];
    notice?: string;
    [MINOR_FIELD]?: string | string[];
    [AWAY_FIELD]?: string | string[];
    [AWAY_KIND_FIELD]?: string | string[];
    [COMPARE_FIELD]?: string | string[];
    [COMPARE_NAME_FIELD]?: string | string[];
  }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const copy = buildStudyPlanCopy(locale);
  const linkCopy = buildPlanLinkCopy(locale);
  const insight = buildTermInsightCopy(locale);

  const query = await searchParams;
  const { [PLAN_FIELD]: rawPlan, [ADD_PARAM]: rawAdd, term: rawTermKey, notice } = query;
  const requestedTermKey = firstParam(rawTermKey);
  const addRequest = firstParam(rawAdd);
  const arrivingPlan = rawPlan ? deserialisePlan(rawPlan) : null;
  if (!arrivingPlan) {
    redirect(localeHref(locale, "/services/study-plan/minor"));
  }

  // readDraft is safe to call during render (read-only); the draft is only
  // ever written from a Server Action. The draft lasts thirty minutes, so a
  // plan resumed from the device days later arrives without it; the position
  // is then worked out from the cohort and today's date instead of sending
  // the student back through a question they answered when they built it.
  const draft = await getStudyPlanDraft();
  const position = resolvePosition(draft, arrivingPlan.cohort, new Date());
  if (!position) {
    redirect(localeHref(locale, "/services/study-plan/where"));
  }

  // A course page's "Add to plan" link arrives as `?add=CODE&term=KEY`. It is
  // applied to the plan that came with it before anything is drawn, and either
  // confirmed (with an undo that returns the plan exactly as it arrived) or
  // refused with the reason, in which case the plan on screen is the one that
  // arrived. It never throws: `applyAddParam` returns a refusal for anything
  // it cannot apply.
  const addOutcome =
    addRequest !== undefined
      ? applyAddParam(arrivingPlan, addRequest, requestedTermKey, position)
      : null;
  const plan = addOutcome?.status === "added" ? addOutcome.plan : arrivingPlan;

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

  // Courses whose deferral moves graduation, marked in the term lists.
  const critical = new Set(criticalPath(version, plan));

  // Every future term is offered for editing, whether or not the student has
  // put anything in it yet. The recommended plan's own term list seeds this
  // (exactly as `assumedHistory` uses the same `termIndex` cutoff to decide
  // which terms are already in the past), but it is not the only source: a
  // student running behind the recommended plan's nominal end (see
  // `addTermToPlan`) has appended terms of their own, and those have to keep
  // showing up here too, or they would vanish again on the next render.
  const futureTerms = screenTerms(version, plan, position);
  const seenTermKeys = new Set(futureTerms.map(termKey));

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
    courseLink: linkCopy.picker.courseLink,
    criticalLabel: insight.critical.label,
    criticalHint: insight.critical.hint,
    whatIfSummary: insight.whatIf.summary,
    courseSearch: { ...copy.courseSearch, prompt: copy.plan.addCoursePrompt },
  };
  const courseHref = (code: string) => localeHref(locale, `/student-life/course-reviews/${code}`);
  // The catalogue's facts about a course, then where it has been recorded as
  // taught. That second part is derived history, not an offering promise, and
  // the plan screen says so once, above the terms.
  const contextLine = (code: string) => {
    const history = offeringHistory(code);
    const parts = [
      courseContextLine(code, locale, linkCopy.picker),
      history ? historyLine(history, locale, insight.history) : null,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(" · ") : null;
  };
  const planHref = localeHref(locale, "/services/study-plan/plan");

  return (
    <>
      <PageHeader title={copy.plan.title} lede={copy.plan.hint} />
      {/* Renders nothing; only mirrors the plan to localStorage so it survives closing the tab. */}
      <PlanStore plan={serialisedPlan} defaultName={insight.scenarios.defaultName} />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-10 py-10">
        {addOutcome ? (
          <AddOutcomeNotice
            outcome={addOutcome}
            linkCopy={linkCopy}
            version={version}
            undoHref={`${planHref}?${PLAN_FIELD}=${encodeURIComponent(serialisePlan(arrivingPlan))}`}
          />
        ) : null}

        <InferenceNotice version={version} cohortCode={plan.cohort} locale={locale} />

        <div className="flex flex-col gap-4 rounded-lg border border-line p-5">
          <h2 className="font-display text-xl">{version.label[locale]}</h2>
          <dl className="grid gap-6 sm:grid-cols-3">
            <div>
              <dt className="text-sm font-semibold text-muted">{copy.plan.cohortLabel}</dt>
              <dd className="text-lg font-semibold text-ink">{plan.cohort}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-muted">{copy.plan.creditsPlannedLabel}</dt>
              <dd className="text-lg font-semibold text-ink">
                {earnedCredits} / {version.graduationCredits.value}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-muted">
                {copy.plan.projectedGraduationLabel}
              </dt>
              <dd className="text-lg font-semibold text-ink">
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
                <tr className="border-b border-line text-left">
                  <th className="py-2 pr-3 font-semibold text-muted">
                    {copy.plan.owedCategoryHeader}
                  </th>
                  <th className="py-2 pr-3 font-semibold text-muted">
                    {copy.plan.owedEarnedHeader}
                  </th>
                  <th className="py-2 font-semibold text-muted">{copy.plan.owedRemainingHeader}</th>
                </tr>
              </thead>
              <tbody>
                {shortfalls.map((shortfall) => (
                  <tr key={shortfall.category.id} className="border-b border-line">
                    <td className="py-2 pr-3 text-ink">
                      {categoryLabel(
                        copy.plan,
                        shortfall.category.id,
                        shortfall.category.name[locale],
                        minorName
                      )}
                    </td>
                    <td className="py-2 pr-3 text-ink">{shortfall.earned}</td>
                    <td className="py-2 text-ink">{shortfall.remaining}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-display text-xl">{copy.plan.termsHeading}</h2>
          <p className="leading-relaxed text-muted">{copy.plan.termsHint}</p>
          <p className="text-sm leading-relaxed text-muted">
            <span className="font-semibold text-ink">{insight.historyNoticeTitle}. </span>
            {OFFERING_HISTORY_NOTICE[locale]}
          </p>
          {notice === "termFull" ? (
            <Notice variant="warning">{copy.plan.termFullError}</Notice>
          ) : null}

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
            <p className="leading-relaxed text-muted">{copy.plan.populateHint}</p>
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
                critical: critical.has(code),
                whatIf: whatIfSentences(
                  whatIf(version, plan, { kind: "deferCourse", code }),
                  insight.whatIf,
                  (t) => formatTermLabel(copy, t)
                ),
              };
            });
            const suggestion = suggestForTerm(version, plan, term);
            const courseGroups = buildCourseGroups(
              copy,
              version,
              locale,
              minorName,
              suggestion,
              contextLine
            );
            const openSlots: TermEditorSlot[] = suggestion.openSlots.map((slot) => ({
              id: slot.id,
              label: slot.label[locale],
              candidates: slot.candidates.map((course) => toTermEditorCourse(course, contextLine)),
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
                assessmentLine={profileLine(
                  termAssessmentProfile(plannedTerm?.codes ?? []),
                  locale,
                  insight.profile
                )}
                courseGroups={courseGroups}
                openSlots={openSlots}
                internshipOnly={suggestion.internshipOnly}
                recommendedTermComplete={suggestion.recommendedTermComplete}
                recommendedCredits={suggestion.recommendedCredits}
                addAction={addCourseToTerm.bind(null, locale)}
                removeAction={removeCourseFromTerm.bind(null, locale)}
                freeElectiveAction={setTermFreeElectiveCredits.bind(null, locale)}
                courseHref={courseHref}
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

        <ScenarioSection
          locale={locale}
          version={version}
          plan={plan}
          copy={copy}
          insight={insight}
          planHref={planHref}
          params={{
            minor: firstParam(query[MINOR_FIELD]),
            away: firstParam(query[AWAY_FIELD]),
            awayKind: firstParam(query[AWAY_KIND_FIELD]),
            compare: firstParam(query[COMPARE_FIELD]),
            compareName: firstParam(query[COMPARE_NAME_FIELD]),
          }}
        />

        <div>
          <Link href={printHref} className="font-semibold text-brand-deep hover:underline">
            {copy.plan.printLinkLabel} &rarr;
          </Link>
        </div>

        <PlanOutreach plan={plan} serialisedPlan={serialisedPlan} locale={locale} />

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

        <div className="flex flex-col gap-3 rounded-lg border border-line p-5">
          <h2 className="font-display text-xl">{copy.delete.heading}</h2>
          <p className="leading-relaxed text-muted">{copy.delete.body}</p>
          <form action={deleteStudyPlan.bind(null, locale)}>
            <DeletePlanButton>{copy.delete.buttonLabel}</DeletePlanButton>
          </form>
        </div>
      </div>
    </>
  );
}
