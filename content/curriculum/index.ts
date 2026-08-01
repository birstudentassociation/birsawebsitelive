/**
 * The curriculum registry and the one function that decides which curriculum
 * governs a student: `resolveCohort`. Everything user-facing goes through it,
 * so an unsupported cohort has exactly one way to be handled and it is the
 * stop page.
 */
import { curriculum2564 } from "./2564";
import { curriculum2564rev2566 } from "./2564-rev2566";
import { curriculum2568 } from "./2568";
import type {
  CategoryId,
  CohortMapping,
  Contradiction,
  CurriculumVersion,
  CurriculumVersionId,
  Derivation,
  MinorId,
} from "./types";

export * from "./types";
export { SOURCES } from "./sources";

export const CURRICULUM_VERSIONS: Record<CurriculumVersionId, CurriculumVersion> = {
  "2564": curriculum2564,
  "2564-rev2566": curriculum2564rev2566,
  "2568": curriculum2568,
};

export type CohortResolution =
  | { status: "supported"; version: CurriculumVersion; mapping: CohortMapping }
  | { status: "unsupported"; code: string };

/**
 * Maps the first two digits of a student ID to the curriculum that governs
 * them. Anything not explicitly claimed by a version is unsupported: the
 * service refuses rather than guessing at a near neighbour.
 */
export function resolveCohort(code: string): CohortResolution {
  const normalized = code.trim();
  for (const version of Object.values(CURRICULUM_VERSIONS)) {
    const mapping = version.cohorts.find((c) => c.code === normalized);
    if (mapping) return { status: "supported", version, mapping };
  }
  return { status: "unsupported", code: normalized };
}

/** Every part of this version whose data was borrowed from another version. */
export function inferredParts(version: CurriculumVersion): Derivation[] {
  const parts = [
    version.graduationCredits.derivation,
    version.courses.derivation,
    version.recommendedPlan.derivation,
    version.rules.derivation,
  ];
  return parts.filter((d) => d.kind === "inferred");
}

/**
 * Contradictions with something to say to a student, as opposed to a
 * maintainer. Pass `cohortCode` to also drop contradictions scoped (via
 * `cohorts`) to a different cohort than the one asking; omit it to get every
 * disclosure on the version, which is what existing callers and tests expect.
 */
export function disclosures(version: CurriculumVersion, cohortCode?: string): Contradiction[] {
  return version.verification.contradictions.filter((c) => {
    if (c.disclosure === null) return false;
    if (!c.cohorts) return true;
    if (cohortCode === undefined) return true;
    return c.cohorts.includes(cohortCode);
  });
}

/**
 * Which of the three minor requirement buckets a minor course counts toward,
 * for this student.
 *
 * This is the whole reason minor courses are pooled under `category: "minor"`
 * rather than carrying a fixed bucket. PI380 is a required course for a
 * Governance student and an elective-in-another-minor for a Global Political
 * Economy one. The bucket is a fact about the pairing, not about the course.
 *
 * Returns null when the code belongs to no minor, which callers should treat
 * as "not a minor course" and fall back to the course's own category.
 */
export function resolveMinorCategory(
  version: CurriculumVersion,
  minorId: MinorId,
  code: string
): CategoryId | null {
  const chosen = version.minors.find((m) => m.id === minorId);
  if (!chosen) return null;
  if (chosen.required.includes(code)) return "minorRequired";
  if (chosen.electives.includes(code)) return "minorElective";
  const inAnother = version.minors.some(
    (m) => m.id !== minorId && (m.required.includes(code) || m.electives.includes(code))
  );
  return inAnother ? "minorElectiveOther" : null;
}
