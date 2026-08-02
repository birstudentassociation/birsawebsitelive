import { describe, expect, it } from "vitest";
import {
  CURRICULUM_VERSIONS,
  resolveCohort,
  inferredParts,
  disclosures,
  resolveMinorCategory,
} from "@/content/curriculum";
import type { CurriculumVersion } from "@/content/curriculum/types";

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

  it("returns the mapping so callers can see its provenance", () => {
    // Cohort 69 used to be the example of an attested (as opposed to
    // documented) mapping; BIRSA confirmed on 2026-08-02 that it is in fact
    // printed in comparison2568 alongside cohort 68, so both are now
    // `document`. No real curriculum version currently carries an `attested`
    // cohort mapping; the scoping mechanism that would filter a disclosure
    // for one is still exercised with a synthetic fixture below.
    const result = resolveCohort("69");
    if (result.status !== "supported") throw new Error("unreachable");
    expect(result.mapping.provenance.kind).toBe("document");
    expect(result.mapping.provenance).toMatchObject({ source: "comparison2568", page: 1 });
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

  it("returns every disclosure when no cohort code is given", () => {
    // Existing callers (and this file's other tests) call disclosures(version)
    // with no cohort code and expect every disclosure back, unfiltered.
    // cohort-67-attested was deleted once the official curriculum page
    // documented cohort 67, so total-never-printed is the remaining
    // disclosure on this version to check for.
    const rev2566 = CURRICULUM_VERSIONS["2564-rev2566"];
    expect(disclosures(rev2566).map((c) => c.id)).toContain("total-never-printed");
  });

  it("scopes a cohort-limited contradiction away from non-matching cohorts", () => {
    // No real curriculum version carries a cohort-scoped contradiction any
    // more (cohort-69-attested was deleted once BIRSA confirmed cohort 69's
    // mapping is printed, mirroring cohort-67-attested's earlier deletion).
    // The scoping mechanism in `disclosures` itself is unchanged and still
    // needs a test, so this drives it with a synthetic fixture instead of a
    // real version: only `verification.contradictions` is populated with
    // real data (one contradiction scoped to a made-up cohort "99", one
    // unscoped), every other required field is filled with an empty or
    // trivial placeholder, and the object is cast through `unknown` because
    // `CurriculumVersionId` is a closed union that a fixture id can't join.
    const fixture = {
      id: "2564",
      label: { en: "", th: "" },
      cohorts: [],
      graduationCredits: { value: 0, derivation: { kind: "published", source: "handbook2021" } },
      categories: [],
      minors: [],
      courses: { value: [], derivation: { kind: "published", source: "handbook2021" } },
      recommendedPlan: { value: [], derivation: { kind: "published", source: "handbook2021" } },
      rules: {
        value: {
          minCreditsRegularTerm: 0,
          maxCreditsRegularTerm: 0,
          maxCreditsSummerTerm: 0,
          minSemesters: 0,
          maxYears: 0,
          minGpa: 0,
          source: { document: "handbook2021", provision: "" },
        },
        derivation: { kind: "published", source: "handbook2021" },
      },
      distinguishingCourses: [],
      verification: {
        verifiedBy: null,
        verifiedOn: null,
        sources: [],
        contradictions: [
          {
            id: "scoped-to-99",
            summary: "fixture: scoped to a cohort that never asks",
            disclosure: { en: "scoped disclosure text long enough", th: "ข้อความเปิดเผยเฉพาะกลุ่ม" },
            cohorts: ["99"],
          },
          {
            id: "unscoped",
            summary: "fixture: applies to everyone",
            disclosure: { en: "unscoped disclosure text long enough", th: "ข้อความเปิดเผยทั่วไป" },
          },
        ],
      },
    } as unknown as CurriculumVersion;

    // Matching cohort code: both the scoped and unscoped disclosure show.
    expect(disclosures(fixture, "99").map((c) => c.id)).toEqual(
      expect.arrayContaining(["scoped-to-99", "unscoped"])
    );
    // Non-matching cohort code: the scoped disclosure is filtered out.
    expect(disclosures(fixture, "68").map((c) => c.id)).toEqual(["unscoped"]);
    // No cohort code at all: every disclosure is returned, unfiltered.
    expect(disclosures(fixture).map((c) => c.id)).toEqual(
      expect.arrayContaining(["scoped-to-99", "unscoped"])
    );
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
