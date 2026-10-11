/**
 * The plain-text plan summary attached to a question for Academic Affairs.
 * It says what the plan screen says (courses by term, what was found, the
 * curriculum and the minor), leaves out what the question does not need, fits
 * the draft cookie that carries it, and reads as a person's text in both
 * languages.
 */
import { describe, expect, it } from "vitest";
import { buildPlanOutreachCopy } from "@/components/study-plan/planOutreachCopy";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import { checkPlan } from "@/lib/study-plan/findings";
import type { StudyPlan } from "@/lib/study-plan/plan";
import { PLAN_SUMMARY_LIMIT, planSummaryText } from "@/lib/study-plan/summaryText";

const labels = (locale: "en" | "th") => buildPlanOutreachCopy(locale).summary;

/** PI300 needs PI211 passed first, and it is not, so the plan has a prerequisite finding. */
const plan: StudyPlan = {
  versionId: "2568",
  cohort: "68",
  startYear: 2568,
  minorId: "governance",
  passed: ["PI121", "PI122"],
  freeElectiveCreditsPassed: 3,
  terms: [
    { term: { year: 3, kind: "semester2" }, codes: ["PI376"], freeElectiveCredits: 3 },
    { term: { year: 2, kind: "semester1" }, codes: ["PI300", "PI364"], freeElectiveCredits: 0 },
    { term: { year: 2, kind: "summer" }, codes: [], freeElectiveCredits: 0 },
  ],
};

describe("planSummaryText", () => {
  const text = planSummaryText(plan, "en", labels("en"));

  it("names the curriculum and the minor", () => {
    expect(text).toContain(`Curriculum: ${CURRICULUM_VERSIONS["2568"].label.en}`);
    expect(text).toContain("Minor: Governance");
  });

  it("lists the courses in each planned term, earliest first, with credits", () => {
    const lines = text.split("\n");
    const second = lines.findIndex((l) => l.startsWith("Year 2, Semester 1:"));
    const third = lines.findIndex((l) => l.startsWith("Year 3, Semester 2:"));
    expect(second).toBeGreaterThan(-1);
    expect(third).toBeGreaterThan(second);
    expect(lines[second]).toMatch(/^Year 2, Semester 1: PI300, PI364 \(\d+ credits\)$/);
    expect(lines[third]).toMatch(
      /^Year 3, Semester 2: PI376, 3 free elective credits \(\d+ credits\)$/
    );
  });

  it("leaves out a term with nothing in it", () => {
    expect(text).not.toContain("Summer");
  });

  it("says what the service found, worst first, in the words of the plan screen", () => {
    const findings = checkPlan(CURRICULUM_VERSIONS["2568"], plan);
    expect(findings.length).toBeGreaterThan(0);
    expect(text).toContain("What the service found");
    for (const finding of findings) {
      expect(text).toContain(finding.message.en);
    }
    const problem = text.indexOf("- Problem:");
    const note = text.indexOf("- Note:");
    if (problem !== -1 && note !== -1) expect(problem).toBeLessThan(note);
  });

  it("leaves out the cohort and the courses already passed", () => {
    expect(text).not.toMatch(/cohort/i);
    // "2568" appears once, as the curriculum's own name, and nowhere else.
    expect(text.match(/2568/g)).toHaveLength(1);
    expect(text).not.toContain("PI121");
    expect(text).not.toContain("PI122");
  });

  it("says there is nothing to flag when there is nothing", () => {
    const clean: StudyPlan = { ...plan, passed: ["PI211"], terms: [] };
    const summary = planSummaryText(clean, "en", labels("en"));
    expect(summary).toContain("No courses are planned yet.");
    expect(summary).toMatch(/What the service found\n(Nothing to flag\.|- )/);
  });

  it("is plain text: no markup, no tabs, no em dashes", () => {
    expect(text).not.toMatch(/[<>]|\t|—/);
  });
});

describe("planSummaryText in Thai", () => {
  const text = planSummaryText(plan, "th", labels("th"));

  it("is written in Thai, with Thai term names, minor and findings", () => {
    expect(text).toContain("สรุปแผนการศึกษา");
    expect(text).toContain("วิชาโท: ");
    expect(text).toMatch(/ชั้นปีที่ 2 ภาคเรียนที่ 1|ปีที่ 2, ภาคเรียนที่ 1/);
    expect(text).toContain("หน่วยกิต");
    for (const finding of checkPlan(CURRICULUM_VERSIONS["2568"], plan)) {
      expect(text).toContain(finding.message.th);
    }
  });

  it("is not the English summary", () => {
    expect(text).not.toContain("Curriculum:");
    expect(text).not.toContain("What the service found");
  });
});

describe("planSummaryText and its limit", () => {
  /** A plan that produces many findings: every course in a term it cannot be in. */
  const heavy: StudyPlan = {
    ...plan,
    terms: Array.from({ length: 8 }, (_, i) => ({
      term: {
        year: 1 + Math.floor(i / 2),
        kind: i % 2 === 0 ? ("semester1" as const) : ("semester2" as const),
      },
      codes: ["PI300", "PI320", "PI321", "PI390", "PI470", "PI370", "PI364", "PI365"],
      freeElectiveCredits: 0,
    })),
  };

  it("stays within the limit that fits the draft cookie", () => {
    for (const locale of ["en", "th"] as const) {
      const text = planSummaryText(heavy, locale, labels(locale));
      expect(text.length, locale).toBeLessThanOrEqual(PLAN_SUMMARY_LIMIT);
    }
  });

  it("drops findings, not courses, to fit, and says how many it left out", () => {
    const text = planSummaryText(heavy, "en", labels("en"));
    for (const term of ["Year 1, Semester 1:", "Year 4, Semester 2:"]) {
      expect(text).toContain(term);
    }
    expect(text).toMatch(/\n\d+ more findings are on the plan screen\.$/);
  });

  it("honours a smaller limit and marks a summary that had to be cut short", () => {
    const text = planSummaryText(heavy, "en", labels("en"), 300);
    expect(text.length).toBeLessThanOrEqual(300);
    expect(text.endsWith(labels("en").truncated)).toBe(true);
  });

  it("is under the limit the contact form accepts for it", () => {
    expect(PLAN_SUMMARY_LIMIT).toBeLessThan(2500);
  });
});
