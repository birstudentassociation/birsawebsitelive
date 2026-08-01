import { describe, expect, it } from "vitest";
import {
  CURRICULUM_VERSIONS,
  resolveCohort,
  inferredParts,
  disclosures,
  resolveMinorCategory,
} from "@/content/curriculum";

describe("resolveCohort", () => {
  it("resolves every enrolled cohort to exactly one version", () => {
    const expected: Record<string, string> = {
      "64": "2564",
      "65": "2564",
      "66": "2564-rev2566",
      "67": "2564-rev2566",
      "68": "2568",
      "69": "2568",
    };
    for (const [code, versionId] of Object.entries(expected)) {
      const result = resolveCohort(code);
      expect(result.status, `cohort ${code}`).toBe("supported");
      if (result.status !== "supported") throw new Error("unreachable");
      expect(result.version.id, `cohort ${code}`).toBe(versionId);
    }
  });

  it("returns unsupported for cohorts outside 64 to 69", () => {
    for (const code of ["61", "62", "63", "70", "99", "", "6", "abc", "664"]) {
      expect(resolveCohort(code).status, `cohort ${code}`).toBe("unsupported");
    }
  });

  it("never maps one cohort code to two versions", () => {
    const seen = new Map<string, string>();
    for (const version of Object.values(CURRICULUM_VERSIONS)) {
      for (const cohort of version.cohorts) {
        expect(seen.has(cohort.code), `cohort ${cohort.code} claimed twice`).toBe(false);
        seen.set(cohort.code, version.id);
      }
    }
  });

  it("returns the mapping so callers can see attested from documented", () => {
    const result = resolveCohort("67");
    if (result.status !== "supported") throw new Error("unreachable");
    expect(result.mapping.provenance.kind).toBe("attested");
  });
});

describe("inferredParts", () => {
  it("finds the borrowed study plan on 2568 only", () => {
    expect(inferredParts(CURRICULUM_VERSIONS["2568"])).toHaveLength(1);
    expect(inferredParts(CURRICULUM_VERSIONS["2564"])).toHaveLength(0);
    expect(inferredParts(CURRICULUM_VERSIONS["2564-rev2566"])).toHaveLength(0);
  });
});

describe("disclosures", () => {
  it("returns only contradictions that have something to say to a student", () => {
    const shown = disclosures(CURRICULUM_VERSIONS["2568"]);
    expect(shown.every((c) => c.disclosure !== null)).toBe(true);
    expect(shown.map((c) => c.id)).not.toContain("catalogue-identical");
  });

  it("scopes a cohort-specific disclosure away from a cohort it does not name", () => {
    const rev2566 = CURRICULUM_VERSIONS["2564-rev2566"];
    // Cohort 66's mapping to this version is printed in a document; the
    // cohort-67 attestation disclosure would be false for a cohort-66 reader.
    expect(disclosures(rev2566, "66").map((c) => c.id)).not.toContain("cohort-67-attested");
    expect(disclosures(rev2566, "67").map((c) => c.id)).toContain("cohort-67-attested");
  });

  it("returns every disclosure when no cohort code is given", () => {
    // Existing callers (and this file's other tests) call disclosures(version)
    // with no cohort code and expect every disclosure back, unfiltered.
    const rev2566 = CURRICULUM_VERSIONS["2564-rev2566"];
    expect(disclosures(rev2566).map((c) => c.id)).toContain("cohort-67-attested");
  });
});

describe("resolveMinorCategory", () => {
  const version = CURRICULUM_VERSIONS["2564-rev2566"];

  it("counts your own minor's required course as minorRequired", () => {
    expect(resolveMinorCategory(version, "governance", "PI380")).toBe("minorRequired");
  });

  it("counts your own minor's elective as minorElective", () => {
    expect(resolveMinorCategory(version, "governance", "PI385")).toBe("minorElective");
  });

  it("counts another minor's course as minorElectiveOther, required or not", () => {
    expect(resolveMinorCategory(version, "globalPoliticalEconomy", "PI380")).toBe(
      "minorElectiveOther"
    );
    expect(resolveMinorCategory(version, "globalPoliticalEconomy", "PI385")).toBe(
      "minorElectiveOther"
    );
  });

  it("gives the same course a different bucket for a different minor", () => {
    expect(resolveMinorCategory(version, "governance", "PI380")).not.toBe(
      resolveMinorCategory(version, "publicAdministration", "PI380")
    );
  });

  it("returns null for a course that is in no minor at all", () => {
    expect(resolveMinorCategory(version, "governance", "PI211")).toBeNull();
  });
});
