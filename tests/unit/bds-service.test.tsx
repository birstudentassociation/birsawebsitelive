// @vitest-environment jsdom
/**
 * Unit tests for the service cluster (`components/bds/StartPage.tsx` and its
 * siblings, REDESIGN-2.0 §4.4, §5.1, service cluster). Placeholder content
 * throughout (reference numbers, service names, exit destinations) is
 * invented example data for these tests only, never an institutional fact
 * (BUILD-BRIEF-2.0 §3): "BIR-EQ-0001" is not a real BIRSA reference format,
 * and "https://example.org/weather" is not BIRSA's real Exit This Page
 * destination, which is a content decision for whichever page renders it.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import ExitThisPage from "@/components/bds/ExitThisPage";
import StartPage from "@/components/bds/StartPage";
import CheckAnswers from "@/components/bds/CheckAnswers";
import ConfirmationPanel from "@/components/bds/ConfirmationPanel";
import StatusLookup from "@/components/bds/StatusLookup";
import TaskList from "@/components/bds/TaskList";
import InterruptionPage from "@/components/bds/InterruptionPage";
import type { ServiceDefinition } from "@/lib/services/defineService";

afterEach(cleanup);

/**
 * The same D7 regression guard `tests/unit/bds-type.test.tsx` asserts for
 * `Text`/`Heading` (BUILD-BRIEF-2.0 §4 table: "a `bds/` component that
 * reaches for `text-4xl`, `text-lg` or `leading-tight` is a bug"), reused
 * here across the whole service cluster. Deliberately does NOT flag
 * `text-body`/`text-body-sm`/`text-heading-*`/`text-display-*`: those are
 * the bilingual type scale's OWN class names (`components/bds/tokens.css`),
 * not the Tailwind utilities this guard exists to forbid.
 */
const TAILWIND_TYPE_UTILITY = /\b(text-(xs|sm|base|lg|\d?xl)|leading-)/;

function assertNoRawTypeUtility(container: HTMLElement) {
  const all = [container, ...Array.from(container.querySelectorAll("*"))];
  for (const el of all) {
    const className = typeof el.className === "string" ? el.className : "";
    expect(className).not.toMatch(TAILWIND_TYPE_UTILITY);
  }
}

const exampleStart: ServiceDefinition["start"] = {
  title: { en: "Borrow equipment", th: "ยืมอุปกรณ์" },
  whoFor: {
    en: "For any BIR student. Not for staff or non-BIR students.",
    th: "สำหรับนักศึกษา BIR เท่านั้น ไม่รวมบุคลากรหรือนักศึกษานอกหลักสูตร",
  },
  before: [
    { en: "Your student ID number", th: "เลขประจำตัวนักศึกษา" },
    { en: "The dates you need the item", th: "วันที่ต้องการใช้อุปกรณ์" },
  ],
  howLong: { en: "About 5 minutes.", th: "ประมาณ 5 นาที" },
  whatNext: {
    en: "An officer reviews your request within 48 hours.",
    th: "เจ้าหน้าที่จะตรวจสอบคำขอภายใน 48 ชั่วโมง",
  },
};

describe("ExitThisPage", () => {
  let originalLocation: Location;

  beforeEach(() => {
    originalLocation = window.location;
    // jsdom's real `location.replace` logs a "not implemented" navigation
    // error rather than throwing, but it gives us nothing to assert against.
    // Replacing the whole object is the standard way to make it a real spy.
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, replace: vi.fn() },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
    vi.restoreAllMocks();
  });

  const props = {
    exitHref: "https://example.org/weather",
    label: "Leave this page now",
    shortcutHint: "Press Shift three times to leave this page quickly.",
    leavingAnnouncement: "Leaving.",
  };

  it("renders a real link that works with no JS", () => {
    render(<ExitThisPage {...props} />);
    const link = screen.getByRole("link", { name: /leave this page now/i });
    // A real <a href> is what makes this work with scripting disabled: the
    // browser's own default anchor behaviour fires when no onClick handler
    // ever attaches, with no <noscript> fallback required.
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", props.exitHref);
  });

  it("fires the leave routine on a click (the enhanced path)", () => {
    render(<ExitThisPage {...props} />);
    fireEvent.click(screen.getByRole("link", { name: /leave this page now/i }));
    expect(window.location.replace).toHaveBeenCalledWith(props.exitHref);
  });

  it("fires when Shift is pressed three times in quick succession", () => {
    render(<ExitThisPage {...props} />);
    expect(window.location.replace).not.toHaveBeenCalled();

    fireEvent.keyDown(window, { key: "Shift" });
    fireEvent.keyDown(window, { key: "Shift" });
    expect(window.location.replace).not.toHaveBeenCalled();
    fireEvent.keyDown(window, { key: "Shift" });

    expect(window.location.replace).toHaveBeenCalledWith(props.exitHref);
  });

  it("does not count Shift held as a modifier with another key", () => {
    render(<ExitThisPage {...props} />);
    fireEvent.keyDown(window, { key: "Shift" });
    fireEvent.keyDown(window, { key: "Shift" });
    // Tab held with Shift is a different action (reverse-tabbing), not a
    // third bare Shift press, so this must NOT trigger the exit.
    fireEvent.keyDown(window, { key: "Tab", shiftKey: true });
    expect(window.location.replace).not.toHaveBeenCalled();
  });

  it(// WHY THIS MATTERS (see the exhaustive TSDoc on ExitThisPage.tsx for the
  // full reasoning): a reader leaving a harassment report needs the Back
  // button, and a browser's visible history list, to not lead a second
  // person at the keyboard straight back to the page they left. Simply
  // navigating away leaves the page's own URL sitting one Back press away.
  // Overwriting that entry and padding several neutral entries ahead of it
  // means Back has to be pressed multiple times through identical-looking
  // decoys before it can reach anything, and the sensitive page's own URL
  // no longer appears in the history list at all.
  "replaces the current history entry and pushes decoy entries before navigating, in that order", () => {
    const calls: string[] = [];
    const replaceStateSpy = vi
      .spyOn(window.history, "replaceState")
      .mockImplementation(() => calls.push("replaceState"));
    const pushStateSpy = vi
      .spyOn(window.history, "pushState")
      .mockImplementation(() => calls.push("pushState"));
    const locationReplaceSpy = window.location.replace as ReturnType<typeof vi.fn>;
    locationReplaceSpy.mockImplementation(() => calls.push("location.replace"));

    render(<ExitThisPage {...props} decoyEntryCount={3} />);
    fireEvent.click(screen.getByRole("link", { name: /leave this page now/i }));

    expect(replaceStateSpy).toHaveBeenCalledTimes(1);
    expect(pushStateSpy).toHaveBeenCalledTimes(3);
    expect(locationReplaceSpy).toHaveBeenCalledTimes(1);
    // Order matters: the history must be overwritten and padded BEFORE the
    // real navigation runs, never after (once navigation starts, this
    // page's script stops running and could never pollute anything).
    expect(calls).toEqual([
      "replaceState",
      "pushState",
      "pushState",
      "pushState",
      "location.replace",
    ]);
  });

  it("still navigates away even if the History API throws", () => {
    vi.spyOn(window.history, "replaceState").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(<ExitThisPage {...props} />);
    fireEvent.click(screen.getByRole("link", { name: /leave this page now/i }));
    // History hardening is best-effort; actually leaving is not.
    expect(window.location.replace).toHaveBeenCalledWith(props.exitHref);
  });

  it("emits no raw Tailwind type utility", () => {
    const { container } = render(<ExitThisPage {...props} />);
    assertNoRawTypeUtility(container);
  });
});

describe("StartPage", () => {
  const labels = {
    beforeHeading: "Before you begin",
    howLongHeading: "How long it takes",
    whatNextHeading: "What happens next",
    startCta: "Start now",
  };

  it("renders every field of a ServiceDefinition's start", () => {
    render(
      <StartPage start={exampleStart} locale="en" href="/do/equipment-loan/name" labels={labels} />
    );

    expect(
      screen.getByRole("heading", { level: 1, name: exampleStart.title.en })
    ).toBeInTheDocument();
    expect(screen.getByText(exampleStart.whoFor.en)).toBeInTheDocument();
    for (const item of exampleStart.before) {
      expect(screen.getByText(item.en)).toBeInTheDocument();
    }
    expect(screen.getByText(exampleStart.howLong.en)).toBeInTheDocument();
    expect(screen.getByText(exampleStart.whatNext.en)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /start now/i })).toHaveAttribute(
      "href",
      "/do/equipment-loan/name"
    );
  });

  it("renders the Thai locale's copy, not English's, when locale is th", () => {
    render(
      <StartPage start={exampleStart} locale="th" href="/do/equipment-loan/name" labels={labels} />
    );
    expect(
      screen.getByRole("heading", { level: 1, name: exampleStart.title.th })
    ).toBeInTheDocument();
    expect(screen.queryByText(exampleStart.title.en)).not.toBeInTheDocument();
  });

  it("emits no raw Tailwind type utility", () => {
    const { container } = render(
      <StartPage start={exampleStart} locale="en" href="/do/equipment-loan/name" labels={labels} />
    );
    assertNoRawTypeUtility(container);
  });
});

describe("CheckAnswers", () => {
  const items = [
    {
      id: "name",
      question: "Your name",
      answer: "Somchai Example",
      changeHref: "/do/equipment-loan/name",
    },
    {
      id: "email",
      question: "Your email address",
      answer: "somchai@example.com",
      changeHref: "/do/equipment-loan/email",
    },
  ];

  it("renders a change link per answer that names the question, not a bare change", () => {
    render(<CheckAnswers heading="Check your answers" items={items} changeLabel="Change" />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);

    const nameLink = screen.getByRole("link", { name: "Change Your name" });
    expect(nameLink).toHaveAttribute("href", "/do/equipment-loan/name");

    const emailLink = screen.getByRole("link", { name: "Change Your email address" });
    expect(emailLink).toHaveAttribute("href", "/do/equipment-loan/email");

    // Neither accessible name is the bare word alone: that would be
    // meaningless read out of a screen reader's link list (WCAG 2.4.4/2.4.9).
    for (const link of links) {
      expect(link.textContent?.trim()).not.toBe("Change");
    }
  });

  it("renders every answer as read-only text, never re-asking the question (WCAG 3.3.7)", () => {
    render(<CheckAnswers heading="Check your answers" items={items} changeLabel="Change" />);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByText("Somchai Example")).toBeInTheDocument();
  });

  it("emits no raw Tailwind type utility", () => {
    const { container } = render(
      <CheckAnswers heading="Check your answers" items={items} changeLabel="Change" />
    );
    assertNoRawTypeUtility(container);
  });
});

describe("ConfirmationPanel", () => {
  it("renders the reference number prominently and tells the reader to save it", () => {
    render(
      <ConfirmationPanel
        heading="Request received"
        reference="BIR-EQ-0001"
        referenceLabel="Your reference number"
        saveReferenceMessage="Save this reference number. You will need it to check your request."
      />
    );

    const reference = screen.getByText("BIR-EQ-0001");
    expect(reference).toBeInTheDocument();
    // "Prominently" here means the largest type step on the page: the
    // display-1 step is bigger than the h1 above it (heading-2).
    expect(reference).toHaveClass("text-display-1");

    expect(
      screen.getByText("Save this reference number. You will need it to check your request.")
    ).toBeInTheDocument();
  });

  it("renders one h1 carrying the confirmation heading", () => {
    render(
      <ConfirmationPanel
        heading="Request received"
        reference="BIR-EQ-0001"
        referenceLabel="Your reference number"
        saveReferenceMessage="Save this reference number."
      />
    );
    expect(screen.getByRole("heading", { level: 1, name: "Request received" })).toBeInTheDocument();
  });

  it("emits no raw Tailwind type utility", () => {
    const { container } = render(
      <ConfirmationPanel
        heading="Request received"
        reference="BIR-EQ-0001"
        referenceLabel="Your reference number"
        saveReferenceMessage="Save this reference number."
      />
    );
    assertNoRawTypeUtility(container);
  });
});

describe("StatusLookup", () => {
  it("requires both a reference and a corroborating detail", () => {
    render(
      <StatusLookup
        heading="Check the status of a request"
        action="/do/equipment-loan/status"
        referenceLabel="Reference number"
        detailLabel="Email address you used"
        submitLabel="Check status"
      />
    );

    const reference = screen.getByLabelText("Reference number");
    const detail = screen.getByLabelText("Email address you used");
    expect(reference).toBeRequired();
    expect(detail).toBeRequired();
  });

  it("renders a real <form> with the given action, so it works with JavaScript off", () => {
    const { container } = render(
      <StatusLookup
        heading="Check the status of a request"
        action="/do/equipment-loan/status"
        referenceLabel="Reference number"
        detailLabel="Email address you used"
        submitLabel="Check status"
      />
    );
    const form = container.querySelector("form");
    expect(form).not.toBeNull();
    expect(form).toHaveAttribute("action", "/do/equipment-loan/status");
  });

  it("emits no raw Tailwind type utility", () => {
    const { container } = render(
      <StatusLookup
        heading="Check the status of a request"
        action="/do/equipment-loan/status"
        referenceLabel="Reference number"
        detailLabel="Email address you used"
        submitLabel="Check status"
      />
    );
    assertNoRawTypeUtility(container);
  });
});

describe("TaskList", () => {
  const items = [
    {
      id: "arrival",
      title: "Register your arrival",
      href: "/do/arrival-checklist/register",
      status: { label: "Not started", tone: "not-started" as const },
    },
    {
      id: "housing",
      title: "Confirm your housing",
      href: "/do/arrival-checklist/housing",
      status: { label: "Completed", tone: "completed" as const },
    },
    {
      id: "orientation",
      title: "Attend orientation",
      status: { label: "Cannot start yet", tone: "cannot-start" as const },
    },
  ];

  it("renders a status per task", () => {
    render(<TaskList heading="International arrival checklist" items={items} />);
    expect(screen.getByText("Not started")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Cannot start yet")).toBeInTheDocument();
  });

  it("renders a task with no href as plain text, not a link", () => {
    render(<TaskList heading="International arrival checklist" items={items} />);
    expect(screen.queryByRole("link", { name: /attend orientation/i })).not.toBeInTheDocument();
    expect(screen.getByText("Attend orientation")).toBeInTheDocument();
  });

  it("associates each task's link with its status for assistive technology", () => {
    render(<TaskList heading="International arrival checklist" items={items} />);
    const link = screen.getByRole("link", { name: "Register your arrival" });
    const describedById = link.getAttribute("aria-describedby");
    expect(describedById).toBeTruthy();
    expect(document.getElementById(describedById!)).toHaveTextContent("Not started");
  });

  it("emits no raw Tailwind type utility", () => {
    const { container } = render(
      <TaskList heading="International arrival checklist" items={items} />
    );
    assertNoRawTypeUtility(container);
  });
});

describe("InterruptionPage", () => {
  it("renders one h1, the boundary content, and a required way to continue", () => {
    render(
      <InterruptionPage
        heading="Before you tell us what happened"
        continueHref="/do/report-harassment/what"
        continueLabel="Continue"
        secondaryHref="/help"
        secondaryLabel="I do not want to continue"
      >
        <p>BIRSA cannot investigate criminal matters. We can refer you to someone who can.</p>
      </InterruptionPage>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Before you tell us what happened" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "BIRSA cannot investigate criminal matters. We can refer you to someone who can."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Continue" })).toHaveAttribute(
      "href",
      "/do/report-harassment/what"
    );
    expect(screen.getByRole("link", { name: "I do not want to continue" })).toHaveAttribute(
      "href",
      "/help"
    );
  });

  it("can compose ExitThisPage rather than rebuilding a leave-the-page control", () => {
    render(
      <InterruptionPage
        heading="Before you tell us what happened"
        continueHref="/do/report-harassment/what"
        continueLabel="Continue"
        exitThisPage={
          <ExitThisPage
            exitHref="https://example.org/weather"
            label="Leave this page now"
            shortcutHint="Press Shift three times to leave this page quickly."
            leavingAnnouncement="Leaving."
          />
        }
      >
        <p>Boundary content.</p>
      </InterruptionPage>
    );
    expect(screen.getByRole("link", { name: /leave this page now/i })).toBeInTheDocument();
  });

  it("emits no raw Tailwind type utility", () => {
    const { container } = render(
      <InterruptionPage
        heading="Before you tell us what happened"
        continueHref="/do/report-harassment/what"
        continueLabel="Continue"
      >
        <p>Boundary content.</p>
      </InterruptionPage>
    );
    assertNoRawTypeUtility(container);
  });
});
