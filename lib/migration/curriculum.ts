/**
 * Curriculum and course-review migration (REDESIGN-2.0 §11.4 item 6, Wave 6D).
 *
 * WHY THIS FAMILY MIGRATES, NOT "STAYS TYPESCRIPT"
 *
 * The task brief that seeded this wave floated "leave it as typed
 * TypeScript, like content/emergency/**" as a legitimate outcome if the
 * engineering case supported it. It does not, and the reason is not this
 * module's own judgement call: the design has already made this decision and
 * argued it in two places.
 *
 * REDESIGN-2.0.md §6.3 lists "Curriculum data" under "Moves to Sanity", then
 * spells out why leaving it in git was considered and rejected: "The roadmap
 * proposed leaving Smart Answers, curriculum and the privacy register in git
 * because they change slowly, carry real consequences when wrong, and are
 * protected by a test suite. That reasoning is sound, but leaving them in
 * git means the IT officer is still required for them, which fails the
 * governing requirement." CMS-SCHEMA-CONVENTIONS.md §7 repeats the same
 * conclusion in schema terms: "Curriculum. Credit totals, prerequisite
 * cycles and source citations become schema validation, plus a mandatory
 * second approver. It changes about once every few years and an error sends
 * a student to the wrong graduation, so it gets the strictest workflow on
 * the site. It does not get a developer."
 *
 * Re-running that argument here would be re-deciding a disposition the
 * design process already settled — exactly what the shared Wave 6 brief
 * says not to do ("No disposition decisions"). So this module builds the
 * migration: it transforms `content/curriculum/**` and
 * `content/course-review/courses.ts` into the Sanity document shapes that
 * satisfy `lib/study-plan/**`'s consumption (verified by reading that
 * consumer in full before writing a line here) and the three
 * credit-total / prerequisite-cycle / source-citation validations
 * §7 requires.
 *
 * THE GAP THIS MODULE COULD NOT CLOSE: NO SCHEMA EXISTS
 *
 * `sanity/schemaTypes/index.ts` registers document types for news, events,
 * pages, guides, clubs, committee members, portfolios, minutes, decisions,
 * budget entries, regulations, site settings, navigation and service
 * definitions. There is no `curriculumVersion` or `courseReview` type. No
 * wave has built one — Wave 3's five agents mapped to different domains, and
 * curriculum was called out for "stronger controls" rather than folded into
 * one of them. Building that schema is a real, undone prerequisite for this
 * family's editor workflow (§6.5's validate-on-publish, the mandatory
 * second approver) to exist at all.
 *
 * This module is not the place to invent that schema — schema is reviewed
 * like code (CMS-SCHEMA-CONVENTIONS.md §1) and `sanity/schemaTypes/**` is
 * outside this wave's owned paths. What it does instead: define, in the
 * types below, the exact document shape the migration emits, so whoever
 * builds the schema has a working, data-driven specification rather than a
 * blank page, and document the gap loudly in the migration report
 * (`docs/migration/curriculum.md`) rather than papering over it with a
 * guessed schema nobody reviewed.
 *
 * IDS AND THE DIFF REPORT: WAVE 6A'S SHARED CONTRACT
 *
 * `lib/migration/ids.ts` (deterministic id derivation) and
 * `lib/migration/report.ts` (the diff-report writer) are Wave 6A's owned,
 * shared contract, used here rather than reimplemented — that is the whole
 * point of a shared `documentId`: "Four independent id schemes would each be
 * individually deterministic and collectively unauditable" (ids.ts's own
 * header). Both files did not exist for a large part of this module's
 * development (checked repeatedly while reading the consumer and building
 * the transform below); the earlier draft of this file carried its own
 * local stand-ins for exactly that reason, per the brief's instruction for
 * the situation — "write the call site you want and report the gap". Once
 * `lib/migration/ids.ts` and `lib/migration/report.ts` landed, this module
 * was switched over to call them, and the local stand-ins were deleted.
 * `curriculumVersionDocId` / `courseReviewDocId` below are now thin wrappers
 * over `documentId`, kept only because tests and the scripts already name
 * them; `_key` derivation stays local (see the note at its definition,
 * below the document-shape types) because `arrayKey`'s all-lowercase
 * segment rule buys nothing for a value that only needs to be unique inside
 * its own array, never across families.
 *
 * DOCUMENT SHAPE
 *
 * One document per curriculum version (three total) and one per
 * course-review entry (currently 84). Bilingual fields stay inside a single
 * document as `{ en, th }` objects — matching the `localizedString` /
 * `localizedText` object pattern the rest of the schema already uses
 * (CMS-SCHEMA-CONVENTIONS.md §3), not a document-per-locale split. That is
 * the right call here specifically because the source data already carries
 * both languages in one TypeScript object; splitting it into two documents
 * would be inventing a seam the data has never had, purely to match an MDX
 * convention this family doesn't share.
 *
 * Every array of objects gets a `_key` on each entry, deterministically
 * derived from the content itself (a course code, a category id, a source
 * id, or an index when nothing else uniquely identifies the entry — safe
 * because array order comes straight from a checked-in source file and does
 * not change between runs, satisfying the shared brief's determinism
 * requirement: no `Date.now()`, no random UUID, no id that depends on
 * something that could reorder).
 */
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { documentId } from "./ids";
import { writeMigrationReport, type MigrationEntry } from "./report";
import { CURRICULUM_VERSIONS } from "../../content/curriculum";
import type {
  AcademicRules,
  CohortMapping,
  Contradiction,
  Course as CurriculumCourse,
  CreditCategory,
  CurriculumVersion,
  CurriculumVersionId,
  Derivation,
  LocalizedText,
  Minor,
  PlanEntry,
  PlannedTerm,
} from "../../content/curriculum/types";
import type { SourceDocument } from "../../content/curriculum/sources";
import { courses as courseReviewCourses } from "../../content/course-review/courses";
import type {
  Bi,
  Course as CourseReviewCourse,
  Instructor,
  ReviewQuote,
  StudentReview,
} from "../../content/course-review/types";

// ---------------------------------------------------------------------------
// Deterministic ids, via lib/migration/ids.ts's shared `documentId`. Its
// segment rule (`ID_SEGMENT`) is lowercase ascii/digits/hyphens only, so a
// version id or course code with an uppercase letter is lowercased before
// being passed in; the document's own `versionId` / `code` field keeps the
// real casing, this only affects the `_id` string.
// ---------------------------------------------------------------------------

/** `curriculum-version-2564`, `curriculum-version-2564-rev2566`, `curriculum-version-2568`. */
export function curriculumVersionDocId(id: CurriculumVersionId): string {
  return documentId("curriculum-version", id.toLowerCase());
}

/** `course-review-pi280`, one per course code. Codes are unique by construction (see verify). */
export function courseReviewDocId(code: string): string {
  return documentId("course-review", code.toLowerCase());
}

/** Lowercase, hyphenated, ASCII-only. Used only for `_key`s that have no natural id. */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------------------------------------------------------------------------
// Document shapes. `_key` fields exist purely for Sanity's array-of-object
// convention; they carry no meaning to the transform logic itself.
// ---------------------------------------------------------------------------

export type SanityDoc = { _id: string; _type: string };

type Keyed<T> = T & { _key: string };

export type CurriculumVersionDocument = SanityDoc & {
  _type: "curriculumVersion";
  versionId: CurriculumVersionId;
  label: LocalizedText;
  cohorts: Keyed<CohortMapping>[];
  graduationCredits: { value: number; derivation: Derivation };
  categories: Keyed<CreditCategory>[];
  minors: Keyed<Minor>[];
  courses: { derivation: Derivation; value: Keyed<CurriculumCourse>[] };
  recommendedPlan: {
    derivation: Derivation;
    value: (Keyed<Omit<PlannedTerm, "entries">> & { entries: Keyed<PlanEntry>[] })[];
  };
  rules: { derivation: Derivation; value: AcademicRules };
  distinguishingCourses: string[];
  verification: {
    verifiedBy: string | null;
    verifiedOn: string | null;
    sources: Keyed<SourceDocument>[];
    contradictions: Keyed<Contradiction>[];
  };
};

export type CourseReviewDocument = SanityDoc & {
  _type: "courseReview";
  code: string;
  title: Bi;
  credits: CourseReviewCourse["credits"];
  category: CourseReviewCourse["category"];
  track: CourseReviewCourse["track"];
  yearLevel: number[];
  prerequisite?: Bi;
  instructors?: Keyed<Instructor>[];
  description: Bi;
  review?: Omit<StudentReview, "tips" | "quotes"> & {
    tips: Keyed<Bi>[];
    quotes?: Keyed<ReviewQuote>[];
  };
};

// ---------------------------------------------------------------------------
// Transform: source objects (already validated by the TypeScript types in
// content/curriculum/types.ts and content/course-review/types.ts) to the
// document shapes above. No field is invented, translated or summarised;
// every value is carried through unchanged (see the shared brief's "no
// hand-written content" rule).
//
// `_key` values below are the course code, category id, cohort code,
// contradiction id, source id, minor id, or plan-entry code/id — whichever
// the surrounding array's own items already carry as a natural, unique
// identifier. These deliberately do NOT go through `lib/migration/ids.ts`'s
// `arrayKey`: that helper's segment rule is lowercase-ascii-only, and
// lowercasing (say) `concentrationElectiveApproaches` buys no safety here —
// a Sanity `_key` only has to be unique within its own array, never across
// documents or families, and every array below is already guaranteed
// unique by the source TypeScript data itself. Forcing these through
// `arrayKey` would only make them harder to read for a maintainer
// cross-referencing this file against content/curriculum/types.ts.
// ---------------------------------------------------------------------------

export function curriculumVersionToDocument(version: CurriculumVersion): CurriculumVersionDocument {
  return {
    _id: curriculumVersionDocId(version.id),
    _type: "curriculumVersion",
    versionId: version.id,
    label: version.label,
    cohorts: version.cohorts.map((c) => ({ ...c, _key: c.code })),
    graduationCredits: version.graduationCredits,
    categories: version.categories.map((c) => ({ ...c, _key: c.id })),
    minors: version.minors.map((m) => ({ ...m, _key: m.id })),
    courses: {
      derivation: version.courses.derivation,
      value: version.courses.value.map((c) => ({ ...c, _key: c.code })),
    },
    recommendedPlan: {
      derivation: version.recommendedPlan.derivation,
      value: version.recommendedPlan.value.map((term) => ({
        ...term,
        _key: `${term.term.year}-${term.term.kind}`,
        entries: term.entries.map((entry) => ({
          ...entry,
          _key: entry.kind === "course" ? entry.code : entry.id,
        })),
      })),
    },
    rules: version.rules,
    distinguishingCourses: version.distinguishingCourses,
    verification: {
      verifiedBy: version.verification.verifiedBy,
      verifiedOn: version.verification.verifiedOn,
      sources: version.verification.sources.map((s) => ({ ...s, _key: s.id })),
      contradictions: version.verification.contradictions.map((c) => ({ ...c, _key: c.id })),
    },
  };
}

export function courseReviewToDocument(course: CourseReviewCourse): CourseReviewDocument {
  const doc: CourseReviewDocument = {
    _id: courseReviewDocId(course.code),
    _type: "courseReview",
    code: course.code,
    title: course.title,
    credits: course.credits,
    category: course.category,
    track: course.track,
    yearLevel: course.yearLevel,
    description: course.description,
  };
  if (course.prerequisite) doc.prerequisite = course.prerequisite;
  if (course.instructors) {
    doc.instructors = course.instructors.map((i) => ({ ...i, _key: slugify(i.name.en) }));
  }
  if (course.review) {
    doc.review = {
      ...course.review,
      tips: course.review.tips.map((t, i) => ({ ...t, _key: `tip-${i}` })),
      quotes: course.review.quotes?.map((q, i) => ({ ...q, _key: `quote-${i}` })),
    };
  }
  return doc;
}

/** All three curriculum versions, sorted by version id (2564, 2564-rev2566, 2568). */
export function buildCurriculumVersionDocuments(): CurriculumVersionDocument[] {
  return Object.values(CURRICULUM_VERSIONS)
    .map(curriculumVersionToDocument)
    .sort((a, b) => a.versionId.localeCompare(b.versionId));
}

/** Every course-review entry, sorted by course code ascending. */
export function buildCourseReviewDocuments(): CourseReviewDocument[] {
  return courseReviewCourses
    .map(courseReviewToDocument)
    .sort((a, b) => a.code.localeCompare(b.code));
}

// ---------------------------------------------------------------------------
// Verification. Each function returns a list of human-readable issue
// strings — empty means "passed" — so the verify script can print exactly
// what is wrong, by name, per the shared brief ("not a count").
// ---------------------------------------------------------------------------

export type Issue = string;

export function checkIdUniqueness(docs: SanityDoc[]): Issue[] {
  const counts = new Map<string, number>();
  for (const d of docs) counts.set(d._id, (counts.get(d._id) ?? 0) + 1);
  return [...counts.entries()]
    .filter(([, n]) => n > 1)
    .map(([id, n]) => `duplicate _id "${id}" appears ${n} times across the artifact`);
}

function isBiPair(v: unknown): v is { en: unknown; th: unknown } {
  return (
    !!v &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    "en" in v &&
    "th" in v &&
    typeof (v as Record<string, unknown>).en === "string" &&
    typeof (v as Record<string, unknown>).th === "string"
  );
}

/**
 * Walks an arbitrary document looking for `{ en, th }` pairs (LocalizedText
 * / Bi) and flags any side that is empty or whitespace-only. This is what
 * "bilingual parity" means for this family: unlike the MDX families, a
 * curriculum or course-review document is not split en/th at the document
 * level (see the file header), so parity is a within-document, per-field
 * check rather than a file-exists-on-both-sides check.
 */
export function checkBilingualParity(value: unknown, path = "$"): Issue[] {
  const issues: Issue[] = [];
  const walk = (v: unknown, p: string): void => {
    if (Array.isArray(v)) {
      v.forEach((item, i) => walk(item, `${p}[${i}]`));
      return;
    }
    if (v && typeof v === "object") {
      if (isBiPair(v)) {
        const pair = v as { en: string; th: string };
        if (!pair.en.trim()) issues.push(`${p}.en is empty`);
        if (!pair.th.trim()) issues.push(`${p}.th is empty`);
        return;
      }
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
        if (k === "_key" || k === "_id" || k === "_type") continue;
        walk(val, `${p}.${k}`);
      }
    }
  };
  walk(value, path);
  return issues;
}

/** Every `SourceDocument` must cite either a url or a note (sources.ts's own documented invariant). */
export function checkSourcesHaveUrlOrNote(docs: CurriculumVersionDocument[]): Issue[] {
  const issues: Issue[] = [];
  for (const doc of docs) {
    for (const s of doc.verification.sources) {
      if (!s.url && !s.note) {
        issues.push(`${doc._id}: source "${s.id}" has neither a url nor a note`);
      }
    }
  }
  return issues;
}

/**
 * Sum of a version's credit categories must equal its stated graduation
 * total. This is NOT resolving the 91/94-style cross-source contradictions
 * `docs/curriculum-sources.md` records (those stay as-is, carried and
 * disclosed, per the Wave 6D brief's explicit instruction not to resolve
 * them). This checks the migration's own arithmetic is self-consistent —
 * that what got encoded adds up to what it claims to add up to — which is a
 * different, narrower question this family's brief asks for by name
 * ("internal consistency of credit totals").
 */
export function checkCreditArithmetic(docs: CurriculumVersionDocument[]): Issue[] {
  const issues: Issue[] = [];
  for (const doc of docs) {
    const sum = doc.categories.reduce((n, c) => n + c.credits, 0);
    if (sum !== doc.graduationCredits.value) {
      issues.push(
        `${doc._id}: category credits sum to ${sum}, but graduationCredits.value is ${doc.graduationCredits.value}`
      );
    }
  }
  return issues;
}

/** Every course code a `Course.prerequisites` array names must exist in that same version's catalogue. */
export function checkPrerequisitesResolve(docs: CurriculumVersionDocument[]): Issue[] {
  const issues: Issue[] = [];
  for (const doc of docs) {
    const codes = new Set(doc.courses.value.map((c) => c.code));
    for (const course of doc.courses.value) {
      for (const prereq of course.prerequisites) {
        if (!codes.has(prereq)) {
          issues.push(
            `${doc._id}: ${course.code} lists prerequisite "${prereq}", not in this version's catalogue`
          );
        }
      }
    }
  }
  return issues;
}

/**
 * No course may (directly or transitively) require itself. This is the
 * "prerequisite cycles" validation CMS-SCHEMA-CONVENTIONS.md §7 names as
 * one of the three checks the eventual schema must enforce; this function is
 * that check's offline, pre-schema form.
 */
export function checkPrerequisiteCycles(docs: CurriculumVersionDocument[]): Issue[] {
  const issues: Issue[] = [];
  for (const doc of docs) {
    const byCode = new Map(doc.courses.value.map((c) => [c.code, c]));
    const state = new Map<string, "visiting" | "done">();
    const stack: string[] = [];

    const visit = (code: string): void => {
      if (state.get(code) === "done") return;
      if (state.get(code) === "visiting") {
        const cycleStart = stack.indexOf(code);
        const cycle = [...stack.slice(cycleStart), code].join(" -> ");
        issues.push(`${doc._id}: prerequisite cycle ${cycle}`);
        return;
      }
      state.set(code, "visiting");
      stack.push(code);
      const course = byCode.get(code);
      if (course) {
        for (const prereq of course.prerequisites) {
          if (byCode.has(prereq)) visit(prereq);
        }
      }
      stack.pop();
      state.set(code, "done");
    };

    for (const course of doc.courses.value) visit(course.code);
  }
  return issues;
}

/** No two curriculum versions may claim the same cohort code (resolveCohort takes the first match, silently). */
export function checkCohortsUnique(docs: CurriculumVersionDocument[]): Issue[] {
  const seenBy = new Map<string, string>();
  const issues: Issue[] = [];
  for (const doc of docs) {
    for (const cohort of doc.cohorts) {
      const prior = seenBy.get(cohort.code);
      if (prior) {
        issues.push(`cohort "${cohort.code}" is claimed by both ${prior} and ${doc._id}`);
      } else {
        seenBy.set(cohort.code, doc._id);
      }
    }
  }
  return issues;
}

/** Every course code a course-review entry names must exist in at least one curriculum version's catalogue. */
export function checkCourseReviewCodesExistInCurriculum(
  courseDocs: CourseReviewDocument[],
  versionDocs: CurriculumVersionDocument[]
): Issue[] {
  const curriculumCodes = new Set(versionDocs.flatMap((v) => v.courses.value.map((c) => c.code)));
  return courseDocs
    .filter((c) => !curriculumCodes.has(c.code))
    .map((c) => `${c._id}: code "${c.code}" does not appear in any curriculum version's catalogue`);
}

/**
 * `Course.prerequisite` on a course-review entry is prose ("Have earned
 * credits of PI271"), not a structured code list, so this can only check
 * codes it can confidently extract (`[A-Z]{2,4}\d{3}`) — anything it
 * extracts must resolve to a real curriculum course code. It never asserts
 * a course *has* a machine-readable prerequisite when the prose has none;
 * that would be inventing structure the source data does not have.
 */
export function checkCourseReviewPrerequisiteCodesResolve(
  courseDocs: CourseReviewDocument[],
  versionDocs: CurriculumVersionDocument[]
): Issue[] {
  const curriculumCodes = new Set(versionDocs.flatMap((v) => v.courses.value.map((c) => c.code)));
  const issues: Issue[] = [];
  const codePattern = /\b[A-Z]{2,4}\d{3}\b/g;
  for (const c of courseDocs) {
    if (!c.prerequisite) continue;
    const found = new Set([
      ...(c.prerequisite.en.match(codePattern) ?? []),
      ...(c.prerequisite.th.match(codePattern) ?? []),
    ]);
    for (const code of found) {
      if (!curriculumCodes.has(code)) {
        issues.push(
          `${c._id}: prerequisite text names "${code}", not in any curriculum version's catalogue`
        );
      }
    }
  }
  return issues;
}

/** Runs every check above and returns the combined issue list. Used by both the migrate and verify scripts. */
export function runAllChecks(
  versionDocs: CurriculumVersionDocument[],
  courseDocs: CourseReviewDocument[]
): Issue[] {
  const allDocs: SanityDoc[] = [...versionDocs, ...courseDocs];
  return [
    ...checkFileOutcomesComplete(courseDocs),
    ...checkIdUniqueness(allDocs),
    ...versionDocs.flatMap((d) => checkBilingualParity(d, d._id)),
    ...courseDocs.flatMap((d) => checkBilingualParity(d, d._id)),
    ...checkSourcesHaveUrlOrNote(versionDocs),
    ...checkCreditArithmetic(versionDocs),
    ...checkPrerequisitesResolve(versionDocs),
    ...checkPrerequisiteCycles(versionDocs),
    ...checkCohortsUnique(versionDocs),
    ...checkCourseReviewCodesExistInCurriculum(courseDocs, versionDocs),
    ...checkCourseReviewPrerequisiteCodesResolve(courseDocs, versionDocs),
  ];
}

// ---------------------------------------------------------------------------
// The diff report, via lib/migration/report.ts's shared `writeMigrationReport`.
// This module supplies the family-specific inputs: the list of files this
// family owns (read from disk, not hand-maintained, so it cannot go stale),
// the per-file `MigrationEntry`, and the written analysis (`MIGRATION_NOTES`)
// that becomes the report's `intro`.
// ---------------------------------------------------------------------------

/**
 * Repo root, resolved from this file's own location rather than
 * `process.cwd()`, so this is correct no matter where the calling script is
 * invoked from.
 */
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/**
 * Every `.ts` file in `content/curriculum/` and `content/course-review/`,
 * read from disk rather than hand-listed, so this family's file inventory
 * cannot silently drift from what `MIGRATION_ENTRIES` below accounts for —
 * exactly the property `writeMigrationReport`'s `unaccounted` check depends
 * on (see lib/migration/report.ts's header: "this module has no opinion on
 * globs", the caller's `allSourceFiles` has to be complete on its own).
 */
export function listFamilyFiles(): string[] {
  const dirs = ["content/curriculum", "content/course-review"];
  const files: string[] = [];
  for (const dir of dirs) {
    for (const name of readdirSync(path.join(REPO_ROOT, dir))) {
      if (name.endsWith(".ts")) files.push(`${dir}/${name}`);
    }
  }
  return files.sort((a, b) => a.localeCompare(b));
}

/**
 * Per-file outcomes for `writeMigrationReport`. Type-definition and
 * registry/logic files carry `status: "not-migrated"`: they define shapes or
 * behaviour, not content, so there is nothing in them for a migration to
 * carry into Sanity — a deliberate exclusion, not a limitation of this
 * migration's tooling (report.ts's `"not-migrated"` covers both readings;
 * the `reason` text below is explicit about which one this is). The three
 * curriculum-version files and the course-review catalogue are
 * `"migrated"`. `content/course-review/courses.ts` maps to 84 documents, not
 * one, which `report.ts`'s single-`documentId`-per-entry shape does not
 * quite anticipate (its docstring assumes one file, one document, matching
 * the MDX family it was designed against first); `documentId` here names the
 * count and `notes` carries the full, sorted id list rather than picking one
 * representative id and hiding the rest.
 */
export function buildMigrationEntries(courseDocs: CourseReviewDocument[]): MigrationEntry[] {
  return [
    {
      sourcePath: "content/curriculum/types.ts",
      status: "not-migrated",
      reason:
        "Type definitions only, not content. The document shapes in lib/migration/curriculum.ts mirror these types field-for-field.",
    },
    {
      sourcePath: "content/curriculum/sources.ts",
      status: "not-migrated",
      reason:
        "The SOURCES registry (id -> citation), not content on its own. Each SourceDocument it defines is embedded, by value, into every curriculumVersion document that cites it (verification.sources[]).",
    },
    {
      sourcePath: "content/curriculum/index.ts",
      status: "not-migrated",
      reason:
        "The CURRICULUM_VERSIONS registry and resolveCohort / inferredParts / disclosures / resolveMinorCategory: logic, not content. lib/study-plan/** continues to import this module directly after this migration; repointing it at Sanity is separate, later work.",
    },
    {
      sourcePath: "content/curriculum/2564.ts",
      status: "migrated",
      documentId: curriculumVersionDocId("2564"),
    },
    {
      sourcePath: "content/curriculum/2564-rev2566.ts",
      status: "migrated",
      documentId: curriculumVersionDocId("2564-rev2566"),
    },
    {
      sourcePath: "content/curriculum/2568.ts",
      status: "migrated",
      documentId: curriculumVersionDocId("2568"),
    },
    {
      sourcePath: "content/course-review/types.ts",
      status: "not-migrated",
      reason: "Type definitions only, no content.",
    },
    {
      sourcePath: "content/course-review/courses.ts",
      status: "migrated",
      documentId: `${courseDocs.length} documents (course-review-<code>, one per course)`,
      notes: courseDocs.map((c) => `${c._id} — ${c.code}`),
    },
  ];
}

/**
 * The pure form of "unaccounted for": every file `listFamilyFiles()` finds
 * must appear in `buildMigrationEntries`, and vice versa. This is the same
 * comparison `writeMigrationReport` makes internally, computed without its
 * side effect of writing files, so `runAllChecks` (called from both the
 * migrate script's pre-flight and the verify script) can assert it without
 * touching disk beyond the read.
 */
export function checkFileOutcomesComplete(courseDocs: CourseReviewDocument[]): Issue[] {
  const onDisk = new Set(listFamilyFiles());
  const listed = new Set(buildMigrationEntries(courseDocs).map((e) => e.sourcePath));
  const issues: Issue[] = [];
  for (const file of onDisk) {
    if (!listed.has(file)) issues.push(`${file} exists on disk but has no migration entry`);
  }
  for (const file of listed) {
    if (!onDisk.has(file))
      issues.push(`migration entry names ${file}, which no longer exists on disk`);
  }
  return issues;
}

function markdownTable(headers: string[], rows: string[][]): string {
  const escape = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
  const lines = [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((r) => `| ${r.map(escape).join(" | ")} |`),
  ];
  return lines.join("\n");
}

/** Markdown document-index tables, folded into the report's `intro` (see `writeCurriculumMigrationReport`). */
function documentIndexMarkdown(
  versionDocs: CurriculumVersionDocument[],
  courseDocs: CourseReviewDocument[]
): string {
  const versionTable = markdownTable(
    ["Document id", "Label", "Cohorts", "Graduation credits", "Courses in catalogue"],
    versionDocs.map((v) => [
      v._id,
      v.label.en,
      v.cohorts.map((c) => c.code).join(", "),
      String(v.graduationCredits.value),
      String(v.courses.value.length),
    ])
  );
  const courseTable = markdownTable(
    ["Document id", "Code", "Title"],
    courseDocs.map((c) => [c._id, c.code, c.title.en])
  );
  return `## Document index: curriculum versions (${versionDocs.length})\n\n${versionTable}\n\n## Document index: course reviews (${courseDocs.length})\n\n${courseTable}`;
}

/**
 * Writes `docs/migration/curriculum.md` (and its `.json` sidecar, per
 * `writeMigrationReport`'s own contract) via the shared report writer:
 * `MIGRATION_NOTES` (the disposition argument and every gap and
 * contradiction this family's brief asks for) plus the document indices as
 * `intro`, the real per-file outcomes as `entries`, and `listFamilyFiles()`
 * as `allSourceFiles` so "unaccounted for" is checked against the
 * filesystem, not against this function's own assumptions about itself.
 */
export function writeCurriculumMigrationReport(
  versionDocs: CurriculumVersionDocument[],
  courseDocs: CourseReviewDocument[]
): ReturnType<typeof writeMigrationReport> {
  return writeMigrationReport({
    outBasePath: "docs/migration/curriculum",
    title: "Curriculum and course-review migration",
    intro: `${MIGRATION_NOTES}\n\n${documentIndexMarkdown(versionDocs, courseDocs)}`,
    allSourceFiles: listFamilyFiles(),
    entries: buildMigrationEntries(courseDocs),
  });
}

/**
 * The written analysis this family's brief asks for regardless of which way
 * the migration decision went. Kept as a constant (rather than free text in
 * the generated report) so the report stays fully script-generated and
 * therefore byte-identical across runs, per the shared brief's determinism
 * requirement, while still carrying the reasoning a reviewer needs.
 */
export const MIGRATION_NOTES = `## Disposition: this family migrates

REDESIGN-2.0.md §6.3 and CMS-SCHEMA-CONVENTIONS.md §7 both already decide this, in
those words: curriculum data moves to Sanity, not exempted to stay in git the way
\`content/emergency/**\` is. §6.3 explicitly considers and rejects the "leave it in git,
it's protected by tests" argument, for the same reason it rejects it for Smart
Answers and the privacy register — leaving it in git keeps the IT officer required for
an edit, which fails the redesign's governing requirement. This migration does not
re-argue that; it implements it.

## The gap this migration could not close: there is no schema yet

\`sanity/schemaTypes/index.ts\` registers no \`curriculumVersion\` or \`courseReview\`
document type. No wave has built one. The document shapes in
\`lib/migration/curriculum.ts\` (\`CurriculumVersionDocument\`, \`CourseReviewDocument\`)
are this migration's best-effort specification of what that schema needs to accept —
built by mirroring \`content/curriculum/types.ts\` and \`content/course-review/types.ts\`
field-for-field, not invented — but they are not a reviewed schema, and until one
exists the \`sanity dataset import\` command below has nothing to import into.

## What this migration does NOT change

Nothing in \`content/curriculum/**\` is deleted or modified, and \`lib/study-plan/**\`
keeps reading \`CURRICULUM_VERSIONS\` from \`content/curriculum/index.ts\` exactly as it
does today. This is additive, per the shared Wave 6 brief. Repointing the study-plan
service at Sanity instead of the TypeScript module is a separate, later piece of work;
doing it in this wave would mean shipping a runtime dependency on a schema that does
not exist yet.

## Numeric contradictions this migration carries, and does not resolve

Two graduation totals are genuinely both correct, for different cohorts, not a data
bug: \`content/curriculum/2564.ts\` and \`2564-rev2566.ts\` encode 127 credits (cohorts
64-67); \`content/curriculum/2568.ts\` encodes 126 (cohorts 68-69). Both numbers are
internally consistent with their own category-credit sums (checked by
\`checkCreditArithmetic\` below) and both are carried as-is, per source: 127 is never
printed as a single figure in \`bir64\`/\`bir64rev66\` (it is the sum of 30 + 91 + 6, per
\`docs/curriculum-sources.md\` item 4); 126 is printed directly in \`comparison2568\` at
page 4. Neither is picked over the other; they govern different cohorts and both ship.

\`docs/SCOPE-AUDIT-2.0.md\` (row for \`handbook/curriculum-and-study-plan.mdx\`) and
\`handbook/assessment-and-degree.mdx\` both state 127 credits, while
\`docs/BUILD-BRIEF-2.0.md\` §3 says "about 126 credits". Read against this migration's
data, that is not a fresh contradiction: 127 matches the 2564 / 2564-rev2566 family
(the curriculum those handbook pages are explicitly tied to, per their own "Curriculum
2021, 2023 revision" framing), and "about 126" matches 2568, the newer curriculum the
build brief is describing prospectively. Both figures are right for the version they
describe; the handbook pages will read as wrong once cohort 66/67 graduates and 2568
is the only live curriculum, which is Wave 6A's problem to flag, not this migration's
to fix.

The 91-versus-94 major-requirement contradiction \`docs/SCOPE-AUDIT-2.0.md\` and
\`docs/curriculum-sources.md\` both mention (item 7) is in the 2561 curriculum, which
has no enrolled cohort and is out of scope for \`content/curriculum/**\` entirely — it
appears nowhere in the data this migration reads.

## A finding outside this migration's own data: docs/curriculum-sources.md is stale

That document (crawled 2026-08-01) records contradiction item 1 as live: "the 2568
curriculum has no published study plan handout... the semester sequence is inferred
from \`bir64rev66\`." \`content/curriculum/2568.ts\`'s own file header says this was
superseded the next day: a fuller read of \`comparison2568\` found the actual published
plan at section 4.3.2.3, pages 53-55, and the \`no-2568-study-plan\` contradiction and
its inferred-derivation notice were deleted from the code on 2026-08-02, not
suppressed. The data this migration carries is current (\`recommendedPlan.derivation.kind\`
is \`"published"\`, not \`"inferred"\`, for 2568); \`docs/curriculum-sources.md\` was not
updated to match. Worth a one-line fix by whoever owns that document; this migration
does not modify it (outside this family's owned paths).

## Cross-reference: clean

Every course code a course-review entry names exists in at least one curriculum
version's catalogue (84 of 84). Every prerequisite in every curriculum version's course
list resolves to a real course code in that version's own catalogue. No prerequisite
cycles. No cohort code is claimed by two versions. Category credits sum to the stated
graduation total in all three versions. These are asserted by
\`runAllChecks\` in \`lib/migration/curriculum.ts\` and re-run, offline, against the emitted
artifact by \`scripts/verify-curriculum.mjs\`.`;
