/**
 * The question palette (REDESIGN-2.0 §6.7).
 *
 * FROZEN CONTRACT. Wave 0 owns this file (§11.3 item 6). Wave 4A implements
 * the validators; nothing outside this file may add a question type.
 *
 * The boundary this file draws is the whole point of it: **the officer decides
 * what to ask, the developer decides what a question can be.** An officer
 * composing a service in the Studio picks from these eleven types and writes
 * the wording; they cannot define a field. That is how government form
 * builders work and the reason is sound. A new question type is a new
 * validation rule, a new accessibility surface and a new PDPA consideration,
 * so it is code, and §6.12 says so out loud rather than pretending otherwise.
 *
 * Each type maps to a GDS pattern that has already been user-tested at
 * national scale, named in `pattern` below. Building the palette without
 * reading them means re-deriving that work badly (§4.3b). `names` matters most
 * here: a bilingual Thai and English service that assumes a first-name and
 * last-name shape is wrong for a large share of its users, which is why
 * `name` is one field and not two.
 *
 * Every type also declares whether it collects personal data. That flag is not
 * decoration: §5.1 item 10 and §6.7 require a service to reference a privacy
 * register activity with an implemented retention path before it can publish,
 * and `collectsPersonalData` is what makes the chassis able to check it.
 */
import type { Locale } from "@/lib/i18n";

export type LocalizedText = Record<Locale, string>;

export const questionTypeIds = [
  "short-text",
  "long-text",
  "email",
  "phone",
  "student-id",
  "date",
  "date-range",
  "choose-one",
  "choose-several",
  "file-upload",
  "yes-no",
] as const;

export type QuestionTypeId = (typeof questionTypeIds)[number];

export type QuestionTypeSpec = {
  id: QuestionTypeId;
  /**
   * The GDS pattern this type implements, or `null` where the palette entry
   * is a plain control rather than a whole pattern. Read the pattern before
   * changing the type.
   */
  pattern: string | null;
  /** What the chassis validates, in the words the §6.7 table uses. */
  validates: string;
  /**
   * Whether an answer to a question of this type is personal data under the
   * PDPA. Drives the register requirement in `defineService.ts`.
   *
   * `short-text` and `long-text` are `true` because a free-text answer is
   * whatever the student types into it, and a student will type their name
   * into a box that asks for anything at all. Assuming otherwise is how a
   * service ends up holding personal data with no retention rule.
   */
  collectsPersonalData: boolean;
  /**
   * The `bds/` component that renders it. Wave 2's forms cluster owns these;
   * the names are frozen here so Wave 4A can be written against them before
   * Wave 2 lands (§11.4).
   */
  component:
    | "TextInput"
    | "Textarea"
    | "DateInput"
    | "DateRangeInput"
    | "Radios"
    | "Checkboxes"
    | "FileUpload";
};

export const questionTypes: Record<QuestionTypeId, QuestionTypeSpec> = {
  "short-text": {
    id: "short-text",
    pattern: "names",
    validates: "Length, required",
    collectsPersonalData: true,
    component: "TextInput",
  },
  "long-text": {
    id: "long-text",
    pattern: null,
    validates: "Length, with a character count component",
    collectsPersonalData: true,
    component: "Textarea",
  },
  email: {
    id: "email",
    pattern: "email-addresses",
    validates: "Format, and it becomes the acknowledgement recipient",
    collectsPersonalData: true,
    component: "TextInput",
  },
  phone: {
    id: "phone",
    pattern: "phone-numbers",
    validates: "Thai and international formats",
    collectsPersonalData: true,
    component: "TextInput",
  },
  "student-id": {
    id: "student-id",
    pattern: null,
    validates: "The existing format check from lib/validation.ts",
    collectsPersonalData: true,
    component: "TextInput",
  },
  date: {
    id: "date",
    pattern: "dates",
    validates: "Range, not in the past",
    collectsPersonalData: false,
    component: "DateInput",
  },
  "date-range": {
    id: "date-range",
    pattern: "dates",
    validates: "The existing loan date logic",
    collectsPersonalData: false,
    component: "DateRangeInput",
  },
  "choose-one": {
    id: "choose-one",
    pattern: null,
    validates: "From options the officer writes",
    collectsPersonalData: false,
    component: "Radios",
  },
  "choose-several": {
    id: "choose-several",
    pattern: null,
    validates: "From options the officer writes",
    collectsPersonalData: false,
    component: "Checkboxes",
  },
  "file-upload": {
    id: "file-upload",
    pattern: null,
    // Never into Sanity. The §6.3 boundary has no exception: an upload is an
    // operational file and may contain personal data, so it goes to Blob,
    // under retention, deletable by lib/privacy/retention.ts.
    validates: "Type and size, into Vercel Blob, never into the CMS",
    collectsPersonalData: true,
    component: "FileUpload",
  },
  "yes-no": {
    id: "yes-no",
    pattern: null,
    validates: "Required",
    collectsPersonalData: false,
    component: "Radios",
  },
};

/** One question in a service definition. Authored by an officer (§6.7). */
export type Question = {
  /** Stable key. Becomes the draft-cookie field and the step's URL segment. */
  id: string;
  type: QuestionTypeId;
  /** The question itself, one thing per page (GDS `question-pages`). */
  label: LocalizedText;
  /** Optional hint below the label. Never a substitute for a clear label. */
  hint?: LocalizedText;
  required: boolean;
  /** For `choose-one` and `choose-several` only. */
  options?: Array<{ value: string; label: LocalizedText }>;
  /** For `short-text` and `long-text`. `long-text` renders a character count. */
  maxLength?: number;
};

/** Whether any question in a service collects personal data. */
export function collectsPersonalData(questions: readonly Question[]): boolean {
  return questions.some((q) => questionTypes[q.type].collectsPersonalData);
}
