import { describe, expect, it } from "vitest";
import { announcement, announcementExpiry, isAnnouncementLive } from "@/content/announcement";

describe("site announcement", () => {
  it("has a parseable expiry", () => {
    const expiry = announcementExpiry();
    expect(expiry).not.toBeNull();
    expect(Number.isNaN(expiry as number)).toBe(false);
  });

  it("shows before its expiry and hides after, while active", () => {
    const expiry = announcementExpiry();
    if (expiry === null) throw new Error("expected an expiry");

    // Only meaningful to assert the on/off transition when the notice is active.
    if (announcement.active) {
      expect(isAnnouncementLive(expiry - 1_000)).toBe(true);
      expect(isAnnouncementLive(expiry)).toBe(false);
      expect(isAnnouncementLive(expiry + 1_000)).toBe(false);
    } else {
      expect(isAnnouncementLive(expiry - 1_000)).toBe(false);
    }
  });

  it("both locales carry a message and a call to action", () => {
    for (const locale of ["en", "th"] as const) {
      expect(announcement.message[locale].length).toBeGreaterThan(0);
      expect(announcement.cta[locale].length).toBeGreaterThan(0);
    }
  });
});
