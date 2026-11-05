"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Button from "@/components/Button";
import Field from "@/components/Field";
import ErrorSummary from "@/components/ErrorSummary";
import Notice from "@/components/Notice";
import {
  findTimetableEntry,
  formatRoom,
  hasTimetable,
  knownRooms,
  timetableEntriesByCode,
  timetableForTerm,
  type TimetableEntry,
  type TimetableGroup,
} from "@/content/calendar/timetable";
import { matchesFields, searchCourses } from "@/lib/calendar-builder/courseSearch";
import { examOccurrences } from "@/lib/calendar-builder/exams";
import {
  MAX_CLASSES,
  MAX_PLACE_LENGTH,
  validateClassSlot,
  type ClassSlot,
  type ClassSlotError,
} from "@/lib/calendar-builder/selection";
import type { CalendarBuilderCopy, ClassField } from "@/content/calendar-builder/types";
import type { Locale } from "@/lib/i18n";
import Combobox, { type ComboboxGroup, type ComboboxOption } from "./Combobox";
import { fill, plural, shortDate } from "./helpers";

export type CourseOption = { code: string; title: string };

export type BuilderTerm = {
  /** `2569-2`. */
  key: string;
  year: number;
  semester: number | string;
  start: string;
  end: string;
};

export type ClassesStepProps = {
  copy: CalendarBuilderCopy;
  locale: Locale;
  /** Terms that can be chosen; empty when no dates are published. */
  terms: BuilderTerm[];
  termKey: string;
  onTermChange: (key: string) => void;
  /** Term dates already formatted for the reader's language, by term key. */
  termDates: Record<string, { start: string; end: string }>;
  courses: CourseOption[];
  /** The chosen term's classes. */
  classes: ClassSlot[];
  onChange: (classes: ClassSlot[]) => void;
  /** Lets the preview's prompt open the form. Bumped to request it. */
  openRequest: number;
};

type Draft = {
  code: string;
  day: string;
  start: string;
  end: string;
  place: string;
  section: string;
  /** The editable fields are open for a course that comes from the timetable. */
  edit: boolean;
};

const EMPTY: Draft = { code: "", day: "", start: "", end: "", place: "", section: "", edit: false };

const FIELD_OF: Record<ClassSlotError, ClassField> = {
  "code-missing": "code",
  "code-invalid": "code",
  "day-missing": "day",
  "start-invalid": "start",
  "end-invalid": "end",
  "end-before-start": "end",
  "place-too-long": "place",
  "section-invalid": "section",
};

const FIELD_ORDER: ClassField[] = ["code", "section", "day", "start", "end", "place"];

/** Slots that students most often start at, offered as native time suggestions. */
const COMMON_TIMES = ["08:30", "09:00", "12:00", "13:00", "13:30", "16:00", "16:30"];

const QUICK_GROUPS: { id: "year1" | "year2"; group: TimetableGroup }[] = [
  { id: "year1", group: "year1" },
  { id: "year2", group: "year2" },
];

function toSlotDraft(draft: Draft) {
  return {
    code: draft.code,
    day: draft.day ? Number(draft.day) : undefined,
    start: draft.start,
    end: draft.end,
    place: draft.place,
    section: draft.section,
  };
}

function overlaps(a: { day: number; start: string; end: string }, b: ClassSlot): boolean {
  return a.day === b.day && a.start < b.end && b.start < a.end;
}

function cleanCode(code: string): string {
  return code.trim().toUpperCase();
}

export default function ClassesStep({
  copy,
  locale,
  terms,
  termKey,
  onTermChange,
  termDates,
  courses,
  classes,
  onChange,
  openRequest,
}: ClassesStepProps) {
  const c = copy.step2;
  const days = copy.preview.days;
  const uid = useId();
  const ids: Record<ClassField, string> = {
    code: "class-code",
    section: "class-section",
    day: "class-day",
    start: "class-start",
    end: "class-end",
    place: "class-place",
  };

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState<{ text: string; restore?: ClassSlot[] } | null>(null);
  const lastOpenRequest = useRef(openRequest);

  const term = terms.find((t) => t.key === termKey) ?? null;
  const timetabled = hasTimetable(termKey);
  const atLimit = classes.length >= MAX_CLASSES && editing === null;
  const dayName = (day: number) => days[day - 1] ?? "";
  const shortDay = (day: number) => copy.preview.daysShort[day - 1] ?? "";
  const room = (value: string) => formatRoom(value, locale);

  function titleFor(code: string): string | undefined {
    return (
      timetableEntriesByCode(termKey, code)[0]?.title ??
      courses.find((option) => option.code === code)?.title
    );
  }

  const entries = timetableEntriesByCode(termKey, cleanCode(draft.code));
  const needsSection = entries.length > 1;
  const chosenEntry: TimetableEntry | null =
    entries.length === 1
      ? (entries[0] as TimetableEntry)
      : (entries.find((entry) => entry.section === draft.section) ?? null);
  const showSummary = chosenEntry !== null && !draft.edit;
  const showFields = entries.length === 0 || (chosenEntry !== null && draft.edit);

  function fillFrom(entry: TimetableEntry, base: Draft): Draft {
    return {
      ...base,
      code: entry.code,
      day: String(entry.day),
      start: entry.start,
      end: entry.end,
      place: room(entry.room),
      section: entry.section ?? "",
      edit: false,
    };
  }

  /** Sets the course text and, when it names a timetable course, fills the rest. */
  function applyCode(text: string, base: Draft = draft) {
    const next = timetableEntriesByCode(termKey, cleanCode(text));
    const before = timetableEntriesByCode(termKey, cleanCode(base.code));
    const blank = { day: "", start: "", end: "", place: "", section: "", edit: false };
    if (next.length === 1) {
      setDraft(fillFrom(next[0] as TimetableEntry, { ...base, code: text }));
    } else if (next.length > 1) {
      setDraft({ ...base, ...blank, code: text });
    } else if (before.length > 0 && !base.edit) {
      setDraft({ ...base, ...blank, code: text });
    } else {
      setDraft({ ...base, code: text, section: "" });
    }
  }

  function chooseSection(section: string) {
    const entry = entries.find((candidate) => candidate.section === section);
    if (entry) setDraft(fillFrom(entry, draft));
  }

  function matchesTimetable(slot: ClassSlot, entry: TimetableEntry): boolean {
    return (
      slot.day === entry.day &&
      slot.start === entry.start &&
      slot.end === entry.end &&
      (slot.place === room(entry.room) ||
        slot.place === formatRoom(entry.room, "en") ||
        slot.place === formatRoom(entry.room, "th"))
    );
  }

  function openForm(index: number | null, code = "", focusId: string = ids.code) {
    const slot = index === null ? null : classes[index];
    setEditing(index);
    setSubmitted(false);
    if (slot) {
      const entry = findTimetableEntry(termKey, slot.code, slot.section);
      setDraft({
        code: slot.code,
        day: String(slot.day),
        start: slot.start,
        end: slot.end,
        place: slot.place ?? "",
        section: slot.section ?? "",
        edit: entry ? !matchesTimetable(slot, entry) : false,
      });
    } else {
      setDraft(EMPTY);
      if (code) applyCode(code, EMPTY);
    }
    setOpen(true);
    setTimeout(() => document.getElementById(focusId)?.focus(), 0);
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

  const slotNow: ClassSlot | null = (() => {
    const found = validateClassSlot(toSlotDraft(draft));
    if (found.length > 0) return null;
    const slot: ClassSlot = {
      code: cleanCode(draft.code),
      day: Number(draft.day) as ClassSlot["day"],
      start: draft.start,
      end: draft.end,
    };
    if (draft.place.trim()) slot.place = draft.place.trim();
    if (draft.section) slot.section = draft.section;
    return slot;
  })();

  /** Same course already in the list. Timetable courses meet once a week, so a repeat is a duplicate. */
  function duplicateOf(code: string, section: string, at: { day: number; start: string } | null) {
    return classes.find((other, index) => {
      if (index === editing || other.code !== code) return false;
      if (entries.length > 0) return (other.section ?? "") === section;
      return at !== null && other.day === at.day && other.start === at.start;
    });
  }

  const codeNow = cleanCode(draft.code);
  const dupNow =
    codeNow && !(needsSection && !draft.section)
      ? duplicateOf(
          codeNow,
          draft.section,
          slotNow ? { day: slotNow.day, start: slotNow.start } : null
        )
      : undefined;
  const clashes = slotNow
    ? classes.filter((other, index) => index !== editing && overlaps(slotNow, other))
    : [];

  const found = validateClassSlot(toSlotDraft(draft));
  const sectionMissing = needsSection && !draft.section;
  const shownErrors = sectionMissing ? found.filter((e) => FIELD_OF[e] === "code") : found;
  const messages: Partial<Record<ClassField, string>> = {};
  if (dupNow) messages.code = fill(c.duplicate, { course: dupNow.code });
  if (submitted) {
    for (const error of shownErrors) {
      const field = FIELD_OF[error];
      if (!messages[field]) messages[field] = fill(c.errors[error], { n: MAX_PLACE_LENGTH });
    }
    if (sectionMissing) messages.section = c.section.missing;
  }
  const summaryItems = submitted
    ? FIELD_ORDER.filter((field) => messages[field]).map((field) => ({
        id: ids[field],
        message: messages[field] as string,
      }))
    : [];

  function closeForm() {
    setOpen(false);
    setEditing(null);
    setTimeout(() => document.getElementById("class-add")?.focus(), 0);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (shownErrors.length > 0 || sectionMissing || dupNow || !slotNow) return;
    const next = [...classes];
    if (editing === null) next.push(slotNow);
    else next[editing] = slotNow;
    onChange(next);
    setNotice({
      text: fill(editing === null ? c.added : c.updated, {
        course: slotNow.code,
        day: dayName(slotNow.day),
      }),
    });
    closeForm();
  }

  function remove(index: number) {
    const slot = classes[index];
    if (!slot) return;
    onChange(classes.filter((_, i) => i !== index));
    setNotice({
      text: fill(c.removed, { course: slot.code, day: dayName(slot.day) }),
      restore: classes,
    });
    if (editing === index) {
      setOpen(false);
      setEditing(null);
    }
  }

  function undo() {
    if (!notice?.restore) return;
    onChange(notice.restore.slice(0, MAX_CLASSES));
    setNotice({ text: c.undone });
  }

  function changeTerm(key: string) {
    if (key === termKey) return;
    setOpen(false);
    setEditing(null);
    setNotice(null);
    setDraft(EMPTY);
    onTermChange(key);
  }

  function slotFromEntry(entry: TimetableEntry): ClassSlot {
    return {
      code: entry.code,
      day: entry.day,
      start: entry.start,
      end: entry.end,
      place: room(entry.room),
    };
  }

  /** Adds every unambiguous course in a group. A course with sections asks for the section. */
  function quickAdd(group: TimetableGroup) {
    const codes = [
      ...new Set(
        timetableForTerm(termKey)
          .filter((entry) => entry.group === group)
          .map((entry) => entry.code)
      ),
    ];
    const toAdd: ClassSlot[] = [];
    let sectionFor: string | null = null;
    for (const code of codes) {
      if (classes.some((slot) => slot.code === code)) continue;
      const list = timetableEntriesByCode(termKey, code);
      if (list.length > 1) sectionFor ??= code;
      else toAdd.push(slotFromEntry(list[0] as TimetableEntry));
    }
    const room_ = MAX_CLASSES - classes.length;
    const added = toAdd.slice(0, Math.max(0, room_));
    const parts: string[] = [];
    if (added.length > 0) parts.push(plural(c.quick.added, added.length));
    if (added.length < toAdd.length) parts.push(c.quick.full);
    if (sectionFor) parts.push(fill(c.quick.section, { course: sectionFor }));
    if (parts.length === 0) parts.push(c.quick.none);
    if (added.length > 0) onChange([...classes, ...added]);
    setNotice({ text: parts.join(" "), restore: added.length > 0 ? classes : undefined });
    if (sectionFor && classes.length + added.length < MAX_CLASSES) {
      setEditing(null);
      setSubmitted(false);
      const base: Draft = EMPTY;
      applyCode(sectionFor, base);
      setOpen(true);
      setTimeout(() => document.getElementById(ids.section)?.focus(), 0);
    }
  }

  const addedCodes = useMemo(() => new Set(classes.map((slot) => slot.code)), [classes]);

  const curriculum = useMemo(
    () => courses.map((course) => ({ code: course.code, title: course.title })),
    [courses]
  );
  const result = useMemo(
    () =>
      searchCourses({
        termKey,
        query: draft.code,
        locale,
        curriculum,
        otherLabel: timetabled ? c.combo.groupOther : c.combo.groupAll,
      }),
    [termKey, draft.code, locale, curriculum, timetabled, c.combo.groupOther, c.combo.groupAll]
  );

  const courseGroups: ComboboxGroup[] = result.groups.map((group) => ({
    id: group.id,
    label: group.label,
    options: group.options.map((option) => {
      const base: ComboboxOption = {
        id: option.key,
        primary: `${option.code} ${option.title}`,
        ...(addedCodes.has(option.code) ? { tag: c.combo.added } : {}),
      };
      if (option.kind === "other") return base;
      const first = option.entries[0] as TimetableEntry;
      const rooms = [...new Set(option.entries.map((e) => room(e.room)))];
      const roomText =
        rooms.length > 1
          ? fill(c.section.roomsJoin, { a: rooms[0] as string, b: rooms[1] as string })
          : (rooms[0] as string);
      return {
        ...base,
        secondary: fill(c.detail, {
          day: shortDay(first.day),
          start: first.start,
          end: first.end,
          room: roomText,
        }),
      };
    }),
  }));

  const placeGroups: ComboboxGroup[] = useMemo(() => {
    const rooms = knownRooms().filter((r) => matchesFields([r, formatRoom(r, "th")], draft.place));
    return rooms.length > 0
      ? [{ id: "rooms", options: rooms.map((r) => ({ id: r, primary: formatRoom(r, locale) })) }]
      : [];
  }, [draft.place, locale]);

  if (terms.length === 0 || !term) {
    return (
      <Notice title={c.noTermTitle}>
        <p>{c.noTermBody}</p>
      </Notice>
    );
  }

  const termDatesNow = termDates[term.key];
  const summaryOccurrences = chosenEntry
    ? examOccurrences(
        termKey,
        [{ code: chosenEntry.code, section: chosenEntry.section } as ClassSlot],
        locale
      )
    : [];
  const midterm = summaryOccurrences.find((exam) => exam.kind === "midterm");
  const finalExam = summaryOccurrences.find((exam) => exam.kind === "final");
  const examText = (exam: typeof midterm) =>
    exam
      ? fill(c.summary.dateTime, {
          date: shortDate(locale, exam.date),
          start: exam.start,
          end: exam.end,
        }) + (exam.room ? `, ${exam.room}` : "")
      : "";
  const quickPending = (group: TimetableGroup) =>
    [
      ...new Set(
        timetableForTerm(termKey)
          .filter((entry) => entry.group === group)
          .map((entry) => entry.code)
      ),
    ].some((code) => !addedCodes.has(code));

  return (
    <div className="flex flex-col gap-5">
      <fieldset className="min-w-0 border-0 p-0">
        <legend className="mb-3 text-base font-semibold text-ink">{c.term.legend}</legend>
        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
          {terms.map((option) => {
            const dates = termDates[option.key];
            return (
              <label
                key={option.key}
                className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border bg-surface px-4 py-3 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink ${
                  option.key === termKey ? "border-ink bg-sunken" : "border-line-strong"
                }`}
              >
                <input
                  type="radio"
                  name={`${uid}-term`}
                  value={option.key}
                  checked={option.key === termKey}
                  onChange={() => changeTerm(option.key)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-brand)]"
                />
                <span className="flex min-w-0 flex-col">
                  <span className="font-semibold text-ink">
                    {fill(c.term.option, { semester: option.semester, year: option.year })}
                  </span>
                  <span className="text-sm text-muted">
                    {fill(c.term.dates, {
                      start: dates?.start ?? option.start,
                      end: dates?.end ?? option.end,
                    })}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <p className="leading-relaxed text-muted">
        {fill(c.termRange, {
          start: termDatesNow?.start ?? term.start,
          end: termDatesNow?.end ?? term.end,
          semester: term.semester,
          year: term.year,
        })}{" "}
        {timetabled ? c.timetableNote : c.noTimetableNote}
      </p>

      {timetabled ? (
        <fieldset className="min-w-0 border-0 p-0">
          <legend className="mb-2 text-sm font-semibold text-ink">{c.quick.legend}</legend>
          <div className="flex flex-wrap gap-3">
            {QUICK_GROUPS.map(({ id, group }) => (
              <Button
                key={id}
                type="button"
                variant="secondary"
                onClick={() => quickAdd(group)}
                disabled={!quickPending(group) || atLimit}
              >
                {c.quick[id]}
              </Button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {classes.length === 0 ? (
        <p className="text-ink">{c.empty}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {classes.map((slot, index) => {
            const title = titleFor(slot.code);
            const clash = classes.find((other, i) => i !== index && overlaps(slot, other));
            return (
              <li
                key={`${slot.code}-${slot.section ?? ""}-${slot.day}-${slot.start}`}
                className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-semibold break-words text-ink">
                    {slot.code}
                    {title ? ` ${title}` : ""}
                    {slot.section
                      ? ` (${fill(copy.preview.section, { section: slot.section })})`
                      : ""}
                  </p>
                  <p className="text-sm text-muted">
                    {fill(copy.preview.every, {
                      day: dayName(slot.day),
                      start: slot.start,
                      end: slot.end,
                    })}
                    {slot.place ? `, ${fill(copy.preview.placeAt, { place: slot.place })}` : ""}
                  </p>
                  {clash ? (
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-warning">
                      <WarningIcon />
                      {fill(c.clashInList, { course: clash.code })}
                    </p>
                  ) : null}
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
        {notice ? (
          <span className="flex flex-wrap items-center gap-3">
            <span>{notice.text}</span>
            {notice.restore ? (
              <Button type="button" variant="ghost" onClick={undo} className="underline">
                {c.undo}
              </Button>
            ) : null}
          </span>
        ) : null}
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

          <Combobox
            id={ids.code}
            name="code"
            label={c.code.label}
            hint={c.code.hint}
            error={messages.code}
            value={draft.code}
            onChange={(value) => applyCode(value)}
            onSelect={(option) => applyCode(option.id)}
            onCommit={() => undefined}
            groups={courseGroups}
            noMatches={{ title: c.combo.noMatches, hint: c.combo.noMatchesHint }}
            resultsStatus={(n) => plural(c.combo.results, n)}
            footer={result.hidden > 0 ? fill(c.combo.more, { n: result.hidden }) : undefined}
            autoCapitalize="characters"
            maxLength={12}
          />

          {needsSection ? (
            <fieldset
              className="min-w-0 border-0 p-0"
              aria-describedby={messages.section ? `${ids.section}-error` : undefined}
            >
              <legend className="mb-2 text-sm font-semibold text-ink">{c.section.legend}</legend>
              <div className="flex flex-col gap-2">
                {entries.map((entry, index) => (
                  <label
                    key={entry.section}
                    className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-line-strong bg-surface px-4 py-2.5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink"
                  >
                    <input
                      type="radio"
                      id={index === 0 ? ids.section : undefined}
                      name={`${uid}-section`}
                      value={entry.section}
                      checked={draft.section === entry.section}
                      onChange={() => chooseSection(entry.section as string)}
                      className="h-5 w-5 shrink-0 accent-[var(--color-brand)]"
                    />
                    <span className="text-ink">
                      {fill(c.section.option, {
                        section: entry.section as string,
                        room: room(entry.room),
                      })}
                    </span>
                  </label>
                ))}
              </div>
              {messages.section ? (
                <p
                  id={`${ids.section}-error`}
                  className="mt-2 flex items-center gap-1.5 text-sm font-medium text-error"
                >
                  <WarningIcon />
                  {messages.section}
                </p>
              ) : null}
            </fieldset>
          ) : null}

          {showSummary && chosenEntry ? (
            <div className="flex flex-col gap-3 rounded-lg border border-line bg-sunken p-4">
              <p className="text-sm font-semibold text-muted">{c.summary.heading}</p>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-[0.95rem] sm:grid-cols-[auto_minmax(0,1fr)]">
                <dt className="font-semibold text-ink">{c.summary.when}</dt>
                <dd className="text-ink">
                  {fill(copy.preview.every, {
                    day: dayName(chosenEntry.day),
                    start: chosenEntry.start,
                    end: chosenEntry.end,
                  })}
                </dd>
                <dt className="font-semibold text-ink">{c.summary.place}</dt>
                <dd className="text-ink">{room(chosenEntry.room)}</dd>
                {chosenEntry.lecturer ? (
                  <>
                    <dt className="font-semibold text-ink">{c.summary.lecturer}</dt>
                    <dd className="text-ink">{chosenEntry.lecturer}</dd>
                  </>
                ) : null}
                <dt className="font-semibold text-ink">{c.summary.midterm}</dt>
                <dd className="text-ink">{examText(midterm)}</dd>
                <dt className="font-semibold text-ink">{c.summary.final}</dt>
                <dd className="text-ink">{examText(finalExam)}</dd>
              </dl>
              <div>
                <Button
                  type="button"
                  variant="secondary"
                  aria-expanded={false}
                  aria-controls={`${uid}-fields`}
                  onClick={() => {
                    setDraft({ ...draft, edit: true });
                    setTimeout(() => document.getElementById(ids.day)?.focus(), 0);
                  }}
                >
                  {c.summary.change}
                </Button>
              </div>
            </div>
          ) : null}

          {showFields ? (
            <div id={`${uid}-fields`} className="flex flex-col gap-5">
              {chosenEntry ? (
                <div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="underline"
                    aria-expanded={true}
                    aria-controls={`${uid}-fields`}
                    onClick={() => setDraft(fillFrom(chosenEntry, draft))}
                  >
                    {c.summary.reset}
                  </Button>
                </div>
              ) : null}
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
                  list={`${uid}-times`}
                  value={draft.start}
                  error={messages.start}
                  onChange={(event) => setDraft({ ...draft, start: event.target.value })}
                />
                <Field
                  label={c.end}
                  name="end"
                  id={ids.end}
                  type="time"
                  list={`${uid}-times`}
                  value={draft.end}
                  error={messages.end}
                  onChange={(event) => setDraft({ ...draft, end: event.target.value })}
                />
              </div>
              <datalist id={`${uid}-times`}>
                {COMMON_TIMES.map((time) => (
                  <option key={time} value={time} />
                ))}
              </datalist>
              <Combobox
                id={ids.place}
                name="place"
                label={c.place.label}
                hint={c.place.hint}
                optionalLabel={c.optional}
                error={messages.place}
                value={draft.place}
                onChange={(value) => setDraft({ ...draft, place: value })}
                onSelect={(option) => setDraft({ ...draft, place: option.primary })}
                groups={placeGroups}
                resultsStatus={(n) => plural(c.combo.results, n)}
                maxLength={MAX_PLACE_LENGTH + 20}
              />
            </div>
          ) : null}

          {clashes.length > 0 ? (
            <div
              role="status"
              className="flex flex-col gap-1 border-l-[5px] border-line-strong py-1 pl-4 text-ink"
            >
              {clashes.map((other) => (
                <p
                  key={`${other.code}-${other.section ?? ""}-${other.day}-${other.start}`}
                  className="flex items-start gap-2 leading-relaxed"
                >
                  <WarningIcon />
                  {fill(c.clash, {
                    course: other.code,
                    day: dayName(other.day),
                    start: other.start,
                    end: other.end,
                  })}
                </p>
              ))}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit">{editing === null ? c.save : c.saveEdit}</Button>
            <Button type="button" variant="ghost" onClick={closeForm}>
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

function WarningIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0">
      <path
        d="M10 2.5 18 16.5H2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
      <path d="M10 7.8v4" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
      <circle cx="10" cy="14.1" r="0.9" fill="currentColor" />
    </svg>
  );
}
