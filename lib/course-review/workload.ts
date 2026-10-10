/**
 * Workload bands: the optional hours-a-week estimate a student can add beside
 * their written account of the workload.
 *
 * The committee allowed bands as a reported estimate shown alongside words,
 * and only ever as a distribution ("8 of 12 students said 3 to 6 hours a
 * week"). Nothing here averages bands, picks a middle one, or returns a single
 * number for a course, and the types make that hard to do by accident: a
 * `WorkloadBandCounts` is a count per band, not a score.
 */
import type { WorkloadBand, WorkloadBandCounts } from "@/content/course-review/types";
import { fillTemplate } from "@/components/course-review/constants";

/** The bands in the order they are listed and described, lightest first. */
export const WORKLOAD_BANDS: readonly WorkloadBand[] = ["under_3", "3_to_6", "over_6"];

export function isWorkloadBand(value: unknown): value is WorkloadBand {
  return typeof value === "string" && (WORKLOAD_BANDS as readonly string[]).includes(value);
}

/**
 * Counts how many of `bands` chose each band. A submission with no band
 * (`null`) is left out: it is not an answer of "none", it is no answer.
 */
export function countBands(bands: readonly (WorkloadBand | null)[]): WorkloadBandCounts {
  const counts: WorkloadBandCounts = {};
  for (const band of bands) {
    if (band !== null) counts[band] = (counts[band] ?? 0) + 1;
  }
  return counts;
}

/** How many students gave a band at all. The denominator of the distribution. */
export function bandAnswerCount(counts: WorkloadBandCounts): number {
  return WORKLOAD_BANDS.reduce((sum, band) => sum + (counts[band] ?? 0), 0);
}

/** The words a band is described with in one language, and the sentence frames that carry it. */
export type BandCopy = {
  /** Band labels, e.g. "3 to 6 hours a week". */
  labels: Record<WorkloadBand, string>;
  /** Frame with {count}, {total} and {band}, e.g. "{count} of {total} students said {band}". */
  sentence: string;
  /** Frame with {band} for when exactly one student gave an estimate. */
  sentenceSingle: string;
};

/**
 * The distribution in words, one sentence per band that anyone chose, lightest
 * band first. Empty when nobody gave a band, so the caller shows nothing rather
 * than a sentence about zero students.
 */
export function describeBandDistribution(counts: WorkloadBandCounts, copy: BandCopy): string[] {
  const total = bandAnswerCount(counts);
  if (total === 0) return [];
  if (total === 1) {
    const only = WORKLOAD_BANDS.find((band) => (counts[band] ?? 0) > 0)!;
    return [fillTemplate(copy.sentenceSingle, { band: copy.labels[only] })];
  }
  return WORKLOAD_BANDS.filter((band) => (counts[band] ?? 0) > 0).map((band) =>
    fillTemplate(copy.sentence, { count: counts[band]!, total, band: copy.labels[band] })
  );
}
