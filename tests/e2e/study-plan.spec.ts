import { test, expect } from "./fixtures";
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
    await expect(
      page.getByRole("heading", { level: 1, name: copy.curriculum.title })
    ).toBeVisible();
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
    await expect(page.getByText(copy.inference.checkSources)).toHaveCount(0);
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

    await expect(
      page.getByRole("heading", { level: 1, name: copy.curriculum.title })
    ).toBeVisible();
    await expect(page.getByText(copy.curriculum.totalLabel)).toBeVisible();

    await expect(page.getByText(copy.inference.heading)).toHaveCount(0);
    await expect(page.getByText(copy.inference.checkSources)).toHaveCount(0);
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

    // "Fill in the recommended plan" is the last control in this journey to
    // make the no-JS claim, and the one with the most to lose by breaking
    // it: without JavaScript it is the only alternative to pressing "Add"
    // once per course, forty times. Cohort 66 sits at year 3 semester 1, so
    // PI574 (the only named course in the 2564 plan's year 3 summer, see
    // content/curriculum/2564.ts) is ahead of the student and lands in the
    // plan. It is absent beforehand, which is what makes its appearance
    // afterwards evidence the button did something rather than evidence the
    // page always said so.
    //
    // The assertion is on the course's own "Remove" button, not on its code
    // appearing anywhere on the page: every future term already offers
    // PI574 in its "Add a course" select, so the bare code is on this screen
    // four times over before the button is pressed. A remove button exists
    // only for a course actually placed in a term, which is the thing being
    // claimed here.
    //
    // Each term is a `<details>` and the plan screen opens only one, so
    // PI574's own term is opened on both sides of the button press. A closed
    // `<details>` hides its contents from the accessibility tree, and this
    // locator counts what is exposed there, so asserting the absence without
    // opening the term first would pass whether or not the course was placed.
    // Opening it is worth as much as the populate assertion anyway: a
    // `<details>` is native HTML, so doing it here, in a context with
    // JavaScript switched off, is the proof that collapsing the term list did
    // not quietly make the plan screen depend on JavaScript.
    const removePi574 = page.getByRole("button", {
      name: `${copy.plan.removeCourseButton} PI574`,
    });
    const summerTerm = page.locator("#term-3-summer > summary");
    await summerTerm.click();
    await expect(page.getByText(copy.plan.termEmpty).first()).toBeVisible();
    await expect(removePi574).toHaveCount(0);

    await page.getByRole("button", { name: copy.plan.populateButton }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Your plan" })).toBeVisible();
    await expect(page.getByText(ERROR_BOUNDARY_TEXT)).toHaveCount(0);

    await summerTerm.click();
    await expect(removePi574).toBeVisible();
  });
});

/**
 * The JavaScript-on counterpart of the walk above, added once the add-course
 * field on `/plan` became `CourseCombobox`
 * (components/forms/CourseCombobox.tsx): a student can now type a course's
 * title, rather than hunt it in a long `<optgroup>`ed list, and this is the
 * one place that claim is exercised against a real browser.
 *
 * The journey itself (cohort through the fill step) is walked exactly as the
 * no-JS test above does, since none of those steps changed; only the
 * add-course step at the end is new. `useActionState` still ends every step
 * in a real navigation here (Next.js Server Actions redirect the same way
 * with or without client JS), so the same `getByRole("heading", ...)`
 * arrival checks apply.
 */
test.describe("study plan with JavaScript enabled", () => {
  test("types a course's title into the enhanced combobox and adds it to a future term", async ({
    page,
  }) => {
    await page.goto("/en/services/study-plan/cohort");
    await page.getByLabel(/first two digits/i).fill("66");
    await page.getByRole("button", { name: /continue/i }).click();

    await page.getByLabel(/yes, this matches/i).check();
    await page.getByRole("button", { name: /continue/i }).click();

    await page.getByLabel(/year/i).selectOption("3");
    await page.getByLabel(/semester/i).selectOption("semester1");
    await page.getByRole("button", { name: /continue/i }).click();

    await page.getByLabel(/governance and transnational studies/i).check();
    await page.getByRole("button", { name: /continue/i }).click();

    // Accept the assumed-courses defaults, same as the no-JS walk.
    await page.getByRole("button", { name: /continue/i }).click();

    // Accept the fill-step defaults. Each slot is now a CourseCombobox too,
    // but its default text is "I have not taken this yet" (the emptyOption),
    // so leaving every slot untouched and continuing is still what "accept
    // the defaults" means.
    await page.getByRole("button", { name: /continue/i }).click();

    await expect(page.getByRole("heading", { level: 1, name: "Your plan" })).toBeVisible();
    await expect(page.getByText(ERROR_BOUNDARY_TEXT)).toHaveCount(0);

    // Cohort 66 at year 3 semester 1 lands with that exact term already
    // open (it is the student's own position, and the plan screen opens the
    // nearest term by default); PI380 "Nation-State and Transnationalism" is
    // a required course of the governance minor just chosen, and not yet
    // placed anywhere in a fresh plan, so it is available to add here.
    const term = page.locator("#term-3-semester1");
    if (!(await term.evaluate((el) => (el as HTMLDetailsElement).open))) {
      await term.locator("> summary").click();
    }

    const removePi380 = term.getByRole("button", {
      name: `${copy.plan.removeCourseButton} PI380`,
    });
    await expect(removePi380).toHaveCount(0);

    // The full-catalogue picker lives behind "more options"; opening it is
    // itself proof the disclosure still works with JavaScript on.
    await term.getByText(copy.plan.moreOptionsLabel).click();

    const combobox = term.getByRole("combobox", { name: copy.plan.addCourseLabel });
    await combobox.fill("Nation-State and Transnationalism");
    await page.getByRole("option", { name: /PI380 Nation-State and Transnationalism/ }).click();
    // `exact: true` because the quick-add buttons above (AddCourseButton in
    // TermEditor.tsx) also start their accessible name with "Add " — this is
    // the picker's own submit button, whose name is the bare label.
    await term.getByRole("button", { name: copy.plan.addCourseButton, exact: true }).click();

    // The add posts to a Server Action and redirects back to `/plan` with
    // `?term=3-semester1`, which is what keeps this exact term open on
    // return (see redirectToPlan's own comment in actions.ts).
    await expect(page.getByRole("heading", { level: 1, name: "Your plan" })).toBeVisible();
    await expect(page.getByText(ERROR_BOUNDARY_TEXT)).toHaveCount(0);
    await expect(removePi380).toBeVisible();
  });
});
