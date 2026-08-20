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
import type { ServiceDefinition, LocalizedText } from "@/lib/services/defineService";
import { serviceSteps } from "@/lib/services/defineService";
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
 *
 * `subject` is the LAST, OPTIONAL parameter on every function below,
 * deliberately, so every existing call site (a service with no subject)
 * keeps compiling and keeps returning exactly the href it always has
 * (gate 7, `docs/DECISIONS-2.0.md`, decided 2026-08-20). A definition that
 * declares `subject` needs one supplied to build a real link; a definition
 * that does not ignores it entirely.
 */
function baseHref(definition: ServiceDefinition, subject?: string): string {
  return definition.subject && subject ? `/do/${definition.id}/${subject}` : `/do/${definition.id}`;
}

/** Where a question step goes next: the next question, or `check`. `returnTo` overrides this to `check`, used by the `CheckAnswers` change links so editing one answer comes straight back rather than re-walking every later step. */
export function nextStepHref(
  definition: ServiceDefinition,
  currentStepId: string,
  returnTo?: string,
  subject?: string
): string {
  if (returnTo === "check") return `${baseHref(definition, subject)}/check`;
  const ids = questionStepIds(definition);
  const index = ids.indexOf(currentStepId);
  const next = index >= 0 && index + 1 < ids.length ? ids[index + 1] : "check";
  return `${baseHref(definition, subject)}/${next}`;
}

/** Where a question step's `BackLink` goes: the previous question, or the service's start page for the first one. `returnTo=check` sends it back to check answers instead, so a reader editing one answer from the summary is not dropped back into the middle of the wizard. */
export function previousStepHref(
  definition: ServiceDefinition,
  currentStepId: string,
  returnTo?: string,
  subject?: string
): string {
  if (returnTo === "check") return `${baseHref(definition, subject)}/check`;
  const ids = questionStepIds(definition);
  const index = ids.indexOf(currentStepId);
  const previous = index > 0 ? ids[index - 1] : null;
  return previous ? `${baseHref(definition, subject)}/${previous}` : baseHref(definition, subject);
}

/** `CheckAnswers`' change link for one question: always the question's own step, carrying `returnTo=check` so its step action redirects back here rather than onward (§5.1 item 3, WCAG 3.3.7). */
export function checkAnswersChangeHref(
  definition: ServiceDefinition,
  questionId: string,
  subject?: string
): string {
  return `${baseHref(definition, subject)}/${questionId}?returnTo=check`;
}

/**
 * Every step href for a service, in order, including `check` and `confirm`:
 * `serviceSteps` (`defineService.ts`) turned into full paths. A service with
 * no subject gets its existing two-segment shape (`/do/<id>/<step>`); a
 * subject-taking service gets the three-segment shape gate 7 decided
 * (`/do/<id>/<subject>/<step>`). Exists mainly so a test, or a future nav
 * builder, can assert on the whole ordered shape at once rather than
 * reconstructing it from `nextStepHref` calls.
 */
export function serviceStepHrefs(definition: ServiceDefinition, subject?: string): string[] {
  const base = baseHref(definition, subject);
  return serviceSteps(definition).map((step) => `${base}/${step}`);
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
  labels: { notAnswered: string; yes: string; no: string; listSeparator: string },
  subject?: string
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
      changeHref: checkAnswersChangeHref(definition, question.id, subject),
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
  /**
   * The resolved subject key (gate 7, `docs/DECISIONS-2.0.md`, decided
   * 2026-08-20), for a service whose definition declares one. `undefined`
   * for a service with no subject, and never a question id or an answer: a
   * subject is chosen from the route before the wizard starts, the same way
   * 1.0's `/services/equipment-loan/[item]/request` worked, not asked as one
   * of `definition.questions`. Optional, not required, so every existing
   * `Submission` literal (every service built before this decision, and
   * every test fixture written against them) keeps compiling unchanged; a
   * store for a subject-taking service reads this field, not
   * `answers[anything]`, to learn which thing a request is for.
   */
  subject?: string;
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
/**
 * What a store reports back after persisting. `save` cannot be
 * `Promise<void>`, and Wave 4B is what proved it.
 *
 * Two things a real store does that an in-memory map never has to. It may
 * mint its OWN identifier: `lib/inventory/loans.ts` generates a loan
 * reference internally, so a chassis that had already generated one and
 * handed it to the student would be showing a number the database does not
 * know. And it may REFUSE for a reason that is not a validation error: the
 * borrower is blocklisted, the item went out while the form was open. Those
 * are not bad answers, so no field is wrong and `validateFullDraft` has
 * nothing to say about them, but the submission still did not happen.
 *
 * With a `void` return both cases were unrepresentable, so the student would
 * have been shown a confirmation panel and a reference number for something
 * that never persisted, which is the worst possible failure for a service
 * whose confirmation tells them to keep that number.
 */
export type SaveOutcome = { ok: true; reference: string } | { ok: false; problem: LocalizedText };

export type SubmissionStore = {
  /**
   * Persist a submission. `submission.reference` is a PROPOSED reference the
   * chassis generated; a store that mints its own returns that one instead,
   * and the caller uses whatever comes back rather than what it sent.
   */
  save(submission: Submission): Promise<SaveOutcome>;
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

  async save(submission: Submission): Promise<SaveOutcome> {
    const forService = this.byService.get(submission.serviceId) ?? new Map();
    forService.set(submission.reference, submission);
    this.byService.set(submission.serviceId, forService);
    // Keeps the reference it was handed: an in-memory map has no identifier
    // of its own and no business rule to refuse on.
    return { ok: true, reference: submission.reference };
  }

  async findByReference(serviceId: string, reference: string): Promise<Submission | null> {
    return this.byService.get(serviceId)?.get(reference) ?? null;
  }

  async listByService(serviceId: string): Promise<Submission[]> {
    return [...(this.byService.get(serviceId)?.values() ?? [])];
  }
}

let sharedStore: SubmissionStore | null = null;
const storesByService = new Map<string, SubmissionStore>();

/**
 * Register the store a particular service persists through.
 *
 * Wave 4B is why this exists. It implemented a real store for the equipment
 * loan over `lib/inventory/loans.ts`, and then found there was no way to
 * reach it: `getSubmissionStore` handed every service the same in-memory
 * placeholder, so a correct store sat unreachable behind a hardcoded one.
 *
 * The selection lives here rather than on `ServiceDefinition` deliberately. A
 * definition is a CMS document in 2.0 (§6.7), and a document cannot reference
 * a code module. So a service names itself, and code claims it: the officer
 * side stays data, the persistence side stays code, and neither has to know
 * how the other is stored.
 */
export function registerSubmissionStore(serviceId: string, store: SubmissionStore): void {
  storesByService.set(serviceId, store);
}

/**
 * The store a service persists through: its registered one, or the in-memory
 * placeholder. Read `InMemorySubmissionStore`'s header before relying on the
 * fallback for anything a real student needs to survive.
 */
export function getSubmissionStore(serviceId?: string): SubmissionStore {
  if (serviceId) {
    const registered = storesByService.get(serviceId);
    if (registered) return registered;
  }
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
  | { ok: false; reason: "invalid"; firstInvalidQuestionId: string }
  /**
   * The store refused for a reason no answer can fix: the borrower is
   * blocklisted, the item went out while the form was open. Distinct from
   * "invalid" because there is no field to send the student back to, so the
   * page shows the problem rather than highlighting a question.
   */
  | { ok: false; reason: "rejected"; problem: LocalizedText };

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
 *
 * `subject` is the resolved subject key (gate 7): the caller (a chassis
 * route or a test) has already validated it against `definition.subject`'s
 * registered resolver before this function is ever reached, exactly the way
 * `draft` is already validated before `submitService` is called. This
 * function does not re-resolve or re-check it, the same way it does not
 * re-check that `draft` came from a real form; it only carries the value
 * through to the `Submission` a store persists, which is the entire gap gate
 * 7 closes (`lib/services/loanSubmissionStore.ts`'s own header names it as
 * finding 2).
 */
export async function submitService(
  definition: ServiceDefinition,
  draft: Record<string, AnswerValue>,
  locale: Locale,
  store: SubmissionStore = getSubmissionStore(),
  subject?: string
): Promise<SubmitOutcome> {
  const validation = validateFullDraft(definition, draft, locale);
  if (!validation.ok) {
    return {
      ok: false,
      reason: "invalid",
      firstInvalidQuestionId: validation.firstInvalidQuestionId,
    };
  }

  // A PROPOSED reference. A store backed by a real table may mint its own,
  // and the student must be shown the one that was actually persisted rather
  // than the one this function guessed.
  const proposed = generateReference(definition.id);
  const now = new Date().toISOString();
  const saved = await store.save({
    reference: proposed,
    serviceId: definition.id,
    subject,
    answers: draft,
    status: "received",
    createdAt: now,
    closedAt: null,
  });

  if (!saved.ok) {
    return { ok: false, reason: "rejected", problem: saved.problem };
  }

  return { ok: true, reference: saved.reference };
}

/** The one `email`-type question's answer, used as the acknowledgement recipient (rule 4, `defineService.ts`) and the default corroborating detail for `status.ts`. `undefined` only for a definition that somehow failed rule 4 and still reached here, which the registry never serves. */
export function emailQuestion(definition: ServiceDefinition): Question | undefined {
  return definition.questions.find((q) => q.type === "email");
}
