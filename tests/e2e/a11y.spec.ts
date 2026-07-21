import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Every distinct public page template, swept in both locales. Locale-prefixed
// below so contrast (Thai vs. Latin fonts), chrome, and RTL-agnostic layout are
// all exercised. Dynamic routes use a real, stable slug from `content/`.
const publicPaths = [
  "/", // home
  "/quick",
  "/search",
  "/contact",
  "/standards",
  "/privacy",
  "/news",
  "/news/welcome-bir-batch-18", // news article (MDX)
  "/activity",
  "/activity/birsa", // activity article (MDX)
  "/activity/roles", // committee roster
  "/activity/regulations", // regulations library index
  "/activity/regulations/university-2563", // long-form legal document
  "/activity/contact",
  "/clubs",
  "/clubs/debate-society", // club detail
  "/clubs/start", // start-a-club form
  "/student-life", // track index (sideways nav)
  "/student-life/home",
  "/student-life/international",
  "/student-life/international/visa-and-immigration", // guide article (MDX)
  "/student-life/home/food-and-budgeting",
  "/student-life/course-reviews", // course catalogue browser
  "/student-life/course-reviews/PI121", // course detail
  "/information-services",
  "/information-services/equipment-loan", // DB-degraded "not configured" state
  "/information-services/equipment-loan/directory", // club equipment directory (DB-degraded)
  "/information-services/equipment-loan/status", // status lookup form
  "/emergency", // calm emergency-preparedness landing
];

const locales = ["en", "th"] as const;

const pages = [
  ...locales.flatMap((lang) => publicPaths.map((p) => (p === "/" ? `/${lang}` : `/${lang}${p}`))),
  // Officer console, unauthenticated: exercises the sign-in form (accessible
  // authentication, 3.3.8) and the console nav chrome. Behind-auth screens
  // need a seeded Postgres session and are covered by component-level axe
  // tests (see tests/unit/inventory-a11y.test.tsx).
  "/en/officer/inventory",
  "/th/officer/inventory",
  "/en/officer/inventory/custodians",
  "/th/officer/inventory/custodians",
];

for (const path of pages) {
  test(`${path} has no automatically detectable WCAG 2.2 AA violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}

test("the 404 not-found page has no automatically detectable WCAG 2.2 AA violations", async ({
  page,
}) => {
  const response = await page.goto("/en/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

test("submitting an empty contact form shows a focused error summary with field error links", async ({
  page,
}) => {
  await page.goto("/en/contact");

  await page.getByRole("button", { name: "Send message" }).click();

  const errorSummary = page.getByRole("alert").filter({ hasText: "There is a problem" });
  await expect(errorSummary).toBeVisible();
  await expect(errorSummary).toBeFocused();

  const errorLinks = errorSummary.getByRole("link");
  expect(await errorLinks.count()).toBeGreaterThan(0);
});

test.describe("email scrape-proofing", () => {
  const emailPages = ["/en/contact", "/en/activity/contact"];

  for (const path of emailPages) {
    test(`${path} raw HTML has no plaintext BIRSA/BIR email address`, async ({ request }) => {
      const response = await request.get(path);
      const body = await response.text();

      // The raw HTTP response (not the browser-parsed DOM) must never
      // contain a plaintext address a scraper could regex out of the page
      // source: every email is emitted as HTML numeric character entities.
      expect(body).not.toContain("birsa@tu.ac.th");
      expect(body).not.toContain("bir@tu.ac.th");
      expect(body).toMatch(/&#64;/); // entity-encoded "@"
    });
  }

  test("the contact page exposes a working mailto link once parsed by the browser", async ({
    page,
  }) => {
    await page.goto("/en/contact");

    // Once the browser parses the entities, this is an ordinary, accessible
    // mailto link: obfuscation must not cost usability.
    const emailLink = page.locator('a[href="mailto:birsa@tu.ac.th"]');
    await expect(emailLink.first()).toBeVisible();
  });
});

test("the language toggle switches locale and updates html[lang]", async ({ page }) => {
  await page.goto("/en/clubs");

  await page.getByRole("link", { name: /เปลี่ยนเป็นภาษาไทย/ }).click();

  await expect(page).toHaveURL(/\/th\/clubs$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "th");
});

test.describe("mobile menu keyboard operation", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("opens, closes on Escape, and returns focus to the toggle", async ({ page }) => {
    await page.goto("/en");

    const toggle = page.locator("header button[aria-expanded]");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    // The disclosure panel the toggle controls is now open and visible.
    const panelId = await toggle.getAttribute("aria-controls");
    await expect(page.locator(`[id="${panelId}"] a`).first()).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    // Focus must return to the toggle, not fall back to <body>.
    await expect(toggle).toBeFocused();
  });
});

test("the clubs category radiogroup is arrow-key navigable with a single tab stop", async ({
  page,
}) => {
  await page.goto("/en/clubs");

  const radios = page.getByRole("radio");
  const first = radios.first();
  const second = radios.nth(1);

  // The selected radio ("All") is the only one in the tab order.
  await expect(first).toHaveAttribute("aria-checked", "true");
  await expect(first).toHaveAttribute("tabindex", "0");
  await expect(second).toHaveAttribute("tabindex", "-1");

  await first.focus();
  await page.keyboard.press("ArrowRight");

  // Arrow moves selection and focus to the next radio (roving tabindex).
  await expect(second).toHaveAttribute("aria-checked", "true");
  await expect(second).toBeFocused();
  await expect(second).toHaveAttribute("tabindex", "0");
  await expect(first).toHaveAttribute("tabindex", "-1");
});

test("calendar day cells announce a localized event count", async ({ page }) => {
  // English page: the count suffix reads "event"/"events".
  await page.goto("/en");
  const enDay = page.locator('main button[aria-label*="event"]').first();
  await expect(enDay).toBeVisible();

  // Thai page: the same suffix is authored natively as "กิจกรรม", never the
  // English word (regression guard for the previously hard-coded label).
  await page.goto("/th");
  const thDay = page.locator('main button[aria-label*="กิจกรรม"]').first();
  await expect(thDay).toBeVisible();
  const enLeak = await page.locator('main button[aria-label*="event"]').count();
  expect(enLeak).toBe(0);
});

test("the error summary does not steal focus back while the user edits a field", async ({
  page,
}) => {
  await page.goto("/en/contact");

  await page.getByRole("button", { name: "Send message" }).click();
  const errorSummary = page.getByRole("alert").filter({ hasText: "There is a problem" });
  await expect(errorSummary).toBeFocused();

  // Start correcting the first field: focus must stay in the input across
  // keystrokes, not jump back to the summary on every re-render (SC 3.2.2).
  const nameField = page.getByLabel(/name/i).first();
  await nameField.focus();
  await nameField.pressSequentially("Jo");
  await expect(nameField).toBeFocused();
});

test.describe("dark mode (system preference)", () => {
  test.use({ colorScheme: "dark" });

  for (const path of pages) {
    test(`${path} has no automatically detectable WCAG 2.2 AA violations in dark mode`, async ({
      page,
    }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();

      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });
  }
});

test("the theme toggle switches, persists, and clears the explicit override", async ({ page }) => {
  await page.goto("/en");

  const html = page.locator("html");

  // Wait for hydration: the accessible name only reflects the resolved
  // theme once mounted (see ThemeToggle.tsx `mounted` state).
  const toggle = page.getByRole("button", { name: "Switch to dark mode" });
  await toggle.waitFor({ state: "visible" });

  // First click: light -> dark (explicit override).
  await toggle.click();
  await expect(html).toHaveAttribute("data-theme", "dark");
  const themeAfterFirstClick = await page.evaluate(() => localStorage.getItem("birsa-theme"));
  expect(themeAfterFirstClick).toBe("dark");

  // Reload: the explicit choice persists via the no-FOUC inline script.
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");

  // Second click: dark -> light. Since the system preference in this test
  // is light (default colorScheme), this matches the system and the
  // explicit override is removed entirely.
  const toggleAfterReload = page.getByRole("button", { name: "Switch to light mode" });
  await toggleAfterReload.waitFor({ state: "visible" });
  await toggleAfterReload.click();

  await expect(html).not.toHaveAttribute("data-theme", /.+/);
  const themeAfterSecondClick = await page.evaluate(() => localStorage.getItem("birsa-theme"));
  expect(themeAfterSecondClick).toBeNull();
});

test("dark mode via explicit localStorage override has no automatically detectable WCAG 2.2 AA violations", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("birsa-theme", "dark");
  });
  await page.goto("/th");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
