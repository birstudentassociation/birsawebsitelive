import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  "/th",
  "/en",
  "/en/clubs",
  "/en/student-life/international/visa-and-immigration",
  "/en/services/contact",
  "/th/quick",
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

test("submitting an empty contact form shows a focused error summary with field error links", async ({
  page,
}) => {
  await page.goto("/en/services/contact");

  await page.getByRole("button", { name: "Send message" }).click();

  const errorSummary = page.getByRole("alert").filter({ hasText: "There is a problem" });
  await expect(errorSummary).toBeVisible();
  await expect(errorSummary).toBeFocused();

  const errorLinks = errorSummary.getByRole("link");
  expect(await errorLinks.count()).toBeGreaterThan(0);
});

test.describe("email scrape-proofing", () => {
  const emailPages = ["/en/services/contact", "/en/about/contact"];

  for (const path of emailPages) {
    test(`${path} raw HTML has no plaintext BIRSA/BIR email address`, async ({ request }) => {
      const response = await request.get(path);
      const body = await response.text();

      // The raw HTTP response (not the browser-parsed DOM) must never
      // contain a plaintext address a scraper could regex out of the page
      // source — every email is emitted as HTML numeric character entities.
      expect(body).not.toContain("birsa@tu.ac.th");
      expect(body).not.toContain("bir@tu.ac.th");
      expect(body).toMatch(/&#64;/); // entity-encoded "@"
    });
  }

  test("the contact page exposes a working mailto link once parsed by the browser", async ({
    page,
  }) => {
    await page.goto("/en/services/contact");

    // Once the browser parses the entities, this is an ordinary, accessible
    // mailto link — obfuscation must not cost usability.
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
