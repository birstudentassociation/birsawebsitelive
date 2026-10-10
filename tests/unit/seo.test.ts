import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildMetadata,
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  fitDescription,
  fitTitle,
  hasOwnShareImage,
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
  guideTopics,
} from "@/lib/content";
import { courses } from "@/content/course-review/courses";
import { locales, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";

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
      ...guideTopics.flatMap((topic) =>
        getGuideEntries(locale, topic).map((e) => ({
          locale,
          title: e.frontmatter.title,
          description: e.frontmatter.metaDescription ?? e.frontmatter.summary,
          path: `/student-life/${topic}/${e.slug}`,
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

  it("keeps a start-only event current until its Bangkok start day ends", () => {
    const startOnly = { ...event, start: "2026-08-10T09:00:00+07:00", end: undefined };
    expect(isPastEvent(startOnly, new Date("2026-08-10T10:00:00+07:00"))).toBe(false);
    expect(isPastEvent(startOnly, new Date("2026-08-10T23:59:00+07:00"))).toBe(false);
    expect(isPastEvent(startOnly, new Date("2026-08-11T00:00:01+07:00"))).toBe(true);
  });

  it("uses the Bangkok day, not the UTC day, for a late start-only event", () => {
    const startOnly = { ...event, start: "2026-08-10T23:00:00+07:00", end: undefined };
    expect(isPastEvent(startOnly, new Date("2026-08-10T16:59:00Z"))).toBe(false);
    expect(isPastEvent(startOnly, new Date("2026-08-10T17:00:01Z"))).toBe(true);
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

describe("buildMetadata share images", () => {
  const options = { title: "Clubs", description: "x".repeat(100), path: "/clubs" };
  const images = (value: unknown) => value as { url: string; alt: string }[];

  it.each(locales)("gives a listed page its section card for %s", (locale) => {
    const { openGraph, twitter } = buildMetadata({ ...options, locale });
    const card = { url: `${SITE_URL}/${locale}/og/clubs`, width: 1200, height: 630 };
    expect(images(openGraph?.images)).toEqual([expect.objectContaining(card)]);
    expect(images(twitter?.images)).toEqual([expect.objectContaining(card)]);
    expect(images(openGraph?.images)[0]?.alt).toBe(locale === "th" ? "ชมรม" : "Clubs");
  });

  it.each([
    ["/contact/email", "contact"],
    ["/services/equipment-loan/projector/request/dates", "services/equipment-loan"],
    ["/emergency/flooding/claims", "emergency"],
    ["/student-life/getting-started/international", "student-life/getting-started"],
  ])("gives %s the card of the nearest listed page", (path, card) => {
    const { openGraph } = buildMetadata({ ...options, locale: "en", path });
    expect(images(openGraph?.images)[0]?.url).toBe(`${SITE_URL}/en/og/${card}`);
  });

  it.each(locales)("falls back to the site-wide share images for %s", (locale) => {
    const { openGraph, twitter } = buildMetadata({
      ...options,
      locale,
      path: "/officer/inventory",
    });
    expect(images(openGraph?.images)).toHaveLength(1);
    expect(images(openGraph?.images)[0]).toMatchObject({
      url: `${SITE_URL}/${locale}/opengraph-image`,
      width: 1200,
      height: 630,
    });
    expect(images(twitter?.images)).toHaveLength(1);
    expect(images(twitter?.images)[0]).toMatchObject({
      url: `${SITE_URL}/${locale}/twitter-image`,
      width: 1200,
      height: 630,
    });
  });

  it.each([
    ["/6-october", "6-october"],
    ["/advisory", "advisory"],
    ["/emergency/fire", "emergency/fire"],
    ["/news/welcome-bir-batch-18", "news/welcome-bir-batch-18"],
    ["/student-life/course-reviews/PS101", "student-life/course-reviews/PS101"],
    ["/clubs/asa-ir", "clubs/asa-ir"],
    ["/activity/bir-programme", "activity/bir-programme"],
    ["/student-life/money/bank-account", "student-life/money/bank-account"],
  ])("points %s at its own share images", (path, segment) => {
    const { openGraph, twitter } = buildMetadata({ ...options, locale: "th", path });
    expect(images(openGraph?.images)).toHaveLength(1);
    expect(images(openGraph?.images)[0]?.url).toBe(`${SITE_URL}/th/${segment}/opengraph-image`);
    expect(images(twitter?.images)).toHaveLength(1);
    expect(images(twitter?.images)[0]?.url).toBe(`${SITE_URL}/th/${segment}/twitter-image`);
  });

  it("uses the site-wide images for the home page", () => {
    const { openGraph } = buildMetadata({ ...options, locale: "en", path: "/" });
    expect(images(openGraph?.images)[0]?.url).toBe(`${SITE_URL}/en/opengraph-image`);
  });

  it("describes the images in the page language", () => {
    const en = buildMetadata({ ...options, locale: "en", path: "/search" });
    const th = buildMetadata({ ...options, locale: "th", path: "/search" });
    const alt = (m: typeof en) => images(m.openGraph?.images)[0]?.alt;
    expect(alt(en)).toMatch(/Thammasat/);
    expect(alt(th)).toMatch(/[฀-๿]/);
    expect(alt(th)).not.toMatch(/[A-Za-z]{4}/);
    const own = buildMetadata({ ...options, locale: "th", title: "ข่าว", path: "/news/x" });
    expect(images(own.openGraph?.images)[0]?.alt).toBe("ข่าว");
    expect(images(own.twitter?.images)[0]?.alt).toBe("ข่าว");
  });

  it("matches the segments that have their own image files", () => {
    const root = path.join(process.cwd(), "app", "[lang]");
    const opengraph: string[] = [];
    const twitter: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const segment = `/${path.relative(root, dir).split(path.sep).join("/")}`;
        if (entry.isDirectory()) walk(path.join(dir, entry.name));
        else if (entry.name === "opengraph-image.tsx") opengraph.push(segment);
        else if (entry.name === "twitter-image.tsx") twitter.push(segment);
      }
    };
    walk(root);
    expect(opengraph.sort()).toEqual(twitter.sort());
    for (const segment of opengraph.filter((s) => s !== "/")) {
      expect(hasOwnShareImage(segment.replace(/\[[^\]]+\]/g, "sample")), segment).toBe(true);
    }
  });
});
