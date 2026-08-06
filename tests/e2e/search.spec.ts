import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const TAGS = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];

for (const path of [
  "/en/search?q=borrow+projector",
  "/th/search?q=%E0%B8%AD%E0%B8%A2%E0%B8%B2%E0%B8%81%E0%B8%A2%E0%B8%B7%E0%B8%A1%E0%B8%82%E0%B8%AD%E0%B8%87",
  "/en/search?q=fire",
  "/en/search?q=club&section=clubs",
  "/en/search?q=zzqqxx",
]) {
  test(`results state ${path} has no axe violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}

test("results page has exactly one h1 and no skipped heading levels", async ({ page }) => {
  await page.goto("/en/search?q=borrow+projector");
  const levels = await page
    .locator("h1, h2, h3, h4, h5, h6")
    .evaluateAll((nodes) => nodes.map((node) => Number(node.tagName.slice(1))));
  expect(levels.filter((level) => level === 1)).toHaveLength(1);
  for (let i = 1; i < levels.length; i += 1) {
    expect((levels[i] ?? 0) - (levels[i - 1] ?? 0)).toBeLessThanOrEqual(1);
  }
});

test("typeahead is operable by keyboard and announces suggestions", async ({ page }) => {
  await page.goto("/en/search");
  const input = page.locator("#search-q");
  await input.click();
  await input.fill("projector");

  const listbox = page.locator('ul[role="listbox"]');
  await expect(listbox).toBeVisible();
  await expect(input).toHaveAttribute("aria-expanded", "true");

  await input.press("ArrowDown");
  const activeId = await input.getAttribute("aria-activedescendant");
  expect(activeId).toBeTruthy();
  await expect(page.locator(`#${activeId}`)).toHaveAttribute("aria-selected", "true");

  await input.press("Escape");
  await expect(listbox).toBeHidden();
  await expect(input).toBeFocused();
});

test("typeahead navigates to the active suggestion on Enter", async ({ page }) => {
  await page.goto("/en/search");
  const input = page.locator("#search-q");
  await input.fill("projector");
  await expect(page.locator('ul[role="listbox"]')).toBeVisible();
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/en\/services\/equipment-loan/);
});

test("search form still submits as plain GET without using suggestions", async ({ page }) => {
  await page.goto("/en/search");
  await page.locator("#search-q").fill("shuttle bus");
  await page.getByRole("button", { name: /search/i }).click();
  await expect(page).toHaveURL(/\/en\/search\?q=shuttle\+bus/);
  await expect(page.locator("body")).toContainText("Shuttle bus");
});

test("header search expands and closes with Escape", async ({ page }) => {
  await page.goto("/en");
  // Located by attribute, not name: the accessible name deliberately changes
  // to "Close search" once the panel opens.
  const toggle = page.locator("header a[aria-expanded]");
  await expect(toggle).toHaveAttribute("aria-label", "Search");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  const panelInput = page.locator('header input[type="search"]');
  await expect(panelInput).toBeVisible();
  await panelInput.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
});
