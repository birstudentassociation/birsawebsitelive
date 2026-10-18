import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { getEntries, getGuideEntries, guideTopics } from "@/lib/content";
import { locales } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";

const entries = sitemap();
const urls = entries.map((e) => e.url);
const paths = new Set(urls.map((u) => u.slice(SITE_URL.length)));

describe("sitemap", () => {
  it("lists only absolute, locale-prefixed URLs", () => {
    for (const u of urls) {
      expect(u.startsWith(`${SITE_URL}/`)).toBe(true);
      expect(u).toMatch(new RegExp(`^${SITE_URL}/(${locales.join("|")})(/|$)`));
    }
  });

  it("gives every entry th, en and x-default alternates, x-default being the th URL", () => {
    for (const e of entries) {
      const langs = e.alternates?.languages as Record<string, string> | undefined;
      expect(langs).toBeDefined();
      expect(langs!.th).toBeTruthy();
      expect(langs!.en).toBeTruthy();
      expect(langs!["x-default"]).toBe(langs!.th);
      expect([langs!.th, langs!.en]).toContain(e.url);
    }
  });

  it("has no duplicate URLs", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("includes the newer indexable pages in both locales", () => {
    for (const locale of locales) {
      for (const p of [
        "/services/study-plan",
        "/services/equipment-loan/directory",
        "/openhouse",
        "/contact/academic",
      ]) {
        expect(paths.has(`/${locale}${p}`)).toBe(true);
      }
    }
  });

  it("leaves out placeholder pages", () => {
    const placeholders: string[] = [];
    for (const page of getEntries("activity", "en")) {
      if (page.frontmatter.placeholder) placeholders.push(`/activity/${page.slug}`);
    }
    for (const topic of guideTopics) {
      for (const g of getGuideEntries("en", topic)) {
        if (g.frontmatter.placeholder) placeholders.push(`/student-life/${topic}/${g.slug}`);
      }
    }
    expect(placeholders.length).toBeGreaterThan(0);
    for (const p of placeholders) {
      for (const locale of locales) expect(paths.has(`/${locale}${p}`)).toBe(false);
    }
  });

  it("leaves out form-step pages", () => {
    for (const locale of locales) {
      for (const p of [
        "/contact/name",
        "/contact/check",
        "/clubs/start/name",
        "/privacy/your-data/name",
        "/services/study-plan/cohort",
        "/services/study-plan/plan",
      ]) {
        expect(paths.has(`/${locale}${p}`)).toBe(false);
      }
    }
  });
});
