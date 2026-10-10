// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FindingsList from "@/components/study-plan/FindingsList";
import type { Finding } from "@/lib/study-plan/findings";

const findings: Finding[] = [
  {
    id: "prerequisite:PI300",
    severity: "problem",
    message: { en: "PI300 needs PI211 passed first.", th: "วิชา PI300 ต้องผ่านวิชา PI211 ก่อน" },
    source: { document: "2564-rev2566", provision: "Curriculum 2021, 2023 revision" },
  },
  {
    id: "shortfall",
    severity: "warning",
    message: { en: "You are 12 credits short.", th: "ยังขาดอีก 12 หน่วยกิต" },
    source: { document: "2564-rev2566", provision: "Curriculum 2021, 2023 revision" },
  },
];

describe("FindingsList", () => {
  /** The paragraph holding a finding's message, whatever it is split into. */
  function messageOf(container: HTMLElement, text: string): HTMLElement | undefined {
    return [...container.querySelectorAll<HTMLElement>("p")].find((p) =>
      p.textContent?.includes(text)
    );
  }

  it("shows every finding with its citation", () => {
    const { container } = render(
      <FindingsList findings={findings} locale="en" emptyMessage="Nothing to flag." />
    );
    expect(messageOf(container, "PI300 needs PI211 passed first.")).toBeDefined();
    expect(screen.getByText(/12 credits short/)).toBeDefined();
    expect(screen.getAllByText(/Curriculum 2021, 2023 revision/).length).toBe(2);
  });

  it("renders the Thai message in the Thai locale", () => {
    const { container } = render(
      <FindingsList findings={findings} locale="th" emptyMessage="ไม่มีข้อควรระวัง" />
    );
    expect(messageOf(container, "วิชา PI300 ต้องผ่านวิชา PI211 ก่อน")).toBeDefined();
  });

  it("links each course code in a message to its course page, in the page's language", () => {
    const { container } = render(
      <FindingsList findings={[findings[0]!]} locale="en" emptyMessage="none" />
    );
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual([
      "/en/student-life/course-reviews/PI300",
      "/en/student-life/course-reviews/PI211",
    ]);

    const thai = render(<FindingsList findings={[findings[0]!]} locale="th" emptyMessage="none" />);
    const thaiHrefs = [...thai.container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(thaiHrefs).toEqual([
      "/th/student-life/course-reviews/PI300",
      "/th/student-life/course-reviews/PI211",
    ]);
  });

  it("leaves a code with no course page as plain text, and a message with no code untouched", () => {
    const stray: Finding = {
      id: "x",
      severity: "note",
      message: { en: "ZZ999 is unknown and 12 is not a code.", th: "ไม่ทราบวิชา ZZ999" },
      source: { document: "d", provision: "p" },
    };
    const { container } = render(<FindingsList findings={[stray]} locale="en" emptyMessage="n" />);
    expect(container.querySelectorAll("a").length).toBe(0);
    expect(messageOf(container, "ZZ999 is unknown and 12 is not a code.")).toBeDefined();
  });

  it("puts problems before warnings", () => {
    const { container } = render(
      <FindingsList findings={[findings[1]!, findings[0]!]} locale="en" emptyMessage="none" />
    );
    const text = container.textContent ?? "";
    expect(text.indexOf("PI300")).toBeLessThan(text.indexOf("12 credits"));
  });

  it("shows the empty message when there is nothing to flag", () => {
    render(<FindingsList findings={[]} locale="en" emptyMessage="Nothing to flag." />);
    expect(screen.getByText("Nothing to flag.")).toBeDefined();
  });
});
