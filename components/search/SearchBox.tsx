"use client";

/**
 * ARIA 1.2 combobox typeahead wrapping a real `<form method="GET">`.
 *
 * With JavaScript disabled (or before hydration) this is nothing more than a
 * text input and a submit button: the browser's native GET navigation to
 * `action` is the whole search experience, and it is never blocked on
 * anything below. Everything else here — debounced fetching, the suggestion
 * list, and the keyboard/pointer handling around it — only ever *adds*
 * shortcuts on top of that baseline; it never intercepts Enter/submit in a
 * way that would leave a no-JS or slow-network reader stuck.
 *
 * Follows the "focus stays on the textbox" combobox pattern: suggestions are
 * `role="option"` rows that are never themselves focusable. The active one is
 * tracked by `aria-activedescendant` on the input, exactly like the
 * roving-selection idiom in `components/HeaderNavClient.tsx`'s mobile menu,
 * and closing on outside pointerdown / blur-out reuses that same pattern.
 */
import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import type { Suggestion } from "@/lib/search/query";
import Button from "@/components/Button";
import Tag from "@/components/Tag";
import { useDebouncedValue } from "@/lib/useDebouncedValue";

export type SearchBoxProps = {
  locale: Locale;
  defaultValue?: string;
  labelText: string;
  placeholder: string;
  submitLabel: string;
  /** Where the plain-GET form submits, e.g. `localeHref(locale, "/search")`. */
  action: string;
  /** Base id for the input; suggestion ids and the listbox id derive from it. */
  id?: string;
  autoFocus?: boolean;
};

const DEBOUNCE_MS = 180;

const suggestionCount: Record<Locale, (count: number) => string> = {
  en: (count) => `${count} suggestion${count === 1 ? "" : "s"}`,
  th: (count) => `คำแนะนำ ${count} รายการ`,
};

export default function SearchBox({
  locale,
  defaultValue = "",
  labelText,
  placeholder,
  submitLabel,
  action,
  id,
  autoFocus,
}: SearchBoxProps) {
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounced = useDebouncedValue(value, DEBOUNCE_MS);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const autoId = useId();
  const inputId = id ?? `search-${autoId}`;
  const listboxId = `${inputId}-listbox`;
  const optionId = (index: number) => `${inputId}-option-${index}`;

  // Fetch suggestions for the debounced value. The cleanup aborts this fetch
  // the moment a newer keystroke replaces it, so a slow response for an
  // earlier, shorter query can never land after (and overwrite) a fresher one.
  useEffect(() => {
    const trimmed = debounced.trim();
    if (trimmed.length === 0) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const controller = new AbortController();

    fetch(`/api/search?q=${encodeURIComponent(trimmed)}&locale=${locale}`, {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : { ok: false }))
      .then((data: { ok: boolean; suggestions?: Suggestion[] }) => {
        const next = data.ok && data.suggestions ? data.suggestions : [];
        setSuggestions(next);
        setActiveIndex(-1);
        setOpen(next.length > 0);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSuggestions([]);
        setOpen(false);
      });

    return () => controller.abort();
  }, [debounced, locale]);

  // Outside pointerdown closes the list, mirroring HeaderNavClient's mobile
  // menu: a pointer press anywhere but the widget dismisses it.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function closeList() {
    setOpen(false);
    setActiveIndex(-1);
  }

  // Blur-out: React's onBlur bubbles from any descendant, so this fires
  // whenever focus leaves the input for something other than an option click
  // (those are protected below by preventing the mousedown that would blur
  // the input in the first place). `relatedTarget` is the element about to
  // receive focus; if it's outside this widget, close.
  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget as Node | null;
    if (!next || !containerRef.current?.contains(next)) {
      closeList();
    }
  }

  function goTo(href: string) {
    closeList();
    router.push(href);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      if (suggestions.length === 0) return;
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => (current + 1) % suggestions.length);
      return;
    }
    if (event.key === "ArrowUp") {
      if (suggestions.length === 0) return;
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => (current <= 0 ? suggestions.length - 1 : current - 1));
      return;
    }
    if (event.key === "Enter") {
      if (open && activeIndex >= 0) {
        const active = suggestions[activeIndex];
        if (active) {
          event.preventDefault();
          goTo(active.href);
        }
      }
      // Otherwise: fall through and let the form submit as plain GET.
      return;
    }
    if (event.key === "Escape" && open) {
      // Close without clearing the input or moving focus away from it.
      event.preventDefault();
      closeList();
    }
  }

  const activeId = activeIndex >= 0 ? optionId(activeIndex) : undefined;

  return (
    <div ref={containerRef} onBlur={handleBlur} className="flex flex-col gap-1.5">
      <form
        method="GET"
        action={action}
        role="search"
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="relative flex max-w-sm flex-1 flex-col gap-1.5">
          <label htmlFor={inputId} className="text-ink text-sm font-semibold">
            {labelText}
          </label>
          <input
            id={inputId}
            type="search"
            name="q"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={activeId}
            autoComplete="off"
            autoFocus={autoFocus}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setOpen(true);
            }}
            placeholder={placeholder}
            className="focus-halo border-input-border bg-surface text-ink placeholder:text-muted h-11 w-full rounded-md border px-3.5 py-2.5 text-[0.95rem]"
          />

          {open ? (
            <ul
              id={listboxId}
              role="listbox"
              aria-label={labelText}
              // Prevents the input from blurring when a suggestion is
              // pressed, so the click below always lands before any
              // outside-blur handler could close the list first.
              onMouseDown={(event) => event.preventDefault()}
              className="border-line bg-surface absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-md border shadow-lg"
            >
              {suggestions.map((suggestion, index) => (
                <li
                  // Not keyed by href alone: several documents can share a
                  // destination (every committee member points at the roster
                  // page), and duplicate keys would make React reuse the
                  // wrong row.
                  key={`${suggestion.href}-${suggestion.title}`}
                  id={optionId(index)}
                  role="option"
                  aria-selected={index === activeIndex}
                  onClick={() => goTo(suggestion.href)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex cursor-pointer items-center justify-between gap-3 px-3.5 py-2.5 text-sm ${
                    index === activeIndex ? "bg-sunken" : ""
                  }`}
                >
                  <span className="text-ink truncate">{suggestion.title}</span>
                  <Tag className="shrink-0">{suggestion.sectionLabel}</Tag>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <Button type="submit">{submitLabel}</Button>
      </form>

      <span role="status" className="sr-only">
        {open ? suggestionCount[locale](suggestions.length) : ""}
      </span>
    </div>
  );
}
