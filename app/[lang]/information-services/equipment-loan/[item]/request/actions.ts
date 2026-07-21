"use server";

import { headers } from "next/headers";
import { inventoryLoanRequestSchema } from "@/lib/validation";
import { checkRateLimit } from "@/app/api/_lib/guard";
import { createLoanRequest } from "@/lib/inventory/loans";
import { getItemByKey } from "@/lib/inventory/items";
import { renderOfficerNewRequest } from "@/lib/email/templates";

export type LoanFieldName =
  "studentName" | "studentId" | "studentEmail" | "phone" | "startDate" | "endDate";

/** Error codes (not messages): the form maps them to its localized labels. */
export type LoanFieldErrorCode =
  | "nameRequired"
  | "idRequired"
  | "emailRequired"
  | "emailInvalid"
  | "phoneInvalid"
  | "startRequired"
  | "startInvalid"
  | "startPast"
  | "endRequired"
  | "endInvalid"
  | "endBeforeStart"
  | "tooLong";

export type LoanValues = {
  studentName: string;
  studentId: string;
  studentEmail: string;
  phone: string;
  startDate: string;
  endDate: string;
  reason: string;
};

export type LoanRequestState =
  | { status: "idle" }
  | {
      status: "invalid";
      errors: Partial<Record<LoanFieldName, LoanFieldErrorCode>>;
      values: LoanValues;
    }
  | { status: "success"; reference: string }
  | {
      status:
        | "unavailable"
        | "blocklisted"
        | "limit-exceeded"
        | "not-configured"
        | "rate-limited"
        | "error";
      values?: LoanValues;
    };

function ipFromHeaders(h: Headers): string {
  const first = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first || "unknown";
}

function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Server action behind the equipment-loan request form's no-JavaScript path.
 * It mirrors `app/api/loans/request/route.ts` (rate limit, honeypot, shared
 * schema, `createLoanRequest`, best-effort officer email) and additionally
 * re-checks the date rules the wizard normally enforces client-side (not in the
 * past, within the item's max loan length), returning error codes the form maps
 * to labels. The interactive wizard keeps using the JSON API when JS is on.
 */
export async function submitLoanRequest(
  _prev: LoanRequestState,
  formData: FormData
): Promise<LoanRequestState> {
  const itemKey = String(formData.get("itemKey") ?? "");
  const values: LoanValues = {
    studentName: String(formData.get("studentName") ?? "").trim(),
    studentId: String(formData.get("studentId") ?? "").trim(),
    studentEmail: String(formData.get("studentEmail") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    reason: String(formData.get("reason") ?? "").trim(),
  };
  const nickname = String(formData.get("nickname") ?? "");

  const h = await headers();
  if (!checkRateLimit(ipFromHeaders(h), "loan-request")) {
    return { status: "rate-limited", values };
  }

  // Honeypot filled: silently accept and discard, never reveal detection.
  if (nickname) {
    return { status: "success", reference: "" };
  }

  const item = await getItemByKey(itemKey);
  if (!item || item.isRetired) {
    return { status: "error", values };
  }

  const errors: Partial<Record<LoanFieldName, LoanFieldErrorCode>> = {};
  if (!values.studentName) errors.studentName = "nameRequired";
  if (!values.studentId) errors.studentId = "idRequired";
  if (!values.studentEmail) errors.studentEmail = "emailRequired";
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.studentEmail))
    errors.studentEmail = "emailInvalid";

  if (!values.startDate) errors.startDate = "startRequired";
  else if (!ISO_DATE.test(values.startDate)) errors.startDate = "startInvalid";
  else if (values.startDate < todayISO()) errors.startDate = "startPast";

  if (!values.endDate) errors.endDate = "endRequired";
  else if (!ISO_DATE.test(values.endDate)) errors.endDate = "endInvalid";
  else if (values.startDate && values.endDate < values.startDate) errors.endDate = "endBeforeStart";
  else if (values.startDate && values.endDate > addDaysISO(values.startDate, item.maxLoanDays)) {
    errors.endDate = "tooLong";
  }

  if (Object.keys(errors).length > 0) {
    return { status: "invalid", errors, values };
  }

  // Final shared-schema check (defence in depth; mirrors the JSON route).
  const parsed = inventoryLoanRequestSchema.safeParse({
    itemKey,
    studentName: values.studentName,
    studentId: values.studentId,
    studentEmail: values.studentEmail,
    phone: values.phone || undefined,
    startDate: values.startDate,
    endDate: values.endDate,
    reason: values.reason || undefined,
    nickname,
  });
  if (!parsed.success) {
    return { status: "error", values };
  }

  const created = await createLoanRequest({
    itemKey,
    startDate: values.startDate,
    endDate: values.endDate,
    reason: values.reason || null,
    borrower: {
      tuStudentId: values.studentId,
      name: values.studentName,
      email: values.studentEmail,
      phone: values.phone || null,
    },
  });

  if (!created.ok) {
    switch (created.reason) {
      case "not-configured":
        return { status: "not-configured", values };
      case "unavailable":
        return { status: "unavailable", values };
      case "blocklisted":
        return { status: "blocklisted", values };
      case "limit-exceeded":
        return { status: "limit-exceeded", values };
      default:
        return { status: "error", values };
    }
  }

  // Best-effort officer notification email; never blocks the response.
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const inbox = process.env.BIRSA_INBOX ?? "birsa@tu.ac.th";
      const from = process.env.CONTACT_FROM ?? "BIRSA Portal <onboarding@resend.dev>";

      const email = renderOfficerNewRequest({
        itemNameEn: item.name.en,
        itemNameTh: item.name.th ?? item.name.en,
        reference: created.reference,
        studentName: values.studentName,
        studentId: values.studentId,
        studentEmail: values.studentEmail,
        startDate: values.startDate,
        endDate: values.endDate,
        reason: values.reason || undefined,
      });

      await resend.emails.send({
        from,
        to: inbox,
        replyTo: values.studentEmail,
        subject: email.subject,
        html: email.html,
        text: email.text,
      });
    } catch {
      // Notification email is optional; the request itself already succeeded.
    }
  }

  return { status: "success", reference: created.reference };
}
