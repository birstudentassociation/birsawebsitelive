"use client";

/**
 * "Type the course name and it autofills" — an ARIA 1.2 combobox over a
 * catalogue of courses, with a native `<select>` as its progressive-enhancement
 * baseline. Mirrors `components/search/SearchBox.tsx`'s keyboard, blur, and
 * pointerdown idioms; the matching itself lives in the pure, React-free
 * `lib/study-plan/courseMatch.ts`, shared with the server-side counterpart
 * that Server Actions call when a typed name reaches them unresolved.
 *
 * Before mount (and therefore in the server-rendered HTML, and forever with
 * JavaScript disabled) this is nothing but a `<select>` full of `<optgroup>`s
 * — the whole study-plan journey has a no-JavaScript end-to-end test and this
 * control sits on it, so that baseline has to be byte-for-byte ordinary HTML.
 * `enhanced` starts false and flips true in a `useEffect`, so the server
 * render and the first client render agree and there is no hydration
 * mismatch; only after that effect runs does the typeahead take over.
 *
 * Once enhanced, the visible text input carries no `name` of its own — only
 * a hidden input does, holding the resolved course code — so a half-typed,
 * unresolved string can never be what actually gets submitted. Losing focus
 * with unresolved text either autofills the course that text unambiguously
 * means (`resolveCourseQuery`) or reverts to the last real selection: this is
 * `confirmOnBlur` in GOV.UK's accessible-autocomplete, and it exists so a
 * select-only combobox never leaves free text on screen that answers nothing.
 */
import { useEffect, useMemo, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import clsx from "clsx";
import { filterCourseOptions, resolveCourseQuery } from "@/lib/study-plan/courseMatch";

export type CourseComboboxOption = { value: string; label: string; keywords?: string };
export type CourseComboboxGroup = { id: string; label: string; options: CourseComboboxOption[] };
export type CourseComboboxCopy = {
  /** The select's empty prompt and the input's placeholder, e.g. "Choose a course". */
  prompt: string;
  /** Hint under the label, e.g. "Start typing a course code or name." */
  typeaheadHint: string;
  /** Shown in the listbox when the typed text matches nothing. */
  noMatches: string;
  /** Contains "{n}"; announced to screen readers as the list changes. */
  resultsTemplate: string;
  /** Accessible name of the button that empties the field. */
  clearLabel: string;
};
export type CourseComboboxProps = {
  id: string;
  /** Form field name, e.g. "code" or `slot-${slotId}`. */
  name: string;
  /** Visible <label> text. */
  label: string;
  groups: CourseComboboxGroup[];
  /** Option value selected on arrival; "" for none. */
  defaultValue?: string;
  /** An option offered before every group and outside all of them (the fill step's "I have not taken this yet"); its value is normally "". */
  emptyOption?: CourseComboboxOption;
  copy: CourseComboboxCopy;
  className?: string;
};

/**
 * One selectable row. Extracted because the listbox renders the same row in
 * three places (the empty option, an unlabelled group's rows, and a labelled
 * group's rows) and three copies of the same ARIA attributes is three places
 * for them to drift apart.
 */
function OptionRow({
  id,
  option,
  active,
  onSelect,
  onHover,
}: {
  id: string;
  option: CourseComboboxOption;
  active: boolean;
  onSelect: () => void;
  onHover: () => void;
}) {
  return (
    <li
      id={id}
      role="option"
      aria-selected={active}
      onClick={onSelect}
      onMouseEnter={onHover}
      className={clsx("cursor-pointer px-3.5 py-2.5 text-sm text-ink", active ? "bg-sunken" : "")}
    >
      {option.label}
    </li>
  );
}

export default function CourseCombobox({
  id,
  name,
  label,
  groups,
  defaultValue,
  emptyOption,
  copy,
  className,
}: CourseComboboxProps) {
  // Every option this widget knows about, flattened, in the order the
  // catalogue was handed to us. Used for the initial label lookup and for
  // resolving whatever the student typed on blur.
  const allOptions = useMemo(
    () =>
      emptyOption
        ? [emptyOption, ...groups.flatMap((g) => g.options)]
        : groups.flatMap((g) => g.options),
    [groups, emptyOption]
  );

  const initialOption = useMemo(
    () => allOptions.find((option) => option.value === (defaultValue ?? "")) ?? null,
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only the initial mount matters here
    []
  );

  const [enhanced, setEnhanced] = useState(false);
  const [text, setText] = useState(initialOption?.label ?? "");
  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // The server render and the first client render must both produce the
  // no-JS fallback, so the enhanced widget can only be swapped in after
  // mount — see the file header comment.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setEnhanced(true), []);

  const listboxId = `${id}-listbox`;
  const hintId = `${id}-hint`;
  const optionId = (index: number) => `${id}-option-${index}`;

  // The options the current text matches, grouped the way they were given
  // to us, plus their position in the flat list keyboard navigation moves
  // over. A group with no surviving option is dropped entirely, and the
  // empty option (when present) is filtered exactly like any other.
  const emptyMatches = emptyOption ? filterCourseOptions([emptyOption], text) : [];
  const filteredGroups = groups
    .map((group) => ({ ...group, options: filterCourseOptions(group.options, text) }))
    .filter((group) => group.options.length > 0);

  const flatOptions: CourseComboboxOption[] = [
    ...emptyMatches,
    ...filteredGroups.flatMap((group) => group.options),
  ];
  const visibleCount = flatOptions.length;
  // Each option's position in `flatOptions` — the list keyboard navigation
  // and `aria-activedescendant` move over — found by identity rather than a
  // running counter, since course values are unique across the whole
  // catalogue and a mutated counter would not survive a re-render cleanly.
  const groupRows = filteredGroups.map((group) => ({
    group,
    rows: group.options.map((option) => ({ option, index: flatOptions.indexOf(option) })),
  }));

  function closeList() {
    setOpen(false);
    setActiveIndex(-1);
  }

  function selectOption(option: CourseComboboxOption) {
    setText(option.label);
    setValue(option.value);
    closeList();
  }

  /**
   * Blur-out commit: resolves whatever text is on screen against the whole
   * catalogue, exactly once, the moment focus leaves the widget. A resolved
   * string autofills that course; an empty field clears the selection; text
   * that is neither reverts to the last real selection (or to empty, if
   * there wasn't one) so nothing but a genuine course label is ever left on
   * screen.
   */
  function commitOnBlur() {
    const trimmed = text.trim();
    if (trimmed === "") {
      setValue("");
      closeList();
      return;
    }
    const resolved = resolveCourseQuery(allOptions, text);
    if (resolved) {
      setText(resolved.label);
      setValue(resolved.value);
    } else {
      const current = allOptions.find((option) => option.value === value);
      setText(current?.label ?? "");
    }
    closeList();
  }

  // Same idiom as SearchBox: React's onBlur bubbles from any descendant, so
  // this fires whenever focus leaves the widget for something other than an
  // option click (those are protected below by preventing the mousedown
  // that would blur the input first).
  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget as Node | null;
    if (!next || !containerRef.current?.contains(next)) {
      commitOnBlur();
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      if (flatOptions.length === 0) return;
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => (current + 1) % flatOptions.length);
      return;
    }
    if (event.key === "ArrowUp") {
      if (flatOptions.length === 0) return;
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => (current <= 0 ? flatOptions.length - 1 : current - 1));
      return;
    }
    if (event.key === "Enter") {
      if (open && activeIndex >= 0) {
        const active = flatOptions[activeIndex];
        if (active) {
          event.preventDefault();
          selectOption(active);
        }
      }
      return;
    }
    if (event.key === "Escape" && open) {
      // Close without clearing the input or moving focus away from it.
      event.preventDefault();
      closeList();
    }
  }

  const activeId = open && activeIndex >= 0 ? optionId(activeIndex) : undefined;

  if (!enhanced) {
    return (
      <div className={clsx("flex flex-col gap-1.5", className)}>
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
        </label>
        <select
          id={id}
          name={name}
          defaultValue={defaultValue ?? ""}
          className="focus-halo h-11 w-full rounded-md border border-input-border bg-surface px-3.5 py-2.5 text-[0.95rem] text-ink"
        >
          {emptyOption ? (
            <option value={emptyOption.value}>{emptyOption.label}</option>
          ) : (
            <option value="" disabled>
              {copy.prompt}
            </option>
          )}
          {groups.map((group) =>
            group.label === "" ? (
              // An unlabelled group is one the caller has nothing to say
              // about: the fill step gives each slot a single group whose
              // heading would only repeat the field's own label. `<optgroup
              // label="">` would draw an empty heading in the native select,
              // so the options go straight into it instead.
              group.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            ) : (
              <optgroup key={group.id} label={group.label}>
                {group.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            )
          )}
        </select>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onBlur={handleBlur}
      className={clsx("relative flex flex-col gap-1.5", className)}
    >
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <p id={hintId} className="text-sm text-muted">
        {copy.typeaheadHint}
      </p>
      <div className="relative flex items-center gap-2">
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          aria-describedby={hintId}
          autoComplete="off"
          value={text}
          placeholder={copy.prompt}
          onChange={(event) => {
            setText(event.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          className="focus-halo h-11 w-full rounded-md border border-input-border bg-surface px-3.5 py-2.5 text-[0.95rem] text-ink placeholder:text-muted"
        />
        {text !== "" ? (
          <button
            type="button"
            onClick={() => {
              setText("");
              setValue("");
              setOpen(true);
              setActiveIndex(-1);
            }}
            aria-label={copy.clearLabel}
            className="focus-halo absolute right-2 shrink-0 text-muted hover:text-ink"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        ) : null}
      </div>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={label}
          // Prevents the input from blurring when an option is pressed, so
          // the click below always lands before an outside-blur handler
          // could close (and revert) the list first.
          onMouseDown={(event) => event.preventDefault()}
          className="absolute inset-x-0 top-full z-10 mt-1 max-h-72 overflow-y-auto rounded-md border border-line bg-surface shadow-lg"
        >
          {emptyMatches.map((option) => (
            <OptionRow
              key={option.value || "__empty__"}
              id={optionId(0)}
              option={option}
              active={activeIndex === 0}
              onSelect={() => selectOption(option)}
              onHover={() => setActiveIndex(0)}
            />
          ))}
          {groupRows.map(({ group, rows }) =>
            // The unlabelled-group case, as in the native select above: no
            // heading and no `role="group"`, because an `aria-label=""` names
            // nothing and a group of one heading-less row is not a grouping.
            group.label === "" ? (
              rows.map(({ option, index }) => (
                <OptionRow
                  key={option.value}
                  id={optionId(index)}
                  option={option}
                  active={activeIndex === index}
                  onSelect={() => selectOption(option)}
                  onHover={() => setActiveIndex(index)}
                />
              ))
            ) : (
              <li key={group.id} role="presentation">
                <span className="block px-3.5 pt-2.5 text-xs font-semibold tracking-wide text-muted uppercase">
                  {group.label}
                </span>
                <ul role="group" aria-label={group.label}>
                  {rows.map(({ option, index }) => (
                    <OptionRow
                      key={option.value}
                      id={optionId(index)}
                      option={option}
                      active={activeIndex === index}
                      onSelect={() => selectOption(option)}
                      onHover={() => setActiveIndex(index)}
                    />
                  ))}
                </ul>
              </li>
            )
          )}
          {visibleCount === 0 ? (
            <li role="presentation" className="px-3.5 py-2.5 text-sm text-muted">
              {copy.noMatches}
            </li>
          ) : null}
        </ul>
      ) : null}

      <input type="hidden" name={name} value={value} />

      <span role="status" className="sr-only">
        {open ? copy.resultsTemplate.replace("{n}", String(visibleCount)) : ""}
      </span>
    </div>
  );
}
