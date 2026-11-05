import { describe, expect, it } from "vitest";
import {
  canPlaceInTerm,
  CURRICULUM_VERSIONS,
  designatedTerm,
  OFFERING_TERMS,
  SOURCES,
  type CurriculumVersionId,
  type TermKind,
  type TermRef,
} from "@/content/curriculum";
import { derivePlanPanel, suggestTerm } from "@/lib/course-review/planPanel";
import { applyAddParam } from "@/lib/study-plan/addToPlan";
import { assumedHistory, populateRecommendedTerms } from "@/lib/study-plan/derive";
import { checkPlan } from "@/lib/study-plan/findings";
import type { StudyPlan } from "@/lib/study-plan/plan";
import { shortlistForSlot } from "@/lib/study-plan/shortlist";
import { suggestForTerm } from "@/lib/study-plan/suggest";
import { whatIf } from "@/lib/study-plan/whatIf";

const SEMESTER_2_COURSES = [
  "AH208",
  "LAS101",
  "PI122",
  "PI211",
  "PI270",
  "PI271",
  "PI272",
  "PI292",
  "PI320",
  "PI321",
  "PI341",
  "PI342",
  "PI343",
  "PI346",
  "PI370",
  "PI374",
  "PI381",
  "PI382",
  "PI384",
  "PI387",
  "PI397",
  "PI414",
  "PI474",
  "PI478",
  "PI479",
  "PI480",
  "PI488",
  "PI489",
  "PI490",
  "PI494",
  "PI495",
  "TU102",
];

const VERSION_IDS = Object.keys(CURRICULUM_VERSIONS) as CurriculumVersionId[];

function planOf(versionId: CurriculumVersionId, overrides: Partial<StudyPlan> = {}): StudyPlan {
  return {
    versionId,
    cohort: versionId === "2568" ? "68" : "66",
    startYear: versionId === "2568" ? 2568 : 2566,
    minorId: "governance",
    passed: [],
    freeElectiveCreditsPassed: 0,
    terms: [],
    ...overrides,
  };
}

function plannedIn(plan: StudyPlan, kind: TermKind): string[] {
  return plan.terms.filter((t) => t.term.kind === kind).flatMap((t) => t.codes);
}

describe("offering terms data", () => {
  it("designates exactly the 32 courses in the faculty's semester 2 schedule", () => {
    expect(Object.keys(OFFERING_TERMS.value).sort()).toEqual([...SEMESTER_2_COURSES].sort());
    expect(Object.values(OFFERING_TERMS.value).every((term) => term === "semester2")).toBe(true);
  });

  it("does not designate PI280, which the schedule names only as a prerequisite", () => {
    expect(designatedTerm("PI280")).toBeNull();
    expect(canPlaceInTerm("PI280", "semester1")).toBe(true);
  });

  it("cites a published source that exists in SOURCES", () => {
    const { derivation } = OFFERING_TERMS;
    expect(derivation.kind).toBe("published");
    if (derivation.kind !== "published") return;
    expect(SOURCES[derivation.source].id).toBe("courseOffering2026S2");
  });

  it("names only courses some curriculum version lists", () => {
    const listed = new Set(
      VERSION_IDS.flatMap((id) => CURRICULUM_VERSIONS[id].courses.value.map((c) => c.code))
    );
    for (const code of SEMESTER_2_COURSES) expect(listed.has(code), code).toBe(true);
  });

  it("rejects a designated course in semester 1 only", () => {
    expect(designatedTerm("PI271")).toBe("semester2");
    expect(canPlaceInTerm("PI271", "semester1")).toBe(false);
    expect(canPlaceInTerm("PI271", "semester2")).toBe(true);
    expect(canPlaceInTerm("PI271", "summer")).toBe(true);
    expect(canPlaceInTerm("PI390", "semester1")).toBe(true);
  });

  it("does not treat inherited object keys as designated", () => {
    expect(designatedTerm("constructor")).toBeNull();
    expect(designatedTerm("toString")).toBeNull();
  });
});

describe("add to plan from a link", () => {
  const position: TermRef = { year: 2, kind: "semester1" };
  const plan = planOf("2564-rev2566", { passed: ["PI121", "PI211"] });

  it("refuses a semester 2 course in a semester 1 term and leaves the plan alone", () => {
    const result = applyAddParam(plan, "PI320", "3-semester1", position);
    expect(result).toMatchObject({ status: "refused", reason: "notOfferedInTerm", code: "PI320" });
  });

  it("adds the same course to a semester 2 term, and to a summer", () => {
    expect(applyAddParam(plan, "PI320", "3-semester2", position).status).toBe("added");
    expect(applyAddParam(plan, "PI320", "3-summer", position).status).toBe("added");
  });

  it("still adds a course with no designation to a semester 1 term", () => {
    expect(applyAddParam(plan, "PI390", "3-semester1", position).status).toBe("added");
  });
});

describe("autofill from the recommended plan", () => {
  for (const id of VERSION_IDS) {
    it(`places no designated course in a semester 1 term for ${id}`, () => {
      const version = CURRICULUM_VERSIONS[id];
      for (const minorId of [
        "governance",
        "publicAdministration",
        "globalPoliticalEconomy",
      ] as const) {
        const terms = populateRecommendedTerms(
          version,
          { year: 1, kind: "semester1" },
          { passed: [], terms: [], minorId }
        );
        for (const code of plannedIn(planOf(id, { terms }), "semester1")) {
          expect(canPlaceInTerm(code, "semester1"), `${id} ${minorId} ${code}`).toBe(true);
        }
      }
    });
  }

  it("is idempotent when semester 1 minor slots had to be skipped", () => {
    const version = CURRICULUM_VERSIONS["2564"];
    const position: TermRef = { year: 2, kind: "semester1" };
    const once = populateRecommendedTerms(version, position, {
      passed: [],
      terms: [],
      minorId: "governance",
    });
    const twice = populateRecommendedTerms(version, position, {
      passed: [],
      terms: once,
      minorId: "governance",
    });
    expect(twice).toEqual(once);
  });

  it("leaves LAS101 and PI270 unplaced where the 2568 plan names them in semester 1", () => {
    const version = CURRICULUM_VERSIONS["2568"];
    const terms = populateRecommendedTerms(
      version,
      { year: 1, kind: "semester1" },
      { passed: [], terms: [], minorId: "governance" }
    );
    const all = terms.flatMap((t) => t.codes);
    expect(all).not.toContain("LAS101");
    expect(all).not.toContain("PI270");
  });
});

describe("recommended plans", () => {
  it("name a designated course in a semester 1 term only in 2568, for LAS101 and PI270", () => {
    const conflicts: string[] = [];
    for (const id of VERSION_IDS) {
      for (const term of CURRICULUM_VERSIONS[id].recommendedPlan.value) {
        if (term.term.kind !== "semester1") continue;
        for (const entry of term.entries) {
          if (entry.kind === "course" && !canPlaceInTerm(entry.code, "semester1")) {
            conflicts.push(`${id} year ${term.term.year} ${entry.code}`);
          }
          if (entry.kind === "placeholder") {
            for (const code of entry.choices ?? []) {
              if (!canPlaceInTerm(code, "semester1")) conflicts.push(`${id} choice ${code}`);
            }
          }
        }
      }
    }
    expect(conflicts.sort()).toEqual(["2568 year 1 LAS101", "2568 year 2 PI270"]);
  });

  it("reports a plan carrying those courses as findings instead of throwing", () => {
    const version = CURRICULUM_VERSIONS["2568"];
    const plan = planOf("2568", {
      terms: [
        { term: { year: 1, kind: "semester1" }, codes: ["LAS101"], freeElectiveCredits: 0 },
        { term: { year: 2, kind: "semester1" }, codes: ["PI270"], freeElectiveCredits: 0 },
      ],
    });
    const findings = checkPlan(version, plan);
    const ids = findings.filter((f) => f.id.startsWith("semesterOnly:")).map((f) => f.id);
    expect(ids.sort()).toEqual(["semesterOnly:LAS101", "semesterOnly:PI270"]);
    const finding = findings.find((f) => f.id === "semesterOnly:LAS101")!;
    expect(finding.severity).toBe("problem");
    expect(finding.message.en).toContain("semester 2 only");
    expect(finding.message.th.length).toBeGreaterThan(0);
    expect(finding.source.document).toBe("courseOffering2026S2");
  });

  it("reports nothing when the same courses sit in semester 2", () => {
    const version = CURRICULUM_VERSIONS["2568"];
    const plan = planOf("2568", {
      terms: [{ term: { year: 1, kind: "semester2" }, codes: ["LAS101"], freeElectiveCredits: 0 }],
    });
    const ids = checkPlan(version, plan).map((f) => f.id);
    expect(ids.some((id) => id.startsWith("semesterOnly:"))).toBe(false);
  });
});

describe("suggestions", () => {
  const version = CURRICULUM_VERSIONS["2564-rev2566"];
  const plan = planOf("2564-rev2566", { passed: ["PI121", "PI122", "PI211", "PI271"] });

  function offered(suggestion: ReturnType<typeof suggestForTerm>): string[] {
    return [
      ...suggestion.groups.flatMap((g) => g.courses.map((c) => c.code)),
      ...suggestion.openSlots.flatMap((s) => s.candidates.map((c) => c.code)),
    ];
  }

  it("offers no designated course in a semester 1 term, and says which were left out", () => {
    const suggestion = suggestForTerm(version, plan, { year: 3, kind: "semester1" });
    const codes = offered(suggestion);
    expect(codes.length).toBeGreaterThan(0);
    for (const code of codes) expect(canPlaceInTerm(code, "semester1"), code).toBe(true);
    expect(suggestion.notOfferedHere).toEqual(expect.arrayContaining(["PI320", "PI381"]));
    expect(suggestion.notOfferedHere).not.toContain("PI211");
  });

  it("offers them in semester 2 and summer, with nothing left out", () => {
    for (const kind of ["semester2", "summer"] as const) {
      const suggestion = suggestForTerm(version, plan, { year: 3, kind });
      expect(offered(suggestion)).toContain("PI320");
      expect(suggestion.notOfferedHere).toEqual([]);
    }
  });

  it("keeps a designated course out of a semester 1 shortlist even if handed one", () => {
    const slot = suggestForTerm(version, plan, { year: 3, kind: "semester2" }).openSlots[0]!;
    const withDesignated = {
      ...slot,
      choices: undefined,
      category: slot.category,
      candidates: [
        {
          code: "PI320",
          title: "x",
          credits: 3,
          bucket: slot.category,
          recommendedHere: false,
          missingPrerequisites: [],
        },
      ],
    };
    const list = shortlistForSlot(version, plan, { year: 3, kind: "semester1" }, withDesignated, {
      offeringHistory: () => null,
    });
    expect(list.entries).toEqual([]);
  });

  it("suggests a term other than semester 1 for a designated course on a course page", () => {
    const version2568 = CURRICULUM_VERSIONS["2568"];
    const plan2568 = planOf("2568");
    const position: TermRef = { year: 1, kind: "semester1" };
    const suggested = suggestTerm("LAS101", plan2568, position);
    expect(suggested).not.toBeNull();
    expect(canPlaceInTerm("LAS101", suggested!.kind)).toBe(true);
    expect(version2568.recommendedPlan.value.some((t) => t.term.kind === "semester1")).toBe(true);
    for (const code of SEMESTER_2_COURSES) {
      const term = suggestTerm(code, plan2568, position);
      if (term) expect(term.kind, code).not.toBe("semester1");
    }
  });

  it("builds a course page panel without a semester 1 suggestion", () => {
    const view = derivePlanPanel("PI320", planOf("2564-rev2566"), new Date("2026-09-01"));
    if (view.suggestedTerm) expect(view.suggestedTerm.kind).not.toBe("semester1");
  });
});

describe("placeholder fill step", () => {
  it("has slots in semester 1 terms whose designated candidates the page and action must drop", () => {
    const version = CURRICULUM_VERSIONS["2564"];
    const { placeholders } = assumedHistory(version, { year: 4, kind: "semester2" });
    const semester1Slots = placeholders.filter((slot) => slot.term.kind === "semester1");
    expect(semester1Slots.length).toBeGreaterThan(0);
    const areaCourses = version.courses.value.filter(
      (c) => c.category === "concentrationElectiveArea"
    );
    expect(areaCourses.some((c) => !canPlaceInTerm(c.code, "semester1"))).toBe(true);
  });
});

describe("what if", () => {
  const version = CURRICULUM_VERSIONS["2564-rev2566"];

  it("defers a semester 2 course to the next semester 2, skipping the semester 1 between", () => {
    const plan = planOf("2564-rev2566", {
      terms: [{ term: { year: 3, kind: "semester2" }, codes: ["PI478"], freeElectiveCredits: 0 }],
    });
    const result = whatIf(version, plan, { kind: "deferCourse", code: "PI478" });
    expect(result.applied).toBe(true);
    expect(result.pushedBack[0]?.to).toEqual({ year: 4, kind: "semester2" });
    expect(plannedIn(result.plan, "semester1")).toEqual([]);
  });

  it("still defers an ordinary course from semester 2 to the next semester 1", () => {
    const plan = planOf("2564-rev2566", {
      terms: [{ term: { year: 3, kind: "semester2" }, codes: ["PI390"], freeElectiveCredits: 0 }],
    });
    const result = whatIf(version, plan, { kind: "deferCourse", code: "PI390" });
    expect(result.pushedBack[0]?.to).toEqual({ year: 4, kind: "semester1" });
  });

  it("moves a semester 1 term's courses out of it without leaving a designated course in semester 1", () => {
    const plan = planOf("2564-rev2566", {
      terms: [
        { term: { year: 3, kind: "semester2" }, codes: ["PI320", "PI390"], freeElectiveCredits: 0 },
        { term: { year: 4, kind: "semester1" }, codes: ["PI300"], freeElectiveCredits: 0 },
      ],
    });
    const result = whatIf(version, plan, {
      kind: "emptyTerm",
      term: { year: 3, kind: "semester2" },
    });
    for (const code of plannedIn(result.plan, "semester1")) {
      expect(canPlaceInTerm(code, "semester1"), code).toBe(true);
    }
    const moved = result.pushedBack.find((m) => m.code === "PI320");
    expect(moved?.to).toEqual({ year: 4, kind: "semester2" });
  });

  it("keeps a dependent of a moved course out of semester 1 as well", () => {
    const plan = planOf("2564-rev2566", {
      terms: [
        { term: { year: 2, kind: "semester2" }, codes: ["PI271"], freeElectiveCredits: 0 },
        { term: { year: 3, kind: "semester2" }, codes: ["PI272"], freeElectiveCredits: 0 },
      ],
    });
    const result = whatIf(version, plan, { kind: "deferCourse", code: "PI271" });
    for (const code of plannedIn(result.plan, "semester1")) {
      expect(canPlaceInTerm(code, "semester1"), code).toBe(true);
    }
  });
});
