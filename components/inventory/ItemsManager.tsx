"use client";

/**
 * Officer console: client-side search/filter over the full item catalogue
 * (same pattern as `components/clubs/ClubsExplorer.tsx`), a create-item
 * form, and per-item quick actions (retire / restore). Full editing of a
 * single item, its units, and its stock lives on the item detail page
 * (`components/inventory/ItemDetail.tsx`); this component only creates,
 * lists, filters, and retires/restores.
 */
import { useId, useMemo, useState } from "react";
import type { FormEvent } from "react";
import clsx from "clsx";
import Link from "next/link";
import Field from "@/components/Field";
import ErrorSummary, { type ErrorSummaryItem } from "@/components/ErrorSummary";
import Button from "@/components/Button";
import Tag from "@/components/Tag";
import { localeHref, type Locale } from "@/lib/i18n";
import type { Category, Item, Location, Role, TrackingMode } from "@/lib/inventory/types";

export type ItemsManagerProps = {
  items: Item[];
  categories: Category[];
  locations: Location[];
  role: Role;
  locale: Locale;
};

type Copy = {
  search: string;
  searchPlaceholder: string;
  category: string;
  allCategories: string;
  status: string;
  statusAll: string;
  statusActive: string;
  statusRetired: string;
  showing: string;
  result: string;
  results: string;
  noResults: string;
  clearFilters: string;
  addItem: string;
  hideForm: string;
  formTitle: string;
  keyLabel: string;
  keyHint: string;
  nameEnLabel: string;
  nameThLabel: string;
  descriptionEnLabel: string;
  descriptionThLabel: string;
  categoryLabel: string;
  categoryNone: string;
  locationLabel: string;
  locationNone: string;
  trackingModeLabel: string;
  trackingAsset: string;
  trackingConsumable: string;
  maxLoanDaysLabel: string;
  qtyOnHandLabel: string;
  reorderThresholdLabel: string;
  required: string;
  optional: string;
  submit: string;
  submitting: string;
  errorSummaryTitle: string;
  errorRequired: string;
  errorDuplicate: string;
  errorForbidden: string;
  errorGeneric: string;
  createdMessage: string;
  retire: string;
  retiring: string;
  restore: string;
  restoring: string;
  confirmRetire: (name: string) => string;
  retiredMessage: string;
  restoredMessage: string;
  retiredTag: string;
  assetTag: string;
  consumableTag: string;
  qtyLabel: (qty: number) => string;
  noCategory: string;
  viewDetail: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    search: "Search",
    searchPlaceholder: "Search by name or key",
    category: "Category",
    allCategories: "All categories",
    status: "Status",
    statusAll: "All",
    statusActive: "Active",
    statusRetired: "Retired",
    showing: "Showing",
    result: "item",
    results: "items",
    noResults: "No items match your filters.",
    clearFilters: "Clear filters",
    addItem: "Add item",
    hideForm: "Cancel",
    formTitle: "Add a new item",
    keyLabel: "Key",
    keyHint: "A short, unique code used internally, e.g. tent-4p.",
    nameEnLabel: "Name (English)",
    nameThLabel: "Name (Thai)",
    descriptionEnLabel: "Description (English)",
    descriptionThLabel: "Description (Thai)",
    categoryLabel: "Category",
    categoryNone: "No category",
    locationLabel: "Default location",
    locationNone: "No default location",
    trackingModeLabel: "Tracking mode",
    trackingAsset: "Asset (individually tracked units)",
    trackingConsumable: "Consumable (tracked as a quantity)",
    maxLoanDaysLabel: "Maximum loan days",
    qtyOnHandLabel: "Quantity on hand",
    reorderThresholdLabel: "Reorder threshold",
    required: "required",
    optional: "optional",
    submit: "Create item",
    submitting: "Creating...",
    errorSummaryTitle: "There is a problem",
    errorRequired: "Fill in all required fields",
    errorDuplicate: "That key is already used by another item",
    errorForbidden: "Your account does not have permission to do this",
    errorGeneric: "Something went wrong. Please try again.",
    createdMessage: "Item created.",
    retire: "Retire",
    retiring: "Retiring...",
    restore: "Restore",
    restoring: "Restoring...",
    confirmRetire: (name) => `Retire "${name}"? It will be hidden from active loans but kept in records.`,
    retiredMessage: "Item retired.",
    restoredMessage: "Item restored.",
    retiredTag: "Retired",
    assetTag: "Asset",
    consumableTag: "Consumable",
    qtyLabel: (qty) => `${qty} on hand`,
    noCategory: "Uncategorised",
    viewDetail: "View",
  },
  th: {
    search: "ค้นหา",
    searchPlaceholder: "ค้นหาด้วยชื่อหรือรหัส",
    category: "หมวดหมู่",
    allCategories: "ทุกหมวดหมู่",
    status: "สถานะ",
    statusAll: "ทั้งหมด",
    statusActive: "ใช้งานอยู่",
    statusRetired: "เลิกใช้แล้ว",
    showing: "แสดง",
    result: "รายการ",
    results: "รายการ",
    noResults: "ไม่พบรายการที่ตรงกับตัวกรอง",
    clearFilters: "ล้างตัวกรอง",
    addItem: "เพิ่มรายการ",
    hideForm: "ยกเลิก",
    formTitle: "เพิ่มรายการใหม่",
    keyLabel: "รหัส",
    keyHint: "รหัสสั้น ๆ ที่ไม่ซ้ำกัน ใช้ภายในระบบ เช่น tent-4p",
    nameEnLabel: "ชื่อ (อังกฤษ)",
    nameThLabel: "ชื่อ (ไทย)",
    descriptionEnLabel: "รายละเอียด (อังกฤษ)",
    descriptionThLabel: "รายละเอียด (ไทย)",
    categoryLabel: "หมวดหมู่",
    categoryNone: "ไม่มีหมวดหมู่",
    locationLabel: "สถานที่จัดเก็บเริ่มต้น",
    locationNone: "ไม่ระบุสถานที่เริ่มต้น",
    trackingModeLabel: "รูปแบบการติดตาม",
    trackingAsset: "ครุภัณฑ์ (ติดตามเป็นชิ้น)",
    trackingConsumable: "วัสดุสิ้นเปลือง (ติดตามเป็นจำนวน)",
    maxLoanDaysLabel: "จำนวนวันยืมสูงสุด",
    qtyOnHandLabel: "จำนวนคงเหลือ",
    reorderThresholdLabel: "เกณฑ์แจ้งเตือนสั่งซื้อเพิ่ม",
    required: "จำเป็น",
    optional: "ไม่บังคับ",
    submit: "สร้างรายการ",
    submitting: "กำลังสร้าง...",
    errorSummaryTitle: "พบข้อผิดพลาด กรุณาตรวจสอบ",
    errorRequired: "กรุณากรอกข้อมูลที่จำเป็นให้ครบ",
    errorDuplicate: "รหัสนี้ถูกใช้กับรายการอื่นแล้ว",
    errorForbidden: "บัญชีของคุณไม่มีสิทธิ์ทำรายการนี้",
    errorGeneric: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
    createdMessage: "สร้างรายการเรียบร้อยแล้ว",
    retire: "เลิกใช้",
    retiring: "กำลังเลิกใช้...",
    restore: "กู้คืน",
    restoring: "กำลังกู้คืน...",
    confirmRetire: (name) => `เลิกใช้ "${name}" ใช่หรือไม่ รายการจะถูกซ่อนจากการยืมแต่ยังเก็บประวัติไว้`,
    retiredMessage: "เลิกใช้รายการแล้ว",
    restoredMessage: "กู้คืนรายการแล้ว",
    retiredTag: "เลิกใช้แล้ว",
    assetTag: "ครุภัณฑ์",
    consumableTag: "วัสดุสิ้นเปลือง",
    qtyLabel: (qty) => `คงเหลือ ${qty}`,
    noCategory: "ไม่มีหมวดหมู่",
    viewDetail: "ดูรายละเอียด",
  },
};

type FormState = {
  key: string;
  categoryId: string;
  nameEn: string;
  nameTh: string;
  descriptionEn: string;
  descriptionTh: string;
  trackingMode: TrackingMode;
  defaultLocationId: string;
  maxLoanDays: string;
  qtyOnHand: string;
  reorderThreshold: string;
};

const emptyForm: FormState = {
  key: "",
  categoryId: "",
  nameEn: "",
  nameTh: "",
  descriptionEn: "",
  descriptionTh: "",
  trackingMode: "asset",
  defaultLocationId: "",
  maxLoanDays: "7",
  qtyOnHand: "0",
  reorderThreshold: "",
};

type CreateResponse = { ok: boolean; item?: Item; reason?: string; errors?: Record<string, string[]> };
type PatchResponse = { ok: boolean; item?: Item; reason?: string };

const CAN_WRITE: Role[] = ["admin", "inventory_manager"];

export default function ItemsManager({ items: initialItems, categories, locations, role, locale }: ItemsManagerProps) {
  const t = copy[locale];
  const canWrite = CAN_WRITE.includes(role);
  const formId = useId();

  const [items, setItems] = useState<Item[]>(initialItems);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "retired">("active");

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [rowBusy, setRowBusy] = useState<string | null>(null);
  const [rowMessage, setRowMessage] = useState<{ id: string; text: string; kind: "success" | "error" } | null>(null);

  const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesStatus =
        statusFilter === "all" ? true : statusFilter === "retired" ? item.isRetired : !item.isRetired;
      const matchesCategory = categoryFilter === "all" || item.categoryId === categoryFilter;
      const matchesQuery =
        q.length === 0 ||
        item.key.toLowerCase().includes(q) ||
        item.name.en.toLowerCase().includes(q) ||
        item.name.th.toLowerCase().includes(q);
      return matchesStatus && matchesCategory && matchesQuery;
    });
  }, [items, query, categoryFilter, statusFilter]);

  function clearFilters() {
    setQuery("");
    setCategoryFilter("all");
    setStatusFilter("active");
  }

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setSuccessMessage(null);

    if (!form.key.trim() || !form.nameEn.trim() || !form.nameTh.trim() || !form.maxLoanDays.trim()) {
      setFormError(t.errorRequired);
      return;
    }
    if (form.trackingMode === "consumable" && form.qtyOnHand.trim() === "") {
      setFormError(t.errorRequired);
      return;
    }

    setSubmitting(true);
    try {
      const body = {
        key: form.key.trim(),
        categoryId: form.categoryId || undefined,
        name: { en: form.nameEn.trim(), th: form.nameTh.trim() },
        description: { en: form.descriptionEn.trim(), th: form.descriptionTh.trim() },
        trackingMode: form.trackingMode,
        defaultLocationId: form.defaultLocationId || undefined,
        maxLoanDays: Number(form.maxLoanDays),
        qtyOnHand: form.trackingMode === "consumable" ? Number(form.qtyOnHand) : null,
        reorderThreshold:
          form.trackingMode === "consumable" && form.reorderThreshold.trim() !== ""
            ? Number(form.reorderThreshold)
            : null,
      };

      const response = await fetch("/api/inventory/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await response.json().catch(() => null)) as CreateResponse | null;

      if (response.ok && result?.ok && result.item) {
        const createdItem = result.item;
        setItems((prev) => [...prev, createdItem].sort((a, b) => a.name.en.localeCompare(b.name.en)));
        setForm(emptyForm);
        setFormOpen(false);
        setSuccessMessage(t.createdMessage);
        return;
      }

      if (response.status === 403) {
        setFormError(t.errorForbidden);
      } else if (response.status === 409 || result?.reason === "duplicate") {
        setFieldErrors({ key: t.errorDuplicate });
        setFormError(t.errorDuplicate);
      } else if (result?.errors) {
        const flat: Record<string, string> = {};
        for (const [field, messages] of Object.entries(result.errors)) {
          if (messages?.[0]) flat[field] = messages[0];
        }
        setFieldErrors(flat);
        setFormError(t.errorRequired);
      } else {
        setFormError(t.errorGeneric);
      }
    } catch {
      setFormError(t.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRetire(item: Item) {
    if (typeof window !== "undefined" && !window.confirm(t.confirmRetire(item.name[locale]))) {
      return;
    }
    setRowBusy(item.id);
    setRowMessage(null);
    try {
      const response = await fetch(`/api/inventory/items/${item.id}`, { method: "DELETE" });
      const result = (await response.json().catch(() => null)) as PatchResponse | null;
      if (response.ok && result?.ok && result.item) {
        const updatedItem = result.item;
        setItems((prev) => prev.map((existing) => (existing.id === item.id ? updatedItem : existing)));
        setRowMessage({ id: item.id, text: t.retiredMessage, kind: "success" });
      } else if (response.status === 403) {
        setRowMessage({ id: item.id, text: t.errorForbidden, kind: "error" });
      } else {
        setRowMessage({ id: item.id, text: t.errorGeneric, kind: "error" });
      }
    } catch {
      setRowMessage({ id: item.id, text: t.errorGeneric, kind: "error" });
    } finally {
      setRowBusy(null);
    }
  }

  async function handleRestore(item: Item) {
    setRowBusy(item.id);
    setRowMessage(null);
    try {
      const response = await fetch(`/api/inventory/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRetired: false }),
      });
      const result = (await response.json().catch(() => null)) as PatchResponse | null;
      if (response.ok && result?.ok && result.item) {
        const updatedItem = result.item;
        setItems((prev) => prev.map((existing) => (existing.id === item.id ? updatedItem : existing)));
        setRowMessage({ id: item.id, text: t.restoredMessage, kind: "success" });
      } else if (response.status === 403) {
        setRowMessage({ id: item.id, text: t.errorForbidden, kind: "error" });
      } else {
        setRowMessage({ id: item.id, text: t.errorGeneric, kind: "error" });
      }
    } catch {
      setRowMessage({ id: item.id, text: t.errorGeneric, kind: "error" });
    } finally {
      setRowBusy(null);
    }
  }

  const errorItems: ErrorSummaryItem[] = Object.entries(fieldErrors).map(([field, message]) => ({
    id: `${formId}-${field}`,
    message,
  }));

  const categoryOptions = [
    { value: "all", label: t.allCategories },
    ...categories.map((c) => ({ value: c.id, label: c.name[locale] })),
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="max-w-sm">
            <label htmlFor={`${formId}-search`} className="text-ink mb-1.5 block text-sm font-semibold">
              {t.search}
            </label>
            <input
              id={`${formId}-search`}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.searchPlaceholder}
              className="focus-halo border-input-border bg-surface text-ink placeholder:text-muted h-11 w-full rounded-md border px-3.5 py-2.5 text-[0.95rem]"
            />
          </div>

          <div className="max-w-xs">
            <label htmlFor={`${formId}-category`} className="text-ink mb-1.5 block text-sm font-semibold">
              {t.category}
            </label>
            <select
              id={`${formId}-category`}
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="focus-halo border-input-border bg-surface text-ink h-11 w-full rounded-md border px-3.5 py-2.5 text-[0.95rem]"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div role="radiogroup" aria-label={t.status} className="flex gap-2">
            {(
              [
                ["all", t.statusAll],
                ["active", t.statusActive],
                ["retired", t.statusRetired],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={statusFilter === value}
                onClick={() => setStatusFilter(value)}
                className={clsx(
                  "focus-halo rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors",
                  statusFilter === value
                    ? "border-brand bg-brand text-white"
                    : "border-line-strong bg-surface text-ink hover:bg-sunken"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {canWrite ? (
          <Button variant={formOpen ? "secondary" : "primary"} onClick={() => setFormOpen((prev) => !prev)}>
            {formOpen ? t.hideForm : t.addItem}
          </Button>
        ) : null}
      </div>

      {successMessage ? (
        <div role="status" className="border-success bg-success-tint text-ink rounded-md border-l-4 p-3 text-sm">
          {successMessage}
        </div>
      ) : null}

      {canWrite && formOpen ? (
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-live="polite"
          className="border-line bg-surface flex flex-col gap-5 rounded-lg border p-5 sm:p-6"
        >
          <h2 className="font-display text-ink text-lg">{t.formTitle}</h2>

          <ErrorSummary title={t.errorSummaryTitle} errors={errorItems} />
          {formError && errorItems.length === 0 ? (
            <p role="alert" className="text-error text-sm font-medium">
              {formError}
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              id={`${formId}-key`}
              name="key"
              label={t.keyLabel}
              hint={t.keyHint}
              required
              requiredLabel={t.required}
              value={form.key}
              onChange={(event) => updateForm("key", event.target.value)}
              error={fieldErrors.key}
            />
            <Field
              id={`${formId}-categoryId`}
              name="categoryId"
              as="select"
              label={t.categoryLabel}
              optionalLabel={t.optional}
              value={form.categoryId}
              onChange={(event) => updateForm("categoryId", event.target.value)}
              options={[{ value: "", label: t.categoryNone }, ...categories.map((c) => ({ value: c.id, label: c.name[locale] }))]}
            />
            <Field
              id={`${formId}-nameEn`}
              name="nameEn"
              label={t.nameEnLabel}
              required
              requiredLabel={t.required}
              value={form.nameEn}
              onChange={(event) => updateForm("nameEn", event.target.value)}
            />
            <Field
              id={`${formId}-nameTh`}
              name="nameTh"
              label={t.nameThLabel}
              required
              requiredLabel={t.required}
              value={form.nameTh}
              onChange={(event) => updateForm("nameTh", event.target.value)}
            />
            <Field
              id={`${formId}-descriptionEn`}
              name="descriptionEn"
              as="textarea"
              label={t.descriptionEnLabel}
              optionalLabel={t.optional}
              value={form.descriptionEn}
              onChange={(event) => updateForm("descriptionEn", event.target.value)}
            />
            <Field
              id={`${formId}-descriptionTh`}
              name="descriptionTh"
              as="textarea"
              label={t.descriptionThLabel}
              optionalLabel={t.optional}
              value={form.descriptionTh}
              onChange={(event) => updateForm("descriptionTh", event.target.value)}
            />
            <Field
              id={`${formId}-defaultLocationId`}
              name="defaultLocationId"
              as="select"
              label={t.locationLabel}
              optionalLabel={t.optional}
              value={form.defaultLocationId}
              onChange={(event) => updateForm("defaultLocationId", event.target.value)}
              options={[
                { value: "", label: t.locationNone },
                ...locations.map((l) => ({ value: l.id, label: l.name[locale] })),
              ]}
            />
            <Field
              id={`${formId}-maxLoanDays`}
              name="maxLoanDays"
              type="number"
              min={1}
              label={t.maxLoanDaysLabel}
              required
              requiredLabel={t.required}
              value={form.maxLoanDays}
              onChange={(event) => updateForm("maxLoanDays", event.target.value)}
            />
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-ink text-sm font-semibold">{t.trackingModeLabel}</legend>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="border-input-border has-checked:border-brand has-checked:bg-brand-tint flex items-center gap-2 rounded-md border px-3.5 py-2.5 text-sm">
                <input
                  type="radio"
                  name="trackingMode"
                  checked={form.trackingMode === "asset"}
                  onChange={() => updateForm("trackingMode", "asset")}
                />
                {t.trackingAsset}
              </label>
              <label className="border-input-border has-checked:border-brand has-checked:bg-brand-tint flex items-center gap-2 rounded-md border px-3.5 py-2.5 text-sm">
                <input
                  type="radio"
                  name="trackingMode"
                  checked={form.trackingMode === "consumable"}
                  onChange={() => updateForm("trackingMode", "consumable")}
                />
                {t.trackingConsumable}
              </label>
            </div>
          </fieldset>

          {form.trackingMode === "consumable" ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                id={`${formId}-qtyOnHand`}
                name="qtyOnHand"
                type="number"
                min={0}
                label={t.qtyOnHandLabel}
                required
                requiredLabel={t.required}
                value={form.qtyOnHand}
                onChange={(event) => updateForm("qtyOnHand", event.target.value)}
              />
              <Field
                id={`${formId}-reorderThreshold`}
                name="reorderThreshold"
                type="number"
                min={0}
                label={t.reorderThresholdLabel}
                optionalLabel={t.optional}
                value={form.reorderThreshold}
                onChange={(event) => updateForm("reorderThreshold", event.target.value)}
              />
            </div>
          ) : null}

          <div>
            <Button type="submit" disabled={submitting}>
              {submitting ? t.submitting : t.submit}
            </Button>
          </div>
        </form>
      ) : null}

      <p role="status" className="text-muted text-sm">
        {t.showing} {filtered.length} {filtered.length === 1 ? t.result : t.results}
      </p>

      {filtered.length === 0 ? (
        <div className="border-line bg-sunken flex flex-col items-start gap-3 rounded-lg border p-6">
          <p className="text-ink text-sm">{t.noResults}</p>
          <Button variant="secondary" onClick={clearFilters}>
            {t.clearFilters}
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((item) => {
            const category = item.categoryId ? categoryById.get(item.categoryId) : undefined;
            const message = rowMessage?.id === item.id ? rowMessage : null;
            const busy = rowBusy === item.id;
            return (
              <li key={item.id} className="border-line bg-surface flex flex-col gap-3 rounded-lg border p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-ink text-lg">
                      <Link href={localeHref(locale, `/officer/inventory/items/${item.id}`)} className="hover:underline">
                        {item.name[locale]}
                      </Link>
                    </p>
                    <p className="text-muted text-sm">{item.key}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag variant="brand">{item.trackingMode === "asset" ? t.assetTag : t.consumableTag}</Tag>
                    {item.trackingMode === "consumable" ? (
                      <Tag variant="neutral">{t.qtyLabel(item.qtyOnHand ?? 0)}</Tag>
                    ) : null}
                    <Tag variant="neutral">{category ? category.name[locale] : t.noCategory}</Tag>
                    {item.isRetired ? <Tag variant="forest">{t.retiredTag}</Tag> : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="ghost" href={localeHref(locale, `/officer/inventory/items/${item.id}`)}>
                    {t.viewDetail}
                  </Button>
                  {canWrite && !item.isRetired ? (
                    <Button variant="secondary" onClick={() => handleRetire(item)} disabled={busy}>
                      {busy ? t.retiring : t.retire}
                    </Button>
                  ) : null}
                  {canWrite && item.isRetired ? (
                    <Button variant="secondary" onClick={() => handleRestore(item)} disabled={busy}>
                      {busy ? t.restoring : t.restore}
                    </Button>
                  ) : null}
                </div>

                {message ? (
                  <p
                    role="status"
                    className={clsx("text-sm font-medium", message.kind === "success" ? "text-success" : "text-error")}
                  >
                    {message.text}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

    </div>
  );
}
