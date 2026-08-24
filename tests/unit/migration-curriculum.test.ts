/**
 * Tests for the curriculum / course-review migration (REDESIGN-2.0 §11.4
 * item 6, Wave 6D). See lib/migration/curriculum.ts's file header for why
 * this family migrates and what these functions are for.
 *
 * These tests exercise the transform and verification logic directly
 * against the real content in content/curriculum/** and
 * content/course-review/courses.ts — not fixtures — because a fixture would
 * pass even if the real data broke one of these invariants tomorrow, which
 * is exactly the failure mode this family cannot afford (see the brief: "a
 * dropped prerequisite or a wrong credit total is not a cosmetic migration
 * bug, it is a student who takes the wrong course").
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildCourseReviewDocuments,
  buildCurriculumVersionDocuments,
  buildMigrationEntries,
  checkBilingualParity,
  checkCohortsUnique,
  checkCourseReviewCodesExistInCurriculum,
  checkCourseReviewPrerequisiteCodesResolve,
  checkCreditArithmetic,
  checkFileOutcomesComplete,
  checkIdUniqueness,
  checkPrerequisiteCycles,
  checkPrerequisitesResolve,
  checkSourcesHaveUrlOrNote,
  courseReviewDocId,
  courseReviewToDocument,
  curriculumVersionDocId,
  curriculumVersionToDocument,
  listFamilyFiles,
  runAllChecks,
  writeCurriculumMigrationReport,
} from "@/lib/migration/curriculum";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import { courses as courseReviewCourses } from "@/content/course-review/courses";

describe("id derivation", () => {
  it("delegates to lib/migration/ids.ts's documentId, deterministic and namespaced per document type", () => {
    expect(curriculumVersionDocId("2564")).toBe("curriculum-version-2564");
    expect(curriculumVersionDocId("2564-rev2566")).toBe("curriculum-version-2564-rev2566");
    expect(curriculumVersionDocId("2568")).toBe("curriculum-version-2568");
    expect(courseReviewDocId("PI280")).toBe("course-review-pi280");
  });
});

describe("buildCurriculumVersionDocuments / buildCourseReviewDocuments", () => {
  it("produces exactly one document per curriculum version, sorted by version id", () => {
    const docs = buildCurriculumVersionDocuments();
    expect(docs.map((d) => d.versionId)).toEqual(["2564", "2564-rev2566", "2568"]);
    expect(docs).toHaveLength(Object.keys(CURRICULUM_VERSIONS).length);
  });

  it("produces exactly one document per course-review course, sorted by code", () => {
    const docs = buildCourseReviewDocuments();
    expect(docs).toHaveLength(courseReviewCourses.length);
    const codes = docs.map((d) => d.code);
    expect(codes).toEqual([...codes].sort((a, b) => a.localeCompare(b)));
  });

  it("is byte-identical across repeated runs (the shared brief's determinism requirement)", () => {
    const first = JSON.stringify([
      ...buildCurriculumVersionDocuments(),
      ...buildCourseReviewDocuments(),
    ]);
    const second = JSON.stringify([
      ...buildCurriculumVersionDocuments(),
      ...buildCourseReviewDocuments(),
    ]);
    expect(second).toBe(first);
  });

  it("carries every field through unchanged: transforming a version round-trips its data", () => {
    const version = CURRICULUM_VERSIONS["2564"];
    const doc = curriculumVersionToDocument(version);
    expect(doc.label).toEqual(version.label);
    expect(doc.graduationCredits.value).toBe(version.graduationCredits.value);
    expect(doc.courses.value.map((c) => c.code)).toEqual(version.courses.value.map((c) => c.code));
    expect(doc.courses.value.map((c) => c.credits)).toEqual(
      version.courses.value.map((c) => c.credits)
    );
    expect(doc.courses.value.map((c) => c.prerequisites)).toEqual(
      version.courses.value.map((c) => c.prerequisites)
    );
  });

  it("gives every array-of-object entry a unique _key within its own array", () => {
    for (const doc of buildCurriculumVersionDocuments()) {
      const keySets = [
        doc.cohorts.map((c) => c._key),
        doc.categories.map((c) => c._key),
        doc.minors.map((m) => m._key),
        doc.courses.value.map((c) => c._key),
        doc.verification.sources.map((s) => s._key),
        doc.verification.contradictions.map((c) => c._key),
      ];
      for (const keys of keySets) {
        expect(new Set(keys).size, doc._id).toBe(keys.length);
      }
      for (const term of doc.recommendedPlan.value) {
        const entryKeys = term.entries.map((e) => e._key);
        expect(new Set(entryKeys).size, `${doc._id} ${term._key}`).toBe(entryKeys.length);
      }
    }
  });
});

describe("checkFileOutcomesComplete / listFamilyFiles / buildMigrationEntries", () => {
  it("finds every content/curriculum and content/course-review .ts file accounted for, with zero unaccounted", () => {
    const courseDocs = buildCourseReviewDocuments();
    expect(checkFileOutcomesComplete(courseDocs)).toEqual([]);
  });

  it("lists exactly the 8 files the Wave 6D brief names as this family, on disk and in the entries", () => {
    const expected = [
      "content/curriculum/types.ts",
      "content/curriculum/sources.ts",
      "content/curriculum/index.ts",
      "content/curriculum/2564.ts",
      "content/curriculum/2564-rev2566.ts",
      "content/curriculum/2568.ts",
      "content/course-review/types.ts",
      "content/course-review/courses.ts",
    ].sort();
    expect(listFamilyFiles().sort()).toEqual(expected);
    const courseDocs = buildCourseReviewDocuments();
    expect(
      buildMigrationEntries(courseDocs)
        .map((e) => e.sourcePath)
        .sort()
    ).toEqual(expected);
  });

  it("gives the course-review catalogue a migrated entry naming all its documents", () => {
    const courseDocs = buildCourseReviewDocuments();
    const entry = buildMigrationEntries(courseDocs).find(
      (e) => e.sourcePath === "content/course-review/courses.ts"
    );
    expect(entry?.status).toBe("migrated");
    expect(entry?.notes).toHaveLength(courseDocs.length);
  });
});

describe("checkIdUniqueness", () => {
  it("passes for the real, migrated documents", () => {
    const docs = [...buildCurriculumVersionDocuments(), ...buildCourseReviewDocuments()];
    expect(checkIdUniqueness(docs)).toEqual([]);
  });

  it("catches a collision", () => {
    const docs = [{ _id: "same", _type: "a" } as const, { _id: "same", _type: "b" } as const];
    expect(checkIdUniqueness(docs)).toEqual([
      'duplicate _id "same" appears 2 times across the artifact',
    ]);
  });
});

describe("checkBilingualParity", () => {
  it("passes for every real curriculum version and course-review document", () => {
    for (const doc of buildCurriculumVersionDocuments()) {
      expect(checkBilingualParity(doc, doc._id), doc._id).toEqual([]);
    }
    for (const doc of buildCourseReviewDocuments()) {
      expect(checkBilingualParity(doc, doc._id), doc._id).toEqual([]);
    }
  });

  it("catches an empty side of a bilingual pair", () => {
    expect(checkBilingualParity({ label: { en: "Hello", th: "" } }, "doc")).toEqual([
      "doc.label.th is empty",
    ]);
    expect(checkBilingualParity({ label: { en: "  ", th: "สวัสดี" } }, "doc")).toEqual([
      "doc.label.en is empty",
    ]);
  });

  it("does not misfire on a plain string field (e.g. curriculum Course.title, English-only by design)", () => {
    expect(checkBilingualParity({ title: "English only, on purpose" }, "doc")).toEqual([]);
  });
});

describe("checkSourcesHaveUrlOrNote", () => {
  it("passes for the real data", () => {
    expect(checkSourcesHaveUrlOrNote(buildCurriculumVersionDocuments())).toEqual([]);
  });
});

describe("checkCreditArithmetic", () => {
  it("passes for all three real curriculum versions", () => {
    expect(checkCreditArithmetic(buildCurriculumVersionDocuments())).toEqual([]);
  });

  it("catches a version whose category credits don't sum to its graduation total", () => {
    const docs = buildCurriculumVersionDocuments();
    const broken = {
      ...docs[0]!,
      graduationCredits: { ...docs[0]!.graduationCredits, value: 999 },
    };
    const issues = checkCreditArithmetic([broken]);
    expect(issues).toHaveLength(1);
    expect(issues[0]).toContain("graduationCredits.value is 999");
  });
});

describe("checkPrerequisitesResolve / checkPrerequisiteCycles", () => {
  it("finds every prerequisite resolving to a real course, in all three real versions", () => {
    expect(checkPrerequisitesResolve(buildCurriculumVersionDocuments())).toEqual([]);
  });

  it("finds no prerequisite cycles in any real version", () => {
    expect(checkPrerequisiteCycles(buildCurriculumVersionDocuments())).toEqual([]);
  });

  it("catches a direct two-course cycle", () => {
    const docs = buildCurriculumVersionDocuments();
    const [a, b] = docs[0]!.courses.value;
    const tampered = {
      ...docs[0]!,
      courses: {
        ...docs[0]!.courses,
        value: docs[0]!.courses.value.map((c) => {
          if (c.code === a!.code) return { ...c, prerequisites: [b!.code] };
          if (c.code === b!.code) return { ...c, prerequisites: [a!.code] };
          return c;
        }),
      },
    };
    const issues = checkPrerequisiteCycles([tampered]);
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0]).toContain("prerequisite cycle");
  });
});

describe("checkCohortsUnique", () => {
  it("passes for the real registry (no cohort claimed twice)", () => {
    expect(checkCohortsUnique(buildCurriculumVersionDocuments())).toEqual([]);
  });

  it("catches two versions claiming the same cohort code", () => {
    const docs = buildCurriculumVersionDocuments();
    const clashing = { ...docs[1]!, cohorts: docs[0]!.cohorts };
    const issues = checkCohortsUnique([docs[0]!, clashing]);
    expect(issues.length).toBeGreaterThan(0);
  });
});

describe("checkCourseReviewCodesExistInCurriculum", () => {
  it("finds every real course-review code in some curriculum version's catalogue", () => {
    const issues = checkCourseReviewCodesExistInCurriculum(
      buildCourseReviewDocuments(),
      buildCurriculumVersionDocuments()
    );
    expect(issues).toEqual([]);
  });

  it("catches a course-review entry for a code no curriculum version teaches", () => {
    const fake = courseReviewToDocument({ ...courseReviewCourses[0]!, code: "ZZ999" });
    const issues = checkCourseReviewCodesExistInCurriculum(
      [fake],
      buildCurriculumVersionDocuments()
    );
    expect(issues).toEqual([
      'course-review-zz999: code "ZZ999" does not appear in any curriculum version\'s catalogue',
    ]);
  });
});

describe("checkCourseReviewPrerequisiteCodesResolve", () => {
  it("finds every extractable prerequisite code resolving to a real course, for the real data", () => {
    const issues = checkCourseReviewPrerequisiteCodesResolve(
      buildCourseReviewDocuments(),
      buildCurriculumVersionDocuments()
    );
    expect(issues).toEqual([]);
  });

  it("catches a prerequisite that names a course code nothing teaches", () => {
    const fake = courseReviewToDocument({
      ...courseReviewCourses[0]!,
      prerequisite: { en: "Have earned credits of ZZ999", th: "สอบได้วิชา ZZ999" },
    });
    const issues = checkCourseReviewPrerequisiteCodesResolve(
      [fake],
      buildCurriculumVersionDocuments()
    );
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0]).toContain("ZZ999");
  });
});

describe("runAllChecks", () => {
  it("finds zero issues across the whole real family", () => {
    const issues = runAllChecks(buildCurriculumVersionDocuments(), buildCourseReviewDocuments());
    expect(issues).toEqual([]);
  });
});

describe("writeCurriculumMigrationReport", () => {
  it("is deterministic, accounts for every file, and writes a byte-identical report across runs", () => {
    const versionDocs = buildCurriculumVersionDocuments();
    const courseDocs = buildCourseReviewDocuments();
    const reportPath = path.join(process.cwd(), "docs/migration/curriculum.md");

    const first = writeCurriculumMigrationReport(versionDocs, courseDocs);
    const firstMarkdown = readFileSync(reportPath, "utf8");
    const second = writeCurriculumMigrationReport(versionDocs, courseDocs);
    const secondMarkdown = readFileSync(reportPath, "utf8");

    expect(first.unaccounted).toEqual([]);
    expect(second.unaccounted).toEqual(first.unaccounted);
    expect(second.counts).toEqual(first.counts);
    expect(secondMarkdown).toBe(firstMarkdown);
    for (const doc of versionDocs) expect(firstMarkdown).toContain(doc._id);
    for (const doc of courseDocs) expect(firstMarkdown).toContain(doc._id);
  });
});
