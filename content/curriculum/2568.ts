/**
 * Curriculum B.E. 2568, for cohorts 68 and 69.
 *
 * Every part of this version is now published. That was not true when the file
 * was first written, and the change is worth recording, because two of the
 * things this file used to warn a student about turned out to be artefacts of
 * an incomplete reading of the source rather than gaps in it.
 *
 * The source is the 2568 curriculum document (`comparison2568`). It is 357
 * pages and mostly Thai, and an earlier pass took its structure section but
 * not its study plan. It has one: section 4.3.2.3 แสดงแผนการศึกษา, pages 53 to
 * 55, รูปแบบที่ 1 (the route for a student who studies at Thammasat
 * throughout). `recommendedPlan` below is that plan, and its derivation is
 * `published`. The borrowed-sequence notice, and the `no-2568-study-plan`
 * contradiction that carried it, are both gone: nothing is borrowed any more.
 *
 * The catalogue is inherited from the 2023 revision, which remains
 * code-for-code identical to it. The 2568 document does not split general
 * education into a university part and a faculty part the way the older
 * handouts do; it groups the same 30 credits by theme instead. The 21/9
 * buckets are kept here because they are what the credit categories are built
 * on, and the arithmetic is unchanged either way.
 *
 * PI574 is 3 credits and counts as a free elective. The document states both
 * at page 22: it names PI574 (3 credits, 0-6-3) as the faculty-taught course a
 * student may take toward the 6 free elective credits. The published study
 * plan leaves both free elective slots unnamed, so a student may fill one with
 * PI574 or not; either way the figures balance. PI574 previously sat outside
 * the 126 entirely (`excludedFromTotal`), a placement no source ever stated;
 * that inference is recorded, and was superseded, as the `pi574-outside-total`
 * contradiction. Free elective placement balances the same figures without
 * putting a course outside the degree: concentration-required stays 18 (the
 * six remaining 3-credit concentration courses), free elective is 6 credits,
 * major = 30 + 18 + 3 + 18 + 21 = 90, total = 30 + 90 + 6 = 126, all matching
 * the document's stated figures, including the 126 printed at page 4.
 */
import { SOURCES } from "./sources";
import { curriculum2564rev2566 } from "./2564-rev2566";
import type { Course, CreditCategory, CurriculumVersion, PlannedTerm } from "./types";

const courses: Course[] = curriculum2564rev2566.courses.value.map((course) =>
  course.code === "PI574" ? { ...course, credits: 3, category: "freeElective" } : course
);

const categories: CreditCategory[] = curriculum2564rev2566.categories.map((category) =>
  category.id === "concentrationRequired" ? { ...category, credits: 18 } : category
);

/**
 * Section 4.3.2.3, pages 53 to 55, รูปแบบที่ 1. Read straight from the
 * document rather than reused from an older version, because it differs from
 * both in ways that reusing would quietly lose: PI470 sits in Year 3 semester
 * 1 and the first free elective in Year 3 semester 2 (the 2564 handout has
 * these the other way round), PI270 sits in Year 2 semester 1 and PI280 in
 * semester 2 (again the reverse of the handout), the Year 2 summer term is not
 * marked optional, and there is no Year 3 summer term at all, PI574 having
 * become a free elective. The terms total 18 + 18 + 18 + 18 + 6 + 18 + 18 + 12
 * = 126, which is the graduation total; the Year 2 summer is load-bearing and
 * that is why it is not optional here.
 *
 * The placeholder ids and labels are the 2564 ones, so that a plan carried
 * between versions keeps its filled slots. Where the document writes only
 * วิชาโท (วิชาเลือก) for four minor elective slots, the split into "in your
 * minor" and "in other minors" follows the 2564 handout, which distinguishes
 * them in the same four positions and matches the 6 + 6 credit requirement.
 */
const recommendedPlan: PlannedTerm[] = [
  {
    term: { year: 1, kind: "semester1" },
    optional: false,
    entries: [
      { kind: "course", code: "TU100" },
      { kind: "course", code: "TU101" },
      { kind: "course", code: "LAS101" },
      { kind: "course", code: "EL105" },
      { kind: "course", code: "TU106" },
      { kind: "course", code: "PI121" },
    ],
  },
  {
    term: { year: 1, kind: "semester2" },
    optional: false,
    entries: [
      { kind: "course", code: "TU102" },
      { kind: "course", code: "TU103" },
      { kind: "course", code: "PI122" },
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
  {
    term: { year: 2, kind: "semester1" },
    optional: false,
    entries: [
      { kind: "course", code: "PI210" },
      { kind: "course", code: "PI241" },
      { kind: "course", code: "PI270" },
      { kind: "course", code: "PI282" },
      { kind: "course", code: "PI291" },
      { kind: "course", code: "EE210" },
    ],
  },
  {
    term: { year: 2, kind: "semester2" },
    optional: false,
    entries: [
      { kind: "course", code: "PI272" },
      { kind: "course", code: "PI280" },
      { kind: "course", code: "PI292" },
      { kind: "course", code: "PI321" },
      { kind: "course", code: "PI370" },
      {
        kind: "placeholder",
        id: "approachesElective1",
        label: {
          en: "Elective course in concentration (Approaches and Issues Group) 1",
          th: "วิชาเลือกในสาขา (กลุ่มแนวทางและประเด็นศึกษา) 1",
        },
        category: "concentrationElectiveApproaches",
      },
    ],
  },
  {
    term: { year: 2, kind: "summer" },
    optional: false,
    entries: [
      {
        kind: "placeholder",
        id: "minorElective1",
        label: { en: "Minor elective course 1", th: "วิชาโท วิชาเลือก 1" },
        category: "minorElective",
      },
      {
        kind: "placeholder",
        id: "minorElectiveOther1",
        label: {
          en: "Minor elective course in other minors 1",
          th: "วิชาเลือกในวิชาโทอื่น 1",
        },
        category: "minorElectiveOther",
      },
    ],
  },
  {
    term: { year: 3, kind: "semester1" },
    optional: false,
    entries: [
      { kind: "course", code: "PI300" },
      { kind: "course", code: "PI390" },
      { kind: "course", code: "PI470" },
      {
        kind: "placeholder",
        id: "minorRequired1",
        label: { en: "Minor required course 1", th: "วิชาโท วิชาบังคับ 1" },
        category: "minorRequired",
      },
      {
        kind: "placeholder",
        id: "minorRequired2",
        label: { en: "Minor required course 2", th: "วิชาโท วิชาบังคับ 2" },
        category: "minorRequired",
      },
      {
        kind: "placeholder",
        id: "areaElective1",
        label: {
          en: "Elective course in concentration (Area Studies Group) 1",
          th: "วิชาเลือกในสาขา (กลุ่มอาณาบริเวณศึกษา) 1",
        },
        category: "concentrationElectiveArea",
      },
    ],
  },
  {
    term: { year: 3, kind: "semester2" },
    optional: false,
    entries: [
      { kind: "course", code: "PI320" },
      {
        kind: "placeholder",
        id: "minorRequired3",
        label: { en: "Minor required course 3", th: "วิชาโท วิชาบังคับ 3" },
        category: "minorRequired",
      },
      {
        kind: "placeholder",
        id: "minorElective2",
        label: { en: "Minor elective course 2", th: "วิชาโท วิชาเลือก 2" },
        category: "minorElective",
      },
      {
        kind: "placeholder",
        id: "areaElective2",
        label: {
          en: "Elective course in concentration (Area Studies Group) 2",
          th: "วิชาเลือกในสาขา (กลุ่มอาณาบริเวณศึกษา) 2",
        },
        category: "concentrationElectiveArea",
      },
      {
        kind: "placeholder",
        id: "approachesElective2",
        label: {
          en: "Elective course in concentration (Approaches and Issues Group) 2",
          th: "วิชาเลือกในสาขา (กลุ่มแนวทางและประเด็นศึกษา) 2",
        },
        category: "concentrationElectiveApproaches",
      },
      {
        kind: "placeholder",
        id: "freeElective1",
        label: { en: "Free elective course 1", th: "วิชาเลือกเสรี 1" },
        category: "freeElective",
      },
    ],
  },
  {
    term: { year: 4, kind: "semester1" },
    optional: false,
    entries: [
      {
        kind: "placeholder",
        id: "areaElective3",
        label: {
          en: "Elective course in concentration (Area Studies Group) 3",
          th: "วิชาเลือกในสาขา (กลุ่มอาณาบริเวณศึกษา) 3",
        },
        category: "concentrationElectiveArea",
      },
      {
        kind: "placeholder",
        id: "approachesElective3",
        label: {
          en: "Elective course in concentration (Approaches and Issues Group) 3",
          th: "วิชาเลือกในสาขา (กลุ่มแนวทางและประเด็นศึกษา) 3",
        },
        category: "concentrationElectiveApproaches",
      },
      {
        kind: "placeholder",
        id: "minorElectiveOther2",
        label: {
          en: "Minor elective course in other minors 2",
          th: "วิชาเลือกในวิชาโทอื่น 2",
        },
        category: "minorElectiveOther",
      },
      {
        kind: "placeholder",
        id: "freeElective2",
        label: { en: "Free elective course 2", th: "วิชาเลือกเสรี 2" },
        category: "freeElective",
      },
    ],
  },
];

export const curriculum2568: CurriculumVersion = {
  id: "2568",
  label: { en: "Curriculum 2025 (B.E. 2568)", th: "หลักสูตร พ.ศ. 2568" },
  cohorts: [
    { code: "68", provenance: { kind: "document", source: "comparison2568", page: 1 } },
    { code: "69", provenance: { kind: "document", source: "comparison2568", page: 1 } },
  ],
  graduationCredits: { value: 126, derivation: { kind: "published", source: "comparison2568" } },
  categories,
  minors: curriculum2564rev2566.minors,
  courses: { value: courses, derivation: { kind: "published", source: "comparison2568" } },
  recommendedPlan: {
    value: recommendedPlan,
    derivation: { kind: "published", source: "comparison2568" },
  },
  rules: curriculum2564rev2566.rules,
  distinguishingCourses: curriculum2564rev2566.distinguishingCourses,
  verification: {
    verifiedBy: null,
    verifiedOn: null,
    sources: [
      SOURCES.comparison2568,
      SOURCES.bir64rev66,
      SOURCES.handbook2021,
      SOURCES.classSchedule2568Year1,
    ],
    // `no-2568-study-plan` was deleted on 2026-08-02 rather than suppressed,
    // because it had become a false statement about the source rather than a
    // true statement not worth surfacing: it said the document contains no
    // sample study plan, and the document contains one, at section 4.3.2.3,
    // pages 53 to 55. `catalogue-identical` stays: the catalogue really is
    // code-for-code identical to the 2023 revision's, so no course code tells
    // a cohort-66 student from a cohort-68 one on the confirm screen.
    contradictions: [
      {
        id: "catalogue-identical",
        summary:
          "The 2568 catalogue is code-for-code identical to 2564, so no course code distinguishes cohort 66 from cohort 68 on the confirm screen.",
        disclosure: null,
      },
      {
        id: "year1-order-differs-from-schedule",
        summary:
          "The published plan puts LAS101 in Year 1 semester 1 and TU103 in semester 2. The BIR class schedule for Semester 1/2025 and the registration record for Semester 2/2568, supplied by BIRSA for real cohort 68 students, have those two the other way round. The published plan is followed here because it is the curriculum's own document. Nothing a student sees changes: both terms are the same six courses across the year and 18 credits either way, and both handouts state in terms that TU, EL and LAS courses may be arranged differently each semester depending on exemption results. No disclosure.",
        disclosure: null,
      },
      {
        id: "economics-course-code",
        summary:
          "The document writes the Faculty of Economics course as EC210 in six places and EE210 in three, for the same Thai code ศ.210. EE210 is carried here because it is what the BIR handouts and the Student Handbook print consistently, and because it is the code a student's own transcript from the earlier versions uses. Worth asking the faculty to settle.",
        disclosure: null,
      },
    ],
  },
};
