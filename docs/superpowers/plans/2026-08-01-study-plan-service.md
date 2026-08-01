# Study Plan Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a forward study planner at `/services/study-plan` that establishes a student's curriculum version from their cohort code, starts them from the recommended plan, and checks the terms they build against prerequisites, credit limits and the seven-year rule.

**Architecture:** Curriculum data lives as typed modules under `content/curriculum/`, one per version, each recording where every part of its data came from. Pure functions in `lib/study-plan/` derive the assumed history, validate a plan and serialise it. The journey is server-rendered one-question-per-page forms posting to server actions, following `app/[lang]/clubs/start`. The finished plan travels in a hidden field (so the service works with JavaScript off) and is mirrored to `localStorage` by one client component (so it survives closing the tab).

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind 4, zod 3, vitest 4 (unit), Playwright (e2e).

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-08-01-study-plan-service-design.md`. Read it before Task 1.
- **Writing style, all user-facing copy:** no em dashes anywhere. Ranges use "to", never "–". Plain language, contractions allowed in English. Thai copy carries its own formal register and is not a literal translation.
- **Course codes and course titles stay in English in both locales.** This is existing site precedent: `content/student-life/th/handbook/curriculum-and-study-plan.mdx` renders Thai prose around English course titles. Do not invent Thai course titles.
- **Every internal link is built with `localeHref(locale, path)`** from `@/lib/i18n`. Never hand-roll the `/[lang]` segment.
- **Server action files (`"use server"`) may only export async functions.** Constants and types go in a sibling `steps.ts`. This is a real constraint that has bitten this codebase before.
- **Never write cookies during a Server Component render.** Next.js forbids it and it throws the error boundary. See the header comment in `tests/e2e/wizard-smoke.spec.ts`.
- **No `loading.tsx`** anywhere in this feature. Site-wide convention.
- **Unit tests** live in `tests/unit/*.test.ts` and run with `npm test`. **E2E** in `tests/e2e/*.spec.ts` via `npm run e2e`.
- **Verification never blocks.** No task may add a test or build step that fails because curriculum data is unverified. Uncertain data ships; it must ship visibly.

---

### Task 1: Source record and curriculum types

**Files:**

- Create: `docs/curriculum-sources.md`
- Create: `content/curriculum/sources.ts`
- Create: `content/curriculum/types.ts`
- Test: `tests/unit/curriculum-sources.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: every type used by Tasks 2 to 13, and the `SOURCES` record keyed by document id.

- [ ] **Step 1: Write `docs/curriculum-sources.md`**

A plain record of the nine documents crawled on 2026-08-01, one section each, with: the URL, what the document actually is, its page count, how it was extracted, and every contradiction found in it. Copy the contradiction list verbatim from section 9 of the spec. State at the top that Thai text extraction degraded in all three large documents, so any Thai passage quoted from them is unverified.

- [ ] **Step 2: Write the failing test**

```ts
// tests/unit/curriculum-sources.test.ts
import { describe, expect, it } from "vitest";
import { SOURCES, type SourceDocument } from "@/content/curriculum/sources";

describe("SOURCES", () => {
  it("records all nine crawled documents", () => {
    expect(Object.keys(SOURCES)).toHaveLength(9);
  });

  it("gives every document an absolute url and an ISO retrieval date", () => {
    for (const [id, doc] of Object.entries(SOURCES) as [string, SourceDocument][]) {
      expect(doc.url, `${id} url`).toMatch(/^https:\/\//);
      expect(doc.retrieved, `${id} retrieved`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(doc.title.trim().length, `${id} title`).toBeGreaterThan(0);
    }
  });

  it("keys each document by its own id", () => {
    for (const [id, doc] of Object.entries(SOURCES)) {
      expect(doc.id).toBe(id);
    }
  });
});
```

- [ ] **Step 3: Run it and watch it fail**

Run: `npx vitest run tests/unit/curriculum-sources.test.ts`
Expected: FAIL, cannot resolve `@/content/curriculum/sources`.

- [ ] **Step 4: Write `content/curriculum/sources.ts`**

```ts
/**
 * The faculty documents this service's curriculum data was read from,
 * crawled on 2026-08-01. Every fact in `content/curriculum/*` cites one of
 * these by id, so a maintainer can always get back to the page it came from.
 * The narrative record, including what each document contradicts, is in
 * `docs/curriculum-sources.md`.
 */
export type SourceDocument = {
  id: string;
  title: string;
  url: string;
  /** ISO date the document was fetched. */
  retrieved: string;
};

export const SOURCES = {
  sampleStudyPlan: {
    id: "sampleStudyPlan",
    title: "Sample Study Plan (Curri. 2561)",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/Sample_Study_Plan.pdf",
    retrieved: "2026-08-01",
  },
  outline2018: {
    id: "outline2018",
    title: "Outline, BIR Curriculum 2018",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/Outline_BIR_Curr_2018.pdf",
    retrieved: "2026-08-01",
  },
  courseDescriptions2018: {
    id: "courseDescriptions2018",
    title: "BIR Curriculum 2018 Course Descriptions",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/BIR_Curr2018_CourseDescription.pdf",
    retrieved: "2026-08-01",
  },
  mko2561: {
    id: "mko2561",
    title: "BIR มคอ.2 2561",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/BIR_%E0%B8%A1%E0%B8%84%E0%B8%AD_2561.pdf?v=202012190947",
    retrieved: "2026-08-01",
  },
  bir64: {
    id: "bir64",
    title: "BIR Academic Handout, Curriculum 2021 (B.E. 2564), รหัส 64, 65",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/BIR_64.pdf?v=202305101549",
    retrieved: "2026-08-01",
  },
  bir64rev66: {
    id: "bir64rev66",
    title: "BIR Academic Handout, Curriculum 2021 (B.E. 2564) Revision 2023, รหัส 66",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/BIR_64_rev66.pdf?v=202305101549",
    retrieved: "2026-08-01",
  },
  handbook2021: {
    id: "handbook2021",
    title: "BIR Student Handbook, Revision 2021, Online Edition",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/Handbook2021_OnlineEdition_1.pdf?v=202012190947",
    retrieved: "2026-08-01",
  },
  doubleDegree64: {
    id: "doubleDegree64",
    title: "BIR Double Degree, curriculum revision B.E. 2564",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/BIR_DoubleDegree_64.pdf?v=202012190947",
    retrieved: "2026-08-01",
  },
  comparison2568: {
    id: "comparison2568",
    title: "Curriculum comparison, B.E. 2564 against B.E. 2568",
    url: "https://image.makewebcdn.com/makeweb/0/fAusajSlU/Document/68_2025.pdf?v=202405291424",
    retrieved: "2026-08-01",
  },
} as const satisfies Record<string, SourceDocument>;

export type SourceId = keyof typeof SOURCES;
```

- [ ] **Step 5: Write `content/curriculum/types.ts`**

```ts
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

export type CategoryId =
  | "genEdPart1"
  | "genEdPart2"
  | "core"
  | "concentrationRequired"
  | "economics"
  | "concentrationElectiveArea"
  | "concentrationElectiveApproaches"
  | "minorRequired"
  | "minorElective"
  | "minorElectiveOther"
  | "freeElective";

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
   * TU050, and PI574 from 2568 onward.
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
```

- [ ] **Step 6: Run the test**

Run: `npx vitest run tests/unit/curriculum-sources.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 7: Typecheck and commit**

```bash
npm run typecheck
git add docs/curriculum-sources.md content/curriculum/sources.ts content/curriculum/types.ts tests/unit/curriculum-sources.test.ts
git commit -m "Record the curriculum sources and type the curriculum data"
```

---

### Task 2: The 2564 curriculum module

**Files:**

- Create: `content/curriculum/2564.ts`
- Test: `tests/unit/curriculum-2564.test.ts`

**Interfaces:**

- Consumes: every type from `content/curriculum/types.ts`, `SOURCES` from `content/curriculum/sources.ts`.
- Produces: `export const curriculum2564: CurriculumVersion`.

This version governs cohorts 64 and 65, from `BIR_64.pdf`. Its general education differs from the 2023 revision; everything from Year 2 onward is the same.

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/curriculum-2564.test.ts
import { describe, expect, it } from "vitest";
import { curriculum2564 } from "@/content/curriculum/2564";

describe("curriculum2564", () => {
  it("graduates at 127 credits", () => {
    expect(curriculum2564.graduationCredits.value).toBe(127);
  });

  it("records the 127 total as a sum rather than a quoted figure", () => {
    const disclosed = curriculum2564.verification.contradictions.find(
      (c) => c.id === "total-never-printed"
    );
    expect(disclosed).toBeDefined();
    expect(disclosed?.disclosure).not.toBeNull();
  });

  it("category credits sum to the graduation total", () => {
    const sum = curriculum2564.categories.reduce((n, c) => n + c.credits, 0);
    expect(sum).toBe(curriculum2564.graduationCredits.value);
  });

  it("carries PI574 at 1 credit", () => {
    const internship = curriculum2564.courses.value.find((c) => c.code === "PI574");
    expect(internship?.credits).toBe(1);
    expect(internship?.excludedFromTotal).toBeFalsy();
  });

  it("maps cohorts 64 and 65, both from a document", () => {
    expect(curriculum2564.cohorts.map((c) => c.code)).toEqual(["64", "65"]);
    for (const cohort of curriculum2564.cohorts) {
      expect(cohort.provenance.kind).toBe("document");
    }
  });

  it("has TU105 and PI121 as gen-ed courses, not the 2023 replacements", () => {
    const codes = new Set(curriculum2564.courses.value.map((c) => c.code));
    expect(codes.has("TU105")).toBe(true);
    expect(codes.has("PI121")).toBe(true);
    expect(codes.has("EL105")).toBe(false);
    expect(codes.has("PD102")).toBe(false);
  });

  it("gives every prerequisite a course that exists", () => {
    const codes = new Set(curriculum2564.courses.value.map((c) => c.code));
    for (const course of curriculum2564.courses.value) {
      for (const prereq of course.prerequisites) {
        expect(codes.has(prereq), `${course.code} requires missing ${prereq}`).toBe(true);
      }
    }
  });

  it("references only real courses and declared categories in the recommended plan", () => {
    const codes = new Set(curriculum2564.courses.value.map((c) => c.code));
    const categories = new Set(curriculum2564.categories.map((c) => c.id));
    for (const term of curriculum2564.recommendedPlan.value) {
      for (const entry of term.entries) {
        if (entry.kind === "course") {
          expect(codes.has(entry.code), `plan references missing ${entry.code}`).toBe(true);
        } else {
          expect(categories.has(entry.category)).toBe(true);
        }
      }
    }
  });

  it("gives every placeholder a unique id", () => {
    const ids = curriculum2564.recommendedPlan.value
      .flatMap((t) => t.entries)
      .filter((e) => e.kind === "placeholder")
      .map((e) => (e as { id: string }).id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("applies the handbook credit-load rules", () => {
    expect(curriculum2564.rules.value.minCreditsRegularTerm).toBe(9);
    expect(curriculum2564.rules.value.maxCreditsRegularTerm).toBe(21);
    expect(curriculum2564.rules.value.maxCreditsSummerTerm).toBe(6);
    expect(curriculum2564.rules.value.maxYears).toBe(7);
    expect(curriculum2564.rules.value.minSemesters).toBe(7);
    expect(curriculum2564.rules.value.minGpa).toBe(2);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/unit/curriculum-2564.test.ts`
Expected: FAIL, cannot resolve `@/content/curriculum/2564`.

- [ ] **Step 3: Write `content/curriculum/2564.ts`**

Transcribe the full course list. The authoritative in-repo transcription of the *2023 revision* already exists at `content/student-life/en/handbook/curriculum-and-study-plan.mdx` and lists every core, concentration, minor and elective course with its code and title. For this module, take that list and apply the three general education differences that make 2564 the earlier version:

| 2023 revision (`rev2566`) | 2564 |
| --- | --- |
| `EL105 English Communication Skills` | `TU050 English Skill Development` (0 credits, `excludedFromTotal: true`) and `TU105 Communication Skills in English` |
| `LAS101 Critical Thinking, Reading and Writing` | `TU104 Critical Thinking, Reading, and Writing` |
| `PD102 Social Sciences in the 21st Century` | `PI121 Introduction to Social Science` |
| `PD103 Humanities in the Age of Disruption` | `PI122 Introduction to Humanities` |
| choose `AH208` or `EL295` | choose `PI131 Sports and Politics` or `PI132 Data, Science and Technology Governance` |

Everything else, Year 2 onward, is identical between the two.

Skeleton, with the categories and rules complete and the course array shown by example:

```ts
/**
 * Curriculum 2021 (B.E. 2564) as published for cohorts 64 and 65 in
 * `BIR_64.pdf`. The 127-credit total is never printed as a total in that
 * document; it is 30 + 91 + 6, which is recorded as a contradiction and
 * disclosed to the student.
 *
 * Prerequisites come from the Student Handbook, which lists them inline with
 * its course descriptions. The handout itself states none.
 */
import { SOURCES } from "./sources";
import type { CurriculumVersion, Course, CreditCategory, PlannedTerm } from "./types";

const categories: CreditCategory[] = [
  {
    id: "genEdPart1",
    name: { en: "General education, part 1", th: "วิชาศึกษาทั่วไป ส่วนที่ 1" },
    credits: 21,
    chooseFrom: false,
  },
  {
    id: "genEdPart2",
    name: { en: "General education, part 2", th: "วิชาศึกษาทั่วไป ส่วนที่ 2" },
    credits: 9,
    chooseFrom: false,
  },
  { id: "core", name: { en: "Core courses", th: "วิชาแกน" }, credits: 30, chooseFrom: false },
  {
    id: "concentrationRequired",
    name: { en: "Required courses in concentration", th: "วิชาบังคับในสาขา" },
    credits: 19,
    chooseFrom: false,
  },
  {
    id: "economics",
    name: { en: "Required course in Faculty of Economics", th: "วิชาบังคับคณะเศรษฐศาสตร์" },
    credits: 3,
    chooseFrom: false,
  },
  {
    id: "concentrationElectiveArea",
    name: { en: "Elective courses, area studies", th: "วิชาเลือกในสาขา กลุ่มอาณาบริเวณศึกษา" },
    credits: 9,
    chooseFrom: true,
  },
  {
    id: "concentrationElectiveApproaches",
    name: {
      en: "Elective courses, approaches and issues",
      th: "วิชาเลือกในสาขา กลุ่มแนวทางและประเด็นศึกษา",
    },
    credits: 9,
    chooseFrom: true,
  },
  {
    id: "minorRequired",
    name: { en: "Minor required courses", th: "วิชาโท วิชาบังคับ" },
    credits: 9,
    chooseFrom: false,
  },
  {
    id: "minorElective",
    name: { en: "Minor elective courses", th: "วิชาโท วิชาเลือก" },
    credits: 6,
    chooseFrom: true,
  },
  {
    id: "minorElectiveOther",
    name: { en: "Elective courses in other minors", th: "วิชาเลือกในวิชาโทอื่น" },
    credits: 6,
    chooseFrom: true,
  },
  {
    id: "freeElective",
    name: { en: "Free electives", th: "วิชาเลือกเสรี" },
    credits: 6,
    chooseFrom: true,
  },
];

const courses: Course[] = [
  // General education, part 1 (21 credits)
  { code: "TU050", title: "English Skill Development", credits: 0, category: "genEdPart1", prerequisites: [], excludedFromTotal: true },
  { code: "TU100", title: "Civic Engagement", credits: 3, category: "genEdPart1", prerequisites: [] },
  { code: "TU101", title: "Thailand, ASEAN and the World", credits: 3, category: "genEdPart1", prerequisites: [] },
  { code: "TU102", title: "Social Life Skills", credits: 3, category: "genEdPart1", prerequisites: [] },
  { code: "TU103", title: "Life and Sustainability", credits: 3, category: "genEdPart1", prerequisites: [] },
  { code: "TU104", title: "Critical Thinking, Reading, and Writing", credits: 3, category: "genEdPart1", prerequisites: [] },
  { code: "TU105", title: "Communication Skills in English", credits: 3, category: "genEdPart1", prerequisites: [] },
  { code: "TU106", title: "Creativity and Communication", credits: 3, category: "genEdPart1", prerequisites: [] },

  // General education, part 2 (9 credits)
  { code: "PI121", title: "Introduction to Social Science", credits: 3, category: "genEdPart2", prerequisites: [] },
  { code: "PI122", title: "Introduction to Humanities", credits: 3, category: "genEdPart2", prerequisites: [] },
  { code: "PI131", title: "Sports and Politics", credits: 3, category: "genEdPart2", prerequisites: [] },
  { code: "PI132", title: "Data, Science and Technology Governance", credits: 3, category: "genEdPart2", prerequisites: [] },

  // Core courses (30 credits). Prerequisites from the Handbook.
  { code: "PI210", title: "Introduction to Political Philosophy", credits: 3, category: "core", prerequisites: [] },
  { code: "PI211", title: "Introduction to Political Science", credits: 3, category: "core", prerequisites: [] },
  { code: "PI241", title: "Introduction to Public Administration and Public Policy", credits: 3, category: "core", prerequisites: [] },
  { code: "PI271", title: "Introduction to International Relations", credits: 3, category: "core", prerequisites: [] },
  { code: "PI280", title: "International Relations Theories and Current Affairs", credits: 3, category: "core", prerequisites: ["PI271"] },
  { code: "PI282", title: "Reading and Analysis in International Relations", credits: 3, category: "core", prerequisites: [] },
  { code: "PI300", title: "Social Science Methodology", credits: 3, category: "core", prerequisites: ["PI211"] },
  { code: "PI320", title: "Comparative Politics", credits: 3, category: "core", prerequisites: ["PI211"] },
  { code: "PI321", title: "Thai Politics and Government", credits: 3, category: "core", prerequisites: ["PI211"] },
  { code: "PI390", title: "Global Political Economy", credits: 3, category: "core", prerequisites: ["PI271"] },

  // Required courses in concentration (19 credits)
  { code: "PI270", title: "Diplomatic History", credits: 3, category: "concentrationRequired", prerequisites: [] },
  { code: "PI272", title: "Foreign Policy Analysis", credits: 3, category: "concentrationRequired", prerequisites: [] },
  { code: "PI291", title: "International Law", credits: 3, category: "concentrationRequired", prerequisites: [] },
  { code: "PI292", title: "International Organizations and Regimes", credits: 3, category: "concentrationRequired", prerequisites: [] },
  { code: "PI370", title: "Thai Foreign Affairs", credits: 3, category: "concentrationRequired", prerequisites: [] },
  { code: "PI470", title: "Seminar: International Relations Theories", credits: 3, category: "concentrationRequired", prerequisites: [] },
  { code: "PI574", title: "Internship in Politics and International Relations", credits: 1, category: "concentrationRequired", prerequisites: [] },

  // Required course in Faculty of Economics (3 credits)
  { code: "EE210", title: "Introductory Economics", credits: 3, category: "economics", prerequisites: [] },

  // Continue with the area studies group, the approaches and issues group,
  // and all three minors, transcribed from
  // `content/student-life/en/handbook/curriculum-and-study-plan.mdx`.
  // Every area studies elective takes ["PI280"] as its prerequisite.
];
```

The recommended plan follows the handout's Year 1 to Year 4 tables, which the same MDX file reproduces under "Four-year study plan". Encode Year 1 with the 2564 general education codes from the table above, and Years 2 to 4 exactly as the MDX has them. Placeholders get stable ids: `minorRequired1`, `minorElective1`, `areaElective1`, `approachesElective1`, `freeElective1`, and so on.

```ts
const recommendedPlan: PlannedTerm[] = [
  {
    term: { year: 1, kind: "semester1" },
    optional: false,
    entries: [
      { kind: "course", code: "TU100" },
      { kind: "course", code: "TU101" },
      { kind: "course", code: "TU103" },
      { kind: "course", code: "TU105" },
      { kind: "course", code: "TU106" },
      { kind: "course", code: "PI121" },
    ],
  },
  // ... remaining terms
];

export const curriculum2564: CurriculumVersion = {
  id: "2564",
  label: { en: "Curriculum 2021 (B.E. 2564)", th: "หลักสูตร พ.ศ. 2564" },
  cohorts: [
    { code: "64", provenance: { kind: "document", source: "bir64", page: 1 } },
    { code: "65", provenance: { kind: "document", source: "bir64", page: 1 } },
  ],
  graduationCredits: { value: 127, derivation: { kind: "published", source: "bir64" } },
  categories,
  courses: { value: courses, derivation: { kind: "published", source: "bir64" } },
  recommendedPlan: { value: recommendedPlan, derivation: { kind: "published", source: "bir64" } },
  rules: {
    value: {
      minCreditsRegularTerm: 9,
      maxCreditsRegularTerm: 21,
      maxCreditsSummerTerm: 6,
      minSemesters: 7,
      maxYears: 7,
      minGpa: 2,
      source: {
        document: "handbook2021",
        provision:
          "Thammasat University Bachelor Degrees Regulations, 3rd Edition (2012), item 10.4",
      },
    },
    derivation: { kind: "published", source: "handbook2021" },
  },
  distinguishingCourses: ["TU105", "TU104", "PI121"],
  verification: {
    verifiedBy: null,
    verifiedOn: null,
    sources: [SOURCES.bir64, SOURCES.handbook2021],
    contradictions: [
      {
        id: "total-never-printed",
        summary:
          "The 127-credit graduation total is never printed as a total in BIR_64.pdf. It is 30 + 91 + 6.",
        disclosure: {
          en: "The 127-credit total is not printed in the handout. We worked it out by adding the three parts together. Check it with your advisor.",
          th: "เอกสารหลักสูตรไม่ได้ระบุยอดรวม 127 หน่วยกิตไว้โดยตรง ยอดนี้ได้จากการรวมสามหมวดเข้าด้วยกัน โปรดตรวจสอบกับอาจารย์ที่ปรึกษา",
        },
      },
    ],
  },
};
```

- [ ] **Step 4: Run the test**

Run: `npx vitest run tests/unit/curriculum-2564.test.ts`
Expected: PASS, 10 tests. If "category credits sum to the graduation total" fails, the transcription dropped or duplicated a course; do not adjust the expected 127 to make it pass.

- [ ] **Step 5: Commit**

```bash
npm run typecheck
git add content/curriculum/2564.ts tests/unit/curriculum-2564.test.ts
git commit -m "Add the 2564 curriculum for cohorts 64 and 65"
```

---

### Task 3: The 2023 revision module

**Files:**

- Create: `content/curriculum/2564-rev2566.ts`
- Test: `tests/unit/curriculum-2564-rev2566.test.ts`

**Interfaces:**

- Consumes: types, `SOURCES`, and `curriculum2564` (it reuses everything from Year 2 onward).
- Produces: `export const curriculum2564rev2566: CurriculumVersion`.

Cohorts 66 and 67. Cohort 66 is printed on the handout; **cohort 67 is attested by BIRSA on 2026-08-01 and appears in no document.** That distinction must survive in the data.

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/curriculum-2564-rev2566.test.ts
import { describe, expect, it } from "vitest";
import { curriculum2564rev2566 } from "@/content/curriculum/2564-rev2566";
import { curriculum2564 } from "@/content/curriculum/2564";

const version = curriculum2564rev2566;

describe("curriculum2564rev2566", () => {
  it("graduates at 127 credits, same as the base version", () => {
    expect(version.graduationCredits.value).toBe(127);
  });

  it("replaces the five Year 1 general education courses", () => {
    const codes = new Set(version.courses.value.map((c) => c.code));
    for (const added of ["EL105", "LAS101", "PD102", "PD103", "AH208", "EL295"]) {
      expect(codes.has(added), `expected ${added}`).toBe(true);
    }
    for (const removed of ["TU050", "TU104", "TU105", "PI121", "PI122", "PI131", "PI132"]) {
      expect(codes.has(removed), `did not expect ${removed}`).toBe(false);
    }
  });

  it("keeps every course from Year 2 onward identical to 2564", () => {
    const laterCategories = new Set([
      "core",
      "concentrationRequired",
      "economics",
      "concentrationElectiveArea",
      "concentrationElectiveApproaches",
      "minorRequired",
      "minorElective",
      "minorElectiveOther",
    ]);
    const pick = (v: typeof curriculum2564) =>
      v.courses.value
        .filter((c) => laterCategories.has(c.category))
        .map((c) => `${c.code}:${c.credits}`)
        .sort();
    expect(pick(version)).toEqual(pick(curriculum2564));
  });

  it("maps cohort 66 from the document and cohort 67 as attested", () => {
    const byCode = Object.fromEntries(version.cohorts.map((c) => [c.code, c.provenance]));
    expect(byCode["66"]?.kind).toBe("document");
    expect(byCode["67"]?.kind).toBe("attested");
    expect(byCode["67"]).toMatchObject({ by: "BIRSA", on: "2026-08-01" });
  });

  it("discloses the attested cohort 67 mapping", () => {
    const c = version.verification.contradictions.find((x) => x.id === "cohort-67-attested");
    expect(c?.disclosure).not.toBeNull();
  });

  it("carries PI574 at 1 credit, counted toward the total", () => {
    const internship = version.courses.value.find((c) => c.code === "PI574");
    expect(internship?.credits).toBe(1);
    expect(internship?.excludedFromTotal).toBeFalsy();
  });

  it("category credits sum to the graduation total", () => {
    const sum = version.categories.reduce((n, c) => n + c.credits, 0);
    expect(sum).toBe(127);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/unit/curriculum-2564-rev2566.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Write `content/curriculum/2564-rev2566.ts`**

Build it from `curriculum2564` so the shared 90 percent cannot drift:

```ts
/**
 * Curriculum 2021 (B.E. 2564), 2023 revision, as published for cohort 66 in
 * `BIR_64_rev66.pdf`. BIRSA attests that cohort 67 follows it too; no
 * document says so, which is recorded in the cohort provenance and disclosed
 * to the student.
 *
 * The only changes from the base 2564 version are five Year 1 general
 * education courses. Everything from Year 2 onward is reused from
 * `./2564` rather than retyped, so the two cannot drift apart.
 */
import { SOURCES } from "./sources";
import { curriculum2564 } from "./2564";
import type { Course, CurriculumVersion, PlannedTerm } from "./types";

const REPLACED = new Set(["TU050", "TU104", "TU105", "PI121", "PI122", "PI131", "PI132"]);

const newGenEd: Course[] = [
  { code: "EL105", title: "English Communication Skills", credits: 3, category: "genEdPart1", prerequisites: [] },
  { code: "LAS101", title: "Critical Thinking, Reading and Writing", credits: 3, category: "genEdPart1", prerequisites: [] },
  { code: "PD102", title: "Social Sciences in the 21st Century", credits: 3, category: "genEdPart2", prerequisites: [] },
  { code: "PD103", title: "Humanities in the Age of Disruption", credits: 3, category: "genEdPart2", prerequisites: [] },
  { code: "AH208", title: "Exercise for Good Health and Well-Being", credits: 3, category: "genEdPart2", prerequisites: [] },
  { code: "EL295", title: "Academic English and Study Skill 1", credits: 3, category: "genEdPart2", prerequisites: [] },
];

const courses: Course[] = [
  ...curriculum2564.courses.value.filter((c) => !REPLACED.has(c.code)),
  ...newGenEd,
];
```

For the recommended plan, take `curriculum2564.recommendedPlan.value` and replace only the Year 1 terms:

- Year 1 semester 1: `TU100`, `TU101`, `TU103`, `EL105`, `TU106`, `PD102`
- Year 1 semester 2: `TU102`, `LAS101`, `PD103`, a placeholder `genEdChoice1` for "AH208 or EL295", `PI211`, `PI271`

```ts
const recommendedPlan: PlannedTerm[] = [
  {
    term: { year: 1, kind: "semester1" },
    optional: false,
    entries: [
      { kind: "course", code: "TU100" },
      { kind: "course", code: "TU101" },
      { kind: "course", code: "TU103" },
      { kind: "course", code: "EL105" },
      { kind: "course", code: "TU106" },
      { kind: "course", code: "PD102" },
    ],
  },
  {
    term: { year: 1, kind: "semester2" },
    optional: false,
    entries: [
      { kind: "course", code: "TU102" },
      { kind: "course", code: "LAS101" },
      { kind: "course", code: "PD103" },
      {
        kind: "placeholder",
        id: "genEdChoice1",
        label: {
          en: "Choose AH208 Exercise for Good Health and Well-Being, or EL295 Academic English and Study Skill 1",
          th: "เลือก AH208 Exercise for Good Health and Well-Being หรือ EL295 Academic English and Study Skill 1",
        },
        category: "genEdPart2",
      },
      { kind: "course", code: "PI211" },
      { kind: "course", code: "PI271" },
    ],
  },
  ...curriculum2564.recommendedPlan.value.filter((t) => t.term.year !== 1),
];

export const curriculum2564rev2566: CurriculumVersion = {
  id: "2564-rev2566",
  label: {
    en: "Curriculum 2021 (B.E. 2564), 2023 revision",
    th: "หลักสูตร พ.ศ. 2564 ฉบับปรับปรุง พ.ศ. 2566",
  },
  cohorts: [
    { code: "66", provenance: { kind: "document", source: "bir64rev66", page: 1 } },
    { code: "67", provenance: { kind: "attested", by: "BIRSA", on: "2026-08-01" } },
  ],
  graduationCredits: { value: 127, derivation: { kind: "published", source: "bir64rev66" } },
  categories: curriculum2564.categories,
  courses: { value: courses, derivation: { kind: "published", source: "bir64rev66" } },
  recommendedPlan: {
    value: recommendedPlan,
    derivation: { kind: "published", source: "bir64rev66" },
  },
  rules: curriculum2564.rules,
  distinguishingCourses: ["EL105", "LAS101", "PD102"],
  verification: {
    verifiedBy: null,
    verifiedOn: null,
    sources: [SOURCES.bir64rev66, SOURCES.handbook2021],
    contradictions: [
      {
        id: "cohort-67-attested",
        summary:
          "Cohort 67 following this revision is attested by BIRSA on 2026-08-01 and printed in no document.",
        disclosure: {
          en: "No published document says which curriculum cohort 67 follows. BIRSA has told us it is this one. If you started in 2567 (2024), check with the Registrar's Office before relying on this plan.",
          th: "ไม่มีเอกสารเผยแพร่ระบุว่านักศึกษารหัส 67 ใช้หลักสูตรใด BIRSA แจ้งว่าเป็นหลักสูตรนี้ หากท่านเข้าศึกษาในปีการศึกษา 2567 โปรดตรวจสอบกับสำนักงานทะเบียนก่อนใช้แผนนี้",
        },
      },
      {
        id: "total-never-printed",
        summary:
          "The 127-credit graduation total is never printed as a total. It is 30 + 91 + 6.",
        disclosure: {
          en: "The 127-credit total is not printed in the handout. We worked it out by adding the three parts together. Check it with your advisor.",
          th: "เอกสารหลักสูตรไม่ได้ระบุยอดรวม 127 หน่วยกิตไว้โดยตรง ยอดนี้ได้จากการรวมสามหมวดเข้าด้วยกัน โปรดตรวจสอบกับอาจารย์ที่ปรึกษา",
        },
      },
    ],
  },
};
```

- [ ] **Step 4: Run the test**

Run: `npx vitest run tests/unit/curriculum-2564-rev2566.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
npm run typecheck
git add content/curriculum/2564-rev2566.ts tests/unit/curriculum-2564-rev2566.test.ts
git commit -m "Add the 2023 revision for cohorts 66 and 67"
```

---

### Task 4: The 2568 curriculum module, with its inference

**Files:**

- Create: `content/curriculum/2568.ts`
- Test: `tests/unit/curriculum-2568.test.ts`

**Interfaces:**

- Consumes: types, `SOURCES`, `curriculum2564rev2566`.
- Produces: `export const curriculum2568: CurriculumVersion`.

This is the version the whole disclosure machinery exists for. Its credit structure comes from `68_2025.pdf`; **its semester sequence is borrowed from the 2023 revision because no 2568 study plan handout has been published.**

Encoded facts, from the spec's section 9:

- Graduation total **126**, stated in the source's own comparison table.
- Major **90**, concentration-required **18**.
- `PI574` is **3 credits** from 2568 onward, and sits **outside** the 126: the six remaining 3-credit concentration courses make 18 exactly, and the total falls from 127 to 126 because `PI574`'s old 1 credit left the count. Set `excludedFromTotal: true`.
- Course catalogue otherwise identical to 2564, code for code.

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/curriculum-2568.test.ts
import { describe, expect, it } from "vitest";
import { curriculum2568 } from "@/content/curriculum/2568";

const version = curriculum2568;

describe("curriculum2568", () => {
  it("graduates at 126 credits", () => {
    expect(version.graduationCredits.value).toBe(126);
  });

  it("carries PI574 at 3 credits, outside the graduation total", () => {
    const internship = version.courses.value.find((c) => c.code === "PI574");
    expect(internship?.credits).toBe(3);
    expect(internship?.excludedFromTotal).toBe(true);
  });

  it("counts concentration-required as 18 credits", () => {
    const category = version.categories.find((c) => c.id === "concentrationRequired");
    expect(category?.credits).toBe(18);
  });

  it("sums its counted categories to 126", () => {
    const sum = version.categories.reduce((n, c) => n + c.credits, 0);
    expect(sum).toBe(126);
  });

  it("borrows its recommended plan from the 2023 revision and says so", () => {
    const derivation = version.recommendedPlan.derivation;
    expect(derivation.kind).toBe("inferred");
    if (derivation.kind !== "inferred") throw new Error("unreachable");
    expect(derivation.from).toBe("2564-rev2566");
    expect(derivation.reason.en.length).toBeGreaterThan(0);
    expect(derivation.reason.th.length).toBeGreaterThan(0);
  });

  it("takes its credit structure from its own document, not the inference", () => {
    expect(version.graduationCredits.derivation.kind).toBe("published");
    expect(version.graduationCredits.derivation).toMatchObject({ source: "comparison2568" });
  });

  it("maps cohort 68 from the document and cohort 69 as attested", () => {
    const byCode = Object.fromEntries(version.cohorts.map((c) => [c.code, c.provenance]));
    expect(byCode["68"]?.kind).toBe("document");
    expect(byCode["69"]?.kind).toBe("attested");
  });

  it("discloses where PI574's credits sit", () => {
    const c = version.verification.contradictions.find((x) => x.id === "pi574-outside-total");
    expect(c?.disclosure).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/unit/curriculum-2568.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Write `content/curriculum/2568.ts`**

```ts
/**
 * Curriculum B.E. 2568, for cohorts 68 and 69.
 *
 * This version is a hybrid and that is the point. Its credit structure comes
 * from its own source, the 2564-against-2568 comparison document: 126 credits,
 * a 90-credit major, concentration-required down to 18. Its semester sequence
 * comes from the 2023 revision, because no 2568 study plan handout has been
 * published and a planner needs a sequence to start from. The borrowed part
 * is marked `inferred` and surfaces as a notice on the confirm screen, the
 * plan screen and the print page.
 *
 * PI574 moved to 3 credits from this version, attested by BIRSA. It sits
 * outside the 126: the six remaining 3-credit concentration courses make 18
 * exactly, and the total fell from 127 to 126 when PI574's old single credit
 * left the count. The alternative reading, that PI574 stayed inside 18 and a
 * 3-credit course was dropped, needs a dropped course that appears in no
 * source.
 */
import { SOURCES } from "./sources";
import { curriculum2564rev2566 } from "./2564-rev2566";
import type { Course, CreditCategory, CurriculumVersion } from "./types";

const courses: Course[] = curriculum2564rev2566.courses.value.map((course) =>
  course.code === "PI574" ? { ...course, credits: 3, excludedFromTotal: true } : course
);

const categories: CreditCategory[] = curriculum2564rev2566.categories.map((category) =>
  category.id === "concentrationRequired" ? { ...category, credits: 18 } : category
);

const INFERRED_PLAN_REASON = {
  en: "There is no published study plan for the 2568 curriculum yet. The order of courses below is taken from the 2023 revision's study plan, which is the most recent one that exists. Your credit totals are from your own curriculum document and are correct. The order is a starting point, not your curriculum. Confirm it with your advisor.",
  th: "ยังไม่มีแผนการศึกษาที่เผยแพร่สำหรับหลักสูตร พ.ศ. 2568 ลำดับรายวิชาด้านล่างนำมาจากแผนการศึกษาของหลักสูตรฉบับปรับปรุง พ.ศ. 2566 ซึ่งเป็นฉบับล่าสุดที่มีอยู่ จำนวนหน่วยกิตมาจากเอกสารหลักสูตรของท่านเองและถูกต้อง ส่วนลำดับรายวิชาเป็นเพียงจุดตั้งต้น มิใช่หลักสูตรของท่าน โปรดตรวจสอบกับอาจารย์ที่ปรึกษา",
};

export const curriculum2568: CurriculumVersion = {
  id: "2568",
  label: { en: "Curriculum 2025 (B.E. 2568)", th: "หลักสูตร พ.ศ. 2568" },
  cohorts: [
    { code: "68", provenance: { kind: "document", source: "comparison2568", page: 1 } },
    { code: "69", provenance: { kind: "attested", by: "BIRSA", on: "2026-08-01" } },
  ],
  graduationCredits: { value: 126, derivation: { kind: "published", source: "comparison2568" } },
  categories,
  courses: { value: courses, derivation: { kind: "published", source: "comparison2568" } },
  recommendedPlan: {
    value: curriculum2564rev2566.recommendedPlan.value,
    derivation: {
      kind: "inferred",
      from: "2564-rev2566",
      source: "bir64rev66",
      reason: INFERRED_PLAN_REASON,
    },
  },
  rules: curriculum2564rev2566.rules,
  distinguishingCourses: ["EL105", "LAS101", "PD102"],
  verification: {
    verifiedBy: null,
    verifiedOn: null,
    sources: [SOURCES.comparison2568, SOURCES.bir64rev66, SOURCES.handbook2021],
    contradictions: [
      {
        id: "no-2568-study-plan",
        summary:
          "The 2568 comparison document contains no sample study plan. The sequence is borrowed from the 2023 revision.",
        disclosure: INFERRED_PLAN_REASON,
      },
      {
        id: "pi574-outside-total",
        summary:
          "PI574 at 3 credits only balances the stated 18-credit concentration-required total if it sits outside it. Not stated in any source.",
        disclosure: {
          en: "PI574 Internship is 3 credits on your curriculum, and we count it outside your 126. The document does not say where it sits, so if your plan looks 3 credits short or long, this is why. Ask your advisor.",
          th: "วิชา PI574 การฝึกงาน มีค่า 3 หน่วยกิตในหลักสูตรของท่าน และนับอยู่นอกยอดรวม 126 หน่วยกิต เอกสารมิได้ระบุว่าวิชานี้อยู่ในหมวดใด หากแผนของท่านขาดหรือเกิน 3 หน่วยกิต นี่คือสาเหตุ โปรดสอบถามอาจารย์ที่ปรึกษา",
        },
      },
      {
        id: "catalogue-identical",
        summary:
          "The 2568 catalogue is code-for-code identical to 2564, so no course code distinguishes cohort 66 from cohort 68 on the confirm screen.",
        disclosure: null,
      },
    ],
  },
};
```

- [ ] **Step 4: Run the test**

Run: `npx vitest run tests/unit/curriculum-2568.test.ts`
Expected: PASS, 8 tests.

- [ ] **Step 5: Commit**

```bash
npm run typecheck
git add content/curriculum/2568.ts tests/unit/curriculum-2568.test.ts
git commit -m "Add the 2568 curriculum, sequence inferred from the 2023 revision"
```

---

### Task 5: The registry and cohort resolution

**Files:**

- Create: `content/curriculum/index.ts`
- Test: `tests/unit/curriculum-registry.test.ts`

**Interfaces:**

- Consumes: all three version modules.
- Produces:
  - `CURRICULUM_VERSIONS: Record<CurriculumVersionId, CurriculumVersion>`
  - `resolveCohort(code: string): CohortResolution`
  - `type CohortResolution = { status: "supported"; version: CurriculumVersion; mapping: CohortMapping } | { status: "unsupported"; code: string }`
  - `inferredParts(version: CurriculumVersion): Derivation[]`
  - `disclosures(version: CurriculumVersion): Contradiction[]`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/curriculum-registry.test.ts
import { describe, expect, it } from "vitest";
import {
  CURRICULUM_VERSIONS,
  resolveCohort,
  inferredParts,
  disclosures,
} from "@/content/curriculum";

describe("resolveCohort", () => {
  it("resolves every enrolled cohort to exactly one version", () => {
    const expected: Record<string, string> = {
      "64": "2564",
      "65": "2564",
      "66": "2564-rev2566",
      "67": "2564-rev2566",
      "68": "2568",
      "69": "2568",
    };
    for (const [code, versionId] of Object.entries(expected)) {
      const result = resolveCohort(code);
      expect(result.status, `cohort ${code}`).toBe("supported");
      if (result.status !== "supported") throw new Error("unreachable");
      expect(result.version.id, `cohort ${code}`).toBe(versionId);
    }
  });

  it("returns unsupported for cohorts outside 64 to 69", () => {
    for (const code of ["61", "62", "63", "70", "99", "", "6", "abc", "664"]) {
      expect(resolveCohort(code).status, `cohort ${code}`).toBe("unsupported");
    }
  });

  it("never maps one cohort code to two versions", () => {
    const seen = new Map<string, string>();
    for (const version of Object.values(CURRICULUM_VERSIONS)) {
      for (const cohort of version.cohorts) {
        expect(seen.has(cohort.code), `cohort ${cohort.code} claimed twice`).toBe(false);
        seen.set(cohort.code, version.id);
      }
    }
  });

  it("returns the mapping so callers can see attested from documented", () => {
    const result = resolveCohort("67");
    if (result.status !== "supported") throw new Error("unreachable");
    expect(result.mapping.provenance.kind).toBe("attested");
  });
});

describe("inferredParts", () => {
  it("finds the borrowed study plan on 2568 only", () => {
    expect(inferredParts(CURRICULUM_VERSIONS["2568"])).toHaveLength(1);
    expect(inferredParts(CURRICULUM_VERSIONS["2564"])).toHaveLength(0);
    expect(inferredParts(CURRICULUM_VERSIONS["2564-rev2566"])).toHaveLength(0);
  });
});

describe("disclosures", () => {
  it("returns only contradictions that have something to say to a student", () => {
    const shown = disclosures(CURRICULUM_VERSIONS["2568"]);
    expect(shown.every((c) => c.disclosure !== null)).toBe(true);
    expect(shown.map((c) => c.id)).not.toContain("catalogue-identical");
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/unit/curriculum-registry.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Write `content/curriculum/index.ts`**

```ts
/**
 * The curriculum registry and the one function that decides which curriculum
 * governs a student: `resolveCohort`. Everything user-facing goes through it,
 * so an unsupported cohort has exactly one way to be handled and it is the
 * stop page.
 */
import { curriculum2564 } from "./2564";
import { curriculum2564rev2566 } from "./2564-rev2566";
import { curriculum2568 } from "./2568";
import type {
  CohortMapping,
  Contradiction,
  CurriculumVersion,
  CurriculumVersionId,
  Derivation,
} from "./types";

export * from "./types";
export { SOURCES } from "./sources";

export const CURRICULUM_VERSIONS: Record<CurriculumVersionId, CurriculumVersion> = {
  "2564": curriculum2564,
  "2564-rev2566": curriculum2564rev2566,
  "2568": curriculum2568,
};

export type CohortResolution =
  | { status: "supported"; version: CurriculumVersion; mapping: CohortMapping }
  | { status: "unsupported"; code: string };

/**
 * Maps the first two digits of a student ID to the curriculum that governs
 * them. Anything not explicitly claimed by a version is unsupported: the
 * service refuses rather than guessing at a near neighbour.
 */
export function resolveCohort(code: string): CohortResolution {
  const normalized = code.trim();
  for (const version of Object.values(CURRICULUM_VERSIONS)) {
    const mapping = version.cohorts.find((c) => c.code === normalized);
    if (mapping) return { status: "supported", version, mapping };
  }
  return { status: "unsupported", code: normalized };
}

/** Every part of this version whose data was borrowed from another version. */
export function inferredParts(version: CurriculumVersion): Derivation[] {
  const parts = [
    version.graduationCredits.derivation,
    version.courses.derivation,
    version.recommendedPlan.derivation,
    version.rules.derivation,
  ];
  return parts.filter((d) => d.kind === "inferred");
}

/** Contradictions with something to say to a student, as opposed to a maintainer. */
export function disclosures(version: CurriculumVersion): Contradiction[] {
  return version.verification.contradictions.filter((c) => c.disclosure !== null);
}
```

- [ ] **Step 4: Run the test**

Run: `npx vitest run tests/unit/curriculum-registry.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
npm run typecheck
git add content/curriculum/index.ts tests/unit/curriculum-registry.test.ts
git commit -m "Add the curriculum registry and cohort resolution"
```

---

### Task 6: Plan serialisation

**Files:**

- Create: `lib/study-plan/plan.ts`
- Test: `tests/unit/study-plan-serialise.test.ts`

**Interfaces:**

- Consumes: `CurriculumVersionId`, `TermRef`, `TermKind` from `@/content/curriculum`.
- Produces:
  - `type StudyPlan = { versionId: CurriculumVersionId; cohort: string; startYear: number; passed: string[]; terms: PlannedCourseTerm[] }`
  - `type PlannedCourseTerm = { term: TermRef; codes: string[] }`
  - `serialisePlan(plan: StudyPlan): string`
  - `deserialisePlan(raw: string): StudyPlan | null`
  - `EMPTY_PLAN_FIELD = "plan"` (the hidden input name)

The plan travels in a hidden form field on every post, so the whole service works with JavaScript off, and the same string is what gets mirrored to `localStorage`. One format, one parser.

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/study-plan-serialise.test.ts
import { describe, expect, it } from "vitest";
import { serialisePlan, deserialisePlan, type StudyPlan } from "@/lib/study-plan/plan";

const plan: StudyPlan = {
  versionId: "2564-rev2566",
  cohort: "66",
  startYear: 2566,
  passed: ["TU100", "TU101", "EL105"],
  terms: [
    { term: { year: 3, kind: "semester1" }, codes: ["PI300", "PI390"] },
    { term: { year: 3, kind: "summer" }, codes: ["PI574"] },
  ],
};

describe("serialisePlan and deserialisePlan", () => {
  it("round-trips a plan unchanged", () => {
    expect(deserialisePlan(serialisePlan(plan))).toEqual(plan);
  });

  it("produces something small enough for a hidden field and a cookie", () => {
    expect(serialisePlan(plan).length).toBeLessThan(2048);
  });

  it("returns null for junk rather than throwing", () => {
    for (const junk of ["", "{", "not-base64!!", "eyJib2d1cyI6dHJ1ZX0="]) {
      expect(deserialisePlan(junk), junk).toBeNull();
    }
  });

  it("rejects a plan naming a version that does not exist", () => {
    const tampered = serialisePlan({ ...plan, versionId: "9999" as never });
    expect(deserialisePlan(tampered)).toBeNull();
  });

  it("rejects course codes that are not plausible codes", () => {
    const tampered = serialisePlan({ ...plan, passed: ["<script>"] });
    expect(deserialisePlan(tampered)).toBeNull();
  });

  it("survives an empty plan", () => {
    const empty: StudyPlan = {
      versionId: "2568",
      cohort: "68",
      startYear: 2568,
      passed: [],
      terms: [],
    };
    expect(deserialisePlan(serialisePlan(empty))).toEqual(empty);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/unit/study-plan-serialise.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Write `lib/study-plan/plan.ts`**

```ts
/**
 * The plan itself, and the one format it is written in.
 *
 * The same string is posted in a hidden field on every step (so the service
 * works with JavaScript off) and mirrored to localStorage by
 * `components/study-plan/PlanStore.tsx` (so it survives closing the tab).
 * One format and one parser, because two would drift.
 *
 * Nothing here is trusted. The string comes back from the browser on every
 * request, so `deserialisePlan` re-validates it with zod and returns null on
 * anything unexpected rather than throwing: a tampered or stale plan means
 * the student starts again, never an error boundary.
 */
import { z } from "zod";
import type { CurriculumVersionId, TermRef } from "@/content/curriculum";

export type PlannedCourseTerm = { term: TermRef; codes: string[] };

export type StudyPlan = {
  versionId: CurriculumVersionId;
  cohort: string;
  /** Buddhist Era year of entry, derived from the cohort code, e.g. 2566. */
  startYear: number;
  /** Course codes the student has already passed. */
  passed: string[];
  /** Future terms the student has planned. */
  terms: PlannedCourseTerm[];
};

/** Course codes are two to four letters then three digits, e.g. PI574, LAS101. */
const courseCode = z.string().regex(/^[A-Z]{2,4}\d{3}$/);

const termRef = z.object({
  // Up to 8 so a plan can represent breaking the seven-year limit and be
  // told about it, rather than being unrepresentable.
  year: z.number().int().min(1).max(8),
  kind: z.enum(["semester1", "semester2", "summer"]),
});

const studyPlanSchema = z.object({
  versionId: z.enum(["2564", "2564-rev2566", "2568"]),
  cohort: z.string().regex(/^\d{2}$/),
  startYear: z.number().int().min(2560).max(2599),
  passed: z.array(courseCode).max(120),
  terms: z
    .array(z.object({ term: termRef, codes: z.array(courseCode).max(15) }))
    .max(20),
});

/** Name of the hidden input that carries the plan across every form post. */
export const PLAN_FIELD = "plan";

export function serialisePlan(plan: StudyPlan): string {
  return Buffer.from(JSON.stringify(plan), "utf8").toString("base64url");
}

export function deserialisePlan(raw: string): StudyPlan | null {
  if (!raw) return null;
  try {
    const json: unknown = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    const result = studyPlanSchema.safeParse(json);
    return result.success ? (result.data as StudyPlan) : null;
  } catch {
    return null;
  }
}

/** Cohort "66" means entry in B.E. 2566. */
export function startYearFromCohort(cohort: string): number {
  return 2500 + Number(cohort);
}
```

- [ ] **Step 4: Run the test**

Run: `npx vitest run tests/unit/study-plan-serialise.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
npm run typecheck
git add lib/study-plan/plan.ts tests/unit/study-plan-serialise.test.ts
git commit -m "Serialise a study plan into one string for the field and storage"
```

---

### Task 7: Deriving the assumed history

**Files:**

- Create: `lib/study-plan/derive.ts`
- Test: `tests/unit/study-plan-derive.test.ts`

**Interfaces:**

- Consumes: `CurriculumVersion`, `TermRef`, `PlanEntry` from `@/content/curriculum`.
- Produces:
  - `assumedHistory(version, position: TermRef): { courses: string[]; placeholders: PlaceholderSlot[] }`
  - `type PlaceholderSlot = { id: string; label: LocalizedText; category: CategoryId; term: TermRef }`
  - `remainingRequirements(version, passed: string[]): CategoryShortfall[]`
  - `type CategoryShortfall = { category: CreditCategory; earned: number; remaining: number }`

`assumedHistory` is what makes the quick route work: everything in the recommended plan strictly before the student's current term is assumed passed. Placeholders come back separately because the student has to say what actually filled them.

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/study-plan-derive.test.ts
import { describe, expect, it } from "vitest";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import { assumedHistory, remainingRequirements } from "@/lib/study-plan/derive";

const version = CURRICULUM_VERSIONS["2564-rev2566"];

describe("assumedHistory", () => {
  it("assumes nothing for a student in their first term", () => {
    const result = assumedHistory(version, { year: 1, kind: "semester1" });
    expect(result.courses).toEqual([]);
    expect(result.placeholders).toEqual([]);
  });

  it("assumes the first semester for a student in their second", () => {
    const result = assumedHistory(version, { year: 1, kind: "semester2" });
    expect(result.courses).toContain("TU100");
    expect(result.courses).toContain("PD102");
    expect(result.courses).not.toContain("PI211");
  });

  it("orders terms correctly across years, putting summer after semester 2", () => {
    const result = assumedHistory(version, { year: 3, kind: "semester1" });
    expect(result.courses).toContain("PI321");
    expect(result.courses).not.toContain("PI300");
  });

  it("returns placeholders separately from named courses", () => {
    const result = assumedHistory(version, { year: 3, kind: "semester2" });
    expect(result.placeholders.length).toBeGreaterThan(0);
    for (const slot of result.placeholders) {
      expect(slot.id.length).toBeGreaterThan(0);
      expect(result.courses).not.toContain(slot.id);
    }
  });

  it("never returns a code that is not a real course", () => {
    const codes = new Set(version.courses.value.map((c) => c.code));
    const result = assumedHistory(version, { year: 4, kind: "semester1" });
    for (const code of result.courses) expect(codes.has(code)).toBe(true);
  });

  it("does not double-count a course that appears in two terms", () => {
    const result = assumedHistory(version, { year: 4, kind: "semester2" });
    expect(new Set(result.courses).size).toBe(result.courses.length);
  });
});

describe("remainingRequirements", () => {
  it("owes the full requirement when nothing has been passed", () => {
    const shortfalls = remainingRequirements(version, []);
    const total = shortfalls.reduce((n, s) => n + s.remaining, 0);
    expect(total).toBe(version.graduationCredits.value);
  });

  it("credits a passed course against its own category", () => {
    const shortfalls = remainingRequirements(version, ["PI211"]);
    const core = shortfalls.find((s) => s.category.id === "core");
    expect(core?.earned).toBe(3);
    expect(core?.remaining).toBe(27);
  });

  it("ignores courses excluded from the total", () => {
    const v2568 = CURRICULUM_VERSIONS["2568"];
    const shortfalls = remainingRequirements(v2568, ["PI574"]);
    const concentration = shortfalls.find((s) => s.category.id === "concentrationRequired");
    expect(concentration?.earned).toBe(0);
  });

  it("never reports a negative remaining", () => {
    const everything = version.courses.value.map((c) => c.code);
    for (const s of remainingRequirements(version, everything)) {
      expect(s.remaining).toBeGreaterThanOrEqual(0);
    }
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/unit/study-plan-derive.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Write `lib/study-plan/derive.ts`**

```ts
/**
 * Turning "I am in year 3, semester 1" into "here is what we think you have
 * passed". This is what lets a student skip ticking forty boxes.
 *
 * Placeholders come back separately from named courses because roughly a
 * third of the published plan is slots rather than courses ("Minor Required
 * Course 1"), and only the student knows what filled them.
 */
import type {
  CategoryId,
  CreditCategory,
  CurriculumVersion,
  LocalizedText,
  TermKind,
  TermRef,
} from "@/content/curriculum";

export type PlaceholderSlot = {
  id: string;
  label: LocalizedText;
  category: CategoryId;
  term: TermRef;
};

export type CategoryShortfall = {
  category: CreditCategory;
  earned: number;
  remaining: number;
};

const TERM_ORDER: Record<TermKind, number> = { semester1: 0, semester2: 1, summer: 2 };

/** Sortable index so summer lands after semester 2 of the same year. */
function termIndex(term: TermRef): number {
  return term.year * 10 + TERM_ORDER[term.kind];
}

/**
 * Everything in the recommended plan strictly before `position`, split into
 * named courses and placeholder slots the student still has to fill in.
 */
export function assumedHistory(
  version: CurriculumVersion,
  position: TermRef
): { courses: string[]; placeholders: PlaceholderSlot[] } {
  const cutoff = termIndex(position);
  const courses = new Set<string>();
  const placeholders: PlaceholderSlot[] = [];

  for (const term of version.recommendedPlan.value) {
    if (termIndex(term.term) >= cutoff) continue;
    for (const entry of term.entries) {
      if (entry.kind === "course") {
        courses.add(entry.code);
      } else {
        placeholders.push({
          id: entry.id,
          label: entry.label,
          category: entry.category,
          term: term.term,
        });
      }
    }
  }

  return { courses: [...courses], placeholders };
}

/** What the student still owes in each credit category. */
export function remainingRequirements(
  version: CurriculumVersion,
  passed: string[]
): CategoryShortfall[] {
  const passedSet = new Set(passed);
  const byCode = new Map(version.courses.value.map((c) => [c.code, c]));

  return version.categories.map((category) => {
    let earned = 0;
    for (const code of passedSet) {
      const course = byCode.get(code);
      if (!course || course.category !== category.id) continue;
      if (course.excludedFromTotal) continue;
      earned += course.credits;
    }
    return { category, earned, remaining: Math.max(0, category.credits - earned) };
  });
}
```

- [ ] **Step 4: Run the test**

Run: `npx vitest run tests/unit/study-plan-derive.test.ts`
Expected: PASS, 10 tests.

- [ ] **Step 5: Commit**

```bash
npm run typecheck
git add lib/study-plan/derive.ts tests/unit/study-plan-derive.test.ts
git commit -m "Derive assumed history and remaining requirements from a position"
```

---

### Task 8: The findings engine

**Files:**

- Create: `lib/study-plan/findings.ts`
- Test: `tests/unit/study-plan-findings.test.ts`

**Interfaces:**

- Consumes: `CurriculumVersion`, `StudyPlan`, `remainingRequirements`.
- Produces:
  - `type Finding = { id: string; severity: "problem" | "warning" | "note"; message: LocalizedText; source: { document: string; provision: string } }`
  - `checkPlan(version: CurriculumVersion, plan: StudyPlan): Finding[]`
  - `projectedGraduation(plan: StudyPlan): TermRef | null`

Findings never block. They are shown as a list on the plan page, each citing the provision it came from.

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/study-plan-findings.test.ts
import { describe, expect, it } from "vitest";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import { checkPlan, projectedGraduation } from "@/lib/study-plan/findings";
import type { StudyPlan } from "@/lib/study-plan/plan";

const version = CURRICULUM_VERSIONS["2564-rev2566"];

function planWith(terms: StudyPlan["terms"], passed: string[] = []): StudyPlan {
  return { versionId: "2564-rev2566", cohort: "66", startYear: 2566, passed, terms };
}

describe("checkPlan prerequisites", () => {
  it("flags a course placed before its prerequisite", () => {
    const plan = planWith([
      { term: { year: 2, kind: "semester1" }, codes: ["PI300"] },
      { term: { year: 2, kind: "semester2" }, codes: ["PI211"] },
    ]);
    const findings = checkPlan(version, plan);
    const prereq = findings.find((f) => f.id === "prerequisite:PI300");
    expect(prereq?.severity).toBe("problem");
    expect(prereq?.message.en).toContain("PI211");
    expect(prereq?.message.th.length).toBeGreaterThan(0);
  });

  it("accepts a prerequisite satisfied in an earlier term", () => {
    const plan = planWith([
      { term: { year: 2, kind: "semester1" }, codes: ["PI211"] },
      { term: { year: 2, kind: "semester2" }, codes: ["PI300"] },
    ]);
    expect(checkPlan(version, plan).some((f) => f.id === "prerequisite:PI300")).toBe(false);
  });

  it("accepts a prerequisite already passed", () => {
    const plan = planWith(
      [{ term: { year: 2, kind: "semester1" }, codes: ["PI300"] }],
      ["PI211"]
    );
    expect(checkPlan(version, plan).some((f) => f.id === "prerequisite:PI300")).toBe(false);
  });

  it("rejects a prerequisite taken in the same term", () => {
    const plan = planWith([{ term: { year: 2, kind: "semester1" }, codes: ["PI211", "PI300"] }]);
    expect(checkPlan(version, plan).some((f) => f.id === "prerequisite:PI300")).toBe(true);
  });
});

describe("checkPlan credit load", () => {
  it("flags a regular term over 21 credits", () => {
    const codes = ["PI210", "PI211", "PI241", "PI271", "PI280", "PI282", "PI300", "PI320"];
    const findings = checkPlan(version, planWith([{ term: { year: 2, kind: "semester1" }, codes }]));
    const overload = findings.find((f) => f.id === "creditLoad:2-semester1");
    expect(overload?.severity).toBe("problem");
    expect(overload?.source.provision).toContain("10.4");
  });

  it("flags a regular term under 9 credits", () => {
    const findings = checkPlan(
      version,
      planWith([{ term: { year: 2, kind: "semester1" }, codes: ["PI211"] }])
    );
    expect(findings.some((f) => f.id === "creditLoad:2-semester1")).toBe(true);
  });

  it("accepts a regular term of exactly 9 and exactly 21 credits", () => {
    const nine = planWith([{ term: { year: 2, kind: "semester1" }, codes: ["PI210", "PI211", "PI241"] }]);
    expect(checkPlan(version, nine).some((f) => f.id.startsWith("creditLoad:"))).toBe(false);

    const twentyOne = planWith([
      {
        term: { year: 2, kind: "semester1" },
        codes: ["PI210", "PI211", "PI241", "PI271", "PI280", "PI282", "PI300"],
      },
    ]);
    expect(checkPlan(version, twentyOne).some((f) => f.id.startsWith("creditLoad:"))).toBe(false);
  });

  it("flags a summer term over 6 credits", () => {
    const findings = checkPlan(
      version,
      planWith([{ term: { year: 3, kind: "summer" }, codes: ["PI210", "PI211", "PI241"] }])
    );
    expect(findings.some((f) => f.id === "creditLoad:3-summer")).toBe(true);
  });

  it("does not apply the 9-credit floor to a summer term", () => {
    const findings = checkPlan(
      version,
      planWith([{ term: { year: 3, kind: "summer" }, codes: ["PI574"] }])
    );
    expect(findings.some((f) => f.id.startsWith("creditLoad:"))).toBe(false);
  });

  it("ignores empty terms entirely", () => {
    const findings = checkPlan(version, planWith([{ term: { year: 2, kind: "semester1" }, codes: [] }]));
    expect(findings.some((f) => f.id.startsWith("creditLoad:"))).toBe(false);
  });
});

describe("checkPlan completion and timing", () => {
  it("notes how many credits short the plan is", () => {
    const findings = checkPlan(version, planWith([]));
    const shortfall = findings.find((f) => f.id === "shortfall");
    expect(shortfall?.severity).toBe("warning");
    expect(shortfall?.message.en).toContain("127");
  });

  it("does not report a shortfall once the plan reaches the total", () => {
    const everything = version.courses.value.map((c) => c.code);
    const findings = checkPlan(version, planWith([], everything));
    expect(findings.some((f) => f.id === "shortfall")).toBe(false);
  });

  it("flags a plan running past seven years from intake", () => {
    const findings = checkPlan(
      version,
      planWith([{ term: { year: 5, kind: "semester2" }, codes: ["PI211", "PI210", "PI241"] }])
    );
    expect(findings.some((f) => f.id === "maxYears")).toBe(false);

    const late = planWith([{ term: { year: 8, kind: "semester1" }, codes: ["PI211"] }]);
    expect(checkPlan(version, late).some((f) => f.id === "maxYears")).toBe(true);
  });
});

describe("projectedGraduation", () => {
  it("returns the last planned term", () => {
    const plan = planWith([
      { term: { year: 3, kind: "semester1" }, codes: ["PI300"] },
      { term: { year: 4, kind: "semester2" }, codes: ["PI470"] },
      { term: { year: 3, kind: "summer" }, codes: ["PI574"] },
    ]);
    expect(projectedGraduation(plan)).toEqual({ year: 4, kind: "semester2" });
  });

  it("returns null for a plan with no terms", () => {
    expect(projectedGraduation(planWith([]))).toBeNull();
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/unit/study-plan-findings.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Write `lib/study-plan/findings.ts`**

```ts
/**
 * What the service actually checks, and the only place it makes a judgement.
 *
 * Findings never block. A student may plan something the rules disallow;
 * the service says so, cites the provision, and leaves the decision with
 * them and their advisor. Three things are deliberately not checked: whether
 * a course runs in the term it was placed in, anything at the Dean's or an
 * advisor's discretion, and anything depending on GPA.
 */
import type { CurriculumVersion, LocalizedText, TermRef } from "@/content/curriculum";
import type { StudyPlan } from "./plan";
import { remainingRequirements } from "./derive";

export type Finding = {
  /** Stable id so a test can name one finding without matching on copy. */
  id: string;
  severity: "problem" | "warning" | "note";
  message: LocalizedText;
  source: { document: string; provision: string };
};

const TERM_ORDER = { semester1: 0, semester2: 1, summer: 2 } as const;

function termIndex(term: TermRef): number {
  return term.year * 10 + TERM_ORDER[term.kind];
}

function termLabel(term: TermRef): { en: string; th: string } {
  const kind = {
    semester1: { en: "semester 1", th: "ภาคเรียนที่ 1" },
    semester2: { en: "semester 2", th: "ภาคเรียนที่ 2" },
    summer: { en: "summer", th: "ภาคฤดูร้อน" },
  }[term.kind];
  return {
    en: `year ${term.year}, ${kind.en}`,
    th: `ชั้นปีที่ ${term.year} ${kind.th}`,
  };
}

export function checkPlan(version: CurriculumVersion, plan: StudyPlan): Finding[] {
  const findings: Finding[] = [];
  const byCode = new Map(version.courses.value.map((c) => [c.code, c]));
  const rules = version.rules.value;
  const rulesSource = { document: rules.source.document, provision: rules.source.provision };
  const curriculumSource = {
    document: version.id,
    provision: version.label.en,
  };

  const terms = [...plan.terms].sort((a, b) => termIndex(a.term) - termIndex(b.term));

  // Prerequisites: satisfied only by an earlier term or an already-passed
  // course. Same-term does not count.
  const earned = new Set(plan.passed);
  for (const term of terms) {
    for (const code of term.codes) {
      const course = byCode.get(code);
      if (!course) continue;
      for (const prereq of course.prerequisites) {
        if (earned.has(prereq)) continue;
        findings.push({
          id: `prerequisite:${code}`,
          severity: "problem",
          message: {
            en: `${code} needs ${prereq} passed first. You have placed it in ${termLabel(term.term).en} without ${prereq} before it.`,
            th: `วิชา ${code} ต้องผ่านวิชา ${prereq} ก่อน ท่านจัดวิชานี้ไว้ใน${termLabel(term.term).th} โดยไม่มีวิชา ${prereq} มาก่อน`,
          },
          source: curriculumSource,
        });
      }
    }
    for (const code of term.codes) earned.add(code);
  }

  // Credit load per term.
  for (const term of terms) {
    if (term.codes.length === 0) continue;
    const credits = term.codes.reduce((n, code) => n + (byCode.get(code)?.credits ?? 0), 0);
    const isSummer = term.term.kind === "summer";
    const over = isSummer
      ? credits > rules.maxCreditsSummerTerm
      : credits > rules.maxCreditsRegularTerm;
    const under = !isSummer && credits < rules.minCreditsRegularTerm;
    if (!over && !under) continue;
    const limit = isSummer
      ? `no more than ${rules.maxCreditsSummerTerm}`
      : `${rules.minCreditsRegularTerm} to ${rules.maxCreditsRegularTerm}`;
    const limitTh = isSummer
      ? `ไม่เกิน ${rules.maxCreditsSummerTerm}`
      : `${rules.minCreditsRegularTerm} ถึง ${rules.maxCreditsRegularTerm}`;
    findings.push({
      id: `creditLoad:${term.term.year}-${term.term.kind}`,
      severity: "problem",
      message: {
        en: `You have ${credits} credits in ${termLabel(term.term).en}. The limit is ${limit} credits.`,
        th: `ท่านลงทะเบียน ${credits} หน่วยกิตใน${termLabel(term.term).th} ข้อกำหนดคือ ${limitTh} หน่วยกิต`,
      },
      source: rulesSource,
    });
  }

  // Completion.
  const plannedCodes = terms.flatMap((t) => t.codes);
  const allCodes = [...new Set([...plan.passed, ...plannedCodes])];
  const shortfalls = remainingRequirements(version, allCodes);
  const remaining = shortfalls.reduce((n, s) => n + s.remaining, 0);
  if (remaining > 0) {
    findings.push({
      id: "shortfall",
      severity: "warning",
      message: {
        en: `This plan reaches ${version.graduationCredits.value - remaining} of the ${version.graduationCredits.value} credits you need. You are ${remaining} credits short.`,
        th: `แผนนี้ครบ ${version.graduationCredits.value - remaining} หน่วยกิต จากที่ต้องมี ${version.graduationCredits.value} หน่วยกิต ยังขาดอีก ${remaining} หน่วยกิต`,
      },
      source: curriculumSource,
    });
  }

  // Timing. Year N of study is within the limit while N <= maxYears.
  const lastTerm = terms.at(-1)?.term;
  if (lastTerm && lastTerm.year > rules.maxYears) {
    findings.push({
      id: "maxYears",
      severity: "problem",
      message: {
        en: `This plan runs into year ${lastTerm.year}. You have ${rules.maxYears} years from when you started to finish the degree, and leave does not extend that.`,
        th: `แผนนี้ยาวถึงชั้นปีที่ ${lastTerm.year} ท่านมีเวลา ${rules.maxYears} ปีนับจากปีที่เข้าศึกษาเพื่อสำเร็จการศึกษา และการลาพักการศึกษาไม่ทำให้ระยะเวลานี้ขยายออกไป`,
      },
      source: rulesSource,
    });
  }

  return findings;
}

/** The last term the plan places a course in, or null if nothing is planned. */
export function projectedGraduation(plan: StudyPlan): TermRef | null {
  const terms = [...plan.terms]
    .filter((t) => t.codes.length > 0)
    .sort((a, b) => termIndex(a.term) - termIndex(b.term));
  return terms.at(-1)?.term ?? null;
}
```

- [ ] **Step 4: Run the test**

Run: `npx vitest run tests/unit/study-plan-findings.test.ts`
Expected: PASS, 15 tests.

- [ ] **Step 5: Commit**

```bash
npm run typecheck
git add lib/study-plan/findings.ts tests/unit/study-plan-findings.test.ts
git commit -m "Check a plan against prerequisites, credit limits and the seven-year rule"
```

---

### Task 9: Copy, the start page and the version gate

**Files:**

- Create: `components/study-plan/studyPlanCopy.ts`
- Create: `components/study-plan/InferenceNotice.tsx`
- Create: `app/[lang]/services/study-plan/steps.ts`
- Create: `app/[lang]/services/study-plan/actions.ts`
- Create: `app/[lang]/services/study-plan/page.tsx`
- Create: `app/[lang]/services/study-plan/curriculum/page.tsx`
- Create: `app/[lang]/services/study-plan/cannot-help/page.tsx`
- Test: `tests/unit/study-plan-copy.test.ts`

**Interfaces:**

- Consumes: `resolveCohort`, `inferredParts`, `disclosures` from `@/content/curriculum`; `startYearFromCohort`, `serialisePlan` from `@/lib/study-plan/plan`.
- Produces: `buildStudyPlanCopy(locale: Locale)` returning every string the journey needs; `<InferenceNotice version={...} locale={...} />`.

Read `app/[lang]/clubs/start/actions.ts` and `components/forms/startClubWizardCopy.ts` first and follow them exactly. The draft cookie is `birsa_study_plan_draft`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/study-plan-copy.test.ts
import { describe, expect, it } from "vitest";
import { buildStudyPlanCopy } from "@/components/study-plan/studyPlanCopy";
import { locales } from "@/lib/i18n";

describe("buildStudyPlanCopy", () => {
  it("returns a non-empty string for every key in every locale", () => {
    for (const locale of locales) {
      const copy = buildStudyPlanCopy(locale);
      const walk = (node: unknown, path: string): void => {
        if (typeof node === "string") {
          expect(node.trim().length, `${locale} ${path}`).toBeGreaterThan(0);
          return;
        }
        if (node && typeof node === "object") {
          for (const [key, value] of Object.entries(node)) walk(value, `${path}.${key}`);
        }
      };
      walk(copy, locale);
    }
  });

  it("uses no em dashes, per the site writing standard", () => {
    for (const locale of locales) {
      expect(JSON.stringify(buildStudyPlanCopy(locale))).not.toContain("—");
    }
  });

  it("has the same key shape in both locales", () => {
    const keys = (o: object): string[] =>
      Object.entries(o)
        .flatMap(([k, v]) => (v && typeof v === "object" ? keys(v).map((s) => `${k}.${s}`) : [k]))
        .sort();
    expect(keys(buildStudyPlanCopy("en"))).toEqual(keys(buildStudyPlanCopy("th")));
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/unit/study-plan-copy.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Write `components/study-plan/studyPlanCopy.ts`**

Follow the shape of `components/forms/startClubWizardCopy.ts`. Include at minimum:

```ts
import type { Locale } from "@/lib/i18n";

export function buildStudyPlanCopy(locale: Locale) {
  return locale === "th" ? th : en;
}

const en = {
  start: {
    title: "Plan your BIR degree",
    lede: "Work out what you still need to take, put it into semesters, and check it against the rules before you see your advisor.",
    beforeYouStart: "Before you start",
    needs: [
      "the first two digits of your student ID",
      "which year and semester you are in now",
      "your transcript, if you have taken anything outside the standard plan",
    ],
    timeEstimate: "This takes about 10 minutes.",
    notARecord:
      "This is a plan, not your academic record. It is stored in this browser only, and nobody at BIRSA can see it.",
    startButton: "Start now",
  },
  cohort: {
    title: "What are the first two digits of your student ID?",
    hint: "For example, if your ID starts 6612, enter 66. This is what tells us which curriculum you are on.",
    label: "First two digits",
    errorRequired: "Enter the first two digits of your student ID",
    errorFormat: "Enter two digits, for example 66",
  },
  curriculum: {
    title: "Is this your curriculum?",
    lede: "Check this against your own transcript before you go on. If it is wrong, everything after it will be wrong too.",
    totalLabel: "Credits to graduate",
    coursesLabel: "Courses you should recognise from your first year",
    sourceLabel: "Where this comes from",
    attestedWarning:
      "No published document says which curriculum your cohort follows. BIRSA has told us it is this one.",
    yes: "Yes, this matches",
    no: "No, or I am not sure",
    errorRequired: "Select whether this is your curriculum",
  },
  cannotHelp: {
    title: "We cannot plan your degree",
    unsupportedCohort:
      "We do not have curriculum data for student IDs starting {cohort}. We only cover cohorts 64 to 69, which is everyone currently enrolled.",
    notSure:
      "You told us the curriculum we found does not match, or that you are not sure. We will not guess: a plan built on the wrong curriculum is worse than no plan.",
    doubleDegree:
      "Double degree routes are not covered. The credit totals differ between the source documents, and the UK routes are counted in credits that do not compare to Thai credits.",
    whatToDo: "What to do instead",
    contactHeading: "Ask the faculty",
    sourcesHeading: "Read the source documents",
  },
  inference: {
    heading: "Part of this plan is borrowed from an older curriculum",
    askAdvisor: "Confirm this with your advisor before you rely on it.",
  },
  // ... plus `where`, `assumed`, `fill`, `plan`, `print` and `delete` groups,
  // added by Tasks 10, 11 and 12.
} as const;

const th: typeof en = {
  // Write every key from `en` above, in Thai. This must be a complete object:
  // `typeof en` makes a missing key a type error, which is the point.
  // Use the formal official register this site uses elsewhere (see
  // `content/student-life/th/**` and `content/privacy/`). Not a literal
  // translation of the English.
};
```

- [ ] **Step 4: Write `app/[lang]/services/study-plan/steps.ts`**

```ts
/**
 * Step order and the draft cookie name. Lives outside actions.ts because a
 * "use server" file may only export async functions.
 */
export const STUDY_PLAN_STEPS = ["cohort", "curriculum", "where", "assumed", "plan"] as const;
export type StudyPlanStep = (typeof STUDY_PLAN_STEPS)[number];

export const STUDY_PLAN_COOKIE = "birsa_study_plan_draft";

export type StudyPlanDraft = {
  cohort?: string;
  confirmed?: "yes" | "no";
  positionYear?: string;
  positionKind?: string;
};
```

- [ ] **Step 5: Write `app/[lang]/services/study-plan/actions.ts`**

Two actions for now, following `app/[lang]/clubs/start/actions.ts`:

- `submitCohortStep(locale, _prev, formData)`: validate two digits with zod, `mergeDraft` it, then `redirect` to `/services/study-plan/curriculum` if `resolveCohort` says supported, or `/services/study-plan/cannot-help?reason=cohort` if not.
- `submitCurriculumStep(locale, _prev, formData)`: read the radio. `"yes"` redirects to `/services/study-plan/where`; `"no"` redirects to `/services/study-plan/cannot-help?reason=not-sure`; missing returns `{ status: "invalid", error }`.

- [ ] **Step 6: Write the three pages**

`page.tsx` is a GOV.UK start page: `PageHeader`, `Breadcrumbs`, the lede, the "before you start" list, the time estimate, the "this is not your record" line, and a `Button` linking to `/services/study-plan/cohort`. Note the cohort question lives at the journey root's child, not the root, unlike `clubs/start`, because this journey has a real start page to render.

`curriculum/page.tsx` reads the draft, calls `resolveCohort`, and renders the version's label, `graduationCredits.value`, its `distinguishingCourses` with titles, a link to the source document, `<InferenceNotice>`, and the yes/no radio posting to `submitCurriculumStep`. If the mapping provenance is `attested`, render the `attestedWarning`.

`cannot-help/page.tsx` takes `?reason=cohort|not-sure|double-degree` and renders the matching copy plus the faculty contact link and the source document links. It must render for any reason value, including a missing one: default to `not-sure`.

- [ ] **Step 7: Write `components/study-plan/InferenceNotice.tsx`**

A server component. Takes `version` and `locale`, calls `inferredParts(version)` and `disclosures(version)`, and renders nothing at all when both are empty. Otherwise a `<Notice variant="warning">` with the heading, each inferred part's `reason`, each disclosure's `disclosure` text, and the "confirm with your advisor" line.

- [ ] **Step 8: Run the tests**

```bash
npx vitest run tests/unit/study-plan-copy.test.ts
npm run typecheck
npm run lint
```

Expected: 3 tests pass, no type or lint errors.

- [ ] **Step 9: Verify in the browser**

Start the preview with the `preview_start` tool, then visit `/en/services/study-plan`, enter `66`, and confirm the curriculum screen names Curriculum 2021 2023 revision, 127 credits, and `EL105`. Then repeat with `68` and confirm the inference notice appears. Then `70` and confirm the stop page.

- [ ] **Step 10: Commit**

```bash
git add components/study-plan app/[lang]/services/study-plan tests/unit/study-plan-copy.test.ts
git commit -m "Add the study plan start page and the version gate"
```

---

### Task 10: Position, assumptions and placeholders

**Files:**

- Create: `app/[lang]/services/study-plan/where/page.tsx`
- Create: `app/[lang]/services/study-plan/assumed/page.tsx`
- Create: `app/[lang]/services/study-plan/assumed/fill/page.tsx`
- Modify: `app/[lang]/services/study-plan/actions.ts`
- Modify: `components/study-plan/studyPlanCopy.ts`
- Test: `tests/unit/study-plan-journey.test.ts`

**Interfaces:**

- Consumes: `assumedHistory`, `serialisePlan`, `startYearFromCohort`.
- Produces: `submitWhereStep`, `submitAssumedStep`, `submitFillStep` in `actions.ts`; a serialised `StudyPlan` in the hidden field by the end of the journey.

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/study-plan-journey.test.ts
import { describe, expect, it } from "vitest";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import { assumedHistory } from "@/lib/study-plan/derive";
import { deserialisePlan, serialisePlan, startYearFromCohort } from "@/lib/study-plan/plan";

describe("building the initial plan from a position", () => {
  it("turns cohort 66 into a 2566 start year", () => {
    expect(startYearFromCohort("66")).toBe(2566);
  });

  it("produces a plan a later step can read back", () => {
    const version = CURRICULUM_VERSIONS["2564-rev2566"];
    const history = assumedHistory(version, { year: 3, kind: "semester1" });
    const plan = {
      versionId: version.id,
      cohort: "66",
      startYear: startYearFromCohort("66"),
      passed: history.courses,
      terms: [],
    };
    const round = deserialisePlan(serialisePlan(plan));
    expect(round?.passed).toEqual(history.courses);
    expect(round?.versionId).toBe("2564-rev2566");
  });

  it("drops a course the student says they did not take", () => {
    const version = CURRICULUM_VERSIONS["2564-rev2566"];
    const history = assumedHistory(version, { year: 3, kind: "semester1" });
    const corrected = history.courses.filter((c) => c !== "PI211");
    expect(corrected).not.toContain("PI211");
    expect(corrected.length).toBe(history.courses.length - 1);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/unit/study-plan-journey.test.ts`
Expected: FAIL until `startYearFromCohort` is exported. If Task 6 already exported it, this passes immediately; that is fine, move to step 3.

- [ ] **Step 3: Write the `where` step**

Two selects on one page, year (1 to 8, matching `TermRef`, because students on extended study exist and the seven-year rule needs to be able to fire) and term (semester 1, semester 2, summer), posting to `submitWhereStep`. Wording: "Which year and semester are you in now?" with the hint "Tell us where you are now. We will assume you have followed the standard plan up to this point, and you can correct that on the next page."

`submitWhereStep` validates both, merges into the draft, builds the initial `StudyPlan` from `assumedHistory`, and redirects to `/services/study-plan/assumed`.

- [ ] **Step 4: Write the `assumed` step**

Render the assumed-passed courses as a checkbox list, all checked, grouped by term, with the heading "Check what we have assumed" and the hint "We have assumed you passed these. Uncheck anything you did not take, failed, or replaced with something else."

Every checkbox is `name="passed" value="{code}"`. `submitAssumedStep` reads `formData.getAll("passed")`, rebuilds the plan's `passed` array from exactly those, and redirects to `/assumed/fill` if the version has placeholders before the student's position, or straight to `/plan` if not.

- [ ] **Step 5: Write the `assumed/fill` step**

One page listing every placeholder slot from `assumedHistory(...).placeholders`, each a `<select>` of the courses in that slot's category, plus an "I have not taken this yet" option with an empty value. `submitFillStep` adds every non-empty selection to `passed` and redirects to `/plan`.

- [ ] **Step 6: Run the tests and verify**

```bash
npx vitest run tests/unit/study-plan-journey.test.ts
npm run typecheck
```

Then in the browser: `66`, yes, year 3 semester 1, and confirm the assumed list contains roughly 23 courses and the fill page asks about the minor and elective slots.

- [ ] **Step 7: Commit**

```bash
git add app/[lang]/services/study-plan components/study-plan/studyPlanCopy.ts tests/unit/study-plan-journey.test.ts
git commit -m "Ask where the student is and let them correct the assumed history"
```

---

### Task 11: The plan screen and the print page

**Files:**

- Create: `app/[lang]/services/study-plan/plan/page.tsx`
- Create: `app/[lang]/services/study-plan/plan/print/page.tsx`
- Create: `components/study-plan/FindingsList.tsx`
- Create: `components/study-plan/TermEditor.tsx`
- Modify: `app/[lang]/services/study-plan/actions.ts`
- Modify: `components/study-plan/studyPlanCopy.ts`
- Modify: `app/globals.css`
- Test: `tests/unit/study-plan-findings-list.test.tsx`

**Interfaces:**

- Consumes: `checkPlan`, `projectedGraduation`, `remainingRequirements`, `deserialisePlan`, `serialisePlan`.
- Produces: `addCourseToTerm`, `removeCourseFromTerm` server actions.

- [ ] **Step 1: Write the failing test**

```tsx
// tests/unit/study-plan-findings-list.test.tsx
// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FindingsList from "@/components/study-plan/FindingsList";
import type { Finding } from "@/lib/study-plan/findings";

const findings: Finding[] = [
  {
    id: "prerequisite:PI300",
    severity: "problem",
    message: { en: "PI300 needs PI211 passed first.", th: "วิชา PI300 ต้องผ่านวิชา PI211 ก่อน" },
    source: { document: "2564-rev2566", provision: "Curriculum 2021, 2023 revision" },
  },
  {
    id: "shortfall",
    severity: "warning",
    message: { en: "You are 12 credits short.", th: "ยังขาดอีก 12 หน่วยกิต" },
    source: { document: "2564-rev2566", provision: "Curriculum 2021, 2023 revision" },
  },
];

describe("FindingsList", () => {
  it("shows every finding with its citation", () => {
    render(<FindingsList findings={findings} locale="en" emptyMessage="Nothing to flag." />);
    expect(screen.getByText(/PI300 needs PI211/)).toBeDefined();
    expect(screen.getByText(/12 credits short/)).toBeDefined();
    expect(screen.getAllByText(/Curriculum 2021, 2023 revision/).length).toBe(2);
  });

  it("renders the Thai message in the Thai locale", () => {
    render(<FindingsList findings={findings} locale="th" emptyMessage="ไม่มีข้อควรระวัง" />);
    expect(screen.getByText(/ต้องผ่านวิชา PI211 ก่อน/)).toBeDefined();
  });

  it("puts problems before warnings", () => {
    const { container } = render(
      <FindingsList findings={[findings[1], findings[0]]} locale="en" emptyMessage="none" />
    );
    const text = container.textContent ?? "";
    expect(text.indexOf("PI300")).toBeLessThan(text.indexOf("12 credits"));
  });

  it("shows the empty message when there is nothing to flag", () => {
    render(<FindingsList findings={[]} locale="en" emptyMessage="Nothing to flag." />);
    expect(screen.getByText("Nothing to flag.")).toBeDefined();
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/unit/study-plan-findings-list.test.tsx`
Expected: FAIL, module not found.

Note: `vitest.config.ts` sets `environment: "node"`, so the `@vitest-environment jsdom` docblock at the top of the file is required. `tests/unit/confirm-dialog.test.tsx` does the same; follow it.

- [ ] **Step 3: Write `components/study-plan/FindingsList.tsx`**

A server component. Sorts `problem` before `warning` before `note`, renders each as a list item with its message and, in smaller muted text, `source.provision`. Renders `emptyMessage` when the array is empty.

- [ ] **Step 4: Write `components/study-plan/TermEditor.tsx` and the plan page**

The plan page renders, in this order:

1. `<InferenceNotice>`, so a borrowed sequence is the first thing seen.
2. A summary: curriculum label, cohort, credits planned against `graduationCredits.value`, and the projected graduation term from `projectedGraduation`.
3. `<FindingsList>`.
4. What is still owed, from `remainingRequirements`, as a table of category, credits earned, credits remaining.
5. One `<TermEditor>` per future term, each a small form with a `<select>` of courses not yet placed and an "Add" button posting to `addCourseToTerm`, plus a "Remove" button per placed course posting to `removeCourseFromTerm`.
6. A link to `/services/study-plan/plan/print`.
7. The "what this does not check" list: course availability, discretion, GPA.

Every form on this page carries `<input type="hidden" name="plan" value={serialisePlan(plan)} />`. That hidden field is what makes the page work with JavaScript off. `addCourseToTerm` and `removeCourseFromTerm` deserialise it, apply one change, and redirect back to `/plan` with the new plan in the query string.

- [ ] **Step 5: Write the print page**

Everything on one page, no forms and no editing: curriculum label and version, the cohort, the date generated, every term with its courses and credits, the findings, the remaining requirements, and the inference notice. Add a print stylesheet block to `app/globals.css` under `@media print` hiding the header, footer, breadcrumbs and skip link.

- [ ] **Step 6: Run the tests and verify**

```bash
npx vitest run tests/unit/study-plan-findings-list.test.tsx
npm run typecheck
npm run lint
```

In the browser, build a term that breaks a prerequisite (put `PI300` before `PI211`) and confirm the finding appears with its citation. Then print-preview the print page.

- [ ] **Step 7: Commit**

```bash
git add app/[lang]/services/study-plan components/study-plan app/globals.css tests/unit/study-plan-findings-list.test.tsx
git commit -m "Add the plan screen, findings list and print page"
```

---

### Task 12: Browser storage, deletion and the privacy register

**Files:**

- Create: `components/study-plan/PlanStore.tsx`
- Modify: `app/[lang]/services/study-plan/plan/page.tsx`
- Modify: `content/privacy/register.ts`
- Modify: `components/study-plan/studyPlanCopy.ts`
- Test: `tests/unit/privacy-register.test.ts` (existing, extend)

**Interfaces:**

- Consumes: `serialisePlan`, `deserialisePlan`.
- Produces: `<PlanStore plan={serialised} />`, which mirrors the plan to `localStorage` under `birsa-study-plan`.

Read `components/onboarding/StepTasksClient.tsx` first and follow it exactly: the `mounted` gate for hydration safety, and every storage access wrapped in `try`/`catch` so private browsing degrades rather than breaking.

- [ ] **Step 1: Write the failing test**

Extend `tests/unit/privacy-register.test.ts` with:

```ts
it("documents the study plan localStorage key", () => {
  const entry = localStorageKeys.find((k) => k.key === "birsa-study-plan");
  expect(entry).toBeDefined();
  expect(entry?.purpose.en.trim().length).toBeGreaterThan(0);
  expect(entry?.purpose.th.trim().length).toBeGreaterThan(0);
});
```

Match the existing file's imports and the actual shape of the localStorage records already in `content/privacy/register.ts` around line 594. Read that file before writing this test.

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/unit/privacy-register.test.ts`
Expected: FAIL, no such key.

- [ ] **Step 3: Add the register entry**

Add `birsa-study-plan` alongside `birsa-theme` and `birsa-onboarding-*`, with a purpose saying the plan is held in the browser only, never sent to BIRSA, and cleared by the delete button on the plan page.

- [ ] **Step 4: Write `components/study-plan/PlanStore.tsx`**

```tsx
"use client";

/**
 * Mirrors the finished plan to localStorage so it survives closing the tab.
 *
 * Everything on the plan page already works without this: the plan travels
 * in a hidden field on every form post, so a visitor with JavaScript off
 * completes the whole journey and can print. This component only adds
 * persistence between visits, exactly like
 * `components/onboarding/StepTasksClient.tsx` does for the onboarding task
 * list. Storage access is wrapped in try/catch throughout: private browsing
 * or disabled storage must degrade to the no-JavaScript behaviour, never
 * break the page.
 *
 * The plan never reaches a BIRSA server. It is not in a cookie, which is
 * why it is here and not in `components/forms/draftCookie.ts`.
 */
import { useEffect } from "react";

const KEY = "birsa-study-plan";

export function readStoredPlan(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function clearStoredPlan(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nothing to clear if storage was never available.
  }
}

/**
 * Renders nothing. It exists only for its effect, so it needs no `mounted`
 * hydration gate: there is no markup for the server and the client to
 * disagree about. `StepTasksClient` needs that gate because it renders
 * checkboxes; this does not.
 */
export default function PlanStore({ plan }: { plan: string }) {
  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, plan);
    } catch {
      // The plan just will not persist for this visit.
    }
  }, [plan]);

  return null;
}
```

- [ ] **Step 5: Add the delete control**

On the plan page, a section headed "Delete your plan" with one button. Without JavaScript it posts to a server action that redirects to the journey start with no plan. With JavaScript, a small client component also calls `clearStoredPlan()` and shows a confirmation naming what was deleted. Use `components/ConfirmDialog.tsx` if it fits; otherwise a plain button is acceptable, as deleting a browser-local plan is reversible by redoing the journey.

- [ ] **Step 6: Run the tests**

```bash
npx vitest run tests/unit/privacy-register.test.ts
npm run typecheck
npm run lint
```

- [ ] **Step 7: Commit**

```bash
git add components/study-plan content/privacy/register.ts app/[lang]/services/study-plan tests/unit/privacy-register.test.ts
git commit -m "Persist the plan in the browser, with a delete route and register entry"
```

---

### Task 13: Disclosure test, service listing, and end-to-end coverage

**Files:**

- Create: `tests/unit/study-plan-disclosure.test.ts`
- Create: `tests/e2e/study-plan.spec.ts`
- Modify: `tests/e2e/wizard-smoke.spec.ts`
- Modify: `app/[lang]/services/page.tsx`
- Modify: `content/student-life/en/handbook/curriculum-and-study-plan.mdx`
- Modify: `content/student-life/th/handbook/curriculum-and-study-plan.mdx`

**Interfaces:**

- Consumes: everything above.
- Produces: nothing new; this task closes the loop.

The disclosure test is what stands in for the verification gate the spec dropped. The service may ship uncertain data; it may not ship it silently.

- [ ] **Step 1: Write the disclosure test**

```ts
// tests/unit/study-plan-disclosure.test.ts
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CURRICULUM_VERSIONS, inferredParts, disclosures } from "@/content/curriculum";

const ROOT = process.cwd();

function read(relative: string): string {
  return fs.readFileSync(path.join(ROOT, relative), "utf8");
}

describe("uncertain curriculum data is disclosed, never silent", () => {
  it("gives every inferred part a reason in both locales", () => {
    for (const version of Object.values(CURRICULUM_VERSIONS)) {
      for (const derivation of inferredParts(version)) {
        if (derivation.kind !== "inferred") throw new Error("unreachable");
        expect(derivation.reason.en.trim().length, version.id).toBeGreaterThan(20);
        expect(derivation.reason.th.trim().length, version.id).toBeGreaterThan(20);
      }
    }
  });

  it("gives every student-facing contradiction copy in both locales", () => {
    for (const version of Object.values(CURRICULUM_VERSIONS)) {
      for (const c of disclosures(version)) {
        expect(c.disclosure?.en.trim().length, `${version.id}/${c.id}`).toBeGreaterThan(20);
        expect(c.disclosure?.th.trim().length, `${version.id}/${c.id}`).toBeGreaterThan(20);
      }
    }
  });

  it("renders the inference notice on the confirm, plan and print screens", () => {
    for (const page of [
      "app/[lang]/services/study-plan/curriculum/page.tsx",
      "app/[lang]/services/study-plan/plan/page.tsx",
      "app/[lang]/services/study-plan/plan/print/page.tsx",
    ]) {
      expect(read(page), `${page} must render InferenceNotice`).toContain("InferenceNotice");
    }
  });

  it("records every version's sources so a maintainer can get back to the page", () => {
    for (const version of Object.values(CURRICULUM_VERSIONS)) {
      expect(version.verification.sources.length, version.id).toBeGreaterThan(0);
    }
  });

  it("never claims a version is verified by nobody", () => {
    for (const version of Object.values(CURRICULUM_VERSIONS)) {
      const { verifiedBy, verifiedOn } = version.verification;
      expect(Boolean(verifiedBy) === Boolean(verifiedOn), version.id).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run it**

Run: `npx vitest run tests/unit/study-plan-disclosure.test.ts`
Expected: PASS, 5 tests. If the third test fails, a screen is missing its notice; add the component rather than relaxing the test.

- [ ] **Step 3: Add the service to the services listing**

In `app/[lang]/services/page.tsx`, add a `studyPlan` entry to the `copy` record for both locales and a `NavListItem` in the Services section, above the equipment loan. English title "Plan your BIR degree", description "Work out what you still need to take, put it into semesters, and check it against the rules." CTA "Plan your degree".

- [ ] **Step 4: Cross-link the handbook chapter**

In both `curriculum-and-study-plan.mdx` files, add a `<Notice variant="info">` after the opening notice linking to `/services/study-plan`, saying the planner turns this chapter into a plan for one student. Do not duplicate any credit figures into the notice; the chapter already has them.

- [ ] **Step 5: Write the e2e spec**

```ts
// tests/e2e/study-plan.spec.ts
import { test, expect } from "@playwright/test";

const ERROR_BOUNDARY_TEXT = "Sorry, there is a problem with this page";

test.describe("study plan version gate", () => {
  test("an unsupported cohort is refused, not guessed at", async ({ page }) => {
    await page.goto("/en/services/study-plan/cohort");
    await page.getByLabel(/first two digits/i).fill("70");
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.getByRole("heading", { name: /cannot plan your degree/i })).toBeVisible();
  });

  test("cohort 68 is told its study plan is borrowed", async ({ page }) => {
    await page.goto("/en/services/study-plan/cohort");
    await page.getByLabel(/first two digits/i).fill("68");
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.getByText(/borrowed from an older curriculum/i)).toBeVisible();
  });

  test("answering not sure stops the journey", async ({ page }) => {
    await page.goto("/en/services/study-plan/cohort");
    await page.getByLabel(/first two digits/i).fill("66");
    await page.getByRole("button", { name: /continue/i }).click();
    await page.getByLabel(/not sure/i).check();
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.getByRole("heading", { name: /cannot plan your degree/i })).toBeVisible();
  });
});

test.describe("study plan without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("completes from cohort to plan", async ({ page }) => {
    await page.goto("/en/services/study-plan/cohort");
    await page.getByLabel(/first two digits/i).fill("66");
    await page.getByRole("button", { name: /continue/i }).click();

    await page.getByLabel(/yes, this matches/i).check();
    await page.getByRole("button", { name: /continue/i }).click();

    await page.getByLabel(/year/i).selectOption("3");
    await page.getByLabel(/term/i).selectOption("semester1");
    await page.getByRole("button", { name: /continue/i }).click();

    await page.getByRole("button", { name: /continue/i }).click();

    await expect(page.getByText(ERROR_BOUNDARY_TEXT)).toHaveCount(0);
    await expect(page.getByText(/127/)).toBeVisible();
  });
});
```

- [ ] **Step 6: Add the entry points to the smoke spec**

In `tests/e2e/wizard-smoke.spec.ts`, add to `journeyEntryPoints`:

```ts
  "/en/services/study-plan",
  "/en/services/study-plan/cohort",
  "/en/services/study-plan/cannot-help",
```

`cannot-help` is included deliberately: it takes a query parameter and must render without one.

- [ ] **Step 7: Run everything**

```bash
npm test
npm run typecheck
npm run lint
npm run e2e
```

Expected: all unit tests pass, no type or lint errors, e2e passes including the no-JavaScript run.

- [ ] **Step 8: Commit**

```bash
git add tests app/[lang]/services/page.tsx content/student-life
git commit -m "Test that uncertain curriculum data is always disclosed, and list the service"
```

---

## Self-review notes

Spec coverage checked section by section:

- Section 1 scope: Tasks 5 (cohorts 64 to 69), 9 (double degree to the stop page), 11 ("what this does not check" list).
- Section 2 version gate: Task 9.
- Section 3 data as code: Tasks 1 to 5. `Derivation` and cohort provenance both enforced by tests.
- Section 4 journey: Tasks 9, 10, 11. All nine screens accounted for.
- Section 5 storage and progressive enhancement: Tasks 6 and 12, with the no-JavaScript run in Task 13.
- Section 6 what it checks: Task 8.
- Section 7 information architecture: Task 13 steps 3 and 4.
- Section 8 testing: distributed across every task; the disclosure test is Task 13.
- Section 9 contradictions: encoded in Tasks 2, 3, 4 and asserted in Task 13.
- Section 10 sequencing: this plan follows it, with the spec's step 6 (faculty confirmation) left out because it is not a development task.

Known gap, deliberate: the spec's "handbook agreement" test, asserting the credit table in the MDX matches the active curriculum module, is not implemented. The MDX table is prose in a Markdown file and parsing it to compare numbers would be brittle. Task 13 step 4 cross-links the two instead. If the numbers drift, the disclosure copy is where a reader would notice. Raise this with the reviewer rather than silently skipping it.
