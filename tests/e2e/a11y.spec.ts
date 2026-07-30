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
  "/clubs/tu-mun", // club detail: MDX body with a table and a related-clubs block
  "/clubs/bir-mock-fund", // club detail: MDX body with a Notice callout
  "/clubs/start", // start-a-club form
  "/student-life", // track index (sideways nav)
  "/student-life/getting-started", // step-by-step audience chooser
  "/student-life/getting-started/international", // step-by-step track (client-enhanced checklist)
  "/student-life/getting-started/home",
  "/student-life/home",
  "/student-life/international",
  "/student-life/international/visa-and-immigration", // guide article (MDX)
  "/student-life/home/food-and-budgeting",
  "/student-life/home/places-nearby", // OSM tile map with anchor markers
  "/student-life/course-reviews", // course catalogue browser
  "/student-life/course-reviews/PI121", // course detail
  "/services",
  "/services/equipment-loan", // DB-degraded "not configured" state
  "/services/equipment-loan/directory", // club equipment directory (DB-degraded)
  "/services/equipment-loan/status", // status lookup form
  "/emergency", // calm emergency-preparedness landing
  "/answers", // smart answers hub
  "/answers/you", // audience profile form
  "/answers/activity-approval", // smart answer topic start page
  "/answers/activity-approval/q", // smart answer question page (first step)
  "/answers/start/q", // the "not sure where to start" triage question
  "/answers/settle-in/q?p=international.starting", // a step tailored by profile
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
  // The contact form is one question per page, so the error summary lives on
  // whichever step failed validation. The subject step is the first one with
  // a required field and no default, so submitting it empty is the smallest
  // way to exercise the shared ErrorSummary behaviour.
  await page.goto("/en/contact/subject");

  await page.getByRole("button", { name: "Continue" }).click();

  const errorSummary = page.getByRole("alert").filter({ hasText: "There is a problem" });
  await expect(errorSummary).toBeVisible();
  await expect(errorSummary).toBeFocused();

  const errorLinks = errorSummary.getByRole("link");
  expect(await errorLinks.count()).toBeGreaterThan(0);
});

// Where places are genuinely next door, `layoutMarkers` fans the markers out
// and draws a leader line back to the true spot, so every marker stays its own
// hittable target (WCAG 2.2 SC 2.5.8). The layout is solved at MIN_MAP_WIDTH,
// so the narrow viewport below is the one that would break first: it is the
// case that regressed before. See components/places/PlacesMap.tsx.
for (const width of [1280, 375]) {
  test(`places map markers are links and never overlap at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/en/student-life/home/places-nearby");

    const maps = page.locator('div[role="group"]');
    expect(await maps.count()).toBeGreaterThan(0);

    const overlaps = await page.evaluate(() => {
      const found: string[] = [];
      for (const map of document.querySelectorAll('div[role="group"]')) {
        const pins = [...map.querySelectorAll('a[href^="#place-"]')].map((pin) => ({
          id: pin.getAttribute("href") ?? "",
          r: pin.getBoundingClientRect(),
        }));
        for (const [i, first] of pins.entries()) {
          for (const second of pins.slice(i + 1)) {
            const a = first.r;
            const b = second.r;
            const clears =
              a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top;
            if (!clears) found.push(`${first.id} / ${second.id}`);
          }
        }
      }
      return found;
    });
    expect(overlaps, `overlapping markers: ${overlaps.join(", ")}`).toEqual([]);

    // Every place on a map is reachable as its own link, and every list entry
    // still carries its own full-size "Open in Google Maps" link.
    const markerLinks = await page.locator('div[role="group"] a[href^="#place-"]').count();
    expect(markerLinks).toBeGreaterThan(0);
    expect(await page.locator('ol li a[href*="google.com/maps"]').count()).toBeGreaterThanOrEqual(
      markerLinks
    );
  });
}

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
  await page.goto("/en/contact/subject");

  await page.getByRole("button", { name: "Continue" }).click();
  const errorSummary = page.getByRole("alert").filter({ hasText: "There is a problem" });
  await expect(errorSummary).toBeFocused();

  // Start correcting the field: focus must stay in the input across
  // keystrokes, not jump back to the summary on every re-render (SC 3.2.2).
  const subjectField = page.getByLabel(/^subject/i).first();
  await subjectField.focus();
  await subjectField.pressSequentially("Jo");
  await expect(subjectField).toBeFocused();
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

// ---------------------------------------------------------------------------
// Heading structure, document title/lang, and skip link: things axe-core
// does not check (or checks only weakly, e.g. "page has a heading" but not
// "heading levels never skip"). See GOV.UK "accessibility for developers: an
// introduction", which calls out heading structure by name as something a
// manual pass must confirm.
// ---------------------------------------------------------------------------

test.describe("heading structure", () => {
  for (const path of pages) {
    test(`${path} has exactly one h1 and no skipped heading levels`, async ({ page }) => {
      await page.goto(path);

      const levels = await page.evaluate(() =>
        [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((heading) =>
          Number(heading.tagName.slice(1))
        )
      );

      const h1Count = levels.filter((level) => level === 1).length;
      expect(h1Count, `expected exactly one h1, found ${h1Count}: levels were ${levels.join(", ")}`).toBe(
        1
      );

      for (let i = 1; i < levels.length; i++) {
        const previous = levels[i - 1] as number;
        const current = levels[i] as number;
        const jump = current - previous;
        expect(
          jump,
          `heading level skipped from h${previous} to h${current} (full sequence: ${levels.join(", ")})`
        ).toBeLessThanOrEqual(1);
      }
    });
  }
});

test.describe("document title and lang attribute", () => {
  // Serial: the uniqueness check accumulates titles in a Map held in the
  // worker process. Split across parallel workers each worker gets its own
  // Map, so a genuine collision can slip through or be reported against an
  // arbitrary one of the two pages, depending on how the tests shard.
  test.describe.configure({ mode: "serial" });

  const seenTitles = new Map<string, string>();

  for (const path of pages) {
    test(`${path} has a unique, non-empty title and the correct lang attribute`, async ({
      page,
    }) => {
      await page.goto(path);

      const title = await page.title();
      expect(title.trim().length, `page title was empty`).toBeGreaterThan(0);

      const expectedLang = path.startsWith("/th") ? "th" : "en";

      // Uniqueness is scoped to a locale. The same page in both languages can
      // legitimately share a title when that title is a proper noun that does
      // not translate, for example the club "TU MUN". What must never happen
      // is two different pages in the SAME language sharing a title, because
      // then neither the tab strip nor a screen reader can tell them apart.
      const key = `${expectedLang}::${title}`;
      const owner = seenTitles.get(key);
      expect(
        owner,
        `title "${title}" is also used by ${owner}: every page in a language needs a distinct title`
      ).toBeUndefined();
      seenTitles.set(key, path);

      await expect(page.locator("html")).toHaveAttribute("lang", expectedLang);
    });
  }
});

test.describe("skip link", () => {
  test("is the first focusable element and moves focus to the main landmark", async ({ page }) => {
    await page.goto("/en");

    // Nothing has been focused yet: the very first Tab press must land on
    // the skip link, not on the header logo or nav behind it.
    await page.keyboard.press("Tab");
    const skipLink = page.locator("a.skip-link");
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toHaveAttribute("href", "#main");

    await page.keyboard.press("Enter");
    const main = page.locator("#main");
    await expect(main).toBeFocused();
  });

  test("is reachable and correctly labelled on the Thai locale too", async ({ page }) => {
    await page.goto("/th");
    await page.keyboard.press("Tab");
    const skipLink = page.locator("a.skip-link");
    await expect(skipLink).toBeFocused();
    await expect(skipLink).not.toHaveText("");
  });
});
