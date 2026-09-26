/**
 * Pure matching behind `components/emergency/DistrictFinder.tsx`, kept free of
 * React so it can be tested directly. People type district names in English
 * or Thai, with or without spaces, with "khet" or "เขต" in front, and in older
 * romanisations such as "Ladprao" or "Sathorn"; all of them should land on the
 * same district.
 */
import type { BangkokDistrict } from "@/content/emergency/types";

/**
 * Lowercased, with "khet"/"เขต"/"district" and everything but letters and
 * digits removed, then folded so common romanisations meet: aspirated
 * consonants lose their h, d and t merge, doubled vowels collapse and
 * repeated letters are squeezed. Thai text passes through the first steps
 * only, since none of the folds touch Thai letters.
 */
export function normaliseDistrict(query: string): string {
  return query
    .toLowerCase()
    .normalize("NFC")
    .replace(/เขต|khet|district/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "")
    .replace(/ฏ/g, "ฎ")
    .replace(/ph/g, "p")
    .replace(/th/g, "t")
    .replace(/kh/g, "k")
    .replace(/tch|ch|j/g, "c")
    .replace(/d/g, "t")
    .replace(/ee|ea/g, "i")
    .replace(/oo|ou/g, "u")
    .replace(/ey/g, "ei")
    .replace(/ay/g, "ai")
    .replace(/(\p{L})\1+/gu, "$1");
}

function keys(district: BangkokDistrict): string[] {
  return [district.name.en, district.name.th, ...(district.aliases ?? [])].map(normaliseDistrict);
}

/**
 * Districts whose name or alias contains the query, best first: exact matches,
 * then names that start with the query, then the rest, each group in the order
 * given. An empty query returns every district.
 */
export function matchDistricts<D extends BangkokDistrict>(districts: D[], query: string): D[] {
  const q = normaliseDistrict(query);
  if (q === "") return districts;
  const ranked = districts
    .map((district, index) => {
      const k = keys(district);
      const rank = k.some((key) => key === q)
        ? 0
        : k.some((key) => key.startsWith(q))
          ? 1
          : k.some((key) => key.includes(q))
            ? 2
            : 3;
      return { district, index, rank };
    })
    .filter((row) => row.rank < 3);
  ranked.sort((a, b) => a.rank - b.rank || a.index - b.index);
  return ranked.map((row) => row.district);
}

/**
 * The one district the text means, or null: an exact name or alias, or the
 * only district the text matches at all.
 */
export function resolveDistrict<D extends BangkokDistrict>(
  districts: D[],
  query: string
): D | null {
  const q = normaliseDistrict(query);
  if (q === "") return null;
  const exact = districts.find((district) => keys(district).includes(q));
  if (exact) return exact;
  const matches = matchDistricts(districts, query);
  return matches.length === 1 ? matches[0]! : null;
}
