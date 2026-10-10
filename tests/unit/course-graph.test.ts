import { describe, expect, it } from "vitest";
import { courses } from "@/content/course-review/courses";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import { EQUIVALENCES } from "@/content/curriculum/equivalences";
import type { CurriculumVersionId } from "@/content/curriculum/types";
import {
  CURRENT_VERSION,
  VERSION_ORDER,
  allCourseCodes,
  codesIn,
  counterparts,
  countsTowards,
  courseNode,
  equivalentTo,
  hasPage,
  prerequisiteChain,
  prerequisites,
  recommendedIn,
  unlocks,
  versionsOf,
} from "@/lib/courses/graph";

const versionIds = Object.keys(CURRICULUM_VERSIONS) as CurriculumVersionId[];

describe("course graph: nodes", () => {
  it("orders every curriculum version, oldest first, and no other", () => {
    expect([...VERSION_ORDER].sort()).toEqual([...versionIds].sort());
    expect(VERSION_ORDER.at(-1)).toBe(CURRENT_VERSION);
  });

  it("has one node per code across all versions, sorted", () => {
    const expected = new Set(
      versionIds.flatMap((id) => CURRICULUM_VERSIONS[id].courses.value).map((c) => c.code)
    );
    expect(allCourseCodes()).toEqual([...expected].sort());
  });

  it("carries, for each version that lists a code, that version's own entry", () => {
    for (const id of versionIds) {
      for (const course of CURRICULUM_VERSIONS[id].courses.value) {
        const facts = courseNode(course.code)?.versions[id];
        expect(facts, `${course.code} in ${id}`).toMatchObject({
          version: id,
          title: course.title,
          credits: course.credits,
          category: course.category,
          prerequisites: course.prerequisites,
        });
      }
    }
  });

  it("keeps per-version differences instead of flattening them (PI574 credits)", () => {
    const node = courseNode("PI574")!;
    expect(node.versions["2564"]?.credits).toBe(1);
    expect(node.versions["2568"]?.credits).toBe(3);
    expect(node.versions["2568"]?.category).toBe("freeElective");
    expect(node.latest.version).toBe("2568");
  });

  it("uses the latest version that lists a code for the headline facts", () => {
    expect(courseNode("TU104")?.latest.version).toBe("2564");
    expect(courseNode("TU104")?.title).toBe("Critical Thinking, Reading, and Writing");
    expect(courseNode("LAS101")?.latest.version).toBe("2568");
  });

  it("attaches the catalogue entry to exactly the PI catalogue codes", () => {
    for (const course of courses) {
      expect(courseNode(course.code)?.catalogue, course.code).toBe(course);
    }
    const withEntry = allCourseCodes().filter((code) => courseNode(code)?.catalogue);
    expect(withEntry).toEqual(courses.map((c) => c.code));
    expect(courseNode("TU101")?.catalogue).toBeUndefined();
  });

  it("returns nothing for a code no version lists", () => {
    expect(courseNode("PI999")).toBeUndefined();
    expect(hasPage("PI999")).toBe(false);
    expect(versionsOf("PI999")).toEqual([]);
    expect(prerequisites("PI999", "2568")).toEqual([]);
    expect(unlocks("PI999", "2568")).toEqual([]);
    expect(countsTowards("PI999", "2568")).toBeUndefined();
    expect(recommendedIn("PI999", "2568")).toEqual([]);
    expect(prerequisiteChain("PI999", "2568")).toEqual([]);
  });

  it("lists the versions of a code oldest first", () => {
    expect(versionsOf("PI211")).toEqual(["2564", "2564-rev2566", "2568"]);
    expect(versionsOf("TU104")).toEqual(["2564"]);
    expect(versionsOf("LAS101")).toEqual(["2564-rev2566", "2568"]);
  });
});

describe.each(versionIds)("course graph integrity: %s", (id) => {
  const version = CURRICULUM_VERSIONS[id];
  const codes = new Set(codesIn(id));

  it("lists each code once", () => {
    expect(codes.size).toBe(version.courses.value.length);
  });

  it("resolves every prerequisite to a node in the same version", () => {
    for (const code of codes) {
      for (const prerequisite of prerequisites(code, id)) {
        expect(codes.has(prerequisite), `${code} needs ${prerequisite}`).toBe(true);
        expect(hasPage(prerequisite), prerequisite).toBe(true);
      }
    }
  });

  it("resolves every course in the recommended plan, and every placeholder choice, to a node", () => {
    for (const planned of version.recommendedPlan.value) {
      for (const entry of planned.entries) {
        const named = entry.kind === "course" ? [entry.code] : (entry.choices ?? []);
        for (const code of named) {
          expect(codes.has(code), `${code} in ${id}`).toBe(true);
          // A named course is placed in a term; a choice is only offered by one.
          if (entry.kind === "course") {
            expect(recommendedIn(code, id).length, code).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it("resolves every minor course to a node in the same version", () => {
    for (const minor of version.minors) {
      for (const code of [...minor.required, ...minor.electives]) {
        expect(codes.has(code), `${minor.id} lists ${code}`).toBe(true);
        expect(courseNode(code)?.versions[id]?.minors.map((m) => m.id)).toContain(minor.id);
      }
    }
  });

  it("has prerequisites and unlocks that are exact inverses", () => {
    for (const code of codes) {
      for (const prerequisite of prerequisites(code, id)) {
        expect(unlocks(prerequisite, id), `${prerequisite} unlocks ${code}`).toContain(code);
      }
      for (const next of unlocks(code, id)) {
        expect(prerequisites(next, id), `${next} needs ${code}`).toContain(code);
      }
    }
  });

  it("has no prerequisite cycle", () => {
    // A cycle would make `prerequisiteChain` stop short, so look for one
    // directly: a code that can reach itself through unlocks.
    for (const start of codes) {
      const seen = new Set<string>();
      const queue = unlocks(start, id);
      while (queue.length > 0) {
        const code = queue.pop()!;
        expect(code, `${start} depends on itself`).not.toBe(start);
        if (seen.has(code)) continue;
        seen.add(code);
        queue.push(...unlocks(code, id));
      }
    }
  });

  it("counts every course towards a bucket the version defines (minor courses pooled)", () => {
    const buckets = new Set<string>(version.categories.map((c) => c.id));
    for (const code of codes) {
      const counted = countsTowards(code, id)!;
      expect(buckets.has(counted.category) || counted.category === "minor", code).toBe(true);
      expect(counted.category === "minor", code).toBe(counted.minors.length > 0);
    }
  });
});

describe("course graph: other versions", () => {
  it("gives a code no facts in a version that omits it", () => {
    expect(prerequisites("TU104", "2568")).toEqual([]);
    expect(countsTowards("TU104", "2568")).toBeUndefined();
    expect(recommendedIn("TU104", "2568")).toEqual([]);
  });

  it("has the same prerequisites in every version that lists a code", () => {
    // The facts-only page shows one prerequisite list, taken from the latest
    // version. If this fails, a version has diverged and the page must show
    // prerequisites per version instead.
    for (const code of allCourseCodes()) {
      const lists = versionsOf(code).map((id) => prerequisites(code, id).join());
      expect(new Set(lists).size, code).toBe(1);
    }
  });
});

describe("prerequisiteChain", () => {
  it("follows dependents transitively, nearest first", () => {
    const chain = prerequisiteChain("PI271", "2568");
    expect(chain[0]).toBe("PI280");
    expect(chain).toHaveLength(2);
    expect(prerequisites(chain[1]!, "2568")).toEqual(["PI280"]);
  });

  it("is empty for a course nothing depends on", () => {
    expect(prerequisiteChain("PI364", "2568")).toEqual([]);
    expect(prerequisiteChain("TU101", "2568")).toEqual([]);
  });

  it("is a real chain: each link needs the one before", () => {
    for (const id of versionIds) {
      for (const code of codesIn(id)) {
        let previous = code;
        for (const next of prerequisiteChain(code, id)) {
          expect(prerequisites(next, id), `${previous} then ${next}`).toContain(previous);
          previous = next;
        }
      }
    }
  });

  it("is never shorter than the chain through any single dependent", () => {
    for (const code of codesIn("2568")) {
      const length = prerequisiteChain(code, "2568").length;
      for (const next of unlocks(code, "2568")) {
        expect(length, code).toBeGreaterThanOrEqual(1 + prerequisiteChain(next, "2568").length);
      }
    }
  });

  it("is stable when two chains tie, preferring the lower code", () => {
    const chain = prerequisiteChain("PI271", "2568");
    expect(chain[1]).toBe(unlocks("PI280", "2568")[0]);
  });
});

describe("equivalences", () => {
  it("point at real codes, in versions that list them", () => {
    expect(EQUIVALENCES.length).toBeGreaterThan(0);
    for (const { from, to, since } of EQUIVALENCES) {
      expect(hasPage(from), from).toBe(true);
      expect(hasPage(to), to).toBe(true);
      expect(versionsOf(from), `${from} is the earlier code`).not.toContain(since);
      expect(versionsOf(to)[0], `${to} first appears in ${since}`).toBe(since);
    }
  });

  it("pair courses whose facts agree, which is what each inferred reason says", () => {
    for (const { from, to, since } of EQUIVALENCES) {
      const earlier = courseNode(from)!.latest;
      const later = courseNode(to)!.versions[since]!;
      expect(later.credits, `${from} and ${to} credits`).toBe(earlier.credits);
      expect(later.category, `${from} and ${to} category`).toBe(earlier.category);
      expect(later.recommendedTerms, `${from} and ${to} term`).toEqual(earlier.recommendedTerms);
    }
  });

  it("each carry a derivation, a bilingual reason when inferred, and no sign-off yet", () => {
    for (const entry of EQUIVALENCES) {
      if (entry.derivation.kind === "inferred") {
        expect(entry.derivation.reason.en.length, entry.from).toBeGreaterThan(0);
        expect(entry.derivation.reason.th.length, entry.from).toBeGreaterThan(0);
      }
      expect(entry.verifiedBy, entry.from).toBeNull();
      expect(entry.verifiedOn, entry.from).toBeNull();
    }
  });

  it("list each pairing once and use each code at most once as a source", () => {
    const keys = EQUIVALENCES.map((e) => `${e.from}>${e.to}`);
    expect(new Set(keys).size).toBe(keys.length);
    const sources = EQUIVALENCES.map((e) => e.from);
    expect(new Set(sources).size).toBe(sources.length);
  });

  it("can be read from either end", () => {
    expect(equivalentTo("TU104")).toMatchObject([{ code: "LAS101", relation: "replacedBy" }]);
    expect(equivalentTo("LAS101")).toMatchObject([{ code: "TU104", relation: "replaces" }]);
    expect(equivalentTo("PI211")).toEqual([]);
  });

  it("find a counterpart in each version", () => {
    expect(counterparts("PI211", "2568")).toEqual(["PI211"]);
    expect(counterparts("TU104", "2564")).toEqual(["TU104"]);
    expect(counterparts("TU104", "2564-rev2566")).toEqual(["LAS101"]);
    expect(counterparts("LAS101", "2564")).toEqual(["TU104"]);
    expect(counterparts("TU050", "2568")).toEqual([]);
  });
});

describe("a page for every code", () => {
  it("exists for every code in every version", () => {
    for (const id of versionIds) {
      for (const code of codesIn(id)) expect(hasPage(code), `${code} in ${id}`).toBe(true);
    }
  });

  it("exists for every code in every version's recommended plan", () => {
    for (const id of versionIds) {
      for (const planned of CURRICULUM_VERSIONS[id].recommendedPlan.value) {
        for (const entry of planned.entries) {
          if (entry.kind === "course")
            expect(hasPage(entry.code), `${entry.code} in ${id}`).toBe(true);
        }
      }
    }
  });

  it("covers the whole review catalogue, which is in the current version", () => {
    for (const course of courses) {
      expect(hasPage(course.code), course.code).toBe(true);
      expect(courseNode(course.code)?.versions[CURRENT_VERSION], course.code).toBeDefined();
    }
  });
});
