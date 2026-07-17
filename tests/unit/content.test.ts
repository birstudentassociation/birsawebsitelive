import { describe, expect, it } from "vitest";
import { getEntries, getGuideEntries, type Section } from "@/lib/content";
import { locales, type Locale } from "@/lib/i18n";
import { clubs } from "@/content/clubs/clubs";
import { committee } from "@/content/committee";

const sections: Section[] = ["news", "activity"];
const guideAudiences: ("home" | "international")[] = ["home", "international"];

describe("content loaders: every section and locale has real, valid frontmatter", () => {
  for (const section of sections) {
    for (const locale of locales) {
      it(`getEntries("${section}", "${locale}") returns entries without throwing`, () => {
        expect(() => getEntries(section, locale)).not.toThrow();
        const entries = getEntries(section, locale);
        expect(entries.length).toBeGreaterThan(0);
      });
    }
  }

  for (const audience of guideAudiences) {
    for (const locale of locales) {
      it(`getGuideEntries("${locale}", "${audience}") returns entries without throwing`, () => {
        expect(() => getGuideEntries(locale, audience)).not.toThrow();
        const entries = getGuideEntries(locale, audience);
        expect(entries.length).toBeGreaterThan(0);
      });
    }
  }
});

function slugSet(entries: { slug: string }[]): Set<string> {
  return new Set(entries.map((entry) => entry.slug));
}

describe("slug parity across locales", () => {
  for (const section of sections) {
    it(`"${section}" has the same slug set in en and th`, () => {
      const enSlugs = slugSet(getEntries(section, "en"));
      const thSlugs = slugSet(getEntries(section, "th"));
      expect(enSlugs).toEqual(thSlugs);
    });
  }

  for (const audience of guideAudiences) {
    it(`student-life/${audience} has the same slug set in en and th`, () => {
      const enSlugs = slugSet(getGuideEntries("en", audience));
      const thSlugs = slugSet(getGuideEntries("th", audience));
      expect(enSlugs).toEqual(thSlugs);
    });
  }
});

describe("news is sorted date-desc", () => {
  for (const locale of locales) {
    it(`"news" (${locale}) is sorted newest first`, () => {
      const entries = getEntries("news", locale);
      const dates = entries.map((entry) => (entry.frontmatter as { date: string }).date);
      const sorted = [...dates].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
      expect(dates).toEqual(sorted);
    });
  }
});

describe("activity and about are sorted order-asc", () => {
  const orderedSections: Section[] = ["activity"];
  for (const section of orderedSections) {
    for (const locale of locales) {
      it(`"${section}" (${locale}) is sorted by order ascending`, () => {
        const entries = getEntries(section, locale);
        const orders = entries.map((entry) => (entry.frontmatter as { order: number }).order);
        const sorted = [...orders].sort((a, b) => a - b);
        expect(orders).toEqual(sorted);
      });
    }
  }
});

describe("student-life guides are sorted order-asc", () => {
  for (const audience of guideAudiences) {
    for (const locale of locales) {
      it(`student-life/${audience} (${locale}) is sorted by order ascending`, () => {
        const entries = getGuideEntries(locale, audience);
        const orders = entries.map((entry) => entry.frontmatter.order);
        const sorted = [...orders].sort((a, b) => a - b);
        expect(orders).toEqual(sorted);
      });
    }
  }
});

describe("clubs.ts", () => {
  const localesToCheck: Locale[] = ["en", "th"];

  it("every club has both en and th content blocks with non-empty fields", () => {
    for (const club of clubs) {
      for (const locale of localesToCheck) {
        const content = club[locale];
        expect(content, `club "${club.slug}" is missing "${locale}" content`).toBeDefined();
        expect(content.name.length).toBeGreaterThan(0);
        expect(content.tagline.length).toBeGreaterThan(0);
        expect(content.description.length).toBeGreaterThan(0);
        expect(content.howToJoin.length).toBeGreaterThan(0);
      }
    }
  });

  it("every club has a unique slug", () => {
    const slugs = clubs.map((club) => club.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("committee.ts", () => {
  const localesToCheck: Locale[] = ["en", "th"];
  const kebabCase = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  const emailLike = /@/;
  const longDigitRun = /\d{10,}/;

  it("has exactly 21 entries: 10 officers + 11 assistant officers", () => {
    expect(committee.length).toBe(21);
    expect(committee.filter((member) => member.group === "officer").length).toBe(10);
    expect(committee.filter((member) => member.group === "assistant").length).toBe(11);
  });

  it("every key is unique and kebab-case", () => {
    const keys = committee.map((member) => member.key);
    expect(new Set(keys).size).toBe(keys.length);
    for (const key of keys) {
      expect(key, `"${key}" is not kebab-case`).toMatch(kebabCase);
    }
  });

  it("every entry has non-empty en and th firstName/lastName/nickname/title", () => {
    for (const member of committee) {
      for (const locale of localesToCheck) {
        const t = member[locale];
        expect(t.firstName.length, `${member.key} (${locale}) missing firstName`).toBeGreaterThan(
          0
        );
        expect(t.lastName.length, `${member.key} (${locale}) missing lastName`).toBeGreaterThan(0);
        expect(t.nickname.length, `${member.key} (${locale}) missing nickname`).toBeGreaterThan(0);
        expect(t.title.length, `${member.key} (${locale}) missing title`).toBeGreaterThan(0);
      }
    }
  });

  it("no entry contains an email address or a student-ID-like digit run", () => {
    for (const member of committee) {
      const fields = [
        member.key,
        member.en.firstName,
        member.en.lastName,
        member.en.nickname,
        member.en.title,
        member.th.firstName,
        member.th.lastName,
        member.th.nickname,
        member.th.title,
      ];
      for (const field of fields) {
        expect(field, `"${field}" on ${member.key} looks like an email`).not.toMatch(emailLike);
        expect(field, `"${field}" on ${member.key} looks like a student ID`).not.toMatch(
          longDigitRun
        );
      }
    }
  });
});
