import { describe, expect, it } from "vitest";

describe("scratch", () => {
  it("imports next-sanity draft-mode fine with no mock", async () => {
    const mod = await import("next-sanity/draft-mode");
    expect(typeof mod.defineEnableDraftMode).toBe("function");
  });
});
