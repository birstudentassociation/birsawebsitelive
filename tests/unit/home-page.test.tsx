// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import Shortcuts from "@/components/home/Shortcuts";
import LatestNews from "@/components/home/LatestNews";
import GetHelp from "@/components/home/GetHelp";
import AllTopics from "@/components/home/AllTopics";
import { homeEn } from "@/content/home/en";
import { homeTh } from "@/content/home/th";

afterEach(cleanup);

const news = [
  { slug: "one", title: "First post", date: "2026-11-02" },
  { slug: "two", title: "Second post", date: "2026-10-20" },
  { slug: "three", title: "Third post", date: "2026-10-01" },
];

describe("Shortcuts", () => {
  it("lists six localised links under an h2", () => {
    render(<Shortcuts locale="en" />);
    expect(screen.getByRole("heading", { level: 2, name: "Shortcuts" })).toBeInTheDocument();
    const links = within(screen.getByRole("navigation")).getAllByRole("link");
    expect(links).toHaveLength(6);
    for (const link of links) expect(link.getAttribute("href")).toMatch(/^\/en\//);
    expect(screen.getByRole("link", { name: "Clubs" })).toHaveAttribute("href", "/en/clubs");
  });

  it("is written in Thai", () => {
    render(<Shortcuts locale="th" />);
    expect(screen.getByRole("heading", { level: 2, name: homeTh.shortcuts.heading })).toBeVisible();
    expect(screen.getByRole("link", { name: homeTh.shortcuts.items.clubs })).toHaveAttribute(
      "href",
      "/th/clubs"
    );
  });
});

describe("LatestNews", () => {
  it("lists headline links with dates", () => {
    render(<LatestNews locale="en" items={news} />);
    expect(screen.getByRole("heading", { level: 2, name: "Latest news" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "All news" })).toHaveAttribute("href", "/en/news");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "First post" })).toHaveAttribute(
      "href",
      "/en/news/one"
    );
    expect(screen.getByText("2 November 2026")).toBeInTheDocument();
  });

  it("renders Thai copy and links", () => {
    render(<LatestNews locale="th" items={news} />);
    expect(
      screen.getByRole("heading", { level: 2, name: homeTh.latestNews.heading })
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Second post" })).toHaveAttribute(
      "href",
      "/th/news/two"
    );
  });
});

describe("GetHelp", () => {
  it("has three links with the emergency one in red", () => {
    render(<GetHelp locale="en" />);
    expect(screen.getByRole("heading", { level: 2, name: "Get help" })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Contact BIRSA" })).toHaveAttribute(
      "href",
      "/en/contact"
    );
    expect(screen.getByRole("link", { name: "Not sure who to ask" })).toHaveAttribute(
      "href",
      "/en/contact/where-to-go"
    );
    const emergency = screen.getByRole("link", { name: "Emergency guidance" });
    expect(emergency).toHaveAttribute("href", "/en/emergency");
    expect(emergency).toHaveClass("bg-brand");
  });

  it("renders Thai copy", () => {
    render(<GetHelp locale="th" />);
    expect(screen.getByRole("link", { name: homeTh.getHelp.items.emergency })).toHaveAttribute(
      "href",
      "/th/emergency"
    );
  });
});

describe("AllTopics", () => {
  it("lists nine rows with locale prefixed links", () => {
    render(<AllTopics locale="en" />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Everything on BIRSA" })
    ).toBeInTheDocument();
    const links = within(screen.getByRole("navigation")).getAllByRole("link");
    expect(links).toHaveLength(9);
    for (const link of links) expect(link.getAttribute("href")).toMatch(/^\/en\//);
    expect(screen.getByRole("link", { name: /^Your first weeks/ })).toHaveAttribute(
      "href",
      "/en/student-life/getting-started"
    );
    expect(screen.getByRole("link", { name: /^About BIRSA/ })).toHaveAttribute(
      "href",
      "/en/activity"
    );
  });

  it("renders Thai copy", () => {
    render(<AllTopics locale="th" />);
    expect(screen.getByText(homeTh.allTopics.aboutTitle)).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(9);
  });
});

describe("home copy", () => {
  it("has a Thai title distinct from English", () => {
    expect(homeTh.title).not.toBe(homeEn.title);
  });
});
