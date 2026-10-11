import { describe, expect, it } from "vitest";
import { CURRICULUM_VERSIONS, type TermRef } from "@/content/curriculum";
import type { StudentReview } from "@/content/course-review/types";
import type { OfferingHistory } from "@/lib/courses/offeringHistory";
import type { StudyPlan } from "@/lib/study-plan/plan";
import { compareEntries, shortlistForSlot } from "@/lib/study-plan/shortlist";
import { suggestForTerm, type OpenSlot, type SuggestedCourse } from "@/lib/study-plan/suggest";

const version = CURRICULUM_VERSIONS["2568"];

const plan: StudyPlan = {
  versionId: "2568",
  cohort: "66",
  startYear: 2566,
  minorId: "governance",
  passed: ["PI121", "PI122", "PI271"],
  freeElectiveCreditsPassed: 0,
  terms: [],
};

/** A candidate as `suggestForTerm` would hand it over, for a slot a test builds itself. */
function candidate(code: string, patch: Partial<SuggestedCourse> = {}): SuggestedCourse {
  return {
    code,
    title: code,
    credits: 3,
    bucket: "core",
    recommendedHere: false,
    missingPrerequisites: [],
    ...patch,
  };
}

const slotOf = (candidates: SuggestedCourse[], patch: Partial<OpenSlot> = {}): OpenSlot => ({
  id: "core1",
  label: { en: "A core course", th: "วิชาแกน" },
  category: "core",
  candidates,
  ...patch,
});

const term: TermRef = { year: 3, kind: "semester1" };
const noHistory: { offeringHistory: (code: string) => OfferingHistory | null } = {
  offeringHistory: () => null,
};
const order = (slot: OpenSlot, sources = noHistory) =>
  shortlistForSlot(version, plan, term, slot, sources).entries.map((e) => e.course.code);

describe("shortlist eligibility", () => {
  it("keeps a candidate that counts towards the slot with its prerequisites met", () => {
    const list = shortlistForSlot(version, plan, term, slotOf([candidate("PI390")]), noHistory);
    expect(list.entries.map((e) => e.course.code)).toEqual(["PI390"]);
    expect(list.leftOut).toEqual({ prerequisites: [], notRecordedInKind: [] });
  });

  it("leaves out a candidate whose prerequisites are not met by this term, and says which", () => {
    const slot = slotOf([
      candidate("PI390"),
      candidate("PI364", { missingPrerequisites: ["PI280"] }),
    ]);
    const list = shortlistForSlot(version, plan, term, slot, noHistory);
    expect(list.entries.map((e) => e.course.code)).toEqual(["PI390"]);
    expect(list.leftOut.prerequisites).toEqual(["PI364"]);
  });

  it("leaves out a course that has a history but never in this kind of term", () => {
    const history = (kinds: Partial<OfferingHistory["yearsByKind"]>): OfferingHistory => ({
      code: "X",
      terms: [],
      yearsByKind: { semester1: [], semester2: [], summer: [], ...kinds },
    });
    const sources = {
      offeringHistory: (code: string) =>
        code === "PI390"
          ? history({ semester2: [2568] })
          : code === "PI211"
            ? history({ semester1: [2567] })
            : null,
    };
    const slot = slotOf([candidate("PI390"), candidate("PI211"), candidate("PI300")]);
    const list = shortlistForSlot(version, plan, term, slot, sources);
    expect(list.leftOut.notRecordedInKind).toEqual(["PI390"]);
    // Recorded in this kind of term, and no history at all, are both kept.
    expect(list.entries.map((e) => e.course.code).sort()).toEqual(["PI211", "PI300"]);
  });

  it("applies the history test in the term's own kind", () => {
    const sources = {
      offeringHistory: (): OfferingHistory => ({
        code: "PI390",
        terms: [],
        yearsByKind: { semester1: [], semester2: [2568], summer: [] },
      }),
    };
    const slot = slotOf([candidate("PI390")]);
    expect(order(slot, sources)).toEqual([]);
    const second = shortlistForSlot(version, plan, { year: 3, kind: "semester2" }, slot, sources);
    expect(second.entries.map((e) => e.course.code)).toEqual(["PI390"]);
  });

  it("counts a prerequisite failure first, so a course is left out for one reason only", () => {
    const sources = {
      offeringHistory: (): OfferingHistory => ({
        code: "X",
        terms: [],
        yearsByKind: { semester1: [], semester2: [2568], summer: [] },
      }),
    };
    const slot = slotOf([candidate("PI364", { missingPrerequisites: ["PI280"] })]);
    const list = shortlistForSlot(version, plan, term, slot, sources);
    expect(list.leftOut).toEqual({ prerequisites: ["PI364"], notRecordedInKind: [] });
  });

  it("re-checks that a candidate counts towards the slot for the student's bucket", () => {
    const slot = slotOf([
      candidate("PI390"),
      candidate("PI364", { bucket: "concentrationElectiveArea" }),
    ]);
    expect(order(slot)).toEqual(["PI390"]);
    // A pooled minor slot takes any of the three minor buckets and nothing else.
    const minorSlot = slotOf(
      [
        candidate("PI380", { bucket: "minorRequired" }),
        candidate("PI313", { bucket: "minorElective" }),
        candidate("PI293", { bucket: "minorElectiveOther" }),
        candidate("PI390"),
      ],
      { category: "minor" }
    );
    expect(order(minorSlot)).toEqual(["PI293", "PI313", "PI380"]);
    // A named either/or slot takes exactly the codes it names.
    const named = slotOf([candidate("AH208"), candidate("PI121")], { choices: ["AH208", "EL295"] });
    expect(order(named)).toEqual(["AH208"]);
  });

  it("works on a real open slot from the suggestion engine", () => {
    const real = suggestForTerm(version, plan, { year: 3, kind: "semester1" }).openSlots.find(
      (slot) => slot.id === "minorRequired1"
    )!;
    const list = shortlistForSlot(version, plan, { year: 3, kind: "semester1" }, real, noHistory);
    expect(list.entries.map((e) => e.course.code)).toEqual(["PI380", "PI381", "PI382"]);
    // Every other course in the slot's bucket is also a candidate, so none was lost on the way.
    expect(list.entries.length + list.leftOut.prerequisites.length).toBe(real.candidates.length);
  });

  it("leaves a slot with candidates that all fail with an empty shortlist and the reasons", () => {
    const real = suggestForTerm(version, plan, { year: 3, kind: "semester1" }).openSlots.find(
      (slot) => slot.id === "areaElective1"
    )!;
    const list = shortlistForSlot(version, plan, { year: 3, kind: "semester1" }, real, noHistory);
    expect(list.entries).toEqual([]);
    expect(list.leftOut.prerequisites.length).toBe(real.candidates.length);
    expect(real.candidates.length).toBeGreaterThan(0);
  });
});

describe("shortlist ranking", () => {
  it("puts the courses the recommended plan has in this term first", () => {
    const slot = slotOf([
      candidate("PI300"),
      candidate("PI390", { recommendedHere: true }),
      candidate("PI211"),
    ]);
    // PI211 unlocks three courses and PI390 none, yet the recommended-here course leads.
    expect(order(slot)).toEqual(["PI390", "PI211", "PI300"]);
  });

  it("then ranks by how many later courses a course unlocks that the student has not passed", () => {
    // PI280 unlocks 12 courses and PI211 unlocks 3; PI390 and PI300 unlock none.
    const slot = slotOf([
      candidate("PI390"),
      candidate("PI211"),
      candidate("PI280"),
      candidate("PI300"),
    ]);
    const list = shortlistForSlot(version, plan, term, slot, noHistory);
    expect(list.entries.map((e) => [e.course.code, e.unlocksCount])).toEqual([
      ["PI280", 12],
      ["PI211", 3],
      ["PI300", 0],
      ["PI390", 0],
    ]);
  });

  it("does not count unlocks the student has already passed", () => {
    const passedMore: StudyPlan = { ...plan, passed: [...plan.passed, "PI300", "PI320"] };
    const list = shortlistForSlot(
      version,
      passedMore,
      term,
      slotOf([candidate("PI211")]),
      noHistory
    );
    expect(list.entries[0]?.unlocksCount).toBe(1);
  });

  it("falls back to the course code, so equal courses never swap between renders", () => {
    const slot = slotOf([candidate("PI390"), candidate("PI300"), candidate("PI320")]);
    expect(order(slot)).toEqual(["PI300", "PI320", "PI390"]);
    expect(order({ ...slot, candidates: [...slot.candidates].reverse() })).toEqual(order(slot));
  });

  it("is a total order: the same inputs in any arrangement give the same list", () => {
    const base = [
      candidate("PI211"),
      candidate("PI280"),
      candidate("PI300"),
      candidate("PI390", { recommendedHere: true }),
      candidate("PI320"),
    ];
    const expected = order(slotOf(base));
    for (let shift = 1; shift < base.length; shift += 1) {
      const rotated = [...base.slice(shift), ...base.slice(0, shift)];
      expect(order(slotOf(rotated)), `rotated by ${shift}`).toEqual(expected);
    }
  });

  it("compares two entries by the three criteria and nothing else", () => {
    const entry = (code: string, recommendedHere: boolean, unlocksCount: number) => ({
      course: candidate(code, { recommendedHere }),
      unlocksCount,
    });
    expect(compareEntries(entry("B", true, 0), entry("A", false, 9))).toBeLessThan(0);
    expect(compareEntries(entry("B", false, 2), entry("A", false, 1))).toBeLessThan(0);
    expect(compareEntries(entry("A", false, 1), entry("B", false, 1))).toBeLessThan(0);
    expect(compareEntries(entry("A", false, 1), entry("A", false, 1))).toBe(0);
  });
});

describe("shortlist and reviews", () => {
  const real = (n: number, band: "under_3" | "over_6"): StudentReview[] => [
    {
      reviewCount: n,
      term: { year: 2568, semester: 1 },
      workload: { en: "w", th: "w" },
      assessmentStyle: { en: "a", th: "a" },
      tips: [],
      workloadBands: { [band]: n },
    },
  ];
  const slot = slotOf([
    candidate("PI300"),
    candidate("PI320"),
    candidate("PI390"),
    candidate("PI211"),
  ]);

  it("attaches each candidate's reviews for display", () => {
    const list = shortlistForSlot(version, plan, term, slot, {
      ...noHistory,
      reviews: (code) => (code === "PI300" ? real(6, "over_6") : []),
    });
    const byCode = new Map(list.entries.map((e) => [e.course.code, e.reviews]));
    expect(byCode.get("PI300")?.students).toBe(6);
    expect(byCode.get("PI300")?.bands?.counts).toEqual({ over_6: 6 });
    expect(byCode.get("PI320")?.students).toBe(0);
  });

  it("never lets review content change the order", () => {
    const withoutReviews = order(slot);
    const heavyOnTheLast = shortlistForSlot(version, plan, term, slot, {
      ...noHistory,
      reviews: (code) => (code === withoutReviews.at(-1) ? real(40, "under_3") : []),
    }).entries.map((e) => e.course.code);
    const heavyOnTheFirst = shortlistForSlot(version, plan, term, slot, {
      ...noHistory,
      reviews: (code) => (code === withoutReviews[0] ? real(40, "over_6") : real(5, "under_3")),
    }).entries.map((e) => e.course.code);
    const everyoneReviewed = shortlistForSlot(version, plan, term, slot, {
      ...noHistory,
      reviews: () => real(12, "over_6"),
    }).entries.map((e) => e.course.code);
    expect(heavyOnTheLast).toEqual(withoutReviews);
    expect(heavyOnTheFirst).toEqual(withoutReviews);
    expect(everyoneReviewed).toEqual(withoutReviews);
  });

  it("does not let a review make a candidate eligible or ineligible", () => {
    const blocked = slotOf([candidate("PI364", { missingPrerequisites: ["PI280"] })]);
    const list = shortlistForSlot(version, plan, term, blocked, {
      ...noHistory,
      reviews: () => real(40, "under_3"),
    });
    expect(list.entries).toEqual([]);
  });
});
