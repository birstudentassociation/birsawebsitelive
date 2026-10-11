import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import type { StudentReview } from "@/content/course-review/types";
import {
  HISTORY_COPY,
  OFFERING_HISTORY_NOTICE,
  historyLine,
  offeringHistory,
  recordedInKind,
  type OfferingHistory,
} from "@/lib/courses/offeringHistory";
import { checkPlan } from "@/lib/study-plan/findings";
import type { StudyPlan } from "@/lib/study-plan/plan";

const review = (year: number, semester: 1 | 2 | "summer", sample = false): StudentReview => ({
  sample,
  reviewCount: 6,
  term: { year, semester },
  workload: { en: "w", th: "w" },
  assessmentStyle: { en: "a", th: "a" },
  tips: [],
});

describe("offeringHistory", () => {
  it("is derived from the term of a course's assessment facts", () => {
    const history = offeringHistory("PI390");
    expect(history?.terms).toEqual([{ year: 2569, semester: 1 }]);
    expect(history?.yearsByKind).toEqual({ semester1: [2569], semester2: [], summer: [] });
  });

  it("is null when nothing is recorded, and for codes the catalogue does not hold", () => {
    expect(offeringHistory("PI211")).toBeNull();
    expect(offeringHistory("TU104")).toBeNull();
    expect(offeringHistory("ZZ999")).toBeNull();
  });

  it("ignores sample reviews, which are demonstration content", () => {
    // PI121 carries only a sample review.
    expect(offeringHistory("PI121")).toBeNull();
  });

  it("counts published reviews passed as the extra input, and counts a repeated term once", () => {
    const history = offeringHistory("PI390", [
      review(2567, 1),
      review(2568, 2),
      review(2569, 1),
      review(2566, 1, true),
    ]);
    expect(history?.terms).toEqual([
      { year: 2567, semester: 1 },
      { year: 2568, semester: 2 },
      { year: 2569, semester: 1 },
    ]);
    expect(history?.yearsByKind).toEqual({
      semester1: [2567, 2569],
      semester2: [2568],
      summer: [],
    });
  });

  it("can start a history from published reviews alone", () => {
    expect(offeringHistory("PI121", [review(2568, "summer")])?.yearsByKind.summer).toEqual([2568]);
  });
});

describe("describing a history", () => {
  const history: OfferingHistory = {
    code: "X",
    terms: [],
    yearsByKind: { semester1: [2566, 2567], semester2: [], summer: [2568] },
  };

  it("lists the years for each term kind", () => {
    expect(historyLine(history, "th", HISTORY_COPY.th)).toBe(
      "เคยมีบันทึกว่าเปิดสอนในภาคเรียนที่ 1 ปีการศึกษา 2566 และ 2567 และ ภาคฤดูร้อน ปีการศึกษา 2568"
    );
    expect(historyLine(history, "en", HISTORY_COPY.en)).toBe(
      "Recorded as taught in semester 1 of 2023/24 and 2024/25 and summer of 2025/26"
    );
  });

  it("says whether a kind of term has ever been recorded", () => {
    expect(recordedInKind(history, "semester1")).toBe(true);
    expect(recordedInKind(history, "semester2")).toBe(false);
  });
});

describe("the offering note", () => {
  const planIn = (kind: "semester1" | "semester2" | "summer"): StudyPlan => ({
    versionId: "2564-rev2566",
    cohort: "66",
    startYear: 2566,
    minorId: "governance",
    passed: ["PI271"],
    freeElectiveCreditsPassed: 0,
    terms: [{ term: { year: 3, kind }, codes: ["PI390", "PI211"], freeElectiveCredits: 0 }],
  });
  const version = CURRICULUM_VERSIONS["2564-rev2566"];
  const offering = (plan: StudyPlan) =>
    checkPlan(version, plan).filter((f) => f.id.startsWith("offering:"));

  it("notes a course planned in a term kind it has never been recorded in", () => {
    const [finding, ...rest] = offering(planIn("semester2"));
    expect(rest).toEqual([]);
    expect(finding?.id).toBe("offering:PI390");
    expect(finding?.severity).toBe("note");
    expect(finding?.message.en).toContain("only been recorded as taught in semester 1 of 2026/27");
    expect(finding?.message.en).toContain("not a promise");
    expect(finding?.message.th).toContain("ไม่ใช่คำยืนยัน");
    expect(finding?.source.provision).toContain("not an offering promise");
  });

  it("is quiet in a term kind the course has been recorded in", () => {
    expect(offering(planIn("semester1"))).toEqual([]);
  });

  it("is quiet for a course with no history at all, however it is placed", () => {
    // PI211 has no recorded history, so planning it anywhere says nothing.
    expect(offering(planIn("summer")).map((f) => f.id)).toEqual(["offering:PI390"]);
  });

  it("uses the history a caller supplies, so published reviews can be added without changing it", () => {
    const supplied = checkPlan(version, planIn("semester2"), {
      offeringHistory: (code) => offeringHistory(code, [review(2568, 2)]),
    });
    expect(supplied.some((f) => f.id === "offering:PI390")).toBe(false);
  });
});

describe("disclosure", () => {
  it("says in both languages that this is history and not a promise", () => {
    expect(OFFERING_HISTORY_NOTICE.en).toContain("history, not a promise");
    expect(OFFERING_HISTORY_NOTICE.th).toMatch(/[฀-๿]/);
  });

  it("is rendered wherever a history is shown", () => {
    const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), "utf8");
    for (const file of [
      "app/[lang]/student-life/course-reviews/[code]/page.tsx",
      "app/[lang]/services/study-plan/plan/page.tsx",
    ]) {
      expect(read(file), file).toContain("OFFERING_HISTORY_NOTICE");
    }
  });
});
