import { describe, expect, it } from "vitest";
import { serialisePlan, deserialisePlan, type StudyPlan } from "@/lib/study-plan/plan";

const plan: StudyPlan = {
  versionId: "2564-rev2566",
  cohort: "66",
  startYear: 2566,
  minorId: "governance",
  passed: ["TU100", "TU101", "EL105"],
  terms: [
    { term: { year: 3, kind: "semester1" }, codes: ["PI300", "PI390"] },
    { term: { year: 3, kind: "summer" }, codes: ["PI574"] },
  ],
};

describe("serialisePlan and deserialisePlan", () => {
  it("round-trips a plan unchanged", () => {
    expect(deserialisePlan(serialisePlan(plan))).toEqual(plan);
  });

  it("produces something small enough for a hidden field and a cookie", () => {
    expect(serialisePlan(plan).length).toBeLessThan(2048);
  });

  it("returns null for junk rather than throwing", () => {
    for (const junk of ["", "{", "not-base64!!", "eyJib2d1cyI6dHJ1ZX0="]) {
      expect(deserialisePlan(junk), junk).toBeNull();
    }
  });

  it("rejects a plan naming a version that does not exist", () => {
    const tampered = serialisePlan({ ...plan, versionId: "9999" as never });
    expect(deserialisePlan(tampered)).toBeNull();
  });

  it("rejects course codes that are not plausible codes", () => {
    const tampered = serialisePlan({ ...plan, passed: ["<script>"] });
    expect(deserialisePlan(tampered)).toBeNull();
  });

  it("survives an empty plan", () => {
    const empty: StudyPlan = {
      versionId: "2568",
      cohort: "68",
      startYear: 2568,
      minorId: "publicAdministration",
      passed: [],
      terms: [],
    };
    expect(deserialisePlan(serialisePlan(empty))).toEqual(empty);
  });
});
