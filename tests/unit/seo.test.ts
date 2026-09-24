import { describe, expect, it } from "vitest";
import {
  buildMetadata,
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  fitDescription,
  fitTitle,
  TITLE_MAX,
  type BuildMetadataOptions,
} from "@/lib/seo";
import { breadcrumbJsonLd, newsJsonLd } from "@/lib/structured-data";
import {
  getClubEntries,
  getEntries,
  getGuideEntries,
  isArchivedEvent,
  isPastEvent,
  type GuideAudience,
} from "@/lib/content";
import { courses } from "@/content/course-review/courses";
import { locales, type Locale } from "@/lib/i18n";

const guideAudiences: GuideAudience[] = ["home", "international", "handbook"];

function titleOf(options: BuildMetadataOptions): string {
  const { title } = buildMetadata(options);
  return (title as { absolute: string }).absolute;
}

describe("fitTitle", () => {
  it("adds the site name when it fits", () => {
    expect(fitTitle("Clubs")).toBe("Clubs | BIRSA");
  });

  it("never repeats the site name", () => {
    expect(fitTitle("Contact BIRSA")).toBe("Contact BIRSA");
  });

  it("drops the site name when the page title alone fits", () => {
    const title = "Bitkub staff share job-hunting advice at Tha Prachan campus";
    expect(fitTitle(title)).toBe(title);
  });

  it("cuts an English title at a word boundary", () => {
    const fitted = fitTitle(
      "Faculty of Political Science welcomes new students on 1 August 2026 at Tha Prachan"
    );
    expect(fitted.length).toBeLessThanOrEqual(TITLE_MAX);
    expect(fitted).toBe("Faculty of Political Science welcomes new students on 1…");
  });

  it("cuts a Thai title between words, not inside one", () => {
    const title =
      "ธรรมศาสตร์ขอให้นักศึกษาที่ติดไข้หวัดใหญ่หรือ COVID-19 พักรักษาตัวอยู่บ้านจนกว่าจะหายดี";
    const fitted = fitTitle(title);
    expect(fitted.length).toBeLessThanOrEqual(TITLE_MAX);
    const head = fitted.slice(0, -1);
    const segments = [...new Intl.Segmenter("th", { granularity: "word" }).segment(title)];
    expect(segments.some((s) => s.index === head.length)).toBe(true);
  });
});

describe("fitDescription", () => {
  it("leaves a short description alone", () => {
    expect(fitDescription("A short description.")).toBe("A short description.");
  });

  it("keeps whole sentences when they fit", () => {
    const text =
      "Thammasat University requires every student to switch on multi-factor authentication by 1 August 2026. Set it up with Microsoft Authenticator on your university account before then.";
    expect(fitDescription(text)).toBe(
      "Thammasat University requires every student to switch on multi-factor authentication by 1 August 2026."
    );
  });

  it("cuts at a word when no sentence fits", () => {
    const fitted = fitDescription("word ".repeat(60));
    expect(fitted.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
    expect(fitted.endsWith("word…")).toBe(true);
  });
});

describe("structured data", () => {
  it("builds a breadcrumb trail with absolute URLs, leaving the current page unlinked", () => {
    const data = breadcrumbJsonLd("en", [
      { label: "BIRSA", href: "/" },
      { label: "What's on", href: "/news" },
      { label: "A post" },
    ]);
    const items = data.itemListElement as Record<string, unknown>[];
    expect(items.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(String(items[1]!.item)).toMatch(/\/en\/news$/);
    expect(items[2]!.item).toBeUndefined();
  });

  it("marks news as an article and events as events", () => {
    for (const locale of locales) {
      for (const post of getEntries("news", locale)) {
        const data = newsJsonLd(locale, post.slug, post.frontmatter, post.frontmatter.summary);
        const expected =
          post.frontmatter.type === "event" && post.frontmatter.start ? "Event" : "NewsArticle";
        expect(data["@type"]).toBe(expected);
      }
    }
  });
});

describe("every indexable content page has a search-ready title and description", () => {
  for (const locale of locales) {
    const pages: BuildMetadataOptions[] = [
      ...getEntries("news", locale).map((e) => ({
        locale,
        title: e.frontmatter.title,
        description: e.frontmatter.metaDescription ?? e.frontmatter.summary,
        path: `/news/${e.slug}`,
      })),
      ...getEntries("activity", locale).map((e) => ({
        locale,
        title: e.frontmatter.title,
        description: e.frontmatter.metaDescription ?? e.frontmatter.summary,
        path: `/activity/${e.slug}`,
      })),
      ...guideAudiences.flatMap((audience) =>
        getGuideEntries(locale, audience).map((e) => ({
          locale,
          title: e.frontmatter.title,
          description: e.frontmatter.metaDescription ?? e.frontmatter.summary,
          path: `/student-life/${audience}/${e.slug}`,
        }))
      ),
      ...getClubEntries(locale).map((e) => ({
        locale,
        title: e.frontmatter.title,
        description: e.frontmatter.metaDescription ?? e.frontmatter.tagline,
        path: `/clubs/${e.slug}`,
      })),
      ...courses.map((c) => ({
        locale: locale as Locale,
        title: `${c.code} ${c.title[locale]}`,
        description: c.description[locale],
        path: `/student-life/course-reviews/${c.code}`,
      })),
    ];

    it(`${locale}: titles fit in ${TITLE_MAX} characters and name BIRSA at most once`, () => {
      for (const page of pages) {
        const title = titleOf(page);
        expect(title.length, page.path).toBeLessThanOrEqual(TITLE_MAX);
        expect(title.split("BIRSA").length - 1, page.path).toBeLessThanOrEqual(1);
      }
    });

    it(`${locale}: descriptions fit in ${DESCRIPTION_MAX} characters`, () => {
      for (const page of pages) {
        const { description } = buildMetadata(page);
        expect(description?.length, page.path).toBeLessThanOrEqual(DESCRIPTION_MAX);
      }
    });

    it(`${locale}: written pages have descriptions of at least ${DESCRIPTION_MIN} characters`, () => {
      for (const page of pages.filter((p) => !p.path.includes("/course-reviews/"))) {
        const { description } = buildMetadata(page);
        expect(description?.length, page.path).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
      }
    });

    it(`${locale}: no two pages share a title or a description`, () => {
      const titles = pages.map(titleOf);
      const descriptions = pages.map((p) => buildMetadata(p).description);
      const dupes = (list: unknown[]) => list.filter((v, i) => list.indexOf(v) !== i);
      expect(dupes(titles)).toEqual([]);
      expect(dupes(descriptions)).toEqual([]);
    });
  }
});

describe("event lifecycle", () => {
  const event = {
    title: "An event",
    summary: "An event.",
    date: "2026-08-01",
    type: "event" as const,
    category: "events",
    start: "2026-08-10T02:00:00.000Z",
    end: "2026-08-10T09:00:00.000Z",
  };

  it("is not past before it ends", () => {
    expect(isPastEvent(event, new Date("2026-08-10T08:00:00Z"))).toBe(false);
  });

  it("is past once it ends, and still indexed for a year", () => {
    const now = new Date("2026-08-11T00:00:00Z");
    expect(isPastEvent(event, now)).toBe(true);
    expect(isArchivedEvent(event, now)).toBe(false);
  });

  it("is dropped from search a year after it ends", () => {
    expect(isArchivedEvent(event, new Date("2027-08-11T00:00:00Z"))).toBe(true);
  });

  it("never treats news or undated events as past", () => {
    const now = new Date("2030-01-01T00:00:00Z");
    expect(isPastEvent({ ...event, type: "news" }, now)).toBe(false);
    expect(isPastEvent({ ...event, start: undefined, end: undefined }, now)).toBe(false);
  });

  it("no news post uses a slug the monthly calendar redirect would hide", () => {
    for (const locale of locales) {
      for (const post of getEntries("news", locale)) {
        expect(post.slug).not.toMatch(/^[a-z]+-\d{4}-activity-calendar$/);
      }
    }
  });
});
