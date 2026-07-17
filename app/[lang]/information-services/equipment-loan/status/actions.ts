"use server";

import { headers } from "next/headers";
import { loanLookupSchema } from "@/lib/validation";
import { checkRateLimit } from "@/app/api/_lib/guard";
import { getLoanByReferenceAndEmail } from "@/lib/inventory/loans";
import { getItem } from "@/lib/inventory/items";
import type { LoanStatus } from "@/lib/inventory/types";

export type LoanLookupResult = {
  reference: string;
  status: LoanStatus;
  startDate: string;
  endDate: string;
  itemName: { en: string; th: string } | null;
};

export type LoanLookupState =
  | { status: "idle" }
  | {
      status: "invalid";
      errors: { reference?: "required"; email?: "required" | "invalid" };
      values: { reference: string; email: string };
    }
  | { status: "not-found" }
  | { status: "rate-limited" }
  | { status: "error" }
  | { status: "success"; loan: LoanLookupResult };

function ipFromHeaders(h: Headers): string {
  const first = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first || "unknown";
}

/**
 * Server action behind the no-JavaScript "check a loan request" form. Mirrors
 * `app/api/loans/lookup/route.ts` (rate limit, honeypot, shared schema, generic
 * not-found to avoid reference enumeration). The email is sent by POST, never in
 * the URL, so no personal data ends up in a query string.
 */
export async function submitLoanLookup(
  _prev: LoanLookupState,
  formData: FormData,
): Promise<LoanLookupState> {
  const values = {
    reference: String(formData.get("reference") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
  };
  const nickname = String(formData.get("nickname") ?? "");

  const h = await headers();
  if (!checkRateLimit(ipFromHeaders(h))) {
    return { status: "rate-limited" };
  }

  // Honeypot filled: behave exactly like a miss, never reveal detection.
  if (nickname) {
    return { status: "not-found" };
  }

  const parsed = loanLookupSchema.safeParse({ ...values, nickname });
  if (!parsed.success) {
    const errors: { reference?: "required"; email?: "required" | "invalid" } = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path[0];
      if (path === "reference") errors.reference = "required";
      if (path === "email") errors.email = values.email.length === 0 ? "required" : "invalid";
    }
    return { status: "invalid", errors, values };
  }

  try {
    const loan = await getLoanByReferenceAndEmail(parsed.data.reference, parsed.data.email);
    if (!loan) {
      // Generic response to avoid enumeration of valid references.
      return { status: "not-found" };
    }

    const item = await getItem(loan.itemId);

    return {
      status: "success",
      loan: {
        reference: loan.reference,
        status: loan.status,
        startDate: loan.startDate,
        endDate: loan.endDate,
        itemName: item ? { en: item.name.en, th: item.name.th } : null,
      },
    };
  } catch {
    return { status: "error" };
  }
}
