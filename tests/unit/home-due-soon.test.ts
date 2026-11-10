import { describe, expect, it } from "vitest";
import { getDueSoon } from "@/lib/home/due-soon";

const today = "2026-11-10";

describe("getDueSoon", () => {
  it("lists the next five items by start date", () => {
    const items = getDueSoon(today, "en");
    expect(items.map((i) => i.id)).toEqual([
      "s1-w-faculty",
      "nov-bir-career-exhibition",
      "nov-asa-ir-workshop-2",
      "s1-final-seats",
      "s1-last-day",
    ]);
  });

  it("includes the finals once the limit allows", () => {
    const ids = getDueSoon(today, "en", { limit: 10 }).map((i) => i.id);
    expect(ids).toContain("s1-finals");
    expect(ids.indexOf("s1-last-day")).toBeLessThan(ids.indexOf("s1-finals"));
  });

  it("marks an ongoing cut-off with the days left and a withdrawal guide", () => {
    const [withdrawal] = getDueSoon(today, "en");
    expect(withdrawal).toMatchObject({
      end: "2026-11-22",
      ongoing: true,
      daysUntil: 0,
      closesInDays: 12,
      source: "university",
      href: "/news/academic-calendar-2569",
      action: { label: "How to withdraw a course", href: "/student-life/studying/registration" },
    });
  });

  it("maps event kinds to sources and links events to their news post", () => {
    const career = getDueSoon(today, "en").find((i) => i.id === "nov-bir-career-exhibition");
    expect(career).toMatchObject({
      source: "birsa",
      href: "/news/bir-career-exhibition-2026",
      daysUntil: 1,
      ongoing: false,
      title: "BIR Career Exhibition 2026",
    });
    expect(career?.closesInDays).toBeUndefined();
    expect(career?.action).toBeUndefined();
  });

  it("returns Thai titles and action labels", () => {
    const [withdrawal] = getDueSoon(today, "th");
    expect(withdrawal?.title).toContain("ถอนรายวิชา");
    expect(withdrawal?.action?.label).toBe("วิธีถอนรายวิชา");
  });

  it("respects the limit", () => {
    expect(getDueSoon(today, "en", { limit: 2 })).toHaveLength(2);
  });

  it("respects the window", () => {
    const ids = getDueSoon(today, "en", { windowDays: 5, limit: 50 }).map((i) => i.id);
    expect(ids).toContain("nov-bir-career-exhibition");
    expect(ids).toContain("s1-w-faculty");
    expect(ids).not.toContain("s1-final-seats");
  });

  it("keeps items that are ongoing even outside the window", () => {
    const ids = getDueSoon(today, "en", { windowDays: 0, limit: 50 }).map((i) => i.id);
    expect(ids).toEqual(["s1-w-faculty"]);
  });

  it("drops items that have already ended", () => {
    const ids = getDueSoon(today, "en", { windowDays: 400, limit: 500 }).map((i) => i.id);
    expect(ids).not.toContain("nov-sotus-forum");
    expect(ids).not.toContain("s1-w-online");
  });

  it("prefers the event when an event and an academic item describe the same window", () => {
    const items = getDueSoon("2026-11-25", "en", { windowDays: 10, limit: 50 });
    const registration = items.filter((i) => i.start === "2026-11-30" && i.end === "2026-12-04");
    expect(registration.map((i) => i.id)).toEqual(["ay69-s2-registration"]);
    expect(registration[0]).toMatchObject({
      source: "birOffice",
      href: "/news/academic-calendar-2569",
      closesInDays: 9,
      action: { label: "Plan your courses before it opens", href: "/services/study-plan" },
    });
  });

  it("puts academic items before events that start on the same day", () => {
    const items = getDueSoon("2026-11-25", "en", { windowDays: 10, limit: 50 });
    const sameDay = items.filter((i) => i.start === "2026-11-30").map((i) => i.id);
    expect(sameDay[0]).toBe("s2b-pay");
  });

  it("sets a closing countdown only when the last day is 0 to 14 days away", () => {
    const today22 = getDueSoon("2026-11-22", "en", { limit: 1 })[0];
    expect(today22?.id).toBe("s1-w-faculty");
    expect(today22?.closesInDays).toBe(0);
    const far = getDueSoon("2026-10-27", "en", { limit: 1 })[0];
    expect(far?.closesInDays).toBeUndefined();
  });

  it("skips Registrar only periods", () => {
    const ids = getDueSoon("2026-12-20", "en", { windowDays: 200, limit: 200 }).map((i) => i.id);
    expect(ids.some((id) => id.startsWith("s2r-"))).toBe(false);
    expect(ids).toContain("s2b-begin");
  });
});
