import { test, expect } from "@playwright/test";
import { buildStudyPlanCopy } from "@/components/study-plan/studyPlanCopy";

const ERROR_BOUNDARY_TEXT = "Sorry, there is a problem with this page";
const copy = buildStudyPlanCopy("en");

test.describe("study plan version gate", () => {
  test("an unsupported cohort is refused, not guessed at", async ({ page }) => {
    await page.goto("/en/services/study-plan/cohort");
    await page.getByLabel(/first two digits/i).fill("70");
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.getByRole("heading", { name: /cannot plan your degree/i })).toBeVisible();
  });

  // pi574-credits-attested and cohort-69-attested were deleted from
  // content/curriculum/2568.ts on 2026-08-02, once BIRSA confirmed both
  // facts are printed in the 2568 comparison document (our own extraction of
  // that PDF had failed to read them). The recommendedPlan borrow for 2568
  // was separately suppressed for cohorts 68 and 69 once Year 1 was verified
  // against real cohort 68 records. With all three gone, cohort 68 now has
  // nothing left for InferenceNotice to disclose, and the notice renders
  // nothing at all (see components/study-plan/InferenceNotice.tsx and its
  // unit tests). This test used to assert the opposite; the old assertion's
  // premise is what changed, not correct behaviour.
  test("cohort 68 sees no uncertainty notice", async ({ page }) => {
    await page.goto("/en/services/study-plan/cohort");
    await page.getByLabel(/first two digits/i).fill("68");
    await page.getByRole("button", { name: /continue/i }).click();

    // The page actually loaded the confirm screen, not an error boundary or
    // a redirect elsewhere: the h1 is copy.curriculum.title, and 2568's
    // graduation total (126, content/curriculum/2568.ts) is shown under
    // copy.curriculum.totalLabel. Checking this first means the absence
    // assertions below cannot pass by accident on a broken or blank page.
    await expect(page.getByRole("heading", { level: 1, name: copy.curriculum.title })).toBeVisible();
    await expect(page.getByText(copy.curriculum.totalLabel)).toBeVisible();
    await expect(page.getByText("126", { exact: true })).toBeVisible();

    // No warning notice of any kind: neither the shared InferenceNotice
    // heading (copy.inference.heading, the only heading that component ever
    // renders) nor a bare warning-styled box (Notice variant="warning",
    // e.g. the separate attested-mapping notice on this same page, which
    // also no longer applies now that cohort 69's mapping is documented
    // too). Checking both the text and the structural class means this
    // would fail if some other warning box appeared under a different
    // heading, not just if this exact sentence were reworded.
    await expect(page.getByText(copy.inference.heading)).toHaveCount(0);
    await expect(page.getByText(copy.inference.askAdvisor)).toHaveCount(0);
    await expect(page.locator(".border-warning")).toHaveCount(0);
  });

  // This used to be the companion to the test above, proving the notice
  // mechanism still fires for a cohort that should see one: cohort 66 carried
  // the unscoped total-never-printed disclosure. That disclosure was stood
  // down on 2026-08-02, when the Student Handbook 2021 was found to print
  // "Total 127" outright on page 12, so the figure is no longer something the
  // service has to tell a student it worked out for itself. No shipped
  // curriculum version now has anything to disclose, so cohort 66 sees no
  // notice either, and this test asserts that rather than the opposite.
  //
  // The notice component is not left untested by the change. Its render and
  // no-render branches are both covered directly, on real and on synthetic
  // versions, in tests/unit/inference-notice.test.tsx.
  test("cohort 66 sees no uncertainty notice either", async ({ page }) => {
    await page.goto("/en/services/study-plan/cohort");
    await page.getByLabel(/first two digits/i).fill("66");
    await page.getByRole("button", { name: /continue/i }).click();

    await expect(page.getByRole("heading", { level: 1, name: copy.curriculum.title })).toBeVisible();
    await expect(page.getByText(copy.curriculum.totalLabel)).toBeVisible();

    await expect(page.getByText(copy.inference.heading)).toHaveCount(0);
    await expect(page.getByText(copy.inference.askAdvisor)).toHaveCount(0);
  });

  test("answering not sure stops the journey", async ({ page }) => {
    await page.goto("/en/services/study-plan/cohort");
    await page.getByLabel(/first two digits/i).fill("66");
    await page.getByRole("button", { name: /continue/i }).click();
    await page.getByLabel(/not sure/i).check();
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.getByRole("heading", { name: /cannot plan your degree/i })).toBeVisible();
  });
});

/**
 * The whole architecture of this feature rests on a claim that has never
 * been exercised end to end before this spec: the plan travels forward in a
 * hidden field on every form post (see `lib/study-plan/plan.ts`'s
 * PLAN_FIELD, and `app/[lang]/services/study-plan/assumed/page.tsx`'s
 * comment on why the plan lives in the query string, not the draft cookie),
 * so nothing about progressing through this journey depends on client-side
 * JavaScript. This test walks the full six-step journey, cohort through
 * plan, with JavaScript switched off in the browser context, including the
 * minor step, which is mandatory and has no "skip" or "not sure" answer
 * (see minor/page.tsx's doc comment on why: without it 21 of 127 credits get
 * silently miscounted). If any step here turns out to secretly depend on
 * client JS, that is a real defect in the no-JS claim, not a flaky test.
 */
test.describe("study plan without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("completes from cohort to plan", async ({ page }) => {
    await page.goto("/en/services/study-plan/cohort");
    await page.getByLabel(/first two digits/i).fill("66");
    await page.getByRole("button", { name: /continue/i }).click();

    await page.getByLabel(/yes, this matches/i).check();
    await page.getByRole("button", { name: /continue/i }).click();

    await page.getByLabel(/year/i).selectOption("3");
    // The field's label is "Semester" (studyPlanCopy.ts's where.termLabel),
    // not "term": the page asks "Which year and semester", but the select's
    // own <label> text is the shorter word.
    await page.getByLabel(/semester/i).selectOption("semester1");
    await page.getByRole("button", { name: /continue/i }).click();

    // The minor step. Not skippable: without it the service cannot tell
    // which of the three buckets a minor course counts toward.
    await page.getByLabel(/governance and transnational studies/i).check();
    await page.getByRole("button", { name: /continue/i }).click();

    // The "assumed" step: what courses the service has assumed the student
    // already passed, plus a free-elective credit count seeded with a
    // default. Accepting the defaults is a legitimate no-JS path.
    await page.getByRole("button", { name: /continue/i }).click();

    // The "fill" step. Roughly a third of the published study plan is
    // placeholder slots ("Minor Required Course 1") rather than named
    // courses, because only the student, not the plan, knows which real
    // course filled each one. Every slot defaults to "I have not taken this
    // yet" (see fill/page.tsx and studyPlanCopy.ts's fill.notTakenLabel), so
    // accepting the defaults and continuing is a legitimate no-JS path, the
    // same as the assumed step above. A cohort 66 student at year 3,
    // semester 1 has at least one such slot, so this step is not skipped.
    await page.getByRole("button", { name: /continue/i }).click();

    // Assert arrival on the plan screen itself, by its own top-level heading
    // (copy.plan.title, "Your plan"), before asserting on its contents:
    // otherwise a wrong turn earlier in the journey could land anywhere and
    // an assertion on page text alone would not say so. Matched exactly at
    // heading level 1 because "Your plan" is also a substring of the h2
    // further down the same page, "Delete your plan".
    await expect(page.getByRole("heading", { level: 1, name: "Your plan" })).toBeVisible();
    await expect(page.getByText(ERROR_BOUNDARY_TEXT)).toHaveCount(0);
    // The plan screen renders "{earnedCredits} / {graduationCredits}"
    // (plan/page.tsx's "Credits planned" figure) as "N / 127"; 127 is
    // curriculum2564rev2566's graduationCredits.value, the total for cohort
    // 66's curriculum, confirmed in content/curriculum/2564-rev2566.ts.
    // Matched on "/ 127" specifically because the bare digits "127" also
    // appear in a findings sentence on this page, so a plain /127/ regex is
    // ambiguous. (Until 2026-08-02 they appeared a third time, in the
    // InferenceNotice's total-never-printed disclosure, which is now gone.)
    await expect(page.getByText("/ 127")).toBeVisible();
  });
});
