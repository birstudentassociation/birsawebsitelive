"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  CURRICULUM_VERSIONS,
  resolveCohort,
  type TermKind,
  type TermRef,
} from "@/content/curriculum";
import {
  assumedHistory,
  clearInternshipSummers,
  populateRecommendedTerms,
} from "@/lib/study-plan/derive";
import {
  deserialisePlan,
  PLAN_FIELD,
  serialisePlan,
  startYearFromCohort,
  type StudyPlan,
} from "@/lib/study-plan/plan";
import { localeHref, type Locale } from "@/lib/i18n";
import { clearDraft, mergeDraft, readDraft } from "@/components/forms/draftCookie";
import { buildStudyPlanCopy } from "@/components/study-plan/studyPlanCopy";
import type { QuestionStepState } from "@/components/forms/QuestionStepForm";
import type { TermFreeElectiveState } from "@/components/study-plan/TermFreeElectiveForm";
import { STUDY_PLAN_COOKIE, type StudyPlanDraft } from "./steps";

/** First two digits of a student ID, e.g. "66". */
const cohortSchema = z.string().regex(/^\d{2}$/);

/** Matches `TermRef.year`: up to 8, not 4, so extended study is representable. */
const yearSchema = z.string().regex(/^[1-8]$/);
const kindSchema = z.enum(["semester1", "semester2", "summer"]);

const freeElectiveCreditsSchema = z
  .string()
  .regex(/^\d+$/)
  .transform(Number)
  .pipe(z.number().int().min(0).max(60));

/** A single term's free elective credits, capped at 21 per `PlannedCourseTerm`'s schema in plan.ts. */
const termFreeElectiveCreditsSchema = z
  .string()
  .regex(/^\d+$/)
  .transform(Number)
  .pipe(z.number().int().min(0).max(21));

/** Course codes are two to four letters then three digits, matching plan.ts's `courseCode` schema. */
const courseCodeSchema = z.string().regex(/^[A-Z]{2,4}\d{3}$/);

/** Builds a `TermRef` from the draft's saved position, or null if either half is missing. */
function draftPosition(draft: StudyPlanDraft): TermRef | null {
  if (!draft.positionYear || !draft.positionKind) return null;
  return { year: Number(draft.positionYear), kind: draft.positionKind as TermKind };
}

/** Reads and validates the `year` / `kind` fields every plan-editing form on `/plan` carries. */
function parseTermFields(formData: FormData): TermRef | null {
  const yearResult = yearSchema.safeParse(String(formData.get("year") ?? ""));
  const kindResult = kindSchema.safeParse(String(formData.get("kind") ?? ""));
  if (!yearResult.success || !kindResult.success) return null;
  return { year: Number(yearResult.data), kind: kindResult.data as TermKind };
}

/** Index of the plan's term entry matching `term`, or -1 if that term has never been touched. */
function findTermEntryIndex(plan: StudyPlan, term: TermRef): number {
  return plan.terms.findIndex((t) => t.term.year === term.year && t.term.kind === term.kind);
}

/**
 * Redirects back to `/plan` carrying `plan` in the query string, exactly as
 * every step before it does. This is also the one place the internship rule
 * (a summer holding PI574 holds nothing else, see `clearInternshipSummers`
 * in derive.ts) is enforced, rather than in each mutating action separately:
 * every action below that changes the plan ends by calling this function, so
 * putting the rule here means no future action can add a mutation and forget
 * it, the same way `redirectToPlan` itself is the one place every action
 * shares instead of each building its own redirect URL.
 *
 * One call here covers both directions of the rule for free: adding the
 * internship to a summer bounces whatever else was already there (the next
 * `redirectToPlan` after `addCourseToTerm` clears it), and adding another
 * course to a summer that already holds the internship bounces straight back
 * out again the same way.
 *
 * `focus`, when given, names the term the action just changed. The plan
 * screen shows one term expanded at a time, so without this a student adding
 * a course would be returned to a page that had closed the term they were
 * working in and opened a different one. The term is carried in the query
 * string rather than only in the fragment because the server decides what is
 * open: a fragment would leave it to the browser to expand a `<details>` it
 * happens to point inside, which is not something a JavaScript-off browser
 * can be relied on to do. The fragment goes along too, so the browser also
 * scrolls there.
 */
function redirectToPlan(locale: Locale, plan: StudyPlan, focus?: TermRef | null): never {
  const version = CURRICULUM_VERSIONS[plan.versionId];
  const terms = clearInternshipSummers(version, plan.terms);
  const key = focus ? `${focus.year}-${focus.kind}` : null;
  redirect(
    `${localeHref(locale, "/services/study-plan/plan")}?${PLAN_FIELD}=${encodeURIComponent(serialisePlan({ ...plan, terms }))}` +
      (key ? `&term=${key}#term-${key}` : "")
  );
}

export async function getStudyPlanDraft(): Promise<StudyPlanDraft> {
  return readDraft<StudyPlanDraft>(STUDY_PLAN_COOKIE);
}

export async function submitCohortStep(
  locale: Locale,
  _prev: QuestionStepState,
  formData: FormData
): Promise<QuestionStepState> {
  const copy = buildStudyPlanCopy(locale);
  const value = String(formData.get("cohort") ?? "").trim();

  if (!value) {
    return { status: "invalid", error: copy.cohort.errorRequired };
  }
  const result = cohortSchema.safeParse(value);
  if (!result.success) {
    return { status: "invalid", error: copy.cohort.errorFormat };
  }

  await mergeDraft<StudyPlanDraft>(STUDY_PLAN_COOKIE, { cohort: result.data });

  // resolveCohort is the single place that decides which curriculum governs
  // a student; an unsupported code is routed to the stop page rather than
  // guessed at anywhere downstream.
  const resolution = resolveCohort(result.data);
  if (resolution.status === "unsupported") {
    redirect(localeHref(locale, "/services/study-plan/cannot-help?reason=cohort"));
  }
  redirect(localeHref(locale, "/services/study-plan/curriculum"));
}

export async function submitCurriculumStep(
  locale: Locale,
  _prev: QuestionStepState,
  formData: FormData
): Promise<QuestionStepState> {
  const copy = buildStudyPlanCopy(locale);
  const value = String(formData.get("confirmed") ?? "");

  if (value !== "yes" && value !== "no") {
    return { status: "invalid", error: copy.curriculum.errorRequired };
  }

  await mergeDraft<StudyPlanDraft>(STUDY_PLAN_COOKIE, { confirmed: value });

  // "No, or I am not sure" is a legitimate, expected answer, not a validation
  // failure: a plan built on the wrong curriculum is worse than no plan, so
  // this goes to the stop page rather than being nudged back to try again.
  if (value === "no") {
    redirect(localeHref(locale, "/services/study-plan/cannot-help?reason=not-sure"));
  }
  redirect(localeHref(locale, "/services/study-plan/where"));
}

export async function submitWhereStep(
  locale: Locale,
  _prev: QuestionStepState,
  formData: FormData
): Promise<QuestionStepState> {
  const copy = buildStudyPlanCopy(locale);
  const year = String(formData.get("year") ?? "");
  const kind = String(formData.get("kind") ?? "");

  const yearResult = yearSchema.safeParse(year);
  const kindResult = kindSchema.safeParse(kind);
  if (!yearResult.success || !kindResult.success) {
    return { status: "invalid", error: copy.where.errorRequired };
  }

  await mergeDraft<StudyPlanDraft>(STUDY_PLAN_COOKIE, {
    positionYear: yearResult.data,
    positionKind: kindResult.data,
  });

  // Not building the plan here: a plan cannot exist until the minor is
  // known, since a minor course's requirement bucket depends on it.
  redirect(localeHref(locale, "/services/study-plan/minor"));
}

export async function submitMinorStep(
  locale: Locale,
  _prev: QuestionStepState,
  formData: FormData
): Promise<QuestionStepState> {
  const copy = buildStudyPlanCopy(locale);
  const draft = await readDraft<StudyPlanDraft>(STUDY_PLAN_COOKIE);

  if (!draft.cohort) {
    redirect(localeHref(locale, "/services/study-plan/cohort"));
  }
  const resolution = resolveCohort(draft.cohort);
  if (resolution.status === "unsupported") {
    redirect(localeHref(locale, "/services/study-plan/cannot-help?reason=cohort"));
  }
  const { version } = resolution;

  const minorValue = String(formData.get("minor") ?? "");
  const chosen = version.minors.find((m) => m.id === minorValue);
  if (!chosen) {
    return { status: "invalid", error: copy.minor.errorRequired };
  }

  const position = draftPosition(draft);
  if (!position) {
    redirect(localeHref(locale, "/services/study-plan/where"));
  }

  await mergeDraft<StudyPlanDraft>(STUDY_PLAN_COOKIE, { minorId: chosen.id });

  // The whole reason this step exists: PI380 is a required course for a
  // Governance student and an elective-in-another-minor for a Global
  // Political Economy one, so the initial plan cannot be built until the
  // minor is known.
  const history = assumedHistory(version, position);
  const plan: StudyPlan = {
    versionId: version.id,
    cohort: draft.cohort,
    startYear: startYearFromCohort(draft.cohort),
    minorId: chosen.id,
    passed: history.courses,
    freeElectiveCreditsPassed: 0,
    terms: [],
  };

  redirect(
    `${localeHref(locale, "/services/study-plan/assumed")}?${PLAN_FIELD}=${encodeURIComponent(serialisePlan(plan))}`
  );
}

export async function submitAssumedStep(
  locale: Locale,
  _prev: QuestionStepState,
  formData: FormData
): Promise<QuestionStepState> {
  const copy = buildStudyPlanCopy(locale);
  const current = deserialisePlan(String(formData.get(PLAN_FIELD) ?? ""));
  if (!current) {
    // A missing or tampered plan cannot be corrected; the minor is the
    // earliest step that produces one, so that is where recovery starts.
    redirect(localeHref(locale, "/services/study-plan/minor"));
  }

  const freeElectiveResult = freeElectiveCreditsSchema.safeParse(
    String(formData.get("freeElectiveCreditsPassed") ?? "")
  );
  if (!freeElectiveResult.success) {
    return { status: "invalid", error: copy.assumed.freeElectiveError };
  }

  // Rebuilt from exactly the checkboxes that came back, not merged with
  // `current.passed`: an unchecked box means "I did not take this", and
  // that has to be able to remove a course, not just add one.
  const plan: StudyPlan = {
    ...current,
    passed: formData.getAll("passed").map(String),
    freeElectiveCreditsPassed: freeElectiveResult.data,
  };
  const encodedPlan = encodeURIComponent(serialisePlan(plan));

  const draft = await readDraft<StudyPlanDraft>(STUDY_PLAN_COOKIE);
  const position = draftPosition(draft);
  if (position) {
    const version = CURRICULUM_VERSIONS[plan.versionId];
    const { placeholders } = assumedHistory(version, position);
    // Free elective placeholders are already handled by the number input
    // above; only a *named-slot* placeholder needs the fill step.
    const hasSlotsToFill = placeholders.some((slot) => slot.category !== "freeElective");
    if (hasSlotsToFill) {
      redirect(
        `${localeHref(locale, "/services/study-plan/assumed/fill")}?${PLAN_FIELD}=${encodedPlan}`
      );
    }
  }

  redirect(`${localeHref(locale, "/services/study-plan/plan")}?${PLAN_FIELD}=${encodedPlan}`);
}

export async function submitFillStep(
  locale: Locale,
  _prev: QuestionStepState,
  formData: FormData
): Promise<QuestionStepState> {
  const current = deserialisePlan(String(formData.get(PLAN_FIELD) ?? ""));
  if (!current) {
    redirect(localeHref(locale, "/services/study-plan/minor"));
  }

  const passed = new Set(current.passed);
  const draft = await readDraft<StudyPlanDraft>(STUDY_PLAN_COOKIE);
  const position = draftPosition(draft);
  if (position) {
    const version = CURRICULUM_VERSIONS[current.versionId];
    const { placeholders } = assumedHistory(version, position);
    for (const slot of placeholders) {
      if (slot.category === "freeElective") continue;
      const value = String(formData.get(`slot-${slot.id}`) ?? "");
      // Empty value is "I have not taken this yet", a legitimate answer,
      // not a validation failure.
      if (value) passed.add(value);
    }
  }

  const plan: StudyPlan = { ...current, passed: [...passed] };
  redirect(
    `${localeHref(locale, "/services/study-plan/plan")}?${PLAN_FIELD}=${encodeURIComponent(serialisePlan(plan))}`
  );
}

/**
 * Adds one course to one term. Bound with `.bind(null, locale)` for use as a
 * plain `<form action>` on `/plan` (no `useActionState`: there is nothing to
 * report back, only the plan to carry forward, exactly like
 * `resetLoanStatusDraft`).
 *
 * Silently no-ops on a malformed `year`/`kind`/`code`, or on a code already
 * passed or already placed somewhere in the plan, rather than surfacing an
 * error: the form's own `<select>` only ever offers courses that are valid
 * to add, so reaching this branch means the hidden fields were tampered
 * with, not that the student made a mistake worth telling them about.
 */
export async function addCourseToTerm(locale: Locale, formData: FormData): Promise<void> {
  const current = deserialisePlan(String(formData.get(PLAN_FIELD) ?? ""));
  if (!current) {
    redirect(localeHref(locale, "/services/study-plan/minor"));
  }

  const term = parseTermFields(formData);
  const codeResult = courseCodeSchema.safeParse(String(formData.get("code") ?? ""));

  let terms = current.terms;
  if (term && codeResult.success) {
    const code = codeResult.data;
    const alreadyPlaced =
      current.passed.includes(code) || current.terms.some((t) => t.codes.includes(code));
    if (!alreadyPlaced) {
      const index = findTermEntryIndex(current, term);
      terms =
        index === -1
          ? [...current.terms, { term, codes: [code], freeElectiveCredits: 0 }]
          : current.terms.map((t, i) => (i === index ? { ...t, codes: [...t.codes, code] } : t));
    }
  }

  redirectToPlan(locale, { ...current, terms }, term);
}

/**
 * Removes one course from one term. The remove form on `/plan` puts every
 * placed course's code on its own submit button
 * (`<button name="code" value={code}>`), so only the clicked course's code
 * ever reaches `formData`.
 */
export async function removeCourseFromTerm(locale: Locale, formData: FormData): Promise<void> {
  const current = deserialisePlan(String(formData.get(PLAN_FIELD) ?? ""));
  if (!current) {
    redirect(localeHref(locale, "/services/study-plan/minor"));
  }

  const term = parseTermFields(formData);
  const code = String(formData.get("code") ?? "");

  let terms = current.terms;
  if (term && code) {
    const index = findTermEntryIndex(current, term);
    if (index !== -1) {
      terms = current.terms.map((t, i) =>
        i === index ? { ...t, codes: t.codes.filter((c) => c !== code) } : t
      );
    }
  }

  redirectToPlan(locale, { ...current, terms }, term);
}

/**
 * Sets one term's free elective credit count. Its own action, separate from
 * `addCourseToTerm`, because a free elective may be any Thammasat University
 * course and so is tracked as a credit count rather than a course code (see
 * `PlannedCourseTerm` in lib/study-plan/plan.ts).
 *
 * Unlike `addCourseToTerm` / `removeCourseFromTerm`, a bad value here is
 * reported back rather than silently dropped: this field is freely typed,
 * not chosen from a `<select>` that only ever offers valid values, so an
 * out-of-range number is a plausible student mistake, not tampering. Bound
 * with `.bind(null, locale)` and driven by `useActionState` in
 * `TermFreeElectiveForm`, matching every step form in this journey.
 */
export async function setTermFreeElectiveCredits(
  locale: Locale,
  _prev: TermFreeElectiveState,
  formData: FormData
): Promise<TermFreeElectiveState> {
  const copy = buildStudyPlanCopy(locale);
  const current = deserialisePlan(String(formData.get(PLAN_FIELD) ?? ""));
  if (!current) {
    redirect(localeHref(locale, "/services/study-plan/minor"));
  }

  const term = parseTermFields(formData);
  if (!term) {
    // The hidden year/kind fields were tampered with, not mistyped by the
    // student: nothing sensible to report, so the plan goes back unchanged.
    redirectToPlan(locale, current);
  }

  const creditsResult = termFreeElectiveCreditsSchema.safeParse(
    String(formData.get("freeElectiveCredits") ?? "")
  );
  if (!creditsResult.success) {
    return { status: "invalid", error: copy.plan.freeElectiveError };
  }

  const index = findTermEntryIndex(current, term);
  const terms =
    index === -1
      ? [...current.terms, { term, codes: [], freeElectiveCredits: creditsResult.data }]
      : current.terms.map((t, i) =>
          i === index ? { ...t, freeElectiveCredits: creditsResult.data } : t
        );

  redirectToPlan(locale, { ...current, terms }, term);
}

/**
 * Appends one blank term (no courses, no free elective credits) to the plan,
 * for the "Add another term" control at the end of the term list. The plan
 * screen computes which term comes next (`nextTerm` in derive.ts, following
 * the same year/semester/summer ordering as `termIndex`) and carries it in
 * this form's hidden `year`/`kind` fields; this action only has to persist
 * it, so it survives being carried forward in the plan's own term list
 * rather than disappearing again on the next render.
 *
 * Exists because the recommended plan's own term list ends at the nominal
 * final year, which left a student running behind (exactly who most needs
 * to plan) with no future term to add a course to.
 */
export async function addTermToPlan(locale: Locale, formData: FormData): Promise<void> {
  const current = deserialisePlan(String(formData.get(PLAN_FIELD) ?? ""));
  if (!current) {
    redirect(localeHref(locale, "/services/study-plan/minor"));
  }

  const term = parseTermFields(formData);
  let terms = current.terms;
  if (term && findTermEntryIndex(current, term) === -1) {
    terms = [...current.terms, { term, codes: [], freeElectiveCredits: 0 }];
  }

  redirectToPlan(locale, { ...current, terms }, term);
}

/**
 * Fills every term ahead of the student with the courses the recommended
 * plan names for those terms, in one go, for the "fill in the recommended
 * courses" button on `/plan`.
 *
 * Exists because the alternative was choosing a course from a select and
 * pressing "Add" once per course, roughly forty times, to reproduce a
 * sequence the service already holds. A student who is following the
 * recommended plan had the most work to do and the least to decide.
 *
 * The position comes from the draft cookie rather than the form, exactly as
 * the plan screen reads it: it is the same answer the student gave on
 * `/where`, and taking it from a hidden field would let a tampered post
 * rewrite terms the student has already passed. A missing position sends
 * them back to that question rather than guessing at year 1.
 *
 * All the actual rules live in `populateRecommendedTerms`, which is where
 * they can be tested without a request.
 */
export async function populatePlanFromRecommended(
  locale: Locale,
  formData: FormData
): Promise<void> {
  const current = deserialisePlan(String(formData.get(PLAN_FIELD) ?? ""));
  if (!current) {
    redirect(localeHref(locale, "/services/study-plan/minor"));
  }

  const draft = await readDraft<StudyPlanDraft>(STUDY_PLAN_COOKIE);
  const position = draftPosition(draft);
  if (!position) {
    redirect(localeHref(locale, "/services/study-plan/where"));
  }

  const version = CURRICULUM_VERSIONS[current.versionId];
  const terms = populateRecommendedTerms(version, position, current);

  redirectToPlan(locale, { ...current, terms });
}

/**
 * Deletes the plan. There is no server-side copy to delete: the plan lives
 * only in the hidden field posted between steps and, once JavaScript has
 * run, in the reader's own localStorage (`components/study-plan/PlanStore.tsx`
 * clears that half; this clears the other half BIRSA ever holds, the draft
 * cookie carrying the cohort/position/minor answers). Redirects to the
 * journey start with `?deleted=1` so the start page can confirm what was
 * cleared, the same for a JavaScript-off reader and a JavaScript-on one:
 * this route is the one part of deletion that works identically either way.
 */
export async function deleteStudyPlan(locale: Locale, _formData: FormData): Promise<void> {
  await clearDraft(STUDY_PLAN_COOKIE);
  redirect(`${localeHref(locale, "/services/study-plan")}?deleted=1`);
}
