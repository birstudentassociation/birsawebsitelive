import { test, expect, type Page } from "./fixtures";

/**
 * Progressive-enhancement guarantees (Service Manual: "a user can complete the
 * journey using HTML alone"). Every test here runs with JavaScript DISABLED, so
 * the forms must submit via a real POST to their server action and re-render the
 * result server-side, with no client fetch and no `useActionState` on the client.
 *
 * The contact form, the start-a-club form and the equipment loan status lookup
 * are all one-question-per-page journeys: each step is its own server-rendered
 * page and URL, partial answers ride in a small httpOnly cookie between steps
 * (never in client memory), and "change" links from a check-answers step
 * re-enter that step and return afterwards.
 */
test.use({ javaScriptEnabled: false });

/** Counts the real question controls on a step page: excludes the hidden honeypot and any hidden inputs (locale markers, $ACTION_* server-action fields). */
function questionControls(page: Page) {
  return page.locator(
    'form :is(input,textarea,select):not([name="nickname"]):not([type="hidden"])'
  );
}

test.describe("forms work without JavaScript", () => {
  test.describe("contact journey", () => {
    test("each step page contains exactly one question", async ({ page }) => {
      await page.goto("/en/contact");
      await expect(questionControls(page)).toHaveCount(1); // category

      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/contact\/subject/);
      await expect(questionControls(page)).toHaveCount(1); // subject

      await page.locator('input[name="subject"]').fill("A question about clubs");
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/contact\/message/);
      await expect(questionControls(page)).toHaveCount(1); // message

      await page
        .locator('textarea[name="message"]')
        .fill("A question about clubs and how to join one.");
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/contact\/name/);
      await expect(questionControls(page)).toHaveCount(1); // name

      await page.locator('input[name="name"]').fill("Jo Student");
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/contact\/email/);
      await expect(questionControls(page)).toHaveCount(1); // email
    });

    test("a validation error can be recovered from, a change link works, and the journey reaches confirmation", async ({
      page,
    }) => {
      await page.goto("/en/contact");

      // Step 1: category (default selection is already valid, just continue).
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/contact\/subject/);

      // Step 2: subject. Hit a validation error, then recover from it.
      await page.getByRole("button", { name: "Continue" }).click();
      const subjectError = page.getByRole("alert").filter({ hasText: "There is a problem" });
      await expect(subjectError).toBeVisible();
      await page.locator('input[name="subject"]').fill("A question about clubs");
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/contact\/message/);

      // Step 3: message.
      await page
        .locator('textarea[name="message"]')
        .fill("I would like to know how to start a new debate club this term.");
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/contact\/name/);

      // Step 4: name.
      await page.locator('input[name="name"]').fill("Jo Student");
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/contact\/email/);

      // Step 5: email.
      await page.locator('input[name="email"]').fill("jo@example.com");
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/contact\/check/);

      // Check-answers step: the name we entered is listed, with a
      // meaningful (not bare "Change") link back to that step.
      await expect(page.getByText("Jo Student")).toBeVisible();
      const changeName = page.getByRole("link", { name: "Change Name" });
      await expect(changeName).toBeVisible();
      await changeName.click();
      await expect(page).toHaveURL(/\/contact\/name\?returnTo=check/);

      // Amend the answer and confirm it survives back on check-answers.
      await page.locator('input[name="name"]').fill("Jo A. Student");
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/contact\/check/);
      await expect(page.getByText("Jo A. Student")).toBeVisible();

      // Submit via Enter in a single-line field would not apply here (no
      // single-line field left); use the send button directly.
      await page.getByRole("button", { name: "Send message" }).click();
      await page.waitForLoadState("load");

      // Either "sent" (success) or the "email not configured" fallback; both
      // are valid accepted outcomes, and neither is the error summary.
      await expect(page.getByRole("status").first()).toBeVisible();
      await expect(page.getByText("There is a problem")).toHaveCount(0);
    });

    test("posts to a server action, not a client fetch", async ({ page }) => {
      await page.goto("/en/contact");

      const form = page
        .locator("form")
        .filter({ has: page.getByRole("button", { name: "Continue" }) });
      await expect(form).toHaveAttribute("method", /post/i);
      await expect(form.locator('input[type="hidden"][name^="$ACTION"]').first()).toBeAttached();
    });
  });

  test.describe("start a club journey", () => {
    test("each step page contains exactly one question", async ({ page }) => {
      await page.goto("/en/clubs/start");
      await expect(questionControls(page)).toHaveCount(1); // club name

      await page.locator('input[name="clubName"]').fill("Board Games Club");
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/clubs\/start\/members/);
      await expect(questionControls(page)).toHaveCount(1); // members

      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/clubs\/start\/description/);
      await expect(questionControls(page)).toHaveCount(1); // description

      await page
        .locator('textarea[name="description"]')
        .fill("A weekly meetup to play board games and teach new players the rules.");
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/clubs\/start\/name/);
      await expect(questionControls(page)).toHaveCount(1); // name

      await page.locator('input[name="name"]').fill("Jo Student");
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/clubs\/start\/email/);
      await expect(questionControls(page)).toHaveCount(1); // email
    });

    test("a validation error can be recovered from, a change link works, and the journey reaches confirmation", async ({
      page,
    }) => {
      await page.goto("/en/clubs/start");
      await expect(questionControls(page)).toHaveCount(1); // club name

      // Step 1: club name.
      await page.locator('input[name="clubName"]').fill("Board Games Club");
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/clubs\/start\/members/);

      // Step 2: who else is interested (optional, leave blank).
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/clubs\/start\/description/);

      // Step 3: description. Hit a validation error, then recover.
      await page.getByRole("button", { name: "Continue" }).click();
      const descriptionError = page.getByRole("alert").filter({ hasText: "There is a problem" });
      await expect(descriptionError).toBeVisible();
      await page
        .locator('textarea[name="description"]')
        .fill("A weekly meetup to play board games and teach new players the rules.");
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/clubs\/start\/name/);

      // Step 4: name.
      await page.locator('input[name="name"]').fill("Jo Student");
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/clubs\/start\/email/);

      // Step 5: email.
      await page.locator('input[name="email"]').fill("jo@example.com");
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/clubs\/start\/check/);

      // Check-answers step: use the "change" link for the club name (the
      // journey's first step, which lives at the bare /clubs/start URL).
      await expect(page.getByText("Board Games Club")).toBeVisible();
      const changeClubName = page.getByRole("link", { name: "Change Proposed club name" });
      await expect(changeClubName).toBeVisible();
      await changeClubName.click();
      await expect(page).toHaveURL(/\/clubs\/start\?returnTo=check/);

      await page.locator('input[name="clubName"]').fill("Tabletop Games Society");
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/clubs\/start\/check/);
      await expect(page.getByText("Tabletop Games Society")).toBeVisible();

      await page.getByRole("button", { name: "Submit idea" }).click();
      await page.waitForLoadState("load");

      await expect(page.getByRole("status").first()).toBeVisible();
      await expect(page.getByText("There is a problem")).toHaveCount(0);
    });

    test("submitting the description step empty server-renders the error summary", async ({
      page,
    }) => {
      await page.goto("/en/clubs/start");
      await page.locator('input[name="clubName"]').fill("Board Games Club");
      await page.getByRole("button", { name: "Continue" }).click();
      await page.getByRole("button", { name: "Continue" }).click();

      await page.getByRole("button", { name: "Continue" }).click();
      const errorSummary = page.getByRole("alert").filter({ hasText: "There is a problem" });
      await expect(errorSummary).toBeVisible();
      await expect(errorSummary.getByRole("link").first()).toBeVisible();
    });
  });

  test.describe("loan status lookup", () => {
    test("each of the two steps is its own question, and an empty submission server-renders the error summary", async ({
      page,
    }) => {
      await page.goto("/en/services/equipment-loan/status");
      await expect(questionControls(page)).toHaveCount(1); // reference number

      await page.getByRole("button", { name: "Continue" }).click();
      const referenceError = page.getByRole("alert").filter({ hasText: "There is a problem" });
      await expect(referenceError).toBeVisible();

      await page.locator('input[name="reference"]').fill("BIRSA-0000");
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/status\/email/);
      await expect(questionControls(page)).toHaveCount(1); // email

      await page.getByRole("button", { name: "Check status" }).click();
      const emailError = page.getByRole("alert").filter({ hasText: "There is a problem" });
      await expect(emailError).toBeVisible();
    });
  });

  test("officer sign-in: submitting empty server-renders the error summary", async ({ page }) => {
    await page.goto("/en/officer/inventory");

    // With JS off this is a native form POST to the server action.
    await page.getByRole("button", { name: "Sign in" }).click();

    const errorSummary = page.getByRole("alert").filter({ hasText: "There is a problem" });
    await expect(errorSummary).toBeVisible();
    await expect(errorSummary.getByRole("link").first()).toBeVisible();
  });

  test("officer sign-in: incorrect credentials server-render a generic error", async ({ page }) => {
    await page.goto("/en/officer/inventory");

    await page.locator('input[name="email"]').fill("not-a-real-officer@example.com");
    await page.locator('input[name="passcode"]').fill("wrong-passcode");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Either "Incorrect email or passcode" (auth configured) or the
    // "not set up yet" notice (auth not configured); both are valid
    // rejections and neither leaks which field, if any, was wrong.
    // .first() because the not-configured notice can render more than once
    // (page-level notice plus the form's own state).
    const incorrect = page.getByText("Incorrect email or passcode");
    const notConfigured = page.getByText("Officer accounts are not set up yet");
    await expect(incorrect.or(notConfigured).first()).toBeVisible();
  });

  test("smart answers: a full journey to an outcome works with plain GET forms", async ({
    page,
  }) => {
    await page.goto("/en/answers/who-to-contact");
    await page.getByRole("link", { name: "Start now" }).click();

    // Answer the first radio at every step until an outcome renders. Each
    // question is a native GET form; the answer trail rides in `?a=` params.
    // Detect "still on a question" via the Continue button, not via radios:
    // an outcome page can itself embed the satisfaction FeedbackForm, which
    // has its own rating radios, so counting radios alone would mistake an
    // outcome for another question.
    for (let step = 0; step < 10; step++) {
      const continueButton = page.getByRole("button", { name: "Continue" });
      if ((await continueButton.count()) === 0) break;
      await page.getByRole("radio").first().check();
      await continueButton.click();
      await page.waitForLoadState("domcontentloaded");
      expect(page.url()).toContain("a=");
    }

    // Outcome page: answer summary with per-answer Change links, plus a way
    // to start over.
    await expect(page.getByText("Your answers")).toBeVisible();
    await expect(page.getByRole("link", { name: /Change/ }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Start again" })).toBeVisible();
  });

  test("smart answers: the audience profile is set by a GET form and tailors the journey", async ({
    page,
  }) => {
    await page.goto("/en/answers");
    await page.getByRole("link", { name: "Set this" }).click();

    // Three radio groups, all optional, submitted as one native GET form.
    await page.getByRole("radio", { name: /From abroad/ }).check();
    await page.getByRole("radio", { name: /Not started yet/ }).check();
    await page.getByRole("button", { name: "Save and continue" }).click();
    await page.waitForLoadState("domcontentloaded");

    // The three fields are packed into one `p` token and the reader is sent
    // back where they came from.
    expect(page.url()).toContain("p=international.starting");
    await expect(page.getByText("From abroad")).toBeVisible();

    // The profile rides along into a topic, and the answer carries it back
    // out again, so nothing is lost by navigating.
    await page.getByRole("link", { name: "Start here" }).click();
    expect(page.url()).toContain("p=international.starting");
  });

  test("getting started: steps and task links are usable, checkboxes stay JS-only", async ({
    page,
  }) => {
    await page.goto("/en/student-life/getting-started/international");

    // Native <details> steps toggle without JS; task links are plain anchors.
    const firstStep = page.locator("details").first();
    await firstStep.locator("summary").click();
    await expect(firstStep.getByRole("link").first()).toBeVisible();

    // The localStorage checklist is a client-side enhancement only: no
    // checkboxes (and no reset button) may render in the no-JS document.
    await expect(page.locator('input[type="checkbox"]')).toHaveCount(0);
  });
});
