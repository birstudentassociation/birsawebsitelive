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
  it("shows every finding with its citation", () => {
    render(<FindingsList findings={findings} locale="en" emptyMessage="Nothing to flag." />);
    expect(screen.getByText(/PI300 needs PI211/)).toBeDefined();
    expect(screen.getByText(/12 credits short/)).toBeDefined();
    expect(screen.getAllByText(/Curriculum 2021, 2023 revision/).length).toBe(2);
  });

  it("renders the Thai message in the Thai locale", () => {
    render(<FindingsList findings={findings} locale="th" emptyMessage="ไม่มีข้อควรระวัง" />);
    expect(screen.getByText(/ต้องผ่านวิชา PI211 ก่อน/)).toBeDefined();
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
