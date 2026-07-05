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

test("the language toggle switches locale and updates html[lang]", async ({ page }) => {
  await page.goto("/en/clubs");

  await page.getByRole("link", { name: /เปลี่ยนเป็นภาษาไทย/ }).click();

  await expect(page).toHaveURL(/\/th\/clubs$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "th");
});
