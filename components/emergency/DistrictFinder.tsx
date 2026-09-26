"use client";

/**
 * A district search inside an emergency guide section: type a district's name
 * in English or Thai, or open the list and pick one, and only that district's
 * sandbag points, shelters or parking are shown. Every finder on the page
 * shares one choice, so picking a district in the shelters section also
 * answers the sandbags section, and the choice is remembered on this device.
 *
 * The combobox follows `components/forms/CourseCombobox.tsx` (ARIA 1.2,
 * list autocomplete). Without JavaScript, and in the server render, every
 * district is listed in collapsed panels instead, so nothing is lost.
 */
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import clsx from "clsx";
import type { BangkokDistrict, DistrictHelpKind, DistrictPlace } from "@/content/emergency/types";
import type { Locale } from "@/lib/i18n";
import { matchDistricts, resolveDistrict } from "@/lib/emergency-districts";

export type DistrictFinderLabels = {
  label: string;
  hint: string;
  placeholder: string;
  toggle: string;
  clear: string;
  noMatches: string;
  /** Contains "{n}". */
  results: string;
  office: string;
  source: string;
  kinds: Record<DistrictHelpKind, string>;
  none: Record<DistrictHelpKind, string>;
  newTab: string;
};

type Props = {
  locale: Locale;
  districts: BangkokDistrict[];
  kinds: DistrictHelpKind[];
  prompt: string;
  labels: DistrictFinderLabels;
};

const STORAGE_KEY = "emergency-district";
const listeners = new Set<() => void>();
let chosen: string | null = null;
let loaded = false;

function readChoice(): string | null {
  if (!loaded) {
    loaded = true;
    try {
      chosen = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      chosen = null;
    }
  }
  return chosen;
}

function setChoice(id: string | null) {
  chosen = id;
  try {
    if (id) window.localStorage.setItem(STORAGE_KEY, id);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Private windows and blocked storage still work for this page view.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function telHref(phone: string) {
  return `tel:${phone.replace(/\D/g, "")}`;
}

function optionLabel(district: BangkokDistrict, locale: Locale) {
  const other = locale === "en" ? "th" : "en";
  return `${district.name[locale]} (${district.name[other]})`;
}

export default function DistrictFinder({ locale, districts: given, kinds, prompt, labels }: Props) {
  const id = useId();
  const districts = useMemo(
    () => [...given].sort((a, b) => a.name[locale].localeCompare(b.name[locale], locale)),
    [given, locale]
  );
  const [enhanced, setEnhanced] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setEnhanced(true), []);

  const choiceId = useSyncExternalStore(subscribe, readChoice, () => null);
  const selected = districts.find((district) => district.id === choiceId) ?? null;

  const [text, setText] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const shown = text ?? (selected ? optionLabel(selected, locale) : "");
  const query = selected && shown === optionLabel(selected, locale) ? "" : shown;
  const options = matchDistricts(districts, query);

  const inputId = `${id}-input`;
  const listboxId = `${id}-listbox`;
  const hintId = `${id}-hint`;
  const statusId = `${id}-status`;
  const optionId = (index: number) => `${id}-option-${index}`;

  function close() {
    setOpen(false);
    setActiveIndex(-1);
  }

  function choose(district: BangkokDistrict) {
    setChoice(district.id);
    setText(null);
    close();
  }

  function commit() {
    if (text === null) return close();
    if (text.trim() === "") {
      setChoice(null);
      setText(null);
      return close();
    }
    const resolved = resolveDistrict(districts, text);
    if (resolved) choose(resolved);
    else close();
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget as Node | null;
    if (!next || !containerRef.current?.contains(next)) commit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (options.length === 0) return;
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) =>
        event.key === "ArrowDown"
          ? (current + 1) % options.length
          : current <= 0
            ? options.length - 1
            : current - 1
      );
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const active = open && activeIndex >= 0 ? options[activeIndex] : undefined;
      if (active) choose(active);
      else commit();
      return;
    }
    if (event.key === "Escape" && open) {
      event.preventDefault();
      close();
    }
  }

  if (!enhanced) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted">{prompt}</p>
        <ul className="flex flex-col gap-2">
          {districts.map((district) => (
            <li key={district.id}>
              <details className="group rounded-md border border-line bg-surface text-ink">
                <summary className="focus-halo flex cursor-pointer list-none items-center justify-between gap-3 rounded-md px-4 py-3 marker:content-none [&::-webkit-details-marker]:hidden">
                  <h3 className="font-semibold">{optionLabel(district, locale)}</h3>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-muted transition-transform group-open:rotate-180"
                  >
                    &darr;
                  </span>
                </summary>
                <div className="border-t border-line px-4 py-3">
                  <DistrictResult
                    district={district}
                    kinds={kinds}
                    locale={locale}
                    labels={labels}
                    headingLevel="h4"
                  />
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const activeId = open && activeIndex >= 0 ? optionId(activeIndex) : undefined;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-line bg-sunken p-4">
      <div ref={containerRef} onBlur={handleBlur} className="relative flex flex-col gap-1.5">
        <label htmlFor={inputId} className="font-semibold text-ink">
          {labels.label}
        </label>
        <p id={hintId} className="text-sm text-muted">
          {labels.hint}
        </p>
        <div className="relative flex items-center">
          <input
            id={inputId}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={activeId}
            aria-describedby={`${hintId} ${statusId}`}
            autoComplete="off"
            enterKeyHint="search"
            value={shown}
            placeholder={labels.placeholder}
            onChange={(event) => {
              setText(event.target.value);
              setOpen(true);
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpen(true)}
            className="focus-halo h-11 w-full rounded-md border border-input-border bg-surface py-2.5 pr-20 pl-3.5 text-[0.95rem] text-ink placeholder:text-muted"
          />
          <div className="absolute right-1 flex items-center">
            {shown !== "" ? (
              <button
                type="button"
                onClick={() => {
                  setChoice(null);
                  setText("");
                  setOpen(true);
                  setActiveIndex(-1);
                }}
                aria-label={labels.clear}
                className="focus-halo grid h-9 w-9 place-items-center rounded-md text-muted hover:text-ink"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            ) : null}
            <button
              type="button"
              tabIndex={-1}
              aria-label={labels.toggle}
              aria-controls={listboxId}
              aria-expanded={open}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                if (open) close();
                else {
                  setOpen(true);
                  document.getElementById(inputId)?.focus();
                }
              }}
              className="grid h-9 w-9 place-items-center rounded-md text-muted hover:text-ink"
            >
              <span
                aria-hidden="true"
                className={clsx("transition-transform", open && "rotate-180")}
              >
                &#9662;
              </span>
            </button>
          </div>
        </div>
        <p id={statusId} role="status" className="sr-only">
          {open ? labels.results.replace("{n}", String(options.length)) : ""}
        </p>
        {open ? (
          <ul
            id={listboxId}
            role="listbox"
            aria-label={labels.label}
            onMouseDown={(event) => event.preventDefault()}
            className="absolute inset-x-0 top-full z-10 mt-1 max-h-72 overflow-y-auto rounded-md border border-line bg-surface shadow-lg"
          >
            {options.length === 0 ? (
              <li className="px-3.5 py-2.5 text-sm text-muted">{labels.noMatches}</li>
            ) : (
              options.map((district, index) => (
                <li
                  key={district.id}
                  id={optionId(index)}
                  role="option"
                  aria-selected={index === activeIndex}
                  onClick={() => choose(district)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={clsx(
                    "cursor-pointer px-3.5 py-2.5 text-sm text-ink",
                    index === activeIndex && "bg-sunken"
                  )}
                >
                  {optionLabel(district, locale)}
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>

      <div aria-live="polite">
        {selected ? (
          <DistrictResult
            district={selected}
            kinds={kinds}
            locale={locale}
            labels={labels}
            headingLevel="h3"
          />
        ) : (
          <p className="text-sm text-muted">{prompt}</p>
        )}
      </div>
    </div>
  );
}

function DistrictResult({
  district,
  kinds,
  locale,
  labels,
  headingLevel,
}: {
  district: BangkokDistrict;
  kinds: DistrictHelpKind[];
  locale: Locale;
  labels: DistrictFinderLabels;
  headingLevel: "h3" | "h4";
}) {
  const Heading = headingLevel;
  return (
    <div className="flex flex-col gap-4 text-ink">
      {district.officePhone ? (
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span>{labels.office}</span>
          <a
            href={telHref(district.officePhone)}
            className="font-semibold text-brand-deep tabular-nums underline"
          >
            {district.officePhone}
          </a>
        </p>
      ) : null}
      {kinds.map((kind) => (
        <section key={kind} className="flex flex-col gap-2">
          <Heading className="font-semibold">
            {labels.kinds[kind]}, {district.name[locale]}
          </Heading>
          {district[kind].length === 0 ? (
            <p className="text-sm text-muted">{labels.none[kind]}</p>
          ) : (
            <ul className="flex flex-col gap-3 leading-relaxed">
              {district[kind].map((place) => (
                <Place key={place.name.en} place={place} locale={locale} labels={labels} />
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}

function Place({
  place,
  locale,
  labels,
}: {
  place: DistrictPlace;
  locale: Locale;
  labels: DistrictFinderLabels;
}) {
  return (
    <li className="flex flex-col rounded-md border border-line bg-surface px-3 py-2">
      <span>{place.name[locale]}</span>
      {place.detail ? <span className="text-sm text-muted">{place.detail[locale]}</span> : null}
      {place.phone ? (
        <a
          href={telHref(place.phone)}
          className="self-start font-semibold text-brand-deep tabular-nums underline"
        >
          {place.phone}
        </a>
      ) : null}
      <a
        href={place.source}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start text-xs text-muted underline hover:text-brand-deep"
      >
        {labels.source}
        <span className="sr-only"> ({labels.newTab})</span>
      </a>
    </li>
  );
}
