// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import AdmissionRoundsTable from "@/components/information/AdmissionRoundsTable";
import AdmissionDates from "@/components/information/AdmissionDates";
import EnglishTestScores from "@/components/information/EnglishTestScores";
import { admissionRounds } from "@/content/information/admissions";

afterEach(() => {
  cleanup();
});

describe("AdmissionRoundsTable", () => {
  it("renders a three column table and a summary card per round", () => {
    render(<AdmissionRoundsTable locale="en" />);
    const table = screen.getByRole("table", { name: "Compare the BIR admission rounds" });
    expect(within(table).getAllByRole("columnheader")).toHaveLength(3);
    expect(within(table).getAllByRole("rowheader")).toHaveLength(admissionRounds.length);
    expect(screen.getByRole("region", { name: /^Table, / })).toBeTruthy();
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(admissionRounds.length);
    const link = within(headings[2]!).getByRole("link", { name: "TCAS 3" });
    expect(link.getAttribute("href")).toBe("/en/services/applying-to-bir/tcas-3-written-exam");
    const card = screen.getByRole("region", { name: "TCAS 3" });
    const keys = Array.from(card.querySelectorAll("dt")).map((dt) => dt.textContent);
    expect(keys).toEqual([
      "Who can apply",
      "Apply between",
      "Seats",
      "Minimum grades",
      "Tests needed",
      "How you are chosen",
      "Fee",
    ]);
  });

  it("localises Thai links and dates", () => {
    render(<AdmissionRoundsTable locale="th" />);
    const link = screen.getByRole("link", { name: "Inter-Portfolio 1" });
    expect(link.getAttribute("href")).toBe("/th/services/applying-to-bir/inter-portfolio-1");
    expect(screen.getAllByText("6 ตุลาคม ถึง 6 พฤศจิกายน 2569").length).toBeGreaterThan(0);
  });
});

describe("AdmissionDates", () => {
  it("renders one round as two columns with a caption and no round label", () => {
    render(<AdmissionDates locale="en" round="inter-portfolio-1" />);
    const table = screen.getByRole("table", { name: "Key dates for Inter-Portfolio 1" });
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((h) => h.textContent)
    ).toEqual(["Date", "What happens"]);
    expect(within(table).queryByText("Inter-Portfolio 1")).toBeNull();
    expect(within(table).getByText("6 October to 6 November 2026")).toBeTruthy();
    expect(within(table).getByText("7 November 2026")).toBeTruthy();
  });

  it("shows undated steps as to be announced", () => {
    render(<AdmissionDates locale="en" round="tcas-3" />);
    expect(screen.getAllByText("To be announced")).toHaveLength(2);
    expect(screen.getByText("21 March 2027")).toBeTruthy();
  });

  it("throws on an unknown round", () => {
    expect(() => render(<AdmissionDates locale="en" round="nope" />)).toThrow(/unknown round/);
  });

  it("groups every round by month in date order with h3 headings", () => {
    render(<AdmissionDates locale="en" />);
    const headings = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(headings[0]).toBe("October 2026");
    expect(headings.at(-1)).toBe("To be announced");
    const dated = headings.slice(0, -1);
    expect(dated).toContain("May 2027");
    expect(dated.indexOf("November 2026")).toBeLessThan(dated.indexOf("March 2027"));
    const march = screen.getByRole("table", { name: "Dates in March 2027" });
    expect(within(march).getAllByRole("columnheader")).toHaveLength(2);
    expect(within(march).getAllByText("Inter-Portfolio 2").length).toBeGreaterThan(0);
  });

  it("uses Buddhist Era month headings in Thai", () => {
    render(<AdmissionDates locale="th" />);
    expect(screen.getAllByRole("heading", { level: 3 })[0]?.textContent).toBe("ตุลาคม 2569");
  });
});

describe("EnglishTestScores", () => {
  it("renders the minimums and links the rounds", () => {
    render(<EnglishTestScores locale="en" />);
    const table = screen.getByRole("table");
    expect(within(table).getByText("6.0 overall")).toBeTruthy();
    expect(within(table).getByText("At least 50 percent")).toBeTruthy();
    expect(within(table).getAllByRole("rowheader")).toHaveLength(4);
    const links = within(table).getAllByRole("link", { name: "Inter-Portfolio 1" });
    expect(links[0]?.getAttribute("href")).toBe("/en/services/applying-to-bir/inter-portfolio-1");
  });
});
