"use client";

/**
 * Admin-only management of officer accounts: add a new officer, and per-row
 * edit role / active status / passcode reset. The page that renders this has
 * already gated on `officer.role === "admin"`, but the API routes re-check
 * `requireRole(["admin"])` server-side, so 401/403 here just means the
 * caller's own session changed (e.g. was deactivated) mid-visit.
 */
import { useId, useState } from "react";
import type { FormEvent } from "react";
import clsx from "clsx";
import Field from "@/components/Field";
import Button from "@/components/Button";
import Tag from "@/components/Tag";
import ErrorSummary, { type ErrorSummaryItem } from "@/components/ErrorSummary";
import type { Locale } from "@/lib/i18n";
import type { Custodian, Officer, Role } from "@/lib/inventory/types";

export type OfficersManagerProps = {
  locale: Locale;
  officers: Officer[];
  custodians: Custodian[];
};

type Copy = {
  addTitle: string;
  emailLabel: string;
  nameLabel: string;
  roleLabel: string;
  passcodeLabel: string;
  passcodeHint: string;
  required: string;
  addSubmit: string;
  adding: string;
  addErrorSummaryTitle: string;
  errorRequired: string;
  errorPasscodeLength: string;
  errorDuplicate: string;
  errorValidation: string;
  errorForbidden: string;
  errorNotConfigured: string;
  errorGeneric: string;
  addedMessage: string;
  listTitle: string;
  listEmpty: string;
  activeLabel: string;
  inactiveLabel: string;
  deactivateConfirm: (name: string) => string;
  roleChangeConfirm: (name: string, role: string) => string;
  activateAction: string;
  deactivateAction: string;
  resetPasscodeAction: string;
  resetPasscodeCancel: string;
  resetPasscodeSubmit: string;
  savingLabel: string;
  updatedMessage: string;
  passcodeResetMessage: string;
  roleLabels: Record<Role, string>;
  lastLoginLabel: (date: string) => string;
  neverLoggedInLabel: string;
  scopeLabel: string;
  scopeGlobalOption: string;
  scopeGlobalTag: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    addTitle: "Add officer",
    emailLabel: "Email",
    nameLabel: "Name",
    roleLabel: "Role",
    passcodeLabel: "Passcode",
    passcodeHint: "At least 6 characters. The officer can sign in with this right away.",
    required: "required",
    addSubmit: "Add officer",
    adding: "Adding...",
    addErrorSummaryTitle: "There is a problem",
    errorRequired: "Fill in every field",
    errorPasscodeLength: "Passcode must be at least 6 characters",
    errorDuplicate: "An officer with this email already exists",
    errorValidation: "Check the values and try again",
    errorForbidden: "You do not have permission to do this",
    errorNotConfigured: "The inventory database is not set up, so this could not be saved",
    errorGeneric: "Something went wrong. Try again.",
    addedMessage: "Officer added.",
    listTitle: "Officer accounts",
    listEmpty: "No officer accounts yet.",
    activeLabel: "Active",
    inactiveLabel: "Inactive",
    deactivateConfirm: (name) => `Deactivate ${name}? They will no longer be able to sign in.`,
    roleChangeConfirm: (name, role) =>
      `Change ${name}'s role to ${role}? This changes what they can access.`,
    activateAction: "Activate",
    deactivateAction: "Deactivate",
    resetPasscodeAction: "Reset passcode",
    resetPasscodeCancel: "Cancel",
    resetPasscodeSubmit: "Save new passcode",
    savingLabel: "Saving...",
    updatedMessage: "Updated.",
    passcodeResetMessage: "Passcode updated.",
    roleLabels: {
      admin: "Admin",
      inventory_manager: "Inventory manager",
      loan_officer: "Loan officer",
      read_only: "Read only",
    },
    lastLoginLabel: (date) => `Last signed in ${date}`,
    neverLoggedInLabel: "Never signed in",
    scopeLabel: "Scope / organisation",
    scopeGlobalOption: "Global / BIRSA staff",
    scopeGlobalTag: "Global / BIRSA",
  },
  th: {
    addTitle: "เพิ่มเจ้าหน้าที่",
    emailLabel: "อีเมล",
    nameLabel: "ชื่อ",
    roleLabel: "บทบาท",
    passcodeLabel: "รหัสผ่าน",
    passcodeHint: "อย่างน้อย 6 ตัวอักษร เจ้าหน้าที่สามารถเข้าสู่ระบบด้วยรหัสนี้ได้ทันที",
    required: "จำเป็น",
    addSubmit: "เพิ่มเจ้าหน้าที่",
    adding: "กำลังเพิ่ม...",
    addErrorSummaryTitle: "พบข้อผิดพลาด กรุณาตรวจสอบ",
    errorRequired: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
    errorPasscodeLength: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
    errorDuplicate: "มีเจ้าหน้าที่ที่ใช้อีเมลนี้อยู่แล้ว",
    errorValidation: "กรุณาตรวจสอบข้อมูลแล้วลองใหม่อีกครั้ง",
    errorForbidden: "คุณไม่มีสิทธิ์ทำรายการนี้",
    errorNotConfigured: "ยังไม่ได้ตั้งค่าฐานข้อมูลครุภัณฑ์ จึงไม่สามารถบันทึกได้",
    errorGeneric: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
    addedMessage: "เพิ่มเจ้าหน้าที่แล้ว",
    listTitle: "บัญชีเจ้าหน้าที่",
    listEmpty: "ยังไม่มีบัญชีเจ้าหน้าที่",
    activeLabel: "ใช้งานอยู่",
    inactiveLabel: "ปิดใช้งาน",
    deactivateConfirm: (name) =>
      `ปิดใช้งานบัญชีของ ${name} ใช่หรือไม่ พวกเขาจะไม่สามารถเข้าสู่ระบบได้อีก`,
    roleChangeConfirm: (name, role) =>
      `เปลี่ยนบทบาทของ ${name} เป็น ${role} ใช่หรือไม่ การเข้าถึงของพวกเขาจะเปลี่ยนไป`,
    activateAction: "เปิดใช้งาน",
    deactivateAction: "ปิดใช้งาน",
    resetPasscodeAction: "ตั้งรหัสผ่านใหม่",
    resetPasscodeCancel: "ยกเลิก",
    resetPasscodeSubmit: "บันทึกรหัสผ่านใหม่",
    savingLabel: "กำลังบันทึก...",
    updatedMessage: "บันทึกแล้ว",
    passcodeResetMessage: "ตั้งรหัสผ่านใหม่แล้ว",
    roleLabels: {
      admin: "ผู้ดูแลระบบ",
      inventory_manager: "ผู้จัดการครุภัณฑ์",
      loan_officer: "เจ้าหน้าที่ยืม-คืน",
      read_only: "ดูอย่างเดียว",
    },
    lastLoginLabel: (date) => `เข้าสู่ระบบล่าสุด ${date}`,
    neverLoggedInLabel: "ยังไม่เคยเข้าสู่ระบบ",
    scopeLabel: "ขอบเขต / องค์กร",
    scopeGlobalOption: "ส่วนกลาง / เจ้าหน้าที่ BIRSA",
    scopeGlobalTag: "ส่วนกลาง / BIRSA",
  },
};

const ROLES: Role[] = ["admin", "inventory_manager", "loan_officer", "read_only"];

type RowMessage = { kind: "success" | "error"; text: string };
type FieldName = "email" | "name" | "role" | "passcode";
type AddError = { field: FieldName | "general"; message: string };

type OfficerApiResponse =
  | { ok: true; officer: Officer }
  | { ok: false; reason?: string; errors?: Record<string, string[] | undefined> };

function formatLastLogin(locale: Locale, t: Copy, lastLoginAt: string | null): string {
  if (!lastLoginAt) return t.neverLoggedInLabel;
  const intlLocale = locale === "th" ? "th-TH-u-ca-gregory" : "en-GB";
  const formatted = new Intl.DateTimeFormat(intlLocale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    calendar: "gregory",
  }).format(new Date(lastLoginAt));
  return t.lastLoginLabel(formatted);
}

export default function OfficersManager({
  locale,
  officers: initialOfficers,
  custodians,
}: OfficersManagerProps) {
  const t = copy[locale];
  const formId = useId();

  const activeCustodians = custodians.filter((c) => c.isActive);
  const custodianById = new Map(custodians.map((c) => [c.id, c]));
  const scopeOptions = [
    { value: "", label: t.scopeGlobalOption },
    ...activeCustodians.map((c) => ({ value: c.id, label: c.name[locale] })),
  ];

  const [officers, setOfficers] = useState<Officer[]>(initialOfficers);

  // Add-officer form state.
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("read_only");
  const [custodianId, setCustodianId] = useState<string>("");
  const [passcode, setPasscode] = useState("");
  const [addError, setAddError] = useState<AddError | null>(null);
  const [addPending, setAddPending] = useState(false);
  const [addMessage, setAddMessage] = useState<string | null>(null);

  // Per-row state.
  const [busyId, setBusyId] = useState<string | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [resetValue, setResetValue] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [rowMessages, setRowMessages] = useState<Record<string, RowMessage>>({});

  function errorTextForReason(reason: string | undefined): string {
    switch (reason) {
      case "duplicate":
        return t.errorDuplicate;
      case "validation":
        return t.errorValidation;
      case "not-configured":
        return t.errorNotConfigured;
      default:
        return t.errorGeneric;
    }
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email) {
      setAddError({ field: "email", message: t.errorRequired });
      return;
    }
    if (!name) {
      setAddError({ field: "name", message: t.errorRequired });
      return;
    }
    if (!passcode) {
      setAddError({ field: "passcode", message: t.errorRequired });
      return;
    }
    if (passcode.length < 6) {
      setAddError({ field: "passcode", message: t.errorPasscodeLength });
      return;
    }

    setAddError(null);
    setAddMessage(null);
    setAddPending(true);

    try {
      const response = await fetch("/api/inventory/officers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, role, passcode, custodianId: custodianId || null }),
      });
      const body = (await response.json().catch(() => null)) as OfficerApiResponse | null;

      if (response.status === 401 || response.status === 403) {
        setAddError({ field: "general", message: t.errorForbidden });
        return;
      }

      if (body?.ok) {
        setOfficers((prev) => [...prev, body.officer].sort((a, b) => a.name.localeCompare(b.name)));
        setEmail("");
        setName("");
        setRole("read_only");
        setCustodianId("");
        setPasscode("");
        setAddMessage(t.addedMessage);
        return;
      }

      const reason = body?.reason;
      setAddError({
        field: reason === "duplicate" ? "email" : "general",
        message: errorTextForReason(reason),
      });
    } catch {
      setAddError({ field: "general", message: t.errorGeneric });
    } finally {
      setAddPending(false);
    }
  }

  async function patchOfficer(
    id: string,
    patch: Partial<{ role: Role; isActive: boolean; passcode: string; custodianId: string | null }>,
    successMessage: string
  ) {
    setBusyId(id);
    setRowMessages((prev) => ({ ...prev, [id]: undefined as unknown as RowMessage }));

    try {
      const response = await fetch(`/api/inventory/officers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const body = (await response.json().catch(() => null)) as OfficerApiResponse | null;

      if (response.status === 401 || response.status === 403) {
        setRowMessages((prev) => ({ ...prev, [id]: { kind: "error", text: t.errorForbidden } }));
        return;
      }

      if (body?.ok) {
        setOfficers((prev) => prev.map((o) => (o.id === id ? body.officer : o)));
        setRowMessages((prev) => ({ ...prev, [id]: { kind: "success", text: successMessage } }));
        return;
      }

      setRowMessages((prev) => ({
        ...prev,
        [id]: { kind: "error", text: errorTextForReason(body?.reason) },
      }));
    } catch {
      setRowMessages((prev) => ({ ...prev, [id]: { kind: "error", text: t.errorGeneric } }));
    } finally {
      setBusyId(null);
    }
  }

  function handleRoleChange(officerRow: Officer, nextRole: Role) {
    if (nextRole === officerRow.role) return;
    // Role changes grant/revoke access, so confirm first, consistent with the
    // deactivate action (GDS error prevention).
    const confirmText = t.roleChangeConfirm(officerRow.name, t.roleLabels[nextRole]);
    if (typeof window !== "undefined" && !window.confirm(confirmText)) {
      return;
    }
    void patchOfficer(officerRow.id, { role: nextRole }, t.updatedMessage);
  }

  function handleScopeChange(officerRow: Officer, nextCustodianId: string) {
    const normalized = nextCustodianId || null;
    if (normalized === officerRow.custodianId) return;
    void patchOfficer(officerRow.id, { custodianId: normalized }, t.updatedMessage);
  }

  function handleToggleActive(officerRow: Officer) {
    if (officerRow.isActive) {
      const confirmText = t.deactivateConfirm(officerRow.name);
      if (typeof window !== "undefined" && !window.confirm(confirmText)) {
        return;
      }
    }
    void patchOfficer(officerRow.id, { isActive: !officerRow.isActive }, t.updatedMessage);
  }

  function startResetPasscode(id: string) {
    setResettingId(id);
    setResetValue("");
    setResetError(null);
  }

  function cancelResetPasscode() {
    setResettingId(null);
    setResetValue("");
    setResetError(null);
  }

  async function submitResetPasscode(officerRow: Officer) {
    if (resetValue.length < 6) {
      setResetError(t.errorPasscodeLength);
      setRowMessages((prev) => ({
        ...prev,
        [officerRow.id]: { kind: "error", text: t.errorPasscodeLength },
      }));
      return;
    }
    setResetError(null);
    await patchOfficer(officerRow.id, { passcode: resetValue }, t.passcodeResetMessage);
    setResettingId(null);
    setResetValue("");
  }

  const addErrorFieldId =
    addError?.field && addError.field !== "general"
      ? `${formId}-${addError.field}`
      : `${formId}-email`;
  const addErrorItems: ErrorSummaryItem[] = addError
    ? [{ id: addErrorFieldId, message: addError.message }]
    : [];

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="add-officer-heading" className="flex flex-col gap-4">
        <h2 id="add-officer-heading" className="font-display text-ink text-xl">
          {t.addTitle}
        </h2>
        <form
          onSubmit={handleAdd}
          noValidate
          className="border-line bg-surface flex flex-col gap-5 rounded-lg border p-5 sm:max-w-xl"
        >
          <ErrorSummary title={t.addErrorSummaryTitle} errors={addErrorItems} />

          <Field
            id={`${formId}-email`}
            name="email"
            type="email"
            label={t.emailLabel}
            required
            requiredLabel={t.required}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (addError?.field === "email") setAddError(null);
            }}
            autoComplete="off"
            error={addError?.field === "email" ? addError.message : undefined}
          />

          <Field
            id={`${formId}-name`}
            name="name"
            label={t.nameLabel}
            required
            requiredLabel={t.required}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (addError?.field === "name") setAddError(null);
            }}
            autoComplete="off"
            error={addError?.field === "name" ? addError.message : undefined}
          />

          <Field
            id={`${formId}-role`}
            name="role"
            as="select"
            label={t.roleLabel}
            required
            requiredLabel={t.required}
            value={role}
            onChange={(event) => setRole(event.target.value as Role)}
            options={ROLES.map((r) => ({ value: r, label: t.roleLabels[r] }))}
          />

          <Field
            id={`${formId}-custodianId`}
            name="custodianId"
            as="select"
            label={t.scopeLabel}
            value={custodianId}
            onChange={(event) => setCustodianId(event.target.value)}
            options={scopeOptions}
          />

          <Field
            id={`${formId}-passcode`}
            name="passcode"
            type="password"
            label={t.passcodeLabel}
            hint={t.passcodeHint}
            required
            requiredLabel={t.required}
            value={passcode}
            onChange={(event) => {
              setPasscode(event.target.value);
              if (addError?.field === "passcode") setAddError(null);
            }}
            autoComplete="new-password"
            error={addError?.field === "passcode" ? addError.message : undefined}
          />

          <div>
            <Button type="submit" disabled={addPending}>
              {addPending ? t.adding : t.addSubmit}
            </Button>
          </div>

          {addMessage ? (
            <p role="status" aria-live="polite" className="text-success text-sm font-medium">
              {addMessage}
            </p>
          ) : null}
        </form>
      </section>

      <section aria-labelledby="officer-list-heading" className="flex flex-col gap-4">
        <h2 id="officer-list-heading" className="font-display text-ink text-xl">
          {t.listTitle}
        </h2>

        {officers.length === 0 ? (
          <p className="text-muted text-sm">{t.listEmpty}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {officers.map((officerRow) => {
              const isBusy = busyId === officerRow.id;
              const message = rowMessages[officerRow.id];
              const isResetting = resettingId === officerRow.id;

              return (
                <article
                  key={officerRow.id}
                  className="border-line bg-surface flex flex-col gap-3 rounded-lg border p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-ink text-lg">{officerRow.name}</p>
                      <p className="text-muted text-sm break-all">{officerRow.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag variant={officerRow.isActive ? "forest" : "neutral"}>
                        {officerRow.isActive ? t.activeLabel : t.inactiveLabel}
                      </Tag>
                      <Tag variant="brand">{t.roleLabels[officerRow.role]}</Tag>
                      <Tag variant="neutral">
                        {officerRow.custodianId
                          ? (custodianById.get(officerRow.custodianId)?.name[locale] ??
                            t.scopeGlobalTag)
                          : t.scopeGlobalTag}
                      </Tag>
                    </div>
                  </div>

                  <p className="text-muted text-sm">
                    {formatLastLogin(locale, t, officerRow.lastLoginAt)}
                  </p>

                  <div className="flex flex-wrap items-end gap-3 pt-1">
                    <Field
                      id={`${formId}-role-${officerRow.id}`}
                      name={`role-${officerRow.id}`}
                      as="select"
                      label={t.roleLabel}
                      value={officerRow.role}
                      onChange={(event) => handleRoleChange(officerRow, event.target.value as Role)}
                      disabled={isBusy}
                      options={ROLES.map((r) => ({ value: r, label: t.roleLabels[r] }))}
                      className="min-w-[10rem]"
                    />

                    <Field
                      id={`${formId}-scope-${officerRow.id}`}
                      name={`scope-${officerRow.id}`}
                      as="select"
                      label={t.scopeLabel}
                      value={officerRow.custodianId ?? ""}
                      onChange={(event) => handleScopeChange(officerRow, event.target.value)}
                      disabled={isBusy}
                      options={scopeOptions}
                      className="min-w-[10rem]"
                    />

                    <Button
                      variant="secondary"
                      onClick={() => handleToggleActive(officerRow)}
                      disabled={isBusy}
                    >
                      {officerRow.isActive ? t.deactivateAction : t.activateAction}
                    </Button>

                    {!isResetting ? (
                      <Button
                        variant="ghost"
                        onClick={() => startResetPasscode(officerRow.id)}
                        disabled={isBusy}
                      >
                        {t.resetPasscodeAction}
                      </Button>
                    ) : null}
                  </div>

                  {isResetting ? (
                    <div className="flex flex-wrap items-end gap-3">
                      <Field
                        id={`${formId}-reset-${officerRow.id}`}
                        name={`reset-passcode-${officerRow.id}`}
                        type="password"
                        label={t.passcodeLabel}
                        hint={t.passcodeHint}
                        value={resetValue}
                        onChange={(event) => {
                          setResetValue(event.target.value);
                          setResetError(null);
                        }}
                        autoComplete="new-password"
                        className="min-w-[14rem]"
                        error={resetError ?? undefined}
                      />
                      <Button onClick={() => submitResetPasscode(officerRow)} disabled={isBusy}>
                        {isBusy ? t.savingLabel : t.resetPasscodeSubmit}
                      </Button>
                      <Button variant="ghost" onClick={cancelResetPasscode} disabled={isBusy}>
                        {t.resetPasscodeCancel}
                      </Button>
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
            })}
          </div>
        )}
      </section>
    </div>
  );
}
