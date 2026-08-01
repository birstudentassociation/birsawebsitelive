import { test, expect } from "@playwright/test";

/**
 * Regression guard for a bug class that has shipped three times: a cookie
 * write (`cookies().set()` via `components/forms/draftCookie.ts`) executed
 * during a Server Component render. Next.js forbids mutating cookies outside
 * a Server Action or Route Handler, so when a step page reads a missing draft
 * cookie and tries to seed one on the way in, the page throws and the reader
 * gets the error boundary instead of the form.
 *
 * All three instances only showed up when the browser had no draft cookie yet:
 * a fresh visitor landing straight on a mid-journey URL (a deep link, a
 * "start over" link, a bookmarked step). Every test here loads a journey's
 * entry point with a clean context (no cookies) and asserts the response is a
 * real 200 with the actual page, not the error boundary swallowing it. This
 * is the exact condition that would have caught all three incidents before
 * they shipped; no existing spec asserted on response status at all.
 *
 * Playwright gives every test its own browser context by default (nothing in
 * playwright.config.ts sets a shared `storageState`), so each `page` fixture
 * below already starts with an empty cookie jar. No extra isolation setup is
 * needed here.
 */

// The exact copy rendered by the locale error boundary
// (app/[lang]/error.tsx, content/dictionaries/en.ts `error.title`). Assert on
// this real string rather than a guess, so the test fails the same way a
// user would notice it: the page said "sorry, there is a problem" instead of
// showing the form.
const ERROR_BOUNDARY_TEXT = "Sorry, there is a problem with this page";

const journeyEntryPoints = [
  "/en/contact",
  // The deep link that broke instance 1: category and a return path both
  // arrive on the very first request, before any draft cookie exists.
  "/en/contact?category=problem&from=%2Fen",
  "/en/services/equipment-loan/status",
  "/en/clubs/start",
  "/en/privacy/your-data",
];

test.describe("wizard entry points render for a first-time visitor", () => {
  for (const path of journeyEntryPoints) {
    test(`${path} returns 200 and does not fall back to the error boundary`, async ({ page }) => {
      const response = await page.goto(path);

      expect(response?.status()).toBe(200);
      await expect(page.getByText(ERROR_BOUNDARY_TEXT)).toHaveCount(0);
    });
  }
});

test.describe("equipment loan request step, cold", () => {
  // Instance 2's exact trigger: the first step of an equipment loan request,
  // visited cold, with no draft cookie set yet. lib/inventory/items.ts
  // degrades to returning null from `getItemByKey` whenever POSTGRES_URL is
  // not configured (see isInventoryConfigured), and every environment this
  // spec runs in today, including CI per .github/workflows/ci.yml, builds
  // and serves with no database configured. So "first-aid-kit" 404s via
  // Next's normal not-found handling before the page ever reaches the
  // cookie-reading code in getLoanDraft(), and a plain `toBe(200)` here would
  // fail for a reason that has nothing to do with the bug this spec exists
  // to catch. What actually distinguishes the bug is the response never
  // being the thrown-during-render error boundary (which Next serves as a
  // 500): assert that instead, and only require 200 when a real catalogue
  // item is present. If this repo's e2e run ever gains a configured,
  // seeded database, this item slug should start resolving and the 200
  // branch below will start exercising the real regression.
  test("/en/services/equipment-loan/first-aid-kit/request/name never renders the error boundary", async ({
    page,
  }) => {
    const path = "/en/services/equipment-loan/first-aid-kit/request/name";
    const response = await page.goto(path);
    const status = response?.status();

    expect(status).not.toBe(500);
    if (status === 200) {
      await expect(page.getByText(ERROR_BOUNDARY_TEXT)).toHaveCount(0);
    } else {
      // Degraded (no database, or the item genuinely doesn't exist): a
      // plain not-found page, never the "sorry, there is a problem" text
      // that a cookie-write-during-render crash would produce.
      expect(status).toBe(404);
      await expect(page.getByText(ERROR_BOUNDARY_TEXT)).toHaveCount(0);
    }
  });
});
