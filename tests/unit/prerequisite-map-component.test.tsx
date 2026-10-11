// @vitest-environment jsdom
/**
 * The prerequisite map as the catalogue page renders it. The drawing is a
 * picture of information the page also holds as lists, so these tests check the
 * lists are complete (they are the no-JavaScript and screen reader version),
 * that every course links to its page, that the drawing stays out of the tab
 * order and inside its own scrolling frame, and that a stored plan swaps the
 * track colours for statuses without the server's markup depending on storage.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, within } from "@testing-library/react";
import PlanAwareMapBody from "@/components/course-review/PlanAwareMapBody";
import PrerequisiteMap from "@/components/course-review/PrerequisiteMap";
import { buildTermInsightCopy } from "@/components/study-plan/termInsightCopy";
import { CURRENT_VERSION, unlocks } from "@/lib/courses/graph";
import { buildPrerequisiteMap } from "@/lib/courses/prerequisiteMap";
import type { StudyPlan } from "@/lib/study-plan/plan";

const KEY = "birsa-study-plan";
const BASE = "/en/student-life/course-reviews";
const layout = buildPrerequisiteMap(CURRENT_VERSION);

const tracks = {
  foundational: "Foundational",
  "international-relations": "International relations",
  "governance-transnational": "Governance",
  "public-admin-policy": "Public administration",
  "global-political-economy": "Global political economy",
};

const map = (locale: "en" | "th" = "en") =>
  render(
    <PrerequisiteMap
      copy={buildTermInsightCopy(locale).map}
      trackLabels={tracks}
      courseLinkBase={BASE}
    />
  );

beforeEach(() => window.localStorage.clear());
afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("PrerequisiteMap", () => {
  it("is collapsed behind a disclosure, because the drawing is wide", () => {
    const { container } = map();
    const details = container.querySelector("details")!;
    expect(details.hasAttribute("open")).toBe(false);
    expect(details.querySelector("summary")?.textContent).toContain("Prerequisite map");
  });

  it("draws one node per course and one edge per relationship, coloured by track with no plan", () => {
    const { container } = map();
    const svg = container.querySelector("svg")!;
    expect(svg.querySelectorAll("rect")).toHaveLength(layout.nodes.length);
    expect(svg.querySelectorAll("path[marker-end]")).toHaveLength(layout.edges.length);
    expect(svg.innerHTML).toContain("fill-forest-tint");
    expect(container.textContent).toContain("Colours show the track");
    expect(container.textContent).toContain("International relations");
  });

  it("gives the same information as nested lists, with every course linked to its page", () => {
    const { container } = map();
    const lists = within(container.querySelector("section")!);
    const pi271 = lists.getByText("PI271").closest("li")!;
    expect(pi271.textContent).toContain("unlocks these courses");
    const unlocked = within(pi271)
      .getAllByRole("link")
      .map((a) => a.textContent);
    expect(unlocked).toEqual(["PI271", ...unlocks("PI271", CURRENT_VERSION)]);
    for (const link of lists.getAllByRole("link")) {
      expect(link.getAttribute("href")).toBe(`${BASE}/${link.textContent}`);
    }
  });

  it("lists every relationship in the drawing", () => {
    const { container } = map();
    const items = container.querySelectorAll("section ul ul > li");
    expect(items).toHaveLength(layout.edges.length);
  });

  it("links the nodes to course pages but keeps the drawing out of the tab order", () => {
    const { container } = map();
    const links = container.querySelectorAll("svg a");
    expect(links).toHaveLength(layout.nodes.length);
    for (const link of links) {
      expect(link.getAttribute("href")).toMatch(new RegExp(`^${BASE}/PI\\d{3}$`));
      expect(link.getAttribute("tabindex")).toBe("-1");
    }
    expect(container.querySelector("svg")?.getAttribute("role")).toBe("img");
    expect(container.querySelector("svg")?.getAttribute("aria-label")).toContain("lists below");
  });

  it("scrolls inside its own labelled, focusable frame rather than widening the page", () => {
    const { container } = map();
    const frame = container.querySelector('[role="region"]')!;
    expect(frame.className).toContain("overflow-x-auto");
    expect(frame.className).toContain("max-w-full");
    expect(frame.getAttribute("tabindex")).toBe("0");
    expect(frame.getAttribute("aria-label")).toBeTruthy();
  });

  it("uses only design tokens, so it follows the light and dark themes", () => {
    const { container } = map();
    const classes = [...container.querySelectorAll("svg rect")].map((r) => r.getAttribute("class"));
    for (const className of classes) {
      expect(className).toMatch(/^(fill|stroke)-[a-z-]+ (fill|stroke)-[a-z-]+$/);
    }
    expect(container.innerHTML).not.toMatch(/#[0-9a-f]{3,6}\b|rgb\(/i);
  });

  it("is written in Thai for Thai readers", () => {
    const { container } = map("th");
    expect(container.textContent).toContain("แผนผังวิชาที่ต้องผ่านก่อน");
  });

  it("stays the track map when the stored value is not a plan", () => {
    window.localStorage.setItem(KEY, "not a plan");
    expect(map().container.textContent).toContain("Colours show the track");
  });
});

describe("PlanAwareMapBody", () => {
  // September 2024 is semester 1 of 2567: a cohort 66 student is in year 2 semester 1.
  const plan: StudyPlan = {
    versionId: "2568",
    cohort: "66",
    startYear: 2566,
    minorId: "governance",
    passed: ["PI211", "PI271"],
    freeElectiveCreditsPassed: 0,
    terms: [{ term: { year: 3, kind: "semester1" }, codes: ["PI300"], freeElectiveCredits: 0 }],
  };

  it("colours by status, says each status in words, and keeps the links", () => {
    const { container } = render(
      <PlanAwareMapBody
        layout={layout}
        copy={buildTermInsightCopy("en").map}
        courseLinkBase={BASE}
        plan={plan}
      />
    );
    expect(container.textContent).toContain("Colours show where each course stands");
    const items = [...container.querySelectorAll("li")].map((li) => li.textContent ?? "");
    expect(items).toContain("Passed PI211, PI271");
    expect(items).toContain("In your plan PI300");
    expect(items.some((item) => item.startsWith("Can be taken next term PI280"))).toBe(true);
    expect(items.some((item) => item.startsWith("Locked until"))).toBe(true);
    expect(container.querySelectorAll("svg a")).toHaveLength(layout.nodes.length);
    // The status, not only the colour, is on each node: a glyph and a border style.
    expect(container.querySelector("svg")?.textContent).toContain("✓ PI211");
    expect(container.querySelector("svg [stroke-dasharray]")).not.toBeNull();
    expect(container.textContent).toContain("never sent to BIRSA");
  });
});
