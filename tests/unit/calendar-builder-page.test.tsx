// @vitest-environment jsdom
/**
 * The calendar builder's key interactions. Queries are scoped to each
 * render's container because there is no global testing-library cleanup.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, waitFor, within } from "@testing-library/react";
import CalendarBuilder, { guessDevice } from "@/components/calendar-builder/CalendarBuilder";
import { calendarEvents } from "@/content/calendar/events";
import { getCalendarBuilderCopy } from "@/content/calendar-builder";

afterEach(cleanup);

const term = { key: "2569-2", year: 2569, semester: 2, start: "2027-01-04", end: "2027-05-01" };
const courses = [{ code: "PI271", title: "Example course" }];

function setup(overrides: Partial<React.ComponentProps<typeof CalendarBuilder>> = {}) {
  const { container } = render(
    <CalendarBuilder
      locale="en"
      copy={getCalendarBuilderCopy("en")}
      events={calendarEvents}
      courses={courses}
      term={term}
      todayKey="2026-11-05"
      siteUrl="https://example.org"
      {...overrides}
    />
  );
  return within(container);
}

function visibleLink(ui: ReturnType<typeof setup>): string {
  const inputs = ui.getAllByLabelText("Your calendar link") as HTMLInputElement[];
  const shown = inputs.find((input) => !input.closest("[hidden]"));
  return shown?.value ?? "";
}

beforeEach(() => {
  window.localStorage.clear();
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    configurable: true,
  });
});

describe("guessDevice", () => {
  it("maps user agents to guides", () => {
    expect(guessDevice("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)")).toBe("iphone");
    expect(guessDevice("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", 5)).toBe("iphone");
    expect(guessDevice("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", 0)).toBe("mac");
    expect(guessDevice("Mozilla/5.0 (Linux; Android 14; SM-S918B)")).toBe("samsung");
    expect(guessDevice("Mozilla/5.0 (Linux; Android 14; Pixel 8)")).toBe("android");
    expect(guessDevice("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe("google");
  });
});

describe("CalendarBuilder", () => {
  it("toggling a category updates the preview and the feed link", () => {
    const ui = setup();
    expect(visibleLink(ui)).toContain("/en/my-calendar.ics?inc=birsa%2Cholidays%2Cregistration");
    const preview0 = within(ui.getByRole("complementary"));
    expect(preview0.getAllByText("Public holiday, no classes").length).toBeGreaterThan(0);

    fireEvent.click(ui.getByRole("checkbox", { name: /University days, holidays and closures/ }));
    expect(visibleLink(ui)).toContain("inc=birsa%2Cregistration");
    const preview = within(ui.getByRole("complementary"));
    expect(preview.queryByText("Public holiday, no classes")).toBeNull();

    fireEvent.click(ui.getByRole("checkbox", { name: /BIRSA activities/ }));
    fireEvent.click(ui.getByRole("checkbox", { name: /Registration and add or drop/ }));
    expect(preview.getByText(/Nothing is chosen/)).toBeTruthy();
  });

  it("adds a valid class, shows it in the preview and puts it in the link", () => {
    const ui = setup();
    fireEvent.click(ui.getByRole("button", { name: "Add a class" }));
    fireEvent.change(ui.getByLabelText(/Course/), { target: { value: "pi271" } });
    fireEvent.change(ui.getByLabelText("Day"), { target: { value: "1" } });
    fireEvent.change(ui.getByLabelText("Start time"), { target: { value: "09:30" } });
    fireEvent.change(ui.getByLabelText("End time"), { target: { value: "12:20" } });
    fireEvent.change(ui.getByLabelText(/Place/), { target: { value: "Room 301" } });
    fireEvent.click(ui.getByRole("button", { name: "Add this class" }));

    const preview = within(ui.getByRole("complementary"));
    expect(preview.getByText("Every Monday, 09:30 to 12:20")).toBeTruthy();
    expect(visibleLink(ui)).toContain("inc=birsa%2Cholidays%2Cregistration%2Cclasses");
    expect(visibleLink(ui)).toContain("c=PI271%7E1%7E0930%7E1220%7ERoom+301");
    expect(window.localStorage.getItem("bir-calendar-builder:v1")).toContain("PI271");
  });

  it("shows friendly errors for an invalid class", () => {
    const ui = setup();
    fireEvent.click(ui.getByRole("button", { name: "Add a class" }));
    fireEvent.change(ui.getByLabelText(/Course/), { target: { value: "nonsense" } });
    fireEvent.change(ui.getByLabelText("Start time"), { target: { value: "12:00" } });
    fireEvent.change(ui.getByLabelText("End time"), { target: { value: "10:00" } });
    fireEvent.click(ui.getByRole("button", { name: "Add this class" }));

    const alert = within(ui.getByRole("alert"));
    expect(alert.getByText("Enter a course code such as PI271")).toBeTruthy();
    expect(alert.getByText("Choose a day")).toBeTruthy();
    expect(alert.getByText("Choose an end time that is after the start time")).toBeTruthy();
    expect(ui.queryAllByText("Choose a day").length).toBeGreaterThan(1);
  });

  it("prompts when My class times is chosen with no classes", () => {
    const ui = setup();
    fireEvent.click(ui.getByRole("checkbox", { name: /My class times/ }));
    const preview = within(ui.getByRole("complementary"));
    expect(preview.getByText(/have not added a class yet/)).toBeTruthy();
  });

  it("explains when no term is published and disables class times", () => {
    const ui = setup({ term: null });
    expect(ui.getByText("Term dates are not published yet")).toBeTruthy();
    expect(
      (ui.getByRole("checkbox", { name: /My class times/ }) as HTMLInputElement).disabled
    ).toBe(true);
  });

  it("switches the guide when a device is chosen", () => {
    const ui = setup();
    fireEvent.click(ui.getByRole("radio", { name: "iPhone or iPad" }));
    expect(ui.getByRole("heading", { name: "iPhone or iPad" })).toBeTruthy();
    expect(ui.queryByRole("heading", { name: "Mac" })).toBeNull();

    fireEvent.click(ui.getByRole("radio", { name: "Mac" }));
    expect(ui.getByRole("heading", { name: "Mac" })).toBeTruthy();
    expect(ui.queryByRole("heading", { name: "iPhone or iPad" })).toBeNull();
    const button = ui.getByRole("link", { name: "Add to Apple Calendar" }) as HTMLAnchorElement;
    expect(button.getAttribute("href")).toMatch(/^webcal:\/\/example\.org\/en\/my-calendar\.ics/);
  });

  it("copies the link and confirms politely", async () => {
    const ui = setup();
    fireEvent.click(ui.getByRole("radio", { name: "Mac" }));
    fireEvent.click(ui.getByRole("button", { name: "Copy link" }));
    await waitFor(() => expect(ui.getByText("Link copied")).toBeTruthy());
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(visibleLink(ui));
    expect(ui.getByText("Link copied").closest("[aria-live=polite]")).toBeTruthy();
  });

  it("restores saved choices after mount", () => {
    window.localStorage.setItem(
      "bir-calendar-builder:v1",
      "inc=birsa&term=2569-2&c=PI271%7E2%7E1300%7E1550%7E"
    );
    const ui = setup();
    expect(visibleLink(ui)).toContain("inc=birsa");
    expect(visibleLink(ui)).toContain("c=PI271%7E2%7E1300%7E1550%7E");
  });
});
