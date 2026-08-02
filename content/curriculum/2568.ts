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
 * PI574 moved to 3 credits from this version. The comparison document does
 * not state this value; the crawl of `comparison2568` could not resolve
 * whether PI574 was 1 or 3 credits, and the 3-credit figure comes from
 * BIRSA directly, attested on 2026-08-01, exactly like the cohort 69
 * mapping. `courses.derivation` below is still `published`, because the
 * catalogue as a whole comes from the document; PI574's credit value is the
 * one course-level fact inside it that does not, and that gap is disclosed
 * as its own contradiction (`pi574-credits-attested`) rather than left
 * implicit in this comment.
 *
 * PI574 is now counted as a free elective, on BIRSA's instruction on
 * 2026-08-02. It previously sat outside the 126 entirely
 * (`excludedFromTotal`), a placement no source ever stated; it was an
 * inference made because it was the only way the stated figures balanced.
 * That inference is recorded, and was superseded, as the
 * `pi574-outside-total` contradiction. Free elective placement balances the
 * same figures without putting a course outside the degree: concentration-
 * required stays 18 (the six remaining 3-credit concentration courses),
 * free elective is 6 credits of which PI574 supplies 3 and the student
 * chooses the other 3, and major = 30 + 18 + 3 + 18 + 21 = 90, total =
 * 30 + 90 + 6 = 126, both matching the document's stated figures. The
 * 3-credit value itself is still attested rather than published, so
 * `pi574-credits-attested` remains.
 */
import { SOURCES } from "./sources";
import { curriculum2564rev2566 } from "./2564-rev2566";
import type { Course, CreditCategory, CurriculumVersion } from "./types";

const courses: Course[] = curriculum2564rev2566.courses.value.map((course) =>
  course.code === "PI574" ? { ...course, credits: 3, category: "freeElective" } : course
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
      suppressed: {
        reason:
          "Year 1 was verified on 2026-08-02 against real cohort 68 records: the BIR class schedule for Semester 1/2025 and the registration record for Semester 2/2568. Both matched the borrowed sequence exactly. Years 2 to 4 remain borrowed from the 2023 revision with no evidence either way. BIRSA instructed that the borrowed-study-plan notice be removed for cohorts 68 and 69.",
        by: "BIRSA",
        on: "2026-08-02",
      },
    },
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
    contradictions: [
      {
        id: "no-2568-study-plan",
        summary:
          "The 2568 comparison document contains no sample study plan; the sequence is borrowed from the 2023 revision. Year 1 is now verified against the BIR class schedule for Semester 1/2025 and the registration record for Semester 2/2568, and matched the borrowed sequence exactly. Years 2 to 4 remain borrowed from the 2023 revision with no evidence either way. The student-facing disclosure was removed on BIRSA's instruction on 2026-08-02; see recommendedPlan.derivation.suppressed.",
        disclosure: null,
      },
      {
        id: "pi574-credits-attested",
        summary:
          "PI574's 3-credit value for this version is attested by BIRSA on 2026-08-01 and is stated in no source document. The 2568 comparison document is silent on the point. PI574 now counts as a free elective (attested 2026-08-02), which resolves where it sits, but not what it is worth.",
        disclosure: {
          en: "The 3-credit value for PI574 Internship is not printed in your curriculum document. BIRSA has told us this is correct for your year. Check it with your advisor before you count on it.",
          th: "เอกสารหลักสูตรของท่านมิได้ระบุค่า 3 หน่วยกิตของวิชา PI574 การฝึกงานไว้ BIRSA แจ้งว่าค่านี้ถูกต้องสำหรับรุ่นของท่าน โปรดตรวจสอบกับอาจารย์ที่ปรึกษาก่อนนำไปใช้อ้างอิง",
        },
      },
      {
        id: "catalogue-identical",
        summary:
          "The 2568 catalogue is code-for-code identical to 2564, so no course code distinguishes cohort 66 from cohort 68 on the confirm screen.",
        disclosure: null,
      },
      {
        id: "cohort-69-attested",
        summary:
          "Cohort 69 following this version is attested by BIRSA on 2026-08-01 and printed in no document.",
        disclosure: {
          en: "No published document says which curriculum cohort 69 follows. BIRSA has told us it is this one. If you started in 2569 (2026), check with the Registrar's Office before relying on this plan.",
          th: "ไม่มีเอกสารเผยแพร่ระบุว่านักศึกษารหัส 69 ใช้หลักสูตรใด BIRSA แจ้งว่าเป็นหลักสูตรนี้ หากท่านเข้าศึกษาในปีการศึกษา 2569 โปรดตรวจสอบกับสำนักงานทะเบียนก่อนใช้แผนนี้",
        },
        // Cohort 68's mapping to this version IS printed (comparison2568,
        // page 1); telling a cohort-68 student that "no published document"
        // covers their cohort would be false for them, and noise on the one
        // screen whose entire purpose is to be worth reading.
        cohorts: ["69"],
      },
    ],
  },
};
