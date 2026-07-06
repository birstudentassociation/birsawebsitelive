"use client";

import { useId, useMemo, useState } from "react";
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

        <div role="radiogroup" aria-label={dict.category} className="flex flex-wrap gap-2">
          <button
            type="button"
            role="radio"
            aria-checked={category === "all"}
            onClick={() => setCategory("all")}
            className={clsx(
              "focus-halo rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors",
              category === "all"
                ? "border-brand bg-brand text-white"
                : "border-line-strong bg-surface text-ink hover:bg-sunken"
            )}
          >
            {dict.allCategories}
          </button>
          {CATEGORY_ORDER.map((cat) => (
            <button
              key={cat}
              type="button"
              role="radio"
              aria-checked={category === cat}
              onClick={() => setCategory(cat)}
              className={clsx(
                "focus-halo rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors",
                category === cat
                  ? "border-brand bg-brand text-white"
                  : "border-line-strong bg-surface text-ink hover:bg-sunken"
              )}
            >
              {clubCategories[cat][locale]}
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
