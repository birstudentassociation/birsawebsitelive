"use client";

/**
 * An editable combobox with list autocomplete, following the WAI-ARIA
 * Authoring Practices pattern. DOM focus stays in the text input and the
 * active option is announced with `aria-activedescendant`.
 *
 * Opens on focus, click and typing. Keys: Down and Up open and move (and wrap),
 * Home and End jump to the first and last option once one is active, Enter
 * picks the active option, Escape closes. Free text is always allowed, so the
 * parent owns the text and decides what a pick means. Filtering happens in the
 * parent, which passes the groups to show.
 */
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import clsx from "clsx";
import { highlightParts } from "@/lib/calendar-builder/courseSearch";

export type ComboboxOption = {
  id: string;
  /** Main line, searched and highlighted. */
  primary: string;
  /** Second line, such as the day, time and room. */
  secondary?: string;
  /** Short marker after the main line, such as "Added". */
  tag?: string;
};

export type ComboboxGroup = { id: string; label?: string; options: ComboboxOption[] };

export type ComboboxProps = {
  id: string;
  name: string;
  label: string;
  hint?: string;
  error?: string;
  optionalLabel?: string;
  value: string;
  onChange: (value: string) => void;
  groups: ComboboxGroup[];
  onSelect: (option: ComboboxOption) => void;
  /**
   * Called for Enter with no active option and when focus leaves, so the
   * parent can resolve text that exactly names an option. Enter is only
   * swallowed (kept from submitting the form) when this is given.
   */
  onCommit?: (via: "enter" | "blur") => void;
  /** Row shown when nothing matches. When absent, the list stays closed instead. */
  noMatches?: { title: string; hint: string };
  /** Announced as the list changes. */
  resultsStatus: (count: number) => string;
  /** Note under the options, such as "12 more, keep typing". */
  footer?: string;
  /** Text to highlight in options; defaults to `value`. */
  highlight?: string;
  placeholder?: string;
  autoCapitalize?: string;
  maxLength?: number;
  describedBy?: string;
};

function Highlight({ text, query }: { text: string; query: string }) {
  return (
    <>
      {highlightParts(text, query).map((part, index) =>
        part.match ? (
          <mark key={index} className="rounded-sm bg-warning-tint px-px font-bold text-ink">
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        )
      )}
    </>
  );
}

export default function Combobox({
  id,
  name,
  label,
  hint,
  error,
  optionalLabel,
  value,
  onChange,
  groups,
  onSelect,
  onCommit,
  noMatches,
  resultsStatus,
  footer,
  highlight,
  placeholder,
  autoCapitalize,
  maxLength,
  describedBy,
}: ComboboxProps) {
  const listId = `${id}-listbox`;
  const optionDomId = (optionId: string) => `${id}-opt-${optionId}`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const flat = useMemo(() => groups.flatMap((g) => g.options), [groups]);
  const empty = flat.length === 0;
  const hasPopup = flat.length > 0 || (empty && Boolean(noMatches));
  const expanded = open && hasPopup;
  const activeOption = expanded && active >= 0 ? flat[active] : undefined;

  useEffect(() => {
    if (!activeOption) return;
    document.getElementById(optionDomId(activeOption.id))?.scrollIntoView?.({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOption?.id]);

  function pick(option: ComboboxOption) {
    onSelect(option);
    setOpen(false);
    setActive(-1);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const last = flat.length - 1;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!expanded) {
          setOpen(true);
          setActive(flat.length > 0 ? 0 : -1);
        } else if (flat.length > 0) {
          setActive(active >= last ? 0 : active + 1);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!expanded) {
          setOpen(true);
          setActive(last);
        } else if (flat.length > 0) {
          setActive(active <= 0 ? last : active - 1);
        }
        break;
      case "Home":
        if (expanded && active >= 0) {
          event.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (expanded && active >= 0) {
          event.preventDefault();
          setActive(last);
        }
        break;
      case "Enter":
        if (activeOption) {
          event.preventDefault();
          pick(activeOption);
        } else if (onCommit) {
          event.preventDefault();
          setOpen(false);
          onCommit("enter");
        } else {
          setOpen(false);
        }
        break;
      case "Escape":
        if (expanded) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
          setActive(-1);
        }
        break;
    }
  }

  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const described = [hintId, errorId, describedBy].filter(Boolean).join(" ") || undefined;
  let optionIndex = -1;

  return (
    <div
      ref={rootRef}
      className="flex flex-col gap-1.5"
      onBlur={(event) => {
        if (rootRef.current?.contains(event.relatedTarget as Node | null)) return;
        setOpen(false);
        setActive(-1);
        onCommit?.("blur");
      }}
    >
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {optionalLabel ? (
          <span className="ml-1.5 font-normal text-muted">({optionalLabel})</span>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      <div className="relative">
        <input
          id={id}
          name={name}
          type="text"
          role="combobox"
          aria-expanded={expanded}
          aria-controls={expanded ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={activeOption ? optionDomId(activeOption.id) : undefined}
          aria-describedby={described}
          aria-invalid={error ? "true" : undefined}
          autoComplete="off"
          autoCapitalize={autoCapitalize}
          spellCheck={false}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={clsx(
            "focus-halo h-11 w-full rounded-md border bg-surface px-3.5 py-2.5 text-base text-ink placeholder:text-muted",
            error ? "border-error" : "border-input-border"
          )}
        />
        <div role="status" aria-live="polite" className="sr-only">
          {expanded ? (empty ? (noMatches?.title ?? "") : resultsStatus(flat.length)) : ""}
        </div>
        {expanded ? (
          <ul
            id={listId}
            role="listbox"
            aria-label={label}
            onMouseDown={(event) => event.preventDefault()}
            className="absolute top-full right-0 left-0 z-20 mt-1 max-h-72 overflow-y-auto rounded-md border border-line-strong bg-surface py-1 shadow-lg"
          >
            {empty && noMatches ? (
              <li
                role="option"
                aria-selected="false"
                aria-disabled="true"
                className="px-3.5 py-2.5"
              >
                <span className="block font-semibold text-ink">{noMatches.title}</span>
                <span className="block text-sm text-muted">{noMatches.hint}</span>
              </li>
            ) : (
              groups.map((group) => {
                const headingId = `${id}-group-${group.id}`;
                const items = group.options.map((option) => {
                  optionIndex += 1;
                  const index = optionIndex;
                  const isActive = index === active;
                  return (
                    <li
                      key={option.id}
                      id={optionDomId(option.id)}
                      role="option"
                      aria-selected={isActive}
                      onMouseMove={() => (isActive ? undefined : setActive(index))}
                      onClick={() => pick(option)}
                      className={clsx(
                        "flex cursor-pointer flex-col gap-0.5 border-l-4 px-3 py-2",
                        isActive ? "border-ink bg-sunken" : "border-transparent"
                      )}
                    >
                      <span className="flex flex-wrap items-baseline gap-x-2 text-[0.95rem] break-words text-ink">
                        <span>
                          <Highlight text={option.primary} query={highlight ?? value} />
                        </span>
                        {option.tag ? (
                          <span className="rounded-sm border border-line-strong px-1.5 text-xs font-semibold text-muted">
                            {option.tag}
                          </span>
                        ) : null}
                      </span>
                      {option.secondary ? (
                        <span className="text-sm text-muted">
                          <Highlight text={option.secondary} query={highlight ?? value} />
                        </span>
                      ) : null}
                    </li>
                  );
                });
                return group.label ? (
                  <li key={group.id} role="presentation">
                    <span
                      id={headingId}
                      className="block bg-sunken px-3.5 py-1.5 text-xs font-bold tracking-wide text-muted"
                    >
                      {group.label}
                    </span>
                    <ul role="group" aria-labelledby={headingId}>
                      {items}
                    </ul>
                  </li>
                ) : (
                  <li key={group.id} role="presentation">
                    <ul role="group" aria-label={label}>
                      {items}
                    </ul>
                  </li>
                );
              })
            )}
            {footer ? (
              <li role="presentation" className="px-3.5 py-2 text-sm text-muted">
                {footer}
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="flex items-center gap-1.5 text-sm font-medium text-error">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0">
            <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth={1.75} />
            <path d="M10 6.5v4.2" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
            <circle cx="10" cy="13.6" r="0.9" fill="currentColor" />
          </svg>
          {error}
        </p>
      ) : null}
    </div>
  );
}
