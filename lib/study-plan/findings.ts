/**
 * What the service actually checks, and the only place it makes a judgement.
 *
 * Findings never block. A student may plan something the rules disallow;
 * the service says so, cites the provision, and leaves the decision with
 * them. Three things are deliberately not checked: whether
 * a course runs in the term it was placed in, anything at the Dean's or an
 * advisor's discretion, and anything depending on GPA. The one thing that
 * comes near the first is the `offering` note, which reports where a course
 * has been recorded as taught and never says where it will run.
 *
 * The term-level notes (`examLoad`, `offering`) and the `deferral` warning rest
 * on the course catalogue, so `checkPlan` takes the lookups as an optional
 * third argument. The defaults read the catalogue; a test, or a caller that
 * also holds published reviews, supplies its own.
 */
import type { CurriculumVersion, LocalizedText, TermRef } from "@/content/curriculum";
import type { AssessmentFacts } from "@/content/course-review/types";
import {
  HISTORY_COPY,
  describeTerms,
  offeringHistory,
  recordedInKind,
  type OfferingHistory,
} from "@/lib/courses/offeringHistory";
import {
  EXAM_HEAVY_TERM_COUNT,
  EXAM_HEAVY_WEIGHT,
  PROFILE_COPY,
  catalogueAssessmentFacts,
  describeRecordedTerm,
  stacksExams,
  termAssessmentProfile,
} from "./assessmentProfile";
import type { StudyPlan } from "./plan";
import {
  isInternshipSummer,
  planTotals,
  projectedGraduation,
  remainingRequirements,
  termIndex,
} from "./derive";
import { deferralsOnCriticalPath } from "./whatIf";

/** Where the term-level findings read the catalogue from. */
export type FindingSources = {
  assessmentFacts?: (code: string) => AssessmentFacts | undefined;
  offeringHistory?: (code: string) => OfferingHistory | null;
};

export type Finding = {
  /** Stable id so a test can name one finding without matching on copy. */
  id: string;
  severity: "problem" | "warning" | "note";
  message: LocalizedText;
  source: { document: string; provision: string };
};

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

export function checkPlan(
  version: CurriculumVersion,
  plan: StudyPlan,
  sources: FindingSources = {}
): Finding[] {
  const assessmentFacts = sources.assessmentFacts ?? catalogueAssessmentFacts;
  const historyOf = sources.offeringHistory ?? ((code: string) => offeringHistory(code));
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
    if (term.codes.length === 0 && term.freeElectiveCredits === 0) continue;
    const credits =
      term.codes.reduce((n, code) => n + (byCode.get(code)?.credits ?? 0), 0) +
      term.freeElectiveCredits;
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

  // The internship rule (a summer holding PI574 holds nothing else, see
  // `isInternshipSummer` / `clearInternshipSummers` in derive.ts) is enforced
  // going forward by `redirectToPlan` in actions.ts, on every mutation. It is
  // not enforced retroactively: a plan carried in from localStorage or a URL
  // made before this rule existed, or a plan a caller builds without going
  // through that action, can still be in the polluted state on first render.
  // This service tells the student rather than silently rewriting a plan
  // under them (see this module's own header), so a warning fires here
  // instead of the plan being corrected behind their back.
  for (const term of terms) {
    if (!isInternshipSummer(version, term)) continue;
    const hasOtherCourses = term.codes.some((code) => byCode.get(code)?.internship !== true);
    const hasFreeElectiveCredits = term.freeElectiveCredits > 0;
    if (!hasOtherCourses && !hasFreeElectiveCredits) continue;
    findings.push({
      id: `internshipSummer:${term.term.year}-${term.term.kind}`,
      severity: "warning",
      message: {
        en: `The internship takes up the whole of ${termLabel(term.term).en}. You have other courses or free elective credits placed there too; the internship is the whole term, so nothing else belongs alongside it.`,
        th: `การฝึกงานใช้เวลาทั้งภาคการศึกษาของ${termLabel(term.term).th} ท่านมีรายวิชาอื่นหรือหน่วยกิตวิชาเลือกเสรีจัดไว้ในภาคเดียวกันด้วย เนื่องจากการฝึกงานถือเป็นภาคการศึกษาทั้งหมด จึงไม่ควรมีรายวิชาอื่นควบคู่ไปด้วย`,
      },
      source: curriculumSource,
    });
  }

  // Exam load. A term that stacks several courses with a heavy final exam is
  // worth knowing about before registering. It rests only on courses with
  // recorded facts, so the courses with none are named: the real count may be
  // higher, never lower. The source cites the recorded term the facts are for.
  for (const term of terms) {
    const profile = termAssessmentProfile(term.codes, assessmentFacts);
    if (!stacksExams(profile)) continue;
    const label = termLabel(term.term);
    const heavy = profile.examHeavy.map((e) => `${e.code} (${e.weight}%)`).join(", ");
    const recordedFor = (locale: "en" | "th") =>
      profile.recordedTerms
        .map((recorded) => describeRecordedTerm(recorded, locale, PROFILE_COPY[locale]))
        .join(locale === "en" ? "; " : " ");
    const missing = profile.unknown.join(", ");
    findings.push({
      id: `examLoad:${term.term.year}-${term.term.kind}`,
      severity: "note",
      message: {
        en: `${label.en} has ${profile.examHeavy.length} courses with a final exam worth ${EXAM_HEAVY_WEIGHT}% or more of the grade (${heavy}).${
          profile.unknown.length > 0
            ? ` Nothing is on record for ${missing}, so there may be more.`
            : ""
        } This is only a note, and the weights are those recorded for ${recordedFor("en")}.`,
        th: `${label.th}มีรายวิชาที่สอบปลายภาคคิดเป็นร้อยละ ${EXAM_HEAVY_WEIGHT} ขึ้นไปของคะแนนรวมถึง ${profile.examHeavy.length} วิชา (${heavy})${
          profile.unknown.length > 0
            ? ` ส่วนวิชา ${missing} ยังไม่มีข้อมูลการวัดผล จึงอาจมีมากกว่านี้`
            : ""
        } ข้อความนี้เป็นเพียงข้อสังเกต และสัดส่วนคะแนนเป็นข้อมูลของ${recordedFor("th")}`,
      },
      source: {
        document: "Course catalogue, assessment facts",
        provision: `Recorded for ${recordedFor("en")}; at least ${EXAM_HEAVY_TERM_COUNT} courses with a final exam of ${EXAM_HEAVY_WEIGHT}% or more`,
      },
    });
  }

  // Offering history. Only for a course with any history at all: a course
  // with no recorded term tells us nothing, and silence there is not a signal.
  // Reported as history ("has not been recorded"), never as "will not run".
  for (const term of terms) {
    for (const code of term.codes) {
      const history = historyOf(code);
      if (!history || recordedInKind(history, term.term.kind)) continue;
      const label = termLabel(term.term);
      const recorded = (locale: "en" | "th") =>
        describeTerms(history, locale, HISTORY_COPY[locale]);
      findings.push({
        id: `offering:${code}`,
        severity: "note",
        message: {
          en: `${code} is in ${label.en}. It has only been recorded as taught in ${recorded("en")}, and never in a ${HISTORY_COPY.en[term.term.kind]} term. That is history, not a promise, and a term may be missing only because nobody recorded it. Check the faculty timetable before you register.`,
          th: `วิชา ${code} อยู่ในแผนของ${label.th} แต่เคยมีบันทึกว่าเปิดสอนเฉพาะใน${recorded("th")} และไม่เคยมีบันทึกว่าเปิดใน${HISTORY_COPY.th[term.term.kind]} ข้อมูลนี้เป็นเพียงประวัติ ไม่ใช่คำยืนยัน และภาคที่ไม่ปรากฏอาจเป็นเพราะยังไม่มีผู้บันทึก โปรดตรวจสอบตารางสอนของคณะก่อนลงทะเบียน`,
        },
        source: {
          document: "Course catalogue, student review and assessment fact terms",
          provision: `Recorded as taught in ${recorded("en")}; derived history, not an offering promise`,
        },
      });
    }
  }

  // Deferrals. A course the plan holds later than the recommended plan does,
  // on a prerequisite chain that runs to the last planned term, while the plan
  // graduates later than the recommended plan does.
  for (const deferral of deferralsOnCriticalPath(version, plan)) {
    const where = termLabel(deferral.planned);
    const recommended = termLabel(deferral.recommended);
    const graduation = termLabel(deferral.graduation);
    const recommendedGraduation = termLabel(deferral.recommendedGraduation);
    findings.push({
      id: `deferral:${deferral.code}`,
      severity: "warning",
      message: {
        en: `${deferral.code} is in ${where.en}, later than the recommended plan, which has it in ${recommended.en}. Courses that need it follow it, and that chain runs to your last term, so any delay here moves graduation. This plan graduates in ${graduation.en}, where the recommended plan finishes in ${recommendedGraduation.en}.`,
        th: `วิชา ${deferral.code} อยู่ใน${where.th} ซึ่งช้ากว่าแผนที่แนะนำที่จัดไว้ใน${recommended.th} วิชาที่ต้องใช้วิชานี้เป็นพื้นฐานต้องเรียนตามหลัง และลำดับวิชาเหล่านี้ต่อเนื่องไปถึงภาคสุดท้ายของแผน การเลื่อนวิชานี้จึงทำให้สำเร็จการศึกษาช้าลง แผนนี้จบใน${graduation.th} ขณะที่แผนที่แนะนำจบใน${recommendedGraduation.th}`,
      },
      source: curriculumSource,
    });
  }

  // Completion.
  const { allCodes, totalFreeElectiveCredits } = planTotals(plan);
  const shortfalls = remainingRequirements(
    version,
    allCodes,
    plan.minorId,
    totalFreeElectiveCredits
  );
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

// Lives in derive.ts so `whatIf` can use it without importing this module,
// which imports `whatIf` for the deferral finding. Re-exported because this is
// where callers have always found it.
export { projectedGraduation };
