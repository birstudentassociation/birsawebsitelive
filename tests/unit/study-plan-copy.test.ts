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

  describe("the delete-your-plan copy", () => {
    // The plan is only on the device, but a student who opted in to the anonymous
    // elective demand signal has rows on BIRSA's side, so "nothing to delete" is no
    // longer exactly true. Both the delete section and the confirmation say what is.
    it("no longer says there is nothing on BIRSA's side to delete", () => {
      const en = buildStudyPlanCopy("en");
      for (const text of [en.delete.body, en.start.deletedBody]) {
        expect(text).not.toMatch(/nothing (for us )?to delete|nothing left anywhere/i);
        expect(text).not.toMatch(/never held a copy of it/i);
      }
    });

    it("says the plan itself is only on the device, in both languages", () => {
      const en = buildStudyPlanCopy("en");
      expect(en.delete.body).toMatch(/plan itself lives only in your browser/i);
      expect(en.delete.body).toMatch(/never sent to a BIRSA server/i);
      expect(buildStudyPlanCopy("th").delete.body).toContain(
        "ตัวแผนการศึกษาจัดเก็บไว้ในเบราว์เซอร์ของท่านเท่านั้น"
      );
    });

    it("says the anonymous demand rows cannot be linked back, and go on the retention schedule", () => {
      const patterns = {
        en: [/anonymous/i, /linked back to you/i, /retention schedule/i],
        th: [/ไม่ระบุตัวตน/, /เชื่อมโยงกลับมาถึงท่านได้/, /ระยะเวลาการเก็บรักษา/],
      };
      for (const locale of locales) {
        const { delete: section, start } = buildStudyPlanCopy(locale);
        for (const text of [section.body, start.deletedBody]) {
          for (const pattern of patterns[locale])
            expect(text, `${locale} ${pattern}`).toMatch(pattern);
        }
      }
    });

    it("keeps the Thai as Thai sentences, with no full stop at the end", () => {
      const th = buildStudyPlanCopy("th");
      for (const text of [th.delete.body, th.start.deletedBody]) {
        expect(text).toMatch(/[฀-๿]/);
        expect(text).not.toMatch(/\.$/);
      }
    });
  });
});
