import { describe, expect, it, vi } from "vitest";

const disable = vi.fn();
vi.mock("next/headers", () => ({
  draftMode: async () => ({ disable }),
}));
vi.mock("next/navigation", () => ({
  redirect: (to: string) => { throw new Error(`redirect:${to}`); },
}));

describe("scratch", () => {
  it("disable route works when only our own route imports next/headers directly", async () => {
    const { GET } = await import("@/app/api/draft-mode/disable/route");
    await expect(GET()).rejects.toThrow("redirect:/");
    expect(disable).toHaveBeenCalledTimes(1);
  });
});
