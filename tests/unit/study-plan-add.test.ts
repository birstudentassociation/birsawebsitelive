import { describe, expect, it } from "vitest";
import type { TermRef } from "@/content/curriculum";
import { allCourseCodes, counterparts, versionsOf } from "@/lib/courses/graph";
import {
  applyAddParam,
  normaliseCodeParam,
  parseTermKey,
  type AddResult,
} from "@/lib/study-plan/addToPlan";
import { addableTerms, screenTerms, termKey } from "@/lib/study-plan/derive";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import { deserialisePlan, serialisePlan, type StudyPlan } from "@/lib/study-plan/plan";

/** Where the student is: year 2, semester 1. Terms before this are the past. */
const position: TermRef = { year: 2, kind: "semester1" };

function planOf(overrides: Partial<StudyPlan> = {}): StudyPlan {
  return {
    versionId: "2564-rev2566",
    cohort: "66",
    startYear: 2566,
    minorId: "governance",
    passed: ["PI121", "PI211"],
    freeElectiveCreditsPassed: 0,
    terms: [{ term: { year: 2, kind: "semester1" }, codes: ["PI271"], freeElectiveCredits: 0 }],
    ...overrides,
  };
}

function added(result: AddResult): Extract<AddResult, { status: "added" }> {
  if (result.status !== "added") throw new Error(`expected added, got ${result.reason}`);
  return result;
}

function reasonOf(result: AddResult): string {
  return result.status === "refused" ? result.reason : "added";
}

describe("parseTermKey", () => {
  it("reads the plan screen's own term key back", () => {
    for (const term of [
      { year: 1, kind: "semester1" },
      { year: 3, kind: "semester2" },
      { year: 8, kind: "summer" },
    ] as TermRef[]) {
      expect(parseTermKey(termKey(term))).toEqual(term);
    }
  });

  it("rejects anything else without throwing", () => {
    for (const bad of [
      "",
      "3",
      "3-",
      "0-semester1",
      "9-semester1",
      "3-winter",
      "3-semester1 ",
      "03-semester1",
      "3-SEMESTER1",
      undefined,
      null,
      42,
      ["3-semester1"],
      { year: 3 },
    ]) {
      expect(parseTermKey(bad), String(bad)).toBeNull();
    }
  });
});

describe("normaliseCodeParam", () => {
  it("accepts a code however it is typed", () => {
    expect(normaliseCodeParam("PI380")).toBe("PI380");
    expect(normaliseCodeParam(" pi380 ")).toBe("PI380");
    expect(normaliseCodeParam("pi 380")).toBe("PI380");
    expect(normaliseCodeParam("LAS101")).toBe("LAS101");
  });

  it("rejects what is not shaped like a code", () => {
    for (const bad of [
      "",
      "PI",
      "380",
      "PI3800",
      "P1380",
      "PI 3 80",
      "PI380; DROP",
      undefined,
      380,
    ]) {
      expect(normaliseCodeParam(bad), String(bad)).toBeNull();
    }
  });
});

describe("applyAddParam: a valid add", () => {
  it("adds the course to the named term and says which", () => {
    const plan = planOf();
    const result = added(applyAddParam(plan, "PI300", "2-semester2", position));
    expect(result.code).toBe("PI300");
    expect(result.term).toEqual({ year: 2, kind: "semester2" });
    expect(result.requestedCode).toBeUndefined();
    const term = result.plan.terms.find((t) => termKey(t.term) === "2-semester2");
    expect(term?.codes).toEqual(["PI300"]);
  });

  it("adds to a term that already holds courses, after them", () => {
    const result = added(applyAddParam(planOf(), "PI300", "2-semester1", position));
    expect(result.plan.terms.find((t) => termKey(t.term) === "2-semester1")?.codes).toEqual([
      "PI271",
      "PI300",
    ]);
  });

  it("accepts a code typed with a space and in lower case", () => {
    expect(added(applyAddParam(planOf(), "pi 300", "2-semester2", position)).code).toBe("PI300");
  });

  it("leaves the input plan untouched, so undo can return it exactly", () => {
    const plan = planOf();
    const before = serialisePlan(plan);
    applyAddParam(plan, "PI300", "2-semester2", position);
    expect(serialisePlan(plan)).toBe(before);
  });

  it("adds a course whose prerequisite is missing: findings flag it, adding never blocks", () => {
    const result = applyAddParam(planOf({ passed: [] }), "PI300", "2-semester2", position);
    expect(result.status).toBe("added");
  });

  it("allows the term the plan screen's Add another term would append", () => {
    const version = CURRICULUM_VERSIONS["2564-rev2566"];
    const last = screenTerms(version, planOf(), position).at(-1)!;
    const following = addableTerms(version, planOf(), position).at(-1)!;
    expect(termKey(following)).not.toBe(termKey(last));
    expect(applyAddParam(planOf(), "PI300", termKey(following), position).status).toBe("added");
  });

  it("produces a plan that survives the round trip through the URL", () => {
    const result = added(applyAddParam(planOf(), "PI300", "2-semester2", position));
    expect(deserialisePlan(serialisePlan(result.plan))).toEqual(result.plan);
  });
});

describe("applyAddParam: duplicates", () => {
  it("refuses a course already passed", () => {
    const result = applyAddParam(planOf(), "PI211", "2-semester2", position);
    expect(result).toMatchObject({ status: "refused", reason: "alreadyPassed", code: "PI211" });
  });

  it("refuses a course already planned, in any term", () => {
    const result = applyAddParam(planOf(), "PI271", "2-semester2", position);
    expect(result).toMatchObject({ status: "refused", reason: "alreadyPlanned", code: "PI271" });
  });
});

describe("applyAddParam: another curriculum's code", () => {
  it("adds the counterpart in the student's version and reports the swap", () => {
    // TU104 is a 2564 course that LAS101 replaces in the 2023 revision.
    expect(counterparts("LAS101", "2564")).toEqual(["TU104"]);
    const plan = planOf({ versionId: "2564", cohort: "64", startYear: 2564, passed: [] });
    const result = added(applyAddParam(plan, "LAS101", "2-semester2", position));
    expect(result.code).toBe("TU104");
    expect(result.requestedCode).toBe("LAS101");
    expect(result.plan.terms.some((t) => t.codes.includes("TU104"))).toBe(true);
    expect(result.plan.terms.some((t) => t.codes.includes("LAS101"))).toBe(false);
  });

  it("recognises the counterpart as already passed", () => {
    const plan = planOf({ versionId: "2564", cohort: "64", startYear: 2564, passed: ["TU104"] });
    const result = applyAddParam(plan, "LAS101", "2-semester2", position);
    expect(result).toMatchObject({ status: "refused", reason: "alreadyPassed", code: "TU104" });
  });

  it("refuses a course the student's version neither lists nor has a counterpart for", () => {
    const orphan = allCourseCodes().find(
      (code) => !versionsOf(code).includes("2564") && counterparts(code, "2564").length === 0
    );
    expect(orphan, "a code the 2564 curriculum has no answer for").toBeDefined();
    const plan = planOf({ versionId: "2564", cohort: "64", startYear: 2564 });
    expect(reasonOf(applyAddParam(plan, orphan, "2-semester2", position))).toBe("notInVersion");
  });

  it("says unknownCourse, not notInVersion, for a code no curriculum lists", () => {
    expect(reasonOf(applyAddParam(planOf(), "ZZ999", "2-semester2", position))).toBe(
      "unknownCourse"
    );
  });
});

describe("applyAddParam: the term", () => {
  it("refuses a missing or malformed term", () => {
    for (const bad of [undefined, "", "banana", "2-winter", "0-semester1", ["2-semester2"]]) {
      expect(reasonOf(applyAddParam(planOf(), "PI300", bad, position)), String(bad)).toBe(
        "badTerm"
      );
    }
  });

  it("refuses a term before the student's current term", () => {
    expect(reasonOf(applyAddParam(planOf(), "PI300", "1-semester2", position))).toBe("pastTerm");
    expect(reasonOf(applyAddParam(planOf(), "PI300", "1-summer", position))).toBe("pastTerm");
  });

  it("allows the current term itself", () => {
    expect(applyAddParam(planOf(), "PI300", "2-semester1", position).status).toBe("added");
  });

  it("refuses a well-formed term the plan screen does not offer", () => {
    expect(reasonOf(applyAddParam(planOf(), "PI300", "8-summer", position))).toBe(
      "unavailableTerm"
    );
  });

  it("refuses a full term", () => {
    const codes = allCourseCodes()
      .filter((c) => !["PI300", "PI121", "PI211", "PI271"].includes(c))
      .slice(0, 15);
    const plan = planOf({
      terms: [{ term: { year: 2, kind: "semester2" }, codes, freeElectiveCredits: 0 }],
    });
    expect(reasonOf(applyAddParam(plan, "PI300", "2-semester2", position))).toBe("termFull");
  });

  it("refuses when the plan already holds the most terms the format allows", () => {
    // Only a degenerate plan can get here (24 distinct terms would be every
    // term there is), so the entries are 24 repeats of a past term. The point
    // is that a new term entry is never written past the schema's cap, which
    // would make the plan fail to deserialise on the next request.
    const terms = Array.from({ length: 24 }, () => ({
      term: { year: 1, kind: "semester1" } as TermRef,
      codes: [],
      freeElectiveCredits: 0,
    }));
    const plan = planOf({ terms });
    expect(reasonOf(applyAddParam(plan, "PI300", "2-semester2", position))).toBe("tooManyTerms");
  });
});

describe("applyAddParam: the internship summer", () => {
  const internshipSummer = { year: 3, kind: "summer" } as const;
  const withInternship = () =>
    planOf({
      terms: [{ term: internshipSummer, codes: ["PI574"], freeElectiveCredits: 0 }],
    });

  it("refuses to put another course beside the internship", () => {
    expect(reasonOf(applyAddParam(withInternship(), "PI300", "3-summer", position))).toBe(
      "internshipTerm"
    );
  });

  it("refuses to put the internship into a summer that holds other courses", () => {
    const plan = planOf({
      passed: ["PI121", "PI211"],
      terms: [{ term: internshipSummer, codes: ["PI300"], freeElectiveCredits: 0 }],
    });
    expect(reasonOf(applyAddParam(plan, "PI574", "3-summer", position))).toBe("internshipTerm");
  });

  it("adds the internship to an empty summer", () => {
    expect(applyAddParam(planOf(), "PI574", "3-summer", position).status).toBe("added");
  });
});

describe("applyAddParam: tampered input", () => {
  it("never throws, whatever the link carries", () => {
    const hostile: unknown[] = [
      undefined,
      null,
      "",
      " ",
      "💥",
      "PI300'; --",
      "__proto__",
      "constructor",
      "PI300\u0000",
      "x".repeat(10_000),
      42,
      {},
      [],
      ["PI300"],
      () => 1,
    ];
    for (const code of hostile) {
      for (const term of hostile) {
        expect(() => applyAddParam(planOf(), code, term, position)).not.toThrow();
        expect(applyAddParam(planOf(), code, term, position).status).toBe("refused");
      }
    }
  });

  it("changes nothing on a refusal", () => {
    const result = applyAddParam(planOf(), "PI211", "2-semester2", position);
    expect(result.status).toBe("refused");
    expect("plan" in result).toBe(false);
  });

  it("keeps an over-long junk code out of the notice", () => {
    const result = applyAddParam(planOf(), "x".repeat(10_000), "2-semester2", position);
    expect(result.status === "refused" && result.code.length).toBeLessThanOrEqual(12);
  });
});
