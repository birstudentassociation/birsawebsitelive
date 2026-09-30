import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { answerRedirects, answersRedirects } from "@/lib/answers-redirects.mjs";
import { locales } from "@/lib/i18n";

const root = process.cwd();

/** Old `/answers/{slug}` pages that must keep working. */
const oldSlugs = [
  "you",
  "start",
  "activity-approval",
  "start-a-club-check",
  "who-to-contact",
  "raise-a-problem",
  "borrow-equipment",
  "academic-rules",
  "internship-check",
  "choose-courses",
  "settle-in",
  "money-and-fees",
  "health-and-safety",
  "getting-around",
  "rights-and-representation",
];

/** A destination is real if it is a route, a student life topic, or a guide. */
function destinationExists(to: string): boolean {
  const routeDir = path.join(root, "app", "[lang]", ...to.split("/").filter(Boolean));
  if (existsSync(path.join(routeDir, "page.tsx"))) return true;

  const guide = to.replace("/student-life/", "");
  if (to.startsWith("/student-life/")) {
    return locales.every(
      (locale) =>
        existsSync(path.join(root, "content", "student-life", locale, guide)) ||
        existsSync(path.join(root, "content", "student-life", locale, `${guide}.mdx`))
    );
  }
  return to === "/student-life";
}

describe("retired /answers URLs redirect", () => {
  it("covers every old slug", () => {
    for (const slug of oldSlugs) {
      expect(answerRedirects, `no redirect for /answers/${slug}`).toHaveProperty(slug);
    }
  });

  it("sends every old URL to a destination that exists", () => {
    for (const [slug, to] of Object.entries(answerRedirects)) {
      expect(destinationExists(to), `/answers/${slug} redirects to missing "${to}"`).toBe(true);
    }
  });

  it("redirects the hub, each topic and its /q step, permanently and locale-preserving", () => {
    const redirects = answersRedirects();
    expect(redirects).toContainEqual({
      source: "/:lang/answers",
      destination: "/:lang/student-life",
      permanent: true,
    });
    for (const slug of oldSlugs) {
      for (const suffix of ["", "/q"]) {
        const found = redirects.find((entry) => entry.source === `/:lang/answers/${slug}${suffix}`);
        expect(found, `missing /answers/${slug}${suffix}`).toBeDefined();
        expect(found?.permanent).toBe(true);
        expect(found?.destination.startsWith("/:lang/")).toBe(true);
      }
    }
  });

  it("has no redirect loops through the retired section", () => {
    for (const to of Object.values(answerRedirects)) expect(to.startsWith("/answers")).toBe(false);
  });
});
