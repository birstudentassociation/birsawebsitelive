import { describe, expect, it } from "vitest";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import { assumedHistory, remainingRequirements } from "@/lib/study-plan/derive";

const version = CURRICULUM_VERSIONS["2564-rev2566"];

describe("assumedHistory", () => {
  it("assumes nothing for a student in their first term", () => {
    const result = assumedHistory(version, { year: 1, kind: "semester1" });
    expect(result.courses).toEqual([]);
    expect(result.placeholders).toEqual([]);
  });

  it("assumes the first semester for a student in their second", () => {
    const result = assumedHistory(version, { year: 1, kind: "semester2" });
    expect(result.courses).toContain("TU100");
    expect(result.courses).toContain("PD102");
    expect(result.courses).not.toContain("PI211");
  });

  it("orders terms correctly across years, putting summer after semester 2", () => {
    const result = assumedHistory(version, { year: 3, kind: "semester1" });
    expect(result.courses).toContain("PI321");
    expect(result.courses).not.toContain("PI300");
  });

  it("returns placeholders separately from named courses", () => {
    const result = assumedHistory(version, { year: 3, kind: "semester2" });
    expect(result.placeholders.length).toBeGreaterThan(0);
    for (const slot of result.placeholders) {
      expect(slot.id.length).toBeGreaterThan(0);
      expect(result.courses).not.toContain(slot.id);
    }
  });

  it("never returns a code that is not a real course", () => {
    const codes = new Set(version.courses.value.map((c) => c.code));
    const result = assumedHistory(version, { year: 4, kind: "semester1" });
    for (const code of result.courses) expect(codes.has(code)).toBe(true);
  });

  it("does not double-count a course that appears in two terms", () => {
    const result = assumedHistory(version, { year: 4, kind: "semester2" });
    expect(new Set(result.courses).size).toBe(result.courses.length);
  });
});

describe("remainingRequirements", () => {
  it("owes the full requirement when nothing has been passed", () => {
    const shortfalls = remainingRequirements(version, [], "governance");
    const total = shortfalls.reduce((n, s) => n + s.remaining, 0);
    expect(total).toBe(version.graduationCredits.value);
  });

  it("credits a passed course against its own category", () => {
    const shortfalls = remainingRequirements(version, ["PI211"], "governance");
    const core = shortfalls.find((s) => s.category.id === "core");
    expect(core?.earned).toBe(3);
    expect(core?.remaining).toBe(27);
  });

  it("ignores courses excluded from the total", () => {
    const v2568 = CURRICULUM_VERSIONS["2568"];
    const shortfalls = remainingRequirements(v2568, ["PI574"], "governance");
    const concentration = shortfalls.find((s) => s.category.id === "concentrationRequired");
    expect(concentration?.earned).toBe(0);
  });

  it("counts a minor course into the bucket the chosen minor puts it in", () => {
    const asGovernance = remainingRequirements(version, ["PI380"], "governance");
    expect(asGovernance.find((s) => s.category.id === "minorRequired")?.earned).toBe(3);
    expect(asGovernance.find((s) => s.category.id === "minorElectiveOther")?.earned).toBe(0);
  });

  it("counts the same course into a different bucket for a different minor", () => {
    const asGpe = remainingRequirements(version, ["PI380"], "globalPoliticalEconomy");
    expect(asGpe.find((s) => s.category.id === "minorRequired")?.earned).toBe(0);
    expect(asGpe.find((s) => s.category.id === "minorElectiveOther")?.earned).toBe(3);
  });

  it("never puts credit into the pooled 'minor' category itself", () => {
    const shortfalls = remainingRequirements(version, ["PI380", "PI385"], "governance");
    expect(shortfalls.some((s) => s.category.id === "minor")).toBe(false);
  });

  it("never reports a negative remaining", () => {
    const everything = version.courses.value.map((c) => c.code);
    for (const s of remainingRequirements(version, everything, "governance")) {
      expect(s.remaining).toBeGreaterThanOrEqual(0);
    }
  });
});
