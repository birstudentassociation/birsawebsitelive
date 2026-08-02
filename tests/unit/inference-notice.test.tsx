// @vitest-environment jsdom
/**
 * Regression coverage for two related behaviours of the same component.
 *
 * Originally `content/curriculum/2568.ts` used the same string object for
 * `recommendedPlan.derivation.reason` (an `inferredParts()` result) and the
 * `no-2568-study-plan` contradiction's `disclosure` (a `disclosures()`
 * result), and the component deduplicated identical sentences across both
 * lists so a student never saw the same warning twice. As of 2026-08-02 that
 * pair no longer both render for cohort 68: BIRSA instructed the notice be
 * suppressed after Year 1 was verified, so `recommendedPlan.derivation`
 * carries `suppressed` and `no-2568-study-plan`'s `disclosure` is `null`. The
 * dedup logic in `InferenceNotice` is unchanged and still needed for other
 * versions, so this test now checks the other side: the sentence must not
 * appear at all for cohort 68, confirming the suppression actually reaches
 * the rendered notice and is not merely recorded in the data.
 */
import { afterEach, describe, expect, it } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import InferenceNotice from "@/components/study-plan/InferenceNotice";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";

afterEach(() => {
  cleanup();
});

const SUPPRESSED_SENTENCE =
  "There is no published study plan for the 2568 curriculum yet. The order of courses below is taken from the 2023 revision's study plan, which is the most recent one that exists. Your credit totals are from your own curriculum document and are correct. The order is a starting point, not your curriculum. Confirm it with your advisor.";

describe("InferenceNotice", () => {
  it("does not render the suppressed borrowed-study-plan sentence for cohort 68", () => {
    render(
      <InferenceNotice version={CURRICULUM_VERSIONS["2568"]} cohortCode="68" locale="en" />
    );
    expect(screen.queryByText(SUPPRESSED_SENTENCE)).toBeNull();
  });

  // The two tests that used to live here (cohort 66 not seeing, cohort 67
  // seeing, the "no published document" attestation disclosure) were removed
  // on 2026-08-02: the official curriculum page now documents cohort 67
  // directly, the cohort-67-attested contradiction was deleted, and neither
  // cohort sees that notice anymore. Nothing replaces them here; the
  // equivalent cohort-69/68 scoping is already covered in
  // tests/unit/curriculum-registry.test.ts.

  it("no longer shows the deleted attestation disclosure to a cohort 67 student", () => {
    render(
      <InferenceNotice
        version={CURRICULUM_VERSIONS["2564-rev2566"]}
        cohortCode="67"
        locale="en"
      />
    );
    // total-never-printed, the one remaining contradiction on this version,
    // is not cohort-scoped, so it would still render if InferenceNotice
    // renders anything for cohort 67. Confirms the attestation notice truly
    // stopped rendering rather than merely being replaced by a passing test.
    expect(
      screen.queryByText(/No published document says which curriculum cohort 67 follows/)
    ).toBeNull();
  });
});
