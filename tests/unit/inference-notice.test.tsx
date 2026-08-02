// @vitest-environment jsdom
/**
 * Regression coverage for several related behaviours of the same component.
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
 * versions, so one test here checks the other side: the sentence must not
 * appear at all for cohort 68, confirming the suppression actually reaches
 * the rendered notice and is not merely recorded in the data.
 *
 * A design doc once flagged the component's empty-return branch
 * (`parts.length === 0 && items.length === 0`) as unreachable and therefore
 * untested, because no real curriculum version yielded zero inferred parts
 * and zero applicable disclosures. That stopped being true once
 * pi574-credits-attested and cohort-69-attested were deleted as false on
 * 2026-08-02 (see content/curriculum/2568.ts): 2568's remaining derivation is
 * suppressed and its remaining contradictions both have `disclosure: null`,
 * so both 2568 cohorts hit that branch for real, but the component was
 * deciding whether to render from the raw, unfiltered `parts`/`items`
 * counts rather than from what would actually be shown, so it rendered an
 * empty warning box (heading and "ask your advisor" line, no content) instead
 * of nothing. The fix moved the render decision to the final, filtered
 * sentence list. The tests below cover the now-reachable branch with real
 * curriculum data rather than a synthetic fixture, and cohort 66 is the
 * control proving the fix doesn't just disable the component outright.
 */
import { afterEach, describe, expect, it } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
// This repo has no global vitest setup file, so the jest-dom matchers
// (toBeEmptyDOMElement, used below) are imported per-file where needed.
import "@testing-library/jest-dom/vitest";
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

  // 2568's only remaining derivation (recommendedPlan) is suppressed and its
  // only remaining contradictions (no-2568-study-plan, catalogue-identical)
  // both have `disclosure: null`. Before the fix, InferenceNotice decided
  // whether to render from the raw `inferredParts`/`disclosures` counts,
  // which are non-zero even though every entry gets filtered out before
  // anything is shown; that produced a warning box with a heading and an
  // "ask your advisor" line but no actual warning underneath. The component
  // now decides from the final, filtered sentence list, so it must render
  // nothing at all for both 2568 cohorts. Checking the container is empty is
  // the point of this test, not just that one string is missing: a shorter
  // check (queryByText for one sentence) previously passed even though the
  // empty shell still rendered.
  it("renders nothing at all for cohort 68 on 2568, once every part is suppressed or nulled", () => {
    const { container } = render(
      <InferenceNotice version={CURRICULUM_VERSIONS["2568"]} cohortCode="68" locale="en" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing at all for cohort 69 on 2568, once every part is suppressed or nulled", () => {
    const { container } = render(
      <InferenceNotice version={CURRICULUM_VERSIONS["2568"]} cohortCode="69" locale="en" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("still renders normally for cohort 66, proving the fix did not disable the component", () => {
    // Cohort 66 is on the 2023 revision (2564-rev2566), whose one remaining
    // contradiction, total-never-printed, is unscoped and has a real
    // disclosure. This is the control: it proves the empty-render fix above
    // is conditional on there being nothing left to show, not an accidental
    // way to silence the component for every version.
    const { container } = render(
      <InferenceNotice
        version={CURRICULUM_VERSIONS["2564-rev2566"]}
        cohortCode="66"
        locale="en"
      />
    );
    expect(container).not.toBeEmptyDOMElement();
    expect(
      screen.getByText(
        "The 127-credit total is not printed in the handout. We worked it out by adding the three parts together. Check it with your advisor."
      )
    ).toBeInTheDocument();
  });

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
