import { test, expect, type Page } from "./fixtures";

/**
 * Keyboard-only operation checks. axe-core (tests/e2e/a11y.spec.ts) never
 * drives a keyboard, so it cannot see a focus trap, an invisible focus ring,
 * or a control that only works with a mouse. This file complements the axe
 * sweep with the manual-equivalent checks the GOV.UK "accessibility for
 * developers" page calls for: heading structure and colour are covered
 * elsewhere, this file is about operating the page using Tab, Shift+Tab,
 * Enter, Space and Escape alone.
 *
 * These are deliberately narrower than a full assistive-technology pass:
 * they check DOM/focus/ARIA state, not what a screen reader announces. See
 * docs/ACCESSIBILITY-TESTING.md for the manual passes this cannot replace.
 */

/** True when the element has a visible `:focus-visible` outline, per the
 * site-wide rule in app/globals.css (WCAG 2.4.7). */
async function hasVisibleFocusRing(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return false;
    const style = window.getComputedStyle(el);
    return style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0;
  });
}

test.describe("header navigation: keyboard-only", () => {
  test("desktop: Tab reaches every header control with a visible focus ring, then reaches the page content (no trap)", async ({
    page,
  }) => {
    await page.goto("/en");

    // First stop is the skip link (covered in a11y.spec.ts); move past it.
    await page.keyboard.press("Tab");
    await expect(page.locator("a.skip-link")).toBeFocused();

    const seen: string[] = [];
    let reachedMain = false;

    // The header holds a bounded number of controls (logo, search, theme
    // toggle, CTA, language toggle, mobile-menu toggle at narrow widths).
    // 15 Tabs is generous headroom; if focus is still inside the header
    // after that many presses, something is holding it there.
    for (let i = 0; i < 15 && !reachedMain; i++) {
      await page.keyboard.press("Tab");
      expect(await hasVisibleFocusRing(page), `no visible focus ring after Tab #${i + 2}`).toBe(
        true
      );

      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        return {
          inHeader: !!el?.closest("header"),
          inMain: !!el?.closest("main"),
          tag: el?.tagName ?? "",
          name: el?.getAttribute("aria-label") ?? el?.textContent?.trim().slice(0, 40) ?? "",
        };
      });
      seen.push(`${info.tag}:${info.name}`);
      if (info.inMain) reachedMain = true;
      // Never falls out of both the header and the eventual main content
      // (e.g. onto <body> with nothing focused).
      expect(info.inHeader || info.inMain, `focus escaped to neither header nor main (${seen.join(" > ")})`).toBe(
        true
      );
    }

    expect(reachedMain, `Tab never reached <main>; focus stayed in the header (${seen.join(" > ")})`).toBe(
      true
    );
  });

  test("mobile menu: Tab reaches the toggle, opens it with Enter, tabs through every item, and is not trapped", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/en");

    const toggle = page.locator("header button[aria-expanded]");

    // Tab from the top of the page until the toggle itself has focus,
    // proving it sits in the normal tab order rather than needing a click.
    let guard = 0;
    while (!(await toggle.evaluate((el) => el === document.activeElement)) && guard < 15) {
      await page.keyboard.press("Tab");
      guard++;
    }
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    const panelId = await toggle.getAttribute("aria-controls");
    const panel = page.locator(`#${panelId}`);
    const itemCount = await panel.locator("a").count();
    expect(itemCount).toBeGreaterThan(0);

    // Tab through every link in the disclosed panel; each must actually
    // receive focus and carry a visible ring.
    for (let i = 0; i < itemCount; i++) {
      await page.keyboard.press("Tab");
      expect(await hasVisibleFocusRing(page), `panel item ${i + 1} has no visible focus ring`).toBe(
        true
      );
      const withinPanel = await page.evaluate(
        (id) => !!document.activeElement?.closest(`#${id}`),
        panelId
      );
      expect(withinPanel, `panel item ${i + 1} did not receive focus inside the panel`).toBe(true);
    }

    // One more Tab must leave the panel (it is a disclosure, not a modal: it
    // must never trap focus cycling back to its own first item).
    await page.keyboard.press("Tab");
    const stillInPanelAfterExtraTab = await page.evaluate(
      (id) => !!document.activeElement?.closest(`#${id}`),
      panelId
    );
    expect(stillInPanelAfterExtraTab, "focus is trapped inside the mobile menu panel").toBe(false);

    // Escape closes it and returns focus to the toggle (also covered from a
    // mouse-open starting point in a11y.spec.ts; this checks the all-keyboard
    // path end to end).
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
  });
});

test.describe("language and theme toggles: keyboard-only", () => {
  test("the language toggle activates with Enter and updates html[lang]", async ({ page }) => {
    await page.goto("/en/clubs");

    const toggle = page.getByRole("link", { name: /เปลี่ยนเป็นภาษาไทย/ });
    await toggle.focus();
    await expect(toggle).toBeFocused();

    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/\/th\/clubs$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "th");
  });

  test("the theme toggle activates with the keyboard and flips data-theme", async ({ page }) => {
    await page.goto("/en");
    const html = page.locator("html");

    const toggle = page.getByRole("button", { name: "Switch to dark mode" });
    await toggle.waitFor({ state: "visible" });
    await toggle.focus();
    await expect(toggle).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(html).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeFocused();

    // Space must work too, not only Enter.
    await page.keyboard.press(" ");
    await expect(html).not.toHaveAttribute("data-theme", /.+/);
  });
});

test.describe("accordion: keyboard-only", () => {
  test("opens and closes with the keyboard and reports the correct expanded state", async ({
    page,
  }) => {
    await page.goto("/en/student-life/home/rights-and-welfare");

    // Chromium exposes <details>/<summary> as an accessibility-tree "group",
    // not a "button": Playwright only supports the `expanded` role filter on
    // roles that natively carry aria-expanded (button, link, combobox, …),
    // so the open/closed state is asserted here the same way a screen reader
    // would perceive it: whether the body content is exposed at all. The
    // native `open` attribute is the authoritative, spec-defined signal
    // behind that state.
    const details = page.locator("details").filter({ hasText: "Which app do I actually need?" });
    const summary = details.locator("summary");
    await expect(details).not.toHaveAttribute("open", "");
    await expect(page.getByText("TU Greats App")).not.toBeVisible();

    await summary.scrollIntoViewIfNeeded();
    await summary.focus();
    await expect(summary).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(details).toHaveAttribute("open", "");
    await expect(summary).toBeFocused();
    // The body text is now genuinely in the accessibility tree, not just
    // visually revealed.
    await expect(page.getByText("TU Greats App")).toBeVisible();

    // Space also toggles a native <details>/<summary>, and it closes again.
    await page.keyboard.press(" ");
    await expect(details).not.toHaveAttribute("open", "");
    await expect(summary).toBeFocused();
    await expect(page.getByText("TU Greats App")).not.toBeVisible();
  });
});

test.describe("confirm dialog: keyboard-only", () => {
  // SKIPPED, and this leaves a real coverage gap worth closing.
  //
  // This test used to reach ConfirmDialog by mocking the `/api/loans/lookup`
  // fetch that the status lookup made from the browser. The status lookup is
  // now a server-driven one-question-per-page journey: it resolves the loan
  // inside a server action, so there is no client-side request left to
  // intercept, and the only way to render the "Cancel this request" trigger
  // is a real pending loan in Postgres. This environment has no seeded
  // database.
  //
  // tests/unit/confirm-dialog.test.tsx covers the accessible name, the
  // confirm and cancel callbacks, the danger styling and the promise
  // resolution, but NOT the focus trap, the Escape key, or focus restoration
  // to the trigger, which is what this test existed to prove. Re-enable it
  // once the e2e suite has a seeded loan fixture.
  test.skip("traps focus while open, closes on Escape, and restores focus to the trigger", async ({
    page,
  }) => {
    // The only public, no-login trigger for ConfirmDialog is the "cancel a
    // pending loan" button on the equipment status lookup tool (the other
    // callers all live behind officer sign-in: components/inventory/*).
    // That tool calls a real API route backed by Postgres, and this
    // environment has no seeded loan to look up. The lookup network call is
    // mocked here so the test exercises the real ConfirmDialog component in
    // a real browser without depending on database fixtures or writing test
    // data into a real database.
    await page.route("**/api/loans/lookup", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          loan: {
            reference: "BIRSA-1234",
            status: "pending",
            startDate: "2026-08-01",
            endDate: "2026-08-08",
            itemName: "Test tripod",
          },
        }),
      })
    );

    await page.goto("/en/services/equipment-loan/status");

    // Wait for hydration before interacting: the tool renders a no-JS
    // fallback (a plain server-action form) until React mounts and swaps in
    // the fetch-based interactive version that this route mock targets.
    // The header theme toggle's mounted-only aria-label is a reliable,
    // already-used-elsewhere signal that hydration has completed for the
    // whole page (see the equivalent wait in a11y.spec.ts).
    await page.getByRole("button", { name: "Switch to dark mode" }).waitFor({ state: "visible" });

    // The status lookup is a one-question-per-page journey: the reference
    // number is asked at the journey root and the email on its own step, so
    // each answer is submitted before the next question appears.
    await page.getByLabel(/reference number/i).fill("BIRSA-1234");
    await page.getByRole("button", { name: /continue/i }).click();
    await page.getByLabel(/tu email/i).fill("student@student.tu.ac.th");
    await page.getByRole("button", { name: /check status/i }).click();

    const trigger = page.getByRole("button", { name: "Cancel this request" });
    await expect(trigger).toBeVisible();
    await trigger.focus();
    await page.keyboard.press("Enter");

    const dialog = page.locator("dialog[open]");
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("heading", { name: "Cancel this loan request?" })).toBeVisible();

    const cancelButton = dialog.getByRole("button", { name: "Cancel", exact: true });
    const confirmButton = dialog.getByRole("button", { name: "Confirm", exact: true });

    // Native <dialog> showModal() gives a real browser focus trap: tabbing
    // repeatedly must never move focus outside the dialog's own subtree.
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
      const withinDialog = await page.evaluate(
        () => !!document.activeElement?.closest("dialog[open]")
      );
      expect(withinDialog, `focus escaped the dialog on Tab #${i + 1}`).toBe(true);
    }
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Shift+Tab");
      const withinDialog = await page.evaluate(
        () => !!document.activeElement?.closest("dialog[open]")
      );
      expect(withinDialog, `focus escaped the dialog on Shift+Tab #${i + 1}`).toBe(true);
    }

    await expect(cancelButton).toBeVisible();
    await expect(confirmButton).toBeVisible();

    // Escape must dismiss without confirming (the API mock below would
    // otherwise be hit; asserting the trigger's label survives unchanged is
    // proof the "cancel this loan" action was not carried out).
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await expect(trigger).toBeVisible();
  });
});

test.describe("keyboard-only form journey", () => {
  test("completes the contact form using only the keyboard", async ({ page }) => {
    await page.goto("/en/contact");

    // The contact form is a one-question-per-page journey, so a keyboard-only
    // walk means focusing each step's single field, then activating Continue
    // with Enter rather than clicking. Every step must be reachable and
    // operable this way, including the final submit on check-answers.
    const continueByKeyboard = async () => {
      const next = page.getByRole("button", { name: "Continue" });
      await next.focus();
      await expect(next).toBeFocused();
      await page.keyboard.press("Enter");
    };

    // Step 1: category. A native <select>, so arrow keys change the
    // selection without opening a mouse-only picker.
    const category = page.getByLabel(/what is this about/i);
    await category.focus();
    await expect(category).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await continueByKeyboard();

    // Step 2: subject.
    await page.getByLabel(/^subject/i).focus();
    await page.keyboard.type("Question about the answers tool");
    await continueByKeyboard();

    // Step 3: message.
    await page.getByLabel(/^message/i).focus();
    await page.keyboard.type("This is a keyboard-only test submission covering the full journey.");
    await continueByKeyboard();

    // Step 4: name.
    await page.getByLabel(/your name/i).focus();
    await page.keyboard.type("Jordan Lee");
    await continueByKeyboard();

    // Step 5: email.
    await page.getByLabel(/email address/i).focus();
    await page.keyboard.type("jordan.lee@student.tu.ac.th");
    await continueByKeyboard();

    // Check-answers: submit with Enter, never a click.
    const submit = page.getByRole("button", { name: "Send message" });
    await submit.focus();
    await expect(submit).toBeFocused();
    await page.keyboard.press("Enter");

    // Whether this environment can actually send the email or not (the
    // "fallback" state ContactForm.tsx renders when email sending is not
    // configured), completing the journey by keyboard must land on a
    // focused result message rather than leaving focus stranded on <body>.
    // Both outcomes share the same `role="status"` / `tabIndex={-1}` result
    // container (see components/forms/ContactForm.tsx), so either is a
    // legitimate, complete keyboard journey.
    const result = page.locator('[role="status"][tabindex="-1"]');
    await expect(result).toBeVisible();
    await expect(result).toBeFocused();
  });
});
