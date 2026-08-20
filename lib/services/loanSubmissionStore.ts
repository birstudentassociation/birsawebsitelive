/**
 * The equipment loan's `SubmissionStore` (Wave 4B, REDESIGN-2.0 §11.4).
 *
 * `lib/services/intake.ts`'s own header names this exact seam and says
 * plainly that "a real service needs a migration and a store backed by it
 * before it can go live." The equipment loan already has that: `loans` and
 * `borrowers` in Postgres, behind `lib/inventory/loans.ts` and
 * `lib/inventory/borrowers.ts`. This file is the seam filled in against
 * that existing database, reusing `createLoanRequest`, `listLoans` and
 * `getBorrower` exactly as written. IT DOES NOT WRITE ANY NEW SQL, ADD ANY
 * TABLE, OR RE-IMPLEMENT ANY BUSINESS RULE (the blocklist check, the
 * concurrent-loan limit, the availability check, the max-loan-length check):
 * every one of those still lives in and runs from `createLoanRequest`
 * itself.
 *
 * THREE REAL FINDINGS SIT IN THIS FILE, not smoothed over, because the brief
 * for this wave asked for exactly that when the seam's shape does not fit.
 *
 * 1. NOT WIRED IN. `app/[lang]/do/actions.ts` (Wave 4A, frozen, not owned by
 *    this wave) calls `getSubmissionStore()` unconditionally, for every
 *    service, with no field on `ServiceDefinition` and no other mechanism
 *    for a service to name a different store. So even once this file
 *    exists, a real POST to `/do/equipment-loan/check` still goes through
 *    `lib/services/intake.ts`'s shared, in-memory `InMemorySubmissionStore`,
 *    not this one. Making this store reachable from the live route needs a
 *    change to `app/[lang]/do/actions.ts` or to the frozen
 *    `ServiceDefinition` type, and this wave owns neither. This file is
 *    therefore complete and independently correct (see the unit tests) but
 *    not yet load-bearing for a real request. THIS IS THE HEADLINE FINDING
 *    OF DELIVERABLE 2.
 *
 * 2. NO ITEM, CLOSED (gate 7, `docs/DECISIONS-2.0.md`, decided 2026-08-20).
 *    `save()` below needs an item key to call `createLoanRequest`. Before
 *    gate 7, nothing in the chassis could supply one: no route segment, and
 *    no question type whose options can track a live, officer-managed
 *    catalogue (see `lib/services/definitions/equipment-loan.ts`'s header for
 *    the finding as it stood then). The decision added a `subject` to
 *    `ServiceDefinition` (`lib/services/defineService.ts`) precisely for
 *    this: the route now carries `/do/equipment-loan/<item-key>/...`, and
 *    `submitService` (`lib/services/intake.ts`) threads that key onto
 *    `submission.subject`. `save()` below reads it from there, not from
 *    `answers.item` (no chassis question is named that; the item was never
 *    one of `LOAN_STEPS` and still is not), and `registerSubjectResolver`
 *    near the bottom of this file is what lets `equipmentLoan`'s own
 *    `subject.source` publish at all (rule 9, `defineService.ts`).
 *
 * 3. TWO DIFFERENT REFERENCE NUMBERS. `lib/services/intake.ts`'s
 *    `submitService` (frozen) generates its own reference
 *    (`generateReference(definition.id)`, e.g. "EQL-7Q2X") and returns it to
 *    the caller BEFORE `store.save()` is even awaited; `SubmissionStore.save`
 *    returns `Promise<void>`, with no way to hand a different reference
 *    back. `createLoanRequest` generates ITS OWN reference internally
 *    (`lib/inventory/loans.ts`'s `generateReference(itemKey)`, e.g.
 *    "item-4f2a") with no parameter to accept one instead. The two
 *    therefore never match: whatever the chassis shows a reader on
 *    `/do/equipment-loan/confirm` is not the reference stored on the `loans`
 *    row this file creates. `findByReference`/`listByService` below resolve
 *    against the LOAN's own reference (`loans.reference`), since that is
 *    the only column that exists to query; a reader typing back the
 *    chassis-issued reference on `/do/equipment-loan/status` would get "not
 *    found" as a result, not the loan the chassis just created for them.
 *    Fixing this needs either `SubmissionStore.save` to return the
 *    reference it actually used, or `createLoanRequest` to accept one,
 *    neither of which this wave's owned files can change
 *    (`lib/services/intake.ts` and `lib/inventory/loans.ts` are both
 *    outside the owned path list).
 *
 * `SubmissionStore.save` also has no failure channel beyond throwing
 * (`Promise<void>`, and `submitService` does not catch anything before
 * returning `{ ok: true, reference }`), so a real, legitimate
 * `createLoanRequest` rejection (blocklisted, no availability, too many
 * open loans) can only surface here as an unhandled exception, not as the
 * graceful `CheckState` variant (`"blocklisted"`, `"unavailable"`,
 * `"limit-exceeded"`) the existing wizard's own `submitLoanRequestCheck`
 * gives a reader today. That is this file's fourth finding, folded into
 * point 1 above: the chassis's outcome model is narrower than what a real
 * backing service can produce.
 */
import { createLoanRequest, listLoans } from "@/lib/inventory/loans";
import { getBorrower } from "@/lib/inventory/borrowers";
import { getItemByKey } from "@/lib/inventory/items";
import type { Borrower } from "@/lib/inventory/types";
import type { Loan } from "@/lib/inventory/types";
import { renderOfficerNewRequest } from "@/lib/email/templates";
import type {
  Submission,
  SubmissionStatus,
  SubmissionStore,
  SaveOutcome,
} from "@/lib/services/intake";
import { registerSubmissionStore } from "@/lib/services/intake";
import { registerSubjectResolver } from "@/lib/services/subject";
import { splitDateRange, type AnswerValue } from "@/lib/services/validate";

const LOAN_SERVICE_ID = "equipment-loan";

/**
 * `equipmentLoan.subject!.source` (`lib/services/definitions/equipment-loan.ts`).
 * Exported so that file can reference the exact same string rather than a
 * second copy of it drifting out of sync.
 */
export const EQUIPMENT_ITEM_SUBJECT_SOURCE = "equipment-item";

function asString(value: AnswerValue | undefined): string {
  if (value === undefined) return "";
  return Array.isArray(value) ? (value[0] ?? "") : value;
}

/**
 * The loan's eight statuses (`components/equipment/StatusLookup.tsx`'s
 * `statusLabels`) collapse onto the chassis's three
 * (`lib/services/intake.ts`'s `SubmissionStatus`). "pending" is the only
 * genuinely open-and-unstarted state, so it is the only one mapped to
 * `"received"`; "approved" and "checked_out" are open and someone has acted
 * on them, so `"in-progress"`; everything terminal (`returned`, `rejected`,
 * `cancelled`, `no_show`, and defensively `overdue`, which BIRSA is still
 * acting on but the chassis has no separate state for) maps to `"done"`.
 * This is a lossy, best-effort mapping, not a claim that the two status
 * models are equivalent.
 */
function toSubmissionStatus(loan: Loan): SubmissionStatus {
  if (loan.status === "pending") return "received";
  if (loan.status === "approved" || loan.status === "checked_out") return "in-progress";
  return "done";
}

function loanToSubmission(loan: Loan, borrower: Borrower): Submission {
  return {
    reference: loan.reference,
    serviceId: LOAN_SERVICE_ID,
    answers: {
      name: borrower.name,
      // "student-id", not "studentId": matches the question id in
      // lib/services/definitions/equipment-loan.ts, which is URL-safe
      // (rule 2, defineService.ts) rather than the wizard's own camelCase
      // draft-cookie field name.
      "student-id": borrower.tuStudentId,
      email: borrower.email,
      phone: borrower.phone ?? "",
      dates: `${loan.startDate}..${loan.endDate}`,
      reason: loan.reason ?? "",
    },
    status: toSubmissionStatus(loan),
    createdAt: loan.createdAt,
    closedAt: loan.closedAt,
  };
}

/**
 * Turns `createLoanRequest`'s decline reasons into something a student can
 * read. Each says what to do next rather than naming the rule that fired,
 * per the house rule that a message says what to fix, not what failed.
 */
function declineMessage(
  reason: "not-configured" | "invalid" | "unavailable" | "blocklisted" | "limit-exceeded" | "error"
): { en: string; th: string } {
  switch (reason) {
    case "unavailable":
      return {
        en: "That item is already booked for the dates you chose. Choose different dates and try again.",
        th: "อุปกรณ์ชิ้นนี้ถูกจองในช่วงวันที่คุณเลือกแล้ว กรุณาเลือกวันอื่นแล้วลองใหม่",
      };
    case "limit-exceeded":
      return {
        en: "You already have the maximum number of items on loan. Return one before borrowing another.",
        th: "คุณยืมอุปกรณ์ครบจำนวนสูงสุดแล้ว กรุณาคืนอุปกรณ์ก่อนยืมชิ้นใหม่",
      };
    case "blocklisted":
      return {
        en: "We cannot take this request. Email BIRSA and we will explain why and what to do next.",
        th: "เรารับคำขอนี้ไม่ได้ กรุณาส่งอีเมลถึง BIRSA แล้วเราจะอธิบายเหตุผลและขั้นตอนต่อไป",
      };
    default:
      return {
        en: "We could not save your request. Try again, and if it keeps happening email BIRSA.",
        th: "เราบันทึกคำขอของคุณไม่สำเร็จ กรุณาลองใหม่ และหากยังเกิดปัญหาอยู่ กรุณาส่งอีเมลถึง BIRSA",
      };
  }
}

/**
 * The `SubmissionStore` implementation for `equipment-loan`. See this file's
 * header for what it can and cannot do given the chassis as built.
 */
export const loanSubmissionStore: SubmissionStore = {
  async save(submission: Submission): Promise<SaveOutcome> {
    if (submission.serviceId !== LOAN_SERVICE_ID) {
      throw new Error(
        `loanSubmissionStore only serves "${LOAN_SERVICE_ID}" submissions, got "${submission.serviceId}"`
      );
    }

    const answers = submission.answers;
    const name = asString(answers.name).trim();
    // "student-id", not "studentId": see loanToSubmission's own comment.
    const studentId = asString(answers["student-id"]).trim();
    const email = asString(answers.email).trim();
    const phone = asString(answers.phone).trim();
    const reason = asString(answers.reason).trim();
    const datesRaw = asString(answers.dates);
    const range = datesRaw ? splitDateRange(datesRaw) : null;

    // See the file header, finding 2 (gate 7). The item is the chassis
    // SUBJECT, resolved from the route before the wizard ever starts, not an
    // answer: `submitService` (lib/services/intake.ts) puts it on
    // `submission.subject`, never in `answers`.
    const itemKey = (submission.subject ?? "").trim();

    if (!range) {
      throw new Error('loanSubmissionStore.save: missing or invalid "dates" answer');
    }
    if (!itemKey) {
      throw new Error(
        "loanSubmissionStore.save: no item was specified. equipmentLoan declares a subject " +
          "(lib/services/definitions/equipment-loan.ts) and every route under " +
          "/do/equipment-loan/<item>/... resolves and carries one; a submission reaching " +
          "save() with none means it was built outside that flow (see this file's header, " +
          "finding 2), and a loan cannot be created without knowing which item it is for."
      );
    }

    const item = await getItemByKey(itemKey);
    if (!item || item.isRetired) {
      // A retired item is not a bad answer, it is a thing that stopped being
      // available. There is no question to send the student back to, so this
      // is a rejection rather than a validation failure.
      return {
        ok: false,
        problem: {
          en: "That item is no longer available to borrow. Choose another item and try again.",
          th: "อุปกรณ์ชิ้นนี้ไม่เปิดให้ยืมแล้ว กรุณาเลือกอุปกรณ์ชิ้นอื่นแล้วลองใหม่",
        },
      };
    }

    const created = await createLoanRequest({
      itemKey,
      startDate: range.from,
      endDate: range.to,
      reason: reason || null,
      borrower: {
        tuStudentId: studentId,
        name,
        email,
        phone: phone || null,
      },
    });

    if (!created.ok) {
      // `createLoanRequest`'s reasons are business outcomes, not programming
      // errors: blocklisted, unavailable, limit exceeded. Before the chassis
      // could carry a rejection these had to be thrown, which would have
      // shown the student a crash for a situation the service understands
      // perfectly well.
      return { ok: false, problem: declineMessage(created.reason) };
    }

    // Best-effort officer notification, matching submitLoanRequestCheck's
    // own convention exactly (app/[lang]/services/equipment-loan/[item]/request/actions.ts):
    // optional, environment-gated, and never allowed to fail the request it
    // is attached to.
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(apiKey);
        const inbox = process.env.BIRSA_INBOX ?? "birsa@tu.ac.th";
        const from = process.env.CONTACT_FROM ?? "BIRSA Portal <onboarding@resend.dev>";

        const officerEmail = renderOfficerNewRequest({
          itemNameEn: item.name.en,
          itemNameTh: item.name.th ?? item.name.en,
          reference: created.reference,
          studentName: name,
          studentId,
          studentEmail: email,
          startDate: range.from,
          endDate: range.to,
          reason: reason || undefined,
        });

        await resend.emails.send({
          from,
          to: inbox,
          replyTo: email,
          subject: officerEmail.subject,
          html: officerEmail.html,
          text: officerEmail.text,
        });
      } catch {
        // Notification email is optional; the loan itself already exists.
      }
    }

    // The reference the DATABASE minted, not the one the chassis proposed.
    // This is the whole reason `save` returns an outcome: the student is
    // told to keep this number and the status lookup will ask for it, so it
    // has to be the number the loan actually has.
    return { ok: true, reference: created.reference };
  },

  async findByReference(serviceId: string, reference: string): Promise<Submission | null> {
    if (serviceId !== LOAN_SERVICE_ID) return null;
    // No existing function looks up a loan by reference alone (only
    // getLoanByReferenceAndEmail, which also needs the borrower's email, and
    // getLoan, which needs the internal id). listLoans() plus a filter
    // reuses an existing, exported function without new SQL; see the file
    // header, finding 3, for why the reference this is queried with will
    // not, in practice, match what a chassis submission generated.
    const loans = await listLoans();
    const loan = loans.find((l) => l.reference === reference);
    if (!loan) return null;
    const borrower = await getBorrower(loan.borrowerId);
    if (!borrower) return null;
    return loanToSubmission(loan, borrower);
  },

  async listByService(serviceId: string): Promise<Submission[]> {
    if (serviceId !== LOAN_SERVICE_ID) return [];
    const loans = await listLoans();
    const submissions: Submission[] = [];
    for (const loan of loans) {
      const borrower = await getBorrower(loan.borrowerId);
      if (borrower) submissions.push(loanToSubmission(loan, borrower));
    }
    return submissions;
  },
};

// Claim `equipment-loan` for this store. Wave 4B implemented it correctly and
// then found it unreachable, because the chassis handed every service the same
// in-memory placeholder. Registering here, at the module that owns the store,
// keeps the officer side data and the persistence side code: a service
// definition is a CMS document and cannot name a code module, so code names
// the service instead.
registerSubmissionStore(LOAN_SERVICE_ID, loanSubmissionStore);

// Claim `EQUIPMENT_ITEM_SUBJECT_SOURCE` for `lib/services/subject.ts`, the
// resolver `equipmentLoan.subject` (`lib/services/definitions/equipment-loan.ts`)
// names. Reuses `getItemByKey` and `isRetired`, exactly the same lookup
// `save()` above already makes rather than a second one: "does not exist"
// and "is retired" read the same to a reader picking from a URL as they do
// to a reader who already filled in the whole form, a proper not-found in
// both places, never a crash.
registerSubjectResolver(EQUIPMENT_ITEM_SUBJECT_SOURCE, {
  async resolve(key) {
    const item = await getItemByKey(key);
    if (!item || item.isRetired) {
      return { ok: false };
    }
    return { ok: true, key: item.key, name: item.name };
  },
});
