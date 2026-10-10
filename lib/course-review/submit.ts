/**
 * Validating a course review submission against the course it is for.
 *
 * `courseReviewSubmissionSchema` in lib/validation.ts checks the shape of the
 * form. This adds the two checks that need the course: that the term is one
 * the form offers (recent terms only) and that the instructor is on the
 * course's list or is "someone else". It returns error codes, never wording,
 * so the form's server action decides how to say them in each language.
 *
 * Pure, with `now` passed in, so the term rule is testable without a clock.
 */
import type { AcademicTerm, Instructor, WorkloadBand } from "@/content/course-review/types";
import { validInstructorKeys } from "@/lib/course-review/instructors";
import { isRecentTerm, parseTermKey } from "@/lib/course-review/terms";
import { courseReviewSubmissionSchema } from "@/lib/validation";

/** The rate limit scope for review submissions, separate from every other form so a reviewer is not locked out of the contact form. */
export const REVIEW_RATE_LIMIT_SCOPE = "course-review";

/** The form fields an error can point at. */
export type ReviewField =
  "term" | "instructor" | "workload" | "workloadBand" | "assessment" | "tips" | "quote";

/** What is wrong with a field. The form turns each into a sentence. */
export type ReviewErrorCode = "required" | "tooShort" | "tooLong" | "identifying" | "invalidChoice";

export type ReviewErrors = Partial<Record<ReviewField, ReviewErrorCode>>;

/** The form as posted: every value a string, tips as up to three separate boxes. */
export type RawReviewForm = {
  code: string;
  term: string;
  instructor: string;
  workload: string;
  workloadBand: string;
  assessment: string;
  tips: string[];
  quote: string;
  locale: string;
  nickname: string;
};

/** A submission that passed every check, ready to store. */
export type ValidReview = {
  courseCode: string;
  term: AcademicTerm;
  instructorKey: string;
  workload: string;
  workloadBand: WorkloadBand | null;
  assessment: string;
  tips: string[];
  quote: string | null;
  locale: "en" | "th";
};

const ERROR_CODES: readonly ReviewErrorCode[] = [
  "required",
  "tooShort",
  "tooLong",
  "identifying",
  "invalidChoice",
];

function asErrorCode(message: string): ReviewErrorCode {
  return (ERROR_CODES as readonly string[]).includes(message)
    ? (message as ReviewErrorCode)
    : "invalidChoice";
}

export function validateReview(
  raw: RawReviewForm,
  course: { code: string; instructors?: readonly Instructor[] },
  now: Date
): { ok: true; data: ValidReview } | { ok: false; errors: ReviewErrors } {
  // Blank tip boxes are not tips. Dropping them first means the three boxes
  // can be left empty without the array schema seeing empty strings.
  const tips = raw.tips.map((tip) => tip.trim()).filter((tip) => tip.length > 0);
  const result = courseReviewSubmissionSchema.safeParse({ ...raw, code: course.code, tips });

  const errors: ReviewErrors = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field !== "string") continue;
      const target: ReviewField | null =
        field === "locale" || field === "code" || field === "nickname"
          ? null
          : (field as ReviewField);
      // The first issue for a field is the most useful one ("required" before
      // "too short"), so later ones are ignored.
      if (target && !errors[target]) {
        errors[target] =
          target === "tips" && issue.code === "too_big" ? "tooLong" : asErrorCode(issue.message);
      }
    }
  }

  const term = parseTermKey(raw.term);
  if (!errors.term) {
    if (!term || !isRecentTerm(term, now)) errors.term = "invalidChoice";
  }
  if (!errors.instructor && !validInstructorKeys(course.instructors).includes(raw.instructor)) {
    errors.instructor = "invalidChoice";
  }

  if (!result.success || Object.keys(errors).length > 0 || !term) {
    return { ok: false, errors };
  }

  const { data } = result;
  return {
    ok: true,
    data: {
      courseCode: course.code,
      term,
      instructorKey: data.instructor,
      workload: data.workload,
      workloadBand: data.workloadBand ? data.workloadBand : null,
      assessment: data.assessment,
      tips: data.tips.filter((tip): tip is string => Boolean(tip)),
      quote: data.quote ? data.quote : null,
      locale: data.locale,
    },
  };
}
