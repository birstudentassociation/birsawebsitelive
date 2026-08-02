/**
 * What the service actually checks, and the only place it makes a judgement.
 *
 * Findings never block. A student may plan something the rules disallow;
 * the service says so, cites the provision, and leaves the decision with
 * them. Three things are deliberately not checked: whether
 * a course runs in the term it was placed in, anything at the Dean's or an
 * advisor's discretion, and anything depending on GPA.
 */
import type { CurriculumVersion, LocalizedText, TermRef } from "@/content/curriculum";
import type { StudyPlan } from "./plan";
import { planTotals, remainingRequirements, termIndex } from "./derive";

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

  // Completion.
  const { allCodes, totalFreeElectiveCredits } = planTotals(plan);
  const shortfalls = remainingRequirements(version, allCodes, plan.minorId, totalFreeElectiveCredits);
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
    .filter((t) => t.codes.length > 0 || t.freeElectiveCredits > 0)
    .sort((a, b) => termIndex(a.term) - termIndex(b.term));
  return terms.at(-1)?.term ?? null;
}
