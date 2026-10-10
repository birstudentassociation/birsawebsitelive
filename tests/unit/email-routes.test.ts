import { beforeEach, describe, expect, it, vi } from "vitest";

const resendState = vi.hoisted(() => ({
  result: { data: { id: "1" }, error: null } as unknown,
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: async () => resendState.result };
  },
}));

import { POST as contactPost } from "@/app/api/contact/route";
import { POST as startClubPost } from "@/app/api/start-club/route";
import { POST as rightsPost } from "@/app/api/rights-request/route";

const failure = { data: null, error: { name: "validation_error", message: "Rejected" } };

function post(body: unknown, ip: string) {
  return new Request("http://localhost/api", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

const contactBody = {
  name: "Somchai",
  email: "somchai@example.com",
  category: "question",
  subject: "Hello",
  message: "This is a long enough message.",
  nickname: "",
};

const clubBody = {
  name: "Somchai",
  email: "somchai@example.com",
  clubName: "Chess",
  description: "A club for playing chess together.",
  members: "5",
  nickname: "",
};

const rightsBody = {
  name: "Somchai",
  email: "somchai@example.com",
  right: "access",
  details: "Please send me a copy of my data.",
  nickname: "",
};

describe("form routes with Resend API errors", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "re_test";
    resendState.result = { data: { id: "1" }, error: null };
  });

  it("contact route succeeds when Resend succeeds", async () => {
    const res = await contactPost(post(contactBody, "10.0.0.1"));
    expect(res.status).toBe(200);
  });

  it("contact route returns 500 when Resend resolves with an error", async () => {
    resendState.result = failure;
    const res = await contactPost(post(contactBody, "10.0.0.2"));
    expect(res.status).toBe(500);
  });

  it("start-club route returns 500 when Resend resolves with an error", async () => {
    resendState.result = failure;
    const res = await startClubPost(post(clubBody, "10.0.0.3"));
    expect(res.status).toBe(500);
  });

  it("rights-request route returns 500 when Resend resolves with an error", async () => {
    resendState.result = failure;
    const res = await rightsPost(post(rightsBody, "10.0.0.4"));
    expect(res.status).toBe(500);
  });
});
