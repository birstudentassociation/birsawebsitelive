"use client";

/**
 * Officer-facing queue for equipment loan requests. Pending requests are
 * shown first and are the only ones with Approve/Reject actions; everything
 * else is grouped underneath for reference. Deciding a request calls
 * /api/equipment-loan/decision, which also emails the student the outcome
 * server-side, so this component only needs to reflect the row it gets back.
 */
import { useMemo, useState } from "react";
import clsx from "clsx";
import Button from "@/components/Button";
import { getEquipmentItem } from "@/content/services/equipment";
import { formatDate } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { LoanRequestRow, LoanStatus } from "@/lib/equipment-loan";

export type OfficerQueueProps = {
  locale: Locale;
  rows: LoanRequestRow[];
};

type RowMessage = {
  kind: "success" | "error";
  text: string;
  /** Show a "refresh the page" action alongside the message. */
  showRefresh?: boolean;
};

type Copy = {
  summary: (pendingCount: number) => string;
  logout: string;
  loggingOut: string;
  pendingTitle: string;
  pendingEmpty: string;
  otherTitle: string;
  otherEmpty: string;
  studentLabel: string;
  emailLabel: string;
  pickupReturnLabel: string;
  submittedLabel: string;
  reasonLabel: string;
  decidedLabel: string;
  approveLabel: string;
  rejectLabel: string;
  approving: string;
  rejecting: string;
  confirmApprove: (reference: string) => string;
  confirmReject: (reference: string) => string;
  approvedMessage: string;
  rejectedMessage: string;
  unauthorizedMessage: string;
  staleMessage: string;
  notConfiguredMessage: string;
  genericErrorMessage: string;
  refreshLabel: string;
  statusLabels: Record<LoanStatus, string>;
};

const copy: Record<Locale, Copy> = {
  en: {
    summary: (n) =>
      n === 0
        ? "There are no pending requests right now."
        : n === 1
          ? "1 request is waiting for a decision."
          : `${n} requests are waiting for a decision.`,
    logout: "Log out",
    loggingOut: "Logging out...",
    pendingTitle: "Pending requests",
    pendingEmpty: "No pending requests. New requests will appear here.",
    otherTitle: "Past requests",
    otherEmpty: "No other requests yet.",
    studentLabel: "Student",
    emailLabel: "Email",
    pickupReturnLabel: "Pickup, return",
    submittedLabel: "Submitted",
    reasonLabel: "Reason",
    decidedLabel: "Decided",
    approveLabel: "Approve",
    rejectLabel: "Reject",
    approving: "Approving...",
    rejecting: "Rejecting...",
    confirmApprove: (reference) => `Approve request ${reference}? The student will be emailed the outcome.`,
    confirmReject: (reference) => `Reject request ${reference}? The student will be emailed the outcome.`,
    approvedMessage: "Request approved. The student has been emailed.",
    rejectedMessage: "Request rejected. The student has been emailed.",
    unauthorizedMessage: "Your session has expired. Please log in again.",
    staleMessage: "This request was already decided, or no longer exists. Refresh the page to see the latest status.",
    notConfiguredMessage: "The loan database is not set up, so this decision could not be saved.",
    genericErrorMessage: "Something went wrong. Please try again.",
    refreshLabel: "Refresh page",
    statusLabels: {
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      returned: "Returned",
      cancelled: "Cancelled",
    },
  },
  th: {
    summary: (n) => (n === 0 ? "ไม่มีคำขอที่รอดำเนินการในขณะนี้" : `มี ${n} คำขอที่รอการพิจารณา`),
    logout: "ออกจากระบบ",
    loggingOut: "กำลังออกจากระบบ...",
    pendingTitle: "คำขอที่รอดำเนินการ",
    pendingEmpty: "ไม่มีคำขอที่รอดำเนินการ คำขอใหม่จะแสดงที่นี่",
    otherTitle: "คำขอที่ผ่านมา",
    otherEmpty: "ยังไม่มีคำขออื่น",
    studentLabel: "นักศึกษา",
    emailLabel: "อีเมล",
    pickupReturnLabel: "วันรับ, วันคืน",
    submittedLabel: "วันที่ส่งคำขอ",
    reasonLabel: "เหตุผล",
    decidedLabel: "วันที่พิจารณา",
    approveLabel: "อนุมัติ",
    rejectLabel: "ปฏิเสธ",
    approving: "กำลังอนุมัติ...",
    rejecting: "กำลังปฏิเสธ...",
    confirmApprove: (reference) => `อนุมัติคำขอ ${reference} ใช่หรือไม่ ระบบจะส่งอีเมลแจ้งผลให้นักศึกษา`,
    confirmReject: (reference) => `ปฏิเสธคำขอ ${reference} ใช่หรือไม่ ระบบจะส่งอีเมลแจ้งผลให้นักศึกษา`,
    approvedMessage: "อนุมัติคำขอแล้ว ระบบได้ส่งอีเมลแจ้งนักศึกษาแล้ว",
    rejectedMessage: "ปฏิเสธคำขอแล้ว ระบบได้ส่งอีเมลแจ้งนักศึกษาแล้ว",
    unauthorizedMessage: "เซสชันของคุณหมดอายุ กรุณาเข้าสู่ระบบใหม่",
    staleMessage: "คำขอนี้ถูกพิจารณาไปแล้ว หรือไม่มีอยู่แล้ว กรุณารีเฟรชหน้านี้เพื่อดูสถานะล่าสุด",
    notConfiguredMessage: "ยังไม่ได้ตั้งค่าฐานข้อมูลคำขอยืม จึงไม่สามารถบันทึกผลการพิจารณานี้ได้",
    genericErrorMessage: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
    refreshLabel: "รีเฟรชหน้า",
    statusLabels: {
      pending: "รอดำเนินการ",
      approved: "อนุมัติแล้ว",
      rejected: "ปฏิเสธแล้ว",
      returned: "คืนแล้ว",
      cancelled: "ยกเลิกแล้ว",
    },
  },
};

const OTHER_STATUSES: LoanStatus[] = ["approved", "rejected", "returned", "cancelled"];

/** Tints reuse the same design tokens as `Notice`; the status word always travels with the colour. */
const statusStyles: Record<LoanStatus, string> = {
  pending: "bg-warning-tint text-warning",
  approved: "bg-success-tint text-success",
  rejected: "bg-error-tint text-error",
  returned: "bg-forest-tint text-forest",
  cancelled: "bg-sunken text-muted",
};

function StatusPill({ status, label }: { status: LoanStatus; label: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
        statusStyles[status]
      )}
    >
      {label}
    </span>
  );
}

type DecisionResponse =
  | { ok: true; row: LoanRequestRow }
  | { ok: false; reason?: string };

export default function OfficerQueue({ locale, rows: initialRows }: OfficerQueueProps) {
  const t = copy[locale];

  const [rows, setRows] = useState<LoanRequestRow[]>(initialRows);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDecision, setPendingDecision] = useState<"approved" | "rejected" | null>(null);
  const [messages, setMessages] = useState<Record<string, RowMessage>>({});
  const [loggingOut, setLoggingOut] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<LoanStatus, LoanRequestRow[]>();
    map.set("pending", []);
    for (const status of OTHER_STATUSES) map.set(status, []);
    for (const row of rows) {
      map.get(row.status)?.push(row);
    }
    return map;
  }, [rows]);

  const pendingRows = grouped.get("pending") ?? [];
  const otherCount = OTHER_STATUSES.reduce((sum, status) => sum + (grouped.get(status)?.length ?? 0), 0);

  async function handleDecision(row: LoanRequestRow, decision: "approved" | "rejected") {
    const confirmText = decision === "approved" ? t.confirmApprove(row.reference) : t.confirmReject(row.reference);
    if (typeof window !== "undefined" && !window.confirm(confirmText)) {
      return;
    }

    setBusyId(row.id);
    setPendingDecision(decision);
    setMessages((prev) => ({ ...prev, [row.id]: undefined as unknown as RowMessage }));

    try {
      const response = await fetch("/api/equipment-loan/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, decision }),
      });
      const body = (await response.json().catch(() => null)) as DecisionResponse | null;

      if (body?.ok) {
        const updated = body.row;
        setRows((prev) => prev.map((existing) => (existing.id === row.id ? updated : existing)));
        setMessages((prev) => ({
          ...prev,
          [row.id]: {
            kind: "success",
            text: decision === "approved" ? t.approvedMessage : t.rejectedMessage,
          },
        }));
        return;
      }

      const reason = body?.reason;
      if (reason === "unauthorized") {
        setMessages((prev) => ({
          ...prev,
          [row.id]: { kind: "error", text: t.unauthorizedMessage, showRefresh: true },
        }));
      } else if (reason === "not-found" || reason === "already-decided") {
        setMessages((prev) => ({
          ...prev,
          [row.id]: { kind: "error", text: t.staleMessage, showRefresh: true },
        }));
      } else if (reason === "not-configured") {
        setMessages((prev) => ({ ...prev, [row.id]: { kind: "error", text: t.notConfiguredMessage } }));
      } else {
        setMessages((prev) => ({ ...prev, [row.id]: { kind: "error", text: t.genericErrorMessage } }));
      }
    } catch {
      setMessages((prev) => ({ ...prev, [row.id]: { kind: "error", text: t.genericErrorMessage } }));
    } finally {
      setBusyId(null);
      setPendingDecision(null);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/equipment-loan/session", { method: "DELETE" });
    } catch {
      // Ignore: reloading still lands on the login screen if the cookie is stale.
    } finally {
      window.location.reload();
    }
  }

  function renderRow(row: LoanRequestRow, showActions: boolean) {
    const item = getEquipmentItem(row.itemKey);
    const itemName = item ? item.name[locale] : row.itemKey;
    const message = messages[row.id];
    const isBusy = busyId === row.id;

    return (
      <article key={row.id} className="border-line bg-surface flex flex-col gap-3 rounded-lg border p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-display text-ink text-lg">{row.reference}</p>
            <p className="text-muted text-sm">{itemName}</p>
          </div>
          <StatusPill status={row.status} label={t.statusLabels[row.status]} />
        </div>

        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted font-semibold">{t.studentLabel}</dt>
            <dd className="text-ink">
              {row.studentName} ({row.studentId})
            </dd>
          </div>
          <div>
            <dt className="text-muted font-semibold">{t.emailLabel}</dt>
            <dd className="text-ink break-all">{row.studentEmail}</dd>
          </div>
          <div>
            <dt className="text-muted font-semibold">{t.pickupReturnLabel}</dt>
            <dd className="text-ink">
              {formatDate(locale, row.pickupDate)} &rarr; {formatDate(locale, row.returnDate)}
            </dd>
          </div>
          <div>
            <dt className="text-muted font-semibold">{t.submittedLabel}</dt>
            <dd className="text-ink">{formatDate(locale, row.createdAt)}</dd>
          </div>
          {row.reason ? (
            <div className="sm:col-span-2">
              <dt className="text-muted font-semibold">{t.reasonLabel}</dt>
              <dd className="text-ink">{row.reason}</dd>
            </div>
          ) : null}
          {row.status !== "pending" && row.decidedAt ? (
            <div>
              <dt className="text-muted font-semibold">{t.decidedLabel}</dt>
              <dd className="text-ink">{formatDate(locale, row.decidedAt)}</dd>
            </div>
          ) : null}
        </dl>

        {showActions && row.status === "pending" ? (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button onClick={() => handleDecision(row, "approved")} disabled={isBusy}>
              {isBusy && pendingDecision === "approved" ? t.approving : t.approveLabel}
            </Button>
            <Button variant="secondary" onClick={() => handleDecision(row, "rejected")} disabled={isBusy}>
              {isBusy && pendingDecision === "rejected" ? t.rejecting : t.rejectLabel}
            </Button>
          </div>
        ) : null}

        {message ? (
          <div
            role="status"
            className={clsx(
              "rounded-md border-l-4 p-3 text-sm",
              message.kind === "success" ? "border-success bg-success-tint text-ink" : "border-error bg-error-tint text-ink"
            )}
          >
            <p>{message.text}</p>
            {message.showRefresh ? (
              <Button variant="ghost" className="mt-2" onClick={() => window.location.reload()}>
                {t.refreshLabel}
              </Button>
            ) : null}
          </div>
        ) : null}
      </article>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-muted text-sm">{t.summary(pendingRows.length)}</p>
        <Button variant="secondary" onClick={handleLogout} disabled={loggingOut}>
          {loggingOut ? t.loggingOut : t.logout}
        </Button>
      </div>

      <section aria-labelledby="officer-pending-heading" className="flex flex-col gap-4">
        <h2 id="officer-pending-heading" className="font-display text-ink text-xl">
          {t.pendingTitle}
        </h2>
        {pendingRows.length === 0 ? (
          <p className="text-muted text-sm">{t.pendingEmpty}</p>
        ) : (
          <div className="flex flex-col gap-4">{pendingRows.map((row) => renderRow(row, true))}</div>
        )}
      </section>

      <section aria-labelledby="officer-other-heading" className="flex flex-col gap-6">
        <h2 id="officer-other-heading" className="font-display text-ink text-xl">
          {t.otherTitle}
        </h2>
        {otherCount === 0 ? (
          <p className="text-muted text-sm">{t.otherEmpty}</p>
        ) : (
          OTHER_STATUSES.map((status) => {
            const statusRows = grouped.get(status) ?? [];
            if (statusRows.length === 0) return null;
            return (
              <div key={status} className="flex flex-col gap-4">
                <h3 className="text-ink text-sm font-semibold">
                  {t.statusLabels[status]} ({statusRows.length})
                </h3>
                <div className="flex flex-col gap-4">{statusRows.map((row) => renderRow(row, false))}</div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
