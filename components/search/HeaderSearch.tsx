"use client";

/**
 * Header search toggle: the exact same icon link that used to sit in
 * `Header.tsx`, now progressively enhanced into a disclosure.
 *
 * Server-rendered and pre-hydration, this is nothing but `<Link href="/search"
 * aria-label="Search">` — clicking it navigates to the full `/search` page,
 * unchanged, whether or not JavaScript ever loads. Once hydrated, a plain
 * left-click is intercepted (`preventDefault`) and toggles an inline search
 * panel instead; a modified click (new tab, new window, middle-click) is left
 * alone and still navigates, because those are not `click` events this
 * handler even sees. This mirrors `HeaderNavClient`'s mobile-menu disclosure:
 * outside pointerdown and Escape both close it, Escape returns focus to the
 * toggle, and the panel is an absolutely-positioned overlay under the
 * (sticky, i.e. positioned) header so opening it can never resize or reflow
 * the header row itself.
 */
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import SearchBox from "@/components/search/SearchBox";

export type HeaderSearchProps = {
  locale: Locale;
  /** `localeHref(locale, "/search")`: the baseline destination and the
   * enhanced panel's form action alike. */
  href: string;
  /** dict.actions.search, the link's accessible name when the panel is closed. */
  label: string;
  /** dict.a11y.closeSearch, the accessible name once the panel is open. */
  closeLabel: string;
  /** SearchBox's visible label, e.g. dict.actions.searchPlaceholder. */
  searchLabel: string;
  placeholder: string;
  submitLabel: string;
};

export default function HeaderSearch({
  locale,
  href,
  label,
  closeLabel,
  searchLabel,
  placeholder,
  submitLabel,
}: HeaderSearchProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      // Modified or non-primary click: leave the native navigation alone.
      return;
    }
    event.preventDefault();
    setOpen((value) => !value);
  }

  return (
    <div className="shrink-0" ref={containerRef}>
      <Link
        ref={toggleRef}
        href={href}
        aria-label={open ? closeLabel : label}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={handleClick}
        className="focus-halo flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink hover:bg-sunken"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4.5 w-4.5 shrink-0">
          {open ? (
            <path
              d="m5 5 10 10M15 5 5 15"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
            />
          ) : (
            <>
              <circle cx="9" cy="9" r="6.25" fill="none" stroke="currentColor" strokeWidth={1.75} />
              <path
                d="m17 17-3.7-3.7"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
              />
            </>
          )}
        </svg>
      </Link>

      {open ? (
        <div id={panelId} className="absolute inset-x-0 top-full px-3 pb-3">
          <div className="ml-auto max-w-md rounded-lg border border-line bg-surface p-4 shadow-lg">
            <SearchBox
              locale={locale}
              labelText={searchLabel}
              placeholder={placeholder}
              submitLabel={submitLabel}
              action={href}
              autoFocus
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
