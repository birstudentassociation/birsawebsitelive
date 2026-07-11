"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import clsx from "clsx";
import Button from "@/components/Button";
import ClubCard from "@/components/clubs/ClubCard";
import type { Locale } from "@/lib/i18n";
import { clubCategories, type Club, type ClubCategory } from "@/content/clubs/clubs";

export type ClubsExplorerDict = {
  search: string;
  searchPlaceholder: string;
  category: string;
  allCategories: string;
  showing: string;
  result: string;
  results: string;
  noResults: string;
  clearFilters: string;
  openToJoin: string;
};

export type ClubsExplorerProps = {
  clubs: Club[];
  locale: Locale;
  dict: ClubsExplorerDict;
};

const CATEGORY_ORDER: ClubCategory[] = ["academic", "sports", "arts", "community", "social"];

/**
 * Client-side search + category filter over the full club list. The list is
 * passed in fully rendered/serialisable; this component only narrows what's
 * shown, so the page still works (full list visible) with JS disabled since
 * this whole component is progressive enhancement over server-rendered data.
 */
export default function ClubsExplorer({ clubs, locale, dict }: ClubsExplorerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ClubCategory | "all">("all");
  const searchId = useId();

  // A `radiogroup` is a single tab stop with arrow-key navigation between the
  // radios (WCAG 2.1.1 / 4.1.2), mirroring the officer console's ItemsManager.
  const categoryOptions: [ClubCategory | "all", string][] = [
    ["all", dict.allCategories],
    ...CATEGORY_ORDER.map((cat) => [cat, clubCategories[cat][locale]] as [ClubCategory, string]),
  ];
  const categoryButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleCategoryKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = categoryOptions.findIndex(([value]) => value === category);
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % categoryOptions.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + categoryOptions.length) % categoryOptions.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = categoryOptions.length - 1;
    }
    const nextOption = nextIndex !== null ? categoryOptions[nextIndex] : undefined;
    if (nextIndex !== null && nextOption) {
      event.preventDefault();
      setCategory(nextOption[0]);
      categoryButtonRefs.current[nextIndex]?.focus();
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clubs.filter((club) => {
      const content = club[locale];
      const matchesCategory = category === "all" || club.category === category;
      const matchesQuery =
        q.length === 0 ||
        content.name.toLowerCase().includes(q) ||
        content.tagline.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [clubs, locale, query, category]);

  const hasFilters = query.trim().length > 0 || category !== "all";

  function clearFilters() {
    setQuery("");
    setCategory("all");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="max-w-sm">
          <label htmlFor={searchId} className="text-ink mb-1.5 block text-sm font-semibold">
            {dict.search}
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dict.searchPlaceholder}
            className="focus-halo border-input-border bg-surface text-ink placeholder:text-muted h-11 w-full rounded-md border px-3.5 py-2.5 text-[0.95rem]"
          />
        </div>

        <div
          role="radiogroup"
          aria-label={dict.category}
          className="flex flex-wrap gap-2"
          onKeyDown={handleCategoryKeyDown}
        >
          {categoryOptions.map(([value, label], index) => (
            <button
              key={value}
              ref={(el) => {
                categoryButtonRefs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={category === value}
              tabIndex={category === value ? 0 : -1}
              onClick={() => setCategory(value)}
              className={clsx(
                "focus-halo rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors",
                category === value
                  ? "border-brand bg-brand text-white"
                  : "border-line-strong bg-surface text-ink hover:bg-sunken"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p role="status" className="text-muted text-sm">
        {dict.showing} {filtered.length} {filtered.length === 1 ? dict.result : dict.results}
      </p>

      {filtered.length === 0 ? (
        <div className="border-line bg-sunken flex flex-col items-start gap-3 rounded-lg border p-6">
          <p className="text-ink text-sm">{dict.noResults}</p>
          <Button variant="secondary" onClick={clearFilters}>
            {dict.clearFilters}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((club) => (
            <ClubCard key={club.slug} club={club} locale={locale} openLabel={dict.openToJoin} />
          ))}
        </div>
      )}

      {hasFilters && filtered.length > 0 ? (
        <div>
          <Button variant="secondary" onClick={clearFilters}>
            {dict.clearFilters}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
