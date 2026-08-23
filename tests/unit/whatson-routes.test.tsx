// @vitest-environment jsdom
/**
 * Unit tests for Wave 5 (`/whats-on`): the news listing and article, the
 * clubs directory, and the calendar. Follows
 * `tests/unit/home-and-do-index.test.tsx`'s pattern for rendering an async
 * server component page directly: `await Page({ params, searchParams })`,
 * then `render(el)`.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// `lib/mdx.tsx`'s `Mdx` (used by the article and club detail pages) wraps
// `next-mdx-remote/rsc`'s `MDXRemote`, an async React Server Component that
// React Testing Library's synchronous `render()` cannot resolve in jsdom
// (no test anywhere in this repo renders an MDX-bearing page for exactly
// that reason). Stubbed here, purely for this test file, the same way
// `tests/unit/home-and-do-index.test.tsx` stubs `next/font/google` so the
// module graph can render at all; nothing about MDX rendering is under test
// here, only the page chrome around it (the heading, the pagination, the
// signposts).
vi.mock("next-mdx-remote/rsc", () => ({
  MDXRemote: () => null,
}));

import WhatsOnNewsPage from "@/app/[lang]/whats-on/news/page";
import WhatsOnNewsArticlePage from "@/app/[lang]/whats-on/news/[slug]/page";
import WhatsOnClubsPage from "@/app/[lang]/whats-on/clubs/page";
import WhatsOnCalendarPage from "@/app/[lang]/whats-on/calendar/page";
import { whatson as whatsonEn } from "@/content/dictionaries/en/whatson";
import { getEntries, getClubEntries } from "@/lib/content";
import { calendarEvents } from "@/content/calendar/events";
import { altTextProblems, type ImageField } from "@/components/bds/imageContract";

afterEach(cleanup);

/** Any Tailwind font-size or line-height utility (BUILD-BRIEF-2.0 SS7, defect D7). */
const TAILWIND_TYPE_UTILITY = /\b(text-(xs|sm|base|lg|xl|\d?xl)|leading-)/;

/**
 * Every element under `container` carries no forbidden Tailwind type
 * utility, skipping any subtree under `[data-frozen-calendar]`:
 * `components/home/EventCalendar.tsx` is reused unchanged from another
 * wave's frozen scope and already carries raw `text-xs`/`text-sm`/
 * `leading-snug` utilities of its own; this wave neither owns nor edits it,
 * so the assertion covers only what this wave built.
 */
function assertNoRawTypeUtilities(container: HTMLElement) {
  for (const node of container.querySelectorAll<HTMLElement>("*")) {
    if (node.closest("[data-frozen-calendar]")) continue;
    const classAttr = node.getAttribute("class") ?? "";
    expect(classAttr).not.toMatch(TAILWIND_TYPE_UTILITY);
  }
}

describe("/whats-on/news: the listing", () => {
  it("paginates when there are more entries than one page holds", async () => {
    const totalEntries = getEntries("news", "en").length;
    expect(totalEntries).toBeGreaterThan(9); // PAGE_SIZE in the page itself

    const el = await WhatsOnNewsPage({
      params: Promise.resolve({ lang: "en" }),
      searchParams: Promise.resolve({}),
    });
    render(el);

    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
  });

  it("gives every pagination link an accessible name that states its own destination, not a bare number", async () => {
    const el = await WhatsOnNewsPage({
      params: Promise.resolve({ lang: "en" }),
      searchParams: Promise.resolve({}),
    });
    render(el);

    const pageTwo = screen.getByRole("link", { name: "Page 2" });
    expect(pageTwo).toHaveAttribute("href", "/en/whats-on/news?page=2");

    const next = screen.getByRole("link", { name: "Next, page 2" });
    expect(next).toHaveAttribute("href", "/en/whats-on/news?page=2");
  });

  it("names each card link by its own headline, so a screen reader's link list is never a wall of identical text", async () => {
    const el = await WhatsOnNewsPage({
      params: Promise.resolve({ lang: "en" }),
      searchParams: Promise.resolve({}),
    });
    render(el);

    const firstEntry = getEntries("news", "en")[0];
    expect(firstEntry).toBeDefined();
    const link = screen.getByRole("link", { name: firstEntry!.frontmatter.title });
    expect(link).toHaveAttribute("href", `/en/whats-on/news/${firstEntry!.slug}`);
  });

  it("emits no raw Tailwind font-size or line-height utility", async () => {
    const el = await WhatsOnNewsPage({
      params: Promise.resolve({ lang: "en" }),
      searchParams: Promise.resolve({}),
    });
    const { container } = render(el);
    assertNoRawTypeUtilities(container);
  });
});

describe("/whats-on/news/[slug]: the article page", () => {
  it("renders exactly one h1, carrying the article's own title", async () => {
    const entry = getEntries("news", "en").find((e) => e.slug === "bir18-pre-session");
    expect(entry).toBeDefined();

    const el = await WhatsOnNewsArticlePage({
      params: Promise.resolve({ lang: "en", slug: "bir18-pre-session" }),
    });
    render(el);

    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(entry!.frontmatter.title);
  });

  it("keeps a logical heading order: no level is skipped", async () => {
    const el = await WhatsOnNewsArticlePage({
      params: Promise.resolve({ lang: "en", slug: "bir18-pre-session" }),
    });
    const { container } = render(el);
    const levels = [...container.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((node) =>
      Number(node.tagName.slice(1))
    );
    let deepestSeen = 0;
    for (const level of levels) {
      expect(level).toBeLessThanOrEqual(deepestSeen + 1);
      deepestSeen = Math.max(deepestSeen, level);
    }
  });
});

describe("/whats-on/clubs: the directory", () => {
  it("renders the BIR club directory", async () => {
    const el = await WhatsOnClubsPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);

    const clubs = getClubEntries("en");
    expect(clubs.length).toBeGreaterThan(0);
    for (const club of clubs) {
      expect(screen.getByRole("link", { name: club.frontmatter.title })).toHaveAttribute(
        "href",
        `/en/whats-on/clubs/${club.slug}`
      );
    }
  });

  it("signposts TUSU Tha Prachan and TUSC by name, with their own contact link", async () => {
    const el = await WhatsOnClubsPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);

    expect(screen.getByText(whatsonEn.whatson.clubs.tusuTitle)).toBeInTheDocument();
    expect(screen.getByText(whatsonEn.whatson.clubs.tuscTitle)).toBeInTheDocument();
    // ExternalLink appends a visually hidden "(opens in a new tab)" to the
    // accessible name (BUILD-BRIEF-2.0 SS7), so match by prefix rather than
    // an exact string.
    expect(
      screen.getByRole("link", { name: new RegExp(`^${whatsonEn.whatson.clubs.tusuCta}`) })
    ).toHaveAttribute("href", expect.stringContaining("tusu"));
    expect(
      screen.getByRole("link", { name: new RegExp(`^${whatsonEn.whatson.clubs.tuscCta}`) })
    ).toHaveAttribute("href", expect.stringContaining("tusc"));
  });

  it("does not restate TUSU's or TUSC's own club tables, only signposts them", async () => {
    const el = await WhatsOnClubsPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);

    // These are TPC-level clubs and independent groups from
    // `content/student-life/en/home/getting-involved.mdx`'s own tables,
    // which are TUSU's information, not BIRSA's: they must not appear here.
    expect(container.textContent).not.toContain("TPC Allstar");
    expect(container.textContent).not.toContain("English Debate club");
    expect(container.textContent).not.toContain("TU Documentary");
  });

  it("emits no raw Tailwind font-size or line-height utility", async () => {
    const el = await WhatsOnClubsPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertNoRawTypeUtilities(container);
  });
});

describe("/whats-on/calendar: keyboard operation and the no-JavaScript fallback", () => {
  it("exposes every day cell as a real, focusable, keyboard-operable button", async () => {
    const el = await WhatsOnCalendarPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);

    // Month navigation and day cells are real <button> elements, not a div
    // with an onClick: native button semantics are what makes them
    // reachable by Tab and operable with Enter/Space with no extra wiring.
    expect(
      screen.getByRole("button", { name: whatsonEn.whatson.calendar.prevMonth })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: whatsonEn.whatson.calendar.nextMonth })
    ).toBeInTheDocument();
    const dayButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.hasAttribute("aria-pressed"));
    expect(dayButtons.length).toBeGreaterThan(0);
  });

  it("keeps every dated item reachable as a plain link in a real table, with no script required", async () => {
    const el = await WhatsOnCalendarPage({ params: Promise.resolve({ lang: "en" }) });
    render(el);

    const sample = calendarEvents[0];
    expect(sample).toBeDefined();

    const table = screen.getByRole("region", { name: whatsonEn.whatson.calendar.upcoming.heading });
    const link = within(table).getByRole("link", { name: sample!.title.en });
    expect(link).toHaveAttribute("href", `/en/whats-on/news/${sample!.slug}`);

    // One real row per calendar event: this table's content is the whole
    // list, not a subset revealed by interaction.
    const rows = within(table).getAllByRole("row");
    // +1 for the header row.
    expect(rows.length).toBe(calendarEvents.length + 1);
  });

  it("emits no raw Tailwind font-size or line-height utility outside the frozen EventCalendar it reuses", async () => {
    const el = await WhatsOnCalendarPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertNoRawTypeUtilities(container);
  });
});

describe("image fields this wave might carry: the frozen contract still applies", () => {
  // 1.0 is text only, and no BIR club or news entry carries a photograph
  // yet (no CMS asset pipeline exists in this checkout, `components/bds/
  // Figure.tsx`'s own header), so nothing under `/whats-on` renders an
  // `ImageField` today. These fixtures exercise `imageContract.ts` itself
  // against the shape a future club or event photo would take, so the rule
  // is proven rather than assumed: bilingual alt text is required unless
  // the image is actively marked decorative.
  const baseImage: Omit<ImageField, "decorative" | "alt"> = {
    assetId: "test-fixture-asset",
    ratio: "4:3",
  };

  it("passes a decorative image with no alt text", () => {
    const image: ImageField = { ...baseImage, decorative: true, alt: null };
    expect(altTextProblems(image)).toEqual([]);
  });

  it("rejects a decorative image that still carries alt text", () => {
    const image: ImageField = {
      ...baseImage,
      decorative: true,
      alt: { en: "A fixture, not real content", th: "ข้อมูลทดสอบ ไม่ใช่เนื้อหาจริง" },
    };
    expect(altTextProblems(image)).toContain("alt-on-decorative");
  });

  it("requires both locales on a non-decorative image: English alone is not enough", () => {
    const image: ImageField = {
      ...baseImage,
      decorative: false,
      alt: { en: "A fixture club activity, not real content", th: "" },
    };
    expect(altTextProblems(image).length).toBeGreaterThan(0);
  });

  it("requires both locales on a non-decorative image: Thai alone is not enough", () => {
    const image: ImageField = {
      ...baseImage,
      decorative: false,
      alt: { en: "", th: "ข้อมูลทดสอบ ไม่ใช่เนื้อหาจริง" },
    };
    expect(altTextProblems(image).length).toBeGreaterThan(0);
  });

  it("accepts a non-decorative image with real, distinct alt text in both locales", () => {
    const image: ImageField = {
      ...baseImage,
      decorative: false,
      alt: {
        en: "Fixture club members at a test activity",
        th: "สมาชิกชมรมทดสอบระหว่างกิจกรรมทดสอบ",
      },
    };
    expect(altTextProblems(image)).toEqual([]);
  });
});
