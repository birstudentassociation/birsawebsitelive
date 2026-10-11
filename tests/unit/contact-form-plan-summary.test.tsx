// @vitest-environment jsdom
/**
 * The check step of the contact journey, when the message was started from the
 * study plan screen: the plan summary is in a box the student can read, edit
 * or empty, and what the form posts is what is in that box.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import ContactForm from "@/components/forms/ContactForm";
import { buildPlanOutreachCopy } from "@/components/study-plan/planOutreachCopy";
import { getDictionary } from "@/lib/i18n";
import type { CheckState, ContactDraft } from "@/app/[lang]/contact/actions";

const dict = getDictionary("en");

const draft: ContactDraft = {
  category: "academic",
  subject: "Question about my study plan",
  message: "Can I take PI364 in year 2?",
  name: "Somchai",
  email: "somchai@example.com",
  planSummary: "Year 2, Semester 1: PI300, PI364 (6 credits)",
};

function renderForm(overrides: {
  draft?: ContactDraft;
  action?: (prev: CheckState, data: FormData) => Promise<CheckState>;
  attach?: boolean;
}) {
  return render(
    <ContactForm
      locale="en"
      dict={dict}
      draft={overrides.draft ?? draft}
      action={overrides.action ?? (async () => ({ status: "idle" }))}
      feedbackAction={async () => ({ status: "idle" }) as never}
      categoryLabel="What this is about"
      subjectLabel="Subject"
      messageLabel="Message"
      nameLabel="Name"
      emailLabel="Email address"
      changeLabel="Change"
      submitLabel="Send"
      submittingLabel="Sending"
      planSummaryField={overrides.attach === false ? undefined : buildPlanOutreachCopy("en").attach}
    />
  );
}

afterEach(() => cleanup());

describe("the plan summary on the check step", () => {
  it("shows the summary in an editable box with a hint that it can be deleted", () => {
    const { getByLabelText, container } = renderForm({});
    const box = getByLabelText("Study plan summary") as HTMLTextAreaElement;
    expect(box.tagName).toBe("TEXTAREA");
    expect(box.name).toBe("planSummary");
    expect(box.readOnly).toBe(false);
    expect(box.value).toBe(draft.planSummary);
    expect(container.textContent).toContain("delete all of it to send your message without it");
  });

  it("is absent when the message did not start from the plan", () => {
    const { container } = renderForm({ draft: { ...draft, planSummary: undefined } });
    expect(container.querySelector('textarea[name="planSummary"]')).toBeNull();
    expect(container.textContent).not.toContain("Study plan summary");
  });

  it("posts what is in the box, edited or emptied, and never what was drafted", async () => {
    const action = vi.fn(async (_prev: CheckState, data: FormData) => {
      void data;
      return { status: "idle" } as CheckState;
    });
    const { getByLabelText, container } = renderForm({ action });
    const box = getByLabelText("Study plan summary") as HTMLTextAreaElement;

    fireEvent.change(box, { target: { value: "Only year 2." } });
    await act(async () => {
      fireEvent.submit(container.querySelector("form")!);
    });
    expect((action.mock.calls[0]![1] as FormData).get("planSummary")).toBe("Only year 2.");

    fireEvent.change(box, { target: { value: "" } });
    await act(async () => {
      fireEvent.submit(container.querySelector("form")!);
    });
    expect((action.mock.calls[1]![1] as FormData).get("planSummary")).toBe("");
  });

  it("is in Thai for a Thai reader", () => {
    const th = buildPlanOutreachCopy("th").attach;
    const { getByLabelText } = render(
      <ContactForm
        locale="th"
        dict={getDictionary("th")}
        draft={draft}
        action={async () => ({ status: "idle" })}
        feedbackAction={async () => ({ status: "idle" }) as never}
        categoryLabel="เรื่องที่ติดต่อ"
        subjectLabel="หัวข้อ"
        messageLabel="ข้อความ"
        nameLabel="ชื่อ"
        emailLabel="อีเมล"
        changeLabel="แก้ไข"
        submitLabel="ส่ง"
        submittingLabel="กำลังส่ง"
        planSummaryField={th}
      />
    );
    expect(getByLabelText("สรุปแผนการศึกษา")).toBeTruthy();
  });

  it("includes the summary in the copy-it-yourself text when email is not configured", async () => {
    const action = async (): Promise<CheckState> => ({
      status: "fallback",
      draft: { ...draft, planSummary: "The edited summary" },
    });
    const { container, findByDisplayValue } = renderForm({ action });
    await act(async () => {
      fireEvent.submit(container.querySelector("form")!);
    });
    const copyBox = (await findByDisplayValue(/Can I take PI364/)) as HTMLTextAreaElement;
    expect(copyBox.value).toContain("The edited summary");
  });
});
