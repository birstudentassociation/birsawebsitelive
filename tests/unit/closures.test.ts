import { beforeEach, describe, expect, it, vi } from "vitest";

const edgeConfig = vi.hoisted(() => ({ value: undefined as unknown }));

vi.mock("@vercel/edge-config", () => ({ get: async () => edgeConfig.value }));
vi.mock("next/cache", () => ({ unstable_cache: (fn: () => unknown) => fn }));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`redirect:${url}`);
  },
}));

const { getClosure, isServiceId, redirectIfClosed } = await import("@/lib/closures");

describe("service closures", () => {
  beforeEach(() => {
    edgeConfig.value = undefined;
  });

  it("treats every service as open when Edge Config has nothing", async () => {
    expect(await getClosure("contact")).toEqual({ closed: false });
  });

  it("reads a closure and its reopening date", async () => {
    edgeConfig.value = { "equipment-loan": { closed: true, reopens: "2026-10-12" } };
    expect(await getClosure("equipment-loan")).toEqual({ closed: true, reopens: "2026-10-12" });
    expect(await getClosure("contact")).toEqual({ closed: false });
  });

  it("stays open when the config is malformed", async () => {
    edgeConfig.value = { contact: { closed: "yes" } };
    expect(await getClosure("contact")).toEqual({ closed: false });
  });

  it("redirects a closed service to its unavailable page", async () => {
    edgeConfig.value = { "start-club": { closed: true } };
    await expect(redirectIfClosed("start-club", "th")).rejects.toThrow(
      "redirect:/th/unavailable/start-club"
    );
    await expect(redirectIfClosed("contact", "th")).resolves.toBeUndefined();
  });

  it("knows which services exist", () => {
    expect(isServiceId("your-data")).toBe(true);
    expect(isServiceId("toString")).toBe(false);
  });
});
