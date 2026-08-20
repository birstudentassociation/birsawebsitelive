/**
 * Answer validation for the eleven question types (REDESIGN-2.0 §6.7).
 *
 * `lib/services/questionTypes.ts` is FROZEN and names what each type
 * validates in words ("Length, required", "Thai and international formats").
 * This file is the code behind those words. Wave 4A owns it; nothing here
 * adds a question type, and nothing in questionTypes.ts is edited to make
 * room for one.
 *
 * Two concerns live here, kept separate on purpose:
 *
 *   - Reading a question's answer back out of a posted `FormData` in the
 *     shape the matching `bds/` form component actually posts it in
 *     (`questionFieldNames`, `extractRawAnswer`). `DateInput` posts three
 *     fields, `Checkboxes` posts one name repeated, everything else posts a
 *     single field named after the question id.
 *   - Deciding whether that answer is acceptable (`validateAnswer`), which is
 *     the actual "validates" column of the §6.7 table.
 *
 * Every validator re-runs server-side on the final submit as well as on each
 * step (§5.1 item 3, "defense in depth", the same shape the equipment loan
 * wizard already uses in `app/[lang]/services/equipment-loan/[item]/request/actions.ts`):
 * a step's own action can only be trusted for what it happened to check, a
 * tampered or replayed POST to a later step must fail the same way.
 */
import type { Locale } from "@/lib/i18n";
import type { LocalizedText } from "@/lib/services/defineService";
import type { Question, QuestionTypeId } from "@/lib/services/questionTypes";
import { todayInBangkok } from "@/lib/bangkok-today";

/**
 * How one answer is carried in a draft and, later, in a submitted record.
 * `choose-several` is the only type that is genuinely a list; every other
 * type, including `date` and `date-range`, is normalised to a single
 * string so the draft cookie and the eventual submission record stay
 * JSON-serialisable without a per-type shape.
 *
 * `date` is stored as `YYYY-MM-DD`. `date-range` is stored as two ISO dates
 * joined by `..` (`2026-01-05..2026-01-10`), never a colon, which is
 * reserved for clock times and URLs (docs/NEWS-STYLE.md) and would also
 * collide with a delimiter a future locale-aware date format might use.
 */
export type AnswerValue = string | string[];

const DATE_RANGE_DELIMITER = "..";

function messages(locale: Locale) {
  const pick = (text: LocalizedText) => text[locale];
  return {
    required: pick({ en: "Enter an answer", th: "กรุณากรอกคำตอบ" }),
    tooLong: (max: number) =>
      pick({
        en: `Enter no more than ${max} characters`,
        th: `กรอกได้ไม่เกิน ${max} ตัวอักษร`,
      }),
    invalidEmail: pick({
      en: "Enter an email address in the correct format, like name@example.com",
      th: "กรอกอีเมลให้ถูกต้องตามรูปแบบ เช่น name@example.com",
    }),
    invalidPhone: pick({
      en: "Enter a phone number using digits only, for example 0812345678 or +66812345678",
      th: "กรอกหมายเลขโทรศัพท์เป็นตัวเลข เช่น 0812345678 หรือ +66812345678",
    }),
    invalidDate: pick({ en: "Enter a real date", th: "กรอกวันที่ให้ถูกต้อง" }),
    datePast: pick({ en: "Date must not be in the past", th: "วันที่ต้องไม่ใช่วันที่ผ่านมาแล้ว" }),
    rangeOrder: pick({
      en: "The end date must be on or after the start date",
      th: "วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่มต้น",
    }),
    chooseOne: pick({ en: "Choose one option", th: "กรุณาเลือกหนึ่งตัวเลือก" }),
    chooseSeveral: pick({
      en: "Choose at least one option",
      th: "กรุณาเลือกอย่างน้อยหนึ่งตัวเลือก",
    }),
    invalidOption: pick({
      en: "Choose one of the given options",
      th: "กรุณาเลือกจากตัวเลือกที่กำหนด",
    }),
    yesNo: pick({ en: "Select yes or no", th: "กรุณาเลือกใช่หรือไม่ใช่" }),
    fileRequired: pick({ en: "Choose a file to upload", th: "กรุณาเลือกไฟล์ที่จะอัปโหลด" }),
    fileTooLarge: pick({
      en: "That file is too large. Choose a file under 10MB",
      th: "ไฟล์มีขนาดใหญ่เกินไป กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 10MB",
    }),
  };
}

export type ValidationResult = { ok: true; value: AnswerValue } | { ok: false; error: string };

/** The chassis-wide upload cap, pending real Vercel Blob wiring (§6.3, §5.1 item 10 note in the report). Advisory only until a route enforces it server-side against the actual bytes. */
export const FILE_UPLOAD_MAX_BYTES = 10 * 1024 * 1024;

/** The literal field name(s) `formData` carries for one question, matching the `bds/` component that renders it. */
export function questionFieldNames(question: Question): string[] {
  switch (question.type) {
    case "date":
      return [`${question.id}-day`, `${question.id}-month`, `${question.id}-year`];
    case "date-range":
      return [
        `${question.id}-from-day`,
        `${question.id}-from-month`,
        `${question.id}-from-year`,
        `${question.id}-to-day`,
        `${question.id}-to-month`,
        `${question.id}-to-year`,
      ];
    default:
      return [question.id];
  }
}

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function readDateParts(
  formData: FormData,
  prefix: string
): { day: string; month: string; year: string } {
  return {
    day: readText(formData, `${prefix}-day`),
    month: readText(formData, `${prefix}-month`),
    year: readText(formData, `${prefix}-year`),
  };
}

/** `null` when any part is blank (nothing entered), `""` when parts are present but not a real calendar date. */
function composeIsoDate(parts: { day: string; month: string; year: string }): string | null | "" {
  if (!parts.day && !parts.month && !parts.year) return null;
  const day = Number(parts.day);
  const month = Number(parts.month);
  const year = Number(parts.year);
  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) return "";
  if (String(year).length !== 4) return "";
  const date = new Date(Date.UTC(year, month - 1, day));
  const roundTrips =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  if (!roundTrips) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${year}-${pad(month)}-${pad(day)}`;
}

/**
 * Validates one question's answer against `formData`. Returns the answer
 * normalised to `AnswerValue` on success, or a single localised error
 * string on failure. Optional questions left entirely blank return
 * `{ ok: true, value: "" }` (or `[]` for `choose-several`): "not answered" is
 * a valid state for an optional question and `CheckAnswers` renders it as
 * such, never as a validation failure.
 */
export function validateAnswer(
  question: Question,
  formData: FormData,
  locale: Locale
): ValidationResult {
  const m = messages(locale);

  switch (question.type) {
    case "short-text":
    case "student-id": {
      const value = readText(formData, question.id);
      if (!value) {
        return question.required ? { ok: false, error: m.required } : { ok: true, value: "" };
      }
      if (question.maxLength && value.length > question.maxLength) {
        return { ok: false, error: m.tooLong(question.maxLength) };
      }
      return { ok: true, value };
    }

    case "long-text": {
      const value = readText(formData, question.id);
      if (!value) {
        return question.required ? { ok: false, error: m.required } : { ok: true, value: "" };
      }
      if (question.maxLength && value.length > question.maxLength) {
        return { ok: false, error: m.tooLong(question.maxLength) };
      }
      return { ok: true, value };
    }

    case "email": {
      const value = readText(formData, question.id);
      if (!value) {
        return question.required ? { ok: false, error: m.required } : { ok: true, value: "" };
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return { ok: false, error: m.invalidEmail };
      }
      return { ok: true, value };
    }

    case "phone": {
      const value = readText(formData, question.id);
      if (!value) {
        return question.required ? { ok: false, error: m.required } : { ok: true, value: "" };
      }
      const stripped = value.replace(/[\s-]/g, "");
      if (!/^\+?\d{9,15}$/.test(stripped)) {
        return { ok: false, error: m.invalidPhone };
      }
      return { ok: true, value };
    }

    case "date": {
      const parts = readDateParts(formData, question.id);
      const iso = composeIsoDate(parts);
      if (iso === null) {
        return question.required ? { ok: false, error: m.required } : { ok: true, value: "" };
      }
      if (iso === "") {
        return { ok: false, error: m.invalidDate };
      }
      if (iso < todayInBangkok()) {
        return { ok: false, error: m.datePast };
      }
      return { ok: true, value: iso };
    }

    case "date-range": {
      const fromParts = readDateParts(formData, `${question.id}-from`);
      const toParts = readDateParts(formData, `${question.id}-to`);
      const fromIso = composeIsoDate(fromParts);
      const toIso = composeIsoDate(toParts);

      if (fromIso === null && toIso === null) {
        return question.required ? { ok: false, error: m.required } : { ok: true, value: "" };
      }
      if (fromIso === "" || fromIso === null) {
        return { ok: false, error: m.invalidDate };
      }
      if (toIso === "" || toIso === null) {
        return { ok: false, error: m.invalidDate };
      }
      if (fromIso < todayInBangkok()) {
        return { ok: false, error: m.datePast };
      }
      if (toIso < fromIso) {
        return { ok: false, error: m.rangeOrder };
      }
      return { ok: true, value: `${fromIso}${DATE_RANGE_DELIMITER}${toIso}` };
    }

    case "choose-one": {
      const value = readText(formData, question.id);
      if (!value) {
        return question.required ? { ok: false, error: m.chooseOne } : { ok: true, value: "" };
      }
      const options = question.options ?? [];
      if (!options.some((option) => option.value === value)) {
        return { ok: false, error: m.invalidOption };
      }
      return { ok: true, value };
    }

    case "choose-several": {
      const values = formData
        .getAll(question.id)
        .map((v) => String(v))
        .filter(Boolean);
      if (values.length === 0) {
        return question.required ? { ok: false, error: m.chooseSeveral } : { ok: true, value: [] };
      }
      const options = question.options ?? [];
      if (!values.every((value) => options.some((option) => option.value === value))) {
        return { ok: false, error: m.invalidOption };
      }
      return { ok: true, value: values };
    }

    case "yes-no": {
      const value = readText(formData, question.id);
      if (!value) {
        return question.required ? { ok: false, error: m.yesNo } : { ok: true, value: "" };
      }
      if (value !== "yes" && value !== "no") {
        return { ok: false, error: m.yesNo };
      }
      return { ok: true, value };
    }

    case "file-upload": {
      const value = formData.get(question.id);
      const file = value instanceof File ? value : null;
      if (!file || file.size === 0) {
        return question.required ? { ok: false, error: m.fileRequired } : { ok: true, value: "" };
      }
      if (file.size > FILE_UPLOAD_MAX_BYTES) {
        return { ok: false, error: m.fileTooLarge };
      }
      // The bytes themselves are the caller's problem (Vercel Blob, never
      // the CMS: questionTypes.ts's own note on this type). This module
      // only validates; it does not upload.
      return { ok: true, value: file.name };
    }

    default: {
      // Unreachable for a definition that passed `validateServiceDefinition`
      // (which checks every question's type against `questionTypes`), but a
      // CMS document is data at runtime, not a type the compiler can see, so
      // this is the runtime backstop for a corrupt or hand-edited one.
      const exhaustive: never = question.type;
      void exhaustive;
      return { ok: false, error: m.required };
    }
  }
}

/** Splits a stored `date-range` answer back into its two ISO dates. */
export function splitDateRange(value: string): { from: string; to: string } | null {
  const [from, to] = value.split(DATE_RANGE_DELIMITER);
  if (!from || !to) return null;
  return { from, to };
}

/**
 * Formats a stored answer for display on `CheckAnswers` and the officer
 * queue. Never re-parses `formData`: this reads the already-validated
 * `AnswerValue`, so it works equally on a live draft and on a persisted
 * submission.
 */
export function formatAnswerForDisplay(
  question: Question,
  value: AnswerValue,
  locale: Locale,
  labels: { notAnswered: string; yes: string; no: string; listSeparator: string }
): string {
  if (question.type === "choose-several") {
    const values = Array.isArray(value) ? value : [];
    if (values.length === 0) return labels.notAnswered;
    const options = question.options ?? [];
    return values
      .map((v) => options.find((option) => option.value === v)?.label[locale] ?? v)
      .join(labels.listSeparator);
  }

  const raw = Array.isArray(value) ? "" : value;
  if (!raw) return labels.notAnswered;

  if (question.type === "choose-one") {
    const options = question.options ?? [];
    return options.find((option) => option.value === raw)?.label[locale] ?? raw;
  }

  if (question.type === "yes-no") {
    return raw === "yes" ? labels.yes : labels.no;
  }

  if (question.type === "date") {
    return formatIsoDate(raw, locale);
  }

  if (question.type === "date-range") {
    const range = splitDateRange(raw);
    if (!range) return raw;
    return `${formatIsoDate(range.from, locale)} ${labels.listSeparator} ${formatIsoDate(range.to, locale)}`;
  }

  return raw;
}

function formatIsoDate(iso: string, locale: Locale): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  const date = new Date(Date.UTC(year, month - 1, day));
  const intlLocale = locale === "th" ? "th-TH-u-ca-gregory" : "en-GB";
  return new Intl.DateTimeFormat(intlLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    calendar: "gregory",
    timeZone: "UTC",
  }).format(date);
}

/**
 * The inverse of reading a question's answer out of `FormData`: rebuilds a
 * synthetic `FormData` from an already-normalised `AnswerValue`. Used for
 * defense in depth (§5.1 item 3's own idea, applied at the final submit): a
 * draft's answers were valid when each step collected them, but the final
 * "confirm and send" re-validates every one of them again against the full
 * draft, exactly as the equipment loan wizard's `submitLoanRequestCheck`
 * re-runs its own schema rather than trusting the steps that came before it.
 * `file-upload` has no synthetic form to rebuild (a stored answer only ever
 * keeps the file's name, never its bytes), so it is intentionally not
 * revalidated at this stage; a required file question with a stored answer
 * present is treated as satisfied.
 */
export function answerToFormData(question: Question, value: AnswerValue | undefined): FormData {
  const formData = new FormData();
  if (value === undefined) return formData;

  const setDateParts = (prefix: string, iso: string) => {
    const [year, month, day] = iso.split("-");
    if (year) formData.set(`${prefix}-year`, year);
    if (month) formData.set(`${prefix}-month`, month);
    if (day) formData.set(`${prefix}-day`, day);
  };

  switch (question.type) {
    case "choose-several": {
      const values = Array.isArray(value) ? value : [];
      for (const v of values) formData.append(question.id, v);
      return formData;
    }
    case "date": {
      const iso = Array.isArray(value) ? "" : value;
      if (iso) setDateParts(question.id, iso);
      return formData;
    }
    case "date-range": {
      const raw = Array.isArray(value) ? "" : value;
      const range = raw ? splitDateRange(raw) : null;
      if (range) {
        setDateParts(`${question.id}-from`, range.from);
        setDateParts(`${question.id}-to`, range.to);
      }
      return formData;
    }
    default: {
      const raw = Array.isArray(value) ? "" : value;
      if (raw) formData.set(question.id, raw);
      return formData;
    }
  }
}

/** Every question type this module knows how to validate. Used only by tests to assert coverage stays complete if `questionTypeIds` grows (it cannot, from outside `questionTypes.ts`, but the assertion is cheap insurance). */
export const VALIDATED_TYPES: readonly QuestionTypeId[] = [
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
];
