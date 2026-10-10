/**
 * Shared zod schemas for the site's forms, used both client-side (for
 * inline validation) and server-side (in `app/api/*` route handlers, which
 * must never trust client validation alone).
 *
 * `nickname` is a honeypot: a real visitor never sees or fills this field,
 * so any non-empty value means a bot filled every field it could find. The
 * route handler should silently accept-and-discard in that case rather than
 * reveal that a honeypot exists.
 */
import { z } from "zod";
import { dataRights } from "@/content/privacy/register";
import { WORKLOAD_BANDS } from "@/lib/course-review/workload";

const honeypot = z.string().max(0, "Leave this field empty").optional().or(z.literal(""));

export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  category: z.enum(["question", "suggestion", "problem", "other"]),
  subject: z.string().min(1).max(150),
  message: z.string().min(15).max(5000),
  nickname: honeypot,
});

export const startClubSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  clubName: z.string().min(1).max(100),
  description: z.string().min(15).max(2000),
  members: z.string().max(200).optional(),
  nickname: honeypot,
});

export type ContactInput = z.infer<typeof contactSchema>;
export type StartClubInput = z.infer<typeof startClubSchema>;

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isRealCalendarDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false;
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year!, month! - 1, day!));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month! - 1 && date.getUTCDate() === day
  );
}

const calendarDate = (message?: string) =>
  z.string().refine(isRealCalendarDate, message ? { message } : undefined);

export const loanRequestSchema = z
  .object({
    itemKey: z.string().min(1, "Choose an item"),
    studentName: z.string().min(1, "Enter your name").max(120),
    studentId: z.string().min(1, "Enter your student ID").max(40),
    studentEmail: z.string().email("Enter a valid email"),
    pickupDate: calendarDate("Enter a valid date"),
    returnDate: calendarDate("Enter a valid date"),
    reason: z.string().max(1000).optional().or(z.literal("")),
    nickname: honeypot,
  })
  .refine((data) => data.returnDate >= data.pickupDate, {
    message: "Return date must be on or after the pickup date",
    path: ["returnDate"],
  });

export type LoanRequestInput = z.infer<typeof loanRequestSchema>;

/**
 * Note for callers that reach for a single field: in Zod 4 `.refine()` returns
 * the object schema itself rather than wrapping it in a `ZodEffects`, so
 * `.shape.<field>` is reachable directly on this constant. The `.innerType()`
 * unwrapping the loan wizard's step actions used under Zod 3 no longer exists,
 * because there is no longer a wrapper to unwrap.
 */
export const inventoryLoanRequestSchema = z
  .object({
    itemKey: z.string().min(1),
    studentName: z.string().min(1).max(120),
    studentId: z.string().min(1).max(40),
    studentEmail: z.string().email(),
    phone: z.string().max(40).optional().or(z.literal("")),
    startDate: calendarDate(),
    endDate: calendarDate(),
    reason: z.string().max(1000).optional().or(z.literal("")),
    nickname: honeypot,
  })
  .refine((data) => data.endDate >= data.startDate, {
    path: ["endDate"],
    message: "Return date must be on or after the pickup date",
  });

export type InventoryLoanRequestInput = z.infer<typeof inventoryLoanRequestSchema>;

export const loanLookupSchema = z.object({
  reference: z.string().min(1).max(40),
  email: z.string().email(),
  nickname: honeypot,
});

export type LoanLookupInput = z.infer<typeof loanLookupSchema>;

/**
 * The five GOV.UK-prescribed satisfaction levels, in display order. These are
 * the stable machine values stored in `satisfaction_feedback.rating` (see
 * db/schema.sql); the display labels live in
 * components/feedback/feedbackCopy.ts, not here.
 */
export const FEEDBACK_RATINGS = [
  "very_satisfied",
  "satisfied",
  "neither",
  "dissatisfied",
  "very_dissatisfied",
] as const;

export type FeedbackRating = (typeof FEEDBACK_RATINGS)[number];

/** Free-text comments are capped well short of abuse-length input; there is no minimum, since the field is optional. */
const FEEDBACK_COMMENT_MAX = 1200;

export const feedbackSchema = z.object({
  rating: z.enum(FEEDBACK_RATINGS),
  comment: z.string().max(FEEDBACK_COMMENT_MAX).optional().or(z.literal("")),
  locale: z.enum(["en", "th"]),
  // The path the feedback was given from, e.g. "/en/contact/where-to-go".
  // Never a full URL: query strings and fragments are stripped before this is
  // parsed, so nothing accidentally captured in a query param ends up stored.
  path: z.string().min(1).max(300),
  nickname: honeypot,
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

/**
 * Length limits for the course review form, shared with the form's
 * `maxLength` attributes so the page and the server agree. Thai packs a
 * sentence into far fewer characters than English, so the minimum is low.
 */
export const COURSE_REVIEW_LIMITS = {
  minText: 10,
  workload: 1000,
  assessment: 1000,
  tip: 300,
  quote: 500,
  maxTips: 3,
} as const;

/**
 * Anything that looks like it would identify a person: an email address, a
 * run of nine or more digits (a student ID or a phone number), or a phone
 * number written with separators. The form asks for none of these, so one in
 * the free text is a mistake the reader should be told about before it is
 * stored. A heuristic, not a guarantee; officers still read every submission.
 */
export function looksIdentifying(text: string): boolean {
  return (
    /[^\s@]+@[^\s@]+\.[^\s@]+/.test(text) ||
    /\d{9,}/.test(text) ||
    /\b0\d{1,2}[- ]\d{3}[- ]\d{3,4}\b/.test(text)
  );
}

/**
 * Course review submission. The messages are codes, not sentences: the form's
 * server action maps each code to bilingual wording, so the schema stays
 * language-free. `term` and `instructor` are only checked for shape here; that
 * they are a term the form offers and an instructor on the course is checked
 * against the course in lib/course-review/submit.ts.
 */
const reviewText = (max: number) =>
  z
    .string()
    .trim()
    .min(1, "required")
    .min(COURSE_REVIEW_LIMITS.minText, "tooShort")
    .max(max, "tooLong")
    .refine((text) => !looksIdentifying(text), "identifying");

const optionalReviewText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, "tooLong")
    .refine((text) => !looksIdentifying(text), "identifying")
    .optional()
    .or(z.literal(""));

export const courseReviewSubmissionSchema = z.object({
  code: z.string().min(1).max(20),
  term: z
    .string()
    .min(1, "required")
    .regex(/^\d{4}-(1|2|summer)$/, "invalidChoice"),
  instructor: z.string().min(1, "required").max(100),
  workload: reviewText(COURSE_REVIEW_LIMITS.workload),
  workloadBand: z.enum(WORKLOAD_BANDS, "invalidChoice").optional().or(z.literal("")),
  assessment: reviewText(COURSE_REVIEW_LIMITS.assessment),
  tips: z.array(optionalReviewText(COURSE_REVIEW_LIMITS.tip)).max(COURSE_REVIEW_LIMITS.maxTips),
  quote: optionalReviewText(COURSE_REVIEW_LIMITS.quote),
  locale: z.enum(["en", "th"]),
  nickname: honeypot,
});

export type CourseReviewSubmissionInput = z.infer<typeof courseReviewSubmissionSchema>;

/**
 * The `/privacy/your-data` journey, through which a reader exercises a PDPA
 * right (sections 30 to 36, 19 and 73). `right` is validated against the ids
 * in `content/privacy/register.ts` (`dataRights`) rather than a separate
 * hardcoded list, so a right can never be requested here that the register
 * does not also document.
 */
const RIGHTS_IDS = dataRights.map((right) => right.id) as [string, ...string[]];

export const rightsRequestSchema = z.object({
  right: z.enum(RIGHTS_IDS),
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  details: z.string().max(2000).optional().or(z.literal("")),
  nickname: honeypot,
});

export type RightsRequestInput = z.infer<typeof rightsRequestSchema>;
