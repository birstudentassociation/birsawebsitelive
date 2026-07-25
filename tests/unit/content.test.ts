import { describe, expect, it } from "vitest";
import { getClubEntries, getEntries, getGuideEntries, type Section } from "@/lib/content";
import { locales, type Locale } from "@/lib/i18n";
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

describe("clubs", () => {
  const localesToCheck: Locale[] = ["en", "th"];

  for (const locale of localesToCheck) {
    it(`getClubEntries("${locale}") loads and validates every club`, () => {
      expect(() => getClubEntries(locale)).not.toThrow();
      expect(getClubEntries(locale).length).toBeGreaterThan(0);
    });
  }

  it("every club has a unique slug and a non-empty body", () => {
    for (const locale of localesToCheck) {
      const entries = getClubEntries(locale);
      const slugs = entries.map((entry) => entry.slug);
      expect(new Set(slugs).size, `duplicate club slug in "${locale}"`).toBe(slugs.length);
      for (const entry of entries) {
        expect(
          entry.content.trim().length,
          `club "${entry.slug}" (${locale}) has an empty body`
        ).toBeGreaterThan(0);
      }
    }
  });

  it("every club exists in both locales, with matching category and order", () => {
    const en = getClubEntries("en");
    const th = getClubEntries("th");
    expect(th.map((entry) => entry.slug).sort()).toEqual(en.map((entry) => entry.slug).sort());

    for (const entry of en) {
      const twin = th.find((other) => other.slug === entry.slug);
      expect(twin, `club "${entry.slug}" is missing its Thai page`).toBeDefined();
      expect(twin?.frontmatter.category, `category differs for "${entry.slug}"`).toBe(
        entry.frontmatter.category
      );
      expect(twin?.frontmatter.order, `order differs for "${entry.slug}"`).toBe(
        entry.frontmatter.order
      );
      expect(twin?.frontmatter.custodian, `custodian differs for "${entry.slug}"`).toBe(
        entry.frontmatter.custodian
      );
    }
  });

  // `RelatedClubs` skips unknown slugs at render time rather than throwing, so
  // a typo would silently drop a link. Catch it here instead.
  it("every slug referenced by <RelatedClubs> resolves to a real club", () => {
    for (const locale of localesToCheck) {
      const entries = getClubEntries(locale);
      const known = new Set(entries.map((entry) => entry.slug));
      for (const entry of entries) {
        for (const match of entry.content.matchAll(/<RelatedClubs\s+slugs="([^"]*)"/g)) {
          const referenced = (match[1] ?? "")
            .split(",")
            .map((slug) => slug.trim())
            .filter(Boolean);
          expect(
            referenced.length,
            `club "${entry.slug}" (${locale}) has an empty slugs list`
          ).toBeGreaterThan(0);
          for (const slug of referenced) {
            expect(
              known.has(slug),
              `club "${entry.slug}" (${locale}) links to unknown "${slug}"`
            ).toBe(true);
          }
          expect(referenced, `club "${entry.slug}" (${locale}) links to itself`).not.toContain(
            entry.slug
          );
        }
      }
    }
  });

  // The `blockJS` stripping that makes `slugs` a string applies to every
  // attribute, so an authored expression anywhere in club MDX would be dropped
  // silently at render time rather than failing the build.
  it("no club page passes a JSX attribute expression to a component", () => {
    for (const locale of localesToCheck) {
      for (const entry of getClubEntries(locale)) {
        expect(
          entry.content,
          `club "${entry.slug}" (${locale}) uses an attribute expression, which next-mdx-remote strips`
        ).not.toMatch(/<[A-Z]\w*[^>]*\s\w+=\{/);
      }
    }
  });

  it("no club page uses em dashes or en dashes", () => {
    for (const locale of localesToCheck) {
      for (const entry of getClubEntries(locale)) {
        expect(entry.content, `club "${entry.slug}" (${locale}) contains a dash`).not.toMatch(
          /[—–]/
        );
      }
    }
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
