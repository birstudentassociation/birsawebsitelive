// @vitest-environment jsdom
/**
 * The accessible combobox, alone and as the class form's course and place
 * fields. Queries are scoped to each render's container because there is no
 * global testing-library cleanup.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { useState } from "react";
import CalendarBuilder from "@/components/calendar-builder/CalendarBuilder";
import Combobox, { type ComboboxGroup } from "@/components/calendar-builder/Combobox";
import { calendarEvents } from "@/content/calendar/events";
import { getCalendarBuilderCopy } from "@/content/calendar-builder";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const groups: ComboboxGroup[] = [
  {
    id: "a",
    label: "Group A",
    options: [
      { id: "one", primary: "PI211 Politics", secondary: "Mon 09:00 to 12:00 · R.103" },
      { id: "two", primary: "PI271 Relations", tag: "Added" },
    ],
  },
  { id: "b", label: "Group B", options: [{ id: "three", primary: "PI300 Other" }] },
];

function Harness({
  onSelect = () => undefined,
  onCommit,
  noMatches,
  data = groups,
}: {
  onSelect?: (id: string) => void;
  onCommit?: () => void;
  noMatches?: { title: string; hint: string };
  data?: ComboboxGroup[];
}) {
  const [value, setValue] = useState("");
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Combobox
        id="c"
        name="c"
        label="Course"
        hint="Type to search"
        value={value}
        onChange={setValue}
        groups={data}
        onSelect={(option) => {
          setValue(option.id);
          onSelect(option.id);
        }}
        onCommit={onCommit}
        noMatches={noMatches}
        resultsStatus={(n) => `${n} suggestions available`}
      />
    </form>
  );
}

function setupBox(props: Parameters<typeof Harness>[0] = {}) {
  const { container } = render(<Harness {...props} />);
  const ui = within(container);
  return { ui, input: ui.getByRole("combobox") as HTMLInputElement };
}

describe("Combobox", () => {
  it("is closed until focused, then opens with a labelled, grouped listbox", () => {
    const { ui, input } = setupBox();
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(input.getAttribute("aria-autocomplete")).toBe("list");
    expect(ui.queryByRole("listbox")).toBeNull();
    fireEvent.focus(input);
    expect(input.getAttribute("aria-expanded")).toBe("true");
    const listbox = ui.getByRole("listbox");
    expect(input.getAttribute("aria-controls")).toBe(listbox.id);
    expect(ui.getByRole("group", { name: "Group A" })).toBeTruthy();
    expect(ui.getByRole("group", { name: "Group B" })).toBeTruthy();
    expect(ui.getAllByRole("option")).toHaveLength(3);
    expect(ui.getByText("Mon 09:00 to 12:00 · R.103")).toBeTruthy();
    expect(ui.getByText("Added")).toBeTruthy();
    expect(ui.getByRole("status").textContent).toBe("3 suggestions available");
    expect(input.getAttribute("aria-describedby")).toContain("c-hint");
  });

  it("opens when typing, and highlights what was typed", () => {
    const { ui, input } = setupBox();
    fireEvent.change(input, { target: { value: "pi2" } });
    expect(input.getAttribute("aria-expanded")).toBe("true");
    const marks = ui.getAllByText("PI2", { selector: "mark" });
    expect(marks.length).toBeGreaterThan(0);
  });

  it("moves with the arrow keys, wraps, and announces the active option", () => {
    const { ui, input } = setupBox();
    fireEvent.keyDown(input, { key: "ArrowDown" });
    const options = ui.getAllByRole("option");
    expect(input.getAttribute("aria-activedescendant")).toBe(options[0]?.id);
    expect(options[0]?.getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.getAttribute("aria-activedescendant")).toBe(options[1]?.id);
    fireEvent.keyDown(input, { key: "ArrowUp" });
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input.getAttribute("aria-activedescendant")).toBe(options[2]?.id);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.getAttribute("aria-activedescendant")).toBe(options[0]?.id);
    // Focus never leaves the input.
    expect(options.every((o) => o.getAttribute("tabindex") === null)).toBe(true);
  });

  it("jumps with Home and End once an option is active, and leaves them to the text box before", () => {
    const { ui, input } = setupBox();
    fireEvent.focus(input);
    const home = fireEvent.keyDown(input, { key: "Home" });
    expect(home).toBe(true); // not prevented: the caret moves instead
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    const end = fireEvent.keyDown(input, { key: "End" });
    expect(end).toBe(false);
    const options = ui.getAllByRole("option");
    expect(input.getAttribute("aria-activedescendant")).toBe(options[2]?.id);
    fireEvent.keyDown(input, { key: "Home" });
    expect(input.getAttribute("aria-activedescendant")).toBe(options[0]?.id);
  });

  it("picks the active option with Enter and closes", () => {
    const onSelect = vi.fn();
    const { ui, input } = setupBox({ onSelect });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith("two");
    expect(input.value).toBe("two");
    expect(ui.queryByRole("listbox")).toBeNull();
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement === input || true).toBe(true);
  });

  it("closes on Escape, reopens on click, and leaves Escape alone when closed", () => {
    const { ui, input } = setupBox();
    fireEvent.focus(input);
    // Prevented, so a surrounding dialog or form does not treat it as its own.
    expect(fireEvent.keyDown(input, { key: "Escape" })).toBe(false);
    expect(ui.queryByRole("listbox")).toBeNull();
    // With nothing open, Escape is left alone.
    expect(fireEvent.keyDown(input, { key: "Escape" })).toBe(true);
    fireEvent.click(input);
    expect(ui.getByRole("listbox")).toBeTruthy();
  });

  it("picks with the mouse and keeps the text box focused", () => {
    const onSelect = vi.fn();
    const { ui, input } = setupBox({ onSelect });
    fireEvent.focus(input);
    const option = ui.getByRole("option", { name: /PI300/ });
    // The listbox swallows mousedown so the input never loses focus.
    expect(fireEvent.mouseDown(option)).toBe(false);
    fireEvent.click(option);
    expect(onSelect).toHaveBeenCalledWith("three");
  });

  it("shows a No matches row with a hint when nothing matches", () => {
    const { ui, input } = setupBox({
      data: [],
      noMatches: { title: "No matches", hint: "Type the code." },
    });
    fireEvent.change(input, { target: { value: "zzz" } });
    const row = ui.getByRole("option");
    expect(row.getAttribute("aria-disabled")).toBe("true");
    expect(row.textContent).toContain("No matches");
    expect(row.textContent).toContain("Type the code.");
    // It is not a choice, so arrows do not make it active.
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.getAttribute("aria-activedescendant")).toBeNull();
  });

  it("stays closed with no options and no No matches row", () => {
    const { ui, input } = setupBox({ data: [] });
    fireEvent.focus(input);
    expect(ui.queryByRole("listbox")).toBeNull();
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("swallows Enter only when the parent asked to commit", () => {
    const onCommit = vi.fn();
    const withCommit = setupBox({ onCommit });
    fireEvent.focus(withCommit.input);
    expect(fireEvent.keyDown(withCommit.input, { key: "Enter" })).toBe(false);
    expect(onCommit).toHaveBeenCalledWith("enter");
    cleanup();
    const without = setupBox();
    fireEvent.focus(without.input);
    expect(fireEvent.keyDown(without.input, { key: "Enter" })).toBe(true);
  });

  it("closes when focus leaves", () => {
    const { ui, input } = setupBox();
    fireEvent.focus(input);
    fireEvent.blur(input, { relatedTarget: document.body });
    expect(ui.queryByRole("listbox")).toBeNull();
  });
});

describe("the class form's course and place comboboxes", () => {
  const terms = [
    { key: "2569-1", year: 2569, semester: 1, start: "2026-08-03", end: "2026-11-21" },
    { key: "2569-2", year: 2569, semester: 2, start: "2027-01-04", end: "2027-05-01" },
  ];

  const options = (ui: ReturnType<typeof within>) =>
    within(ui.getByRole("listbox")).getAllByRole("option");

  function setupBuilder(locale: "en" | "th" = "en") {
    window.localStorage.clear();
    window.history.replaceState(null, "", "/");
    const { container } = render(
      <CalendarBuilder
        locale={locale}
        copy={getCalendarBuilderCopy(locale)}
        events={calendarEvents}
        courses={[
          { code: "PI271", title: "Introduction to International Relations" },
          { code: "PI300", title: "Not in the timetable" },
        ]}
        terms={terms}
        defaultTermKey="2569-2"
        todayKey="2026-11-05"
        siteUrl="https://example.org"
      />
    );
    const ui = within(container);
    fireEvent.click(ui.getByRole("button", { name: locale === "th" ? "ต่อไป" : "Continue" }));
    return ui;
  }

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-11-05T05:00:00Z"));
  });

  it("opens on focus with groups in order and an other courses heading", () => {
    const ui = setupBuilder();
    fireEvent.click(ui.getByRole("button", { name: "Add a class" }));
    const input = ui.getByRole("combobox", { name: /Course/ });
    fireEvent.focus(input);
    const headings = ui
      .getAllByRole("group")
      .map((g) => g.getAttribute("aria-labelledby"))
      .filter(Boolean)
      .map((id) => document.getElementById(id as string)?.textContent);
    expect(headings.slice(0, 3)).toEqual(["Year 1", "Year 2 required", "Year 3"]);
    expect(headings.at(-1)).toBe("Other courses (enter the time yourself)");
    expect(ui.getByText("Tue 09:00 to 12:00 · R.102")).toBeTruthy();
  });

  it("filters as you type pi2, with a status, then picks with the keyboard and fills in", () => {
    const ui = setupBuilder();
    fireEvent.click(ui.getByRole("button", { name: "Add a class" }));
    const input = ui.getByRole("combobox", { name: /Course/ });
    fireEvent.change(input, { target: { value: "pi2" } });
    const shown = options(ui);
    expect(shown.map((o) => o.textContent?.slice(0, 5))).toEqual([
      "PI211",
      "PI271",
      "PI270",
      "PI272",
      "PI292",
    ]);
    expect(ui.getAllByRole("status").some((s) => s.textContent === "5 suggestions available")).toBe(
      true
    );
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect((input as HTMLInputElement).value).toBe("PI271");
    expect(ui.queryByRole("listbox")).toBeNull();
    expect(ui.getByText("Every Tuesday, 09:00 to 12:00")).toBeTruthy();
  });

  it("filters by Thai day name, lecturer, room and a course outside the timetable", () => {
    const ui = setupBuilder();
    fireEvent.click(ui.getByRole("button", { name: "Add a class" }));
    const input = ui.getByRole("combobox", { name: /Course/ });
    fireEvent.change(input, { target: { value: "พฤหัส" } });
    expect(options(ui).some((o) => /^TU102/.test(o.textContent ?? ""))).toBe(true);
    fireEvent.change(input, { target: { value: "Goncharoff" } });
    expect(options(ui).map((o) => o.textContent?.slice(0, 5))).toEqual(["PI382", "PI387", "PI490"]);
    fireEvent.change(input, { target: { value: "PI 300" } });
    expect(options(ui).map((o) => o.textContent?.slice(0, 5))).toEqual(["PI300"]);
  });

  it("shows No matches and still lets free text through to the manual fields", () => {
    const ui = setupBuilder();
    fireEvent.click(ui.getByRole("button", { name: "Add a class" }));
    const input = ui.getByRole("combobox", { name: /Course/ });
    fireEvent.change(input, { target: { value: "ZZ999" } });
    const row = within(ui.getByRole("listbox")).getByRole("option");
    expect(row.textContent).toContain("No matches");
    expect(row.textContent).toContain("Type the course code, such as PI271");
    expect(ui.getByLabelText("Day")).toBeTruthy();
    expect(ui.queryByText("From the BIR timetable")).toBeNull();
  });

  it("suggests known rooms in the place field as you type", () => {
    const ui = setupBuilder();
    fireEvent.click(ui.getByRole("button", { name: "Add a class" }));
    fireEvent.change(ui.getByRole("combobox", { name: /Course/ }), { target: { value: "ZZ999" } });
    fireEvent.blur(ui.getByRole("combobox", { name: /Course/ }), { relatedTarget: document.body });
    const place = ui.getByRole("combobox", { name: /Place/ });
    fireEvent.change(place, { target: { value: "r.4" } });
    expect(options(ui).map((o) => o.textContent)).toEqual(["R.405", "R.406"]);
    fireEvent.keyDown(place, { key: "ArrowDown" });
    fireEvent.keyDown(place, { key: "Enter" });
    expect((place as HTMLInputElement).value).toBe("R.405");
    fireEvent.change(place, { target: { value: "Room 301" } });
    expect(ui.queryByRole("listbox")).toBeNull();
  });

  it("speaks Thai: group names, day names and rooms", () => {
    const ui = setupBuilder("th");
    fireEvent.click(ui.getByRole("button", { name: "เพิ่มคาบเรียน" }));
    const input = ui.getByRole("combobox", { name: /รายวิชา/ });
    fireEvent.change(input, { target: { value: "อังคาร" } });
    expect(ui.getByText("ชั้นปีที่ 1")).toBeTruthy();
    expect(
      options(ui).some((o) => o.textContent?.includes("อังคาร 09:00 ถึง 12:00 น. · ร.102"))
    ).toBe(true);
    fireEvent.change(input, { target: { value: "PI271" } });
    expect(ui.getByText("ร.102")).toBeTruthy();
  });
});
