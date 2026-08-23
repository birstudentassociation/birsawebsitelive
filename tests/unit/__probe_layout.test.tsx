// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Fraunces: () => ({ variable: "--font-en-display" }),
  Lexend: () => ({ variable: "--font-en-body" }),
  Sarabun: () => ({ variable: "--font-th" }),
}));
vi.mock("next/font/local", () => ({
  default: () => ({ variable: "--font-jenjrus" }),
}));
vi.mock("@vercel/analytics/next", () => ({
  Analytics: () => null,
}));
vi.mock("@vercel/edge-config", () => ({
  get: async () => undefined,
}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  notFound: () => {
    throw new Error("notFound");
  },
}));
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

import RootLayout from "@/app/[lang]/layout";
import { render, screen } from "@testing-library/react";

describe("probe", () => {
  it("can call RootLayout", async () => {
    const el = await RootLayout({
      children: <div>hi</div> as any,
      params: Promise.resolve({ lang: "en" }),
    } as any);
    expect(el).toBeTruthy();
    console.log(JSON.stringify(el.type));
  });
});

describe("probe2", () => {
  it("inspect tree", async () => {
    const RootLayoutMod = (await import("@/app/[lang]/layout")).default;
    const el: any = await RootLayoutMod({
      children: <div>hi</div> as any,
      params: Promise.resolve({ lang: "en" }),
    } as any);
    console.log("root type", el.type);
    const body = el.props.children;
    console.log("body type", body.type);
    const kids = body.props.children;
    console.log("num kids", kids.length);
    kids.forEach((k: any, i: number) => {
      console.log(i, k?.type?.name ?? k?.type, k === null);
    });
  });
});

import { writeFileSync } from "node:fs";
describe("probe3", () => {
  it("inspect tree to file", async () => {
    const RootLayoutMod = (await import("@/app/[lang]/layout")).default;
    const el: any = await RootLayoutMod({
      children: <div>hi</div> as any,
      params: Promise.resolve({ lang: "en" }),
    } as any);
    const body = el.props.children;
    const kids = body.props.children;
    const desc = kids.map((k: any) => (k === null ? null : (k?.type?.name ?? k?.type ?? typeof k)));
    writeFileSync("/tmp/claude-0/-home-user-birsawebsitelive/38e982fa-457d-5cc1-b249-e94b560d3ca1/scratchpad/kids.json", JSON.stringify(desc, null, 2));
  });
});
