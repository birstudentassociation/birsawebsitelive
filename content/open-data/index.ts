/**
 * Open data editions. An edition is one academic year's figures, published
 * once and never changed; a later year is a new edition beside it. Each
 * edition lives in its own folder, with one topic file per page and an
 * `index.ts` that assembles them.
 */
import type { Edition, Topic } from "@/lib/open-data";
import { edition2021 } from "./2021-22";
import { edition2022 } from "./2022-23";
import { edition2023 } from "./2023-24";
import { edition2024 } from "./2024-25";
import { edition2025 } from "./2025-26";

/** Newest first. */
export const editions: Edition[] = [
  edition2025,
  edition2024,
  edition2023,
  edition2022,
  edition2021,
];

export function getEdition(slug: string): Edition | undefined {
  return editions.find((e) => e.slug === slug);
}

export function getTopic(edition: Edition, slug: string): Topic | undefined {
  return edition.topics.find((t) => t.slug === slug);
}
