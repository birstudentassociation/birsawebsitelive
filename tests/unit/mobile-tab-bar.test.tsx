// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import MobileTabBar from "@/components/MobileTabBar";
import { en } from "@/content/dictionaries/en";
import { th } from "@/content/dictionaries/th";

let mockPathname = "/en";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

afterEach(cleanup);

function setup(locale: "en" | "th", pathname: string) {
  mockPathname = pathname;
  const { container } = render(
    <MobileTabBar locale={locale} labels={locale === "en" ? en.tabBar : th.tabBar} />
  );
  return Array.from(container.querySelectorAll("a"));
}

describe("MobileTabBar", () => {
  it("marks Today current on the locale home and links with the locale prefix", () => {
    const links = setup("en", "/en");
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "/en",
      "/en/dates",
      "/en/services",
      "/en/contact",
    ]);
    expect(links.map((a) => a.getAttribute("aria-current"))).toEqual(["page", null, null, null]);
  });

  it("marks Services current on a nested services page", () => {
    const links = setup("en", "/en/services/equipment-loan");
    expect(links.length).toBe(4);
    expect(links.map((a) => a.getAttribute("aria-current"))).toEqual([null, null, "page", null]);
  });

  it("uses Thai labels and marks Dates current", () => {
    const links = setup("th", "/th/dates");
    expect(links.map((a) => a.textContent)).toEqual(["วันนี้", "วันสำคัญ", "บริการ", "ช่วยเหลือ"]);
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "/th",
      "/th/dates",
      "/th/services",
      "/th/contact",
    ]);
    expect(links.map((a) => a.getAttribute("aria-current"))).toEqual([null, "page", null, null]);
  });
});
