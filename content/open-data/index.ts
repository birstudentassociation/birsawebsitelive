/**
 * Open data editions. An edition is one academic year's figures, published
 * once and never changed; a later year is a new edition beside it. Each topic
 * file under an edition's folder holds the rows for one page.
 */
import type { Edition, Topic } from "@/lib/open-data";
import { money } from "./2025-26/money";
import { activities } from "./2025-26/activities";
import { meetings } from "./2025-26/meetings";
import { people } from "./2025-26/people";
import { clubs } from "./2025-26/clubs";

export const edition2025: Edition = {
  slug: "2025-26",
  label: { en: "2025 to 2026", th: "ปีการศึกษา 2568" },
  published: "2026-11-07",
  topics: [money, activities, meetings, people, clubs],
};

/** Newest first. */
export const editions: Edition[] = [edition2025];

export function getEdition(slug: string): Edition | undefined {
  return editions.find((e) => e.slug === slug);
}

export function getTopic(edition: Edition, slug: string): Topic | undefined {
  return edition.topics.find((t) => t.slug === slug);
}
