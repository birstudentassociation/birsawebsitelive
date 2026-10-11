/**
 * What the elective demand signal sends. The payload is a curriculum version
 * and course and term pairs, and these tests hold it to that: the electives
 * are picked the way the curriculum defines them, each term is the calendar
 * term and not the study year, and nothing else about the student can appear.
 */
import { describe, expect, it } from "vitest";
import {
  buildDemandPayload,
  encodeDemandEntries,
  MAX_DEMAND_ENTRIES,
  validateDemand,
  type RawDemandForm,
} from "@/lib/elective-demand/payload";
import { academicTermLabel, academicTermOf, termOrder } from "@/lib/elective-demand/terms";
import type { StudyPlan } from "@/lib/study-plan/plan";

/** A 2568 governance student. PI364 and PI376 are area and approaches electives, PI313 a minor elective, PI340 another minor's required course (so an elective here), PI380 a required minor course, PI210 core, PI574 the internship. */
const plan: StudyPlan = {
  versionId: "2568",
  cohort: "68",
  startYear: 2568,
  minorId: "governance",
  passed: ["PI121", "PI122", "PI211"],
  freeElectiveCreditsPassed: 3,
  terms: [
    {
      term: { year: 3, kind: "semester2" },
      codes: ["PI376", "PI340", "PI210"],
      freeElectiveCredits: 3,
    },
    {
      term: { year: 3, kind: "semester1" },
      codes: ["PI364", "PI380", "PI313"],
      freeElectiveCredits: 0,
    },
    { term: { year: 4, kind: "summer" }, codes: ["PI574"], freeElectiveCredits: 0 },
  ],
};

describe("buildDemandPayload", () => {
  it("carries the curriculum version and the electives, each with the calendar term, earliest first", () => {
    const payload = buildDemandPayload(plan);
    expect(payload.versionId).toBe("2568");
    expect(payload.entries.map((e) => `${e.code}@${e.term.year}-${e.term.semester}`)).toEqual([
      "PI313@2570-1",
      "PI364@2570-1",
      "PI340@2570-2",
      "PI376@2570-2",
    ]);
  });

  it("leaves out required courses, the internship and free elective credits", () => {
    const codes = buildDemandPayload(plan).entries.map((e) => e.code);
    expect(codes).not.toContain("PI380"); // required for this minor
    expect(codes).not.toContain("PI210"); // core
    expect(codes).not.toContain("PI574"); // the internship
  });

  it("counts a minor course as an elective or not by the student's own minor", () => {
    const asGoverning = buildDemandPayload({
      ...plan,
      terms: [{ term: { year: 3, kind: "semester1" }, codes: ["PI380"], freeElectiveCredits: 0 }],
    });
    expect(asGoverning.entries).toEqual([]);
    const asEconomy = buildDemandPayload({
      ...plan,
      minorId: "globalPoliticalEconomy",
      terms: [{ term: { year: 3, kind: "semester1" }, codes: ["PI380"], freeElectiveCredits: 0 }],
    });
    expect(asEconomy.entries.map((e) => e.code)).toEqual(["PI380"]);
  });

  it("names the term by the cohort's calendar, so two cohorts planning the same term agree", () => {
    const earlier = buildDemandPayload({
      ...plan,
      cohort: "67",
      startYear: 2567,
      terms: [{ term: { year: 4, kind: "semester1" }, codes: ["PI364"], freeElectiveCredits: 0 }],
    });
    const later = buildDemandPayload({
      ...plan,
      terms: [{ term: { year: 3, kind: "semester1" }, codes: ["PI364"], freeElectiveCredits: 0 }],
    });
    expect(earlier.entries[0]!.term).toEqual({ year: 2570, semester: 1 });
    expect(later.entries[0]!.term).toEqual(earlier.entries[0]!.term);
  });

  it("lists a course planned twice in one term once", () => {
    const payload = buildDemandPayload({
      ...plan,
      terms: [
        { term: { year: 3, kind: "semester1" }, codes: ["PI364", "PI364"], freeElectiveCredits: 0 },
      ],
    });
    expect(payload.entries).toHaveLength(1);
  });

  it("is empty for a plan with no electives in it", () => {
    expect(buildDemandPayload({ ...plan, terms: [] }).entries).toEqual([]);
  });

  it("holds nothing but the version, codes and terms: no cohort, minor, passed courses or identifier", () => {
    const payload = buildDemandPayload(plan);
    expect(Object.keys(payload).sort()).toEqual(["entries", "versionId"]);
    for (const entry of payload.entries) {
      expect(Object.keys(entry).sort()).toEqual(["code", "term"]);
      expect(Object.keys(entry.term).sort()).toEqual(["semester", "year"]);
    }
    const text = JSON.stringify(payload);
    expect(text).not.toContain("governance"); // the minor
    expect(text).not.toContain("PI121"); // a passed course
    expect(text).not.toMatch(/cohort|minor|passed|startYear|name|email|ip/i);
    // The encoded form field is no richer.
    expect(encodeDemandEntries(payload.entries)).toBe(
      "PI313@2570-1,PI364@2570-1,PI340@2570-2,PI376@2570-2"
    );
  });

  it("never exceeds the most entries a submission may hold", () => {
    expect(MAX_DEMAND_ENTRIES).toBeGreaterThanOrEqual(buildDemandPayload(plan).entries.length);
  });
});

describe("academic terms", () => {
  it("puts the summer session in the academic year it closes", () => {
    expect(academicTermOf(2568, { year: 3, kind: "summer" })).toEqual({
      year: 2570,
      semester: "summer",
    });
  });

  it("orders semester 1, semester 2, then summer within a year", () => {
    const order = (semester: 1 | 2 | "summer") => termOrder({ year: 2570, semester });
    expect(order(1)).toBeLessThan(order(2));
    expect(order(2)).toBeLessThan(order("summer"));
    expect(termOrder({ year: 2570, semester: "summer" })).toBeLessThan(
      termOrder({ year: 2571, semester: 1 })
    );
  });

  it("is named in each language's own way", () => {
    const term = { year: 2569, semester: 1 as const };
    expect(academicTermLabel(term, "en")).toBe("Semester 1, 2026/27");
    expect(academicTermLabel(term, "th")).toBe("ภาคเรียนที่ 1 ปีการศึกษา 2569");
    expect(academicTermLabel({ year: 2569, semester: "summer" }, "en")).toBe("Summer, 2026/27");
  });
});

describe("validateDemand", () => {
  const form = (overrides: Partial<RawDemandForm> = {}): RawDemandForm => ({
    versionId: "2568",
    entries: "PI364@2570-1,PI376@2570-2",
    agreed: true,
    honeypot: "",
    ...overrides,
  });

  it("accepts a clean submission and returns exactly the version, codes and terms", () => {
    expect(validateDemand(form())).toEqual({
      ok: true,
      data: {
        versionId: "2568",
        entries: [
          { code: "PI364", term: { year: 2570, semester: 1 } },
          { code: "PI376", term: { year: 2570, semester: 2 } },
        ],
      },
    });
  });

  it("refuses when the box was not ticked", () => {
    expect(validateDemand(form({ agreed: false }))).toEqual({ ok: false, reason: "not-agreed" });
  });

  it("refuses an unknown curriculum version", () => {
    for (const versionId of ["", "2569", "2568 ", "constructor", "__proto__"]) {
      expect(validateDemand(form({ versionId })), versionId).toEqual({
        ok: false,
        reason: "invalid",
      });
    }
  });

  it("refuses a course that is not in the named curriculum", () => {
    expect(validateDemand(form({ entries: "PI999@2570-1" }))).toEqual({
      ok: false,
      reason: "invalid",
    });
    // PI364 exists in 2568 but a made-up code with the right shape does not.
    expect(validateDemand(form({ entries: "PI364@2570-1,ZZ123@2570-1" })).ok).toBe(false);
  });

  it("refuses a term that is not a real academic term or is out of range", () => {
    for (const bad of [
      "PI364@2570-3",
      "PI364@2570",
      "PI364@70-1",
      "PI364@2499-1",
      "PI364@9999-1",
    ]) {
      expect(validateDemand(form({ entries: bad })), bad).toEqual({ ok: false, reason: "invalid" });
    }
  });

  it("refuses an entry carrying anything extra, so nothing else can be smuggled into the store", () => {
    for (const bad of [
      "PI364@2570-1@66",
      "PI364@2570-1;governance",
      "PI364@2570-1 66",
      "PI364@2570-1,cohort=66",
      "PI364@2570-1,somchai@example.com",
    ]) {
      expect(validateDemand(form({ entries: bad })), bad).toEqual({ ok: false, reason: "invalid" });
    }
  });

  it("refuses an empty list and one longer than a plan can make", () => {
    expect(validateDemand(form({ entries: "" })).ok).toBe(false);
    expect(validateDemand(form({ entries: "," })).ok).toBe(false);
    const many = Array.from({ length: MAX_DEMAND_ENTRIES + 1 }, () => "PI364@2570-1").join(",");
    expect(validateDemand(form({ entries: many })).ok).toBe(false);
  });

  it("folds repeats into one entry", () => {
    const result = validateDemand(form({ entries: "PI364@2570-1,PI364@2570-1" }));
    expect(result.ok && result.data.entries).toHaveLength(1);
  });
});
