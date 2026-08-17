"use client";

/**
 * Officer-facing loans queue: approve/reject pending requests, hand off
 * approved units, record returns, and cancel. Generalizes the single-item
 * approval queue pattern to the full loan lifecycle and to
 * individually-tracked units.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import Button from "@/components/Button";
import Field from "@/components/Field";
import Pager from "@/components/Pager";
import StatusPill from "@/components/inventory/StatusPill";
import { usePagination } from "@/lib/usePagination";
import { useConfirmDialog } from "@/lib/useConfirmDialog";
import { formatDate } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type {
  Loan,
  LoanStatus,
  Item,
  Borrower,
  Unit,
  UnitCondition,
  Role,
} from "@/lib/inventory/types";

/** Page size for the "other loans" (non-pending) group only; pending
 * requests are never paginated, since capping them would hide actionable
 * work from the officer. */
const OTHER_PAGE_SIZE = 24;

export type LoanQueueProps = {
  locale: Locale;
  loans: Loan[];
  itemsById: Record<string, Item>;
  borrowersById: Record<string, Borrower>;
  /** Pre-fetched candidate units per pending loan id, for the approve unit-picker. */
  availableUnitsByLoan: Record<string, Unit[]>;
  role: Role;
  /** When true (no status filter applied), group rows with pending shown first. */
  groupByStatus: boolean;
};

type RowMessage = { kind: "success" | "error"; text: string };

const ALL_STATUSES: LoanStatus[] = [
  "pending",
  "approved",
  "checked_out",
  "overdue",
  "returned",
  "rejected",
  "cancelled",
  "no_show",
];

const CONDITIONS: UnitCondition[] = ["good", "worn", "damaged", "lost"];

type Copy = {
  emptyList: string;
  pendingTitle: string;
  otherTitle: string;
  referenceLabel: string;
  borrowerLabel: string;
  emailLabel: string;
  datesLabel: string;
  reasonLabel: string;
  unitLabel: string;
  unitRequiredLabel: string;
  unitPlaceholder: string;
  noUnitsAvailable: string;
  conditionOutLabel: string;
  conditionInLabel: string;
  conditionOptional: string;
  conditionLabels: Record<UnitCondition, string>;
  approveLabel: string;
  rejectLabel: string;
  checkoutLabel: string;
  checkinLabel: string;
  cancelLabel: string;
  approving: string;
  rejecting: string;
  checkingOut: string;
  checkingIn: string;
  cancelling: string;
  confirmApprove: (reference: string) => string;
  confirmReject: (reference: string) => string;
  confirmCheckout: (reference: string) => string;
  confirmCheckin: (reference: string) => string;
  confirmCancel: (reference: string) => string;
  approvedMessage: string;
  rejectedMessage: string;
  checkedOutMessage: string;
  checkedInMessage: string;
  cancelledMessage: string;
  unauthorizedMessage: string;
  forbiddenMessage: string;
  staleMessage: string;
  unitRequiredMessage: string;
  unavailableMessage: string;
  invalidStateMessage: string;
  genericErrorMessage: string;
  statusLabels: Record<LoanStatus, string>;
  /** Label for the confirm dialog's confirm button (its cancel button reuses
   * `cancelLabel` above, which already reads "Cancel"/"ยกเลิก"). */
  confirmLabel: string;
  previous: string;
  next: string;
  /** Template containing the literal placeholders "{current}" and "{total}". */
  pageOf: string;
  approveAllLabel: string;
  approvingAllLabel: string;
  confirmApproveAll: (count: number) => string;
  /** All pending requests approved, none failed. */
  bulkApprovedAll: (count: number) => string;
  /** A mix of approved and failed requests; `failures` are already-formatted
   * "<reference> (<reason>)" strings. */
  bulkApprovedSummary: (successCount: number, failures: string[]) => string;
};

const copy: Record<Locale, Copy> = {
  en: {
    emptyList: "No loans in this view.",
    pendingTitle: "Pending",
    otherTitle: "Other loans",
    referenceLabel: "Reference",
    borrowerLabel: "Borrower",
    emailLabel: "Email",
    datesLabel: "Start, end",
    reasonLabel: "Reason",
    unitLabel: "Unit to assign",
    unitRequiredLabel: "required",
    unitPlaceholder: "Select a unit",
    noUnitsAvailable: "No units are available for these dates.",
    conditionOutLabel: "Condition going out",
    conditionInLabel: "Condition coming back",
    conditionOptional: "optional",
    conditionLabels: { good: "Good", worn: "Worn", damaged: "Damaged", lost: "Lost" },
    approveLabel: "Approve",
    rejectLabel: "Reject",
    checkoutLabel: "Check out",
    checkinLabel: "Check in",
    cancelLabel: "Cancel",
    approving: "Approving...",
    rejecting: "Rejecting...",
    checkingOut: "Checking out...",
    checkingIn: "Checking in...",
    cancelling: "Cancelling...",
    confirmApprove: (reference) => `Approve loan ${reference}?`,
    confirmReject: (reference) => `Reject loan ${reference}?`,
    confirmCheckout: (reference) => `Check out loan ${reference} to the borrower?`,
    confirmCheckin: (reference) => `Check in loan ${reference}?`,
    confirmCancel: (reference) => `Cancel loan ${reference}?`,
    approvedMessage: "Loan approved.",
    rejectedMessage: "Loan rejected.",
    checkedOutMessage: "Unit checked out to the borrower.",
    checkedInMessage: "Unit checked in.",
    cancelledMessage: "Loan cancelled.",
    unauthorizedMessage: "Your session has expired. Sign in again.",
    forbiddenMessage: "You do not have permission to do this.",
    staleMessage:
      "This loan was already updated, or no longer exists. Refresh the page to see the latest status.",
    unitRequiredMessage: "Select a unit before approving.",
    unavailableMessage: "That unit was just taken by another loan. Pick a different one.",
    invalidStateMessage:
      "This loan is no longer in a state that allows this action. Refresh the page.",
    genericErrorMessage: "Something went wrong. Try again.",
    statusLabels: {
      pending: "Pending",
      approved: "Approved",
      checked_out: "Checked out",
      overdue: "Overdue",
      returned: "Returned",
      rejected: "Rejected",
      cancelled: "Cancelled",
      no_show: "No-show",
    },
    confirmLabel: "Confirm",
    previous: "Previous",
    next: "Next",
    pageOf: "Page {current} of {total}",
    approveAllLabel: "Approve all pending",
    approvingAllLabel: "Approving all...",
    confirmApproveAll: (count) => `Approve all ${count} pending requests?`,
    bulkApprovedAll: (count) =>
      count === 1 ? "Approved 1 request." : `Approved ${count} requests.`,
    bulkApprovedSummary: (successCount, failures) => {
      const approvedPart =
        successCount === 1 ? "Approved 1 request." : `Approved ${successCount} requests.`;
      const failedPart =
        failures.length === 1
          ? `1 failed: ${failures[0]}.`
          : `${failures.length} failed: ${failures.join(", ")}.`;
      return `${approvedPart} ${failedPart}`;
    },
  },
  th: {
    emptyList: "ไม่มีคำขอยืมในมุมมองนี้",
    pendingTitle: "รอดำเนินการ",
    otherTitle: "คำขอยืมอื่น ๆ",
    referenceLabel: "รหัสอ้างอิง",
    borrowerLabel: "ผู้ยืม",
    emailLabel: "อีเมล",
    datesLabel: "วันเริ่ม, วันสิ้นสุด",
    reasonLabel: "เหตุผล",
    unitLabel: "ชิ้นที่จะจัดสรร",
    unitRequiredLabel: "จำเป็น",
    unitPlaceholder: "เลือกชิ้น",
    noUnitsAvailable: "ไม่มีชิ้นว่างสำหรับช่วงวันที่นี้",
    conditionOutLabel: "สภาพก่อนยืมออก",
    conditionInLabel: "สภาพเมื่อคืน",
    conditionOptional: "ไม่บังคับ",
    conditionLabels: { good: "ดี", worn: "สึกหรอ", damaged: "ชำรุด", lost: "สูญหาย" },
    approveLabel: "อนุมัติ",
    rejectLabel: "ปฏิเสธ",
    checkoutLabel: "ยืมออก",
    checkinLabel: "รับคืน",
    cancelLabel: "ยกเลิก",
    approving: "กำลังอนุมัติ...",
    rejecting: "กำลังปฏิเสธ...",
    checkingOut: "กำลังบันทึกการยืมออก...",
    checkingIn: "กำลังบันทึกการรับคืน...",
    cancelling: "กำลังยกเลิก...",
    confirmApprove: (reference) => `อนุมัติคำขอยืม ${reference} ใช่หรือไม่`,
    confirmReject: (reference) => `ปฏิเสธคำขอยืม ${reference} ใช่หรือไม่`,
    confirmCheckout: (reference) => `บันทึกการยืมออกของ ${reference} ให้ผู้ยืมใช่หรือไม่`,
    confirmCheckin: (reference) => `บันทึกการรับคืนของ ${reference} ใช่หรือไม่`,
    confirmCancel: (reference) => `ยกเลิกคำขอยืม ${reference} ใช่หรือไม่`,
    approvedMessage: "อนุมัติคำขอยืมแล้ว",
    rejectedMessage: "ปฏิเสธคำขอยืมแล้ว",
    checkedOutMessage: "บันทึกการยืมออกให้ผู้ยืมแล้ว",
    checkedInMessage: "บันทึกการรับคืนแล้ว",
    cancelledMessage: "ยกเลิกคำขอยืมแล้ว",
    unauthorizedMessage: "เซสชันของคุณหมดอายุ กรุณาเข้าสู่ระบบใหม่",
    forbiddenMessage: "คุณไม่มีสิทธิ์ทำรายการนี้",
    staleMessage:
      "คำขอยืมนี้ถูกอัปเดตไปแล้ว หรือไม่มีอยู่แล้ว กรุณารีเฟรชหน้านี้เพื่อดูสถานะล่าสุด",
    unitRequiredMessage: "กรุณาเลือกชิ้นก่อนอนุมัติ",
    unavailableMessage: "ชิ้นนี้เพิ่งถูกจัดสรรให้คำขออื่นไปแล้ว กรุณาเลือกชิ้นอื่น",
    invalidStateMessage: "คำขอยืมนี้ไม่อยู่ในสถานะที่ทำรายการนี้ได้แล้ว กรุณารีเฟรชหน้านี้",
    genericErrorMessage: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
    statusLabels: {
      pending: "รอดำเนินการ",
      approved: "อนุมัติแล้ว",
      checked_out: "ยืมออกแล้ว",
      overdue: "เกินกำหนดคืน",
      returned: "คืนแล้ว",
      rejected: "ปฏิเสธแล้ว",
      cancelled: "ยกเลิกแล้ว",
      no_show: "ไม่มารับ",
    },
    confirmLabel: "ยืนยัน",
    previous: "ก่อนหน้า",
    next: "ถัดไป",
    pageOf: "หน้า {current} จาก {total}",
    approveAllLabel: "อนุมัติที่รอดำเนินการทั้งหมด",
    approvingAllLabel: "กำลังอนุมัติทั้งหมด...",
    confirmApproveAll: (count) => `อนุมัติคำขอยืมที่รอดำเนินการทั้งหมด ${count} รายการใช่หรือไม่`,
    bulkApprovedAll: (count) =>
      count === 1 ? "อนุมัติแล้ว 1 รายการ" : `อนุมัติแล้ว ${count} รายการ`,
    bulkApprovedSummary: (successCount, failures) => {
      const approvedPart =
        successCount === 1 ? "อนุมัติแล้ว 1 รายการ" : `อนุมัติแล้ว ${successCount} รายการ`;
      const failedPart =
        failures.length === 1
          ? `ไม่สำเร็จ 1 รายการ: ${failures[0]}`
          : `ไม่สำเร็จ ${failures.length} รายการ: ${failures.join(", ")}`;
      return `${approvedPart} ${failedPart}`;
    },
  },
};

type DecisionResponse = { ok: true; loan: Loan } | { ok: false; reason?: string };
type CancelResponse = { ok: true } | { ok: false; reason?: string };

function friendlyMessage(t: Copy, status: number, reason: string | undefined): string {
  if (status === 401 || reason === "unauthorized") return t.unauthorizedMessage;
  if (status === 403 || reason === "forbidden") return t.forbiddenMessage;
  if (status === 404 || reason === "not-found") return t.staleMessage;
  if (reason === "already-decided") return t.staleMessage;
  if (reason === "unit-required") return t.unitRequiredMessage;
  if (status === 409 || reason === "unavailable") return t.unavailableMessage;
  if (reason === "invalid-state") return t.invalidStateMessage;
  return t.genericErrorMessage;
}

export default function LoanQueue({
  locale,
  loans: initialLoans,
  itemsById,
  borrowersById,
  availableUnitsByLoan,
  role,
  groupByStatus,
}: LoanQueueProps) {
  const t = copy[locale];
  const canAct = role === "admin" || role === "loan_officer";
  const { confirm, dialog } = useConfirmDialog({
    confirmLabel: t.confirmLabel,
    cancelLabel: t.cancelLabel,
  });

  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, RowMessage>>({});
  const [selectedUnit, setSelectedUnit] = useState<Record<string, string>>({});
  const [conditionOut, setConditionOut] = useState<Record<string, UnitCondition | "">>({});
  const [conditionIn, setConditionIn] = useState<Record<string, UnitCondition | "">>({});
  const [unitErrors, setUnitErrors] = useState<Record<string, string>>({});
  const [bulkApproving, setBulkApproving] = useState(false);
  const [bulkMessage, setBulkMessage] = useState<RowMessage | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<LoanStatus, Loan[]>();
    for (const status of ALL_STATUSES) map.set(status, []);
    for (const loan of loans) {
      map.get(loan.status)?.push(loan);
    }
    return map;
  }, [loans]);

  const pendingLoans = grouped.get("pending") ?? [];
  const otherStatuses = ALL_STATUSES.filter((status) => status !== "pending");
  const otherCount = otherStatuses.reduce(
    (sum, status) => sum + (grouped.get(status)?.length ?? 0),
    0
  );
  // Only the "other loans" group is paginated; pending requests always
  // render in full since capping them would hide actionable work. Flatten
  // in status order, paginate that flat list, then re-group the current
  // page's loans by status so each status subheading still only shows its
  // own (on-page) rows.
  const otherLoans = useMemo(
    () => otherStatuses.flatMap((status) => grouped.get(status) ?? []),
    [otherStatuses, grouped]
  );
  const {
    page: otherPage,
    totalPages: otherTotalPages,
    pageItems: otherPageItems,
    goToPage: goToOtherPage,
  } = usePagination(otherLoans, OTHER_PAGE_SIZE);
  const otherPageByStatus = useMemo(() => {
    const map = new Map<LoanStatus, Loan[]>();
    for (const loan of otherPageItems) {
      const list = map.get(loan.status) ?? [];
      list.push(loan);
      map.set(loan.status, list);
    }
    return map;
  }, [otherPageItems]);

  function setMessage(loanId: string, message: RowMessage | undefined) {
    setMessages((prev) => ({ ...prev, [loanId]: message as RowMessage }));
  }

  // After an action the acted-on card changes status group and its action
  // buttons unmount, which drops focus to <body>. Move focus to the card so a
  // keyboard/screen-reader officer keeps their place and hears the result
  // (2.4.3). The card keeps a stable ref by loan id even when it moves group.
  const articleRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [focusLoanId, setFocusLoanId] = useState<string | null>(null);

  useEffect(() => {
    if (!focusLoanId) return;
    const el = articleRefs.current.get(focusLoanId);
    if (el) {
      el.focus();
      setFocusLoanId(null);
    }
  }, [focusLoanId, loans, messages]);

  async function runAction(
    loan: Loan,
    action: string,
    confirmText: string,
    request: () => Promise<Response>,
    onSuccess: (loan: Loan) => void,
    danger = false
  ) {
    const ok = await confirm({ title: confirmText, danger });
    if (!ok) return;
    setBusyId(loan.id);
    setBusyAction(action);
    setMessage(loan.id, undefined);

    try {
      const response = await request();
      const body = (await response.json().catch(() => null)) as
        DecisionResponse | CancelResponse | null;

      if (body?.ok) {
        if ("loan" in body) {
          onSuccess(body.loan);
        } else {
          // Officer cancel returns {ok:true} without the row; apply locally.
          onSuccess({ ...loan, status: "cancelled" });
        }
        return;
      }

      const reason = (body as { reason?: string } | null)?.reason;
      setMessage(loan.id, { kind: "error", text: friendlyMessage(t, response.status, reason) });
    } catch {
      setMessage(loan.id, { kind: "error", text: t.genericErrorMessage });
    } finally {
      setBusyId(null);
      setBusyAction(null);
      setFocusLoanId(loan.id);
    }
  }

  function applyLoan(updated: Loan, successText: string) {
    setLoans((prev) => prev.map((existing) => (existing.id === updated.id ? updated : existing)));
    setMessage(updated.id, { kind: "success", text: successText });
  }

  // Shared by the single-row Approve button and "Approve all pending": hits
  // the same /api/loans/decision endpoint per loan, so each item still gets
  // its own server-side recordAudit entry. Confirming and busy-state are the
  // caller's responsibility (handleApprove wraps a single confirm + row busy
  // state; handleApproveAll confirms once and drives its own bulk busy
  // state around a sequential loop of this function).
  async function performApprove(
    loan: Loan
  ): Promise<{ ok: true } | { ok: false; reasonText: string }> {
    const unitId = selectedUnit[loan.id];
    if (!unitId) {
      setUnitErrors((prev) => ({ ...prev, [loan.id]: t.unitRequiredMessage }));
      setMessage(loan.id, { kind: "error", text: t.unitRequiredMessage });
      return { ok: false, reasonText: t.unitRequiredMessage };
    }
    setUnitErrors((prev) => ({ ...prev, [loan.id]: "" }));
    try {
      const response = await fetch("/api/loans/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: loan.id, decision: "approved", unitId }),
      });
      const body = (await response.json().catch(() => null)) as DecisionResponse | null;
      if (body?.ok) {
        applyLoan(body.loan, t.approvedMessage);
        return { ok: true };
      }
      const reason = (body as { reason?: string } | null)?.reason;
      const reasonText = friendlyMessage(t, response.status, reason);
      setMessage(loan.id, { kind: "error", text: reasonText });
      return { ok: false, reasonText };
    } catch {
      setMessage(loan.id, { kind: "error", text: t.genericErrorMessage });
      return { ok: false, reasonText: t.genericErrorMessage };
    }
  }

  async function handleApprove(loan: Loan) {
    const unitId = selectedUnit[loan.id];
    if (!unitId) {
      setUnitErrors((prev) => ({ ...prev, [loan.id]: t.unitRequiredMessage }));
      setMessage(loan.id, { kind: "error", text: t.unitRequiredMessage });
      return;
    }
    const ok = await confirm({ title: t.confirmApprove(loan.reference) });
    if (!ok) return;
    setBusyId(loan.id);
    setBusyAction("approve");
    setMessage(loan.id, undefined);
    await performApprove(loan);
    setBusyId(null);
    setBusyAction(null);
    setFocusLoanId(loan.id);
  }

  async function handleApproveAll() {
    const ok = await confirm({ title: t.confirmApproveAll(pendingLoans.length) });
    if (!ok) return;
    setBulkApproving(true);
    setBulkMessage(null);
    let successCount = 0;
    const failures: string[] = [];
    for (const loan of pendingLoans) {
      const result = await performApprove(loan);
      if (result.ok) {
        successCount++;
      } else {
        failures.push(`${loan.reference} (${result.reasonText})`);
      }
    }
    setBulkApproving(false);
    setBulkMessage(
      failures.length === 0
        ? { kind: "success", text: t.bulkApprovedAll(successCount) }
        : {
            kind: successCount > 0 ? "success" : "error",
            text: t.bulkApprovedSummary(successCount, failures),
          }
    );
  }

  async function handleReject(loan: Loan) {
    await runAction(
      loan,
      "reject",
      t.confirmReject(loan.reference),
      () =>
        fetch("/api/loans/decision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: loan.id, decision: "rejected" }),
        }),
      (updated) => applyLoan(updated, t.rejectedMessage),
      true
    );
  }

  async function handleCheckout(loan: Loan) {
    const condition = conditionOut[loan.id];
    await runAction(
      loan,
      "checkout",
      t.confirmCheckout(loan.reference),
      () =>
        fetch("/api/loans/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: loan.id, conditionOut: condition || undefined }),
        }),
      (updated) => applyLoan(updated, t.checkedOutMessage)
    );
  }

  async function handleCheckin(loan: Loan) {
    const condition = conditionIn[loan.id];
    await runAction(
      loan,
      "checkin",
      t.confirmCheckin(loan.reference),
      () =>
        fetch("/api/loans/checkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: loan.id, conditionIn: condition || undefined }),
        }),
      (updated) => applyLoan(updated, t.checkedInMessage)
    );
  }

  async function handleCancel(loan: Loan) {
    await runAction(
      loan,
      "cancel",
      t.confirmCancel(loan.reference),
      () =>
        fetch("/api/loans/cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: loan.id }),
        }),
      (updated) => applyLoan(updated, t.cancelledMessage),
      true
    );
  }

  function renderLoan(loan: Loan) {
    const item = itemsById[loan.itemId];
    const borrower = borrowersById[loan.borrowerId];
    const message = messages[loan.id];
    // Bulk-approving disables every pending row's actions too, not just the
    // one loan currently mid-request.
    const isBusy = busyId === loan.id || (bulkApproving && loan.status === "pending");
    const units = availableUnitsByLoan[loan.id] ?? [];

    return (
      <article
        key={loan.id}
        ref={(el) => {
          if (el) articleRefs.current.set(loan.id, el);
          else articleRefs.current.delete(loan.id);
        }}
        tabIndex={-1}
        className="focus-halo flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 sm:p-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-display text-lg text-ink">{loan.reference}</p>
            <p className="text-sm text-muted">{item ? item.name[locale] : loan.itemId}</p>
          </div>
          <StatusPill status={loan.status} label={t.statusLabels[loan.status]} />
        </div>

        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-muted">{t.borrowerLabel}</dt>
            <dd className="text-ink">
              {borrower ? `${borrower.name} (${borrower.tuStudentId})` : loan.borrowerId}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-muted">{t.emailLabel}</dt>
            <dd className="break-all text-ink">{borrower?.email ?? "Not provided"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-muted">{t.datesLabel}</dt>
            <dd className="text-ink">
              {formatDate(locale, loan.startDate)} &rarr; {formatDate(locale, loan.endDate)}
            </dd>
          </div>
          {loan.reason ? (
            <div className="sm:col-span-2">
              <dt className="font-semibold text-muted">{t.reasonLabel}</dt>
              <dd className="text-ink">{loan.reason}</dd>
            </div>
          ) : null}
        </dl>

        {canAct && loan.status === "pending" ? (
          <div className="flex flex-col gap-3 pt-1">
            <Field
              label={t.unitLabel}
              name={`unit-${loan.id}`}
              as="select"
              required
              requiredLabel={t.unitRequiredLabel}
              value={selectedUnit[loan.id] ?? ""}
              onChange={(e) => {
                setSelectedUnit((prev) => ({ ...prev, [loan.id]: e.target.value }));
                setUnitErrors((prev) => ({ ...prev, [loan.id]: "" }));
              }}
              options={[
                { value: "", label: t.unitPlaceholder },
                ...units.map((unit) => ({ value: unit.id, label: unit.label })),
              ]}
              disabled={units.length === 0 || isBusy}
              hint={units.length === 0 ? t.noUnitsAvailable : undefined}
              error={unitErrors[loan.id] || undefined}
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => handleApprove(loan)} disabled={isBusy || units.length === 0}>
                {isBusy && busyAction === "approve" ? t.approving : t.approveLabel}
              </Button>
              <Button variant="secondary" onClick={() => handleReject(loan)} disabled={isBusy}>
                {isBusy && busyAction === "reject" ? t.rejecting : t.rejectLabel}
              </Button>
              <Button variant="ghost" onClick={() => handleCancel(loan)} disabled={isBusy}>
                {isBusy && busyAction === "cancel" ? t.cancelling : t.cancelLabel}
              </Button>
            </div>
          </div>
        ) : null}

        {canAct && loan.status === "approved" ? (
          <div className="flex flex-col gap-3 pt-1">
            <Field
              label={`${t.conditionOutLabel} (${t.conditionOptional})`}
              name={`condition-out-${loan.id}`}
              as="select"
              value={conditionOut[loan.id] ?? ""}
              onChange={(e) =>
                setConditionOut((prev) => ({
                  ...prev,
                  [loan.id]: e.target.value as UnitCondition | "",
                }))
              }
              options={[
                { value: "", label: t.unitPlaceholder },
                ...CONDITIONS.map((condition) => ({
                  value: condition,
                  label: t.conditionLabels[condition],
                })),
              ]}
              disabled={isBusy}
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => handleCheckout(loan)} disabled={isBusy}>
                {isBusy && busyAction === "checkout" ? t.checkingOut : t.checkoutLabel}
              </Button>
              <Button variant="ghost" onClick={() => handleCancel(loan)} disabled={isBusy}>
                {isBusy && busyAction === "cancel" ? t.cancelling : t.cancelLabel}
              </Button>
            </div>
          </div>
        ) : null}

        {canAct && (loan.status === "checked_out" || loan.status === "overdue") ? (
          <div className="flex flex-col gap-3 pt-1">
            <Field
              label={`${t.conditionInLabel} (${t.conditionOptional})`}
              name={`condition-in-${loan.id}`}
              as="select"
              value={conditionIn[loan.id] ?? ""}
              onChange={(e) =>
                setConditionIn((prev) => ({
                  ...prev,
                  [loan.id]: e.target.value as UnitCondition | "",
                }))
              }
              options={[
                { value: "", label: t.unitPlaceholder },
                ...CONDITIONS.map((condition) => ({
                  value: condition,
                  label: t.conditionLabels[condition],
                })),
              ]}
              disabled={isBusy}
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => handleCheckin(loan)} disabled={isBusy}>
                {isBusy && busyAction === "checkin" ? t.checkingIn : t.checkinLabel}
              </Button>
            </div>
          </div>
        ) : null}

        {message ? (
          <div
            role={message.kind === "success" ? "status" : "alert"}
            aria-live={message.kind === "success" ? "polite" : "assertive"}
            className={clsx(
              "rounded-md border-l-4 p-3 text-sm",
              message.kind === "success"
                ? "border-success bg-success-tint text-ink"
                : "border-error bg-error-tint text-ink"
            )}
          >
            {message.text}
          </div>
        ) : null}
      </article>
    );
  }

  if (loans.length === 0) {
    return (
      <>
        <p className="text-sm text-muted">{t.emptyList}</p>
        {dialog}
      </>
    );
  }

  if (!groupByStatus) {
    return (
      <>
        <div className="flex flex-col gap-4">{loans.map((loan) => renderLoan(loan))}</div>
        {dialog}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="loan-queue-pending-heading" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="loan-queue-pending-heading" className="font-display text-xl text-ink">
            {t.pendingTitle} ({pendingLoans.length})
          </h2>
          {canAct && pendingLoans.length >= 2 ? (
            <Button
              variant="secondary"
              onClick={handleApproveAll}
              disabled={bulkApproving || busyId !== null}
            >
              {bulkApproving ? t.approvingAllLabel : t.approveAllLabel}
            </Button>
          ) : null}
        </div>
        {bulkMessage ? (
          <div
            role={bulkMessage.kind === "success" ? "status" : "alert"}
            aria-live={bulkMessage.kind === "success" ? "polite" : "assertive"}
            className={clsx(
              "rounded-md border-l-4 p-3 text-sm",
              bulkMessage.kind === "success"
                ? "border-success bg-success-tint text-ink"
                : "border-error bg-error-tint text-ink"
            )}
          >
            {bulkMessage.text}
          </div>
        ) : null}
        {pendingLoans.length === 0 ? (
          <p className="text-sm text-muted">{t.emptyList}</p>
        ) : (
          <div className="flex flex-col gap-4">{pendingLoans.map((loan) => renderLoan(loan))}</div>
        )}
      </section>

      <section aria-labelledby="loan-queue-other-heading" className="flex flex-col gap-6">
        <h2 id="loan-queue-other-heading" className="font-display text-xl text-ink">
          {t.otherTitle} ({otherCount})
        </h2>
        {otherStatuses.map((status) => {
          const statusLoans = otherPageByStatus.get(status) ?? [];
          const statusTotal = grouped.get(status)?.length ?? 0;
          if (statusLoans.length === 0) return null;
          return (
            <div key={status} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-ink">
                {t.statusLabels[status]} ({statusTotal})
              </h3>
              <div className="flex flex-col gap-4">
                {statusLoans.map((loan) => renderLoan(loan))}
              </div>
            </div>
          );
        })}
        <Pager
          page={otherPage}
          totalPages={otherTotalPages}
          goToPage={goToOtherPage}
          previousLabel={t.previous}
          nextLabel={t.next}
          pageOfTemplate={t.pageOf}
        />
      </section>

      {dialog}
    </div>
  );
}
