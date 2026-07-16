"use server";

import { headers } from "next/headers";
import { startClubSchema } from "@/lib/validation";
import { checkRateLimit } from "@/app/api/_lib/guard";
import { renderStartClub } from "@/lib/email/templates";

type StartClubField = "name" | "email" | "clubName" | "description";
/** Error codes, not messages — the form maps them to its localized copy. */
export type StartClubErrorCode = "required" | "invalid" | "short";

export type StartClubValues = {
  name: string;
  email: string;
  clubName: string;
  description: string;
  members: string;
};

export type StartClubState = {
  status: "idle" | "invalid" | "success" | "fallback" | "error";
  errors?: Partial<Record<StartClubField, StartClubErrorCode>>;
  values?: StartClubValues;
};

function ipFromHeaders(h: Headers): string {
  const first = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first || "unknown";
}

/**
 * Server action for the "start a club" form. Like the contact action, it runs
 * on a plain form POST with no JavaScript, and mirrors the JSON route handler
 * at `app/api/start-club/route.ts`. It returns error *codes* rather than
 * messages so all localized copy stays in the form component.
 */
export async function submitStartClub(
  _prev: StartClubState,
  formData: FormData,
): Promise<StartClubState> {
  const values: StartClubValues = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    clubName: String(formData.get("clubName") ?? ""),
    description: String(formData.get("description") ?? ""),
    members: String(formData.get("members") ?? ""),
  };
  const nickname = String(formData.get("nickname") ?? "");

  const h = await headers();
  if (!checkRateLimit(ipFromHeaders(h))) {
    return { status: "error", values };
  }

  // Honeypot filled — silently accept and discard, never reveal detection.
  if (nickname) {
    return { status: "success" };
  }

  const result = startClubSchema.safeParse({
    name: values.name,
    email: values.email,
    clubName: values.clubName,
    description: values.description,
    members: values.members || undefined,
    nickname,
  });

  if (!result.success) {
    const errors: Partial<Record<StartClubField, StartClubErrorCode>> = {};
    for (const issue of result.error.issues) {
      const path = issue.path[0];
      if (path === "name") errors.name = "required";
      if (path === "email") errors.email = values.email.length === 0 ? "required" : "invalid";
      if (path === "clubName") errors.clubName = "required";
      if (path === "description") {
        errors.description = values.description.length === 0 ? "required" : "short";
      }
    }
    return { status: "invalid", errors, values };
  }

  const { name, email, clubName, description, members } = result.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { status: "fallback", values };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const inbox = process.env.BIRSA_INBOX ?? "birsa@tu.ac.th";
    const from = process.env.CONTACT_FROM ?? "BIRSA Portal <onboarding@resend.dev>";

    const rendered = renderStartClub({ name, email, clubName, description, members });

    await resend.emails.send({
      from,
      to: inbox,
      replyTo: email,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
    });

    return { status: "success" };
  } catch {
    return { status: "error", values };
  }
}
