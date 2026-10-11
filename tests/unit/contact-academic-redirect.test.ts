/**
 * The contact form's academic category. BIRSA does not answer questions about
 * studies, courses or registration, the BIR office does, so choosing the
 * category sends the student to a page about the office instead of on to the
 * message step, and nothing about it is ever emailed to BIRSA, whether it
 * arrives through the form's server actions or the contact API route.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const draft = vi.hoisted(() => ({ value: {} as Record<string, unknown> }));
const sent = vi.hoisted(() => ({ emails: [] as { text: string; html: string; to: string }[] }));
const requester = vi.hoisted(() => ({ ip: "198.51.100.7" }));

vi.mock("@/components/forms/draftCookie", () => ({
  readDraft: async () => ({ ...draft.value }),
  mergeDraft: async (_cookie: string, patch: Record<string, unknown>) => {
    draft.value = { ...draft.value, ...patch };
    // The real cookie is JSON, which drops undefined, so a patch of undefined clears the key.
    draft.value = JSON.parse(JSON.stringify(draft.value));
    return draft.value;
  },
  clearDraft: async () => {
    draft.value = {};
  },
}));
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": requester.ip }),
}));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));
vi.mock("resend", () => ({
  Resend: class {
    emails = {
      send: async (message: { text: string; html: string; to: string }) => {
        sent.emails.push(message);
        return { data: { id: "1" }, error: null };
      },
    };
  },
}));

import { submitCategoryStep, submitContactCheck } from "@/app/[lang]/contact/actions";
import { POST as contactPost } from "@/app/api/contact/route";
import {
  ACADEMIC_CATEGORY,
  CONTACT_CATEGORY_VALUES,
  contactCategoryOptions,
} from "@/components/forms/contactWizardCopy";
import { CONTACT_CATEGORIES, contactSchema } from "@/lib/validation";

async function redirectOf(promise: Promise<unknown>): Promise<string | null> {
  try {
    await promise;
    return null;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    return message.startsWith("REDIRECT:") ? message.slice("REDIRECT:".length) : null;
  }
}

function categoryForm(category: string): FormData {
  const data = new FormData();
  data.append("category", category);
  return data;
}

function chooseCategory(locale: "en" | "th", category: string) {
  return redirectOf(
    submitCategoryStep(locale, undefined, { status: "idle" }, categoryForm(category))
  );
}

let counter = 0;

beforeEach(() => {
  draft.value = {};
  sent.emails = [];
  counter += 1;
  requester.ip = `203.0.113.${counter}`;
  vi.stubEnv("RESEND_API_KEY", "re_test");
});

describe("the academic category's place in the form", () => {
  it("is one of the options, in both languages, before 'something else'", () => {
    for (const locale of ["en", "th"] as const) {
      const options = contactCategoryOptions(locale);
      const values = options.map((o) => o.value);
      expect(values).toContain(ACADEMIC_CATEGORY);
      expect(values.indexOf(ACADEMIC_CATEGORY)).toBeLessThan(values.indexOf("other"));
    }
  });

  it("is named plainly, so a student looking for help with courses finds it", () => {
    const label = (locale: "en" | "th") =>
      contactCategoryOptions(locale).find((o) => o.value === ACADEMIC_CATEGORY)!.label;
    expect(label("en")).toBe("Studies, courses and registration");
    expect(label("th")).toBe("การเรียน รายวิชา และการลงทะเบียน");
    expect(label("en")).not.toMatch(/Academic Affairs/);
  });

  it("is not a category a message can be sent about", () => {
    expect(CONTACT_CATEGORIES).not.toContain(ACADEMIC_CATEGORY);
    const base = {
      name: "Somchai",
      email: "somchai@example.com",
      subject: "Subject",
      message: "A message that is long enough.",
    };
    expect(contactSchema.safeParse({ ...base, category: ACADEMIC_CATEGORY }).success).toBe(false);
    for (const category of CONTACT_CATEGORIES) {
      expect(contactSchema.safeParse({ ...base, category }).success, category).toBe(true);
    }
  });

  it("is the only option the schema does not accept", () => {
    const sendable = new Set<string>(CONTACT_CATEGORIES);
    expect(CONTACT_CATEGORY_VALUES.filter((value) => !sendable.has(value))).toEqual([
      ACADEMIC_CATEGORY,
    ]);
  });
});

describe("choosing the academic category", () => {
  it("sends the student to the BIR office page, not on to the subject step", async () => {
    expect(await chooseCategory("en", "academic")).toBe("/en/contact/academic");
    expect(await chooseCategory("th", "academic")).toBe("/th/contact/academic");
  });

  it("goes to the same page when the student came back from the check step to change it", async () => {
    const target = await redirectOf(
      submitCategoryStep("en", "check", { status: "idle" }, categoryForm("academic"))
    );
    expect(target).toBe("/en/contact/academic");
  });

  it("writes nothing to the draft, so there is no message to send later", async () => {
    draft.value = { name: "Somchai", email: "somchai@example.com" };
    await chooseCategory("en", "academic");
    expect(draft.value).toEqual({ name: "Somchai", email: "somchai@example.com" });
    expect(sent.emails).toEqual([]);
  });

  it("leaves the other categories alone: they carry on to the subject step", async () => {
    for (const category of CONTACT_CATEGORIES) {
      draft.value = {};
      expect(await chooseCategory("en", category), category).toBe("/en/contact/subject");
      expect(draft.value.category).toBe(category);
    }
  });
});

describe("a draft left with the academic category", () => {
  const complete = {
    category: "academic",
    subject: "Which elective can I take?",
    message: "Can I take PI364 in year 2 if I pass PI280 this summer?",
    name: "Somchai",
    email: "somchai@example.com",
  };

  function checkForm(): FormData {
    const data = new FormData();
    data.append("nickname", "");
    return data;
  }

  it("is sent to the BIR office page at the check step, and nothing is emailed", async () => {
    draft.value = { ...complete };
    const target = await redirectOf(submitContactCheck("en", { status: "idle" }, checkForm()));
    expect(target).toBe("/en/contact/academic");
    expect(sent.emails).toEqual([]);
  });

  it("does the same in Thai, and when email is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    draft.value = { ...complete };
    const target = await redirectOf(submitContactCheck("th", { status: "idle" }, checkForm()));
    expect(target).toBe("/th/contact/academic");
    expect(sent.emails).toEqual([]);
  });

  it("still sends a message about any other category to BIRSA's inbox", async () => {
    draft.value = { ...complete, category: "question" };
    const result = await submitContactCheck("en", { status: "idle" }, checkForm());
    expect(result).toEqual({ status: "success" });
    expect(sent.emails).toHaveLength(1);
    expect(sent.emails[0]!.text).toContain("Category: A question");
  });
});

describe("the contact API route", () => {
  function post(body: unknown): Request {
    return new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": requester.ip },
      body: JSON.stringify(body),
    });
  }

  const body = {
    name: "Somchai",
    email: "somchai@example.com",
    category: "academic",
    subject: "Which elective can I take?",
    message: "Can I take PI364 in year 2 if I pass PI280 this summer?",
    nickname: "",
  };

  it("refuses the academic category, says where to take it, and emails nothing", async () => {
    const response = await contactPost(post(body));
    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({
      ok: false,
      reason: "academic",
      contact: { email: "bir@tu.ac.th", url: "https://www.birpolsci.com" },
    });
    expect(sent.emails).toEqual([]);
  });

  it("refuses it before any email is configured too", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const response = await contactPost(post(body));
    expect(response.status).toBe(422);
  });

  it("still sends a message about any other category", async () => {
    const response = await contactPost(post({ ...body, category: "problem" }));
    expect(response.status).toBe(200);
    expect(sent.emails).toHaveLength(1);
    expect(sent.emails[0]!.text).toContain("A problem to report");
  });

  it("rejects a category it does not know with a field error, as before", async () => {
    const response = await contactPost(post({ ...body, category: "billing" }));
    expect(response.status).toBe(400);
    expect(sent.emails).toEqual([]);
  });
});
