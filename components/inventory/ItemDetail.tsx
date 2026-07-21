"use client";

/**
 * Officer console: single item detail. Lets write-role officers edit the
 * item's core fields, retire/restore it, manage its individually-tracked
 * units (asset items) including opening/closing maintenance, and adjust
 * stock (consumable items). Read-only/loan-officer roles see the same data
 * with every mutation control hidden (the API also enforces this via 403).
 */
import { useId, useState } from "react";
import type { FormEvent } from "react";
import clsx from "clsx";
import Field from "@/components/Field";
import ErrorSummary, { type ErrorSummaryItem } from "@/components/ErrorSummary";
import Button from "@/components/Button";
import Notice from "@/components/Notice";
import Accordion from "@/components/Accordion";
import PhotoUpload from "@/components/inventory/PhotoUpload";
import { useConfirmDialog } from "@/lib/useConfirmDialog";
import { formatDate, type Locale } from "@/lib/i18n";
import type {
  Category,
  ConsumableAdjustment,
  Custodian,
  Item,
  Location,
  Role,
  TrackingMode,
  Unit,
  UnitCondition,
  UnitState,
} from "@/lib/inventory/types";

export type ItemDetailProps = {
  item: Item;
  units: Unit[];
  categories: Category[];
  locations: Location[];
  custodians: Custodian[];
  scopedCustodianId: string | null;
  role: Role;
  locale: Locale;
  adjustments?: ConsumableAdjustment[];
  availability?: { total: number; available: number; kind: TrackingMode };
};

type Copy = {
  keyLabel: string;
  categoryLabel: string;
  noCategory: string;
  locationLabel: string;
  noLocation: string;
  maxLoanDaysLabel: string;
  availabilityLabel: (available: number, total: number) => string;
  retiredTag: string;
  assetTag: string;
  consumableTag: string;
  ownerLabel: string;
  ownerFieldLabel: string;
  onlineLoanableLabel: string;
  onlineTag: string;
  notOnlineTag: string;

  photoTitle: string;
  photoAltLabel: (name: string) => string;
  photoUploadLabel: string;
  photoUploadingLabel: string;
  photoRemoveLabel: string;
  photoHintLabel: string;
  photoTooLargeLabel: string;
  photoNotConfiguredLabel: string;
  photoErrorLabel: string;
  photoUpdated: string;

  editTitle: string;
  nameEnLabel: string;
  nameThLabel: string;
  descriptionEnLabel: string;
  descriptionThLabel: string;
  reorderThresholdLabel: string;
  required: string;
  optional: string;
  save: string;
  saving: string;
  saved: string;

  retire: string;
  retiring: string;
  restore: string;
  restoring: string;
  confirmRetireTitle: string;
  confirmRetireBody: string;
  confirmLabel: string;
  cancelLabel: string;
  retiredMessage: string;
  restoredMessage: string;

  unitsTitle: string;
  addUnit: string;
  hideForm: string;
  labelLabel: string;
  conditionLabel: string;
  stateLabel: string;
  notesLabel: string;
  addUnitSubmit: string;
  addingUnit: string;
  unitAdded: string;
  noUnits: string;
  editUnit: string;
  saveUnit: string;
  savingUnit: string;
  unitSaved: string;

  conditionLabels: Record<UnitCondition, string>;
  stateLabels: Record<UnitState, string>;

  reportIssue: string;
  issueLabel: string;
  conditionBeforeLabel: string;
  openMaintenance: string;
  openingMaintenance: string;
  maintenanceOpened: string;
  closeMaintenance: string;
  actionTakenLabel: string;
  conditionAfterLabel: string;
  closeMaintenanceSubmit: string;
  closingMaintenance: string;
  maintenanceClosed: string;
  maintenanceUnknownEntry: string;

  stockTitle: string;
  currentQty: string;
  deltaLabel: string;
  deltaHint: string;
  reasonLabel: string;
  adjustSubmit: string;
  adjusting: string;
  adjustedWithQty: (qty: number) => string;
  historyTitle: string;
  historyEmpty: string;
  historyDate: string;
  historyDelta: string;
  historyReason: string;
  historyResulting: string;

  errorRequired: string;
  errorForbidden: string;
  errorNotFound: string;
  errorInsufficient: string;
  errorGeneric: string;
  errorSummaryTitle: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    keyLabel: "Key",
    categoryLabel: "Category",
    noCategory: "Uncategorised",
    locationLabel: "Default location",
    noLocation: "No default location",
    maxLoanDaysLabel: "Maximum loan days",
    availabilityLabel: (available, total) => `${available} of ${total} available`,
    retiredTag: "Retired",
    assetTag: "Asset",
    consumableTag: "Consumable",
    ownerLabel: "Owner",
    ownerFieldLabel: "Owner",
    onlineLoanableLabel: "Available to request online",
    onlineTag: "Online",
    notOnlineTag: "Not online",

    photoTitle: "Photo",
    photoAltLabel: (name) => `Photo of ${name}`,
    photoUploadLabel: "Upload photo",
    photoUploadingLabel: "Uploading...",
    photoRemoveLabel: "Remove selection",
    photoHintLabel: "JPG or PNG, up to 5 MB.",
    photoTooLargeLabel: "That file is too large. Choose an image up to 5 MB.",
    photoNotConfiguredLabel: "Photo uploads are not set up for this site yet.",
    photoErrorLabel: "Could not upload the photo. Try again.",
    photoUpdated: "Photo updated.",

    editTitle: "Edit item details",
    nameEnLabel: "Name (English)",
    nameThLabel: "Name (Thai)",
    descriptionEnLabel: "Description (English)",
    descriptionThLabel: "Description (Thai)",
    reorderThresholdLabel: "Reorder threshold",
    required: "required",
    optional: "optional",
    save: "Save changes",
    saving: "Saving...",
    saved: "Item updated.",

    retire: "Retire item",
    retiring: "Retiring...",
    restore: "Restore item",
    restoring: "Restoring...",
    confirmRetireTitle: "Retire this item?",
    confirmRetireBody: "It will be hidden from active loans but kept in records.",
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
    retiredMessage: "Item retired.",
    restoredMessage: "Item restored.",

    unitsTitle: "Units",
    addUnit: "Add unit",
    hideForm: "Cancel",
    labelLabel: "Label",
    conditionLabel: "Condition",
    stateLabel: "State",
    notesLabel: "Notes",
    addUnitSubmit: "Add unit",
    addingUnit: "Adding...",
    unitAdded: "Unit added.",
    noUnits: "No units yet. Add one above.",
    editUnit: "Edit",
    saveUnit: "Save",
    savingUnit: "Saving...",
    unitSaved: "Unit updated.",

    conditionLabels: { good: "Good", worn: "Worn", damaged: "Damaged", lost: "Lost" },
    stateLabels: {
      available: "Available",
      reserved: "Reserved",
      on_loan: "On loan",
      maintenance: "In maintenance",
      retired: "Retired",
    },

    reportIssue: "Report issue",
    issueLabel: "Issue",
    conditionBeforeLabel: "Condition before",
    openMaintenance: "Send to maintenance",
    openingMaintenance: "Sending...",
    maintenanceOpened: "Unit sent to maintenance.",
    closeMaintenance: "Close maintenance",
    actionTakenLabel: "Action taken",
    conditionAfterLabel: "Condition after",
    closeMaintenanceSubmit: "Mark as fixed",
    closingMaintenance: "Saving...",
    maintenanceClosed: "Maintenance closed, unit is available again.",
    maintenanceUnknownEntry:
      "This unit is in maintenance, but its maintenance record was opened outside this session, so it cannot be closed from here.",

    stockTitle: "Stock",
    currentQty: "Current quantity on hand",
    deltaLabel: "Change",
    deltaHint: "Positive to restock, negative to draw down.",
    reasonLabel: "Reason",
    adjustSubmit: "Apply adjustment",
    adjusting: "Applying...",
    adjustedWithQty: (qty) => `Stock adjusted. Current quantity on hand: ${qty}.`,
    historyTitle: "Adjustment history",
    historyEmpty: "No adjustments recorded yet.",
    historyDate: "Date",
    historyDelta: "Change",
    historyReason: "Reason",
    historyResulting: "Resulting qty",

    errorRequired: "Fill in all required fields",
    errorForbidden: "Your account does not have permission to do this",
    errorNotFound: "This record no longer exists. Refresh the page.",
    errorInsufficient: "That would take stock below zero",
    errorGeneric: "Something went wrong. Try again.",
    errorSummaryTitle: "There is a problem",
  },
  th: {
    keyLabel: "รหัส",
    categoryLabel: "หมวดหมู่",
    noCategory: "ไม่มีหมวดหมู่",
    locationLabel: "สถานที่จัดเก็บเริ่มต้น",
    noLocation: "ไม่ระบุสถานที่เริ่มต้น",
    maxLoanDaysLabel: "จำนวนวันยืมสูงสุด",
    availabilityLabel: (available, total) => `พร้อมใช้งาน ${available} จาก ${total}`,
    retiredTag: "เลิกใช้แล้ว",
    assetTag: "ครุภัณฑ์",
    consumableTag: "วัสดุสิ้นเปลือง",
    ownerLabel: "เจ้าของ",
    ownerFieldLabel: "เจ้าของ",
    onlineLoanableLabel: "เปิดให้ยืมผ่านระบบออนไลน์",
    onlineTag: "ออนไลน์",
    notOnlineTag: "ไม่ออนไลน์",

    photoTitle: "รูปภาพ",
    photoAltLabel: (name) => `รูปภาพของ ${name}`,
    photoUploadLabel: "อัปโหลดรูปภาพ",
    photoUploadingLabel: "กำลังอัปโหลด...",
    photoRemoveLabel: "ยกเลิกการเลือกไฟล์",
    photoHintLabel: "ไฟล์ JPG หรือ PNG ขนาดไม่เกิน 5 MB",
    photoTooLargeLabel: "ไฟล์นี้มีขนาดใหญ่เกินไป กรุณาเลือกรูปภาพขนาดไม่เกิน 5 MB",
    photoNotConfiguredLabel: "ระบบอัปโหลดรูปภาพยังไม่พร้อมใช้งานสำหรับเว็บไซต์นี้",
    photoErrorLabel: "ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง",
    photoUpdated: "อัปเดตรูปภาพแล้ว",

    editTitle: "แก้ไขรายละเอียดรายการ",
    nameEnLabel: "ชื่อ (อังกฤษ)",
    nameThLabel: "ชื่อ (ไทย)",
    descriptionEnLabel: "รายละเอียด (อังกฤษ)",
    descriptionThLabel: "รายละเอียด (ไทย)",
    reorderThresholdLabel: "เกณฑ์แจ้งเตือนสั่งซื้อเพิ่ม",
    required: "จำเป็น",
    optional: "ไม่บังคับ",
    save: "บันทึกการเปลี่ยนแปลง",
    saving: "กำลังบันทึก...",
    saved: "อัปเดตรายการแล้ว",

    retire: "เลิกใช้รายการ",
    retiring: "กำลังเลิกใช้...",
    restore: "กู้คืนรายการ",
    restoring: "กำลังกู้คืน...",
    confirmRetireTitle: "เลิกใช้รายการนี้ใช่หรือไม่",
    confirmRetireBody: "รายการจะถูกซ่อนจากการยืมแต่ยังเก็บประวัติไว้",
    confirmLabel: "ยืนยัน",
    cancelLabel: "ยกเลิก",
    retiredMessage: "เลิกใช้รายการแล้ว",
    restoredMessage: "กู้คืนรายการแล้ว",

    unitsTitle: "หน่วยย่อย",
    addUnit: "เพิ่มหน่วยย่อย",
    hideForm: "ยกเลิก",
    labelLabel: "ป้ายชื่อ",
    conditionLabel: "สภาพ",
    stateLabel: "สถานะ",
    notesLabel: "หมายเหตุ",
    addUnitSubmit: "เพิ่มหน่วยย่อย",
    addingUnit: "กำลังเพิ่ม...",
    unitAdded: "เพิ่มหน่วยย่อยแล้ว",
    noUnits: "ยังไม่มีหน่วยย่อย เพิ่มได้ที่ด้านบน",
    editUnit: "แก้ไข",
    saveUnit: "บันทึก",
    savingUnit: "กำลังบันทึก...",
    unitSaved: "อัปเดตหน่วยย่อยแล้ว",

    conditionLabels: { good: "ดี", worn: "สึกหรอ", damaged: "ชำรุด", lost: "สูญหาย" },
    stateLabels: {
      available: "พร้อมใช้งาน",
      reserved: "ถูกจอง",
      on_loan: "อยู่ระหว่างยืม",
      maintenance: "อยู่ระหว่างซ่อม",
      retired: "เลิกใช้แล้ว",
    },

    reportIssue: "แจ้งปัญหา",
    issueLabel: "ปัญหา",
    conditionBeforeLabel: "สภาพก่อนซ่อม",
    openMaintenance: "ส่งซ่อม",
    openingMaintenance: "กำลังส่งซ่อม...",
    maintenanceOpened: "ส่งหน่วยย่อยเข้าซ่อมแล้ว",
    closeMaintenance: "ปิดงานซ่อม",
    actionTakenLabel: "การดำเนินการ",
    conditionAfterLabel: "สภาพหลังซ่อม",
    closeMaintenanceSubmit: "บันทึกว่าซ่อมเสร็จแล้ว",
    closingMaintenance: "กำลังบันทึก...",
    maintenanceClosed: "ปิดงานซ่อมแล้ว หน่วยย่อยพร้อมใช้งานอีกครั้ง",
    maintenanceUnknownEntry:
      "หน่วยย่อยนี้อยู่ระหว่างซ่อม แต่รายการซ่อมถูกเปิดไว้นอกเซสชันนี้ จึงไม่สามารถปิดงานซ่อมจากหน้านี้ได้",

    stockTitle: "สต๊อก",
    currentQty: "จำนวนคงเหลือปัจจุบัน",
    deltaLabel: "จำนวนที่เปลี่ยนแปลง",
    deltaHint: "ใส่ค่าบวกเพื่อเติมสต๊อก ค่าลบเพื่อเบิกออก",
    reasonLabel: "เหตุผล",
    adjustSubmit: "บันทึกการปรับสต๊อก",
    adjusting: "กำลังบันทึก...",
    adjustedWithQty: (qty) => `ปรับสต๊อกแล้ว จำนวนคงเหลือปัจจุบันคือ ${qty}`,
    historyTitle: "ประวัติการปรับสต๊อก",
    historyEmpty: "ยังไม่มีประวัติการปรับสต๊อก",
    historyDate: "วันที่",
    historyDelta: "จำนวนที่เปลี่ยนแปลง",
    historyReason: "เหตุผล",
    historyResulting: "จำนวนคงเหลือหลังปรับ",

    errorRequired: "กรุณากรอกข้อมูลที่จำเป็นให้ครบ",
    errorForbidden: "บัญชีของคุณไม่มีสิทธิ์ทำรายการนี้",
    errorNotFound: "ไม่พบข้อมูลนี้แล้ว กรุณารีเฟรชหน้า",
    errorInsufficient: "การปรับนี้จะทำให้สต๊อกติดลบ",
    errorGeneric: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
    errorSummaryTitle: "พบข้อผิดพลาด กรุณาตรวจสอบ",
  },
};

const CAN_WRITE: Role[] = ["admin", "inventory_manager"];
const CONDITIONS: UnitCondition[] = ["good", "worn", "damaged", "lost"];
const STATES: UnitState[] = ["available", "reserved", "on_loan", "maintenance", "retired"];

const conditionTint: Record<UnitCondition, string> = {
  good: "bg-success-tint text-success",
  worn: "bg-warning-tint text-warning",
  damaged: "bg-error-tint text-error",
  lost: "bg-error-tint text-error",
};

const stateTint: Record<UnitState, string> = {
  available: "bg-success-tint text-success",
  reserved: "bg-warning-tint text-warning",
  on_loan: "bg-info-tint text-ink",
  maintenance: "bg-warning-tint text-warning",
  retired: "bg-sunken text-muted",
};

function Pill({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * Reusable status/error live region (WCAG 4.1.3). Success and in-progress
 * feedback uses `role="status"` (implicit polite live region) so it is
 * announced without moving focus; errors use `role="alert"` (implicit
 * assertive live region) so they interrupt. Used for every async action's
 * feedback in this file so screen reader users get consistent announcements.
 */
function LiveMessage({
  text,
  kind,
}: {
  text: string | null | undefined;
  kind: "success" | "error";
}) {
  if (!text) return null;
  return (
    <p
      role={kind === "error" ? "alert" : "status"}
      className={clsx("text-sm font-medium", kind === "success" ? "text-success" : "text-error")}
    >
      {text}
    </p>
  );
}

type ItemPatchResponse = { ok: boolean; item?: Item; reason?: string };
type UnitCreateResponse = {
  ok: boolean;
  unit?: Unit;
  reason?: string;
  errors?: Record<string, string[]>;
};
type UnitPatchResponse = { ok: boolean; unit?: Unit; reason?: string };
type MaintenanceOpenResponse = {
  ok: boolean;
  entry?: { id: string; unitId: string };
  reason?: string;
  errors?: Record<string, string[]>;
};
type MaintenanceCloseResponse = {
  ok: boolean;
  entry?: { id: string; unitId: string };
  reason?: string;
};
type AdjustResponse = { ok: boolean; resultingQty?: number; reason?: string };

export default function ItemDetail({
  item: initialItem,
  units: initialUnits,
  categories,
  locations,
  custodians,
  scopedCustodianId,
  role,
  locale,
  adjustments: initialAdjustments = [],
  availability,
}: ItemDetailProps) {
  const t = copy[locale];
  const canWrite = CAN_WRITE.includes(role);
  const formId = useId();
  const { confirm, dialog } = useConfirmDialog({
    confirmLabel: t.confirmLabel,
    cancelLabel: t.cancelLabel,
  });
  const isGlobal = scopedCustodianId === null;
  const activeCustodians = custodians.filter((c) => c.isActive);

  const [item, setItem] = useState<Item>(initialItem);
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [adjustments, setAdjustments] = useState<ConsumableAdjustment[]>(initialAdjustments);
  const [openMaintenanceEntryByUnit, setOpenMaintenanceEntryByUnit] = useState<
    Record<string, string>
  >({});

  const owner = custodians.find((c) => c.id === item.custodianId);

  // --- Edit item details ---
  const [editForm, setEditForm] = useState({
    nameEn: item.name.en,
    nameTh: item.name.th,
    descriptionEn: item.description.en,
    descriptionTh: item.description.th,
    categoryId: item.categoryId ?? "",
    defaultLocationId: item.defaultLocationId ?? "",
    maxLoanDays: String(item.maxLoanDays),
    reorderThreshold: item.reorderThreshold != null ? String(item.reorderThreshold) : "",
    custodianId: item.custodianId,
    onlineLoanable: item.onlineLoanable,
  });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [editError, setEditError] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editSaved, setEditSaved] = useState<string | null>(null);

  const [retireBusy, setRetireBusy] = useState(false);
  const [retireMessage, setRetireMessage] = useState<{
    text: string;
    kind: "success" | "error";
  } | null>(null);

  // --- Photo ---
  const [photoMessage, setPhotoMessage] = useState<{
    text: string;
    kind: "success" | "error";
  } | null>(null);

  async function handlePhotoUploaded(url: string) {
    setPhotoMessage(null);
    try {
      const response = await fetch(`/api/inventory/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl: url }),
      });
      const result = (await response.json().catch(() => null)) as ItemPatchResponse | null;
      if (response.ok && result?.ok && result.item) {
        setItem(result.item);
        setPhotoMessage({ text: t.photoUpdated, kind: "success" });
        return;
      }
      setPhotoMessage({
        text: response.status === 403 ? t.errorForbidden : t.errorGeneric,
        kind: "error",
      });
    } catch {
      setPhotoMessage({ text: t.errorGeneric, kind: "error" });
    }
  }

  async function handleSaveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEditError(null);
    setEditErrors({});
    setEditSaved(null);

    if (!editForm.nameEn.trim() || !editForm.nameTh.trim() || !editForm.maxLoanDays.trim()) {
      const fieldErrors: Record<string, string> = {};
      if (!editForm.nameEn.trim()) fieldErrors.nameEn = t.errorRequired;
      if (!editForm.nameTh.trim()) fieldErrors.nameTh = t.errorRequired;
      if (!editForm.maxLoanDays.trim()) fieldErrors.maxLoanDays = t.errorRequired;
      setEditErrors(fieldErrors);
      setEditError(t.errorRequired);
      return;
    }

    setEditSaving(true);
    try {
      const body: Record<string, unknown> = {
        name: { en: editForm.nameEn.trim(), th: editForm.nameTh.trim() },
        description: { en: editForm.descriptionEn.trim(), th: editForm.descriptionTh.trim() },
        categoryId: editForm.categoryId || null,
        defaultLocationId: editForm.defaultLocationId || null,
        maxLoanDays: Number(editForm.maxLoanDays),
        onlineLoanable: editForm.onlineLoanable,
      };
      if (item.trackingMode === "consumable") {
        body.reorderThreshold =
          editForm.reorderThreshold.trim() !== "" ? Number(editForm.reorderThreshold) : null;
      }
      if (isGlobal && editForm.custodianId) {
        body.custodianId = editForm.custodianId;
      }

      const response = await fetch(`/api/inventory/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await response.json().catch(() => null)) as ItemPatchResponse | null;

      if (response.ok && result?.ok && result.item) {
        setItem(result.item);
        setEditSaved(t.saved);
        return;
      }
      if (response.status === 403) {
        setEditError(t.errorForbidden);
      } else if (response.status === 404) {
        setEditError(t.errorNotFound);
      } else {
        setEditError(t.errorGeneric);
      }
    } catch {
      setEditError(t.errorGeneric);
    } finally {
      setEditSaving(false);
    }
  }

  async function handleRetireToggle() {
    if (!item.isRetired) {
      const ok = await confirm({
        title: t.confirmRetireTitle,
        body: t.confirmRetireBody,
        danger: true,
      });
      if (!ok) return;
    }
    setRetireBusy(true);
    setRetireMessage(null);
    try {
      const response = item.isRetired
        ? await fetch(`/api/inventory/items/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isRetired: false }),
          })
        : await fetch(`/api/inventory/items/${item.id}`, { method: "DELETE" });
      const result = (await response.json().catch(() => null)) as ItemPatchResponse | null;
      if (response.ok && result?.ok && result.item) {
        setItem(result.item);
        setRetireMessage({
          text: item.isRetired ? t.restoredMessage : t.retiredMessage,
          kind: "success",
        });
      } else if (response.status === 403) {
        setRetireMessage({ text: t.errorForbidden, kind: "error" });
      } else {
        setRetireMessage({ text: t.errorGeneric, kind: "error" });
      }
    } catch {
      setRetireMessage({ text: t.errorGeneric, kind: "error" });
    } finally {
      setRetireBusy(false);
    }
  }

  const editErrorItems: ErrorSummaryItem[] = Object.entries(editErrors).map(([field, message]) => ({
    id: `${formId}-edit-${field}`,
    message,
  }));

  const categoryOptions = [
    { value: "", label: t.noCategory },
    ...categories.map((c) => ({ value: c.id, label: c.name[locale] })),
  ];
  const locationOptions = [
    { value: "", label: t.noLocation },
    ...locations.map((l) => ({ value: l.id, label: l.name[locale] })),
  ];

  // --- Add unit ---
  const [addUnitOpen, setAddUnitOpen] = useState(false);
  const [unitForm, setUnitForm] = useState({
    label: "",
    condition: "good" as UnitCondition,
    state: "available" as UnitState,
    locationId: "",
    notes: "",
  });
  const [unitFormError, setUnitFormError] = useState<string | null>(null);
  const [unitFormErrors, setUnitFormErrors] = useState<Record<string, string>>({});
  const [addingUnit, setAddingUnit] = useState(false);
  const [unitAddedMessage, setUnitAddedMessage] = useState<string | null>(null);

  async function handleAddUnit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUnitFormError(null);
    setUnitFormErrors({});
    setUnitAddedMessage(null);

    if (!unitForm.label.trim()) {
      setUnitFormError(t.errorRequired);
      setUnitFormErrors({ label: t.errorRequired });
      return;
    }

    setAddingUnit(true);
    try {
      const response = await fetch("/api/inventory/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          label: unitForm.label.trim(),
          condition: unitForm.condition,
          state: unitForm.state,
          locationId: unitForm.locationId || undefined,
          notes: unitForm.notes.trim() || undefined,
        }),
      });
      const result = (await response.json().catch(() => null)) as UnitCreateResponse | null;

      if (response.ok && result?.ok && result.unit) {
        const createdUnit = result.unit;
        setUnits((prev) => [...prev, createdUnit].sort((a, b) => a.label.localeCompare(b.label)));
        setUnitForm({
          label: "",
          condition: "good",
          state: "available",
          locationId: "",
          notes: "",
        });
        setAddUnitOpen(false);
        setUnitAddedMessage(t.unitAdded);
        return;
      }
      if (response.status === 403) {
        setUnitFormError(t.errorForbidden);
      } else if (result?.errors) {
        const flat: Record<string, string> = {};
        for (const [field, messages] of Object.entries(result.errors)) {
          if (messages?.[0]) flat[field] = messages[0];
        }
        setUnitFormErrors(flat);
        setUnitFormError(t.errorRequired);
      } else {
        setUnitFormError(t.errorGeneric);
      }
    } catch {
      setUnitFormError(t.errorGeneric);
    } finally {
      setAddingUnit(false);
    }
  }

  function updateUnitLocal(unit: Unit) {
    setUnits((prev) => prev.map((existing) => (existing.id === unit.id ? unit : existing)));
  }

  // --- Stock adjustment (consumable) ---
  const [delta, setDelta] = useState("");
  const [reason, setReason] = useState("");
  const [adjustError, setAdjustError] = useState<string | null>(null);
  const [deltaFieldError, setDeltaFieldError] = useState<string | null>(null);
  const [adjusting, setAdjusting] = useState(false);
  const [adjustMessage, setAdjustMessage] = useState<string | null>(null);

  async function handleAdjust(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAdjustError(null);
    setDeltaFieldError(null);
    setAdjustMessage(null);

    const deltaNum = Number(delta);
    if (delta.trim() === "" || Number.isNaN(deltaNum) || deltaNum === 0) {
      setAdjustError(t.errorRequired);
      setDeltaFieldError(t.errorRequired);
      return;
    }

    setAdjusting(true);
    try {
      const response = await fetch(`/api/inventory/consumables/${item.id}/adjust`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta: deltaNum, reason: reason.trim() || undefined }),
      });
      const result = (await response.json().catch(() => null)) as AdjustResponse | null;

      if (response.ok && result?.ok && result.resultingQty !== undefined) {
        const resultingQty = result.resultingQty;
        setItem((prev) => ({ ...prev, qtyOnHand: resultingQty }));
        setAdjustments((prev) => [
          {
            id: `local-${Date.now()}`,
            itemId: item.id,
            delta: deltaNum,
            reason: reason.trim() || null,
            borrowerId: null,
            officerId: null,
            resultingQty,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        setDelta("");
        setReason("");
        setAdjustMessage(t.adjustedWithQty(resultingQty));
        return;
      }
      if (response.status === 403) {
        setAdjustError(t.errorForbidden);
      } else if (response.status === 409) {
        setAdjustError(t.errorInsufficient);
      } else {
        setAdjustError(t.errorGeneric);
      }
    } catch {
      setAdjustError(t.errorGeneric);
    } finally {
      setAdjusting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="border-line bg-surface flex flex-col gap-4 rounded-lg border p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Pill className="bg-brand-tint text-brand-deep">
            {item.trackingMode === "asset" ? t.assetTag : t.consumableTag}
          </Pill>
          {item.isRetired ? <Pill className="bg-sunken text-muted">{t.retiredTag}</Pill> : null}
          {availability && item.trackingMode === "asset" ? (
            <Pill className="bg-info-tint text-ink">
              {t.availabilityLabel(availability.available, availability.total)}
            </Pill>
          ) : null}
          <Pill
            className={item.onlineLoanable ? "bg-forest-tint text-forest" : "bg-sunken text-muted"}
          >
            {item.onlineLoanable ? t.onlineTag : t.notOnlineTag}
          </Pill>
        </div>

        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted font-semibold">{t.keyLabel}</dt>
            <dd className="text-ink">{item.key}</dd>
          </div>
          <div>
            <dt className="text-muted font-semibold">{t.ownerLabel}</dt>
            <dd className="text-ink">{owner ? owner.name[locale] : ""}</dd>
          </div>
          <div>
            <dt className="text-muted font-semibold">{t.categoryLabel}</dt>
            <dd className="text-ink">
              {item.categoryId
                ? (categories.find((c) => c.id === item.categoryId)?.name[locale] ?? t.noCategory)
                : t.noCategory}
            </dd>
          </div>
          <div>
            <dt className="text-muted font-semibold">{t.locationLabel}</dt>
            <dd className="text-ink">
              {item.defaultLocationId
                ? (locations.find((l) => l.id === item.defaultLocationId)?.name[locale] ??
                  t.noLocation)
                : t.noLocation}
            </dd>
          </div>
          <div>
            <dt className="text-muted font-semibold">{t.maxLoanDaysLabel}</dt>
            <dd className="text-ink">{item.maxLoanDays}</dd>
          </div>
        </dl>
        {item.description[locale] ? (
          <p className="text-ink text-sm leading-relaxed">{item.description[locale]}</p>
        ) : null}

        {canWrite ? (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button variant="secondary" onClick={handleRetireToggle} disabled={retireBusy}>
              {item.isRetired
                ? retireBusy
                  ? t.restoring
                  : t.restore
                : retireBusy
                  ? t.retiring
                  : t.retire}
            </Button>
            <LiveMessage text={retireMessage?.text} kind={retireMessage?.kind ?? "success"} />
          </div>
        ) : null}
      </section>

      {canWrite ? (
        <section className="border-line bg-surface flex flex-col gap-4 rounded-lg border p-5 sm:p-6">
          <h2 className="font-display text-ink text-xl">{t.photoTitle}</h2>
          <PhotoUpload
            currentUrl={item.photoUrl}
            onUploaded={handlePhotoUploaded}
            labels={{
              upload: t.photoUploadLabel,
              uploading: t.photoUploadingLabel,
              remove: t.photoRemoveLabel,
              hint: t.photoHintLabel,
              tooLarge: t.photoTooLargeLabel,
              notConfigured: t.photoNotConfiguredLabel,
              error: t.photoErrorLabel,
              photoAlt: t.photoAltLabel(item.name[locale]),
            }}
          />
          <LiveMessage text={photoMessage?.text} kind={photoMessage?.kind ?? "success"} />
        </section>
      ) : null}

      {canWrite ? (
        <Accordion summary={t.editTitle}>
          <form
            onSubmit={handleSaveItem}
            noValidate
            aria-live="polite"
            className="flex flex-col gap-5 pt-2"
          >
            <ErrorSummary title={t.errorSummaryTitle} errors={editErrorItems} />
            <LiveMessage text={editErrorItems.length === 0 ? editError : null} kind="error" />
            <LiveMessage text={editSaved} kind="success" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                id={`${formId}-edit-nameEn`}
                name="nameEn"
                label={t.nameEnLabel}
                required
                requiredLabel={t.required}
                value={editForm.nameEn}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, nameEn: event.target.value }))
                }
                error={editErrors.nameEn}
              />
              <Field
                id={`${formId}-edit-nameTh`}
                name="nameTh"
                label={t.nameThLabel}
                required
                requiredLabel={t.required}
                value={editForm.nameTh}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, nameTh: event.target.value }))
                }
                error={editErrors.nameTh}
              />
              <Field
                id={`${formId}-edit-descriptionEn`}
                name="descriptionEn"
                as="textarea"
                label={t.descriptionEnLabel}
                optionalLabel={t.optional}
                value={editForm.descriptionEn}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, descriptionEn: event.target.value }))
                }
              />
              <Field
                id={`${formId}-edit-descriptionTh`}
                name="descriptionTh"
                as="textarea"
                label={t.descriptionThLabel}
                optionalLabel={t.optional}
                value={editForm.descriptionTh}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, descriptionTh: event.target.value }))
                }
              />
              <Field
                id={`${formId}-edit-categoryId`}
                name="categoryId"
                as="select"
                label={t.categoryLabel}
                optionalLabel={t.optional}
                value={editForm.categoryId}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, categoryId: event.target.value }))
                }
                options={categoryOptions}
              />
              <Field
                id={`${formId}-edit-defaultLocationId`}
                name="defaultLocationId"
                as="select"
                label={t.locationLabel}
                optionalLabel={t.optional}
                value={editForm.defaultLocationId}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, defaultLocationId: event.target.value }))
                }
                options={locationOptions}
              />
              <Field
                id={`${formId}-edit-maxLoanDays`}
                name="maxLoanDays"
                type="number"
                min={1}
                label={t.maxLoanDaysLabel}
                required
                requiredLabel={t.required}
                value={editForm.maxLoanDays}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, maxLoanDays: event.target.value }))
                }
                error={editErrors.maxLoanDays}
              />
              {item.trackingMode === "consumable" ? (
                <Field
                  id={`${formId}-edit-reorderThreshold`}
                  name="reorderThreshold"
                  type="number"
                  min={0}
                  label={t.reorderThresholdLabel}
                  optionalLabel={t.optional}
                  value={editForm.reorderThreshold}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, reorderThreshold: event.target.value }))
                  }
                />
              ) : null}
              {isGlobal ? (
                <Field
                  id={`${formId}-edit-custodianId`}
                  name="custodianId"
                  as="select"
                  label={t.ownerFieldLabel}
                  required
                  requiredLabel={t.required}
                  value={editForm.custodianId}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, custodianId: event.target.value }))
                  }
                  options={activeCustodians.map((c) => ({ value: c.id, label: c.name[locale] }))}
                />
              ) : null}
            </div>

            <label className="focus-halo border-input-border has-checked:border-brand has-checked:bg-brand-tint flex min-h-11 w-fit items-center gap-2 rounded-md border px-3.5 py-2.5 text-sm">
              <input
                type="checkbox"
                checked={editForm.onlineLoanable}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, onlineLoanable: event.target.checked }))
                }
                className="border-input-border h-5 w-5 rounded"
              />
              {t.onlineLoanableLabel}
            </label>

            <div>
              <Button type="submit" disabled={editSaving}>
                {editSaving ? t.saving : t.save}
              </Button>
            </div>
          </form>
        </Accordion>
      ) : null}

      {item.trackingMode === "asset" ? (
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-ink text-xl">{t.unitsTitle}</h2>
            {canWrite ? (
              <Button
                variant={addUnitOpen ? "secondary" : "primary"}
                onClick={() => setAddUnitOpen((prev) => !prev)}
                aria-expanded={addUnitOpen}
                aria-controls={`${formId}-add-unit-panel`}
              >
                {addUnitOpen ? t.hideForm : t.addUnit}
              </Button>
            ) : null}
          </div>

          <LiveMessage text={unitAddedMessage} kind="success" />

          {canWrite && addUnitOpen ? (
            <form
              id={`${formId}-add-unit-panel`}
              onSubmit={handleAddUnit}
              noValidate
              aria-live="polite"
              className="border-line bg-sunken flex flex-col gap-5 rounded-lg border p-5"
            >
              <LiveMessage text={unitFormError} kind="error" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field
                  id={`${formId}-unit-label`}
                  name="label"
                  label={t.labelLabel}
                  required
                  requiredLabel={t.required}
                  value={unitForm.label}
                  onChange={(event) =>
                    setUnitForm((prev) => ({ ...prev, label: event.target.value }))
                  }
                  error={unitFormErrors.label}
                />
                <Field
                  id={`${formId}-unit-condition`}
                  name="condition"
                  as="select"
                  label={t.conditionLabel}
                  value={unitForm.condition}
                  onChange={(event) =>
                    setUnitForm((prev) => ({
                      ...prev,
                      condition: event.target.value as UnitCondition,
                    }))
                  }
                  options={CONDITIONS.map((c) => ({ value: c, label: t.conditionLabels[c] }))}
                />
                <Field
                  id={`${formId}-unit-state`}
                  name="state"
                  as="select"
                  label={t.stateLabel}
                  value={unitForm.state}
                  onChange={(event) =>
                    setUnitForm((prev) => ({ ...prev, state: event.target.value as UnitState }))
                  }
                  options={STATES.map((s) => ({ value: s, label: t.stateLabels[s] }))}
                />
                <Field
                  id={`${formId}-unit-location`}
                  name="locationId"
                  as="select"
                  label={t.locationLabel}
                  optionalLabel={t.optional}
                  value={unitForm.locationId}
                  onChange={(event) =>
                    setUnitForm((prev) => ({ ...prev, locationId: event.target.value }))
                  }
                  options={locationOptions}
                />
                <Field
                  id={`${formId}-unit-notes`}
                  name="notes"
                  as="textarea"
                  label={t.notesLabel}
                  optionalLabel={t.optional}
                  className="sm:col-span-2"
                  value={unitForm.notes}
                  onChange={(event) =>
                    setUnitForm((prev) => ({ ...prev, notes: event.target.value }))
                  }
                />
              </div>
              <div>
                <Button type="submit" disabled={addingUnit}>
                  {addingUnit ? t.addingUnit : t.addUnitSubmit}
                </Button>
              </div>
            </form>
          ) : null}

          {units.length === 0 ? (
            <p className="text-muted text-sm">{t.noUnits}</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {units.map((unit) => (
                <UnitRow
                  key={unit.id}
                  unit={unit}
                  locale={locale}
                  t={t}
                  locations={locations}
                  canWrite={canWrite}
                  openMaintenanceEntryId={openMaintenanceEntryByUnit[unit.id]}
                  onUpdated={updateUnitLocal}
                  onMaintenanceOpened={(unitId, entryId) =>
                    setOpenMaintenanceEntryByUnit((prev) => ({ ...prev, [unitId]: entryId }))
                  }
                  onMaintenanceClosed={(unitId) =>
                    setOpenMaintenanceEntryByUnit((prev) => {
                      const next = { ...prev };
                      delete next[unitId];
                      return next;
                    })
                  }
                />
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {item.trackingMode === "consumable" ? (
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-ink text-xl">{t.stockTitle}</h2>
          <p className="text-ink text-sm">
            {t.currentQty}: <span className="font-semibold">{item.qtyOnHand ?? 0}</span>
          </p>

          {canWrite ? (
            <form
              onSubmit={handleAdjust}
              noValidate
              aria-live="polite"
              className="border-line bg-sunken flex flex-col gap-5 rounded-lg border p-5"
            >
              <LiveMessage text={adjustError} kind="error" />
              <LiveMessage text={adjustMessage} kind="success" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field
                  id={`${formId}-adjust-delta`}
                  name="delta"
                  type="number"
                  label={t.deltaLabel}
                  hint={t.deltaHint}
                  required
                  requiredLabel={t.required}
                  value={delta}
                  onChange={(event) => setDelta(event.target.value)}
                  error={deltaFieldError ?? undefined}
                />
                <Field
                  id={`${formId}-adjust-reason`}
                  name="reason"
                  label={t.reasonLabel}
                  optionalLabel={t.optional}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                />
              </div>
              <div>
                <Button type="submit" disabled={adjusting}>
                  {adjusting ? t.adjusting : t.adjustSubmit}
                </Button>
              </div>
            </form>
          ) : null}

          <div className="flex flex-col gap-3">
            <h3 id={`${formId}-history-heading`} className="text-ink text-sm font-semibold">
              {t.historyTitle}
            </h3>
            {adjustments.length === 0 ? (
              <p className="text-muted text-sm">{t.historyEmpty}</p>
            ) : (
              <div className="overflow-x-auto">
                <table
                  aria-labelledby={`${formId}-history-heading`}
                  className="text-ink w-full text-left text-sm"
                >
                  <thead>
                    <tr className="border-line border-b">
                      <th scope="col" className="py-2 pr-4 font-semibold">
                        {t.historyDate}
                      </th>
                      <th scope="col" className="py-2 pr-4 font-semibold">
                        {t.historyDelta}
                      </th>
                      <th scope="col" className="py-2 pr-4 font-semibold">
                        {t.historyReason}
                      </th>
                      <th scope="col" className="py-2 font-semibold">
                        {t.historyResulting}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {adjustments.map((adjustment) => (
                      <tr key={adjustment.id} className="border-line border-b last:border-0">
                        <td className="py-2 pr-4">{formatDate(locale, adjustment.createdAt)}</td>
                        <td
                          className={clsx(
                            "py-2 pr-4 font-semibold",
                            adjustment.delta >= 0 ? "text-success" : "text-error"
                          )}
                        >
                          {adjustment.delta >= 0 ? `+${adjustment.delta}` : adjustment.delta}
                        </td>
                        <td className="py-2 pr-4">{adjustment.reason ?? ""}</td>
                        <td className="py-2">{adjustment.resultingQty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {dialog}
    </div>
  );
}

type UnitRowProps = {
  unit: Unit;
  locale: Locale;
  t: Copy;
  locations: Location[];
  canWrite: boolean;
  openMaintenanceEntryId?: string;
  onUpdated: (unit: Unit) => void;
  onMaintenanceOpened: (unitId: string, entryId: string) => void;
  onMaintenanceClosed: (unitId: string) => void;
};

/** A single unit row: read view, edit form, and maintenance open/close actions. */
function UnitRow({
  unit,
  locale,
  t,
  locations,
  canWrite,
  openMaintenanceEntryId,
  onUpdated,
  onMaintenanceOpened,
  onMaintenanceClosed,
}: UnitRowProps) {
  const formId = useId();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    label: unit.label,
    condition: unit.condition,
    state: unit.state,
    locationId: unit.locationId ?? "",
    notes: unit.notes ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [labelError, setLabelError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [issue, setIssue] = useState("");
  const [conditionBefore, setConditionBefore] = useState<UnitCondition>(unit.condition);
  const [openingMaintenance, setOpeningMaintenance] = useState(false);
  const [maintenanceError, setMaintenanceError] = useState<string | null>(null);
  const [issueFieldError, setIssueFieldError] = useState<string | null>(null);

  const [closeOpen, setCloseOpen] = useState(false);
  const [actionTaken, setActionTaken] = useState("");
  const [conditionAfter, setConditionAfter] = useState<UnitCondition>("good");
  const [closingMaintenance, setClosingMaintenance] = useState(false);
  const [closeError, setCloseError] = useState<string | null>(null);

  const locationOptions = [
    { value: "", label: t.noLocation },
    ...locations.map((l) => ({ value: l.id, label: l.name[locale] })),
  ];

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLabelError(null);
    setMessage(null);
    if (!form.label.trim()) {
      setError(t.errorRequired);
      setLabelError(t.errorRequired);
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(`/api/inventory/units/${unit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: form.label.trim(),
          condition: form.condition,
          state: form.state,
          locationId: form.locationId || null,
          notes: form.notes.trim() || null,
        }),
      });
      const result = (await response.json().catch(() => null)) as UnitPatchResponse | null;
      if (response.ok && result?.ok && result.unit) {
        onUpdated(result.unit);
        setMessage(t.unitSaved);
        setEditing(false);
        return;
      }
      setError(response.status === 403 ? t.errorForbidden : t.errorGeneric);
    } catch {
      setError(t.errorGeneric);
    } finally {
      setSaving(false);
    }
  }

  async function handleOpenMaintenance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMaintenanceError(null);
    setIssueFieldError(null);
    if (!issue.trim()) {
      setMaintenanceError(t.errorRequired);
      setIssueFieldError(t.errorRequired);
      return;
    }
    setOpeningMaintenance(true);
    try {
      const response = await fetch("/api/inventory/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId: unit.id, issue: issue.trim(), conditionBefore }),
      });
      const result = (await response.json().catch(() => null)) as MaintenanceOpenResponse | null;
      if (response.ok && result?.ok && result.entry) {
        onUpdated({ ...unit, state: "maintenance" });
        onMaintenanceOpened(unit.id, result.entry.id);
        setIssue("");
        setMaintenanceOpen(false);
        setMessage(t.maintenanceOpened);
        return;
      }
      setMaintenanceError(response.status === 403 ? t.errorForbidden : t.errorGeneric);
    } catch {
      setMaintenanceError(t.errorGeneric);
    } finally {
      setOpeningMaintenance(false);
    }
  }

  async function handleCloseMaintenance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCloseError(null);
    if (!openMaintenanceEntryId) return;
    setClosingMaintenance(true);
    try {
      const response = await fetch(`/api/inventory/maintenance/${openMaintenanceEntryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionTaken: actionTaken.trim() || undefined, conditionAfter }),
      });
      const result = (await response.json().catch(() => null)) as MaintenanceCloseResponse | null;
      if (response.ok && result?.ok) {
        onUpdated({ ...unit, state: "available", condition: conditionAfter });
        onMaintenanceClosed(unit.id);
        setActionTaken("");
        setCloseOpen(false);
        setMessage(t.maintenanceClosed);
        return;
      }
      setCloseError(response.status === 403 ? t.errorForbidden : t.errorGeneric);
    } catch {
      setCloseError(t.errorGeneric);
    } finally {
      setClosingMaintenance(false);
    }
  }

  return (
    <li className="border-line bg-surface flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-ink font-semibold">{unit.label}</p>
          <p className="text-muted text-sm">
            {unit.locationId
              ? (locations.find((l) => l.id === unit.locationId)?.name[locale] ?? t.noLocation)
              : t.noLocation}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Pill className={conditionTint[unit.condition]}>{t.conditionLabels[unit.condition]}</Pill>
          <Pill className={stateTint[unit.state]}>{t.stateLabels[unit.state]}</Pill>
        </div>
      </div>
      {unit.notes ? <p className="text-ink text-sm">{unit.notes}</p> : null}

      {canWrite ? (
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => setEditing((prev) => !prev)}
            aria-expanded={editing}
            aria-controls={`${formId}-edit-panel`}
          >
            {editing ? t.hideForm : t.editUnit}
          </Button>
          {unit.state !== "maintenance" ? (
            <Button
              variant="ghost"
              onClick={() => setMaintenanceOpen((prev) => !prev)}
              aria-expanded={maintenanceOpen}
              aria-controls={`${formId}-maintenance-panel`}
            >
              {maintenanceOpen ? t.hideForm : t.reportIssue}
            </Button>
          ) : openMaintenanceEntryId ? (
            <Button
              variant="ghost"
              onClick={() => setCloseOpen((prev) => !prev)}
              aria-expanded={closeOpen}
              aria-controls={`${formId}-close-panel`}
            >
              {closeOpen ? t.hideForm : t.closeMaintenance}
            </Button>
          ) : null}
        </div>
      ) : null}

      {unit.state === "maintenance" && !openMaintenanceEntryId ? (
        <Notice variant="info">{t.maintenanceUnknownEntry}</Notice>
      ) : null}

      <LiveMessage text={message} kind="success" />

      {canWrite && editing ? (
        <form
          id={`${formId}-edit-panel`}
          onSubmit={handleSave}
          noValidate
          aria-live="polite"
          className="border-line flex flex-col gap-4 border-t pt-4"
        >
          <LiveMessage text={error} kind="error" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              id={`${formId}-label`}
              name="label"
              label={t.labelLabel}
              required
              requiredLabel={t.required}
              value={form.label}
              onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))}
              error={labelError ?? undefined}
            />
            <Field
              id={`${formId}-condition`}
              name="condition"
              as="select"
              label={t.conditionLabel}
              value={form.condition}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, condition: event.target.value as UnitCondition }))
              }
              options={CONDITIONS.map((c) => ({ value: c, label: t.conditionLabels[c] }))}
            />
            <Field
              id={`${formId}-state`}
              name="state"
              as="select"
              label={t.stateLabel}
              value={form.state}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, state: event.target.value as UnitState }))
              }
              options={STATES.map((s) => ({ value: s, label: t.stateLabels[s] }))}
            />
            <Field
              id={`${formId}-location`}
              name="locationId"
              as="select"
              label={t.locationLabel}
              optionalLabel={t.optional}
              value={form.locationId}
              onChange={(event) => setForm((prev) => ({ ...prev, locationId: event.target.value }))}
              options={locationOptions}
            />
            <Field
              id={`${formId}-notes`}
              name="notes"
              as="textarea"
              label={t.notesLabel}
              optionalLabel={t.optional}
              className="sm:col-span-2"
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            />
          </div>
          <div>
            <Button type="submit" disabled={saving}>
              {saving ? t.savingUnit : t.saveUnit}
            </Button>
          </div>
        </form>
      ) : null}

      {canWrite && maintenanceOpen ? (
        <form
          id={`${formId}-maintenance-panel`}
          onSubmit={handleOpenMaintenance}
          noValidate
          aria-live="polite"
          className="border-line flex flex-col gap-4 border-t pt-4"
        >
          <LiveMessage text={maintenanceError} kind="error" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              id={`${formId}-issue`}
              name="issue"
              as="textarea"
              label={t.issueLabel}
              required
              requiredLabel={t.required}
              className="sm:col-span-2"
              value={issue}
              onChange={(event) => setIssue(event.target.value)}
              error={issueFieldError ?? undefined}
            />
            <Field
              id={`${formId}-conditionBefore`}
              name="conditionBefore"
              as="select"
              label={t.conditionBeforeLabel}
              value={conditionBefore}
              onChange={(event) => setConditionBefore(event.target.value as UnitCondition)}
              options={CONDITIONS.map((c) => ({ value: c, label: t.conditionLabels[c] }))}
            />
          </div>
          <div>
            <Button type="submit" disabled={openingMaintenance}>
              {openingMaintenance ? t.openingMaintenance : t.openMaintenance}
            </Button>
          </div>
        </form>
      ) : null}

      {canWrite && closeOpen && openMaintenanceEntryId ? (
        <form
          id={`${formId}-close-panel`}
          onSubmit={handleCloseMaintenance}
          noValidate
          aria-live="polite"
          className="border-line flex flex-col gap-4 border-t pt-4"
        >
          <LiveMessage text={closeError} kind="error" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              id={`${formId}-actionTaken`}
              name="actionTaken"
              as="textarea"
              label={t.actionTakenLabel}
              optionalLabel={t.optional}
              className="sm:col-span-2"
              value={actionTaken}
              onChange={(event) => setActionTaken(event.target.value)}
            />
            <Field
              id={`${formId}-conditionAfter`}
              name="conditionAfter"
              as="select"
              label={t.conditionAfterLabel}
              value={conditionAfter}
              onChange={(event) => setConditionAfter(event.target.value as UnitCondition)}
              options={CONDITIONS.map((c) => ({ value: c, label: t.conditionLabels[c] }))}
            />
          </div>
          <div>
            <Button type="submit" disabled={closingMaintenance}>
              {closingMaintenance ? t.closingMaintenance : t.closeMaintenanceSubmit}
            </Button>
          </div>
        </form>
      ) : null}
    </li>
  );
}
