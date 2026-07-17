"use client";

/**
 * Officer console: manage the two pieces of shared reference data that items
 * and units are tagged with: categories and locations. Two independent
 * sections, each with a list, inline edit per row, and a create form.
 */
import { useId, useState } from "react";
import type { FormEvent } from "react";
import Field from "@/components/Field";
import Button from "@/components/Button";
import type { Locale } from "@/lib/i18n";
import type { Category, Location, Role } from "@/lib/inventory/types";

export type ReferenceManagerProps = {
  categories: Category[];
  locations: Location[];
  role: Role;
  locale: Locale;
};

type Copy = {
  categoriesTitle: string;
  locationsTitle: string;
  slugLabel: string;
  slugHint: string;
  nameEnLabel: string;
  nameThLabel: string;
  descriptionEnLabel: string;
  descriptionThLabel: string;
  sortOrderLabel: string;
  required: string;
  optional: string;
  addCategory: string;
  addLocation: string;
  hideForm: string;
  create: string;
  creating: string;
  created: string;
  edit: string;
  save: string;
  saving: string;
  saved: string;
  cancel: string;
  noCategories: string;
  noLocations: string;
  errorRequired: string;
  errorDuplicate: string;
  errorForbidden: string;
  errorGeneric: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    categoriesTitle: "Categories",
    locationsTitle: "Storage locations",
    slugLabel: "Slug",
    slugHint: "A short, unique code, e.g. camping-gear.",
    nameEnLabel: "Name (English)",
    nameThLabel: "Name (Thai)",
    descriptionEnLabel: "Description (English)",
    descriptionThLabel: "Description (Thai)",
    sortOrderLabel: "Sort order",
    required: "required",
    optional: "optional",
    addCategory: "Add category",
    addLocation: "Add location",
    hideForm: "Cancel",
    create: "Create",
    creating: "Creating...",
    created: "Created.",
    edit: "Edit",
    save: "Save",
    saving: "Saving...",
    saved: "Saved.",
    cancel: "Cancel",
    noCategories: "No categories yet.",
    noLocations: "No storage locations yet.",
    errorRequired: "Fill in all required fields",
    errorDuplicate: "That slug is already used",
    errorForbidden: "Your account does not have permission to do this",
    errorGeneric: "Something went wrong. Try again.",
  },
  th: {
    categoriesTitle: "หมวดหมู่",
    locationsTitle: "สถานที่จัดเก็บ",
    slugLabel: "รหัส (slug)",
    slugHint: "รหัสสั้น ๆ ที่ไม่ซ้ำกัน เช่น camping-gear",
    nameEnLabel: "ชื่อ (อังกฤษ)",
    nameThLabel: "ชื่อ (ไทย)",
    descriptionEnLabel: "รายละเอียด (อังกฤษ)",
    descriptionThLabel: "รายละเอียด (ไทย)",
    sortOrderLabel: "ลำดับการแสดงผล",
    required: "จำเป็น",
    optional: "ไม่บังคับ",
    addCategory: "เพิ่มหมวดหมู่",
    addLocation: "เพิ่มสถานที่จัดเก็บ",
    hideForm: "ยกเลิก",
    create: "สร้าง",
    creating: "กำลังสร้าง...",
    created: "สร้างแล้ว",
    edit: "แก้ไข",
    save: "บันทึก",
    saving: "กำลังบันทึก...",
    saved: "บันทึกแล้ว",
    cancel: "ยกเลิก",
    noCategories: "ยังไม่มีหมวดหมู่",
    noLocations: "ยังไม่มีสถานที่จัดเก็บ",
    errorRequired: "กรุณากรอกข้อมูลที่จำเป็นให้ครบ",
    errorDuplicate: "รหัสนี้ถูกใช้แล้ว",
    errorForbidden: "บัญชีของคุณไม่มีสิทธิ์ทำรายการนี้",
    errorGeneric: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
  },
};

const CAN_WRITE: Role[] = ["admin", "inventory_manager"];

type CategoryResponse = { ok: true; category: Category } | { ok: false; reason?: string };
type LocationResponse = { ok: true; location: Location } | { ok: false; reason?: string };

export default function ReferenceManager({
  categories: initialCategories,
  locations: initialLocations,
  role,
  locale,
}: ReferenceManagerProps) {
  const t = copy[locale];
  const canWrite = CAN_WRITE.includes(role);

  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [locations, setLocations] = useState<Location[]>(initialLocations);

  return (
    <div className="flex flex-col gap-10">
      <CategorySection
        t={t}
        locale={locale}
        canWrite={canWrite}
        categories={categories}
        setCategories={setCategories}
      />
      <LocationSection
        t={t}
        locale={locale}
        canWrite={canWrite}
        locations={locations}
        setLocations={setLocations}
      />
    </div>
  );
}

function CategorySection({
  t,
  locale,
  canWrite,
  categories,
  setCategories,
}: {
  t: Copy;
  locale: Locale;
  canWrite: boolean;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}) {
  const formId = useId();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ slug: "", nameEn: "", nameTh: "", sortOrder: "0" });
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
      const response = await fetch("/api/inventory/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: form.slug.trim(),
          name: { en: form.nameEn.trim(), th: form.nameTh.trim() },
          sortOrder: form.sortOrder.trim() !== "" ? Number(form.sortOrder) : undefined,
        }),
      });
      const result = (await response.json().catch(() => null)) as CategoryResponse | null;
      if (response.ok && result?.ok) {
        setCategories((prev) =>
          [...prev, result.category].sort(
            (a, b) => a.sortOrder - b.sortOrder || a.name.en.localeCompare(b.name.en)
          )
        );
        setForm({ slug: "", nameEn: "", nameTh: "", sortOrder: "0" });
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
        <h2 className="font-display text-ink text-xl">{t.categoriesTitle}</h2>
        {canWrite ? (
          <Button
            variant={createOpen ? "secondary" : "primary"}
            aria-expanded={createOpen}
            aria-controls={`${formId}-create-form`}
            onClick={() => setCreateOpen((prev) => !prev)}
          >
            {createOpen ? t.hideForm : t.addCategory}
          </Button>
        ) : null}
      </div>

      {message ? (
        <p role="status" className="text-success text-sm font-medium">
          {message}
        </p>
      ) : null}

      {canWrite && createOpen ? (
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
              id={`${formId}-sortOrder`}
              name="sortOrder"
              type="number"
              label={t.sortOrderLabel}
              optionalLabel={t.optional}
              value={form.sortOrder}
              onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: event.target.value }))}
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
          </div>
          <div>
            <Button type="submit" disabled={submitting}>
              {submitting ? t.creating : t.create}
            </Button>
          </div>
        </form>
      ) : null}

      {categories.length === 0 ? (
        <p className="text-muted text-sm">{t.noCategories}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              t={t}
              locale={locale}
              canWrite={canWrite}
              setCategories={setCategories}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function CategoryRow({
  category,
  t,
  locale,
  canWrite,
  setCategories,
}: {
  category: Category;
  t: Copy;
  locale: Locale;
  canWrite: boolean;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}) {
  const formId = useId();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    slug: category.slug,
    nameEn: category.name.en,
    nameTh: category.name.th,
    sortOrder: String(category.sortOrder),
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!form.slug.trim() || !form.nameEn.trim() || !form.nameTh.trim()) {
      setError(t.errorRequired);
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(`/api/inventory/categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: form.slug.trim(),
          name: { en: form.nameEn.trim(), th: form.nameTh.trim() },
          sortOrder: Number(form.sortOrder),
        }),
      });
      const result = (await response.json().catch(() => null)) as CategoryResponse | null;
      if (response.ok && result?.ok) {
        setCategories((prev) =>
          prev.map((existing) => (existing.id === category.id ? result.category : existing))
        );
        setEditing(false);
        setSavedMessage(t.saved);
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

  return (
    <li className="border-line bg-surface flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-ink font-semibold">{category.name[locale]}</p>
          <p className="text-muted text-sm">{category.slug}</p>
        </div>
        {canWrite ? (
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
        ) : null}
      </div>

      {savedMessage && !editing ? (
        <p role="status" className="text-success text-sm font-medium">
          {savedMessage}
        </p>
      ) : null}

      {canWrite && editing ? (
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
              id={`${formId}-slug`}
              name="slug"
              label={t.slugLabel}
              required
              requiredLabel={t.required}
              value={form.slug}
              onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
            />
            <Field
              id={`${formId}-sortOrder`}
              name="sortOrder"
              type="number"
              label={t.sortOrderLabel}
              value={form.sortOrder}
              onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: event.target.value }))}
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
          </div>
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

function LocationSection({
  t,
  locale,
  canWrite,
  locations,
  setLocations,
}: {
  t: Copy;
  locale: Locale;
  canWrite: boolean;
  locations: Location[];
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
}) {
  const formId = useId();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    nameEn: "",
    nameTh: "",
    descriptionEn: "",
    descriptionTh: "",
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
      const response = await fetch("/api/inventory/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: form.slug.trim(),
          name: { en: form.nameEn.trim(), th: form.nameTh.trim() },
          description: { en: form.descriptionEn.trim(), th: form.descriptionTh.trim() },
          sortOrder: form.sortOrder.trim() !== "" ? Number(form.sortOrder) : undefined,
        }),
      });
      const result = (await response.json().catch(() => null)) as LocationResponse | null;
      if (response.ok && result?.ok) {
        setLocations((prev) =>
          [...prev, result.location].sort(
            (a, b) => a.sortOrder - b.sortOrder || a.name.en.localeCompare(b.name.en)
          )
        );
        setForm({
          slug: "",
          nameEn: "",
          nameTh: "",
          descriptionEn: "",
          descriptionTh: "",
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
        <h2 className="font-display text-ink text-xl">{t.locationsTitle}</h2>
        {canWrite ? (
          <Button
            variant={createOpen ? "secondary" : "primary"}
            aria-expanded={createOpen}
            aria-controls={`${formId}-create-form`}
            onClick={() => setCreateOpen((prev) => !prev)}
          >
            {createOpen ? t.hideForm : t.addLocation}
          </Button>
        ) : null}
      </div>

      {message ? (
        <p role="status" className="text-success text-sm font-medium">
          {message}
        </p>
      ) : null}

      {canWrite && createOpen ? (
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
              id={`${formId}-sortOrder`}
              name="sortOrder"
              type="number"
              label={t.sortOrderLabel}
              optionalLabel={t.optional}
              value={form.sortOrder}
              onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: event.target.value }))}
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
              id={`${formId}-descriptionEn`}
              name="descriptionEn"
              as="textarea"
              label={t.descriptionEnLabel}
              optionalLabel={t.optional}
              value={form.descriptionEn}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, descriptionEn: event.target.value }))
              }
            />
            <Field
              id={`${formId}-descriptionTh`}
              name="descriptionTh"
              as="textarea"
              label={t.descriptionThLabel}
              optionalLabel={t.optional}
              value={form.descriptionTh}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, descriptionTh: event.target.value }))
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

      {locations.length === 0 ? (
        <p className="text-muted text-sm">{t.noLocations}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {locations.map((location) => (
            <LocationRow
              key={location.id}
              location={location}
              t={t}
              locale={locale}
              canWrite={canWrite}
              setLocations={setLocations}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function LocationRow({
  location,
  t,
  locale,
  canWrite,
  setLocations,
}: {
  location: Location;
  t: Copy;
  locale: Locale;
  canWrite: boolean;
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
}) {
  const formId = useId();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    slug: location.slug,
    nameEn: location.name.en,
    nameTh: location.name.th,
    descriptionEn: location.description.en,
    descriptionTh: location.description.th,
    sortOrder: String(location.sortOrder),
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!form.slug.trim() || !form.nameEn.trim() || !form.nameTh.trim()) {
      setError(t.errorRequired);
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(`/api/inventory/locations/${location.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: form.slug.trim(),
          name: { en: form.nameEn.trim(), th: form.nameTh.trim() },
          description: { en: form.descriptionEn.trim(), th: form.descriptionTh.trim() },
          sortOrder: Number(form.sortOrder),
        }),
      });
      const result = (await response.json().catch(() => null)) as LocationResponse | null;
      if (response.ok && result?.ok) {
        setLocations((prev) =>
          prev.map((existing) => (existing.id === location.id ? result.location : existing))
        );
        setEditing(false);
        setSavedMessage(t.saved);
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

  return (
    <li className="border-line bg-surface flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-ink font-semibold">{location.name[locale]}</p>
          <p className="text-muted text-sm">{location.slug}</p>
        </div>
        {canWrite ? (
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
        ) : null}
      </div>
      {location.description[locale] ? (
        <p className="text-ink text-sm">{location.description[locale]}</p>
      ) : null}

      {savedMessage && !editing ? (
        <p role="status" className="text-success text-sm font-medium">
          {savedMessage}
        </p>
      ) : null}

      {canWrite && editing ? (
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
              id={`${formId}-slug`}
              name="slug"
              label={t.slugLabel}
              required
              requiredLabel={t.required}
              value={form.slug}
              onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
            />
            <Field
              id={`${formId}-sortOrder`}
              name="sortOrder"
              type="number"
              label={t.sortOrderLabel}
              value={form.sortOrder}
              onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: event.target.value }))}
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
              id={`${formId}-descriptionEn`}
              name="descriptionEn"
              as="textarea"
              label={t.descriptionEnLabel}
              optionalLabel={t.optional}
              value={form.descriptionEn}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, descriptionEn: event.target.value }))
              }
            />
            <Field
              id={`${formId}-descriptionTh`}
              name="descriptionTh"
              as="textarea"
              label={t.descriptionThLabel}
              optionalLabel={t.optional}
              value={form.descriptionTh}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, descriptionTh: event.target.value }))
              }
            />
          </div>
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
