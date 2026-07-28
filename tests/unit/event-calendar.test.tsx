// @vitest-environment jsdom
/**
 * Unit tests for `EventCalendar`'s month navigation and subscribe panel.
 *
 * The calendar derives its month list from the events it is given, so adding
 * the university academic calendar for AY 2569 stretched that list from two
 * months to well over a year. These tests pin the behaviour that depends on
 * the list's length: the calendar opens on today's month, steps forward and
 * back one month at a time, and disables each arrow at the correct end.
 *
 * They also cover the subscribe links, which are the only route by which a
 * reader reaches the .ics feed.
 */
import { describe, expect, it, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, within } from "@testing-library/react";
// This repo has no global vitest setup file, so the jest-dom matchers are
// registered per test file that needs them.
import "@testing-library/jest-dom/vitest";

import EventCalendar, { type EventCalendarLabels } from "@/components/home/EventCalendar";
import { calendarEvents, type CalendarEvent } from "@/content/calendar/events";

afterEach(cleanup);

const labels: EventCalendarLabels = {
  prevMonth: "Previous month",
  nextMonth: "Next month",
  selectedFor: "On {date}",
  noEventsDay: "Nothing scheduled on this day.",
  open: "Read",
  eventCount: { one: "{n} event", other: "{n} events" },
  legend: { birsa: "BIRSA", academic: "Academic", university: "University" },
  styleLegend: { period: "Multi-day period", single: "Single-day event" },
  subscribe: {
    heading: "Subscribe to this calendar",
    intro: "Add these dates to your own calendar app.",
    webcal: "Subscribe",
    https: "Calendar file link",
  },
};

const ICS_URL = "https://example.com/en/calendar.ics";

function renderCalendar(events: CalendarEvent[], todayKey: string) {
  return render(
    <EventCalendar
      events={events}
      locale="en"
      todayKey={todayKey}
      labels={labels}
      icsUrl={ICS_URL}
    />
  );
}

/** The visible "August 2026"-style month title. */
function currentMonth(): string {
  const heading = screen.getByRole("heading", { level: 3, name: /\d{4}$/ });
  return heading.textContent ?? "";
}

function clickNext() {
  fireEvent.click(screen.getByRole("button", { name: labels.nextMonth }));
}

function clickPrev() {
  fireEvent.click(screen.getByRole("button", { name: labels.prevMonth }));
}

/** Distinct `YYYY-MM` keys the calendar should page through, in order. */
function expectedMonthKeys(events: CalendarEvent[]): string[] {
  const keys = new Set<string>();
  for (const event of events) {
    keys.add(event.start.slice(0, 7));
    if (event.end) keys.add(event.end.slice(0, 7));
  }
  return Array.from(keys).sort();
}

describe("EventCalendar month navigation", () => {
  it("opens on the month containing today", () => {
    renderCalendar(calendarEvents, "2026-07-28");
    expect(currentMonth()).toBe("July 2026");
  });

  it("steps forward into the AY 2569 months that were added from the Registrar's calendar", () => {
    renderCalendar(calendarEvents, "2026-07-28");

    clickNext();
    expect(currentMonth()).toBe("August 2026");

    clickNext();
    expect(currentMonth()).toBe("September 2026");
  });

  it("steps back to the month before today", () => {
    renderCalendar(calendarEvents, "2026-07-28");

    clickPrev();
    expect(currentMonth()).toBe("June 2026");
  });

  it("reaches the last month of the academic year and disables the next arrow there", () => {
    renderCalendar(calendarEvents, "2026-07-28");

    const keys = expectedMonthKeys(calendarEvents);
    const startIndex = keys.indexOf("2026-07");
    expect(startIndex).toBeGreaterThanOrEqual(0);

    for (let i = startIndex; i < keys.length - 1; i += 1) clickNext();

    // The final I-grade deadline in the spec falls in October 2027.
    expect(currentMonth()).toBe("October 2027");
    expect(screen.getByRole("button", { name: labels.nextMonth })).toBeDisabled();
  });

  it("disables the previous arrow on the first month", () => {
    renderCalendar(calendarEvents, "2026-07-28");

    const keys = expectedMonthKeys(calendarEvents);
    for (let i = keys.indexOf("2026-07"); i > 0; i -= 1) clickPrev();

    expect(screen.getByRole("button", { name: labels.prevMonth })).toBeDisabled();
  });

  it("selects a day that has events when the month changes", () => {
    renderCalendar(calendarEvents, "2026-07-28");

    clickNext(); // August 2026: semester 1 opens on the 3rd.
    const panel = screen.getByRole("region", { name: /^On / });
    expect(within(panel).getByText("Semester 1 begins")).toBeInTheDocument();
  });
});

describe("EventCalendar subscribe panel", () => {
  it("offers both a webcal and an https link to the feed", () => {
    renderCalendar(calendarEvents, "2026-07-28");

    expect(screen.getByRole("link", { name: labels.subscribe.webcal })).toHaveAttribute(
      "href",
      "webcal://example.com/en/calendar.ics"
    );
    expect(screen.getByRole("link", { name: labels.subscribe.https })).toHaveAttribute(
      "href",
      ICS_URL
    );
  });
});
