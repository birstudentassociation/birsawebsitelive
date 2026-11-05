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

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const termS1 = { key: "2569-1", year: 2569, semester: 1, start: "2026-08-03", end: "2026-11-21" };
const termS2 = { key: "2569-2", year: 2569, semester: 2, start: "2027-01-04", end: "2027-05-01" };
const courses = [
  { code: "PI271", title: "Example course" },
  { code: "PI300", title: "Not in the timetable" },
];

function setup(overrides: Partial<React.ComponentProps<typeof CalendarBuilder>> = {}) {
  const { container } = render(
    <CalendarBuilder
      locale="en"
      copy={getCalendarBuilderCopy("en")}
      events={calendarEvents}
      courses={courses}
      terms={[termS1, termS2]}
      defaultTermKey="2569-2"
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
  // Bangkok 2026-11-05: semester 1 ends in 16 days, so semester 2 is the default.
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-11-05T05:00:00Z"));
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

const V2 = "bir-calendar-builder:v2";

function chooseSemester(ui: ReturnType<typeof setup>, n: 1 | 2) {
  fireEvent.click(ui.getByRole("radio", { name: new RegExp(`Semester ${n}`) }));
}

function openForm(ui: ReturnType<typeof setup>) {
  fireEvent.click(ui.getByRole("button", { name: "Add a class" }));
}

function typeCourse(ui: ReturnType<typeof setup>, text: string) {
  fireEvent.change(ui.getByRole("combobox", { name: /Course/ }), { target: { value: text } });
}

function addTimetabled(ui: ReturnType<typeof setup>, code: string) {
  openForm(ui);
  typeCourse(ui, code);
  fireEvent.click(ui.getByRole("button", { name: "Add this class" }));
}

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

  it("defaults to semester 2 today and shows each semester's dates under its option", () => {
    const ui = setup({ defaultTermKey: "2569-1" });
    const s2 = ui.getByRole("radio", { name: /Semester 2/ }) as HTMLInputElement;
    expect(s2.checked).toBe(true);
    expect(ui.getByRole("radio", { name: /Semester 1/ }).closest("label")?.textContent).toMatch(
      /3 August 2026 to 21 November 2026/
    );
    expect(s2.closest("label")?.textContent).toMatch(/4 January 2027 to 1 May 2027/);
  });

  it("adds a manual class in semester 1, which has no timetable", () => {
    const ui = setup();
    chooseSemester(ui, 1);
    expect(ui.getByText(/timetable for this semester is not built in/)).toBeTruthy();
    expect(ui.queryByRole("button", { name: "Add all Year 1 courses" })).toBeNull();
    openForm(ui);
    typeCourse(ui, "pi271");
    fireEvent.change(ui.getByLabelText("Day"), { target: { value: "1" } });
    fireEvent.change(ui.getByLabelText("Start time"), { target: { value: "09:30" } });
    fireEvent.change(ui.getByLabelText("End time"), { target: { value: "12:20" } });
    fireEvent.change(ui.getByRole("combobox", { name: /Place/ }), {
      target: { value: "Room 301" },
    });
    fireEvent.click(ui.getByRole("button", { name: "Add this class" }));

    const preview = within(ui.getByRole("complementary"));
    expect(preview.getByText("Every Monday, 09:30 to 12:20")).toBeTruthy();
    expect(visibleLink(ui)).toContain("term=2569-1");
    expect(visibleLink(ui)).toContain("inc=birsa%2Cholidays%2Cregistration%2Cclasses");
    expect(visibleLink(ui)).not.toContain("exams");
    expect(visibleLink(ui)).toContain("c=PI271%7E1%7E0930%7E1220%7ERoom+301");
    expect(window.localStorage.getItem(V2)).toContain("PI271");
  });

  it("shows friendly errors for an invalid class", () => {
    const ui = setup();
    chooseSemester(ui, 1);
    openForm(ui);
    typeCourse(ui, "nonsense");
    fireEvent.change(ui.getByLabelText("Start time"), { target: { value: "12:00" } });
    fireEvent.change(ui.getByLabelText("End time"), { target: { value: "10:00" } });
    fireEvent.click(ui.getByRole("button", { name: "Add this class" }));

    const alert = within(ui.getByRole("alert"));
    expect(alert.getByText("Enter a course code such as PI271")).toBeTruthy();
    expect(alert.getByText("Choose a day")).toBeTruthy();
    expect(alert.getByText("Choose an end time that is after the start time")).toBeTruthy();
    expect(ui.queryAllByText("Choose a day").length).toBeGreaterThan(1);
  });

  it("fills day, time and place from the timetable and adds the exams", () => {
    const ui = setup();
    openForm(ui);
    typeCourse(ui, "PI271");
    expect(ui.getByText("From the BIR timetable")).toBeTruthy();
    expect(ui.getByText("Every Tuesday, 09:00 to 12:00")).toBeTruthy();
    expect(ui.getByText("R.102")).toBeTruthy();
    expect(ui.getByText("Tue 23 Feb, 09:00 to 11:00")).toBeTruthy();
    expect(ui.getByText("Tue 18 May, 09:00 to 12:00, R.103")).toBeTruthy();
    // The editable fields stay hidden until asked for.
    expect(ui.queryByLabelText("Day")).toBeNull();

    fireEvent.click(ui.getByRole("button", { name: "Add this class" }));
    const exams = ui.getByRole("checkbox", { name: /My exams/ }) as HTMLInputElement;
    expect(exams.disabled).toBe(false);
    expect(exams.checked).toBe(true);
    expect(visibleLink(ui)).toContain("inc=birsa%2Cholidays%2Cregistration%2Cclasses%2Cexams");
    expect(visibleLink(ui)).toContain("term=2569-2");
    expect(visibleLink(ui)).toContain("c=PI271%7E2%7E0900%7E1200%7ER.102");
    const preview = within(ui.getByRole("complementary"));
    expect(preview.getByText("Every Tuesday, 09:00 to 12:00")).toBeTruthy();
    expect(preview.getByText(/Midterm PI271 Introduction to International Relations/)).toBeTruthy();
    expect(preview.getAllByText(/Final PI271/).length).toBe(1);
  });

  it("disables My exams with an explanation until a timetable class is added", () => {
    const ui = setup();
    const exams = ui.getByRole("checkbox", { name: /My exams/ }) as HTMLInputElement;
    expect(exams.disabled).toBe(true);
    expect(ui.getByText(/Needs a class from the BIR timetable/)).toBeTruthy();
    chooseSemester(ui, 1);
    openForm(ui);
    typeCourse(ui, "PI300");
    fireEvent.change(ui.getByLabelText("Day"), { target: { value: "3" } });
    fireEvent.change(ui.getByLabelText("Start time"), { target: { value: "10:00" } });
    fireEvent.change(ui.getByLabelText("End time"), { target: { value: "11:00" } });
    fireEvent.click(ui.getByRole("button", { name: "Add this class" }));
    expect((ui.getByRole("checkbox", { name: /My exams/ }) as HTMLInputElement).disabled).toBe(
      true
    );
  });

  it("lets the student change the filled in time and room", () => {
    const ui = setup();
    openForm(ui);
    typeCourse(ui, "PI271");
    fireEvent.click(ui.getByRole("button", { name: "Change time or room" }));
    expect((ui.getByLabelText("Start time") as HTMLInputElement).value).toBe("09:00");
    fireEvent.change(ui.getByLabelText("Start time"), { target: { value: "09:30" } });
    fireEvent.change(ui.getByRole("combobox", { name: /Place/ }), { target: { value: "R.999" } });
    fireEvent.click(ui.getByRole("button", { name: "Add this class" }));
    expect(visibleLink(ui)).toContain("c=PI271%7E2%7E0930%7E1200%7ER.999");
    // The exams still come from the timetable.
    expect(
      within(ui.getByRole("complementary")).getByText(/Midterm PI271 Introduction/)
    ).toBeTruthy();
  });

  it("asks which LAS101 section before filling anything", () => {
    const ui = setup();
    openForm(ui);
    typeCourse(ui, "LAS101");
    expect(ui.getByRole("group", { name: "Which section are you in?" })).toBeTruthy();
    expect(ui.getAllByRole("radio", { name: /Section 03640/ })).toHaveLength(2);
    expect(ui.queryByText("From the BIR timetable")).toBeNull();

    fireEvent.click(ui.getByRole("button", { name: "Add this class" }));
    expect(within(ui.getByRole("alert")).getByText("Choose your section")).toBeTruthy();
    expect(within(ui.getByRole("alert")).queryByText("Choose a day")).toBeNull();

    fireEvent.click(ui.getByRole("radio", { name: /Section 036402, R.406/ }));
    expect(ui.getByText("R.406")).toBeTruthy();
    fireEvent.click(ui.getByRole("button", { name: "Add this class" }));
    expect(visibleLink(ui)).toContain("c=LAS101%7E5%7E0900%7E1200%7ER.406%7E036402");
    expect(
      within(ui.getByRole("complementary")).getByText(/Final LAS101 .* section 036402/)
    ).toBeTruthy();
  });

  it("adds a whole year, skips duplicates, and undoes", () => {
    const ui = setup();
    fireEvent.click(ui.getByRole("button", { name: "Add all Year 1 courses" }));
    const status = ui.getByText(/Added 5 classes\./);
    expect(status.textContent).toMatch(/LAS101 needs a section/);
    expect(ui.getAllByText(/^(TU102|PI122|AH208|PI211|PI271) /).length).toBeGreaterThanOrEqual(5);
    // LAS101 is waiting for a section in the form.
    expect(ui.getByRole("group", { name: "Which section are you in?" })).toBeTruthy();
    expect(visibleLink(ui)).toContain("exams");

    fireEvent.click(ui.getByRole("button", { name: "Add all Year 1 courses" }));
    // Only LAS101 is left, and it still needs a section, so nothing new is added.
    expect(ui.getByText(/^LAS101 needs a section/)).toBeTruthy();
    expect(ui.getAllByRole("button", { name: /^Remove / })).toHaveLength(5);

    fireEvent.click(ui.getByRole("button", { name: "Add all Year 2 required courses" }));
    expect(ui.getByText(/Added 5 classes\./)).toBeTruthy();
    fireEvent.click(ui.getByRole("button", { name: "Undo" }));
    expect(ui.queryByText(/PI321 Thai Politics/)).toBeNull();
    expect(ui.getAllByText(/PI211 Introduction to Political Science/).length).toBeGreaterThan(0);
  });

  it("blocks a duplicate course and warns about a clash without blocking", () => {
    const ui = setup();
    addTimetabled(ui, "PI211");
    openForm(ui);
    typeCourse(ui, "PI211");
    expect(ui.getByText("You have already added PI211")).toBeTruthy();
    fireEvent.click(ui.getByRole("button", { name: "Add this class" }));
    expect(ui.getAllByText("You have already added PI211").length).toBeGreaterThan(1);
    expect(ui.getAllByRole("button", { name: /^Remove PI211/ })).toHaveLength(1);

    // PI343 meets Monday 09:00 to 12:00, the same slot as PI211.
    typeCourse(ui, "PI343");
    expect(
      ui.getByText(/This overlaps PI211 on Monday, 09:00 to 12:00\. You can still add it\./)
    ).toBeTruthy();
    fireEvent.click(ui.getByRole("button", { name: "Add this class" }));
    expect(ui.getAllByText("Overlaps PI211").length).toBe(1);
    expect(ui.getAllByText("Overlaps PI343").length).toBe(1);
  });

  it("keeps classes per semester and switches the feed with the term", () => {
    const ui = setup();
    addTimetabled(ui, "PI271");
    chooseSemester(ui, 1);
    expect(ui.getByText("You have not added any classes yet.")).toBeTruthy();
    expect(visibleLink(ui)).toContain("term=2569-1");
    expect(visibleLink(ui)).not.toContain("PI271");
    chooseSemester(ui, 2);
    expect(visibleLink(ui)).toContain("c=PI271");
    expect(
      ui.getAllByText(/^PI271 Introduction to International Relations/).length
    ).toBeGreaterThan(0);
  });

  it("migrates the version 1 storage shape under its term", () => {
    window.localStorage.setItem(
      "bir-calendar-builder:v1",
      "inc=birsa&term=2569-2&c=PI271%7E2%7E1300%7E1550%7E"
    );
    const ui = setup();
    expect(visibleLink(ui)).toContain("inc=birsa");
    expect(visibleLink(ui)).toContain("term=2569-2");
    expect(visibleLink(ui)).toContain("c=PI271%7E2%7E1300%7E1550%7E");
    chooseSemester(ui, 1);
    expect(visibleLink(ui)).not.toContain("PI271");
    const saved = JSON.parse(window.localStorage.getItem(V2) ?? "{}");
    expect(saved.v).toBe(2);
    expect(saved.classes["2569-2"]).toEqual(["PI271~2~1300~1550~"]);
    expect(window.localStorage.getItem("bir-calendar-builder:v1")).toBeNull();
  });

  it("restores a saved version 2 state, including the chosen semester", () => {
    window.localStorage.setItem(
      V2,
      JSON.stringify({
        v: 2,
        inc: "birsa,classes",
        term: "2569-1",
        classes: { "2569-1": ["PI300~3~1000~1100~"], "2569-2": ["PI271~2~0900~1200~R.102"] },
      })
    );
    const ui = setup();
    expect((ui.getByRole("radio", { name: /Semester 1/ }) as HTMLInputElement).checked).toBe(true);
    expect(visibleLink(ui)).toContain("term=2569-1");
    expect(visibleLink(ui)).toContain("c=PI300");
    expect(visibleLink(ui)).not.toContain("PI271");
  });

  it("prompts when My class times is chosen with no classes", () => {
    const ui = setup();
    fireEvent.click(ui.getByRole("checkbox", { name: /My class times/ }));
    const preview = within(ui.getByRole("complementary"));
    expect(preview.getByText(/have not added a class yet/)).toBeTruthy();
  });

  it("explains when no term is published and disables class times", () => {
    const ui = setup({ terms: [], defaultTermKey: "" });
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
});
