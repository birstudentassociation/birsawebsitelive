import { describe, expect, it } from "vitest";
import { buildStudyPlanCopy } from "@/components/study-plan/studyPlanCopy";
import { locales } from "@/lib/i18n";

describe("buildStudyPlanCopy", () => {
  it("returns a non-empty string for every key in every locale", () => {
    for (const locale of locales) {
      const copy = buildStudyPlanCopy(locale);
      const walk = (node: unknown, path: string): void => {
        if (typeof node === "string") {
          expect(node.trim().length, `${locale} ${path}`).toBeGreaterThan(0);
          return;
        }
        if (node && typeof node === "object") {
          for (const [key, value] of Object.entries(node)) walk(value, `${path}.${key}`);
        }
      };
      walk(copy, locale);
    }
  });

  it("uses no em dashes, per the site writing standard", () => {
    for (const locale of locales) {
      expect(JSON.stringify(buildStudyPlanCopy(locale))).not.toContain("—");
    }
  });

  it("has the same key shape in both locales", () => {
    const keys = (o: object): string[] =>
      Object.entries(o)
        .flatMap(([k, v]) => (v && typeof v === "object" ? keys(v).map((s) => `${k}.${s}`) : [k]))
        .sort();
    expect(keys(buildStudyPlanCopy("en"))).toEqual(keys(buildStudyPlanCopy("th")));
  });
});
