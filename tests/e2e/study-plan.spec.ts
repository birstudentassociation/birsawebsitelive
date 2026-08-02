import { test, expect } from "@playwright/test";

const ERROR_BOUNDARY_TEXT = "Sorry, there is a problem with this page";

test.describe("study plan version gate", () => {
  test("an unsupported cohort is refused, not guessed at", async ({ page }) => {
    await page.goto("/en/services/study-plan/cohort");
    await page.getByLabel(/first two digits/i).fill("70");
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.getByRole("heading", { name: /cannot plan your degree/i })).toBeVisible();
  });

  test("cohort 68 is told its study plan is borrowed", async ({ page }) => {
    await page.goto("/en/services/study-plan/cohort");
    await page.getByLabel(/first two digits/i).fill("68");
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.getByText(/borrowed from an older curriculum/i)).toBeVisible();
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
    // appear twice more on this page, in the InferenceNotice's disclosure
    // text and in a findings sentence, and a plain /127/ regex is ambiguous
    // between all three.
    await expect(page.getByText("/ 127")).toBeVisible();
  });
});
