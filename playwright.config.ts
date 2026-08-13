import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    // Reduced motion is emulated per test in tests/e2e/fixtures.ts, not set
    // here: `use: { reducedMotion }` silently has no effect in this
    // Playwright version. See that file for why the suite needs it at all.
  },
  webServer: {
    command: "npm run start",
    port: 3000,
    reuseExistingServer: true,
  },
  // Browser/device coverage follows GOV.UK "designing for different
  // browsers and devices" (as of February 2026), which lists Safari, Chrome,
  // Firefox, Edge and Samsung Internet across iOS, Android, Windows and
  // macOS as the browsers people actually use to reach government services.
  // Desktop Chrome/Firefox/Safari plus a Chrome-on-Android device give
  // engine coverage (Blink, Gecko, WebKit) across desktop and mobile without
  // needing every named browser individually.
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
});
