/**
 * One read model over every course the site knows about: the three curriculum
 * versions and the PI course-review catalogue.
 *
 * There is one node per course code. A node carries what each curriculum
 * version says about the code (title, credits, category, prerequisites,
 * recommended terms, minor membership) and, when the code is in the review
 * catalogue, the catalogue's extras. Everything is derived from the curriculum
 * modules at import time, so nothing here is written by hand per course and
 * nothing can drift from them. The one hand-kept input is
 * `content/curriculum/equivalences.ts`, because a pairing across versions is a
 * judgement the sources do not state.
 *
 * The edge queries take a version id wherever the answer depends on the
 * version. They never fall back to another version: a code that a version does
 * not list has no prerequisites, no unlocks and no category in it, and the
 * caller is told so rather than handed a neighbour's answer.
 *
 * Pure functions over static data, no React, so the course pages, the study
 * plan and anything later can share them.
 */
import { courses as catalogueCourses } from "@/content/course-review/courses";
import type { Course as CatalogueCourse } from "@/content/course-review/types";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import { EQUIVALENCES, type Equivalence } from "@/content/curriculum/equivalences";
import type {
  CategoryId,
  Course as CurriculumCourse,
  CurriculumVersion,
  CurriculumVersionId,
  Derivation,
  LocalizedText,
  MinorId,
  TermRef,
} from "@/content/curriculum/types";

/** Oldest first. Anything that needs "the latest version of a code" relies on this order. */
export const VERSION_ORDER: readonly CurriculumVersionId[] = ["2564", "2564-rev2566", "2568"];

/**
 * The version the course-review pages have always described. `lib/course-review/facts.ts`
 * is pinned to it, and every catalogue course is in it (a test enforces that).
 */
export const CURRENT_VERSION: CurriculumVersionId = "2568";

/** A minor a course counts towards, and whether it is required or elective there. */
export type MinorMembership = {
  id: MinorId;
  name: LocalizedText;
  role: "required" | "elective";
};

/**
 * What one curriculum version says about a code. It is the version's own
 * `Course` entry, so `title` is English in both locales, plus the two facts
 * that live elsewhere in the module: where the recommended plan puts the
 * course, and which minors list it.
 */
export type VersionFacts = CurriculumCourse & {
  version: CurriculumVersionId;
  /** Every term of the version's recommended plan that names the course. */
  recommendedTerms: readonly TermRef[];
  minors: readonly MinorMembership[];
};

export type CourseNode = {
  code: string;
  /** English, from the latest version that lists the code. */
  title: string;
  /** Facts per version, present only for the versions that list the code. */
  versions: Partial<Record<CurriculumVersionId, VersionFacts>>;
  /** The facts from the latest version that lists the code. */
  latest: VersionFacts;
  /** The review catalogue's entry, present only for the PI catalogue courses. */
  catalogue?: CatalogueCourse;
};

/** Where a course counts in one version. Minor courses carry the pooled `"minor"` category. */
export type CountsTowards = {
  category: CategoryId;
  minors: readonly MinorMembership[];
};

/** A course on the other end of an equivalence, seen from one of its two codes. */
export type EquivalentCourse = {
  code: string;
  /** `replacedBy` when the queried code is the earlier one, `replaces` when it is the later. */
  relation: "replacedBy" | "replaces";
  since: CurriculumVersionId;
  derivation: Derivation;
  verifiedBy: string | null;
  verifiedOn: string | null;
};

function minorMemberships(version: CurriculumVersion): Map<string, MinorMembership[]> {
  const byCode = new Map<string, MinorMembership[]>();
  const add = (code: string, membership: MinorMembership) =>
    byCode.set(code, [...(byCode.get(code) ?? []), membership]);
  for (const minor of version.minors) {
    for (const code of minor.required)
      add(code, { id: minor.id, name: minor.name, role: "required" });
    for (const code of minor.electives) {
      // A code in a minor's required list is required there, not also elective.
      if (!minor.required.includes(code)) {
        add(code, { id: minor.id, name: minor.name, role: "elective" });
      }
    }
  }
  return byCode;
}

function plannedTerms(version: CurriculumVersion): Map<string, TermRef[]> {
  const byCode = new Map<string, TermRef[]>();
  for (const planned of version.recommendedPlan.value) {
    for (const entry of planned.entries) {
      if (entry.kind !== "course") continue;
      byCode.set(entry.code, [...(byCode.get(entry.code) ?? []), planned.term]);
    }
  }
  return byCode;
}

function buildFacts(): Map<CurriculumVersionId, Map<string, VersionFacts>> {
  const byVersion = new Map<CurriculumVersionId, Map<string, VersionFacts>>();
  for (const id of VERSION_ORDER) {
    const version = CURRICULUM_VERSIONS[id];
    const minors = minorMemberships(version);
    const terms = plannedTerms(version);
    const facts = new Map<string, VersionFacts>();
    for (const course of version.courses.value) {
      facts.set(course.code, {
        ...course,
        version: id,
        recommendedTerms: terms.get(course.code) ?? [],
        minors: minors.get(course.code) ?? [],
      });
    }
    byVersion.set(id, facts);
  }
  return byVersion;
}

const factsByVersion = buildFacts();

const catalogueByCode = new Map(catalogueCourses.map((course) => [course.code, course]));

const nodes = new Map<string, CourseNode>();
for (const id of VERSION_ORDER) {
  for (const [code, facts] of factsByVersion.get(id)!) {
    const existing = nodes.get(code);
    nodes.set(code, {
      code,
      title: facts.title,
      versions: { ...existing?.versions, [id]: facts },
      latest: facts,
      catalogue: catalogueByCode.get(code),
    });
  }
}

/** Per version, the sorted codes of the courses that list each code as a prerequisite. */
const dependents = new Map<CurriculumVersionId, Map<string, string[]>>();
for (const id of VERSION_ORDER) {
  const inverse = new Map<string, string[]>();
  for (const [code, facts] of factsByVersion.get(id)!) {
    for (const prerequisite of facts.prerequisites) {
      inverse.set(prerequisite, [...(inverse.get(prerequisite) ?? []), code]);
    }
  }
  for (const codes of inverse.values()) codes.sort();
  dependents.set(id, inverse);
}

/** The node for a course code, or undefined if no curriculum version lists it. */
export function courseNode(code: string): CourseNode | undefined {
  return nodes.get(code);
}

/** Every course code in any curriculum version, sorted. Each one has a course page. */
export function allCourseCodes(): string[] {
  return [...nodes.keys()].sort();
}

/** Whether a course page exists for this code: true for every code some version lists. */
export function hasPage(code: string): boolean {
  return nodes.has(code);
}

/** The versions that list this code, oldest first. */
export function versionsOf(code: string): CurriculumVersionId[] {
  const node = nodes.get(code);
  return node ? VERSION_ORDER.filter((id) => node.versions[id]) : [];
}

/** Every code a version lists, in the order the curriculum module lists them. */
export function codesIn(versionId: CurriculumVersionId): string[] {
  return [...factsByVersion.get(versionId)!.keys()];
}

/** Codes that must be passed first, in this version. */
export function prerequisites(code: string, versionId: CurriculumVersionId): string[] {
  return [...(nodes.get(code)?.versions[versionId]?.prerequisites ?? [])];
}

/** Sorted codes of the courses that list this course as a prerequisite, in this version. */
export function unlocks(code: string, versionId: CurriculumVersionId): string[] {
  return [...(dependents.get(versionId)?.get(code) ?? [])];
}

/** The bucket this course counts towards in this version, or undefined if the version omits it. */
export function countsTowards(
  code: string,
  versionId: CurriculumVersionId
): CountsTowards | undefined {
  const facts = nodes.get(code)?.versions[versionId];
  return facts ? { category: facts.category, minors: facts.minors } : undefined;
}

/** Every term of this version's recommended plan that names the course. */
export function recommendedIn(code: string, versionId: CurriculumVersionId): TermRef[] {
  return [...(nodes.get(code)?.versions[versionId]?.recommendedTerms ?? [])];
}

/**
 * The longest chain of courses that depend on this one, transitively, in this
 * version: nearest first, so for PI271 it is PI280 then one area studies
 * elective. Empty when nothing needs the course. Where two chains are equally
 * long the one through the lower code wins, so the answer is stable. The
 * length is how many terms deferring the course can push the end of the
 * chain back, which is what the planner's critical path is built from.
 */
export function prerequisiteChain(code: string, versionId: CurriculumVersionId): string[] {
  const memo = new Map<string, string[]>();
  const longest = (from: string, path: Set<string>): string[] => {
    const known = memo.get(from);
    if (known) return known;
    let best: string[] = [];
    for (const next of unlocks(from, versionId)) {
      // A cycle cannot occur in a real curriculum (a test asserts it), but a
      // bad edit must not hang the build.
      if (path.has(next)) continue;
      const chain = [next, ...longest(next, new Set(path).add(next))];
      if (chain.length > best.length) best = chain;
    }
    memo.set(from, best);
    return best;
  };
  return [...longest(code, new Set([code]))];
}

function relationOf(equivalence: Equivalence, code: string): EquivalentCourse | undefined {
  const { since, derivation, verifiedBy, verifiedOn } = equivalence;
  const shared = { since, derivation, verifiedBy, verifiedOn };
  if (equivalence.from === code) return { code: equivalence.to, relation: "replacedBy", ...shared };
  if (equivalence.to === code) return { code: equivalence.from, relation: "replaces", ...shared };
  return undefined;
}

/** The courses that stand for this one in another version, from the hand-kept equivalence table. */
export function equivalentTo(code: string): EquivalentCourse[] {
  return EQUIVALENCES.flatMap((equivalence) => relationOf(equivalence, code) ?? []);
}

/**
 * The codes that stand for this course in a version: the code itself if the
 * version lists it, otherwise its declared equivalents that the version does
 * list. Empty when the version has no counterpart. A single hop, not a
 * transitive closure, because a pairing chained through a third version would
 * be a judgement nobody has made.
 */
export function counterparts(code: string, versionId: CurriculumVersionId): string[] {
  const facts = factsByVersion.get(versionId)!;
  if (facts.has(code)) return [code];
  return equivalentTo(code)
    .map((equivalent) => equivalent.code)
    .filter((other) => facts.has(other));
}
