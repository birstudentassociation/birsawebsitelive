"use client";

/**
 * Header search toggle, progressively enhanced into a disclosure.
 *
 * This is `components/bds/Header.tsx`'s `searchSlot`: `docs/ROUTE-MAP-2.0.md`
 * keeps search a header utility, but the manifest's navigation cluster never
 * carried a `bds/` search component, so `Header` left the slot for whichever
 * wave built one (REDESIGN-2.0 Wave 5F). `app/[lang]/layout.tsx` still needs
 * a one-line wire-up, `<Header locale={locale} searchSlot={<HeaderSearch ... />} />`,
 * which is outside this wave's owned paths (see the wave report).
 *
 * Server-rendered and pre-hydration, this is nothing but `<Link href="/search"
 * aria-label="Search">` — clicking it navigates to the full `/search` page,
 * unchanged, whether or not JavaScript ever loads. Once hydrated, a plain
 * left-click is intercepted (`preventDefault`) and toggles an inline search
 * panel instead; a modified click (new tab, new window, middle-click) is left
 * alone and still navigates, because those are not `click` events this
 * handler even sees. This mirrors `Header`'s own mobile-menu disclosure:
 * outside pointerdown and Escape both close it, Escape returns focus to the
 * toggle, and the panel is an absolutely-positioned overlay under the
 * (sticky, i.e. positioned) header so opening it can never resize or reflow
 * the header row itself.
 */
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import Icon from "@/components/bds/Icon";
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
        className="focus-halo flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-input-border text-ink hover:bg-sunken"
      >
        <Icon name={open ? "close" : "search"} />
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
