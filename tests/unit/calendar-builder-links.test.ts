import { describe, expect, it } from "vitest";
import { buildFeedLinks, downloadUrl, toWebcal } from "@/lib/calendar-builder/links";

const url = "https://birsa.example/en/my-calendar.ics?inc=birsa&term=2569-2";

describe("calendar links", () => {
  it("builds webcal", () => {
    expect(toWebcal(url)).toBe("webcal://birsa.example/en/my-calendar.ics?inc=birsa&term=2569-2");
  });
  it("adds download=1", () => {
    expect(downloadUrl(url)).toBe(`${url}&download=1`);
  });
  it("builds every app link with encoding", () => {
    const links = buildFeedLinks(url, "My BIR calendar");
    expect(links.google).toBe(
      `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(links.webcal)}`
    );
    expect(links.outlookLive).toBe(
      `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(url)}&name=My%20BIR%20calendar`
    );
    expect(
      links.outlookOffice.startsWith("https://outlook.office.com/calendar/0/addfromweb?")
    ).toBe(true);
    expect(links.download).toContain("download=1");
  });
});
