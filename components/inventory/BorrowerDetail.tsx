"use client";

/**
 * Officer-facing single-borrower view: contact info, loan history, and (for
 * admins/loan officers) blocklist + loan-limit controls backed by
 * PATCH /api/inventory/borrowers/[id].
 */
import { useState } from "react";
import clsx from "clsx";
import Field from "@/components/Field";
import Button from "@/components/Button";
import StatusPill from "@/components/inventory/StatusPill";
import { formatDate } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { Borrower, Loan, Item, Role } from "@/lib/inventory/types";

export type BorrowerDetailProps = {
  locale: Locale;
  borrower: Borrower;
  loans: Loan[];
  itemsById: Record<string, Item>;
  activeCount: number;
  role: Role;
};

type Copy = {
  phoneLabel: string;
  emailLabel: string;
  activeLoansLabel: (n: number) => string;
  blocklistTitle: string;
  blocklistedNotice: (reason: string | null) => string;
  reasonLabel: string;
  reasonHint: string;
  blockCta: string;
  unblockCta: string;
  saving: string;
  confirmBlock: string;
  confirmUnblock: string;
  maxLoansTitle: string;
  maxLoansLabel: string;
  maxLoansHint: string;
  maxLoansInvalidMessage: string;
  maxLoansSave: string;
  savingLabel: string;
  updatedMessage: string;
  unauthorizedMessage: string;
  forbiddenMessage: string;
  genericErrorMessage: string;
  historyTitle: string;
  historyEmpty: string;
  referenceLabel: string;
  datesLabel: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    phoneLabel: "Phone",
    emailLabel: "Email",
    activeLoansLabel: (n) => (n === 1 ? "1 active loan" : `${n} active loans`),
    blocklistTitle: "Blocklist",
    blocklistedNotice: (reason) => (reason ? `Blocklisted: ${reason}` : "Blocklisted"),
    reasonLabel: "Reason",
    reasonHint: "Shown to officers when this borrower tries to request a loan.",
    blockCta: "Blocklist this borrower",
    unblockCta: "Remove from blocklist",
    saving: "Saving...",
    confirmBlock: "Blocklist this borrower? They will not be able to request new loans.",
    confirmUnblock: "Remove this borrower from the blocklist?",
    maxLoansTitle: "Loan limit",
    maxLoansLabel: "Max concurrent loans",
    maxLoansHint: "Leave blank to use the site default.",
    maxLoansInvalidMessage: "Enter a whole number of 0 or more, or leave blank.",
    maxLoansSave: "Save limit",
    savingLabel: "Saving...",
    updatedMessage: "Saved.",
    unauthorizedMessage: "Your session has expired. Sign in again.",
    forbiddenMessage: "You do not have permission to do this.",
    genericErrorMessage: "Something went wrong. Try again.",
    historyTitle: "Loan history",
    historyEmpty: "No loans yet.",
    referenceLabel: "Reference",
    datesLabel: "Dates",
  },
  th: {
    phoneLabel: "โทรศัพท์",
    emailLabel: "อีเมล",
    activeLoansLabel: (n) => `กำลังยืม ${n} รายการ`,
    blocklistTitle: "การระงับสิทธิ์",
    blocklistedNotice: (reason) => (reason ? `ถูกระงับสิทธิ์: ${reason}` : "ถูกระงับสิทธิ์"),
    reasonLabel: "เหตุผล",
    reasonHint: "จะแสดงให้เจ้าหน้าที่เห็นเมื่อผู้ยืมรายนี้พยายามขอยืม",
    blockCta: "ระงับสิทธิ์ผู้ยืมรายนี้",
    unblockCta: "ยกเลิกการระงับสิทธิ์",
    saving: "กำลังบันทึก...",
    confirmBlock: "ระงับสิทธิ์ผู้ยืมรายนี้ใช่หรือไม่ ผู้ยืมจะไม่สามารถขอยืมใหม่ได้",
    confirmUnblock: "ยกเลิกการระงับสิทธิ์ผู้ยืมรายนี้ใช่หรือไม่",
    maxLoansTitle: "จำนวนที่ยืมได้พร้อมกัน",
    maxLoansLabel: "จำนวนสูงสุดที่ยืมพร้อมกันได้",
    maxLoansHint: "เว้นว่างไว้เพื่อใช้ค่าเริ่มต้นของระบบ",
    maxLoansInvalidMessage: "กรุณากรอกจำนวนเต็มตั้งแต่ 0 ขึ้นไป หรือเว้นว่างไว้",
    maxLoansSave: "บันทึกจำนวน",
    savingLabel: "กำลังบันทึก...",
    updatedMessage: "บันทึกแล้ว",
    unauthorizedMessage: "เซสชันของคุณหมดอายุ กรุณาเข้าสู่ระบบใหม่",
    forbiddenMessage: "คุณไม่มีสิทธิ์ทำรายการนี้",
    genericErrorMessage: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
    historyTitle: "ประวัติการยืม",
    historyEmpty: "ยังไม่มีประวัติการยืม",
    referenceLabel: "รหัสอ้างอิง",
    datesLabel: "วันที่",
  },
};

const STATUS_LABELS_EN: Record<Loan["status"], string> = {
  pending: "Pending",
  approved: "Approved",
  checked_out: "Checked out",
  overdue: "Overdue",
  returned: "Returned",
  rejected: "Rejected",
  cancelled: "Cancelled",
  no_show: "No-show",
};

const STATUS_LABELS_TH: Record<Loan["status"], string> = {
  pending: "รอดำเนินการ",
  approved: "อนุมัติแล้ว",
  checked_out: "ยืมออกแล้ว",
  overdue: "เกินกำหนดคืน",
  returned: "คืนแล้ว",
  rejected: "ปฏิเสธแล้ว",
  cancelled: "ยกเลิกแล้ว",
  no_show: "ไม่มารับ",
};

type PatchResponse = { ok: true; borrower: Borrower } | { ok: false; reason?: string };

export default function BorrowerDetail({
  locale,
  borrower: initialBorrower,
  loans,
  itemsById,
  activeCount,
  role,
}: BorrowerDetailProps) {
  const t = copy[locale];
  const statusLabels = locale === "th" ? STATUS_LABELS_TH : STATUS_LABELS_EN;
  const canManage = role === "admin" || role === "loan_officer";

  const [borrower, setBorrower] = useState<Borrower>(initialBorrower);
  const [reason, setReason] = useState(borrower.blocklistReason ?? "");
  const [maxLoans, setMaxLoans] = useState(borrower.maxConcurrentLoans?.toString() ?? "");
  const [savingBlocklist, setSavingBlocklist] = useState(false);
  const [savingLimit, setSavingLimit] = useState(false);
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [maxLoansError, setMaxLoansError] = useState<string | null>(null);

  function friendlyMessage(status: number, reason: string | undefined): string {
    if (status === 401 || reason === "unauthorized") return t.unauthorizedMessage;
    if (status === 403 || reason === "forbidden") return t.forbiddenMessage;
    return t.genericErrorMessage;
  }

  async function patchBorrower(patch: Record<string, unknown>): Promise<boolean> {
    setMessage(null);
    try {
      const response = await fetch(`/api/inventory/borrowers/${borrower.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const body = (await response.json().catch(() => null)) as PatchResponse | null;
      if (body?.ok) {
        setBorrower(body.borrower);
        setMessage({ kind: "success", text: t.updatedMessage });
        return true;
      }
      const failReason = (body as { reason?: string } | null)?.reason;
      setMessage({ kind: "error", text: friendlyMessage(response.status, failReason) });
      return false;
    } catch {
      setMessage({ kind: "error", text: t.genericErrorMessage });
      return false;
    }
  }

  async function handleBlocklistToggle() {
    const goingToBlock = !borrower.blocklisted;
    const confirmText = goingToBlock ? t.confirmBlock : t.confirmUnblock;
    if (typeof window !== "undefined" && !window.confirm(confirmText)) {
      return;
    }
    setSavingBlocklist(true);
    await patchBorrower({
      blocklisted: goingToBlock,
      blocklistReason: goingToBlock ? reason || null : null,
    });
    setSavingBlocklist(false);
  }

  async function handleMaxLoansSave() {
    const trimmed = maxLoans.trim();
    const parsed = trimmed === "" ? null : Number(trimmed);
    if (parsed !== null && (!Number.isInteger(parsed) || parsed < 0)) {
      setMaxLoansError(t.maxLoansInvalidMessage);
      setMessage({ kind: "error", text: t.maxLoansInvalidMessage });
      return;
    }
    setMaxLoansError(null);
    setSavingLimit(true);
    await patchBorrower({ maxConcurrentLoans: parsed });
    setSavingLimit(false);
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-2">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted font-semibold">{t.emailLabel}</dt>
            <dd className="text-ink break-all">{borrower.email}</dd>
          </div>
          {borrower.phone ? (
            <div>
              <dt className="text-muted font-semibold">{t.phoneLabel}</dt>
              <dd className="text-ink">{borrower.phone}</dd>
            </div>
          ) : null}
        </dl>
        <p className="text-muted text-sm">{t.activeLoansLabel(activeCount)}</p>
        {borrower.blocklisted ? (
          <span className="bg-error-tint text-error inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide">
            {t.blocklistedNotice(borrower.blocklistReason)}
          </span>
        ) : null}
      </section>

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

      {canManage ? (
        <section className="border-line flex flex-col gap-4 rounded-lg border p-5">
          <h2 className="font-display text-ink text-lg">{t.blocklistTitle}</h2>
          {!borrower.blocklisted ? (
            <Field
              label={t.reasonLabel}
              name="blocklist-reason"
              hint={t.reasonHint}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          ) : null}
          <div>
            <Button
              variant={borrower.blocklisted ? "secondary" : "primary"}
              onClick={handleBlocklistToggle}
              disabled={savingBlocklist}
            >
              {savingBlocklist ? t.saving : borrower.blocklisted ? t.unblockCta : t.blockCta}
            </Button>
          </div>
        </section>
      ) : null}

      {canManage ? (
        <section className="border-line flex flex-col gap-4 rounded-lg border p-5">
          <h2 className="font-display text-ink text-lg">{t.maxLoansTitle}</h2>
          <Field
            label={t.maxLoansLabel}
            name="max-loans"
            type="number"
            min={0}
            step={1}
            hint={t.maxLoansHint}
            value={maxLoans}
            onChange={(e) => {
              setMaxLoans(e.target.value);
              setMaxLoansError(null);
            }}
            className="max-w-xs"
            error={maxLoansError ?? undefined}
          />
          <div>
            <Button onClick={handleMaxLoansSave} disabled={savingLimit}>
              {savingLimit ? t.savingLabel : t.maxLoansSave}
            </Button>
          </div>
        </section>
      ) : null}

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-ink text-xl">
          {t.historyTitle} ({loans.length})
        </h2>
        {loans.length === 0 ? (
          <p className="text-muted text-sm">{t.historyEmpty}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {loans.map((loan) => {
              const item = itemsById[loan.itemId];
              return (
                <article
                  key={loan.id}
                  className="border-line bg-surface flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
                >
                  <div>
                    <p className="text-ink font-semibold">{loan.reference}</p>
                    <p className="text-muted text-sm">{item ? item.name[locale] : loan.itemId}</p>
                    <p className="text-muted text-sm">
                      {t.datesLabel}: {formatDate(locale, loan.startDate)} &rarr;{" "}
                      {formatDate(locale, loan.endDate)}
                    </p>
                  </div>
                  <StatusPill status={loan.status} label={statusLabels[loan.status]} />
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
