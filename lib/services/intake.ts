/**
 * The intake state machine (REDESIGN-2.0 §5.1 items 2 to 4 and 7, §5.2).
 *
 * "submit, generate reference, persist, acknowledge" (`REDESIGN-2.0.md`
 * §5.2's own words for this file). Three things live here:
 *
 *   - Step order and navigation (`nextStepHref`, `previousStepHref`,
 *     `stepIndex`), pure functions over `serviceSteps` from
 *     `lib/services/defineService.ts` so both the routes and their tests can
 *     ask "what comes after this question" without duplicating the
 *     ordering logic.
 *   - Turning a completed draft into `CheckAnswers` rows
 *     (`buildCheckAnswersItems`) and validating the WHOLE draft again before
 *     it is accepted (`validateFullDraft`), which is WCAG 3.3.7 and §5.1
 *     item 3 at once: the check-answers page never re-asks a question it
 *     already has an answer for, and a change link always returns to the
 *     exact question it changes and comes back to check afterwards
 *     (`checkAnswersChangeHref`, `returnToCheckHref`).
 *   - `submitService`, which validates, generates a reference, and persists
 *     through a pluggable `SubmissionStore`.
 *
 * NO PRODUCTION DATABASE TABLE EXISTS FOR CHASSIS SUBMISSIONS YET. This is a
 * reported finding (see the Wave 4A report), not a silent gap: `db/migrations/`
 * is not on this wave's owned path list (BUILD-BRIEF-2.0 §10), so this file
 * cannot create one. `SubmissionStore` is the seam a real migration would
 * plug into, exactly the same shape `lib/services/registry.ts` draws around
 * `loadRawDefinitions` for the CMS: a pluggable, documented placeholder now,
 * one function's implementation to change later. `InMemorySubmissionStore`
 * below is that placeholder. It is correct for demonstrating and testing the
 * chassis in a single process and IS NOT PRODUCTION PERSISTENCE: a
 * serverless cold start clears it, so no chassis-built service can rely on
 * it for anything a student needs to survive a deploy. The equipment loan
 * service is unaffected; it keeps its own real Postgres-backed persistence
 * in `lib/inventory/loans.ts` and does not use this module at all (Wave 4B
 * migrates its ROUTES onto the chassis's rendering, not its storage).
 */
import type { Locale } from "@/lib/i18n";
import type { ServiceDefinition } from "@/lib/services/defineService";
import type { Question } from "@/lib/services/questionTypes";
import {
  answerToFormData,
  formatAnswerForDisplay,
  validateAnswer,
  type AnswerValue,
} from "@/lib/services/validate";

// ---- Step order and navigation --------------------------------------------

/** The question ids in order, excluding the trailing `check`/`confirm` steps `serviceSteps` also returns. */
export function questionStepIds(definition: ServiceDefinition): string[] {
  return definition.questions.map((q) => q.id);
}

/** `stepId`'s position among question steps (0-based), or -1 if `stepId` is not a question on this service (including "check"/"confirm", which are not questions). */
export function stepIndex(definition: ServiceDefinition, stepId: string): number {
  return questionStepIds(definition).indexOf(stepId);
}

/**
 * Every href below is RELATIVE TO THE LOCALE ROOT (e.g. `/do/x/y`, never
 * `/en/do/x/y`), matching what `BackLink` and `localeHref` (`lib/i18n.ts`)
 * both expect: a caller that needs an absolute link (a `redirect()`, or
 * `CheckAnswers`' `changeHref`, which is a plain `next/link` with no locale
 * awareness of its own) wraps the result in `localeHref(locale, ...)`; a
 * caller that hands it straight to `BackLink` (which calls `localeHref`
 * itself) does not. Keeping these functions locale-agnostic is what lets
 * `tests/unit/service-chassis.test.ts` assert on them without threading a
 * `Locale` through every case.
 */
function baseHref(definition: ServiceDefinition): string {
  return `/do/${definition.id}`;
}

/** Where a question step goes next: the next question, or `check`. `returnTo` overrides this to `check`, used by the `CheckAnswers` change links so editing one answer comes straight back rather than re-walking every later step. */
export function nextStepHref(
  definition: ServiceDefinition,
  currentStepId: string,
  returnTo?: string
): string {
  if (returnTo === "check") return `${baseHref(definition)}/check`;
  const ids = questionStepIds(definition);
  const index = ids.indexOf(currentStepId);
  const next = index >= 0 && index + 1 < ids.length ? ids[index + 1] : "check";
  return `${baseHref(definition)}/${next}`;
}

/** Where a question step's `BackLink` goes: the previous question, or the service's start page for the first one. `returnTo=check` sends it back to check answers instead, so a reader editing one answer from the summary is not dropped back into the middle of the wizard. */
export function previousStepHref(
  definition: ServiceDefinition,
  currentStepId: string,
  returnTo?: string
): string {
  if (returnTo === "check") return `${baseHref(definition)}/check`;
  const ids = questionStepIds(definition);
  const index = ids.indexOf(currentStepId);
  const previous = index > 0 ? ids[index - 1] : null;
  return previous ? `${baseHref(definition)}/${previous}` : baseHref(definition);
}

/** `CheckAnswers`' change link for one question: always the question's own step, carrying `returnTo=check` so its step action redirects back here rather than onward (§5.1 item 3, WCAG 3.3.7). */
export function checkAnswersChangeHref(definition: ServiceDefinition, questionId: string): string {
  return `${baseHref(definition)}/${questionId}?returnTo=check`;
}

// ---- Check answers ---------------------------------------------------------

export type CheckAnswersRow = {
  id: string;
  question: string;
  answer: string;
  changeHref: string;
};

/**
 * Builds one `CheckAnswersItem` (`components/bds/CheckAnswers.tsx`) per
 * question, in question order, reading straight from the draft. Never
 * re-derives an answer from raw form input: WCAG 3.3.7 is "do not re-ask
 * what you already have," and reading the already-validated draft is what
 * makes that true here rather than merely intended.
 */
export function buildCheckAnswersRows(
  definition: ServiceDefinition,
  draft: Record<string, AnswerValue>,
  locale: Locale,
  labels: { notAnswered: string; yes: string; no: string; listSeparator: string }
): CheckAnswersRow[] {
  return definition.questions.map((question) => {
    const value = draft[question.id];
    return {
      id: question.id,
      question: question.label[locale],
      answer:
        value === undefined
          ? labels.notAnswered
          : formatAnswerForDisplay(question, value, locale, labels),
      /** Relative to the locale root; the calling page wraps it with `localeHref` (see the note on `baseHref` above). */
      changeHref: checkAnswersChangeHref(definition, question.id),
    };
  });
}

// ---- Full-draft validation --------------------------------------------------

export type DraftValidation = { ok: true } | { ok: false; firstInvalidQuestionId: string };

/**
 * Re-validates every question against the FULL draft, defense in depth for
 * the final submit (this file's own header note, matching the equipment loan
 * wizard's `submitLoanRequestCheck`). A single answer being fine when its own
 * step collected it does not guarantee the draft as a whole is still
 * complete: a required question the reader skipped past by editing the URL
 * directly, or a draft that expired mid-journey and came back partial, both
 * need to be caught here rather than accepted.
 *
 * `file-upload` questions are checked for presence only (see
 * `answerToFormData`'s own note: a stored answer keeps only the file's name,
 * never its bytes, so there is nothing to re-run the byte-size check
 * against).
 */
export function validateFullDraft(
  definition: ServiceDefinition,
  draft: Record<string, AnswerValue>,
  locale: Locale
): DraftValidation {
  for (const question of definition.questions) {
    if (question.type === "file-upload") {
      const value = draft[question.id];
      if (question.required && (value === undefined || value === "")) {
        return { ok: false, firstInvalidQuestionId: question.id };
      }
      continue;
    }
    const formData = answerToFormData(question, draft[question.id]);
    const result = validateAnswer(question, formData, locale);
    if (!result.ok) {
      return { ok: false, firstInvalidQuestionId: question.id };
    }
  }
  return { ok: true };
}

// ---- Reference numbers -------------------------------------------------------

const REFERENCE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"; // base32 (RFC 4648, no padding), matching lib/inventory/loans.ts's generateReference

/**
 * A short, human-readable reference: the service id's initials plus four
 * random characters, e.g. "ECD-7Q2X" for "example-chassis-demo". Deliberately
 * the same shape as `lib/inventory/loans.ts`'s `generateReference`, so a
 * reference looks the same whichever service issued it, which matters once a
 * reader is comparing one against a saved acknowledgement email (§5.1 item
 * 4's note on why a reference number is the single largest thing on the
 * confirmation panel).
 */
export function generateReference(serviceId: string): string {
  const initials = serviceId
    .split("-")
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 3);
  const prefix = initials || "SVC";

  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += REFERENCE_ALPHABET[Math.floor(Math.random() * REFERENCE_ALPHABET.length)];
  }
  return `${prefix}-${suffix}`;
}

// ---- Submission storage ------------------------------------------------------

export type SubmissionStatus = "received" | "in-progress" | "done";

export type Submission = {
  reference: string;
  serviceId: string;
  answers: Record<string, AnswerValue>;
  status: SubmissionStatus;
  createdAt: string;
  closedAt: string | null;
};

/**
 * The seam a real persistence layer plugs into. See this file's header: no
 * production table exists yet, so `getSubmissionStore` (below) hands out an
 * in-memory placeholder until one does. `queue.ts` and `escalation.ts` do not
 * depend on this interface at all (they are pure functions over a
 * `Submission[]` a caller already has), so replacing this store later never
 * touches those two files.
 */
export type SubmissionStore = {
  save(submission: Submission): Promise<void>;
  findByReference(serviceId: string, reference: string): Promise<Submission | null>;
  listByService(serviceId: string): Promise<Submission[]>;
};

/**
 * IN-MEMORY PLACEHOLDER. Correct for one process, one demo, one test run.
 * Cleared on every cold start and shared across every request the process
 * serves, which is fine for the example definition (which cannot publish at
 * all, see `lib/services/definitions/example-chassis-demo.ts`) and for
 * tests, and WRONG for anything a real student needs to survive. A real
 * service needs a migration and a store backed by it before it can go live;
 * that is a finding in the Wave 4A report, not a decision made here.
 */
class InMemorySubmissionStore implements SubmissionStore {
  private byService = new Map<string, Map<string, Submission>>();

  async save(submission: Submission): Promise<void> {
    const forService = this.byService.get(submission.serviceId) ?? new Map();
    forService.set(submission.reference, submission);
    this.byService.set(submission.serviceId, forService);
  }

  async findByReference(serviceId: string, reference: string): Promise<Submission | null> {
    return this.byService.get(serviceId)?.get(reference) ?? null;
  }

  async listByService(serviceId: string): Promise<Submission[]> {
    return [...(this.byService.get(serviceId)?.values() ?? [])];
  }
}

let sharedStore: SubmissionStore | null = null;

/** The process-wide store instance. See `InMemorySubmissionStore`'s own header before reaching for this outside a demo or a test. */
export function getSubmissionStore(): SubmissionStore {
  if (!sharedStore) sharedStore = new InMemorySubmissionStore();
  return sharedStore;
}

/** Test-only: swaps in a fresh store so one test's submissions never leak into another's. */
export function _resetSubmissionStoreForTests(): void {
  sharedStore = new InMemorySubmissionStore();
}

// ---- Submit -------------------------------------------------------------------

export type SubmitOutcome =
  | { ok: true; reference: string }
  | { ok: false; reason: "invalid"; firstInvalidQuestionId: string };

/**
 * Validates the full draft, generates a reference, and persists the
 * submission. Does not send the acknowledgement email itself: §5.1 item 7
 * names the acknowledgement as chassis behaviour, but this wave has no
 * `RESEND_API_KEY`-gated template to send it through that is not tied to a
 * specific service (the equipment loan wizard's own template,
 * `lib/email/templates.ts`, is loan-specific), so sending is left to the
 * calling route to add once a generic template exists, matching the
 * "email is optional, environment-gated" convention BUILD-BRIEF-2.0 §4
 * already documents for the rest of the site: an unset `RESEND_API_KEY`
 * degrades the acknowledgement, not the submission itself.
 */
export async function submitService(
  definition: ServiceDefinition,
  draft: Record<string, AnswerValue>,
  locale: Locale,
  store: SubmissionStore = getSubmissionStore()
): Promise<SubmitOutcome> {
  const validation = validateFullDraft(definition, draft, locale);
  if (!validation.ok) {
    return {
      ok: false,
      reason: "invalid",
      firstInvalidQuestionId: validation.firstInvalidQuestionId,
    };
  }

  const reference = generateReference(definition.id);
  const now = new Date().toISOString();
  await store.save({
    reference,
    serviceId: definition.id,
    answers: draft,
    status: "received",
    createdAt: now,
    closedAt: null,
  });

  return { ok: true, reference };
}

/** The one `email`-type question's answer, used as the acknowledgement recipient (rule 4, `defineService.ts`) and the default corroborating detail for `status.ts`. `undefined` only for a definition that somehow failed rule 4 and still reached here, which the registry never serves. */
export function emailQuestion(definition: ServiceDefinition): Question | undefined {
  return definition.questions.find((q) => q.type === "email");
}
