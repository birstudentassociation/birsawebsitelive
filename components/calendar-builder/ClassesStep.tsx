"use client";

import { useEffect, useId, useRef, useState } from "react";
import Button from "@/components/Button";
import Field from "@/components/Field";
import ErrorSummary from "@/components/ErrorSummary";
import Notice from "@/components/Notice";
import {
  MAX_CLASSES,
  MAX_PLACE_LENGTH,
  validateClassSlot,
  type ClassSlot,
  type ClassSlotError,
} from "@/lib/calendar-builder/selection";
import type { CalendarBuilderCopy, ClassField } from "@/content/calendar-builder/types";
import { fill } from "./helpers";

export type CourseOption = { code: string; title: string };

export type ClassesStepProps = {
  copy: CalendarBuilderCopy;
  term: { year: number; semester: number | string; start: string; end: string } | null;
  /** Term dates already formatted for the reader's language. */
  termDates: { start: string; end: string } | null;
  courses: CourseOption[];
  classes: ClassSlot[];
  onChange: (classes: ClassSlot[]) => void;
  /** Called when a class is added, so "My class times" can be switched on. */
  onAdded: () => void;
  /** Lets the preview's prompt open the form. Bumped to request it. */
  openRequest: number;
};

type Draft = { code: string; day: string; start: string; end: string; place: string };

const EMPTY: Draft = { code: "", day: "", start: "", end: "", place: "" };

const FIELD_OF: Record<ClassSlotError, ClassField> = {
  "code-missing": "code",
  "code-invalid": "code",
  "day-missing": "day",
  "start-invalid": "start",
  "end-invalid": "end",
  "end-before-start": "end",
  "place-too-long": "place",
};

const FIELD_ORDER: ClassField[] = ["code", "day", "start", "end", "place"];

function toSlotDraft(draft: Draft) {
  return {
    code: draft.code,
    day: draft.day ? Number(draft.day) : undefined,
    start: draft.start,
    end: draft.end,
    place: draft.place,
  };
}

export default function ClassesStep({
  copy,
  term,
  termDates,
  courses,
  classes,
  onChange,
  onAdded,
  openRequest,
}: ClassesStepProps) {
  const c = copy.step2;
  const days = copy.preview.days;
  const uid = useId();
  const listId = `${uid}-courses`;
  const ids: Record<ClassField, string> = {
    code: "class-code",
    day: "class-day",
    start: "class-start",
    end: "class-end",
    place: "class-place",
  };

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [status, setStatus] = useState("");
  const [removed, setRemoved] = useState<{ slot: ClassSlot; index: number } | null>(null);
  const lastOpenRequest = useRef(openRequest);

  const atLimit = classes.length >= MAX_CLASSES && editing === null;

  function openForm(index: number | null) {
    const slot = index === null ? null : classes[index];
    setEditing(index);
    setDraft(
      slot
        ? {
            code: slot.code,
            day: String(slot.day),
            start: slot.start,
            end: slot.end,
            place: slot.place ?? "",
          }
        : EMPTY
    );
    setSubmitted(false);
    setDuplicate(false);
    setOpen(true);
    setTimeout(() => document.getElementById(ids.code)?.focus(), 0);
  }

  // The preview's "Add a class" button asks this step to open its form.
  useEffect(() => {
    if (openRequest !== lastOpenRequest.current) {
      lastOpenRequest.current = openRequest;
      openForm(null);
      document.getElementById("step-2")?.scrollIntoView?.({ block: "start" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openRequest]);

  const found = validateClassSlot(toSlotDraft(draft));
  const messages: Partial<Record<ClassField, string>> = {};
  if (submitted) {
    for (const error of found) {
      const field = FIELD_OF[error];
      if (!messages[field]) {
        messages[field] = fill(c.errors[error], { n: MAX_PLACE_LENGTH });
      }
    }
    if (duplicate && !messages.code) messages.code = c.duplicate;
  }
  const summaryItems = FIELD_ORDER.filter((field) => messages[field]).map((field) => ({
    id: ids[field],
    message: messages[field] as string,
  }));

  function dayName(day: number) {
    return days[day - 1] ?? "";
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (found.length > 0) {
      setDuplicate(false);
      return;
    }
    const slot: ClassSlot = {
      code: draft.code.trim().toUpperCase(),
      day: Number(draft.day) as ClassSlot["day"],
      start: draft.start,
      end: draft.end,
    };
    if (draft.place.trim()) slot.place = draft.place.trim();
    const clash = classes.some(
      (other, index) =>
        index !== editing &&
        other.code === slot.code &&
        other.day === slot.day &&
        other.start === slot.start
    );
    if (clash) {
      setDuplicate(true);
      return;
    }
    const next = [...classes];
    if (editing === null) next.push(slot);
    else next[editing] = slot;
    onChange(next);
    if (editing === null) onAdded();
    setStatus(
      fill(editing === null ? c.added : c.updated, { course: slot.code, day: dayName(slot.day) })
    );
    setRemoved(null);
    setOpen(false);
    setEditing(null);
    setTimeout(() => document.getElementById("class-add")?.focus(), 0);
  }

  function remove(index: number) {
    const slot = classes[index];
    if (!slot) return;
    onChange(classes.filter((_, i) => i !== index));
    setRemoved({ slot, index });
    setStatus("");
    if (editing === index) {
      setOpen(false);
      setEditing(null);
    }
  }

  function undo() {
    if (!removed) return;
    const next = [...classes];
    next.splice(Math.min(removed.index, next.length), 0, removed.slot);
    onChange(next.slice(0, MAX_CLASSES));
    setRemoved(null);
  }

  if (!term) {
    return (
      <Notice title={c.noTermTitle}>
        <p>{c.noTermBody}</p>
      </Notice>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="leading-relaxed text-muted">
        {fill(c.termRange, {
          start: termDates?.start ?? term.start,
          end: termDates?.end ?? term.end,
          semester: term.semester,
          year: term.year,
        })}
      </p>

      {classes.length === 0 ? (
        <p className="text-ink">{c.empty}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {classes.map((slot, index) => {
            const course = courses.find((option) => option.code === slot.code);
            return (
              <li
                key={`${slot.code}-${slot.day}-${slot.start}`}
                className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-semibold break-words text-ink">
                    {slot.code}
                    {course ? ` ${course.title}` : ""}
                  </p>
                  <p className="text-sm text-muted">
                    {fill(copy.preview.every, {
                      day: dayName(slot.day),
                      start: slot.start,
                      end: slot.end,
                    })}
                    {slot.place ? `, ${fill(copy.preview.placeAt, { place: slot.place })}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => openForm(index)}
                    aria-label={fill(c.editFor, { course: slot.code, day: dayName(slot.day) })}
                  >
                    {c.edit}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => remove(index)}
                    aria-label={fill(c.removeFor, { course: slot.code, day: dayName(slot.day) })}
                  >
                    {c.remove}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div role="status" aria-live="polite" className="text-sm font-medium text-ink empty:hidden">
        {removed ? (
          <span className="flex flex-wrap items-center gap-3">
            <span>
              {fill(c.removed, { course: removed.slot.code, day: dayName(removed.slot.day) })}
            </span>
            <Button type="button" variant="ghost" onClick={undo} className="underline">
              {c.undo}
            </Button>
          </span>
        ) : (
          status
        )}
      </div>

      {open ? (
        <form
          onSubmit={submit}
          noValidate
          aria-labelledby={`${uid}-form-heading`}
          className="flex flex-col gap-5 rounded-lg border border-line-strong bg-surface p-5"
        >
          <h3 id={`${uid}-form-heading`} className="font-display text-lg">
            {editing === null ? c.formAdd : c.formEdit}
          </h3>
          {summaryItems.length > 0 ? (
            <ErrorSummary title={c.errorTitle} errors={summaryItems} />
          ) : null}
          <Field
            label={c.code.label}
            hint={c.code.hint}
            name="code"
            id={ids.code}
            list={listId}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            value={draft.code}
            error={messages.code}
            onChange={(event) => setDraft({ ...draft, code: event.target.value })}
          />
          <datalist id={listId}>
            {courses.map((course) => (
              <option key={course.code} value={course.code}>
                {course.code} {course.title}
              </option>
            ))}
          </datalist>
          <Field
            as="select"
            label={c.day.label}
            name="day"
            id={ids.day}
            value={draft.day}
            error={messages.day}
            options={[
              { value: "", label: c.day.placeholder },
              ...days.map((name, index) => ({ value: String(index + 1), label: name })),
            ]}
            onChange={(event) => setDraft({ ...draft, day: event.target.value })}
          />
          <div className="grid grid-cols-1 gap-5 min-[420px]:grid-cols-2">
            <Field
              label={c.start}
              name="start"
              id={ids.start}
              type="time"
              value={draft.start}
              error={messages.start}
              onChange={(event) => setDraft({ ...draft, start: event.target.value })}
            />
            <Field
              label={c.end}
              name="end"
              id={ids.end}
              type="time"
              value={draft.end}
              error={messages.end}
              onChange={(event) => setDraft({ ...draft, end: event.target.value })}
            />
          </div>
          <Field
            label={c.place.label}
            hint={c.place.hint}
            optionalLabel={c.optional}
            name="place"
            id={ids.place}
            autoComplete="off"
            value={draft.place}
            error={messages.place}
            onChange={(event) => setDraft({ ...draft, place: event.target.value })}
          />
          <div className="flex flex-wrap gap-3">
            <Button type="submit">{editing === null ? c.save : c.saveEdit}</Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setOpen(false);
                setEditing(null);
                setTimeout(() => document.getElementById("class-add")?.focus(), 0);
              }}
            >
              {c.cancel}
            </Button>
          </div>
        </form>
      ) : atLimit ? (
        <p className="text-sm text-muted">{fill(c.limit, { n: MAX_CLASSES })}</p>
      ) : null}

      {!open && !atLimit ? (
        <div>
          <Button id="class-add" type="button" variant="secondary" onClick={() => openForm(null)}>
            {c.add}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
