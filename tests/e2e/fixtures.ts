/**
 * Shared Playwright test object for this suite. Import `test` and `expect`
 * from here rather than from `@playwright/test` directly.
 *
 * It exists to emulate `prefers-reduced-motion: reduce` for every test.
 * `app/globals.css` sets `html { scroll-behavior: smooth }`, and that
 * deadlocks Playwright's actionability checks: before clicking, Playwright
 * scrolls the target into view and then waits for its bounding box to stop
 * moving, but the smooth scroll is still animating when that check runs, so
 * it reports "element is not stable", retries, scrolls again, and never
 * converges — the click times out after 30s. It only bites when the target
 * sits below the fold, which is why it took out the long no-JS journey pages
 * and the officer sign-in page while the rest of the suite stayed green.
 *
 * This is emulation of a state the site already supports, not a workaround
 * that hides a defect: `globals.css` has a `prefers-reduced-motion: reduce`
 * block that turns smooth scrolling off for readers who ask for it, so the
 * suite simply runs through that supported path.
 *
 * It is applied with `page.emulateMedia()` in an auto-fixture rather than
 * with `use: { reducedMotion: "reduce" }` in playwright.config.ts because
 * the config option silently does not take effect (verified against
 * Playwright 1.61: `colorScheme` and `viewport` set the same way do apply,
 * `reducedMotion` does not, while `page.emulateMedia()` works). If a future
 * Playwright release fixes that, this file can collapse back into a config
 * option.
 */
import { test as base, expect } from "@playwright/test";

export const test = base.extend<{ reducedMotion: void }>({
  reducedMotion: [
    async ({ page }, use) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await use();
    },
    { auto: true },
  ],
});

export { expect };
export type { Page } from "@playwright/test";
