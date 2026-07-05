import { describe, expect, it } from "vitest";
import { formatDate, isLocale, localeHref, swapLocalePath } from "@/lib/i18n";

describe("localeHref", () => {
  it("prefixes the root path with just the locale", () => {
    expect(localeHref("en", "/")).toBe("/en");
    expect(localeHref("th", "/")).toBe("/th");
  });

  it("prefixes a nested path with the locale", () => {
    expect(localeHref("en", "/news")).toBe("/en/news");
    expect(localeHref("th", "/clubs/debate-society")).toBe("/th/clubs/debate-society");
  });

  it("normalizes a path missing a leading slash", () => {
    expect(localeHref("en", "news")).toBe("/en/news");
  });
});

describe("swapLocalePath", () => {
  it("swaps the locale segment for a nested path", () => {
    expect(swapLocalePath("/en/news", "th")).toBe("/th/news");
    expect(swapLocalePath("/th/clubs/debate-society", "en")).toBe("/en/clubs/debate-society");
  });

  it("swaps the locale segment for the root path", () => {
    expect(swapLocalePath("/en", "th")).toBe("/th");
    expect(swapLocalePath("/th", "en")).toBe("/en");
  });
});

describe("isLocale", () => {
  it("accepts known locales", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("th")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("")).toBe(false);
    expect(isLocale("EN")).toBe(false);
  });
});

describe("formatDate", () => {
  it("formats using the Gregorian calendar for both locales, never Buddhist Era", () => {
    const en = formatDate("en", "2026-01-15");
    const th = formatDate("th", "2026-01-15");

    expect(en).toContain("2026");
    expect(th).toContain("2026");
    expect(en).not.toContain("2569");
    expect(th).not.toContain("2569");
  });
});
