/**
 * Types for the curriculum data this service plans against.
 *
 * Two ideas carry most of the weight here. `Derivation` records where a part
 * of a version's data actually came from, because the 2568 curriculum has no
 * published study plan and borrows its sequence from the 2023 revision, and a
 * student must be told that. `CohortMapping.provenance` records whether a
 * cohort-to-version link is printed on a faculty document or merely attested
 * by BIRSA, because two of them are attested and nothing in the sources says
 * so.
 *
 * Course codes and titles are English in both locales, matching the Thai
 * handbook chapter which does the same.
 */
import type { SourceDocument, SourceId } from "./sources";

export type LocalizedText = { en: string; th: string };

export type CurriculumVersionId = "2564" | "2564-rev2566" | "2568";

/** Where one part of a version's data came from. */
export type Derivation =
  | { kind: "published"; source: SourceId }
  | {
      kind: "inferred";
      /** The version this part was borrowed from. */
      from: CurriculumVersionId;
      source: SourceId;
      /** Shown to the student, not just logged. */
      reason: LocalizedText;
      /**
       * Set when the provenance is still inferred but the notice is deliberately
       * not shown to students. Records WHY and on whose instruction, so that
       * suppressing a warning is a visible decision in the data rather than a
       * silent omission. `inferredParts` still returns these, so maintainers and
       * tests can see them; only the rendered notice skips them.
       */
      suppressed?: { reason: string; by: string; on: string };
    };

/** A part of a version's data, carrying its own provenance. */
export type Derived<T> = { value: T; derivation: Derivation };

export type CohortMapping = {
  /** First two digits of the student ID, e.g. "66". */
  code: string;
  provenance:
    | { kind: "document"; source: SourceId; page: number }
    | { kind: "attested"; by: string; on: string };
};

/**
 * Two kinds of value share this union, which is worth stating plainly.
 *
 * `CreditCategory.id` uses the requirement buckets, including the three that
 * split the minor: `minorRequired`, `minorElective`, `minorElectiveOther`.
 *
 * `Course.category` uses the same union, except that every minor course
 * carries the pooled value `"minor"` and never one of those three. A minor
 * course's bucket is not a property of the course; it depends on which minor
 * the student chose, and is resolved by `resolveMinorCategory`.
 */
export type CategoryId =
  | "genEdPart1"
  | "genEdPart2"
  | "core"
  | "concentrationRequired"
  | "economics"
  | "concentrationElectiveArea"
  | "concentrationElectiveApproaches"
  | "minor"
  | "minorRequired"
  | "minorElective"
  | "minorElectiveOther"
  | "freeElective";

export type MinorId = "governance" | "publicAdministration" | "globalPoliticalEconomy";

/**
 * One of the three minors a student picks between. `required` is the 9 credits
 * every student in this minor must take; `electives` is the list they choose 2
 * from. A course in neither list, but in another minor's lists, counts toward
 * the 6 credits of "electives in other minors".
 */
export type Minor = {
  id: MinorId;
  name: LocalizedText;
  /** Exactly 3 course codes, 9 credits. */
  required: string[];
  /** The pool this minor's own elective choice is made from. */
  electives: string[];
};

export type CreditCategory = {
  id: CategoryId;
  name: LocalizedText;
  /** Credits a student must earn in this category. */
  credits: number;
  /**
   * True when the student picks from a list rather than taking a fixed set,
   * which is what makes a recommended-plan entry a placeholder.
   */
  chooseFrom: boolean;
};

export type Course = {
  code: string;
  /** English in both locales. See the module header. */
  title: string;
  credits: number;
  category: CategoryId;
  /** Course codes that must be passed in an earlier term. */
  prerequisites: string[];
  /**
   * True for courses that do not count toward the graduation total, such as
   * TU050. PI574 no longer belongs on this list: from 2568 onward it counts
   * as a free elective (see content/curriculum/2568.ts), not as excluded.
   */
  excludedFromTotal?: boolean;
};

export type TermKind = "semester1" | "semester2" | "summer";

/**
 * `year` runs to 8, not 4. The degree has a seven-year limit, so a plan must
 * be able to represent a year that breaks it; a union capped at the nominal
 * four years would make the seven-year finding unreachable.
 */
export type TermRef = { year: number; kind: TermKind };

/**
 * One entry in a recommended term: either a named course, or a slot the
 * student fills themselves ("Minor Required Course 1"). Roughly a third of
 * the published plan is placeholders, which is why the journey has a
 * placeholder-filling step at all.
 */
export type PlanEntry =
  | { kind: "course"; code: string }
  | { kind: "placeholder"; id: string; label: LocalizedText; category: CategoryId };

export type PlannedTerm = {
  term: TermRef;
  /** True where the source marks the term optional, e.g. Year 2 summer. */
  optional: boolean;
  entries: PlanEntry[];
};

export type AcademicRules = {
  minCreditsRegularTerm: number;
  maxCreditsRegularTerm: number;
  maxCreditsSummerTerm: number;
  minSemesters: number;
  maxYears: number;
  minGpa: number;
  /** Where these rules are written down, cited in every finding. */
  source: { document: SourceId; provision: string };
};

export type Contradiction = {
  id: string;
  /** What the sources disagree about, in the maintainer's words. */
  summary: string;
  /** Shown to the student when it changes a number they see. */
  disclosure: LocalizedText | null;
  /**
   * Cohort codes this disclosure applies to. Omitted means it applies to every
   * cohort on this version. Scoping matters because a version can be documented
   * for one cohort and merely attested for another, and telling a documented
   * student about someone else's uncertainty is noise on the one screen that
   * has to be worth reading.
   */
  cohorts?: string[];
};

export type Verification = {
  /** A named person at the faculty, once someone has actually checked. */
  verifiedBy: string | null;
  /** ISO date. */
  verifiedOn: string | null;
  sources: SourceDocument[];
  contradictions: Contradiction[];
};

export type CurriculumVersion = {
  id: CurriculumVersionId;
  label: LocalizedText;
  cohorts: CohortMapping[];
  /** Credits needed to graduate. */
  graduationCredits: Derived<number>;
  categories: CreditCategory[];
  minors: Minor[];
  courses: Derived<Course[]>;
  recommendedPlan: Derived<PlannedTerm[]>;
  rules: Derived<AcademicRules>;
  /**
   * Course codes shown on the confirm screen so a student can check this is
   * really their curriculum against their own transcript.
   */
  distinguishingCourses: string[];
  verification: Verification;
};
