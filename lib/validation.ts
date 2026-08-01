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

export const loanRequestSchema = z
  .object({
    itemKey: z.string().min(1, "Choose an item"),
    studentName: z.string().min(1, "Enter your name").max(120),
    studentId: z.string().min(1, "Enter your student ID").max(40),
    studentEmail: z.string().email("Enter a valid email"),
    pickupDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date"),
    returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date"),
    reason: z.string().max(1000).optional().or(z.literal("")),
    nickname: honeypot,
  })
  .refine((data) => data.returnDate >= data.pickupDate, {
    message: "Return date must be on or after the pickup date",
    path: ["returnDate"],
  });

export type LoanRequestInput = z.infer<typeof loanRequestSchema>;

export const inventoryLoanRequestSchema = z
  .object({
    itemKey: z.string().min(1),
    studentName: z.string().min(1).max(120),
    studentId: z.string().min(1).max(40),
    studentEmail: z.string().email(),
    phone: z.string().max(40).optional().or(z.literal("")),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
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
  // The path the feedback was given from, e.g. "/en/answers/registration/outcome".
  // Never a full URL: query strings and fragments are stripped before this is
  // parsed, so nothing accidentally captured in a query param ends up stored.
  path: z.string().min(1).max(300),
  nickname: honeypot,
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

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
