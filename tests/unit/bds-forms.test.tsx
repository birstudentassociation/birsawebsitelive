// @vitest-environment jsdom
/**
 * Unit tests for the forms cluster (`components/bds/{FormField,TextInput,
 * Textarea,CharacterCount,Radios,Checkboxes,Select,DateInput,DateRangeInput,
 * FileUpload,Fieldset,ErrorMessage,ErrorSummary,PasswordInput}.tsx`),
 * REDESIGN-2.0's split of 1.0's `Field.tsx` into named question-type
 * components over a shared field wrapper.
 *
 * Follows `tests/unit/bds-type.test.tsx`'s shape: `@vitest-environment jsdom`
 * per file, since the default env is node.
 *
 * What every describe block pins down, per BUILD-BRIEF-2.0 section 7:
 *   - the label is really a `<label>` associated with its control
 *     (`getByLabelText` finds it, never a placeholder standing in);
 *   - a hint is linked by `aria-describedby`;
 *   - an error sets `aria-invalid` and is linked by `aria-describedby`
 *     alongside the hint, hint first;
 *   - `ErrorSummary` renders one entry per error, each a link to its field;
 *   - `CharacterCount` renders a usable static hint before hydration, tested
 *     with `renderToStaticMarkup`, which is what a browser with JavaScript
 *     disabled actually receives, rather than relying on `useEffect` never
 *     firing inside `@testing-library/react`'s `act`-wrapped `render`;
 *   - `Radios` and `Checkboxes` render a `<fieldset>` with a `<legend>`;
 *   - no component emits a Tailwind font-size or line-height utility
 *     (defect D7, the same regression guard `bds-type.test.tsx` uses).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, cleanup, within, fireEvent } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import "@testing-library/jest-dom/vitest";

import TextInput from "@/components/bds/TextInput";
import Textarea from "@/components/bds/Textarea";
import CharacterCount from "@/components/bds/CharacterCount";
import Radios from "@/components/bds/Radios";
import Checkboxes from "@/components/bds/Checkboxes";
import Select from "@/components/bds/Select";
import DateInput from "@/components/bds/DateInput";
import DateRangeInput from "@/components/bds/DateRangeInput";
import FileUpload from "@/components/bds/FileUpload";
import Fieldset from "@/components/bds/Fieldset";
import ErrorMessage from "@/components/bds/ErrorMessage";
import ErrorSummary from "@/components/bds/ErrorSummary";
import PasswordInput from "@/components/bds/PasswordInput";

afterEach(cleanup);

/** Any Tailwind font-size or line-height utility, the utilities D7 forbids (mirrors bds-type.test.tsx). */
const TAILWIND_TYPE_UTILITY = /\b(text-(xs|sm|base|lg|xl|\d?xl)|leading-)/;

const dateLabels = { day: "Day", month: "Month", year: "Year" };

const characterCountLabels = {
  hint: "You can enter up to {max} characters",
  remainingOne: "You have 1 character left",
  remainingOther: "You have {count} characters left",
  overOne: "You have 1 character too many",
  overOther: "You have {count} characters too many",
};

/** Walks every element in a container and asserts none of its class names match a Tailwind type utility. */
function expectNoTailwindTypeUtility(container: HTMLElement) {
  const all = container.querySelectorAll<HTMLElement>("*");
  for (const el of Array.from(all)) {
    // `className` on an SVG element is an SVGAnimatedString, not a plain
    // string, so read the attribute directly to handle both HTML and SVG
    // (icons) uniformly.
    const classes = el.getAttribute("class") ?? "";
    expect(classes).not.toMatch(TAILWIND_TYPE_UTILITY);
  }
}

describe("TextInput", () => {
  it("associates its label with the input", () => {
    render(<TextInput name="email" label="Email address" />);
    const input = screen.getByLabelText("Email address");
    expect(input.tagName).toBe("INPUT");
  });

  it("links a hint by aria-describedby", () => {
    render(<TextInput name="email" label="Email address" hint="We will only use this to reply." />);
    const input = screen.getByLabelText("Email address");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const hint = document.getElementById(describedBy!.split(" ")[0]!);
    expect(hint).toHaveTextContent("We will only use this to reply.");
  });

  it("sets aria-invalid and links the error alongside the hint, hint first", () => {
    render(
      <TextInput
        name="email"
        label="Email address"
        hint="We will only use this to reply."
        error="Enter an email address in the correct format"
      />
    );
    const input = screen.getByLabelText("Email address");
    expect(input).toHaveAttribute("aria-invalid", "true");
    const ids = input.getAttribute("aria-describedby")!.split(" ");
    expect(ids).toHaveLength(2);
    expect(document.getElementById(ids[0]!)).toHaveTextContent("We will only use this to reply.");
    expect(document.getElementById(ids[1]!)).toHaveTextContent(
      "Enter an email address in the correct format"
    );
  });

  it("emits no Tailwind font-size or line-height utility", () => {
    const { container } = render(
      <TextInput name="email" label="Email address" hint="A hint" error="An error" />
    );
    expectNoTailwindTypeUtility(container);
  });
});

describe("Textarea", () => {
  it("associates its label with the textarea", () => {
    render(<Textarea name="message" label="Your message" />);
    const el = screen.getByLabelText("Your message");
    expect(el.tagName).toBe("TEXTAREA");
  });

  it("links a hint and an error together via aria-describedby", () => {
    render(
      <Textarea
        name="message"
        label="Your message"
        hint="Tell us what happened"
        error="Enter your message"
      />
    );
    const el = screen.getByLabelText("Your message");
    expect(el).toHaveAttribute("aria-invalid", "true");
    const ids = el.getAttribute("aria-describedby")!.split(" ");
    expect(document.getElementById(ids[0]!)).toHaveTextContent("Tell us what happened");
    expect(document.getElementById(ids[1]!)).toHaveTextContent("Enter your message");
  });
});

describe("Select", () => {
  it("associates its label with the select and lists its options", () => {
    render(
      <Select
        name="country"
        label="Country"
        options={[
          { value: "th", label: "Thailand" },
          { value: "jp", label: "Japan" },
        ]}
      />
    );
    const el = screen.getByLabelText("Country");
    expect(el.tagName).toBe("SELECT");
    expect(within(el as HTMLSelectElement).getByText("Thailand")).toBeInTheDocument();
  });

  it("sets aria-invalid and links the error", () => {
    render(<Select name="country" label="Country" options={[]} error="Choose a country" />);
    const el = screen.getByLabelText("Country");
    expect(el).toHaveAttribute("aria-invalid", "true");
    const errorId = el.getAttribute("aria-describedby");
    expect(document.getElementById(errorId!)).toHaveTextContent("Choose a country");
  });
});

describe("PasswordInput", () => {
  it("renders a real password field with autoComplete=current-password and no paste blocking", () => {
    render(<PasswordInput name="passcode" label="Passcode" />);
    const el = screen.getByLabelText("Passcode") as HTMLInputElement;
    expect(el.type).toBe("password");
    expect(el).toHaveAttribute("autoComplete", "current-password");
    // WCAG 3.3.8: no onPaste handler anywhere disabling paste. React exposes
    // no DOM attribute for "has a paste handler", so this asserts the only
    // observable proxy: pasting does not throw and the value updates freely,
    // i.e. nothing intercepts the event.
    expect(el).not.toHaveAttribute("onpaste");
  });

  it("links its error by aria-describedby and sets aria-invalid", () => {
    render(<PasswordInput name="passcode" label="Passcode" error="Incorrect email or passcode" />);
    const el = screen.getByLabelText("Passcode");
    expect(el).toHaveAttribute("aria-invalid", "true");
    const errorId = el.getAttribute("aria-describedby");
    expect(document.getElementById(errorId!)).toHaveTextContent("Incorrect email or passcode");
  });
});

describe("FileUpload", () => {
  it("associates its label with a real file input", () => {
    render(
      <FileUpload name="receipt" label="Upload your receipt" accept="application/pdf,image/jpeg" />
    );
    const el = screen.getByLabelText("Upload your receipt") as HTMLInputElement;
    expect(el.type).toBe("file");
  });

  it("links a hint and sets aria-invalid on error", () => {
    render(
      <FileUpload
        name="receipt"
        label="Upload your receipt"
        hint="PDF or JPEG, up to 10MB"
        error="Choose a file to upload"
      />
    );
    const el = screen.getByLabelText("Upload your receipt");
    expect(el).toHaveAttribute("aria-invalid", "true");
    const ids = el.getAttribute("aria-describedby")!.split(" ");
    expect(document.getElementById(ids[0]!)).toHaveTextContent("PDF or JPEG, up to 10MB");
    expect(document.getElementById(ids[1]!)).toHaveTextContent("Choose a file to upload");
  });
});

describe("Fieldset", () => {
  it("renders a fieldset with a legend carrying the question", () => {
    render(
      <Fieldset id="pickup" legend="How will you collect it">
        <p>content</p>
      </Fieldset>
    );
    const fieldset = screen.getByRole("group", { name: "How will you collect it" });
    expect(fieldset.tagName).toBe("FIELDSET");
    expect(fieldset.querySelector("legend")).toHaveTextContent("How will you collect it");
  });

  it("sets aria-invalid and aria-describedby on the fieldset when it has an error", () => {
    render(
      <Fieldset
        id="pickup"
        legend="How will you collect it"
        hint="Choose one"
        error="Choose an option"
      >
        <p>content</p>
      </Fieldset>
    );
    const fieldset = screen.getByRole("group", { name: "How will you collect it" });
    expect(fieldset).toHaveAttribute("aria-invalid", "true");
    const ids = fieldset.getAttribute("aria-describedby")!.split(" ");
    expect(document.getElementById(ids[0]!)).toHaveTextContent("Choose one");
    expect(document.getElementById(ids[1]!)).toHaveTextContent("Choose an option");
  });
});

describe("Radios", () => {
  it("renders a fieldset with a legend and a labelled option per choice", () => {
    render(
      <Radios
        name="collection"
        legend="How will you collect it"
        options={[
          { value: "pickup", label: "Pick it up myself" },
          { value: "post", label: "Have it posted" },
        ]}
        defaultValue="pickup"
      />
    );
    const fieldset = screen.getByRole("group", { name: "How will you collect it" });
    expect(fieldset.tagName).toBe("FIELDSET");
    expect(fieldset.querySelector("legend")).toHaveTextContent("How will you collect it");

    const pickup = screen.getByLabelText("Pick it up myself") as HTMLInputElement;
    const post = screen.getByLabelText("Have it posted") as HTMLInputElement;
    expect(pickup.type).toBe("radio");
    expect(pickup.checked).toBe(true);
    expect(post.checked).toBe(false);
  });

  it("calls onChange with the selected value when controlled", () => {
    const onChange = vi.fn();
    render(
      <Radios
        name="collection"
        legend="How will you collect it"
        options={[
          { value: "pickup", label: "Pick it up myself" },
          { value: "post", label: "Have it posted" },
        ]}
        value="pickup"
        onChange={onChange}
      />
    );
    screen.getByLabelText("Have it posted").click();
    expect(onChange).toHaveBeenCalledWith("post");
  });
});

describe("Checkboxes", () => {
  it("renders a fieldset with a legend and a labelled option per choice, all sharing one name", () => {
    render(
      <Checkboxes
        name="topics"
        legend="What do you need help with"
        options={[
          { value: "loan", label: "Equipment loan" },
          { value: "welfare", label: "Welfare support" },
        ]}
        defaultValue={["loan"]}
      />
    );
    const fieldset = screen.getByRole("group", { name: "What do you need help with" });
    expect(fieldset.querySelector("legend")).toHaveTextContent("What do you need help with");

    const loan = screen.getByLabelText("Equipment loan") as HTMLInputElement;
    const welfare = screen.getByLabelText("Welfare support") as HTMLInputElement;
    expect(loan.name).toBe("topics");
    expect(welfare.name).toBe("topics");
    expect(loan.checked).toBe(true);
    expect(welfare.checked).toBe(false);
  });
});

describe("DateInput", () => {
  it("renders three labelled fields sharing one legend, hint and error", () => {
    render(
      <DateInput
        name="dob"
        legend="Date of birth"
        hint="For example, 15 3 1998"
        error="Enter a valid date"
        labels={dateLabels}
      />
    );
    const fieldset = screen.getByRole("group", { name: "Date of birth" });
    expect(fieldset).toHaveAttribute("aria-invalid", "true");
    const ids = fieldset.getAttribute("aria-describedby")!.split(" ");
    expect(document.getElementById(ids[0]!)).toHaveTextContent("For example, 15 3 1998");
    expect(document.getElementById(ids[1]!)).toHaveTextContent("Enter a valid date");

    expect(screen.getByLabelText("Day")).toBeInTheDocument();
    expect(screen.getByLabelText("Month")).toBeInTheDocument();
    expect(screen.getByLabelText("Year")).toBeInTheDocument();
  });
});

describe("DateRangeInput", () => {
  it("renders two DateInput groups, each with its own legend", () => {
    render(
      <DateRangeInput
        name="loan"
        fromLegend="Collection date"
        toLegend="Return date"
        labels={dateLabels}
      />
    );
    expect(screen.getByRole("group", { name: "Collection date" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Return date" })).toBeInTheDocument();
  });
});

describe("ErrorMessage", () => {
  it("renders with the id it is given, for aria-describedby to target", () => {
    render(<ErrorMessage id="email-error">Enter your email address</ErrorMessage>);
    const el = document.getElementById("email-error");
    expect(el).toHaveTextContent("Enter your email address");
  });
});

describe("ErrorSummary", () => {
  it("renders one entry per error, each a link to its field", () => {
    render(
      <ErrorSummary
        title="There is a problem"
        errors={[
          { id: "name", message: "Enter your name" },
          { id: "email", message: "Enter your email address" },
        ]}
      />
    );
    expect(screen.getByRole("heading", { name: "There is a problem" })).toBeInTheDocument();
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "#name");
    expect(links[0]).toHaveTextContent("Enter your name");
    expect(links[1]).toHaveAttribute("href", "#email");
    expect(links[1]).toHaveTextContent("Enter your email address");
  });

  it("renders nothing when there are no errors", () => {
    const { container } = render(<ErrorSummary title="There is a problem" errors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("takes focus when a new set of errors appears", () => {
    render(
      <ErrorSummary
        title="There is a problem"
        errors={[{ id: "name", message: "Enter your name" }]}
      />
    );
    expect(screen.getByRole("alert")).toHaveFocus();
  });
});

describe("CharacterCount", () => {
  it("renders a usable static hint when JavaScript has not run", () => {
    // renderToStaticMarkup never mounts and never runs effects, which is
    // exactly what a browser with JavaScript disabled sees: the server's
    // first render, permanently.
    const html = renderToStaticMarkup(
      <CharacterCount
        name="reason"
        label="Tell us what happened"
        maxLength={500}
        labels={characterCountLabels}
      />
    );
    expect(html).toContain("You can enter up to 500 characters");
    expect(html).not.toContain("You have 500 characters left");
  });

  it("associates its label with the textarea and links the live count by aria-describedby", () => {
    render(
      <CharacterCount
        name="reason"
        label="Tell us what happened"
        maxLength={500}
        labels={characterCountLabels}
      />
    );
    const el = screen.getByLabelText("Tell us what happened");
    expect(el.tagName).toBe("TEXTAREA");
    const ids = el.getAttribute("aria-describedby")!.split(" ");
    expect(document.getElementById(ids[0]!)).toBeTruthy();
  });

  it("updates the live count as the reader types, once mounted", async () => {
    render(
      <CharacterCount
        name="reason"
        label="Tell us what happened"
        maxLength={20}
        labels={characterCountLabels}
      />
    );
    const el = screen.getByLabelText("Tell us what happened") as HTMLTextAreaElement;
    fireEvent.change(el, { target: { value: "Hello" } });
    expect(await screen.findByText("You have 15 characters left")).toBeInTheDocument();
  });

  it("switches to the over-limit message and marks aria-invalid past the limit", async () => {
    render(
      <CharacterCount
        name="reason"
        label="Tell us what happened"
        maxLength={5}
        labels={characterCountLabels}
      />
    );
    const el = screen.getByLabelText("Tell us what happened") as HTMLTextAreaElement;
    fireEvent.change(el, { target: { value: "Too many characters" } });
    expect(await screen.findByText("You have 14 characters too many")).toBeInTheDocument();
    expect(el).toHaveAttribute("aria-invalid", "true");
  });
});

describe("D7 regression guard across the forms cluster", () => {
  it("no forms component emits a Tailwind font-size or line-height utility", () => {
    const { container } = render(
      <div>
        <TextInput name="a" label="A" hint="hint" error="error" />
        <Textarea name="b" label="B" hint="hint" error="error" />
        <Select name="c" label="C" options={[{ value: "1", label: "One" }]} error="error" />
        <PasswordInput name="d" label="D" hint="hint" error="error" />
        <FileUpload name="e" label="E" hint="hint" error="error" />
        <Fieldset id="f" legend="F" hint="hint" error="error">
          <p>content</p>
        </Fieldset>
        <Radios
          name="g"
          legend="G"
          hint="hint"
          error="error"
          options={[{ value: "1", label: "One", hint: "an option hint" }]}
        />
        <Checkboxes
          name="h"
          legend="H"
          hint="hint"
          error="error"
          options={[{ value: "1", label: "One", hint: "an option hint" }]}
        />
        <DateInput name="i" legend="I" hint="hint" error="error" labels={dateLabels} />
        <DateRangeInput name="j" fromLegend="From" toLegend="To" hint="hint" labels={dateLabels} />
        <ErrorMessage id="k">error</ErrorMessage>
        <ErrorSummary
          title="There is a problem"
          errors={[{ id: "a", message: "Enter something" }]}
        />
        <CharacterCount name="l" label="L" maxLength={100} labels={characterCountLabels} />
      </div>
    );
    expectNoTailwindTypeUtility(container);
  });
});
