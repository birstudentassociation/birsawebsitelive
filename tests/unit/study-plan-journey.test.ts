import { describe, expect, it } from "vitest";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import { assumedHistory } from "@/lib/study-plan/derive";
import { deserialisePlan, serialisePlan, startYearFromCohort } from "@/lib/study-plan/plan";

describe("building the initial plan from a position", () => {
  it("turns cohort 66 into a 2566 start year", () => {
    expect(startYearFromCohort("66")).toBe(2566);
  });

  it("produces a plan a later step can read back", () => {
    const version = CURRICULUM_VERSIONS["2564-rev2566"];
    const history = assumedHistory(version, { year: 3, kind: "semester1" });
    const plan = {
      versionId: version.id,
      cohort: "66",
      startYear: startYearFromCohort("66"),
      minorId: "governance" as const,
      passed: history.courses,
      freeElectiveCreditsPassed: 0,
      terms: [],
    };
    const round = deserialisePlan(serialisePlan(plan));
    expect(round?.passed).toEqual(history.courses);
    expect(round?.versionId).toBe("2564-rev2566");
  });

  it("drops a course the student says they did not take", () => {
    const version = CURRICULUM_VERSIONS["2564-rev2566"];
    const history = assumedHistory(version, { year: 3, kind: "semester1" });
    const corrected = history.courses.filter((c) => c !== "PI211");
    expect(corrected).not.toContain("PI211");
    expect(corrected.length).toBe(history.courses.length - 1);
  });
});
