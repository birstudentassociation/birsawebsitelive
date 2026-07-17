"use client";

/**
 * Officer console: manage custodian organisations (BIRSA + clubs) that own
 * catalogue items. A single entity's worth of the same list + inline
 * per-row edit + create-form structure used by ReferenceManager for
 * categories/locations. Only rendered for BIRSA/global admins (the page
 * gates access before mounting this component), so there is no
 * `canWrite`/role prop here: writing is always allowed.
 */
import { useId, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Field from "@/components/Field";
import Button from "@/components/Button";
import type { Locale } from "@/lib/i18n";
import type { Custodian, CustodianKind } from "@/lib/inventory/types";

export type CustodiansManagerProps = {
  locale: Locale;
  custodians: Custodian[];
};

type Copy = {
  addOrganisation: string;
  hideForm: string;
  slugLabel: string;
  slugHint: string;
  kindLabel: string;
  kindBirsa: string;
  kindClub: string;
  nameEnLabel: string;
  nameThLabel: string;
  contactNameEnLabel: string;
  contactNameThLabel: string;
  contactEmailLabel: string;
  contactInstagramLabel: string;
  contactOtherLabel: string;
  borrowNoteEnLabel: string;
  borrowNoteThLabel: string;
  sortOrderLabel: string;
  activeLabel: string;
  required: string;
  optional: string;
  create: string;
  creating: string;
  created: string;
  edit: string;
  save: string;
  saving: string;
  saved: string;
  cancel: string;
  noCustodians: string;
  statusActive: string;
  statusInactive: string;
  kindBadge: (kind: CustodianKind) => string;
  noContact: string;
  errorRequired: string;
  errorDuplicate: string;
  errorForbidden: string;
  errorGeneric: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    addOrganisation: "Add organisation",
    hideForm: "Cancel",
    slugLabel: "Slug",
    slugHint: "A short, unique code, e.g. hiking-club.",
    kindLabel: "Kind",
    kindBirsa: "BIRSA (global)",
    kindClub: "Club",
    nameEnLabel: "Name (English)",
    nameThLabel: "Name (Thai)",
    contactNameEnLabel: "Contact name (English)",
    contactNameThLabel: "Contact name (Thai)",
    contactEmailLabel: "Contact email",
    contactInstagramLabel: "Contact Instagram",
    contactOtherLabel: "Other contact info",
    borrowNoteEnLabel: "Borrowing note (English)",
    borrowNoteThLabel: "Borrowing note (Thai)",
    sortOrderLabel: "Sort order",
    activeLabel: "Active",
    required: "required",
    optional: "optional",
    create: "Create",
    creating: "Creating...",
    created: "Created.",
    edit: "Edit",
    save: "Save",
    saving: "Saving...",
    saved: "Saved.",
    cancel: "Cancel",
    noCustodians: "No organisations yet.",
    statusActive: "Active",
    statusInactive: "Inactive",
    kindBadge: (kind) => (kind === "birsa" ? "BIRSA (global)" : "Club"),
    noContact: "No contact details on file.",
    errorRequired: "Fill in all required fields",
    errorDuplicate: "That slug is already used",
    errorForbidden: "Your account does not have permission to do this",
    errorGeneric: "Something went wrong. Try again.",
  },
  th: {
    addOrganisation: "เพิ่มองค์กร/ชมรม",
    hideForm: "ยกเลิก",
    slugLabel: "รหัส (slug)",
    slugHint: "รหัสสั้น ๆ ที่ไม่ซ้ำกัน เช่น hiking-club",
    kindLabel: "ประเภท",
    kindBirsa: "BIRSA (ส่วนกลาง)",
    kindClub: "ชมรม",
    nameEnLabel: "ชื่อ (อังกฤษ)",
    nameThLabel: "ชื่อ (ไทย)",
    contactNameEnLabel: "ชื่อผู้ติดต่อ (อังกฤษ)",
    contactNameThLabel: "ชื่อผู้ติดต่อ (ไทย)",
    contactEmailLabel: "อีเมลติดต่อ",
    contactInstagramLabel: "Instagram ติดต่อ",
    contactOtherLabel: "ข้อมูลติดต่ออื่น ๆ",
    borrowNoteEnLabel: "หมายเหตุการยืม (อังกฤษ)",
    borrowNoteThLabel: "หมายเหตุการยืม (ไทย)",
    sortOrderLabel: "ลำดับการแสดงผล",
    activeLabel: "เปิดใช้งาน",
    required: "จำเป็น",
    optional: "ไม่บังคับ",
    create: "สร้าง",
    creating: "กำลังสร้าง...",
    created: "สร้างแล้ว",
    edit: "แก้ไข",
    save: "บันทึก",
    saving: "กำลังบันทึก...",
    saved: "บันทึกแล้ว",
    cancel: "ยกเลิก",
    noCustodians: "ยังไม่มีองค์กร/ชมรม",
    statusActive: "เปิดใช้งาน",
    statusInactive: "ปิดใช้งาน",
    kindBadge: (kind) => (kind === "birsa" ? "BIRSA (ส่วนกลาง)" : "ชมรม"),
    noContact: "ยังไม่มีข้อมูลติดต่อ",
    errorRequired: "กรุณากรอกข้อมูลที่จำเป็นให้ครบ",
    errorDuplicate: "รหัสนี้ถูกใช้แล้ว",
    errorForbidden: "บัญชีของคุณไม่มีสิทธิ์ทำรายการนี้",
    errorGeneric: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
  },
};

type CustodianResponse = { ok: true; custodian: Custodian } | { ok: false; reason?: string };

export default function CustodiansManager({
  locale,
  custodians: initialCustodians,
}: CustodiansManagerProps) {
  const t = copy[locale];
  const [custodians, setCustodians] = useState<Custodian[]>(initialCustodians);

  return (
    <div className="flex flex-col gap-6">
      <CreateSection t={t} setCustodians={setCustodians} />

      {custodians.length === 0 ? (
        <p className="text-muted text-sm">{t.noCustodians}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {custodians.map((custodian) => (
            <CustodianRow
              key={custodian.id}
              custodian={custodian}
              t={t}
              locale={locale}
              setCustodians={setCustodians}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function CreateSection({
  t,
  setCustodians,
}: {
  t: Copy;
  setCustodians: React.Dispatch<React.SetStateAction<Custodian[]>>;
}) {
  const formId = useId();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    kind: "club" as CustodianKind,
    nameEn: "",
    nameTh: "",
    contactNameEn: "",
    contactNameTh: "",
    contactEmail: "",
    contactInstagram: "",
    contactOther: "",
    sortOrder: "0",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (!form.slug.trim() || !form.nameEn.trim() || !form.nameTh.trim()) {
      setError(t.errorRequired);
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/inventory/custodians", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: form.slug.trim(),
          kind: form.kind,
          name: { en: form.nameEn.trim(), th: form.nameTh.trim() },
          contactName: { en: form.contactNameEn.trim(), th: form.contactNameTh.trim() },
          contactEmail: form.contactEmail.trim() || null,
          contactInstagram: form.contactInstagram.trim() || null,
          contactOther: form.contactOther.trim() || null,
          sortOrder: form.sortOrder.trim() !== "" ? Number(form.sortOrder) : undefined,
        }),
      });
      const result = (await response.json().catch(() => null)) as CustodianResponse | null;
      if (response.ok && result?.ok) {
        setCustodians((prev) =>
          [...prev, result.custodian].sort(
            (a, b) => a.sortOrder - b.sortOrder || a.name.en.localeCompare(b.name.en)
          )
        );
        setForm({
          slug: "",
          kind: "club",
          nameEn: "",
          nameTh: "",
          contactNameEn: "",
          contactNameTh: "",
          contactEmail: "",
          contactInstagram: "",
          contactOther: "",
          sortOrder: "0",
        });
        setCreateOpen(false);
        setMessage(t.created);
        return;
      }
      if (response.status === 403) setError(t.errorForbidden);
      else if (response.status === 409) setError(t.errorDuplicate);
      else setError(t.errorGeneric);
    } catch {
      setError(t.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant={createOpen ? "secondary" : "primary"}
          aria-expanded={createOpen}
          aria-controls={`${formId}-create-form`}
          onClick={() => setCreateOpen((prev) => !prev)}
        >
          {createOpen ? t.hideForm : t.addOrganisation}
        </Button>
      </div>

      {message ? (
        <p role="status" className="text-success text-sm font-medium">
          {message}
        </p>
      ) : null}

      {createOpen ? (
        <form
          id={`${formId}-create-form`}
          onSubmit={handleCreate}
          noValidate
          aria-live="polite"
          className="border-line bg-sunken flex flex-col gap-4 rounded-lg border p-5"
        >
          {error ? (
            <p role="alert" className="text-error text-sm font-medium">
              {error}
            </p>
          ) : null}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              id={`${formId}-slug`}
              name="slug"
              label={t.slugLabel}
              hint={t.slugHint}
              required
              requiredLabel={t.required}
              value={form.slug}
              onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
            />
            <Field
              id={`${formId}-kind`}
              name="kind"
              as="select"
              label={t.kindLabel}
              required
              requiredLabel={t.required}
              value={form.kind}
              options={[
                { value: "club", label: t.kindClub },
                { value: "birsa", label: t.kindBirsa },
              ]}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, kind: event.target.value as CustodianKind }))
              }
            />
            <Field
              id={`${formId}-nameEn`}
              name="nameEn"
              label={t.nameEnLabel}
              required
              requiredLabel={t.required}
              value={form.nameEn}
              onChange={(event) => setForm((prev) => ({ ...prev, nameEn: event.target.value }))}
            />
            <Field
              id={`${formId}-nameTh`}
              name="nameTh"
              label={t.nameThLabel}
              required
              requiredLabel={t.required}
              value={form.nameTh}
              onChange={(event) => setForm((prev) => ({ ...prev, nameTh: event.target.value }))}
            />
            <Field
              id={`${formId}-contactNameEn`}
              name="contactNameEn"
              label={t.contactNameEnLabel}
              optionalLabel={t.optional}
              value={form.contactNameEn}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, contactNameEn: event.target.value }))
              }
            />
            <Field
              id={`${formId}-contactNameTh`}
              name="contactNameTh"
              label={t.contactNameThLabel}
              optionalLabel={t.optional}
              value={form.contactNameTh}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, contactNameTh: event.target.value }))
              }
            />
            <Field
              id={`${formId}-contactEmail`}
              name="contactEmail"
              type="email"
              label={t.contactEmailLabel}
              optionalLabel={t.optional}
              value={form.contactEmail}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, contactEmail: event.target.value }))
              }
            />
            <Field
              id={`${formId}-contactInstagram`}
              name="contactInstagram"
              label={t.contactInstagramLabel}
              optionalLabel={t.optional}
              value={form.contactInstagram}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, contactInstagram: event.target.value }))
              }
            />
            <Field
              id={`${formId}-contactOther`}
              name="contactOther"
              label={t.contactOtherLabel}
              optionalLabel={t.optional}
              value={form.contactOther}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, contactOther: event.target.value }))
              }
            />
            <Field
              id={`${formId}-sortOrder`}
              name="sortOrder"
              type="number"
              label={t.sortOrderLabel}
              optionalLabel={t.optional}
              value={form.sortOrder}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, sortOrder: event.target.value }))
              }
            />
          </div>
          <div>
            <Button type="submit" disabled={submitting}>
              {submitting ? t.creating : t.create}
            </Button>
          </div>
        </form>
      ) : null}
    </section>
  );
}

function CustodianRow({
  custodian,
  t,
  locale,
  setCustodians,
}: {
  custodian: Custodian;
  t: Copy;
  locale: Locale;
  setCustodians: React.Dispatch<React.SetStateAction<Custodian[]>>;
}) {
  const formId = useId();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    nameEn: custodian.name.en,
    nameTh: custodian.name.th,
    contactNameEn: custodian.contactName.en,
    contactNameTh: custodian.contactName.th,
    contactEmail: custodian.contactEmail ?? "",
    contactInstagram: custodian.contactInstagram ?? "",
    contactOther: custodian.contactOther ?? "",
    borrowNoteEn: custodian.borrowNote.en,
    borrowNoteTh: custodian.borrowNote.th,
    sortOrder: String(custodian.sortOrder),
    isActive: custodian.isActive,
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!form.nameEn.trim() || !form.nameTh.trim()) {
      setError(t.errorRequired);
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(`/api/inventory/custodians/${custodian.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: { en: form.nameEn.trim(), th: form.nameTh.trim() },
          contactName: { en: form.contactNameEn.trim(), th: form.contactNameTh.trim() },
          contactEmail: form.contactEmail.trim() || null,
          contactInstagram: form.contactInstagram.trim() || null,
          contactOther: form.contactOther.trim() || null,
          borrowNote: { en: form.borrowNoteEn.trim(), th: form.borrowNoteTh.trim() },
          sortOrder: Number(form.sortOrder),
          isActive: form.isActive,
        }),
      });
      const result = (await response.json().catch(() => null)) as CustodianResponse | null;
      if (response.ok && result?.ok) {
        setCustodians((prev) =>
          prev.map((existing) => (existing.id === custodian.id ? result.custodian : existing))
        );
        setEditing(false);
        setSavedMessage(t.saved);
        router.refresh();
        return;
      }
      if (response.status === 403) setError(t.errorForbidden);
      else if (response.status === 409) setError(t.errorDuplicate);
      else setError(t.errorGeneric);
    } catch {
      setError(t.errorGeneric);
    } finally {
      setSaving(false);
    }
  }

  const contactBits = [
    custodian.contactName[locale],
    custodian.contactEmail,
    custodian.contactInstagram,
    custodian.contactOther,
  ].filter((bit): bit is string => !!bit && bit.trim() !== "");

  return (
    <li className="border-line bg-surface flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-ink font-semibold">{custodian.name[locale]}</p>
          <p className="text-muted text-sm">
            {custodian.slug} &middot; {t.kindBadge(custodian.kind)} &middot;{" "}
            <span className={custodian.isActive ? "text-success" : "text-error"}>
              {custodian.isActive ? t.statusActive : t.statusInactive}
            </span>
          </p>
          <p className="text-ink mt-1 text-sm">
            {contactBits.length > 0 ? contactBits.join(" · ") : t.noContact}
          </p>
        </div>
        <Button
          variant="ghost"
          aria-expanded={editing}
          aria-controls={`${formId}-edit-form`}
          onClick={() => {
            setEditing((prev) => !prev);
            setSavedMessage(null);
          }}
        >
          {editing ? t.cancel : t.edit}
        </Button>
      </div>

      {savedMessage && !editing ? (
        <p role="status" className="text-success text-sm font-medium">
          {savedMessage}
        </p>
      ) : null}

      {editing ? (
        <form
          id={`${formId}-edit-form`}
          onSubmit={handleSave}
          noValidate
          aria-live="polite"
          className="border-line flex flex-col gap-4 border-t pt-4"
        >
          {error ? (
            <p role="alert" className="text-error text-sm font-medium">
              {error}
            </p>
          ) : null}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              id={`${formId}-nameEn`}
              name="nameEn"
              label={t.nameEnLabel}
              required
              requiredLabel={t.required}
              value={form.nameEn}
              onChange={(event) => setForm((prev) => ({ ...prev, nameEn: event.target.value }))}
            />
            <Field
              id={`${formId}-nameTh`}
              name="nameTh"
              label={t.nameThLabel}
              required
              requiredLabel={t.required}
              value={form.nameTh}
              onChange={(event) => setForm((prev) => ({ ...prev, nameTh: event.target.value }))}
            />
            <Field
              id={`${formId}-contactNameEn`}
              name="contactNameEn"
              label={t.contactNameEnLabel}
              optionalLabel={t.optional}
              value={form.contactNameEn}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, contactNameEn: event.target.value }))
              }
            />
            <Field
              id={`${formId}-contactNameTh`}
              name="contactNameTh"
              label={t.contactNameThLabel}
              optionalLabel={t.optional}
              value={form.contactNameTh}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, contactNameTh: event.target.value }))
              }
            />
            <Field
              id={`${formId}-contactEmail`}
              name="contactEmail"
              type="email"
              label={t.contactEmailLabel}
              optionalLabel={t.optional}
              value={form.contactEmail}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, contactEmail: event.target.value }))
              }
            />
            <Field
              id={`${formId}-contactInstagram`}
              name="contactInstagram"
              label={t.contactInstagramLabel}
              optionalLabel={t.optional}
              value={form.contactInstagram}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, contactInstagram: event.target.value }))
              }
            />
            <Field
              id={`${formId}-contactOther`}
              name="contactOther"
              label={t.contactOtherLabel}
              optionalLabel={t.optional}
              value={form.contactOther}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, contactOther: event.target.value }))
              }
            />
            <Field
              id={`${formId}-sortOrder`}
              name="sortOrder"
              type="number"
              label={t.sortOrderLabel}
              value={form.sortOrder}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, sortOrder: event.target.value }))
              }
            />
            <Field
              id={`${formId}-borrowNoteEn`}
              name="borrowNoteEn"
              as="textarea"
              label={t.borrowNoteEnLabel}
              optionalLabel={t.optional}
              value={form.borrowNoteEn}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, borrowNoteEn: event.target.value }))
              }
            />
            <Field
              id={`${formId}-borrowNoteTh`}
              name="borrowNoteTh"
              as="textarea"
              label={t.borrowNoteThLabel}
              optionalLabel={t.optional}
              value={form.borrowNoteTh}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, borrowNoteTh: event.target.value }))
              }
            />
          </div>
          <label className="flex w-fit items-center gap-2 py-1">
            <input
              type="checkbox"
              id={`${formId}-isActive`}
              name="isActive"
              checked={form.isActive}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, isActive: event.target.checked }))
              }
              className="focus-halo h-5 w-5 rounded border-input-border"
            />
            <span className="text-ink text-sm font-semibold">{t.activeLabel}</span>
          </label>
          <div>
            <Button type="submit" disabled={saving}>
              {saving ? t.saving : t.save}
            </Button>
          </div>
        </form>
      ) : null}
    </li>
  );
}
