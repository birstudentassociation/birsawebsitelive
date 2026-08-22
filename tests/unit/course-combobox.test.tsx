// @vitest-environment jsdom
/**
 * `lib/study-plan/courseMatch.ts` (the pure matching engine) and
 * `components/forms/CourseCombobox.tsx` (the widget built on it).
 *
 * The component is tested twice, deliberately with two different renderers.
 * `renderToStaticMarkup` renders the SERVER markup — the no-JavaScript
 * baseline this control has to keep byte-for-byte ordinary, since the
 * study-plan journey has a no-JS end-to-end test that walks straight through
 * it. `render()` from @testing-library/react flushes effects, so it is the
 * one that ever sees the enhanced, scripted combobox; asserting against the
 * static markup would never catch a hydration mismatch or an enhancement
 * that fails to mount.
 *
 * There is no global testing-library cleanup configured in vitest.config.ts
 * (see tests/unit/study-plan-term-editor.test.tsx), so every query below is
 * scoped to the render's own `container` with `within` rather than going
 * through `screen`, which would see every previous case's markup too.
 */
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { render, within, fireEvent } from "@testing-library/react";
import axe from "axe-core";
import {
  filterCourseOptions,
  normaliseCourseQuery,
  resolveCourseCode,
  resolveCourseQuery,
} from "@/lib/study-plan/courseMatch";
import CourseCombobox, {
  type CourseComboboxCopy,
  type CourseComboboxGroup,
} from "@/components/forms/CourseCombobox";

const copy: CourseComboboxCopy = {
  prompt: "Choose a course",
  typeaheadHint: "Start typing a course code or name.",
  noMatches: "No courses match.",
  resultsTemplate: "{n} results",
  clearLabel: "Clear",
};

const groups: CourseComboboxGroup[] = [
  {
    id: "core",
    label: "Core",
    options: [
      { value: "PI380", label: "PI380 Introduction to Political Institutions" },
      { value: "PI381", label: "PI381 Advanced Political Institutions" },
      { value: "TH101", label: "TH101 การปกครองไทย", keywords: "thai government" },
    ],
  },
  {
    id: "elective",
    label: "Elective",
    options: [{ value: "EL200", label: "EL200 International Political Economy" }],
  },
];

describe("normaliseCourseQuery", () => {
  it("lowercases, strips punctuation and collapses whitespace", () => {
    expect(normaliseCourseQuery("  PI-380:  Intro.  ")).toBe("pi 380 intro");
  });

  it("ignores middle dots and periods", () => {
    expect(normaliseCourseQuery("PI380 · Intro.")).toBe("pi380 intro");
  });

  it("keeps Thai letters", () => {
    expect(normaliseCourseQuery("การปกครองไทย!")).toBe("การปกครองไทย");
  });
});

describe("filterCourseOptions", () => {
  const options = groups.flatMap((g) => g.options);

  it("returns every option for an empty query", () => {
    expect(filterCourseOptions(options, "")).toEqual(options);
    expect(filterCourseOptions(options, "   ")).toEqual(options);
  });

  it("requires every token to appear, matching label or keywords", () => {
    expect(filterCourseOptions(options, "political institutions")).toEqual([
      options[0],
      options[1],
    ]);
    expect(filterCourseOptions(options, "thai government")).toEqual([options[2]]);
  });

  it('filters a value="" none option on its label like any other', () => {
    const withNone = [{ value: "", label: "I have not taken this yet" }, ...options];
    expect(filterCourseOptions(withNone, "not taken")).toEqual([withNone[0]]);
    expect(filterCourseOptions(withNone, "pi380")).toEqual([options[0]]);
  });
});

describe("resolveCourseQuery", () => {
  const options = groups.flatMap((g) => g.options);

  it("returns null for an empty query", () => {
    expect(resolveCourseQuery(options, "")).toBeNull();
    expect(resolveCourseQuery(options, "   ")).toBeNull();
  });

  it("an exact value match wins even when the code substring is ambiguous across labels", () => {
    // "PI380" is a substring of only PI380's own label, but "political" alone
    // would be ambiguous — the bare code must still win outright.
    expect(resolveCourseQuery(options, "PI380")).toBe(options[0]);
    expect(resolveCourseQuery(options, "pi380")).toBe(options[0]);
  });

  it("resolves an exact normalised label match", () => {
    expect(resolveCourseQuery(options, "PI381 Advanced Political Institutions")).toBe(options[1]);
  });

  it("resolves a unique filtered match", () => {
    expect(resolveCourseQuery(options, "international")).toBe(options[3]);
  });

  it("is null when several options match and none is a unique prefix", () => {
    // Both PI380 and PI381 match "political institutions" and neither
    // label starts with that string ("PI380 Introduction..." does not).
    expect(resolveCourseQuery(options, "political institutions")).toBeNull();
  });

  it("resolves when exactly one filtered match is a prefix of its label", () => {
    // Only PI380's label starts with "pi380 introduction".
    expect(resolveCourseQuery(options, "PI380 Introduction")).toBe(options[0]);
  });

  it("resolves Thai text after normalisation", () => {
    expect(resolveCourseQuery(options, "การปกครองไทย")).toBe(options[2]);
  });
});

describe("resolveCourseCode", () => {
  const courses = [
    { code: "PI380", title: "Introduction to Political Institutions" },
    { code: "PI381", title: "Advanced Political Institutions" },
    { code: "EL200", title: "International Political Economy" },
  ];

  it("resolves a bare code", () => {
    expect(resolveCourseCode(courses, "pi380")).toBe("PI380");
  });

  it("resolves a unique title fragment", () => {
    expect(resolveCourseCode(courses, "international")).toBe("EL200");
  });

  it("returns null for an ambiguous or unmatched query", () => {
    expect(resolveCourseCode(courses, "political institutions")).toBeNull();
    expect(resolveCourseCode(courses, "nonexistent course")).toBeNull();
  });
});

describe("CourseCombobox", () => {
  it("renders a plain select with optgroups in the server markup", () => {
    const html = renderToStaticMarkup(
      <CourseCombobox id="course" name="code" label="Course" groups={groups} copy={copy} />
    );
    expect(html).toContain("<select");
    expect(html).toContain('name="code"');
    expect(html).toContain("<optgroup");
    expect(html).toContain("Core");
    expect(html).toContain("Elective");
    expect(html).toContain("PI380 Introduction to Political Institutions");
    // No enhanced markup leaks into the server render.
    expect(html).not.toContain('role="combobox"');
  });

  it("renders the disabled prompt option when there is no emptyOption", () => {
    const html = renderToStaticMarkup(
      <CourseCombobox id="course" name="code" label="Course" groups={groups} copy={copy} />
    );
    expect(html).toContain('value=""');
    expect(html).toContain("disabled");
    expect(html).toContain("Choose a course");
  });

  it("mounts as an ARIA combobox with a hidden field carrying the code", async () => {
    const { container } = render(
      <CourseCombobox id="course" name="code" label="Course" groups={groups} copy={copy} />
    );
    const combobox = await within(container).findByRole("combobox");
    expect(combobox).toBeTruthy();
    expect(combobox.hasAttribute("name")).toBe(false);

    const hidden = container.querySelector('input[type="hidden"][name="code"]');
    expect(hidden).toBeTruthy();
    expect((hidden as HTMLInputElement).value).toBe("");
  });

  it("filters the listbox to a course typed by its title", async () => {
    const { container } = render(
      <CourseCombobox id="course" name="code" label="Course" groups={groups} copy={copy} />
    );
    const input = (await within(container).findByRole("combobox")) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "International Political Economy" } });

    const options = within(container).getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]?.textContent).toContain("EL200");
  });

  it("selecting an option by click puts the course code in the hidden input", async () => {
    const { container } = render(
      <CourseCombobox id="course" name="code" label="Course" groups={groups} copy={copy} />
    );
    const input = (await within(container).findByRole("combobox")) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Advanced Political" } });
    const option = within(container).getByRole("option", {
      name: /PI381 Advanced Political Institutions/,
    });
    fireEvent.click(option);

    const hidden = container.querySelector('input[type="hidden"][name="code"]') as HTMLInputElement;
    expect(hidden.value).toBe("PI381");
    expect(input.value).toBe("PI381 Advanced Political Institutions");
  });

  it("selecting an option via Enter puts the course code in the hidden input", async () => {
    const { container } = render(
      <CourseCombobox id="course" name="code" label="Course" groups={groups} copy={copy} />
    );
    const input = (await within(container).findByRole("combobox")) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "EL200" } });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    const hidden = container.querySelector('input[type="hidden"][name="code"]') as HTMLInputElement;
    expect(hidden.value).toBe("EL200");
  });

  it("autofills the hidden input on blur from a typed title, with no explicit selection", async () => {
    const { container } = render(
      <CourseCombobox id="course" name="code" label="Course" groups={groups} copy={copy} />
    );
    const input = (await within(container).findByRole("combobox")) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "International Political Economy" } });
    fireEvent.blur(input);

    const hidden = container.querySelector('input[type="hidden"][name="code"]') as HTMLInputElement;
    expect(hidden.value).toBe("EL200");
    expect(input.value).toBe("EL200 International Political Economy");
  });

  it("reverts unresolved text on blur instead of submitting free text", async () => {
    const { container } = render(
      <CourseCombobox id="course" name="code" label="Course" groups={groups} copy={copy} />
    );
    const input = (await within(container).findByRole("combobox")) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "not a real course" } });
    fireEvent.blur(input);

    const hidden = container.querySelector('input[type="hidden"][name="code"]') as HTMLInputElement;
    expect(hidden.value).toBe("");
    expect(input.value).toBe("");
  });
});

/**
 * Accessibility smoke test for the enhanced combobox, run with axe-core over
 * jsdom-rendered output. Follows tests/unit/inventory-a11y.test.tsx exactly:
 * `color-contrast` is disabled because jsdom has no layout engine to
 * meaningfully evaluate contrast against.
 */
const AXE_OPTIONS: Parameters<typeof axe.run>[1] = {
  runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
  rules: { "color-contrast": { enabled: false } },
};

describe("CourseCombobox with an unlabelled group", () => {
  // The fill step gives each slot a single group whose heading would only
  // repeat the field's own label, so it passes `label: ""`. That has to mean
  // "no grouping" in both renderings: an `<optgroup label="">` would draw an
  // empty heading in the native select, and an `aria-label=""` names nothing.
  const ungrouped: CourseComboboxGroup[] = [{ id: "slot", label: "", options: groups[0]!.options }];
  const notTaken = { value: "", label: "I have not taken this yet" };

  it("puts the options straight into the server select, with no optgroup", () => {
    const html = renderToStaticMarkup(
      <CourseCombobox
        id="slot-1"
        name="slot-1"
        label="Minor Required Course 1"
        groups={ungrouped}
        emptyOption={notTaken}
        copy={copy}
      />
    );
    expect(html).toContain("<select");
    expect(html).not.toContain("<optgroup");
    expect(html).toContain("PI380 Introduction to Political Institutions");
    expect(html).toContain("I have not taken this yet");
  });

  it("renders no group heading in the enhanced listbox", async () => {
    const { container } = render(
      <CourseCombobox
        id="slot-2"
        name="slot-2"
        label="Minor Required Course 1"
        groups={ungrouped}
        emptyOption={notTaken}
        copy={copy}
      />
    );
    const input = (await within(container).findByRole("combobox")) as HTMLInputElement;
    fireEvent.focus(input);

    expect(container.querySelector('ul[role="group"]')).toBeNull();
    expect(within(container).getAllByRole("option").length).toBe(ungrouped[0]!.options.length + 1);
  });

  // The bug this guards: the fill step arrives with the empty option's label
  // already in the box, and the plan screen puts a whole course label there
  // the moment one is picked. Filtering on that text would narrow the list to
  // the single option already chosen, so reopening the widget would show a
  // student their existing answer and no way to change it.
  it("offers the whole list, not just the current answer, when the box still holds the selected label", async () => {
    const { container } = render(
      <CourseCombobox
        id="slot-3"
        name="slot-3"
        label="Minor Required Course 1"
        groups={ungrouped}
        emptyOption={notTaken}
        copy={copy}
      />
    );
    const input = (await within(container).findByRole("combobox")) as HTMLInputElement;
    expect(input.value).toBe("I have not taken this yet");

    fireEvent.focus(input);
    expect(within(container).getAllByRole("option").length).toBe(ungrouped[0]!.options.length + 1);
  });
});

describe("CourseCombobox accessibility (axe)", () => {
  it("has no axe violations once enhanced, closed", async () => {
    const { container } = render(
      <CourseCombobox id="course" name="code" label="Course" groups={groups} copy={copy} />
    );
    await within(container).findByRole("combobox");
    const results = await axe.run(container, AXE_OPTIONS);
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  it("has no axe violations with the listbox open and a group of results showing", async () => {
    const { container } = render(
      <CourseCombobox id="course" name="code" label="Course" groups={groups} copy={copy} />
    );
    const input = (await within(container).findByRole("combobox")) as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Political" } });

    const results = await axe.run(container, AXE_OPTIONS);
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  it("has no axe violations with an emptyOption present, unlabelled group", async () => {
    const { container } = render(
      <CourseCombobox
        id="slot-1"
        name="slot-1"
        label="Minor Required Course 1"
        groups={[{ id: "slot-1", label: "", options: groups.flatMap((g) => g.options) }]}
        emptyOption={{ value: "", label: "I have not taken this yet" }}
        copy={copy}
      />
    );
    const input = await within(container).findByRole("combobox");
    fireEvent.focus(input);

    const results = await axe.run(container, AXE_OPTIONS);
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
});
