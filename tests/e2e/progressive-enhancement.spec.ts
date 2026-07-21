import { test, expect } from "@playwright/test";

/**
 * Progressive-enhancement guarantees (Service Manual: "a user can complete the
 * journey using HTML alone"). Every test here runs with JavaScript DISABLED, so
 * the forms must submit via a real POST to their server action and re-render the
 * result server-side, with no client fetch and no `useActionState` on the client.
 */
test.use({ javaScriptEnabled: false });

test.describe("forms work without JavaScript", () => {
  test("contact: submitting empty server-renders the error summary", async ({ page }) => {
    await page.goto("/en/contact");

    // With JS off this is a native form POST to the server action.
    await page.getByRole("button", { name: "Send message" }).click();

    // The action returned `invalid`; the page re-rendered with the summary.
    const errorSummary = page.getByRole("alert").filter({ hasText: "There is a problem" });
    await expect(errorSummary).toBeVisible();
    await expect(errorSummary.getByRole("link").first()).toBeVisible();
  });

  test("contact: a valid submission is accepted and shows a status panel", async ({ page }) => {
    await page.goto("/en/contact", { waitUntil: "domcontentloaded" });

    await page.locator('input[name="name"]').fill("Jo Student");
    await page.locator('input[name="email"]').fill("jo@example.com");
    await page
      .locator('textarea[name="message"]')
      .fill("I would like to know how to start a new debate club this term.");
    // Submit via Enter in a single-line field, a native form submit that avoids
    // clicking the button as the page navigates.
    await page.locator('input[name="subject"]').fill("A question about clubs");
    await page.locator('input[name="subject"]').press("Enter");
    await page.waitForLoadState("load");

    // Either "sent" (success) or the "email not configured" fallback; both are
    // valid accepted outcomes and both render a role="status" panel. What must
    // NOT happen is the validation error summary.
    await expect(page.getByRole("status").first()).toBeVisible();
    await expect(page.getByText("There is a problem")).toHaveCount(0);
  });

  test("start a club: submitting empty server-renders the error summary", async ({ page }) => {
    await page.goto("/en/clubs/start");

    await page.getByRole("button", { name: "Submit idea" }).click();

    const errorSummary = page.getByRole("alert").filter({ hasText: "There is a problem" });
    await expect(errorSummary).toBeVisible();
    await expect(errorSummary.getByRole("link").first()).toBeVisible();
  });

  test("loan status lookup: submitting empty server-renders the error summary", async ({
    page,
  }) => {
    await page.goto("/en/information-services/equipment-loan/status");

    await page.getByRole("button", { name: "Check status" }).click();

    const errorSummary = page.getByRole("alert").filter({ hasText: "There is a problem" });
    await expect(errorSummary).toBeVisible();
    await expect(errorSummary.getByRole("link").first()).toBeVisible();
  });

  test("officer sign-in: submitting empty server-renders the error summary", async ({ page }) => {
    await page.goto("/en/officer/inventory");

    // With JS off this is a native form POST to the server action.
    await page.getByRole("button", { name: "Sign in" }).click();

    const errorSummary = page.getByRole("alert").filter({ hasText: "There is a problem" });
    await expect(errorSummary).toBeVisible();
    await expect(errorSummary.getByRole("link").first()).toBeVisible();
  });

  test("officer sign-in: incorrect credentials server-render a generic error", async ({
    page,
  }) => {
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

  test("the contact form posts to a server action, not a client fetch", async ({ page }) => {
    await page.goto("/en/contact");

    // A progressively-enhanced server-action form submits with a native POST
    // (Next uses an empty `action` plus hidden `$ACTION_*` fields it reads
    // server-side), so it works with no JavaScript.
    const form = page
      .locator("form")
      .filter({ has: page.getByRole("button", { name: "Send message" }) });
    await expect(form).toHaveAttribute("method", /post/i);
    await expect(form.locator('input[type="hidden"][name^="$ACTION"]').first()).toBeAttached();
  });
});
