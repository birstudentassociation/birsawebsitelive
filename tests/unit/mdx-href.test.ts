import { describe, expect, it } from "vitest";
import { localiseMdxHref } from "@/lib/mdx-href";

describe("localiseMdxHref", () => {
  it("prefixes root-relative hrefs with the page locale", () => {
    expect(localiseMdxHref("/activity/roles", "en")).toBe("/en/activity/roles");
    expect(localiseMdxHref("/news", "th")).toBe("/th/news");
    expect(localiseMdxHref("/student-life/rules-and-rights?x=1#top", "en")).toBe(
      "/en/student-life/rules-and-rights?x=1#top"
    );
    expect(localiseMdxHref("/", "th")).toBe("/th");
    expect(localiseMdxHref("/emergency/flood", "en")).toBe("/en/emergency/flood");
    expect(localiseMdxHref("/calendar.ics", "en")).toBe("/en/calendar.ics");
  });

  it("leaves hrefs that already carry a locale unchanged", () => {
    expect(localiseMdxHref("/en/news", "th")).toBe("/en/news");
    expect(localiseMdxHref("/th/news", "en")).toBe("/th/news");
    expect(localiseMdxHref("/en", "th")).toBe("/en");
    expect(localiseMdxHref("/th#top", "en")).toBe("/th#top");
  });

  it("leaves external, mailto, tel, anchor and relative hrefs unchanged", () => {
    for (const href of [
      "https://example.com/a",
      "//example.com/a",
      "mailto:a@example.com",
      "tel:+66123456",
      "#section",
      "news",
      "",
    ]) {
      expect(localiseMdxHref(href, "en")).toBe(href);
    }
  });

  it("leaves static files and non-locale routes unchanged", () => {
    for (const href of [
      "/birsa-logo.png",
      "/robots.txt",
      "/6-october/og-field.jpg",
      "/committee/kritpol-komkai.webp",
      "/emergency/garuda.svg",
      "/images/poster.pdf",
      "/api/health",
    ]) {
      expect(localiseMdxHref(href, "en")).toBe(href);
    }
  });
});
