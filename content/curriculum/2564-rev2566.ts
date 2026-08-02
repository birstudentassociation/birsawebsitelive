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

const REPLACED = new Set(["TU050", "TU104", "TU105", "PI131", "PI132"]);

const newGenEd: Course[] = [
  { code: "EL105", title: "English Communication Skills", credits: 3, category: "genEdPart1", prerequisites: [] },
  { code: "LAS101", title: "Critical Thinking, Reading and Writing", credits: 3, category: "genEdPart1", prerequisites: [] },
  { code: "AH208", title: "Exercise for Good Health and Well-Being", credits: 3, category: "genEdPart2", prerequisites: [] },
  { code: "EL295", title: "Academic English and Study Skill 1", credits: 3, category: "genEdPart2", prerequisites: [] },
];

const courses: Course[] = [
  ...curriculum2564.courses.value.filter((c) => !REPLACED.has(c.code)),
  ...newGenEd,
];

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
      { kind: "course", code: "PI121" },
    ],
  },
  {
    term: { year: 1, kind: "semester2" },
    optional: false,
    entries: [
      { kind: "course", code: "TU102" },
      { kind: "course", code: "LAS101" },
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
  minors: curriculum2564.minors,
  courses: { value: courses, derivation: { kind: "published", source: "bir64rev66" } },
  recommendedPlan: {
    value: recommendedPlan,
    derivation: { kind: "published", source: "bir64rev66" },
  },
  rules: curriculum2564.rules,
  // PI121 is not a distinguishing course here: the 2564 base version also
  // has it, so it would tell a student nothing on the confirm screen. AH208
  // is the one that actually separates this revision from 2564, which offers
  // PI131/PI132 in that slot instead.
  distinguishingCourses: ["EL105", "LAS101", "AH208"],
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
        // Cohort 66's mapping to this version IS printed (BIR_64_rev66.pdf,
        // page 1); telling a cohort-66 student that "no published document"
        // covers their cohort would be false for them, and noise on the one
        // screen whose entire purpose is to be worth reading.
        cohorts: ["67"],
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
