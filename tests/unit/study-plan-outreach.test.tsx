// @vitest-environment jsdom
/**
 * The plan screen's section for sharing a plan and asking about it, and the
 * read-only page the share link opens. What matters most: the link is plain
 * visible text and works without the clipboard, the read-only page shows a plan
 * only from a whole valid fragment and never touches the network, the elective
 * form shows exactly what it would send and carries nothing else, and the
 * browser's note that electives were sent is wrapped in try/catch throughout.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";

const calendar = vi.hoisted(() => ({ events: [] as unknown[] }));

vi.mock("@/content/calendar/events", async () => {
  const actual = await vi.importActual<typeof import("@/content/calendar/events")>(
    "@/content/calendar/events"
  );
  return {
    ...actual,
    get calendarEvents() {
      return calendar.events;
    },
  };
});

import CopyLinkButton from "@/components/study-plan/CopyLinkButton";
import ElectiveDemandForm from "@/components/study-plan/ElectiveDemandForm";
import PlanOutreach from "@/components/study-plan/PlanOutreach";
import SharedPlanView from "@/components/study-plan/SharedPlanView";
import {
  clearDemandMarker,
  markDemandShared,
  parseDemandMarker,
  readDemandMarker,
} from "@/components/study-plan/demandMarker";
import { buildPlanOutreachCopy } from "@/components/study-plan/planOutreachCopy";
import { buildStudyPlanCopy } from "@/components/study-plan/studyPlanCopy";
import type { CalendarEvent } from "@/content/calendar/events";
import { decodeShareFragment } from "@/lib/study-plan/shareFragment";
import { deserialisePlan, serialisePlan, type StudyPlan } from "@/lib/study-plan/plan";
import { encodeShareFragment } from "@/lib/study-plan/shareFragment";

const KEY = "birsa-elective-demand";
const NOW = new Date("2026-10-11T05:00:00Z");

const plan: StudyPlan = {
  versionId: "2568",
  cohort: "68",
  startYear: 2568,
  minorId: "governance",
  passed: ["PI121", "PI122"],
  freeElectiveCreditsPassed: 0,
  terms: [
    { term: { year: 3, kind: "semester1" }, codes: ["PI364", "PI380"], freeElectiveCredits: 0 },
    { term: { year: 3, kind: "semester2" }, codes: ["PI376"], freeElectiveCredits: 0 },
  ],
};

beforeEach(() => {
  window.localStorage.clear();
  window.location.hash = "";
  calendar.events = [];
});
afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("the share-with-an-advisor section", () => {
  const section = () => {
    const result = render(
      <PlanOutreach plan={plan} serialisedPlan={serialisePlan(plan)} locale="en" now={NOW} />
    );
    return result;
  };

  it("shows the link as visible text that carries the plan after the #", () => {
    const { container } = section();
    const box = container.querySelector<HTMLTextAreaElement>("#share-with-advisor textarea")!;
    expect(box.readOnly).toBe(true);
    const url = new URL(box.value);
    expect(url.pathname).toBe("/en/services/study-plan/view");
    expect(url.search).toBe("");
    expect(decodeShareFragment(url.hash)).toEqual({ plan, sharedOn: "2026-10-11" });
  });

  it("dates the link with today's Bangkok day", () => {
    const { container } = section();
    const box = container.querySelector<HTMLTextAreaElement>("#share-with-advisor textarea")!;
    expect(box.value).toContain("&d=2026-10-11");
  });

  it("offers a link to open the read-only view as well", () => {
    const { getByRole } = section();
    const link = getByRole("link", { name: /Open the read-only view/ });
    expect(link.getAttribute("href")).toBe(
      `/en/services/study-plan/view#${encodeShareFragment(plan, "2026-10-11")}`
    );
  });

  it("says the plan never reaches BIRSA, and what the other person needs", () => {
    const { container } = section();
    const text = container.querySelector("#share-with-advisor")!.textContent!;
    expect(text).toMatch(/never sends that part to a server/);
    expect(text).toMatch(/needs JavaScript/);
    expect(text).toMatch(/make a new link/);
  });

  it("is in Thai for a Thai reader", () => {
    const { container } = render(
      <PlanOutreach plan={plan} serialisedPlan={serialisePlan(plan)} locale="th" now={NOW} />
    );
    expect(container.querySelector("#share-with-advisor h3")!.textContent).toBe(
      "ส่งแผนให้อาจารย์ที่ปรึกษา"
    );
    const box = container.querySelector<HTMLTextAreaElement>("#share-with-advisor textarea")!;
    expect(new URL(box.value).pathname).toBe("/th/services/study-plan/view");
  });
});

describe("the ask Academic Affairs section", () => {
  it("is a plain form that posts the plan to a server action, so it works without JavaScript", () => {
    const { container } = render(
      <PlanOutreach plan={plan} serialisedPlan={serialisePlan(plan)} locale="en" now={NOW} />
    );
    const form = container.querySelector("#ask-academic-affairs form")!;
    const hidden = form.querySelector<HTMLInputElement>('input[type="hidden"][name="plan"]')!;
    expect(deserialisePlan(hidden.value)).toEqual(plan);
    expect(form.querySelector('button[type="submit"]')!.textContent).toBe(
      "Start a message about my plan"
    );
  });

  it("promises nothing is sent until the student presses send", () => {
    const { container } = render(
      <PlanOutreach plan={plan} serialisedPlan={serialisePlan(plan)} locale="en" now={NOW} />
    );
    expect(container.querySelector("#ask-academic-affairs")!.textContent).toMatch(
      /Nothing is sent until you press send/
    );
  });
});

describe("the registration dates section", () => {
  const window2570 = (id: string, start: string, term: 1 | 2): CalendarEvent => ({
    id,
    start,
    title: { en: `Window ${id}`, th: `ช่วง ${id}` },
    slug: "fixture-post",
    kind: "birsa",
    academic: { window: "registration", term: { year: 2570, semester: term } },
  });

  it("says no dates are recorded when the calendar holds none, and offers no download", () => {
    const { container } = render(
      <PlanOutreach plan={plan} serialisedPlan={serialisePlan(plan)} locale="en" now={NOW} />
    );
    const text = container.querySelector("#registration-dates")!.textContent!;
    expect(text).toContain("No registration dates recorded yet");
    expect(container.querySelector('#registration-dates a[href*=".ics"]')).toBeNull();
    expect(
      container
        .querySelector('#registration-dates a[href$="/news/academic-calendar-2569"]')!
        .getAttribute("href")
    ).toBe("/en/news/academic-calendar-2569");
  });

  it("lists the windows for the planned terms and links to a download naming those terms", () => {
    calendar.events = [
      window2570("reg-s1", "2027-07-12", 1),
      window2570("reg-s2", "2027-12-06", 2),
      { ...window2570("reg-s3", "2028-04-03", 1), academic: undefined },
      {
        ...window2570("other-year", "2026-07-12", 1),
        academic: { window: "registration", term: { year: 2569, semester: 1 } },
      },
    ];
    const { container } = render(
      <PlanOutreach plan={plan} serialisedPlan={serialisePlan(plan)} locale="en" now={NOW} />
    );
    const section = container.querySelector("#registration-dates")!;
    expect(section.textContent).not.toContain("No registration dates recorded yet");
    const items = [...section.querySelectorAll("li")].map((li) => li.textContent);
    expect(items).toEqual([
      "Registration, Semester 1, 2027/28: 12 July 2027",
      "Registration, Semester 2, 2027/28: 6 December 2027",
    ]);
    const href = section.querySelector("a[href*='.ics']")!.getAttribute("href")!;
    expect(href).toBe("/en/services/study-plan/plan/registration.ics?terms=2570-1,2570-2");
  });

  it("writes a date range once, naming the month where it is shared", () => {
    calendar.events = [{ ...window2570("range", "2027-07-12", 1), end: "2027-07-16" }];
    const { container } = render(
      <PlanOutreach plan={plan} serialisedPlan={serialisePlan(plan)} locale="en" now={NOW} />
    );
    expect(container.querySelector("#registration-dates li")!.textContent).toBe(
      "Registration, Semester 1, 2027/28: 12 to 16 July 2027"
    );
  });
});

describe("SharedPlanView", () => {
  const copy = buildStudyPlanCopy("en");
  const { view } = buildPlanOutreachCopy("en");
  const view_ = () => (
    <SharedPlanView locale="en" copy={copy} view={view} startHref="/en/services/study-plan" />
  );

  it("renders nothing on the server, which is what a reader without JavaScript gets", () => {
    expect(renderToString(view_())).toBe("");
  });

  it("shows a valid plan read-only and dated, from the fragment", () => {
    window.location.hash = `#${encodeShareFragment(plan, "2026-10-11")}`;
    const { container, getByText } = render(view_());
    expect(container.textContent).toContain("Read only");
    expect(container.textContent).toContain("copy of a plan made on 11 October 2026");
    expect(container.textContent).toMatch(/Opened on \d{1,2} \w+ 20\d\d/);
    expect(getByText("Plan shared on")).toBeTruthy();
    // The same information as the print page: terms, courses and findings.
    expect(container.textContent).toContain("Terms you have planned");
    expect(container.textContent).toContain("Year 3, Semester 1");
    expect(container.textContent).toContain("PI364");
    expect(container.textContent).toContain("What we found");
    expect(container.textContent).toContain("What you still owe");
    // And nothing that edits it.
    expect(container.querySelector("form, input, textarea, select, button")).toBeNull();
  });

  it("links each course to its page, as the print page does", () => {
    window.location.hash = `#${encodeShareFragment(plan, "2026-10-11")}`;
    const { container } = render(view_());
    expect(
      container.querySelector('a[href="/en/student-life/course-reviews/PI364"]')
    ).not.toBeNull();
  });

  it("says when the link carries no date, instead of inventing one", () => {
    window.location.hash = `#p=${serialisePlan(plan)}`;
    const { container } = render(view_());
    expect(container.textContent).toContain("does not say when it was made");
    expect(container.textContent).not.toContain("Plan shared on");
  });

  it("never touches the network", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    window.location.hash = `#${encodeShareFragment(plan, "2026-10-11")}`;
    render(view_());
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("says so, and shows no plan, for a link with no plan in it", () => {
    for (const hash of ["", "#"]) {
      window.location.hash = hash;
      const { container } = render(view_());
      expect(container.textContent).toContain("There is no plan in this link");
      expect(container.textContent).not.toContain("Terms you have planned");
      cleanup();
    }
  });

  it("says it could not read a link that was cut short or edited, and shows no plan", () => {
    const whole = encodeShareFragment(plan, "2026-10-11");
    for (const hash of [
      `#${whole.slice(0, 60)}`,
      "#p=nonsense",
      "#something-else",
      `#p=${serialisePlan(plan)}!!&d=2026-10-11`,
    ]) {
      window.location.hash = hash;
      const { container } = render(view_());
      expect(container.textContent, hash).toContain("We could not read this plan");
      expect(container.textContent, hash).not.toContain("Terms you have planned");
      cleanup();
    }
  });

  it("follows the fragment when the reader pastes a different link into the same tab", async () => {
    window.location.hash = "";
    const { container } = render(view_());
    expect(container.textContent).toContain("There is no plan in this link");
    act(() => {
      window.location.hash = `#${encodeShareFragment(plan, "2026-10-11")}`;
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    await waitFor(() => expect(container.textContent).toContain("Terms you have planned"));
  });

  it("reads in Thai for a Thai reader", () => {
    const th = buildPlanOutreachCopy("th").view;
    window.location.hash = `#${encodeShareFragment(plan, "2026-10-11")}`;
    const { container } = render(
      <SharedPlanView
        locale="th"
        copy={buildStudyPlanCopy("th")}
        view={th}
        startHref="/th/services/study-plan"
      />
    );
    expect(container.textContent).toContain("อ่านได้อย่างเดียว");
    expect(container.textContent).toContain("ภาคการศึกษาที่วางแผนไว้");
  });
});

describe("CopyLinkButton", () => {
  const props = {
    link: "https://example.org/en/services/study-plan/view#p=abc",
    label: "Copy link",
    copiedLabel: "Link copied",
    failedLabel: "Could not copy",
  };

  it("renders nothing on the server or where there is no clipboard", () => {
    expect(renderToString(<CopyLinkButton {...props} />)).toBe("");
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
    const { container } = render(<CopyLinkButton {...props} />);
    expect(container.innerHTML).toBe("");
  });

  it("copies the link and says so", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const { getByRole, findByText } = render(<CopyLinkButton {...props} />);
    fireEvent.click(getByRole("button", { name: "Copy link" }));
    expect(writeText).toHaveBeenCalledWith(props.link);
    expect(await findByText("Link copied")).toBeTruthy();
  });

  it("says it could not copy when the browser refuses, and does not throw", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const { getByRole, findByText } = render(<CopyLinkButton {...props} />);
    fireEvent.click(getByRole("button", { name: "Copy link" }));
    expect(await findByText("Could not copy")).toBeTruthy();
  });
});

describe("ElectiveDemandForm", () => {
  const copy = buildPlanOutreachCopy("en").demand;
  const base = {
    locale: "en" as const,
    copy,
    permalink: "/en/services/study-plan/plan?plan=x#share-electives",
    versionId: "2568",
    versionLabel: "Curriculum 2025 (B.E. 2568)",
    entriesValue: "PI364@2570-1,PI376@2570-2",
    entries: [
      { code: "PI364", termLabel: "Semester 1, 2027/28" },
      { code: "PI376", termLabel: "Semester 2, 2027/28" },
    ],
    windowKey: "2569-1",
    windowLabel: "Semester 1, 2026/27",
    threshold: 20,
  };
  const idle = () => vi.fn(async () => ({ status: "idle" as const }));

  it("shows everything that would be sent, and what is not", () => {
    const { container } = render(<ElectiveDemandForm {...base} action={idle()} />);
    const text = container.textContent!;
    expect(text).toContain("This is everything that would be sent");
    expect(text).toContain("Curriculum: Curriculum 2025 (B.E. 2568)");
    expect(text).toContain("PI364, planned for Semester 1, 2027/28");
    expect(text).toContain("PI376, planned for Semester 2, 2027/28");
    expect(text).toMatch(
      /no cohort, no minor, no courses you have passed, no name and no student ID/
    );
  });

  it("carries the version and the entries in hidden fields and nothing else about the student", () => {
    const { container } = render(<ElectiveDemandForm {...base} action={idle()} />);
    const form = container.querySelector("form")!;
    const hidden = [...form.querySelectorAll<HTMLInputElement>('input[type="hidden"]')]
      .filter((input) => !input.name.startsWith("$ACTION"))
      .map((input) => [input.name, input.value]);
    expect(hidden).toEqual([
      ["version", "2568"],
      ["entries", "PI364@2570-1,PI376@2570-2"],
    ]);
    const named = [...form.querySelectorAll<HTMLInputElement>("input[name]")]
      .map((input) => input.name)
      .filter((name) => !name.startsWith("$ACTION"));
    expect(named.sort()).toEqual(["entries", "nickname", "share", "version"]);
    expect(
      form.querySelector('input[name="plan"], input[name="cohort"], input[name="minor"]')
    ).toBeNull();
  });

  it("has an unticked checkbox with the opt-in wording, and a collection notice", () => {
    const { container, getByLabelText } = render(<ElectiveDemandForm {...base} action={idle()} />);
    const box = getByLabelText(
      "Share my planned electives anonymously with Academic Affairs"
    ) as HTMLInputElement;
    expect(box.type).toBe("checkbox");
    expect(box.checked).toBe(false);
    expect(container.textContent).toContain("Sharing is entirely optional");
    expect(container.textContent).toContain("Read the privacy notice");
  });

  it("says the limit is soft", () => {
    const { container } = render(<ElectiveDemandForm {...base} action={idle()} />);
    expect(container.textContent).toMatch(/That limit is soft/);
    expect(container.textContent).toMatch(/20 or more students/);
  });

  it("sends the form's own fields to the action, thanks the student, and remembers the term", async () => {
    const action = vi.fn(async (_prev: unknown, data: FormData) => {
      void data;
      return { status: "shared" as const };
    });
    const { container, getByLabelText, findByText } = render(
      <ElectiveDemandForm {...base} action={action} />
    );
    fireEvent.click(getByLabelText("Share my planned electives anonymously with Academic Affairs"));
    await act(async () => {
      fireEvent.submit(container.querySelector("form")!);
    });
    expect(action).toHaveBeenCalledTimes(1);
    const data = action.mock.calls[0]![1] as FormData;
    const sentKeys = [...data.keys()].filter((key) => !key.startsWith("$ACTION")).sort();
    expect(sentKeys).toEqual(["entries", "nickname", "share", "version"]);
    expect(data.get("share")).toBe("yes");
    expect(await findByText("Thank you. Your planned electives were sent.")).toBeTruthy();
    expect(window.localStorage.getItem(KEY)).toBe('["2569-1"]');
  });

  it("shows what went wrong, and sends nothing more, when the action refuses", async () => {
    const action = vi.fn(async () => ({ status: "not-agreed" as const }));
    const { container, findByText } = render(<ElectiveDemandForm {...base} action={action} />);
    await act(async () => {
      fireEvent.submit(container.querySelector("form")!);
    });
    expect(await findByText(copy.errors["not-agreed"])).toBeTruthy();
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });

  it("offers no second send from this browser in a term it has already sent in", () => {
    window.localStorage.setItem(KEY, '["2569-1"]');
    const { container } = render(<ElectiveDemandForm {...base} action={idle()} />);
    expect(container.querySelector("form")).toBeNull();
    expect(container.textContent).toContain("already sent your electives from this browser");
    expect(container.textContent).toContain("Semester 1, 2026/27");
  });

  it("offers the form again in a later term", () => {
    window.localStorage.setItem(KEY, '["2568-2"]');
    const { container } = render(<ElectiveDemandForm {...base} action={idle()} />);
    expect(container.querySelector("form")).not.toBeNull();
  });

  it("offers nothing to send, and says why, when the plan has no electives", () => {
    const { container } = render(
      <ElectiveDemandForm {...base} entries={[]} entriesValue="" action={idle()} />
    );
    expect(container.querySelector("form")).toBeNull();
    expect(container.textContent).toContain("There are no elective courses in your plan yet");
  });

  it("still works when storage is blocked: the form shows and a send does not throw", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const action = vi.fn(async () => ({ status: "shared" as const }));
    const { container, findByText } = render(<ElectiveDemandForm {...base} action={action} />);
    expect(container.querySelector("form")).not.toBeNull();
    await act(async () => {
      fireEvent.submit(container.querySelector("form")!);
    });
    expect(await findByText("Thank you. Your planned electives were sent.")).toBeTruthy();
  });
});

describe("the browser's note that electives were sent", () => {
  it("holds only term keys, newest last, capped", () => {
    for (let year = 2560; year < 2575; year += 1) markDemandShared(`${year}-1`);
    const keys = parseDemandMarker(readDemandMarker());
    expect(keys).toHaveLength(8);
    expect(keys.at(-1)).toBe("2574-1");
    expect(keys.every((key) => /^\d{4}-(1|2|summer)$/.test(key))).toBe(true);
  });

  it("does not repeat a term", () => {
    markDemandShared("2569-1");
    markDemandShared("2569-1");
    expect(parseDemandMarker(readDemandMarker())).toEqual(["2569-1"]);
  });

  it("is cleared by clearDemandMarker, which the plan's delete button calls", () => {
    markDemandShared("2569-1");
    clearDemandMarker();
    expect(readDemandMarker()).toBeNull();
  });

  it("treats damaged contents as nothing", () => {
    for (const junk of [null, "", "not json", "{}", '"text"', "[1,2]", '[["x"]]']) {
      expect(parseDemandMarker(junk), String(junk)).toEqual([]);
    }
    expect(parseDemandMarker('["2569-1", 7, null]')).toEqual(["2569-1"]);
  });

  it("never throws when storage does", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(readDemandMarker()).toBeNull();
    expect(() => markDemandShared("2569-1")).not.toThrow();
    expect(() => clearDemandMarker()).not.toThrow();
  });
});
