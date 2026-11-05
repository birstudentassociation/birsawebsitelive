// @vitest-environment jsdom
/**
 * Unit tests for the front page's "Coming up" section: which dates it lists,
 * in what order, how multi-day events are treated, the empty state and the
 * link to the calendar builder.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import ComingUp, { type ComingUpLabels } from "@/components/home/ComingUp";
import type { CalendarEvent } from "@/content/calendar/events";
import { homeEn } from "@/content/home/en";
import { homeTh } from "@/content/home/th";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  // 12:00 in Bangkok on 10 August 2026.
  vi.setSystemTime(new Date("2026-08-10T05:00:00Z"));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const labels: ComingUpLabels = homeEn.comingUp.labels;

function event(id: string, start: string, over: Partial<CalendarEvent> = {}): CalendarEvent {
  return {
    id,
    start,
    title: { en: `Title ${id}`, th: `ชื่อ ${id}` },
    slug: `slug-${id}`,
    kind: "birsa",
    ...over,
  };
}

function renderIt(events: CalendarEvent[], todayKey = "2026-08-10", locale: "en" | "th" = "en") {
  return render(
    <ComingUp
      events={events}
      locale={locale}
      todayKey={todayKey}
      labels={locale === "en" ? homeEn.comingUp.labels : homeTh.comingUp.labels}
    />
  );
}

function titles(): string[] {
  return screen
    .getAllByRole("listitem")
    .map((li) => within(li).queryByRole("link")?.textContent)
    .filter((t): t is string => Boolean(t) && t !== labels.panel.cta)
    .filter((t) => t.startsWith("Title"));
}

describe("Coming up", () => {
  it("lists upcoming dates soonest first and skips past ones", () => {
    renderIt([
      event("c", "2026-09-01"),
      event("past", "2026-07-01"),
      event("a", "2026-08-10"),
      event("b", "2026-08-20"),
    ]);
    expect(titles()).toEqual(["Title a", "Title b", "Title c"]);
  });

  it("shows at most five dates", () => {
    renderIt(Array.from({ length: 8 }, (_, i) => event(`e${i}`, `2026-09-0${i + 1}`)));
    expect(titles()).toHaveLength(5);
    expect(titles()[0]).toBe("Title e0");
  });

  it("counts a multi-day event that has started but not ended, and shows its range", () => {
    renderIt([
      event("later", "2026-08-15"),
      event("running", "2026-08-05", { end: "2026-08-12" }),
      event("over", "2026-08-01", { end: "2026-08-09" }),
    ]);
    expect(titles()).toEqual(["Title running", "Title later"]);
    expect(screen.getByText("5 August 2026 to 12 August 2026")).toBeInTheDocument();
    expect(screen.getByText(labels.ongoing)).toBeInTheDocument();
  });

  it("keeps an event that ends today", () => {
    renderIt([event("last", "2026-08-08", { end: "2026-08-10" })]);
    expect(titles()).toEqual(["Title last"]);
  });

  it("uses the live Bangkok date rather than the build-time one", () => {
    // Built on 1 July, viewed on 10 August: the July event must not show.
    renderIt([event("stale", "2026-07-05"), event("fresh", "2026-08-12")], "2026-07-01");
    expect(titles()).toEqual(["Title fresh"]);
  });

  it("links each title to its news post and names its category in text", () => {
    renderIt([event("a", "2026-08-12", { kind: "university" })], "2026-08-10", "th");
    expect(screen.getByRole("link", { name: "ชื่อ a" })).toHaveAttribute("href", "/th/news/slug-a");
    expect(screen.getByText(homeTh.comingUp.labels.kinds.university)).toBeInTheDocument();
  });

  it("says so when nothing is upcoming, and keeps the panel", () => {
    renderIt([event("past", "2026-07-01")]);
    expect(screen.getByText(labels.empty)).toBeInTheDocument();
    expect(screen.getByText(labels.panel.heading)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: labels.panel.cta })).toBeInTheDocument();
  });

  it("links the panel button to the calendar builder in each locale", () => {
    renderIt([event("a", "2026-08-12")]);
    expect(screen.getByRole("link", { name: labels.panel.cta })).toHaveAttribute(
      "href",
      "/en/services/calendar"
    );
    cleanup();
    renderIt([event("a", "2026-08-12")], "2026-08-10", "th");
    expect(screen.getByRole("link", { name: homeTh.comingUp.labels.panel.cta })).toHaveAttribute(
      "href",
      "/th/services/calendar"
    );
  });

  it("shows the three ticked points", () => {
    renderIt([]);
    for (const point of labels.panel.points) expect(screen.getByText(point)).toBeInTheDocument();
  });
});
