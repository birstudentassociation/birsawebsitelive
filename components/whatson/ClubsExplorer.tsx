"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import clsx from "clsx";

import Button from "@/components/bds/Button";
import { Text } from "@/components/bds/Type";
import ClubCard from "@/components/whatson/ClubCard";
import type { Locale } from "@/lib/i18n";
import { clubCategories, type ClubSummary, type ClubCategory } from "@/content/clubs/clubs";

/**
 * `/whats-on` (Wave 5, `components/whatson/`).
 *
 * Client-side search and category filter over the BIR club list on
 * `/whats-on/clubs`. Rebuilt from `components/clubs/ClubsExplorer.tsx` (not
 * owned by this wave) on bds `Button`/`Text` so no raw Tailwind font-size
 * utility survives (BUILD-BRIEF-2.0 §7, defect D7); the search input and
 * category radios keep the same accessible pattern as the 1.0 component,
 * including the `radiogroup` arrow-key navigation (WCAG 2.1.1 / 4.1.2).
 *
 * Progressive enhancement: the full, unfiltered club list is passed in
 * already server-rendered as plain `ClubCard`s, so with JavaScript off every
 * club is still visible; only the search box and category filter stop
 * narrowing the list.
 */
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
  clubs: ClubSummary[];
  locale: Locale;
  dict: ClubsExplorerDict;
};

const CATEGORY_ORDER: ClubCategory[] = ["academic", "sports", "arts", "community", "social"];

export default function ClubsExplorer({ clubs, locale, dict }: ClubsExplorerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ClubCategory | "all">("all");
  const searchId = useId();

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
      const matchesCategory = category === "all" || club.category === category;
      const matchesQuery =
        q.length === 0 ||
        club.title.toLowerCase().includes(q) ||
        club.tagline.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [clubs, query, category]);

  const hasFilters = query.trim().length > 0 || category !== "all";

  function clearFilters() {
    setQuery("");
    setCategory("all");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="max-w-sm">
          <label htmlFor={searchId} className="mb-1.5 block">
            <Text as="span" step="body-sm" className="font-semibold text-ink">
              {dict.search}
            </Text>
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dict.searchPlaceholder}
            className="focus-halo h-11 w-full rounded-md border border-input-border bg-surface px-3.5 py-2.5 text-ink placeholder:text-muted"
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
                "focus-halo rounded-full border px-3.5 py-2 font-semibold transition-colors",
                category === value
                  ? "border-brand bg-brand text-white"
                  : "border-input-border bg-surface text-ink hover:bg-sunken"
              )}
            >
              <Text as="span" step="body-sm">
                {label}
              </Text>
            </button>
          ))}
        </div>
      </div>

      <p role="status">
        <Text as="span" step="body-sm" className="text-muted">
          {dict.showing} {filtered.length} {filtered.length === 1 ? dict.result : dict.results}
        </Text>
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-line bg-sunken p-6">
          <Text step="body-sm" className="text-ink">
            {dict.noResults}
          </Text>
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
