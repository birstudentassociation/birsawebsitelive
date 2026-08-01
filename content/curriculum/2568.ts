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
  minors: curriculum2564rev2566.minors,
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
