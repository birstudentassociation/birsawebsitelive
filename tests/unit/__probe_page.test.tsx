// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

afterEach(cleanup);

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  notFound: () => {
    throw new Error("notFound");
  },
}));

import HomePage from "@/app/[lang]/page";
import DoIndexPage from "@/app/[lang]/do/page";

describe("probe home", () => {
  it("renders home page", async () => {
    const el = await HomePage({ params: Promise.resolve({ lang: "en" }) } as any);
    render(el as any);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    console.log("h1 count", h1s.length, h1s.map(h => h.textContent));
    const allHeadings = screen.getAllByRole("heading");
    console.log(allHeadings.map(h => [h.tagName, h.textContent]));
  });
});

describe("probe do", () => {
  it("renders do page", async () => {
    const el = await DoIndexPage({ params: Promise.resolve({ lang: "en" }) } as any);
    render(el as any);
    console.log(screen.getAllByRole("link").map(l => l.textContent));
  });
});
