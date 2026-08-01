// @vitest-environment jsdom
/**
 * Regression test for a duplicate-sentence bug: `content/curriculum/2568.ts`
 * uses the same string object for `recommendedPlan.derivation.reason` (an
 * `inferredParts()` result) and the `no-2568-study-plan` contradiction's
 * `disclosure` (a `disclosures()` result). Both are legitimate, independent
 * records of the same underlying fact, so the data is not deduplicated; the
 * component is, since it is the one place both lists actually get rendered
 * together on the same page.
 */
import { afterEach, describe, expect, it } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import InferenceNotice from "@/components/study-plan/InferenceNotice";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";

afterEach(() => {
  cleanup();
});

const REPEATED_SENTENCE =
  "There is no published study plan for the 2568 curriculum yet. The order of courses below is taken from the 2023 revision's study plan, which is the most recent one that exists. Your credit totals are from your own curriculum document and are correct. The order is a starting point, not your curriculum. Confirm it with your advisor.";

describe("InferenceNotice", () => {
  it("renders the shared inferred-reason/disclosure sentence exactly once for cohort 68", () => {
    render(
      <InferenceNotice version={CURRICULUM_VERSIONS["2568"]} cohortCode="68" locale="en" />
    );
    expect(screen.getAllByText(REPEATED_SENTENCE)).toHaveLength(1);
  });

  it("does not show cohort 67's attested-mapping disclosure to a cohort 66 student", () => {
    render(
      <InferenceNotice
        version={CURRICULUM_VERSIONS["2564-rev2566"]}
        cohortCode="66"
        locale="en"
      />
    );
    // Cohort 66's mapping to this version is printed in a document, so
    // telling them "no published document" covers their cohort is false.
    expect(
      screen.queryByText(/No published document says which curriculum cohort 67 follows/)
    ).toBeNull();
  });

  it("shows the attested-mapping disclosure to a cohort 67 student", () => {
    render(
      <InferenceNotice
        version={CURRICULUM_VERSIONS["2564-rev2566"]}
        cohortCode="67"
        locale="en"
      />
    );
    expect(
      screen.queryByText(/No published document says which curriculum cohort 67 follows/)
    ).not.toBeNull();
  });
});
